// Format des cartes écrites à la main : un plan ASCII + des objets posés sur des ancres.
import type { Dir } from '../types';

export type Ambiance = 'jour' | 'aube' | 'crepuscule' | 'nuit' | 'grotte' | 'interieur' | 'brume' | 'desert' | 'neige' | 'pale';

/** Condition : liste de drapeaux, « !x » = drapeau absent. Toutes doivent être vraies. */
export type Cond = readonly string[];

export interface Apparence {
  peau: string;
  cheveux: string;
  tenue: string;
  accent: string;
  coiffure: 'courte' | 'longue' | 'tresse' | 'crete' | 'capuche' | 'chauve' | 'chignon';
  /** Silhouettes non humaines. */
  espece?: 'humain' | 'poule' | 'chat' | 'chien' | 'esprit';
}

export interface PnjDef {
  ancre: string;
  id: string;
  nom: string;
  apparence: Apparence;
  evenement: string;
  dir?: Dir;
  si?: Cond;
  /** Petit déplacement d'ambiance autour de l'ancre. */
  flane?: boolean;
}

export interface PorteDef {
  ancre: string;
  vers: string;
  arrivee: string;
  dir?: Dir;
  si?: Cond;
  /** Événement joué si la condition n'est pas remplie. */
  sinon?: string;
}

export interface CoffreDef {
  ancre: string;
  id: string;
  objet?: string;
  n?: number;
  or?: number;
}

export type PropType =
  | 'maison' | 'maison_bleue' | 'fanal' | 'puits' | 'panneau' | 'barriere' | 'rocher' | 'caisse'
  | 'lit' | 'table' | 'etagere' | 'cheminee' | 'comptoir' | 'tonneau' | 'barque' | 'statue'
  | 'autel' | 'levier' | 'grille' | 'lanterne' | 'grand_arbre' | 'etal' | 'enclume' | 'navire'
  | 'porte_grotte' | 'cristaux' | 'herbe_lune' | 'mat' | 'filet' | 'moulin' | 'tente' | 'souche'
  | 'maison_ocre' | 'obelisque' | 'jarre' | 'miroir' | 'colonne' | 'ossements' | 'tourbillon' | 'sarcophage'
  | 'chalet' | 'bonhomme' | 'brasero' | 'statue_glace' | 'yak' | 'traineau' | 'bloc_glace' | 'blizzard' | 'coeur_glace'
  | 'dormeur' | 'portail_pale' | 'cloche' | 'trone' | 'arbre_lune';

export interface PropDef {
  type: PropType;
  ancre: string;
  w?: number;
  h?: number;
  solide?: boolean;
  /** Présent uniquement si la condition est vraie. */
  si?: Cond;
  evenement?: string;
  /** Variante visuelle (ex. levier abaissé, fanal allumé). */
  etat?: Cond;
}

export interface DeclencheurDef {
  ancre: string;
  evenement: string;
  si?: Cond;
  /** Couvre une zone (largeur, hauteur) à partir de l'ancre. */
  w?: number;
  h?: number;
}

export interface RencontresDef {
  /** Probabilité par pas une fois la période de grâce passée. */
  taux: number;
  groupes: readonly { ennemis: readonly string[]; poids: number }[];
  niveauConseille: number;
}

export interface MapDef {
  id: string;
  nom: string;
  acte: number;
  ambiance: Ambiance;
  musique: string;
  plan: readonly string[];
  /** Tuile sous les ancres (par défaut : `solDefaut`). */
  sol?: Readonly<Record<string, string>>;
  solDefaut: string;
  pnj?: readonly PnjDef[];
  portes?: readonly PorteDef[];
  coffres?: readonly CoffreDef[];
  props?: readonly PropDef[];
  declencheurs?: readonly DeclencheurDef[];
  rencontres?: RencontresDef;
  /** Bord de la carte : où mène-t-on en sortant (île flottante : pas de sortie libre). */
  entree?: string;
}
