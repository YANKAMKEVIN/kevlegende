// Solution complète de l'aventure (histoire + quêtes secondaires), jouée par le bot.

export type Etape =
  | { type: 'parler'; carte: string; ancre: string; jusqua: string; niveau?: number }
  | { type: 'interagir'; carte: string; ancre: string; jusqua: string; niveau?: number }
  | { type: 'aller'; carte: string; ancre: string; jusqua: string; niveau?: number }
  | { type: 'coffres'; carte: string }
  | { type: 'boutique'; carte: string; ancre: string };

export interface PointRepos {
  carte: string;
  ancre: string;
  si: readonly string[];
}

export const REPOS: readonly PointRepos[] = [
  { carte: 'maison_ael', ancre: 'O', si: ['!acte2'] },
  { carte: 'col', ancre: 'J', si: ['!acte2'] },
  { carte: 'clairval', ancre: 'H', si: ['!acte2'] },
  { carte: 'port', ancre: 'H', si: ['acte2', '!acte3'] },
  { carte: 'recifs', ancre: 'M', si: ['acte2', '!acte3'] },
  { carte: 'ambrelune', ancre: 'H', si: ['acte3', '!acte4'] },
  { carte: 'canyon', ancre: 'K', si: ['acte3', '!acte4'] },
  { carte: 'givrebourg', ancre: 'H', si: ['acte4'] },
  { carte: 'col_blizzard', ancre: 'K', si: ['acte4', 'braises_reunies'] },
];

export const ACTE1: readonly Etape[] = [
  { type: 'parler', carte: 'mairie', ancre: 'M', jusqua: 'quete_mira' },
  { type: 'coffres', carte: 'mairie' },
  { type: 'parler', carte: 'clairval', ancre: 'J', jusqua: 'quete_poules' },
  { type: 'parler', carte: 'clairval', ancre: 'I', jusqua: 'quete_herbes' },
  { type: 'parler', carte: 'clairval', ancre: 'L', jusqua: 'quete_pip' },
  { type: 'parler', carte: 'clairval', ancre: 'N', jusqua: 'poule1' },
  { type: 'coffres', carte: 'clairval' },
  { type: 'boutique', carte: 'clairval', ancre: 'F' },
  { type: 'parler', carte: 'bois', ancre: 'P', jusqua: 'poule2' },
  { type: 'interagir', carte: 'bois', ancre: '4', jusqua: 'herbe1' },
  { type: 'interagir', carte: 'bois', ancre: '5', jusqua: 'herbe2' },
  { type: 'interagir', carte: 'bois', ancre: '6', jusqua: 'herbe3' },
  { type: 'coffres', carte: 'bois' },
  { type: 'aller', carte: 'bois', ancre: 'D', jusqua: 'mira_rejoint', niveau: 5 },
  { type: 'parler', carte: 'clairval', ancre: 'I', jusqua: 'herbes_rendues' },
  { type: 'parler', carte: 'mairie', ancre: 'M', jusqua: 'cle_obtenue' },
  { type: 'boutique', carte: 'clairval', ancre: 'F' },
  { type: 'coffres', carte: 'col' },
  { type: 'parler', carte: 'col', ancre: 'P', jusqua: 'poule3' },
  { type: 'parler', carte: 'clairval', ancre: 'J', jusqua: 'poules_rendues' },
  { type: 'parler', carte: 'col', ancre: 'J', jusqua: 'tobias_conseil' },
  { type: 'parler', carte: 'grotte1', ancre: 'K', jusqua: 'pip_sauve', niveau: 7 },
  { type: 'interagir', carte: 'grotte1', ancre: '1', jusqua: 'levier1' },
  { type: 'interagir', carte: 'grotte1', ancre: '2', jusqua: 'levier2' },
  { type: 'coffres', carte: 'grotte1' },
  { type: 'aller', carte: 'grotte2', ancre: 'D', jusqua: 'serpent_vaincu', niveau: 9 },
  { type: 'interagir', carte: 'grotte2', ancre: 'A', jusqua: 'eclat_obtenu' },
  { type: 'parler', carte: 'clairval', ancre: 'L', jusqua: 'pip_recompense' },
  { type: 'coffres', carte: 'colline' },
  { type: 'aller', carte: 'colline', ancre: 'D', jusqua: 'fanal1_allume', niveau: 11 },
  { type: 'parler', carte: 'colline', ancre: 'O', jusqua: 'acte2' },
];

export const ACTE2: readonly Etape[] = [
  { type: 'parler', carte: 'port', ancre: 'M', jusqua: 'maelle_vue' },
  { type: 'coffres', carte: 'port' },
  { type: 'parler', carte: 'forge', ancre: 'B', jusqua: 'brann_rejoint' },
  { type: 'parler', carte: 'port', ancre: 'N', jusqua: 'quete_pieces' },
  { type: 'boutique', carte: 'port', ancre: 'G' },
  { type: 'boutique', carte: 'port', ancre: 'F' },
  { type: 'interagir', carte: 'recifs', ancre: '5', jusqua: 'corail1', niveau: 11 },
  { type: 'interagir', carte: 'recifs', ancre: '6', jusqua: 'corail2' },
  { type: 'coffres', carte: 'recifs' },
  { type: 'aller', carte: 'epave', ancre: 'D', jusqua: 'creux_vaincu', niveau: 14 },
  { type: 'coffres', carte: 'epave' },
  { type: 'interagir', carte: 'recifs', ancre: '7', jusqua: 'corail3' },
  { type: 'interagir', carte: 'forge', ancre: '3', jusqua: 'corail_forge' },
  { type: 'parler', carte: 'port', ancre: 'N', jusqua: 'pieces_rendues' },
  { type: 'boutique', carte: 'port', ancre: 'G' },
  { type: 'boutique', carte: 'port', ancre: 'F' },
  { type: 'coffres', carte: 'phare' },
  { type: 'aller', carte: 'phare', ancre: 'D', jusqua: 'kraken_vaincu', niveau: 17 },
  { type: 'parler', carte: 'phare', ancre: 'N', jusqua: 'acte2_fini' },
];

export const ACTE3: readonly Etape[] = [
  { type: 'parler', carte: 'ambrelune', ancre: 'J', jusqua: 'amastan_vu' },
  { type: 'coffres', carte: 'ambrelune' },
  { type: 'parler', carte: 'ambrelune', ancre: 'H', jusqua: 'quete_puits' },
  { type: 'parler', carte: 'ambrelune', ancre: 'I', jusqua: 'quete_tablettes' },
  { type: 'boutique', carte: 'ambrelune', ancre: 'G' },
  { type: 'boutique', carte: 'ambrelune', ancre: 'F' },
  { type: 'parler', carte: 'dunes', ancre: 'M', jusqua: 'omar_aide' },
  { type: 'interagir', carte: 'dunes', ancre: '1', jusqua: 'puits1', niveau: 18 },
  { type: 'interagir', carte: 'dunes', ancre: '2', jusqua: 'puits2' },
  { type: 'interagir', carte: 'dunes', ancre: '3', jusqua: 'puits3' },
  { type: 'coffres', carte: 'dunes' },
  { type: 'parler', carte: 'ambrelune', ancre: 'H', jusqua: 'puits_rendus' },
  { type: 'aller', carte: 'ruines', ancre: 'D', jusqua: 'nour_rejointe', niveau: 19 },
  { type: 'interagir', carte: 'ruines', ancre: '1', jusqua: 'miroir1' },
  { type: 'interagir', carte: 'ruines', ancre: '2', jusqua: 'miroir2' },
  { type: 'interagir', carte: 'ruines', ancre: '3', jusqua: 'miroir3' },
  { type: 'coffres', carte: 'ruines' },
  { type: 'interagir', carte: 'tombeau', ancre: '1', jusqua: 'levier_t1', niveau: 20 },
  { type: 'interagir', carte: 'tombeau', ancre: '2', jusqua: 'levier_t2' },
  { type: 'coffres', carte: 'tombeau' },
  { type: 'aller', carte: 'tombeau', ancre: 'D', jusqua: 'colosse_vaincu', niveau: 23 },
  { type: 'interagir', carte: 'tombeau', ancre: 'A', jusqua: 'astrolabe_obtenu' },
  { type: 'boutique', carte: 'ambrelune', ancre: 'G' },
  { type: 'boutique', carte: 'ambrelune', ancre: 'M' },
  { type: 'parler', carte: 'canyon', ancre: 'K', jusqua: 'quete_ver' },
  { type: 'parler', carte: 'canyon', ancre: 'M', jusqua: 'silhouette_vue' },
  { type: 'coffres', carte: 'canyon' },
  { type: 'parler', carte: 'ambrelune', ancre: 'I', jusqua: 'tablettes_rendues' },
  { type: 'boutique', carte: 'ambrelune', ancre: 'G' },
  { type: 'coffres', carte: 'fanal_sables' },
  { type: 'aller', carte: 'fanal_sables', ancre: 'D', jusqua: 'mirage_vaincu', niveau: 26 },
  { type: 'interagir', carte: 'dunes', ancre: 'O', jusqua: 'ver_vaincu', niveau: 28 },
  { type: 'interagir', carte: 'fanal_sables', ancre: '1', jusqua: 'acte3_fini' },
];

export const ACTE4: readonly Etape[] = [
  { type: 'parler', carte: 'givrebourg', ancre: 'J', jusqua: 'aubin_vu' },
  { type: 'coffres', carte: 'givrebourg' },
  { type: 'parler', carte: 'givrebourg', ancre: 'H', jusqua: 'soupe_solene' },
  { type: 'parler', carte: 'givrebourg', ancre: 'K', jusqua: 'quete_yaks' },
  { type: 'parler', carte: 'givrebourg', ancre: 'I', jusqua: 'quete_fleurs' },
  { type: 'boutique', carte: 'givrebourg', ancre: 'G' },
  { type: 'boutique', carte: 'givrebourg', ancre: 'F' },
  { type: 'interagir', carte: 'pentes', ancre: '1', jusqua: 'yak1', niveau: 30 },
  { type: 'interagir', carte: 'pentes', ancre: '2', jusqua: 'yak2' },
  { type: 'interagir', carte: 'pentes', ancre: '3', jusqua: 'yak3' },
  { type: 'coffres', carte: 'pentes' },
  { type: 'aller', carte: 'pentes', ancre: 'D', jusqua: 'yeti_vaincu', niveau: 31 },
  { type: 'interagir', carte: 'pentes', ancre: 'Z', jusqua: 'braise1' },
  { type: 'parler', carte: 'givrebourg', ancre: 'K', jusqua: 'yaks_rendus' },
  { type: 'parler', carte: 'lac_givre', ancre: 'M', jusqua: 'mathis_vu' },
  { type: 'coffres', carte: 'lac_givre' },
  { type: 'aller', carte: 'lac_givre', ancre: 'D', jusqua: 'serpent_givre_vaincu', niveau: 33 },
  { type: 'interagir', carte: 'lac_givre', ancre: 'Z', jusqua: 'braise2' },
  { type: 'interagir', carte: 'grotte_givre', ancre: '1', jusqua: 'brasero_g1', niveau: 33 },
  { type: 'interagir', carte: 'grotte_givre', ancre: '2', jusqua: 'brasero_g2' },
  { type: 'interagir', carte: 'grotte_givre', ancre: '3', jusqua: 'brasero_g3' },
  { type: 'aller', carte: 'grotte_givre', ancre: 'D', jusqua: 'chevalier_vaincu', niveau: 35 },
  { type: 'interagir', carte: 'grotte_givre', ancre: 'Z', jusqua: 'braise3' },
  { type: 'coffres', carte: 'grotte_givre' },
  { type: 'parler', carte: 'givrebourg', ancre: 'I', jusqua: 'fleurs_rendues' },
  { type: 'boutique', carte: 'givrebourg', ancre: 'G' },
  { type: 'parler', carte: 'givrebourg', ancre: 'J', jusqua: 'braises_reunies' },
  { type: 'parler', carte: 'col_blizzard', ancre: 'K', jusqua: 'quete_wyverne' },
  { type: 'coffres', carte: 'col_blizzard' },
  { type: 'boutique', carte: 'givrebourg', ancre: 'F' },
  { type: 'coffres', carte: 'fanal_cimes' },
  { type: 'aller', carte: 'fanal_cimes', ancre: 'D', jusqua: 'reflet_vaincu', niveau: 38 },
  { type: 'interagir', carte: 'fanal_cimes', ancre: 'H', jusqua: 'aurele_libre' },
  { type: 'parler', carte: 'fanal_cimes', ancre: 'A', jusqua: 'pendentif_aurele' },
  { type: 'interagir', carte: 'col_blizzard', ancre: 'O', jusqua: 'wyverne_vaincue', niveau: 42 },
  { type: 'interagir', carte: 'fanal_cimes', ancre: '1', jusqua: 'acte4_fini' },
];

export const AVENTURE: readonly Etape[] = [...ACTE1, ...ACTE2, ...ACTE3, ...ACTE4];
