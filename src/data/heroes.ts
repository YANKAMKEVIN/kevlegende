// Les héros de Kevlegende.
import type { HeroDef } from '../core/types';

const L: HeroDef[] = [
  {
    id: 'ael',
    nom: 'Aël',
    titre: 'Apprenti voilier',
    base: { pvMax: 52, psMax: 12, atk: 12, def: 9, mag: 6, res: 7, vit: 10 },
    croissance: { pvMax: 9.5, psMax: 1.8, atk: 2.6, def: 1.9, mag: 1.1, res: 1.4, vit: 1.3 },
    competences: [
      { niveau: 1, id: 'tranche_vent' },
      { niveau: 3, id: 'second_souffle' },
      { niveau: 6, id: 'lame_tourbillon' },
      { niveau: 9, id: 'coupe_brume' },
      { niveau: 14, id: 'rafale_triple' },
      { niveau: 22, id: 'aube_tranchante' },
    ],
    equipementInitial: { arme: 'epee_bois', armure: 'tunique' },
    couleurs: { peau: '#f1c7a0', cheveux: '#3b2a24', tenue: '#2f6f8f', accent: '#f2b84b' },
    coiffure: 'courte',
  },
  {
    id: 'mira',
    nom: 'Mira',
    titre: 'Cartographe guérisseuse',
    base: { pvMax: 40, psMax: 18, atk: 9, def: 7, mag: 11, res: 10, vit: 11 },
    croissance: { pvMax: 7.2, psMax: 2.8, atk: 1.8, def: 1.4, mag: 2.4, res: 1.9, vit: 1.4 },
    competences: [
      { niveau: 1, id: 'baume' },
      { niveau: 1, id: 'fleche_givre' },
      { niveau: 4, id: 'fleche_ardente' },
      { niveau: 7, id: 'brise_douce' },
      { niveau: 9, id: 'purification' },
      { niveau: 11, id: 'eveil' },
      { niveau: 16, id: 'pluie_fleches' },
    ],
    equipementInitial: { arme: 'arc_osier', armure: 'tunique' },
    couleurs: { peau: '#8d5a3b', cheveux: '#1d1a2e', tenue: '#8a4f7d', accent: '#7fd1c1' },
    coiffure: 'tresse',
  },
  {
    id: 'brann',
    nom: 'Brann',
    titre: 'Forgeron du port',
    base: { pvMax: 70, psMax: 10, atk: 14, def: 13, mag: 5, res: 8, vit: 7 },
    croissance: { pvMax: 11.5, psMax: 1.5, atk: 2.7, def: 2.5, mag: 0.9, res: 1.6, vit: 1.0 },
    competences: [
      { niveau: 1, id: 'coup_marteau' },
      { niveau: 1, id: 'rempart' },
      { niveau: 8, id: 'braise' },
      { niveau: 10, id: 'cri_forge' },
      { niveau: 15, id: 'seisme' },
    ],
    equipementInitial: { arme: 'marteau_forge', armure: 'tablier_cuir' },
    couleurs: { peau: '#c98e62', cheveux: '#b5532a', tenue: '#5b4a3a', accent: '#e07b39' },
    coiffure: 'crete',
  },
];

export const HEROES: Readonly<Record<string, HeroDef>> = Object.fromEntries(L.map((h) => [h.id, h]));

export function hero(id: string): HeroDef {
  const h = HEROES[id];
  if (!h) throw new Error(`Héros inconnu : ${id}`);
  return h;
}
