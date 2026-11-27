// La forge de Brann, Port-Venteux.
import type { MapDef } from '../../../core/world/mapdef';
import { APP } from '../apparences';

export const forge: MapDef = {
  id: 'forge',
  nom: 'Forge de Brann',
  acte: 2,
  ambiance: 'interieur',
  musique: 'foyer',
  solDefaut: 'w',
  plan: [
    'WWWWWWWWWWWW',
    'W1wwww2wwwwW',
    'WwwwwwwwwwwW',
    'Www3wwwwBwwW',
    'WwwwwwwwwwwW',
    'W4wwwwwwww5W',
    'WwwwwwAwwwwW',
    'WWWWWWDWWWWW',
  ],
  props: [
    { type: 'cheminee', ancre: '1', w: 2, h: 1, evenement: 'forge_foyer' },
    { type: 'etagere', ancre: '2', w: 2, h: 1 },
    { type: 'enclume', ancre: '3', evenement: 'forge_enclume' },
    { type: 'tonneau', ancre: '4' },
    { type: 'caisse', ancre: '5' },
  ],
  pnj: [{ ancre: 'B', id: 'brann', nom: 'Brann', apparence: APP.brann, evenement: 'brann', dir: 'gauche', si: ['!brann_rejoint'] }],
  portes: [{ ancre: 'D', vers: 'port', arrivee: 'E', dir: 'bas' }],
};
