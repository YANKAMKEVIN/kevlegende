// Illustrations peintes (titre, portraits, décors et ennemis de combat), chargées à la demande.
// Le jeu reste jouable sans elles : chaque usage a un repli procédural.

/** Illustrations présentes dans public/art (vérifié par un test) : on ne demande jamais un fichier absent. */
export const ILLUSTRATIONS: ReadonlySet<string> = new Set([
  'ennemi_anguille_nuage',
  'ennemi_capitaine_creux',
  'ennemi_chacal_mirage',
  'ennemi_champi_dormeur',
  'ennemi_chauve_echo',
  'ennemi_chevalier_givre',
  'ennemi_chevalier_glace',
  'ennemi_chien_brume',
  'ennemi_cloche_sommeil',
  'ennemi_coeur_brume',
  'ennemi_colosse_ambre',
  'ennemi_corbeau_pale',
  'ennemi_crabe_brume',
  'ennemi_crabe_cristal',
  'ennemi_crabe_glace',
  'ennemi_crabe_recif',
  'ennemi_djinn_brume',
  'ennemi_dormeur_errant',
  'ennemi_feu_follet',
  'ennemi_flamme_solaire',
  'ennemi_garde_pale',
  'ennemi_gardien_sablon',
  'ennemi_gelee_brume',
  'ennemi_gelee_givre',
  'ennemi_gelee_rosee',
  'ennemi_gelee_sable',
  'ennemi_golem_cendre',
  'ennemi_golem_gres',
  'ennemi_golem_mousse',
  'ennemi_grand_loup',
  'ennemi_grand_yeti',
  'ennemi_harfang',
  'ennemi_kraken_brume',
  'ennemi_leviathan',
  'ennemi_lievre_plume',
  'ennemi_loup_brume',
  'ennemi_loup_givre',
  'ennemi_meduse_ciel',
  'ennemi_mirage',
  'ennemi_mouette_pirate',
  'ennemi_ombre_cendre',
  'ennemi_ombre_errante',
  'ennemi_ours_neige',
  'ennemi_passeur',
  'ennemi_pie_voleuse',
  'ennemi_pirate_brume',
  'ennemi_reflet_roi',
  'ennemi_roi_pale',
  'ennemi_ronce_mere',
  'ennemi_scorpion_ambre',
  'ennemi_scorpion_roi',
  'ennemi_senechal',
  'ennemi_sentinelle_voilee',
  'ennemi_serpent_brume',
  'ennemi_serpent_echo',
  'ennemi_serpent_givre',
  'ennemi_serpent_glace',
  'ennemi_spectre_givre',
  'ennemi_vautour_cendre',
  'ennemi_ver_ancien',
  'ennemi_ver_sable',
  'ennemi_wyverne_givre',
  'fond_aubefonde',
  'fond_blizzard',
  'fond_bois',
  'fond_bordebrume',
  'fond_canyon',
  'fond_cimes',
  'fond_col',
  'fond_colline',
  'fond_dunes',
  'fond_epave',
  'fond_givrebourg',
  'fond_grotte',
  'fond_grotte_givre',
  'fond_jardins',
  'fond_lac',
  'fond_oasis',
  'fond_palais',
  'fond_pentes',
  'fond_phare',
  'fond_port',
  'fond_premier',
  'fond_recifs',
  'fond_rivage',
  'fond_ruines',
  'fond_tombeau',
  'fond_tour',
  'fond_village',
  'portrait_ael',
  'portrait_agathe',
  'portrait_amastan',
  'portrait_ambroise',
  'portrait_assia',
  'portrait_aubin',
  'portrait_aurele',
  'portrait_azrou',
  'portrait_basile',
  'portrait_bertille',
  'portrait_brann',
  'portrait_corin',
  'portrait_creux',
  'portrait_fendril',
  'portrait_fenouil',
  'portrait_gaspard',
  'portrait_gus',
  'portrait_helene',
  'portrait_ilyes',
  'portrait_ines',
  'portrait_joris',
  'portrait_kahina',
  'portrait_lalla',
  'portrait_leon',
  'portrait_lio',
  'portrait_lune',
  'portrait_maelle',
  'portrait_marin',
  'portrait_mathis',
  'portrait_mira',
  'portrait_morvane',
  'portrait_nell',
  'portrait_nour',
  'portrait_odile',
  'portrait_omar',
  'portrait_oswin',
  'portrait_pia',
  'portrait_pim',
  'portrait_pip',
  'portrait_roi',
  'portrait_rosa',
  'portrait_sadia',
  'portrait_selene',
  'portrait_sentinelle',
  'portrait_solene',
  'portrait_tafat',
  'portrait_tilda',
  'portrait_tobias',
  'portrait_tristan',
  'portrait_veilleur',
  'portrait_villageois',
  'portrait_villageoise',
  'portrait_yanis',
  'portrait_yse',
  'portrait_zahra',
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
