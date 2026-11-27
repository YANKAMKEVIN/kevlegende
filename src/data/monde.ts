// Assemble le monde de Kevlegende : cartes, événements, boutiques, quêtes, objectifs.
import type { Monde } from '../core/monde';
import type { QuestDef } from '../core/types';
import { ACTE1_AVENTURE } from './events/acte1_aventure';
import { ACTE1_CLAIRVAL } from './events/acte1_clairval';
import { ACTE2 } from './events/acte2';
import { CARTES } from './maps';

const QUETES: QuestDef[] = [
  { id: 'q_fanal', nom: 'Le Fanal qui vacille', desc: 'Raviver la flamme du Fanal de Clairval au Cœur des Échos.', acte: 1, principale: true },
  { id: 'q_mira', nom: 'La cartographe disparue', desc: 'Retrouver Mira dans le Bois Murmurant pour obtenir la Clé des Échos.', acte: 1, principale: true },
  { id: 'q_herbes', nom: 'Herbes-Lune', desc: 'Rapporter trois Herbes-Lune du Bois Murmurant à Fenouil.', acte: 1, principale: false },
  { id: 'q_poules', nom: 'Les poules fugueuses', desc: 'Retrouver les trois poules de Bertille (village, bois, col).', acte: 1, principale: false },
  { id: 'q_pip', nom: 'Le fils du pêcheur', desc: 'Retrouver Pip, perdu dans la Grotte des Échos.', acte: 1, principale: false },
  { id: 'q_recifs', nom: 'Les Récifs Célestes', desc: 'Briser le blocus de Creux et rallumer le Phare des Récifs.', acte: 2, principale: true },
  { id: 'q_corail', nom: 'Corail céleste', desc: 'Rapporter trois branches de corail céleste à la forge de Brann.', acte: 2, principale: false },
  { id: 'q_pieces', nom: 'Les pièces du Fendeur', desc: "Trouver les trois pièces anciennes de l'Épave pour Anselme.", acte: 2, principale: false },
];

export const MONDE: Monde = {
  cartes: CARTES,
  evenements: { ...ACTE1_CLAIRVAL, ...ACTE1_AVENTURE, ...ACTE2 },
  boutiques: {
    clairval: { nom: "L'Échoppe de Tilda", articles: ['herbe_douce', 'sel_ecume', 'gouttes_ciel', 'bombe_braise', 'fiole_givre', 'sabre_voile', 'arc_saule', 'veste_cuir'] },
    port_provisions: { nom: 'Provisions de Corentin', articles: ['herbe_douce', 'tonique', 'gouttes_ciel', 'sel_ecume', 'plume_aube', 'bombe_braise', 'fiole_givre', 'galet_tonnerre'] },
    port_armes: { nom: "L'Armurerie d'Ysolde", articles: ['lame_alize', 'arc_lune', 'masse_ancre', 'manteau_brume', 'cotte_legere', 'bague_vigueur', 'plume_vent', 'talisman_lueur'] },
    recifs: { nom: 'Le Bric-à-brac de Lou', articles: ['herbe_douce', 'tonique', 'gouttes_ciel', 'plume_aube', 'galet_tonnerre', 'elixir_vents'] },
  },
  quetes: Object.fromEntries(QUETES.map((q) => [q.id, q])),
  objectifs: [
    { si: ['acte2_fini'], texte: "L'Acte III arrive bientôt. Termine les quêtes secondaires en attendant !" },
    { si: ['kraken_vaincu'], texte: 'Parler à Nell, au pied du Phare.' },
    { si: ['creux_vaincu'], texte: 'Franchir la chaîne de la Passe et rejoindre le Phare des Récifs, à l’est.' },
    { si: ['brann_rejoint'], texte: "Explorer les Récifs Célestes et prendre d'assaut l'Épave du Fendeur, au nord-est." },
    { si: ['maelle_vue'], texte: 'Trouver Brann dans sa forge, à l’ouest du port.' },
    { si: ['acte2'], texte: 'Parler à Maëlle, la capitaine du port.' },
    { si: ['fanal1_allume'], texte: 'Parler à Odile au pied du Fanal.' },
    { si: ['eclat_obtenu'], texte: "Rapporter la flamme au Fanal, sur la colline à l'est de Clairval." },
    { si: ['serpent_vaincu'], texte: "Recueillir la flamme sur l'autel du Cœur des Échos." },
    { si: ['grille_ouverte'], texte: 'Descendre au Cœur des Échos, au fond de la grotte.' },
    { si: ['grotte_ouverte'], texte: 'Gravir le Col du Vent, au nord, et explorer la Grotte des Échos.' },
    { si: ['mira_rejoint'], texte: 'Retourner voir le maire Fendril avec Mira.' },
    { si: ['quete_mira'], texte: "Retrouver Mira dans le Bois Murmurant, à l'ouest du village." },
    { si: ['intro_vue'], texte: 'Parler au maire Fendril, à la mairie au nord du village.' },
  ],
  depart: { carte: 'maison_ael', ancre: '@', evenement: 'intro' },
};
