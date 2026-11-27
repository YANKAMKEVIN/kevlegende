// Altérations et bonus temporaires.
import type { StatusId } from '../types';
import type { Combattant } from './types';

export const NEGATIFS: readonly StatusId[] = ['poison', 'sommeil', 'affaibli'];

export const NOM_STATUT: Record<StatusId, string> = {
  poison: 'Poison',
  sommeil: 'Sommeil',
  affaibli: 'Affaibli',
  protege: 'Protégé',
  hate: 'Hâte',
  brise: 'Brisé',
};

export function aStatut(c: Combattant, id: StatusId): boolean {
  return c.statuts.some((s) => s.id === id && s.tours > 0);
}

export function ajouterStatut(c: Combattant, id: StatusId, tours: number): void {
  const ex = c.statuts.find((s) => s.id === id);
  if (ex) ex.tours = Math.max(ex.tours, tours);
  else c.statuts.push({ id, tours });
}

export function retirerStatut(c: Combattant, id: StatusId): boolean {
  const n = c.statuts.length;
  c.statuts = c.statuts.filter((s) => s.id !== id);
  return c.statuts.length !== n;
}

export function purifier(c: Combattant): StatusId[] {
  const retires = c.statuts.filter((s) => NEGATIFS.includes(s.id)).map((s) => s.id);
  c.statuts = c.statuts.filter((s) => !NEGATIFS.includes(s.id));
  return retires;
}

/** Décrémente la durée des statuts à la fin du tour du combattant. Renvoie ceux qui expirent. */
export function vieillirStatuts(c: Combattant): StatusId[] {
  const fin: StatusId[] = [];
  for (const s of c.statuts) {
    s.tours--;
    if (s.tours <= 0) fin.push(s.id);
  }
  c.statuts = c.statuts.filter((s) => s.tours > 0);
  return fin;
}

/** Délai entre deux tours : plus on est rapide, plus il est court. */
export function delaiTour(c: Combattant): number {
  const base = 1000 / (c.stats.vit + 12);
  return aStatut(c, 'hate') ? base * 0.65 : base;
}
