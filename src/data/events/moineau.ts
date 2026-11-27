// Le Moineau, le voilier d'Aël : les caps proposés dépendent de l'avancée de l'histoire.
import type { Cmd, Script } from '../../core/story/script';

const VOILE: Cmd = { c: 'son', id: 'voile' };
const VERS = {
  port: { texte: 'Voguer vers Port-Venteux', faire: [VOILE, { c: 'teleporte', carte: 'port', ancre: 'B', dir: 'haut' }, { c: 'dit', texte: 'Cap sur Port-Venteux !' }] },
  clairval: { texte: 'Voguer vers Clairval', faire: [VOILE, { c: 'teleporte', carte: 'clairval', ancre: 'X', dir: 'haut' }, { c: 'dit', texte: 'Le courant de vent vous ramène à Clairval.' }] },
  ambrelune: { texte: 'Voguer vers Ambrelune', faire: [VOILE, { c: 'teleporte', carte: 'ambrelune', ancre: 'B', dir: 'haut' }, { c: 'dit', texte: 'Le Moineau file vers les dunes dorées.' }] },
  givrebourg: { texte: 'Voguer vers Givrebourg', faire: [VOILE, { c: 'teleporte', carte: 'givrebourg', ancre: 'B', dir: 'haut' }, { c: 'dit', texte: 'Le froid mord les doigts : voici les Cimes de Givre.' }] },
} satisfies Record<string, { texte: string; faire: Cmd[] }>;

type Ile = keyof typeof VERS;

/** Îles ouvertes à partir de chaque acte (l'ordre est celui des menus). */
const PAR_ACTE: readonly [string | null, readonly Ile[]][] = [
  ['acte4', ['clairval', 'port', 'ambrelune', 'givrebourg']],
  ['acte3', ['clairval', 'port', 'ambrelune']],
  [null, ['clairval', 'port']],
];

/** Choix du cap depuis l'île `ici` : on propose toujours de rester (premier choix). */
export function moineau(texte: string, ici: Ile, rester: string): Script {
  const choix = (iles: readonly Ile[]): Cmd => ({ c: 'choix', texte, options: [{ texte: rester, faire: [] }, ...iles.filter((i) => i !== ici).map((i) => VERS[i])] });
  let script: Cmd = choix(PAR_ACTE[PAR_ACTE.length - 1]![1]);
  for (let k = PAR_ACTE.length - 2; k >= 0; k--) {
    const [flag, iles] = PAR_ACTE[k]!;
    script = { c: 'si', cond: [flag!], alors: [choix(iles)], sinon: [script] };
  }
  return [script];
}
