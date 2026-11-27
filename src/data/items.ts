// Objets : consommables, équipements et objets clés.
import type { ItemDef } from '../core/types';

const L: ItemDef[] = [
  // --- Consommables ---
  { id: 'herbe_douce', nom: 'Herbe-Douce', desc: 'Rend 45 PV à un allié.', type: 'conso', prix: 12, soinPv: 45, cible: 'allie' },
  { id: 'tonique', nom: 'Tonique des Alizés', desc: 'Rend 130 PV à un allié.', type: 'conso', prix: 55, soinPv: 130, cible: 'allie' },
  { id: 'gouttes_ciel', nom: 'Gouttes de Ciel', desc: 'Rend 20 PS à un allié.', type: 'conso', prix: 40, soinPs: 20, cible: 'allie' },
  { id: 'plume_aube', nom: "Plume d'Aube", desc: 'Relève un allié tombé avec la moitié de ses PV.', type: 'conso', prix: 110, reveil: true, cible: 'allieKO' },
  { id: 'sel_ecume', nom: "Sel d'Écume", desc: 'Guérit poison et sommeil.', type: 'conso', prix: 18, purifie: true, cible: 'allie' },
  { id: 'bombe_braise', nom: 'Bombe de Braise', desc: 'Inflige des dégâts de Feu à un ennemi.', type: 'conso', prix: 45, degats: { puissance: 30, element: 'feu' }, cible: 'ennemi' },
  { id: 'fiole_givre', nom: 'Fiole de Givre', desc: "Inflige des dégâts d'Eau à un ennemi.", type: 'conso', prix: 45, degats: { puissance: 30, element: 'eau' }, cible: 'ennemi' },
  { id: 'galet_tonnerre', nom: 'Galet-Tonnerre', desc: 'Inflige des dégâts de Terre à un ennemi.', type: 'conso', prix: 45, degats: { puissance: 30, element: 'terre' }, cible: 'ennemi' },
  { id: 'elixir_vents', nom: 'Élixir des Vents', desc: 'Rend 90 PV à tout le groupe.', type: 'conso', prix: 180, soinPv: 90, cible: 'allies' },
  { id: 'datte_miel', nom: 'Datte au miel', desc: 'Rend 260 PV à un allié.', type: 'conso', prix: 140, soinPv: 260, cible: 'allie' },
  { id: 'eau_oasis', nom: "Eau de l'oasis", desc: 'Rend 40 PS à un allié.', type: 'conso', prix: 95, soinPs: 40, cible: 'allie' },
  { id: 'perle_pluie', nom: 'Perle de pluie', desc: "Inflige de lourds dégâts d'Eau à un ennemi.", type: 'conso', prix: 120, degats: { puissance: 75, element: 'eau' }, cible: 'ennemi' },
  { id: 'elixir_soleil', nom: 'Élixir du Soleil', desc: 'Rend 220 PV à tout le groupe.', type: 'conso', prix: 380, soinPv: 220, cible: 'allies' },
  // --- Armes ---
  { id: 'epee_bois', nom: 'Épée de bois', desc: "L'épée d'entraînement du chantier.", type: 'arme', prix: 0, bonus: { atk: 4 }, pour: ['ael'] },
  { id: 'sabre_voile', nom: 'Sabre de voilier', desc: 'Léger et bien équilibré.', type: 'arme', prix: 140, bonus: { atk: 9 }, pour: ['ael'] },
  { id: 'lame_alize', nom: "Lame d'Alizé", desc: 'Elle siffle comme le vent du large.', type: 'arme', prix: 380, bonus: { atk: 15, vit: 2 }, pour: ['ael'], elementArme: 'vent' },
  { id: 'epee_corail', nom: 'Épée de corail', desc: 'Forgée par Brann dans du corail céleste.', type: 'arme', prix: 720, bonus: { atk: 22, res: 3 }, pour: ['ael'] },
  { id: 'cimeterre_ambre', nom: "Cimeterre d'ambre", desc: 'Courbe comme une dune, vif comme le vent.', type: 'arme', prix: 1400, bonus: { atk: 30, vit: 2 }, pour: ['ael'] },
  { id: 'arc_osier', nom: "Arc d'osier", desc: 'Un arc de voyage.', type: 'arme', prix: 0, bonus: { atk: 3, mag: 2 }, pour: ['mira'] },
  { id: 'arc_saule', nom: 'Arc de saule', desc: 'Souple, il favorise la concentration.', type: 'arme', prix: 130, bonus: { atk: 6, mag: 5 }, pour: ['mira'] },
  { id: 'arc_lune', nom: 'Arc-Lune', desc: 'Il brille faiblement la nuit.', type: 'arme', prix: 600, bonus: { atk: 11, mag: 10 }, pour: ['mira'] },
  { id: 'arc_soleil', nom: 'Arc du Soleil', desc: 'Ses flèches laissent une traînée dorée.', type: 'arme', prix: 1350, bonus: { atk: 16, mag: 16 }, pour: ['mira'] },
  { id: 'marteau_forge', nom: 'Marteau de forge', desc: 'Celui de tous les jours.', type: 'arme', prix: 0, bonus: { atk: 8 }, pour: ['brann'] },
  { id: 'masse_ancre', nom: "Masse d'ancre", desc: "Une ancre de navire, retravaillée.", type: 'arme', prix: 520, bonus: { atk: 16, def: 3 }, pour: ['brann'] },
  { id: 'marteau_dune', nom: 'Marteau des dunes', desc: 'Une tête de grès cerclée de bronze.', type: 'arme', prix: 1450, bonus: { atk: 28, def: 4 }, pour: ['brann'] },
  { id: 'baton_astral', nom: 'Bâton astral', desc: "Un bâton d'observatoire, gravé de constellations.", type: 'arme', prix: 0, bonus: { atk: 4, mag: 9 }, pour: ['nour'] },
  { id: 'sceptre_aube', nom: "Sceptre de l'Aube", desc: 'Un soleil miniature tourne à son sommet.', type: 'arme', prix: 1300, bonus: { atk: 8, mag: 19 }, pour: ['nour'] },
  // --- Armures ---
  { id: 'tunique', nom: 'Tunique de toile', desc: 'Simple et confortable.', type: 'armure', prix: 0, bonus: { def: 3 } },
  { id: 'veste_cuir', nom: 'Veste de cuir', desc: 'Protège des griffes et des ronces.', type: 'armure', prix: 95, bonus: { def: 7, res: 2 } },
  { id: 'tablier_cuir', nom: 'Tablier de forge', desc: 'Épais et roussi.', type: 'armure', prix: 0, bonus: { def: 6, res: 2 } },
  { id: 'manteau_brume', nom: 'Manteau de brume', desc: 'Tissé de fil de nuage.', type: 'armure', prix: 300, bonus: { def: 11, res: 7 } },
  { id: 'cotte_legere', nom: 'Cotte légère', desc: 'Mailles fines de Port-Venteux.', type: 'armure', prix: 420, bonus: { def: 16, res: 4, vit: -1 } },
  { id: 'robe_etoilee', nom: 'Robe étoilée', desc: 'Brodée de fils d’argent.', type: 'armure', prix: 0, bonus: { def: 6, res: 6 } },
  { id: 'burnous_sable', nom: 'Burnous des sables', desc: 'Frais le jour, chaud la nuit.', type: 'armure', prix: 900, bonus: { def: 18, res: 10 } },
  { id: 'cuirasse_ambre', nom: "Cuirasse d'ambre", desc: 'Des écailles de résine dorée, dures comme la pierre.', type: 'armure', prix: 1500, bonus: { def: 26, res: 6, vit: -1 } },
  // --- Accessoires ---
  { id: 'bague_vigueur', nom: 'Bague de vigueur', desc: '+25 PV max.', type: 'accessoire', prix: 150, bonus: { pvMax: 25 } },
  { id: 'plume_vent', nom: 'Plume de vent', desc: '+3 Vitesse.', type: 'accessoire', prix: 160, bonus: { vit: 3 } },
  { id: 'talisman_lueur', nom: 'Talisman-lueur', desc: '+6 Résistance.', type: 'accessoire', prix: 170, bonus: { res: 6 } },
  { id: 'amulette_fanal', nom: 'Amulette du Fanal', desc: '+6 Magie, +6 PS max.', type: 'accessoire', prix: 0, bonus: { mag: 6, psMax: 6 } },
  { id: 'boucle_corsaire', nom: 'Boucle de corsaire', desc: '+4 Attaque, +2 Vitesse.', type: 'accessoire', prix: 340, bonus: { atk: 4, vit: 2 } },
  { id: 'collier_scarabee', nom: 'Collier du scarabée', desc: '+5 Attaque, +3 Vitesse.', type: 'accessoire', prix: 1100, bonus: { atk: 5, vit: 3 } },
  { id: 'anneau_oasis', nom: "Anneau de l'oasis", desc: '+12 PS max, +4 Résistance.', type: 'accessoire', prix: 0, bonus: { psMax: 12, res: 4 } },
  { id: 'oeil_soleil', nom: 'Œil du Soleil', desc: '+8 Magie, +4 Résistance.', type: 'accessoire', prix: 0, bonus: { mag: 8, res: 4 } },
  { id: 'ecaille_ver', nom: 'Écaille du Ver Ancien', desc: '+60 PV max, +5 Défense.', type: 'accessoire', prix: 0, bonus: { pvMax: 60, def: 5 } },
  // --- Objets clés ---
  { id: 'lanterne', nom: 'Lanterne de Clairval', desc: "Elle porte la flamme d'Odile.", type: 'cle', prix: 0 },
  { id: 'cle_grotte', nom: 'Clé des Échos', desc: 'Une clé de pierre qui vibre doucement.', type: 'cle', prix: 0 },
  { id: 'eclat_fanal', nom: 'Éclat du Fanal', desc: 'Le premier éclat. Il bat comme un cœur.', type: 'cle', prix: 0 },
  { id: 'carte_mira', nom: 'Carte de Mira', desc: "Une carte de l'archipel, inachevée.", type: 'cle', prix: 0 },
  { id: 'herbe_lune', nom: 'Herbe-Lune', desc: 'Une herbe argentée que cherche le guérisseur.', type: 'cle', prix: 0 },
  { id: 'boussole', nom: 'Boussole du capitaine', desc: 'Elle indique le prochain Fanal éteint.', type: 'cle', prix: 0 },
  { id: 'eclat_recif', nom: 'Éclat des Récifs', desc: 'Le deuxième éclat, salé et tiède.', type: 'cle', prix: 0 },
  { id: 'corail_celeste', nom: 'Corail céleste', desc: 'Une branche de corail qui flotte toute seule.', type: 'cle', prix: 0 },
  { id: 'piece_ancienne', nom: 'Pièce ancienne', desc: 'Une monnaie frappée d’un phare.', type: 'cle', prix: 0 },
  { id: 'astrolabe', nom: 'Astrolabe solaire', desc: "Il montre l'œil de la Tempête Pâle.", type: 'cle', prix: 0 },
  { id: 'tablette_soleil', nom: 'Tablette du Soleil', desc: "Un fragment d'argile couvert d'étoiles gravées.", type: 'cle', prix: 0 },
  { id: 'eclat_ambre', nom: "Éclat d'Ambre", desc: 'Le troisième éclat, chaud comme le sable à midi.', type: 'cle', prix: 0 },
];

export const ITEMS: Readonly<Record<string, ItemDef>> = Object.fromEntries(L.map((i) => [i.id, i]));

export function item(id: string): ItemDef {
  const i = ITEMS[id];
  if (!i) throw new Error(`Objet inconnu : ${id}`);
  return i;
}

export const itemOpt = (id: string): ItemDef | undefined => ITEMS[id];
