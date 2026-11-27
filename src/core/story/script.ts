// Langage de script des événements (dialogues, récompenses, combats, cinématiques).
import type { Dir, QuestStatus } from '../types';
import type { Cond } from '../world/mapdef';

export type Cmd =
  | { c: 'dit'; qui?: string; texte: string; portrait?: string }
  | { c: 'choix'; texte: string; options: readonly { texte: string; faire: readonly Cmd[] }[] }
  | { c: 'si'; cond: Cond; alors: readonly Cmd[]; sinon?: readonly Cmd[] }
  | { c: 'flag'; nom: string; val?: boolean }
  | { c: 'donne'; objet: string; n?: number; silencieux?: boolean }
  | { c: 'retire'; objet: string; n?: number }
  | { c: 'or'; n: number }
  | { c: 'paye'; n: number; alors: readonly Cmd[]; sinon: readonly Cmd[] }
  | { c: 'rejoint'; hero: string; niveau?: number }
  | { c: 'combat'; groupe: readonly string[]; defaiteOk?: boolean; fuite?: boolean }
  | { c: 'soin' }
  | { c: 'teleporte'; carte: string; ancre: string; dir?: Dir }
  | { c: 'boutique'; id: string }
  | { c: 'quete'; id: string; etat: QuestStatus }
  | { c: 'titre'; texte: string; sous?: string }
  | { c: 'acte'; n: number }
  | { c: 'fin'; texte: string }
  | { c: 'son'; id: string }
  | { c: 'secousse' }
  | { c: 'flash'; couleur?: string }
  | { c: 'sauve' }
  | { c: 'appel'; evenement: string };

export type Script = readonly Cmd[];

/** Ce que l'interface doit afficher pour que l'histoire avance. */
export type Attente =
  | { type: 'dit'; qui: string | null; texte: string; portrait: string | null }
  | { type: 'choix'; texte: string; options: string[] }
  | { type: 'combat' }
  | { type: 'boutique'; id: string }
  | { type: 'titre'; texte: string; sous: string | null }
  | { type: 'fin'; texte: string };

/** Effets visuels/sonores ponctuels, consommés par l'interface. */
export type Effet =
  | { type: 'son'; id: string }
  | { type: 'secousse' }
  | { type: 'flash'; couleur: string }
  | { type: 'objet'; objet: string; n: number }
  | { type: 'or'; n: number }
  | { type: 'rejoint'; hero: string }
  | { type: 'quete'; id: string; etat: QuestStatus }
  | { type: 'sauve' }
  | { type: 'teleporte' };
