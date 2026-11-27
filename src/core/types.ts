// Types partagés du cœur du jeu. Aucun accès au DOM ici : tout est testable en Node.

export type Element = 'neutre' | 'feu' | 'eau' | 'vent' | 'terre' | 'lumiere' | 'ombre';
export const ELEMENTS: readonly Element[] = ['neutre', 'feu', 'eau', 'vent', 'terre', 'lumiere', 'ombre'];

export type Dir = 'haut' | 'bas' | 'gauche' | 'droite';
export const DIRS: readonly Dir[] = ['haut', 'bas', 'gauche', 'droite'];
export const DIR_VEC: Record<Dir, readonly [number, number]> = {
  haut: [0, -1],
  bas: [0, 1],
  gauche: [-1, 0],
  droite: [1, 0],
};

export interface Stats {
  pvMax: number;
  psMax: number;
  atk: number;
  def: number;
  mag: number;
  res: number;
  vit: number;
}
export type StatKey = keyof Stats;
export const STAT_KEYS: readonly StatKey[] = ['pvMax', 'psMax', 'atk', 'def', 'mag', 'res', 'vit'];

export type StatusId = 'poison' | 'sommeil' | 'affaibli' | 'protege' | 'hate' | 'brise';

export interface StatusEffect {
  id: StatusId;
  tours: number;
}

export type Target = 'ennemi' | 'ennemis' | 'allie' | 'allies' | 'soi' | 'allieKO';
export type SkillKind = 'physique' | 'magique' | 'soin' | 'soutien' | 'reveil';

export interface SkillDef {
  id: string;
  nom: string;
  desc: string;
  cout: number;
  cible: Target;
  type: SkillKind;
  element: Element;
  puissance: number;
  coups?: number;
  statut?: { id: StatusId; chance: number; tours: number };
  /** Retire des statuts négatifs à la cible (soins). */
  purifie?: boolean;
}

export type EquipSlot = 'arme' | 'armure' | 'accessoire';
export type ItemKind = 'conso' | EquipSlot | 'cle';

export interface ItemDef {
  id: string;
  nom: string;
  desc: string;
  type: ItemKind;
  prix: number;
  /** Consommables. */
  soinPv?: number;
  soinPs?: number;
  reveil?: boolean;
  purifie?: boolean;
  cible?: 'allie' | 'allies' | 'allieKO' | 'ennemi';
  degats?: { puissance: number; element: Element };
  /** Équipements. */
  bonus?: Partial<Stats>;
  pour?: readonly string[];
  elementArme?: Element;
}

export interface HeroDef {
  id: string;
  nom: string;
  titre: string;
  base: Stats;
  croissance: Stats;
  competences: readonly { niveau: number; id: string }[];
  equipementInitial: Partial<Record<EquipSlot, string>>;
  couleurs: { peau: string; cheveux: string; tenue: string; accent: string };
  coiffure: 'courte' | 'longue' | 'tresse' | 'crete' | 'capuche';
}

export interface EnemyDef {
  id: string;
  nom: string;
  niveau: number;
  stats: Stats;
  xp: number;
  or: number;
  faiblesses: readonly Element[];
  resistances?: readonly Element[];
  bouclier: number;
  attaques: readonly { id: string; poids: number }[];
  butin?: readonly { objet: string; chance: number }[];
  boss?: boolean;
  forme: EnemyShape;
  teinte: string;
}

export type EnemyShape = 'gelee' | 'loup' | 'oiseau' | 'champi' | 'golem' | 'esprit' | 'crabe' | 'serpent' | 'chevalier' | 'roi';

export interface HeroState {
  id: string;
  niveau: number;
  xp: number;
  pv: number;
  ps: number;
  equipement: Partial<Record<EquipSlot, string>>;
}

export interface QuestDef {
  id: string;
  nom: string;
  desc: string;
  acte: number;
  principale: boolean;
}

export type QuestStatus = 'active' | 'terminee';
