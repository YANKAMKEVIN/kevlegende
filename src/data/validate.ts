// Vérification de cohérence du contenu : références, ancres, accessibilité des cartes.
import type { Monde } from '../core/monde';
import type { Cmd, Script } from '../core/story/script';
import { ancre, casesProp, cle, compilerCarte, tuile, type CarteCompilee, type Pos } from '../core/world/map';
import type { MapDef } from '../core/world/mapdef';
import { ENEMIES } from './enemies';
import { HEROES } from './heroes';
import { ITEMS } from './items';
import { SKILLS } from './skills';

export function validerMonde(m: Monde): string[] {
  const err: string[] = [];
  const ev = (id: string | undefined, ctx: string) => {
    if (id && !m.evenements[id]) err.push(`${ctx} : événement « ${id} » inconnu`);
  };
  for (const h of Object.values(HEROES)) for (const c of h.competences) if (!SKILLS[c.id]) err.push(`Héros ${h.id} : compétence ${c.id}`);
  for (const e of Object.values(ENEMIES)) {
    for (const a of e.attaques) if (!SKILLS[a.id]) err.push(`Ennemi ${e.id} : attaque ${a.id}`);
    for (const b of e.butin ?? []) if (!ITEMS[b.objet]) err.push(`Ennemi ${e.id} : butin ${b.objet}`);
  }
  for (const [id, b] of Object.entries(m.boutiques)) for (const a of b.articles) if (!ITEMS[a]) err.push(`Boutique ${id} : ${a}`);
  for (const [id, s] of Object.entries(m.evenements)) verifierScript(m, s, `Événement ${id}`, err);
  if (!m.cartes[m.depart.carte]) err.push('Carte de départ inconnue');
  ev(m.depart.evenement, 'Départ');

  for (const def of Object.values(m.cartes)) {
    const ctx = `Carte ${def.id}`;
    let c: CarteCompilee;
    try {
      c = compilerCarte(def);
    } catch (e) {
      err.push(String((e as Error).message));
      continue;
    }
    const largeurs = new Set(def.plan.map((l) => l.length));
    if (largeurs.size > 1) err.push(`${ctx} : lignes de largeurs différentes (${[...largeurs].join(', ')})`);
    const a = (k: string, quoi: string) => {
      if (!c.ancres[k]) err.push(`${ctx} : ancre « ${k} » (${quoi}) absente`);
    };
    for (const p of def.pnj ?? []) (a(p.ancre, `pnj ${p.id}`), ev(p.evenement, `${ctx} pnj ${p.id}`));
    for (const p of def.props ?? []) (a(p.ancre, `décor ${p.type}`), ev(p.evenement, `${ctx} décor`));
    for (const d of def.declencheurs ?? []) (a(d.ancre, 'déclencheur'), ev(d.evenement, `${ctx} déclencheur`));
    for (const co of def.coffres ?? []) {
      a(co.ancre, `coffre ${co.id}`);
      if (co.objet && !ITEMS[co.objet]) err.push(`${ctx} coffre ${co.id} : objet ${co.objet}`);
    }
    for (const po of def.portes ?? []) {
      a(po.ancre, `porte vers ${po.vers}`);
      ev(po.sinon, `${ctx} porte`);
      const cible = m.cartes[po.vers];
      if (!cible) {
        err.push(`${ctx} : porte vers carte inconnue ${po.vers}`);
        continue;
      }
      const cc = compilerCarte(cible);
      const arr = cc.ancres[po.arrivee];
      if (!arr) err.push(`${ctx} : arrivée « ${po.arrivee} » absente de ${po.vers}`);
      else if (!tuile(cc, arr.x, arr.y).passable) err.push(`${ctx} : arrivée « ${po.arrivee} » de ${po.vers} sur une case bloquante`);
    }
    for (const g of def.rencontres?.groupes ?? []) for (const e of g.ennemis) if (!ENEMIES[e]) err.push(`${ctx} : ennemi ${e}`);
    if (err.length === 0) err.push(...verifierAcces(m, def, c));
  }
  return err;
}

function verifierScript(m: Monde, s: Script, ctx: string, err: string[]): void {
  for (const c of s) verifierCmd(m, c, ctx, err);
}

function verifierCmd(m: Monde, c: Cmd, ctx: string, err: string[]): void {
  switch (c.c) {
    case 'donne':
    case 'retire':
      if (!ITEMS[c.objet]) err.push(`${ctx} : objet ${c.objet}`);
      break;
    case 'combat':
      for (const e of c.groupe) if (!ENEMIES[e]) err.push(`${ctx} : ennemi ${e}`);
      break;
    case 'rejoint':
      if (!HEROES[c.hero]) err.push(`${ctx} : héros ${c.hero}`);
      break;
    case 'teleporte': {
      const d = m.cartes[c.carte];
      if (!d) err.push(`${ctx} : carte ${c.carte}`);
      else if (!compilerCarte(d).ancres[c.ancre]) err.push(`${ctx} : ancre ${c.ancre} absente de ${c.carte}`);
      break;
    }
    case 'boutique':
      if (!m.boutiques[c.id]) err.push(`${ctx} : boutique ${c.id}`);
      break;
    case 'quete':
      if (!m.quetes[c.id]) err.push(`${ctx} : quête ${c.id}`);
      break;
    case 'appel':
      if (!m.evenements[c.evenement]) err.push(`${ctx} : appel ${c.evenement}`);
      break;
    case 'si':
      verifierScript(m, c.alors, ctx, err);
      if (c.sinon) verifierScript(m, c.sinon, ctx, err);
      break;
    case 'choix':
      for (const o of c.options) verifierScript(m, o.faire, ctx, err);
      break;
    case 'paye':
      verifierScript(m, c.alors, ctx, err);
      verifierScript(m, c.sinon, ctx, err);
      break;
    default:
      break;
  }
}

/** Chaque PNJ, coffre, porte et décor interactif doit être atteignable depuis une arrivée de la carte. */
function verifierAcces(m: Monde, def: MapDef, c: CarteCompilee): string[] {
  const err: string[] = [];
  const bloque = new Set<string>();
  // Seuls les décors solides inconditionnels bloquent (les grilles, PNJ gardiens… s'ouvrent un jour).
  for (const p of def.props ?? []) if (p.solide !== false && !p.si) for (const q of casesProp(c, p)) bloque.add(cle(q.x, q.y));
  for (const p of def.pnj ?? []) if (!p.si) bloque.add(cle(ancre(c, p.ancre).x, ancre(c, p.ancre).y));
  for (const co of def.coffres ?? []) bloque.add(cle(ancre(c, co.ancre).x, ancre(c, co.ancre).y));
  const portes = new Set((def.portes ?? []).map((p) => cle(ancre(c, p.ancre).x, ancre(c, p.ancre).y)));
  const libre = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < c.largeur && y < c.hauteur && (portes.has(cle(x, y)) || (tuile(c, x, y).passable && !bloque.has(cle(x, y))));
  const departs: Pos[] = [];
  for (const autre of Object.values(m.cartes)) {
    for (const po of autre.portes ?? []) if (po.vers === def.id && c.ancres[po.arrivee]) departs.push(c.ancres[po.arrivee]!);
  }
  if (m.depart.carte === def.id) departs.push(ancre(c, m.depart.ancre));
  scanTeleports(m, def.id, c, departs);
  if (departs.length === 0) return [`Carte ${def.id} : aucune arrivée`];
  const vu = new Set<string>();
  const file = [...departs];
  for (const d of departs) vu.add(cle(d.x, d.y));
  while (file.length) {
    const p = file.shift()!;
    if (portes.has(cle(p.x, p.y)) && !departs.some((d) => d.x === p.x && d.y === p.y)) continue;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const x = p.x + dx;
      const y = p.y + dy;
      if (!vu.has(cle(x, y)) && libre(x, y)) {
        vu.add(cle(x, y));
        file.push({ x, y });
      }
    }
  }
  const adjacent = (q: Pos) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => vu.has(cle(q.x + dx!, q.y + dy!)));
  for (const p of def.pnj ?? []) if (!adjacent(ancre(c, p.ancre))) err.push(`Carte ${def.id} : PNJ ${p.id} inaccessible`);
  for (const co of def.coffres ?? []) if (!adjacent(ancre(c, co.ancre))) err.push(`Carte ${def.id} : coffre ${co.id} inaccessible`);
  for (const po of def.portes ?? []) if (!vu.has(cle(ancre(c, po.ancre).x, ancre(c, po.ancre).y))) err.push(`Carte ${def.id} : porte vers ${po.vers} inaccessible`);
  for (const p of def.props ?? []) {
    if (!p.evenement) continue;
    if (!casesProp(c, p).some(adjacent)) err.push(`Carte ${def.id} : décor ${p.type} (${p.ancre}) inaccessible`);
  }
  return err;
}

function scanTeleports(m: Monde, carte: string, c: CarteCompilee, out: Pos[]): void {
  const visite = (s: Script) => {
    for (const cmd of s) {
      if (cmd.c === 'teleporte' && cmd.carte === carte && c.ancres[cmd.ancre]) out.push(c.ancres[cmd.ancre]!);
      if (cmd.c === 'si') (visite(cmd.alors), cmd.sinon && visite(cmd.sinon));
      if (cmd.c === 'choix') for (const o of cmd.options) visite(o.faire);
    }
  };
  for (const s of Object.values(m.evenements)) visite(s);
}
