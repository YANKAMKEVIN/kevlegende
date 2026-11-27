// Exploration : collisions, déplacement case par case, portes, déclencheurs, rencontres, interactions.
import type { Jeu } from '../game';
import { Rng } from '../rng';
import { DIR_VEC, type Dir } from '../types';
import { lancerEvenement } from '../story/runner';
import { ancre, casesProp, cle, condVraie, dansCarte, tuile, type CarteCompilee, type Pos } from './map';
import type { PnjDef, PropDef } from './mapdef';

export interface PnjPlace {
  def: PnjDef;
  x: number;
  y: number;
}

export function pnjVisibles(j: Jeu, c: CarteCompilee = j.carte()): PnjPlace[] {
  return (c.def.pnj ?? []).filter((n) => condVraie(n.si, j.p.flags)).map((n) => ({ def: n, ...ancre(c, n.ancre) }));
}

export function propsVisibles(j: Jeu, c: CarteCompilee = j.carte()): PropDef[] {
  return (c.def.props ?? []).filter((p) => condVraie(p.si, j.p.flags));
}

/** Ensemble des cases bloquées par des décors ou des personnages (hors tuiles). */
export function obstacles(j: Jeu, c: CarteCompilee = j.carte()): Set<string> {
  const s = new Set<string>();
  for (const p of propsVisibles(j, c)) if (p.solide !== false) for (const q of casesProp(c, p)) s.add(cle(q.x, q.y));
  for (const n of pnjVisibles(j, c)) s.add(cle(n.x, n.y));
  for (const co of c.def.coffres ?? []) {
    const q = ancre(c, co.ancre);
    s.add(cle(q.x, q.y));
  }
  // Les portes restent toujours franchissables (porte d'une maison posée sur sa façade).
  for (const po of c.def.portes ?? []) {
    const q = ancre(c, po.ancre);
    s.delete(cle(q.x, q.y));
  }
  return s;
}

export function franchissable(j: Jeu, x: number, y: number, obs: Set<string> = obstacles(j)): boolean {
  const c = j.carte();
  if (!dansCarte(c, x, y)) return false;
  const estPorte = (c.def.portes ?? []).some((po) => {
    const q = ancre(c, po.ancre);
    return q.x === x && q.y === y;
  });
  if (estPorte) return true;
  return tuile(c, x, y).passable && !obs.has(cle(x, y));
}

export function surPorte(j: Jeu): boolean {
  const c = j.carte();
  return (c.def.portes ?? []).some((po) => {
    const q = ancre(c, po.ancre);
    return q.x === j.p.x && q.y === j.p.y;
  });
}

export type ResultatPas = 'bloque' | 'avance' | 'porte' | 'evenement' | 'rencontre' | 'occupe';

export function deplacer(j: Jeu, dir: Dir): ResultatPas {
  if (j.mode !== 'exploration') return 'occupe';
  const p = j.p;
  p.dir = dir;
  const [dx, dy] = DIR_VEC[dir];
  const nx = p.x + dx;
  const ny = p.y + dy;
  if (!franchissable(j, nx, ny)) return 'bloque';
  p.x = nx;
  p.y = ny;
  p.pas++;
  return apresPas(j);
}

function apresPas(j: Jeu): ResultatPas {
  const c = j.carte();
  const p = j.p;
  for (const po of c.def.portes ?? []) {
    const q = ancre(c, po.ancre);
    if (q.x !== p.x || q.y !== p.y) continue;
    if (condVraie(po.si, p.flags)) {
      j.teleporter(po.vers, po.arrivee, po.dir);
      return declencheurs(j) ? 'evenement' : 'porte';
    }
    if (po.sinon) {
      // Recule d'une case pour ne pas rester sur la porte.
      const [dx, dy] = DIR_VEC[p.dir];
      p.x -= dx;
      p.y -= dy;
      lancerEvenement(j, po.sinon);
      return 'evenement';
    }
  }
  if (declencheurs(j)) return 'evenement';
  const r = c.def.rencontres;
  if (r && tuile(c, p.x, p.y).rencontres && !p.flags['debug_sans_rencontre']) {
    p.pasRencontre++;
    const rng = new Rng(1);
    rng.state = p.rng;
    const declenche = p.pasRencontre > 5 && rng.chance(r.taux);
    const groupe = declenche ? rng.weighted(r.groupes, (g) => g.poids) : null;
    p.rng = rng.state;
    if (groupe) {
      p.pasRencontre = 0;
      j.demarrerCombat(groupe.ennemis, { fuite: true, defaiteOk: false });
      return 'rencontre';
    }
  }
  return 'avance';
}

/** Lance l'événement d'un déclencheur actif sous le joueur, s'il y en a un. */
function declencheurs(j: Jeu): boolean {
  const c = j.carte();
  const p = j.p;
  for (const d of c.def.declencheurs ?? []) {
    const q = ancre(c, d.ancre);
    if (p.x < q.x || p.y < q.y || p.x >= q.x + (d.w ?? 1) || p.y >= q.y + (d.h ?? 1)) continue;
    if (!condVraie(d.si, p.flags)) continue;
    lancerEvenement(j, d.evenement);
    return true;
  }
  return false;
}

/** Case située devant le joueur. */
export function devant(j: Jeu): Pos {
  const [dx, dy] = DIR_VEC[j.p.dir];
  return { x: j.p.x + dx, y: j.p.y + dy };
}

export type ResultatInteraction = 'rien' | 'pnj' | 'coffre' | 'decor';

export function interagir(j: Jeu): ResultatInteraction {
  if (j.mode !== 'exploration') return 'rien';
  const c = j.carte();
  const { x, y } = devant(j);
  const pnj = pnjVisibles(j, c).find((n) => n.x === x && n.y === y);
  if (pnj) {
    j.regards[pnj.def.id] = inverse(j.p.dir);
    lancerEvenement(j, pnj.def.evenement);
    return 'pnj';
  }
  const co = (c.def.coffres ?? []).find((k) => {
    const q = ancre(c, k.ancre);
    return q.x === x && q.y === y;
  });
  if (co) {
    const id = `${c.def.id}:${co.id}`;
    if (j.p.coffres.includes(id)) return 'rien';
    j.p.coffres.push(id);
    j.p.flags[`coffre:${id}`] = true;
    j.ouvrirCoffre(co);
    return 'coffre';
  }
  for (const pr of propsVisibles(j, c)) {
    if (!pr.evenement) continue;
    if (casesProp(c, pr).some((q) => q.x === x && q.y === y)) {
      lancerEvenement(j, pr.evenement);
      return 'decor';
    }
  }
  return 'rien';
}

export const inverse = (d: Dir): Dir => (d === 'haut' ? 'bas' : d === 'bas' ? 'haut' : d === 'gauche' ? 'droite' : 'gauche');
