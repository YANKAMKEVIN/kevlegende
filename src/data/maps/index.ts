// Registre de toutes les cartes.
import type { MapDef } from '../../core/world/mapdef';
import { bois } from './acte1/bois';
import { clairval } from './acte1/clairval';
import { col } from './acte1/col';
import { colline } from './acte1/colline';
import { grotte1 } from './acte1/grotte1';
import { grotte2 } from './acte1/grotte2';
import { mairie } from './acte1/mairie';
import { maison_ael } from './acte1/maison_ael';
import { epave } from './acte2/epave';
import { forge } from './acte2/forge';
import { phare } from './acte2/phare';
import { port } from './acte2/port';
import { recifs } from './acte2/recifs';
import { ambrelune } from './acte3/ambrelune';
import { canyon } from './acte3/canyon';
import { dunes } from './acte3/dunes';
import { fanal_sables } from './acte3/fanal_sables';
import { ruines } from './acte3/ruines';
import { tombeau } from './acte3/tombeau';
import { col_blizzard } from './acte4/col_blizzard';
import { fanal_cimes } from './acte4/fanal_cimes';
import { givrebourg } from './acte4/givrebourg';
import { grotte_givre } from './acte4/grotte_givre';
import { lac_givre } from './acte4/lac_givre';
import { pentes } from './acte4/pentes';

const L: MapDef[] = [maison_ael, clairval, mairie, bois, col, grotte1, grotte2, colline, port, forge, recifs, epave, phare, ambrelune, dunes, ruines, tombeau, canyon, fanal_sables, givrebourg, pentes, lac_givre, grotte_givre, col_blizzard, fanal_cimes];

export const CARTES: Readonly<Record<string, MapDef>> = Object.fromEntries(L.map((m) => [m.id, m]));
