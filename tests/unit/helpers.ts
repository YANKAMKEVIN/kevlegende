// Petit monde de test, indépendant du contenu du jeu.
import type { Monde } from '../../src/core/monde';
import { Jeu } from '../../src/core/game';
import type { MapDef } from '../../src/core/world/mapdef';
import { MONDE } from '../../src/data/monde';
import type { Script } from '../../src/core/story/script';

const app = { peau: '#fff', cheveux: '#000', tenue: '#333', accent: '#f00', coiffure: 'courte' as const };

export const ICI: MapDef = {
  id: 'ici',
  nom: 'Ici',
  acte: 1,
  ambiance: 'jour',
  musique: 'village',
  solDefaut: '.',
  plan: [
    '##########',
    '#@..N...D#',
    '#..,,,,..#',
    '#..,,,,.1#',
    '#.Y.Z##..#',
    '#...G..2.#',
    '##########',
  ],
  pnj: [
    { ancre: 'N', id: 'pnj', nom: 'Pnj', apparence: app, evenement: 'parle' },
    { ancre: 'G', id: 'cache', nom: 'Caché', apparence: app, evenement: 'parle', si: ['jamais'] },
  ],
  props: [
    { type: 'panneau', ancre: '2', evenement: 'panneau' },
    { type: 'grille', ancre: 'Z', w: 3, si: ['!ouvert'], evenement: 'parle' },
  ],
  coffres: [{ ancre: '1', id: 'c', objet: 'herbe_douce', n: 2, or: 10 }],
  portes: [
    { ancre: 'D', vers: 'labas', arrivee: 'A', dir: 'bas' },
  ],
  declencheurs: [{ ancre: 'Y', evenement: 'piege', si: ['!piege_vu'] }],
  rencontres: { taux: 1, niveauConseille: 1, groupes: [{ ennemis: ['gelee_rosee'], poids: 1 }] },
};

export const LABAS: MapDef = {
  id: 'labas',
  nom: 'Là-bas',
  acte: 1,
  ambiance: 'grotte',
  musique: 'grotte',
  solDefaut: 'c',
  plan: ['CCCCC', 'CAcBC', 'CcEcC', 'CCCCC'],
  portes: [
    { ancre: 'E', vers: 'ici', arrivee: '@', si: ['sortie'], sinon: 'bloque' },
    { ancre: 'B', vers: 'ici', arrivee: '@' },
  ],
};

export const EVENTS: Record<string, Script> = {
  parle: [{ c: 'dit', qui: 'Pnj', texte: 'Bonjour.' }, { c: 'flag', nom: 'parle' }],
  panneau: [{ c: 'dit', texte: 'Un panneau.' }],
  piege: [{ c: 'flag', nom: 'piege_vu' }, { c: 'dit', texte: 'Un piège !' }],
  bloque: [{ c: 'dit', texte: 'Bloqué.' }],
  sous: [{ c: 'flag', nom: 'sous' }],
};

export function mondeTest(evenements: Record<string, Script> = {}): Monde {
  return {
    cartes: { ici: ICI, labas: LABAS },
    evenements: { ...EVENTS, ...evenements },
    boutiques: { b: { nom: 'B', articles: ['herbe_douce', 'sabre_voile'] } },
    quetes: MONDE.quetes,
    objectifs: [{ si: ['parle'], texte: 'Après' }, { si: [], texte: 'Avant' }],
    depart: { carte: 'ici', ancre: '@' },
  };
}

export function jeuTest(evenements: Record<string, Script> = {}): Jeu {
  const j = Jeu.nouvelle(mondeTest(evenements), 42);
  j.p.flags['debug_sans_rencontre'] = true;
  return j;
}

/** Ferme tous les dialogues en cours. */
export function toutLire(j: Jeu, max = 100): string[] {
  const lus: string[] = [];
  for (let i = 0; i < max && j.attente && j.attente.type !== 'combat' && j.attente.type !== 'choix'; i++) {
    if (j.attente.type === 'dit') lus.push(j.attente.texte);
    j.continuer();
  }
  return lus;
}
