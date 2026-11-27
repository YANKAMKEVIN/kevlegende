// Le « monde » injecté dans le moteur : cartes, événements, boutiques, quêtes.
import type { Script } from './story/script';
import type { QuestDef } from './types';
import type { Cond, MapDef } from './world/mapdef';

export interface BoutiqueDef {
  nom: string;
  articles: readonly string[];
}

export interface Objectif {
  si: Cond;
  texte: string;
}

export interface Monde {
  cartes: Readonly<Record<string, MapDef>>;
  evenements: Readonly<Record<string, Script>>;
  boutiques: Readonly<Record<string, BoutiqueDef>>;
  quetes: Readonly<Record<string, QuestDef>>;
  /** Objectif principal affiché : le premier dont la condition est vraie. */
  objectifs: readonly Objectif[];
  depart: { carte: string; ancre: string; evenement?: string };
}

export type Mode = 'exploration' | 'evenement' | 'combat' | 'defaite' | 'fin';
