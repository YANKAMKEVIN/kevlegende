// Navigation du bot : plus court chemin sur une carte, puis enchaînement des portes entre cartes.
import type { Jeu } from '../core/game';
import { DIR_VEC, DIRS, type Dir } from '../core/types';
import { franchissable, obstacles } from '../core/world/explore';
import { ancre, cle, condVraie, type Pos } from '../core/world/map';

/** Chemin (liste de directions) vers une des cases `buts` sur la carte courante, ou null. */
export function chemin(j: Jeu, buts: readonly Pos[], eviterPortes = true): Dir[] | null {
  const c = j.carte();
  const obs = obstacles(j, c);
  const portes = new Set((c.def.portes ?? []).map((p) => cle(ancre(c, p.ancre).x, ancre(c, p.ancre).y)));
  const butSet = new Set(buts.map((b) => cle(b.x, b.y)));
  // Cases de déclencheurs actifs : à éviter sauf si elles sont le but (on ne lance pas une scène par mégarde).
  const pieges = new Set<string>();
  for (const d of c.def.declencheurs ?? []) {
    if (!condVraie(d.si, j.p.flags)) continue;
    const o = ancre(c, d.ancre);
    for (let dy = 0; dy < (d.h ?? 1); dy++) for (let dx = 0; dx < (d.w ?? 1); dx++) pieges.add(cle(o.x + dx, o.y + dy));
  }
  const depart = cle(j.p.x, j.p.y);
  if (butSet.has(depart)) return [];
  const prec = new Map<string, { de: string; dir: Dir }>();
  const file: Pos[] = [{ x: j.p.x, y: j.p.y }];
  const vu = new Set([depart]);
  while (file.length) {
    const p = file.shift()!;
    for (const d of DIRS) {
      const [dx, dy] = DIR_VEC[d];
      const x = p.x + dx;
      const y = p.y + dy;
      const k = cle(x, y);
      if (vu.has(k) || !franchissable(j, x, y, obs)) continue;
      // On ne traverse pas une porte par accident (sauf si c'est le but).
      if (eviterPortes && portes.has(k) && !butSet.has(k)) continue;
      if (pieges.has(k) && !butSet.has(k)) continue;
      vu.add(k);
      prec.set(k, { de: cle(p.x, p.y), dir: d });
      if (butSet.has(k)) return reconstruire(prec, depart, k);
      file.push({ x, y });
    }
  }
  return null;
}

function reconstruire(prec: Map<string, { de: string; dir: Dir }>, depart: string, fin: string): Dir[] {
  const out: Dir[] = [];
  let k = fin;
  while (k !== depart) {
    const e = prec.get(k)!;
    out.push(e.dir);
    k = e.de;
  }
  return out.reverse();
}

/** Suite de portes (carte, ancre de porte) pour aller de la carte courante à `cible`. */
export function routeCartes(j: Jeu, cible: string): { carte: string; porte: string }[] | null {
  if (j.p.carte === cible) return [];
  const prec = new Map<string, { de: string; porte: string }>();
  const file = [j.p.carte];
  const vu = new Set(file);
  while (file.length) {
    const id = file.shift()!;
    for (const po of j.monde.cartes[id]?.portes ?? []) {
      if (vu.has(po.vers) || !condVraie(po.si, j.p.flags)) continue;
      vu.add(po.vers);
      prec.set(po.vers, { de: id, porte: po.ancre });
      if (po.vers === cible) {
        const out: { carte: string; porte: string }[] = [];
        let k = cible;
        while (k !== j.p.carte) {
          const e = prec.get(k)!;
          out.push({ carte: e.de, porte: e.porte });
          k = e.de;
        }
        return out.reverse();
      }
      file.push(po.vers);
    }
  }
  return null;
}

export const voisins = (p: Pos): Pos[] => DIRS.map((d) => ({ x: p.x + DIR_VEC[d][0], y: p.y + DIR_VEC[d][1] }));

export function directionVers(de: Pos, a: Pos): Dir {
  if (a.x > de.x) return 'droite';
  if (a.x < de.x) return 'gauche';
  if (a.y > de.y) return 'bas';
  return 'haut';
}
