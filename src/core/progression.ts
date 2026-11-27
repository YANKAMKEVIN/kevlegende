// Courbe d'expérience, statistiques par niveau et équipement.
import type { EquipSlot, HeroDef, HeroState, ItemDef, Stats } from './types';
import { STAT_KEYS } from './types';

export const NIVEAU_MAX = 60;

/** XP totale nécessaire pour atteindre le niveau n (n >= 1). */
export function xpPourNiveau(n: number): number {
  if (n <= 1) return 0;
  const k = n - 1;
  return Math.round(12 * k * k + 18 * k + 0.35 * k * k * k);
}

export function niveauPourXp(xp: number): number {
  let n = 1;
  while (n < NIVEAU_MAX && xp >= xpPourNiveau(n + 1)) n++;
  return n;
}

export function statsDeBase(def: HeroDef, niveau: number): Stats {
  const s = {} as Stats;
  for (const k of STAT_KEYS) s[k] = Math.floor(def.base[k] + def.croissance[k] * (niveau - 1));
  return s;
}

export function bonusEquipement(etat: HeroState, objets: (id: string) => ItemDef | undefined): Partial<Stats> {
  const out: Partial<Stats> = {};
  for (const slot of ['arme', 'armure', 'accessoire'] as EquipSlot[]) {
    const id = etat.equipement[slot];
    const it = id ? objets(id) : undefined;
    if (!it?.bonus) continue;
    for (const k of STAT_KEYS) {
      const b = it.bonus[k];
      if (b) out[k] = (out[k] ?? 0) + b;
    }
  }
  return out;
}

export function statsCompletes(def: HeroDef, etat: HeroState, objets: (id: string) => ItemDef | undefined): Stats {
  const s = statsDeBase(def, etat.niveau);
  const b = bonusEquipement(etat, objets);
  for (const k of STAT_KEYS) s[k] = Math.max(1, s[k] + (b[k] ?? 0));
  return s;
}

export function competencesConnues(def: HeroDef, niveau: number): string[] {
  return def.competences.filter((c) => c.niveau <= niveau).map((c) => c.id);
}

export interface GainNiveau {
  hero: string;
  de: number;
  a: number;
  nouvellesCompetences: string[];
}

/** Ajoute de l'XP ; renvoie le gain de niveau éventuel. Les PV/PS gagnés sont ajoutés aux valeurs courantes. */
export function gagnerXp(
  def: HeroDef,
  etat: HeroState,
  xp: number,
  objets: (id: string) => ItemDef | undefined,
): GainNiveau | null {
  const avant = statsCompletes(def, etat, objets);
  const de = etat.niveau;
  etat.xp += Math.max(0, Math.floor(xp));
  etat.niveau = niveauPourXp(etat.xp);
  if (etat.niveau === de) return null;
  const apres = statsCompletes(def, etat, objets);
  if (etat.pv > 0) etat.pv = Math.min(apres.pvMax, etat.pv + (apres.pvMax - avant.pvMax));
  etat.ps = Math.min(apres.psMax, etat.ps + (apres.psMax - avant.psMax));
  const anciennes = new Set(competencesConnues(def, de));
  return {
    hero: def.id,
    de,
    a: etat.niveau,
    nouvellesCompetences: competencesConnues(def, etat.niveau).filter((c) => !anciennes.has(c)),
  };
}
