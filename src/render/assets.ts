// Illustrations peintes (titre, portraits, décors et ennemis de combat), chargées à la demande.
// Le jeu reste jouable sans elles : chaque usage a un repli procédural.

/** Illustrations présentes dans public/art (vérifié par un test) : on ne demande jamais un fichier absent. */
export const ILLUSTRATIONS: ReadonlySet<string> = new Set([
  'ennemi_anguille_nuage',
  'ennemi_capitaine_creux',
  'ennemi_champi_dormeur',
  'ennemi_chauve_echo',
  'ennemi_crabe_cristal',
  'ennemi_crabe_recif',
  'ennemi_feu_follet',
  'ennemi_gelee_rosee',
  'ennemi_golem_mousse',
  'ennemi_grand_loup',
  'ennemi_kraken_brume',
  'ennemi_lievre_plume',
  'ennemi_loup_brume',
  'ennemi_meduse_ciel',
  'ennemi_mouette_pirate',
  'ennemi_ombre_errante',
  'ennemi_pie_voleuse',
  'ennemi_pirate_brume',
  'ennemi_sentinelle_voilee',
  'ennemi_serpent_echo',
  'fond_bois',
  'fond_col',
  'fond_colline',
  'fond_epave',
  'fond_grotte',
  'fond_phare',
  'fond_port',
  'fond_recifs',
  'fond_village',
  'portrait_ael',
  'portrait_bertille',
  'portrait_brann',
  'portrait_creux',
  'portrait_fendril',
  'portrait_fenouil',
  'portrait_gus',
  'portrait_maelle',
  'portrait_marin',
  'portrait_mira',
  'portrait_nell',
  'portrait_odile',
  'portrait_oswin',
  'portrait_pim',
  'portrait_pip',
  'portrait_roi',
  'portrait_rosa',
  'portrait_sentinelle',
  'portrait_tilda',
  'portrait_tobias',
  'portrait_villageois',
  'portrait_villageoise',
  'titre',
]);

const images = new Map<string, HTMLImageElement | null>();
const enCours = new Map<string, Promise<HTMLImageElement | null>>();

/** URL d'une illustration (dossier public/art, servi tel quel par Vite). */
export const urlArt = (id: string) => `./art/${id}.webp`;

export function chargerArt(id: string): Promise<HTMLImageElement | null> {
  const deja = enCours.get(id);
  if (deja) return deja;
  if (!ILLUSTRATIONS.has(id)) {
    images.set(id, null);
    return Promise.resolve(null);
  }
  const p = new Promise<HTMLImageElement | null>((ok) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      images.set(id, img);
      ok(img);
    };
    img.onerror = () => {
      images.set(id, null);
      ok(null);
    };
    img.src = urlArt(id);
  });
  enCours.set(id, p);
  return p;
}

/** Image si elle est déjà prête, sinon lance le chargement et renvoie null. */
export function art(id: string): HTMLImageElement | null {
  if (!images.has(id)) void chargerArt(id);
  return images.get(id) ?? null;
}

/** Décor de combat correspondant à une carte. */
export function fondCombat(carte: string): string {
  const table: Record<string, string> = {
    maison_ael: 'village',
    mairie: 'village',
    clairval: 'village',
    bois: 'bois',
    col: 'col',
    grotte1: 'grotte',
    grotte2: 'grotte',
    colline: 'colline',
    port: 'port',
    forge: 'port',
    recifs: 'recifs',
    epave: 'epave',
    phare: 'phare',
    ambrelune: 'oasis',
    dunes: 'dunes',
    ruines: 'ruines',
    tombeau: 'tombeau',
    canyon: 'canyon',
    fanal_sables: 'tour',
    givrebourg: 'givrebourg',
    pentes: 'pentes',
    lac_givre: 'lac',
    grotte_givre: 'grotte_givre',
    col_blizzard: 'blizzard',
    fanal_cimes: 'cimes',
    bordebrume: 'bordebrume',
    rivage_pale: 'rivage',
    aubefonde: 'aubefonde',
    jardins_lune: 'jardins',
    palais_pale: 'palais',
    fanal_premier: 'premier',
  };
  return `fond_${table[carte] ?? 'village'}`;
}

/** Toutes les illustrations du jeu (pour le préchargement en tâche de fond). */
export const ARTS: readonly string[] = [
  'titre',
  ...['ael', 'mira', 'brann', 'odile', 'fendril', 'tilda', 'rosa', 'fenouil', 'bertille', 'pim', 'gus', 'oswin', 'tobias', 'pip', 'maelle', 'marin', 'nell', 'creux', 'roi', 'sentinelle', 'villageois', 'villageoise', 'nour', 'amastan', 'azrou', 'kahina', 'tafat', 'ilyes', 'sadia', 'yanis', 'zahra', 'omar', 'assia', 'lalla', 'aubin', 'solene', 'gaspard', 'ines', 'agathe', 'joris', 'leon', 'mathis', 'helene', 'aurele', 'selene', 'corin', 'yse', 'lio', 'ambroise', 'basile', 'pia', 'tristan', 'lune', 'morvane', 'veilleur'].map((p) => `portrait_${p}`),
  ...['village', 'bois', 'col', 'grotte', 'colline', 'port', 'recifs', 'epave', 'phare', 'oasis', 'dunes', 'ruines', 'tombeau', 'canyon', 'tour', 'givrebourg', 'pentes', 'lac', 'grotte_givre', 'blizzard', 'cimes', 'bordebrume', 'rivage', 'aubefonde', 'jardins', 'palais', 'premier'].map((f) => `fond_${f}`),
];

/** Précharge les portraits puis les décors, quelques images à la fois, sans gêner le jeu. */
export async function prechargerTout(ennemis: readonly string[]): Promise<void> {
  const file = [...ARTS, ...ennemis.map((e) => `ennemi_${e}`)].filter((id) => ILLUSTRATIONS.has(id));
  const lot = 4;
  for (let i = 0; i < file.length; i += lot) await Promise.all(file.slice(i, i + lot).map(chargerArt));
}
