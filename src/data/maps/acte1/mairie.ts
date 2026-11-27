// La mairie de Clairval.
import type { MapDef } from '../../../core/world/mapdef';
import { APP } from '../apparences';

export const mairie: MapDef = {
  id: 'mairie',
  nom: 'Mairie de Clairval',
  acte: 1,
  ambiance: 'interieur',
  musique: 'foyer',
  solDefaut: 'w',
  plan: [
    'WWWWWWWWWWWWWW',
    'W1wwww2wwww3wW',
    'WwwwwwwwwwwwwW',
    'WwwxxxxxxxxwwW',
    'WwwxxxxMxxxwwW',
    'WwwxxxxxxxxwwW',
    'W4wwwwwwwwwwwW',
    'WwwwwwwAwwww0W',
    'WWWWWWWDWWWWWW',
  ],
  props: [
    { type: 'etagere', ancre: '1', w: 2, h: 1 },
    { type: 'comptoir', ancre: '2', w: 3, h: 1 },
    { type: 'etagere', ancre: '3', w: 2, h: 1 },
    { type: 'tonneau', ancre: '4' },
  ],
  pnj: [{ ancre: 'M', id: 'fendril', nom: 'Maire Fendril', apparence: APP.fendril, evenement: 'fendril' }],
  coffres: [{ ancre: '0', id: 'c1', objet: 'gouttes_ciel', n: 2 }],
  portes: [{ ancre: 'D', vers: 'clairval', arrivee: 'E', dir: 'bas' }],
};
