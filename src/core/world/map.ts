// Compilation d'une carte : grille de tuiles, ancres résolues, collisions.
import { TILES, isTileChar, type TileInfo } from './tiles';
import type { Cond, MapDef, PropDef } from './mapdef';

export interface Pos {
  x: number;
  y: number;
}

export interface CarteCompilee {
  def: MapDef;
  largeur: number;
  hauteur: number;
  /** Caractère de tuile (après remplacement des ancres). */
  grille: string[][];
  ancres: Readonly<Record<string, Pos>>;
}

const cache = new Map<string, CarteCompilee>();

export function compilerCarte(def: MapDef): CarteCompilee {
  const deja = cache.get(def.id);
  if (deja && deja.def === def) return deja;
  const hauteur = def.plan.length;
  const largeur = Math.max(...def.plan.map((l) => l.length));
  const ancres: Record<string, Pos> = {};
  const grille: string[][] = [];
  for (let y = 0; y < hauteur; y++) {
    const ligne = def.plan[y] ?? '';
    const row: string[] = [];
    for (let x = 0; x < largeur; x++) {
      const ch = ligne[x] ?? 'o';
      if (isTileChar(ch)) row.push(ch);
      else {
        if (ancres[ch]) throw new Error(`Carte ${def.id} : ancre « ${ch} » en double`);
        ancres[ch] = { x, y };
        const sol = def.sol?.[ch] ?? def.solDefaut;
        if (!isTileChar(sol)) throw new Error(`Carte ${def.id} : sol « ${sol} » inconnu`);
        row.push(sol);
      }
    }
    grille.push(row);
  }
  const c: CarteCompilee = { def, largeur, hauteur, grille, ancres };
  cache.set(def.id, c);
  return c;
}

export function ancre(c: CarteCompilee, a: string): Pos {
  const p = c.ancres[a];
  if (!p) throw new Error(`Carte ${c.def.id} : ancre « ${a} » absente du plan`);
  return p;
}

export function tuile(c: CarteCompilee, x: number, y: number): TileInfo {
  const ch = c.grille[y]?.[x];
  return (ch && TILES[ch]) || (TILES['o'] as TileInfo);
}

export const dansCarte = (c: CarteCompilee, x: number, y: number) => x >= 0 && y >= 0 && x < c.largeur && y < c.hauteur;

export function condVraie(cond: Cond | undefined, flags: Readonly<Record<string, boolean>>): boolean {
  if (!cond) return true;
  return cond.every((f) => (f.startsWith('!') ? !flags[f.slice(1)] : !!flags[f]));
}

export function propVisible(p: PropDef, flags: Readonly<Record<string, boolean>>): boolean {
  return condVraie(p.si, flags);
}

/** Cases occupées par les décors solides visibles. */
export function casesProp(c: CarteCompilee, p: PropDef): Pos[] {
  const o = ancre(c, p.ancre);
  const out: Pos[] = [];
  for (let dy = 0; dy < (p.h ?? 1); dy++) for (let dx = 0; dx < (p.w ?? 1); dx++) out.push({ x: o.x + dx, y: o.y + dy });
  return out;
}

export const cle = (x: number, y: number) => `${x},${y}`;
