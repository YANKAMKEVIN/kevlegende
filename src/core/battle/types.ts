// Structures du combat (tour par tour, ordre selon la vitesse, mécanique de Brèche).
import type { Element, Stats, StatusEffect, StatusId } from '../types';

export type Camp = 'heros' | 'ennemis';

export interface Combattant {
  uid: string;
  camp: Camp;
  ref: string;
  nom: string;
  niveau: number;
  stats: Stats;
  pv: number;
  ps: number;
  statuts: StatusEffect[];
  /** Temps restant avant le prochain tour (plus petit = joue avant). */
  delai: number;
  defense: boolean;
  competences: string[];
  elementArme: Element;
  faiblesses: Element[];
  resistances: Element[];
  /** Faiblesses découvertes par le joueur. */
  revelees: Element[];
  bouclier: number;
  bouclierMax: number;
  /** Tours pendant lesquels l'ennemi reste « Brisé ». */
  brise: number;
  boss: boolean;
}

export type Action =
  | { type: 'attaque'; cible: string }
  | { type: 'competence'; id: string; cible: string }
  | { type: 'objet'; id: string; cible: string }
  | { type: 'defense' }
  | { type: 'fuite' };

export type BattleEvent =
  | { t: 'tour'; acteur: string }
  | { t: 'action'; acteur: string; nom: string; element: Element }
  | { t: 'degats'; cible: string; valeur: number; faible: boolean; resiste: boolean; critique: boolean }
  | { t: 'soin'; cible: string; valeur: number; ps?: boolean }
  | { t: 'statut'; cible: string; id: StatusId; ajoute: boolean }
  | { t: 'bouclier'; cible: string; reste: number }
  | { t: 'brise'; cible: string }
  | { t: 'ko'; cible: string }
  | { t: 'releve'; cible: string }
  | { t: 'rate'; cible: string }
  | { t: 'message'; texte: string }
  | { t: 'fin'; resultat: Resultat };

export type Resultat = 'victoire' | 'defaite' | 'fuite';

export interface BattleState {
  combattants: Combattant[];
  tour: number;
  attente: string | null;
  fini: Resultat | null;
  boss: boolean;
  fuitePossible: boolean;
  rng: number;
  groupe: string[];
}
