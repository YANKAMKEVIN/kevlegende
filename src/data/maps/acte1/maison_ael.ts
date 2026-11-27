// Maison d'Odile et d'Aël, Clairval.
import type { MapDef } from '../../../core/world/mapdef';
import { APP } from '../apparences';

export const maison_ael: MapDef = {
  id: 'maison_ael',
  nom: "Maison d'Odile",
  acte: 1,
  ambiance: 'interieur',
  musique: 'foyer',
  solDefaut: 'w',
  plan: [
    'WWWWWWWWWWWW',
    'W1ww2wwww3wW',
    'WwwwwwwwwwwW',
    'Www@wxxxwwwW',
    'WwwwwxxxwOwW',
    'Www4wxxxwwwW',
    'WwwwwwwwwwwW',
    'WwwwwwAwwwwW',
    'WWWWWWDWWWWW',
  ],
  props: [
    { type: 'lit', ancre: '1', w: 1, h: 2 },
    { type: 'cheminee', ancre: '2', w: 2, h: 1 },
    { type: 'etagere', ancre: '3', w: 1, h: 1, evenement: 'maison_etagere' },
    { type: 'table', ancre: '4', w: 1, h: 1 },
  ],
  pnj: [
    { ancre: 'O', id: 'odile', nom: 'Odile', apparence: APP.odile, evenement: 'odile', dir: 'gauche' },
  ],
  portes: [{ ancre: 'D', vers: 'clairval', arrivee: 'B', dir: 'bas' }],
};
