// Construction d'un combat à partir du groupe et d'une formation ennemie.
import { ENEMIES } from '../../data/enemies';
import { hero } from '../../data/heroes';
import { item, itemOpt } from '../../data/items';
import { competencesConnues, statsCompletes } from '../progression';
import type { HeroState } from '../types';
import { delaiTour } from './status';
import type { BattleState, Combattant } from './types';

export function combattantHeros(h: HeroState): Combattant {
  const def = hero(h.id);
  const stats = statsCompletes(def, h, itemOpt);
  const arme = h.equipement.arme ? item(h.equipement.arme) : undefined;
  return {
    uid: `h:${h.id}`,
    camp: 'heros',
    ref: h.id,
    nom: def.nom,
    niveau: h.niveau,
    stats,
    pv: Math.min(h.pv, stats.pvMax),
    ps: Math.min(h.ps, stats.psMax),
    statuts: [],
    delai: 0,
    defense: false,
    competences: competencesConnues(def, h.niveau),
    elementArme: arme?.elementArme ?? 'neutre',
    faiblesses: [],
    resistances: [],
    revelees: [],
    bouclier: 0,
    bouclierMax: 0,
    brise: 0,
    boss: false,
  };
}

/** Puissance offensive des ennemis (calibrée avec scripts/calibrate.ts et le bot). */
export const OFFENSE_BOSS = 2.2;
/** Les premiers ennemis restent cléments (Aël commence seul), puis la pression monte jusqu'à ×1,6. */
export const offenseEnnemi = (niveau: number, boss: boolean) => (boss ? OFFENSE_BOSS : 1 + Math.min(0.6, Math.max(0, niveau - 1) * 0.1));

export function combattantEnnemi(id: string, index: number, total: number, connues: readonly string[]): Combattant {
  const def = ENEMIES[id];
  if (!def) throw new Error(`Ennemi inconnu : ${id}`);
  const lettre = total > 1 && !def.boss ? ` ${String.fromCharCode(65 + index)}` : '';
  return {
    uid: `e:${index}`,
    camp: 'ennemis',
    ref: id,
    nom: def.nom + lettre,
    niveau: def.niveau,
    stats: {
      ...def.stats,
      atk: Math.round(def.stats.atk * offenseEnnemi(def.niveau, !!def.boss)),
      mag: Math.round(def.stats.mag * offenseEnnemi(def.niveau, !!def.boss)),
    },
    pv: def.stats.pvMax,
    ps: 0,
    statuts: [],
    delai: 0,
    defense: false,
    competences: def.attaques.map((a) => a.id),
    elementArme: 'neutre',
    faiblesses: [...def.faiblesses],
    resistances: [...(def.resistances ?? [])],
    revelees: def.faiblesses.filter((f) => connues.includes(`${id}:${f}`)),
    bouclier: def.bouclier,
    bouclierMax: def.bouclier,
    brise: 0,
    boss: !!def.boss,
  };
}

export interface OptionsCombat {
  seed: number;
  fuite?: boolean;
  /** Faiblesses déjà découvertes (« ennemi:element »), mémorisées dans le bestiaire. */
  connues?: readonly string[];
}

export function creerCombat(groupe: readonly string[], equipe: readonly HeroState[], opts: OptionsCombat): BattleState {
  if (groupe.length === 0) throw new Error('Formation ennemie vide');
  const heros = equipe.map(combattantHeros);
  const ennemis = groupe.map((id, i) => combattantEnnemi(id, i, groupe.length, opts.connues ?? []));
  const combattants = [...heros, ...ennemis];
  // Petit décalage initial : les plus rapides ouvrent le bal, les héros d'abord à égalité.
  combattants.forEach((c, i) => {
    c.delai = delaiTour(c) * 0.5 + i * 0.01 + (c.camp === 'ennemis' ? 0.5 : 0);
  });
  const boss = ennemis.some((e) => e.boss);
  return {
    combattants,
    tour: 0,
    attente: null,
    fini: null,
    boss,
    fuitePossible: (opts.fuite ?? true) && !boss,
    rng: opts.seed >>> 0,
    groupe: [...groupe],
  };
}
