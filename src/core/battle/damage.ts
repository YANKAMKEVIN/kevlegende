// Formules de dégâts, de soin et d'affinités élémentaires.
import type { Element, SkillDef } from '../types';
import type { Combattant } from './types';
import { aStatut } from './status';

export const MULT_FAIBLE = 1.5;
export const MULT_RESISTE = 0.5;
export const MULT_BRISE = 1.5;
export const MULT_DEFENSE = 0.5;
export const MULT_PROTEGE = 0.6;
export const MULT_AFFAIBLI = 0.7;
export const CHANCE_CRITIQUE = 0.05;

export function affinite(cible: Combattant, el: Element): 'faible' | 'resiste' | 'normal' {
  if (el === 'neutre') return 'normal';
  if (cible.faiblesses.includes(el)) return 'faible';
  if (cible.resistances.includes(el)) return 'resiste';
  return 'normal';
}

export interface Calcul {
  valeur: number;
  faible: boolean;
  resiste: boolean;
  critique: boolean;
}

/** Dégâts d'une frappe (avant application). `alea` dans [0,1) pour la variance, `critAlea` pour le critique. */
export function calculerDegats(
  lanceur: Combattant,
  cible: Combattant,
  type: 'physique' | 'magique',
  puissance: number,
  element: Element,
  alea: number,
  critAlea: number,
): Calcul {
  let a = type === 'physique' ? lanceur.stats.atk : lanceur.stats.mag;
  const d = type === 'physique' ? cible.stats.def : cible.stats.res;
  if (aStatut(lanceur, 'affaibli')) a *= MULT_AFFAIBLI;
  let v = (puissance / 10) * a * (a / (a + d)) * 1.15;
  const aff = affinite(cible, element);
  if (aff === 'faible') v *= MULT_FAIBLE;
  if (aff === 'resiste') v *= MULT_RESISTE;
  if (cible.brise > 0) v *= MULT_BRISE;
  if (cible.defense) v *= MULT_DEFENSE;
  if (aStatut(cible, 'protege')) v *= MULT_PROTEGE;
  const critique = type === 'physique' && critAlea < CHANCE_CRITIQUE;
  if (critique) v *= 1.5;
  v *= 0.9 + alea * 0.2;
  return { valeur: Math.max(1, Math.round(v)), faible: aff === 'faible', resiste: aff === 'resiste', critique };
}

export function soinDeBase(mag: number, puissance: number): number {
  return Math.max(1, Math.round((puissance / 10) * (mag * 1.25 + 6)));
}

export function calculerSoin(lanceur: Combattant, sk: SkillDef): number {
  return soinDeBase(lanceur.stats.mag, sk.puissance);
}

/** Dégâts fixes d'un objet offensif (indépendants du lanceur). */
export function degatsObjet(cible: Combattant, puissance: number, element: Element): Calcul {
  let v = puissance + cible.niveau * 3;
  const aff = affinite(cible, element);
  if (aff === 'faible') v *= MULT_FAIBLE;
  if (aff === 'resiste') v *= MULT_RESISTE;
  if (cible.brise > 0) v *= MULT_BRISE;
  return { valeur: Math.max(1, Math.round(v)), faible: aff === 'faible', resiste: aff === 'resiste', critique: false };
}
