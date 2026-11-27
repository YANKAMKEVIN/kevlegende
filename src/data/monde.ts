// Assemble le monde de Kevlegende : cartes, événements, boutiques, quêtes, objectifs.
import type { Monde } from '../core/monde';
import type { QuestDef } from '../core/types';
import { ACTE1_AVENTURE } from './events/acte1_aventure';
import { ACTE1_CLAIRVAL } from './events/acte1_clairval';
import { ACTE2 } from './events/acte2';
import { ACTE3_AMBRELUNE } from './events/acte3_ambrelune';
import { ACTE3_AVENTURE } from './events/acte3_aventure';
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
  { id: 'q_ambre', nom: 'Le Fanal des Sables', desc: "Traverser la Tempête Pâle et rallumer le Fanal au sommet de la Tour d'Ambre.", acte: 3, principale: true },
  { id: 'q_nour', nom: "L'astromancienne", desc: 'Retrouver Nour, la nièce du chef Amastan, aux Ruines de Sablon.', acte: 3, principale: true },
  { id: 'q_puits', nom: 'Les puits des dunes', desc: 'Dégager les trois vieux puits des Dunes Chantantes pour Tafat.', acte: 3, principale: false },
  { id: 'q_tablettes', nom: 'Les Tablettes du Soleil', desc: "Rapporter à Ilyes les trois tablettes d'argile cachées par les anciens.", acte: 3, principale: false },
  { id: 'q_ver', nom: 'Le Ver Ancien', desc: 'Réveiller et vaincre le Ver Ancien, sous les ossements des dunes, pour Kahina.', acte: 3, principale: false },
];

export const MONDE: Monde = {
  cartes: CARTES,
  evenements: { ...ACTE1_CLAIRVAL, ...ACTE1_AVENTURE, ...ACTE2, ...ACTE3_AMBRELUNE, ...ACTE3_AVENTURE },
  boutiques: {
    clairval: { nom: "L'Échoppe de Tilda", articles: ['herbe_douce', 'sel_ecume', 'gouttes_ciel', 'bombe_braise', 'fiole_givre', 'sabre_voile', 'arc_saule', 'veste_cuir'] },
    port_provisions: { nom: 'Provisions de Corentin', articles: ['herbe_douce', 'tonique', 'gouttes_ciel', 'sel_ecume', 'plume_aube', 'bombe_braise', 'fiole_givre', 'galet_tonnerre'] },
    port_armes: { nom: "L'Armurerie d'Ysolde", articles: ['lame_alize', 'arc_lune', 'masse_ancre', 'manteau_brume', 'cotte_legere', 'bague_vigueur', 'plume_vent', 'talisman_lueur'] },
    recifs: { nom: 'Le Bric-à-brac de Lou', articles: ['herbe_douce', 'tonique', 'gouttes_ciel', 'plume_aube', 'galet_tonnerre', 'elixir_vents'] },
    ambrelune_provisions: { nom: "L'Étal de Sadia", articles: ['tonique', 'datte_miel', 'gouttes_ciel', 'eau_oasis', 'sel_ecume', 'plume_aube', 'perle_pluie', 'galet_tonnerre', 'elixir_vents'] },
    ambrelune_armes: { nom: "L'Atelier de Yanis", articles: ['cimeterre_ambre', 'arc_soleil', 'marteau_dune', 'sceptre_aube', 'burnous_sable', 'cotte_legere', 'plume_vent', 'talisman_lueur'] },
    zahra: { nom: 'Les Trésors de Zahra', articles: ['collier_scarabee', 'boucle_corsaire', 'bague_vigueur', 'perle_pluie', 'elixir_soleil', 'plume_aube'] },
    canyon: { nom: 'Le Camp de Kahina', articles: ['tonique', 'datte_miel', 'eau_oasis', 'plume_aube', 'perle_pluie', 'elixir_soleil'] },
  },
  quetes: Object.fromEntries(QUETES.map((q) => [q.id, q])),
  objectifs: [
    { si: ['acte3_fini'], texte: "L'Acte IV arrive bientôt. Termine les quêtes des Sables d'Ambre en attendant !" },
    { si: ['mirage_vaincu'], texte: "Rallumer le Fanal des Sables, au sommet de la Tour d'Ambre." },
    { si: ['astrolabe_obtenu'], texte: "Traverser la Tempête Pâle, à l'est des dunes, puis le Canyon des Mirages jusqu'à la Tour d'Ambre." },
    { si: ['colosse_vaincu'], texte: "Prendre l'Astrolabe du Soleil sur l'autel de la Chambre du Soleil." },
    { si: ['temple_ouvert'], texte: 'Descendre dans le Tombeau du Soleil et lever la grille de la Chambre du Soleil.' },
    { si: ['nour_rejointe'], texte: 'Tourner les trois miroirs de bronze des ruines vers le soleil, avec Nour.' },
    { si: ['amastan_vu'], texte: 'Retrouver Nour aux Ruines de Sablon, au nord-ouest des Dunes Chantantes.' },
    { si: ['acte3'], texte: "Parler au chef Amastan, devant la grande tente d'Ambrelune." },
    { si: ['acte2_fini'], texte: 'Parler à Nell, au pied du Phare : les Sables d’Ambre vous attendent.' },
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
