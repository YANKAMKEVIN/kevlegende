// L'état persistant d'une partie (ce qui est sauvegardé).
import { hero } from '../data/heroes';
import { itemOpt } from '../data/items';
import { statsCompletes } from './progression';
import type { Dir, HeroState, QuestStatus } from './types';

export interface Partie {
  carte: string;
  x: number;
  y: number;
  dir: Dir;
  equipe: HeroState[];
  inventaire: Record<string, number>;
  or: number;
  flags: Record<string, boolean>;
  quetes: Record<string, QuestStatus>;
  coffres: string[];
  /** Faiblesses découvertes « ennemi:element ». */
  bestiaire: string[];
  /** Ennemis déjà vaincus au moins une fois. */
  vaincus: string[];
  pas: number;
  pasRencontre: number;
  tempsJeu: number;
  combats: number;
  victoires: number;
  rng: number;
  acte: number;
}

export function nouveauHeros(id: string, niveau = 1, xp?: number): HeroState {
  const def = hero(id);
  const h: HeroState = { id, niveau, xp: xp ?? 0, pv: 1, ps: 0, equipement: { ...def.equipementInitial } };
  const s = statsCompletes(def, h, itemOpt);
  h.pv = s.pvMax;
  h.ps = s.psMax;
  return h;
}

export function nouvellePartie(seed: number, depart: { carte: string; x: number; y: number }): Partie {
  return {
    carte: depart.carte,
    x: depart.x,
    y: depart.y,
    dir: 'bas',
    equipe: [nouveauHeros('ael')],
    inventaire: { herbe_douce: 3 },
    or: 30,
    flags: {},
    quetes: {},
    coffres: [],
    bestiaire: [],
    vaincus: [],
    pas: 0,
    pasRencontre: 0,
    tempsJeu: 0,
    combats: 0,
    victoires: 0,
    rng: seed >>> 0,
    acte: 1,
  };
}

export function statsHeros(h: HeroState) {
  return statsCompletes(hero(h.id), h, itemOpt);
}

export function soignerEquipe(p: Partie): void {
  for (const h of p.equipe) {
    const s = statsHeros(h);
    h.pv = s.pvMax;
    h.ps = s.psMax;
  }
}

export function ajouterObjet(p: Partie, id: string, n = 1): void {
  p.inventaire[id] = (p.inventaire[id] ?? 0) + n;
  if (p.inventaire[id]! <= 0) delete p.inventaire[id];
}

export const possede = (p: Partie, id: string, n = 1) => (p.inventaire[id] ?? 0) >= n;
