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
  { carte: 'port', ancre: 'H', si: ['acte2'] },
  { carte: 'recifs', ancre: 'M', si: ['acte2'] },
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

export const AVENTURE: readonly Etape[] = [...ACTE1, ...ACTE2];
