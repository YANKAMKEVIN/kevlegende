// Compétences des héros et des ennemis.
import type { SkillDef } from '../core/types';

const L: SkillDef[] = [
  // --- Attaques de base ---
  { id: 'attaque', nom: 'Attaque', desc: "Un coup avec l'arme équipée.", cout: 0, cible: 'ennemi', type: 'physique', element: 'neutre', puissance: 10 },
  // --- Aël, apprenti voilier ---
  { id: 'tranche_vent', nom: 'Tranche-Vent', desc: 'Une lame portée par la brise. Vent.', cout: 3, cible: 'ennemi', type: 'physique', element: 'vent', puissance: 14 },
  { id: 'second_souffle', nom: 'Second Souffle', desc: 'Reprend son élan : Hâte pendant 3 tours.', cout: 4, cible: 'soi', type: 'soutien', element: 'neutre', puissance: 0, statut: { id: 'hate', chance: 1, tours: 3 } },
  { id: 'lame_tourbillon', nom: 'Lame Tourbillon', desc: 'Frappe tous les ennemis. Vent.', cout: 7, cible: 'ennemis', type: 'physique', element: 'vent', puissance: 10 },
  { id: 'coupe_brume', nom: 'Coupe-Brume', desc: 'Une entaille de lumière. Lumière.', cout: 6, cible: 'ennemi', type: 'physique', element: 'lumiere', puissance: 17 },
  { id: 'rafale_triple', nom: 'Rafale Triple', desc: 'Trois coups rapides. Vent.', cout: 10, cible: 'ennemi', type: 'physique', element: 'vent', puissance: 8, coups: 3 },
  { id: 'aube_tranchante', nom: 'Aube Tranchante', desc: "L'art ultime des voiliers. Lumière, tous.", cout: 18, cible: 'ennemis', type: 'physique', element: 'lumiere', puissance: 18 },
  // --- Mira, cartographe guérisseuse ---
  { id: 'baume', nom: 'Baume', desc: 'Soigne un allié.', cout: 3, cible: 'allie', type: 'soin', element: 'lumiere', puissance: 20 },
  { id: 'fleche_givre', nom: 'Flèche de Givre', desc: 'Une flèche glacée. Eau.', cout: 3, cible: 'ennemi', type: 'magique', element: 'eau', puissance: 14 },
  { id: 'fleche_ardente', nom: 'Flèche Ardente', desc: 'Une flèche enflammée. Feu.', cout: 4, cible: 'ennemi', type: 'magique', element: 'feu', puissance: 15 },
  { id: 'brise_douce', nom: 'Brise Douce', desc: 'Soigne tout le groupe.', cout: 8, cible: 'allies', type: 'soin', element: 'lumiere', puissance: 14 },
  { id: 'eveil', nom: 'Éveil', desc: 'Relève un allié tombé.', cout: 10, cible: 'allieKO', type: 'reveil', element: 'lumiere', puissance: 10 },
  { id: 'purification', nom: 'Purification', desc: 'Soigne et retire les altérations.', cout: 5, cible: 'allie', type: 'soin', element: 'lumiere', puissance: 12, purifie: true },
  { id: 'pluie_fleches', nom: 'Pluie de Flèches', desc: 'Arrose tous les ennemis. Eau.', cout: 12, cible: 'ennemis', type: 'magique', element: 'eau', puissance: 13 },
  { id: 'benediction', nom: 'Bénédiction', desc: 'Soigne largement tout le groupe.', cout: 14, cible: 'allies', type: 'soin', element: 'lumiere', puissance: 22 },
  // --- Brann, forgeron du port ---
  { id: 'coup_marteau', nom: 'Coup de Marteau', desc: 'Un coup lourd. Terre.', cout: 3, cible: 'ennemi', type: 'physique', element: 'terre', puissance: 16 },
  { id: 'rempart', nom: 'Rempart', desc: 'Protège tout le groupe pendant 3 tours.', cout: 6, cible: 'allies', type: 'soutien', element: 'neutre', puissance: 0, statut: { id: 'protege', chance: 1, tours: 3 } },
  { id: 'braise', nom: 'Braise', desc: 'Projette des escarbilles. Feu, tous.', cout: 7, cible: 'ennemis', type: 'magique', element: 'feu', puissance: 11 },
  { id: 'seisme', nom: 'Séisme', desc: 'Fend le sol. Terre, tous.', cout: 12, cible: 'ennemis', type: 'physique', element: 'terre', puissance: 15 },
  { id: 'forge_ardente', nom: 'Forge Ardente', desc: 'Un coup chauffé à blanc. Feu.', cout: 10, cible: 'ennemi', type: 'physique', element: 'feu', puissance: 24 },
  { id: 'cri_forge', nom: 'Cri de Forge', desc: 'Affaiblit un ennemi pendant 3 tours.', cout: 4, cible: 'ennemi', type: 'soutien', element: 'neutre', puissance: 0, statut: { id: 'affaibli', chance: 0.9, tours: 3 } },
  { id: 'tempete_lames', nom: 'Tempête de Lames', desc: 'Un cyclone de coups. Vent, tous.', cout: 15, cible: 'ennemis', type: 'physique', element: 'vent', puissance: 16 },
  // --- Nour, astromancienne des sables ---
  { id: 'eclat_solaire', nom: 'Éclat Solaire', desc: 'Un rayon de soleil concentré. Lumière.', cout: 4, cible: 'ennemi', type: 'magique', element: 'lumiere', puissance: 15 },
  { id: 'tempete_sable', nom: 'Tempête de Sable', desc: 'Fouette tous les ennemis. Terre.', cout: 8, cible: 'ennemis', type: 'magique', element: 'terre', puissance: 11 },
  { id: 'voile_etoile', nom: "Voile d'Étoiles", desc: 'Accélère tout le groupe pendant 2 tours.', cout: 14, cible: 'allies', type: 'soutien', element: 'neutre', puissance: 0, statut: { id: 'hate', chance: 1, tours: 2 } },
  { id: 'etoile_filante', nom: 'Étoile Filante', desc: 'Une étoile tombe sur un ennemi. Lumière.', cout: 13, cible: 'ennemi', type: 'magique', element: 'lumiere', puissance: 27 },
  { id: 'nova', nom: 'Nova', desc: 'Un soleil éclate au-dessus des ennemis. Lumière, tous.', cout: 20, cible: 'ennemis', type: 'magique', element: 'lumiere', puissance: 19 },
  // --- Acte IV ---
  { id: 'marteau_volcan', nom: 'Marteau-Volcan', desc: 'La forge entière dans un seul coup. Feu, tous.', cout: 18, cible: 'ennemis', type: 'physique', element: 'feu', puissance: 20 },
  { id: 'aurore', nom: 'Aurore', desc: 'Une lumière boréale soigne tout le groupe.', cout: 22, cible: 'allies', type: 'soin', element: 'lumiere', puissance: 32 },
  { id: 'tranche_aurore', nom: "Tranche-Aurore", desc: 'Une lame chargée de lumière boréale. Lumière.', cout: 16, cible: 'ennemi', type: 'physique', element: 'lumiere', puissance: 32 },
  { id: 'pluie_meteores', nom: 'Pluie de Météores', desc: 'Des étoiles s’abattent sur les ennemis. Lumière, tous.', cout: 28, cible: 'ennemis', type: 'magique', element: 'lumiere', puissance: 25 },
  // --- Ennemis ---
  { id: 'e_charge', nom: 'Charge', desc: '', cout: 0, cible: 'ennemi', type: 'physique', element: 'neutre', puissance: 11 },
  { id: 'e_morsure', nom: 'Morsure', desc: '', cout: 0, cible: 'ennemi', type: 'physique', element: 'neutre', puissance: 13 },
  { id: 'e_spores', nom: 'Spores', desc: '', cout: 0, cible: 'ennemi', type: 'magique', element: 'terre', puissance: 6, statut: { id: 'sommeil', chance: 0.45, tours: 2 } },
  { id: 'e_dard', nom: 'Dard', desc: '', cout: 0, cible: 'ennemi', type: 'physique', element: 'neutre', puissance: 8, statut: { id: 'poison', chance: 0.5, tours: 4 } },
  { id: 'e_hurlement', nom: 'Hurlement', desc: '', cout: 0, cible: 'ennemis', type: 'magique', element: 'ombre', puissance: 7 },
  { id: 'e_ecume', nom: "Jet d'écume", desc: '', cout: 0, cible: 'ennemi', type: 'magique', element: 'eau', puissance: 12 },
  { id: 'e_flamme', nom: 'Flammèche', desc: '', cout: 0, cible: 'ennemi', type: 'magique', element: 'feu', puissance: 12 },
  { id: 'e_rafale', nom: 'Rafale', desc: '', cout: 0, cible: 'ennemis', type: 'magique', element: 'vent', puissance: 8 },
  { id: 'e_eboulis', nom: 'Éboulis', desc: '', cout: 0, cible: 'ennemis', type: 'physique', element: 'terre', puissance: 9 },
  { id: 'e_pince', nom: 'Pince', desc: '', cout: 0, cible: 'ennemi', type: 'physique', element: 'neutre', puissance: 14 },
  { id: 'e_ombre', nom: 'Voile Noir', desc: '', cout: 0, cible: 'ennemi', type: 'magique', element: 'ombre', puissance: 14 },
  { id: 'e_echo', nom: 'Écho Strident', desc: '', cout: 0, cible: 'ennemis', type: 'magique', element: 'vent', puissance: 11 },
  { id: 'e_constriction', nom: 'Étreinte', desc: '', cout: 0, cible: 'ennemi', type: 'physique', element: 'neutre', puissance: 18 },
  { id: 'e_brume', nom: 'Brume Lourde', desc: '', cout: 0, cible: 'ennemis', type: 'magique', element: 'ombre', puissance: 10, statut: { id: 'affaibli', chance: 0.35, tours: 2 } },
  { id: 'e_lame', nom: 'Lame Voilée', desc: '', cout: 0, cible: 'ennemi', type: 'physique', element: 'ombre', puissance: 17 },
  { id: 'e_garde', nom: 'Garde', desc: '', cout: 0, cible: 'soi', type: 'soutien', element: 'neutre', puissance: 0, statut: { id: 'protege', chance: 1, tours: 2 } },
  { id: 'e_vol', nom: 'Larcin', desc: '', cout: 0, cible: 'ennemi', type: 'physique', element: 'neutre', puissance: 7 },
  { id: 'e_tentacules', nom: 'Tentacules', desc: '', cout: 0, cible: 'ennemis', type: 'physique', element: 'eau', puissance: 12 },
  { id: 'e_maree', nom: 'Marée Noire', desc: '', cout: 0, cible: 'ennemis', type: 'magique', element: 'eau', puissance: 15, statut: { id: 'poison', chance: 0.3, tours: 3 } },
  { id: 'e_tempete', nom: 'Tempête de Sable', desc: '', cout: 0, cible: 'ennemis', type: 'magique', element: 'terre', puissance: 13, statut: { id: 'affaibli', chance: 0.2, tours: 2 } },
  { id: 'e_rayon', nom: 'Rayon Ardent', desc: '', cout: 0, cible: 'ennemi', type: 'magique', element: 'feu', puissance: 20 },
  { id: 'e_mirage', nom: 'Mirage', desc: '', cout: 0, cible: 'ennemi', type: 'magique', element: 'ombre', puissance: 18, statut: { id: 'sommeil', chance: 0.3, tours: 2 } },
  { id: 'e_soif', nom: 'Soif Brûlante', desc: '', cout: 0, cible: 'ennemis', type: 'magique', element: 'feu', puissance: 14, statut: { id: 'poison', chance: 0.3, tours: 3 } },
  { id: 'e_seisme', nom: 'Secousse', desc: '', cout: 0, cible: 'ennemis', type: 'physique', element: 'terre', puissance: 15 },
  { id: 'e_griffes', nom: 'Griffes', desc: '', cout: 0, cible: 'ennemi', type: 'physique', element: 'neutre', puissance: 21 },
  { id: 'e_givre', nom: 'Souffle Gelé', desc: '', cout: 0, cible: 'ennemi', type: 'magique', element: 'eau', puissance: 22, statut: { id: 'sommeil', chance: 0.2, tours: 2 } },
  { id: 'e_blizzard', nom: 'Blizzard', desc: '', cout: 0, cible: 'ennemis', type: 'magique', element: 'eau', puissance: 16, statut: { id: 'affaibli', chance: 0.2, tours: 2 } },
  { id: 'e_avalanche', nom: 'Avalanche', desc: '', cout: 0, cible: 'ennemis', type: 'physique', element: 'terre', puissance: 18 },
  { id: 'e_couronne', nom: 'Couronne Pâle', desc: '', cout: 0, cible: 'ennemis', type: 'magique', element: 'ombre', puissance: 21, statut: { id: 'affaibli', chance: 0.3, tours: 2 } },
  { id: 'e_engloutir', nom: 'Engloutir', desc: '', cout: 0, cible: 'ennemi', type: 'physique', element: 'neutre', puissance: 26 },
];

export const SKILLS: Readonly<Record<string, SkillDef>> = Object.fromEntries(L.map((s) => [s.id, s]));

export function skill(id: string): SkillDef {
  const s = SKILLS[id];
  if (!s) throw new Error(`Compétence inconnue : ${id}`);
  return s;
}
