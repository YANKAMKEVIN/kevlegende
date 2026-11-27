// Bestiaire. Les faiblesses brisent le bouclier ; à zéro l'ennemi est « Brisé ».
import type { EnemyDef } from '../core/types';

const s = (pvMax: number, atk: number, def: number, mag: number, res: number, vit: number) => ({ pvMax, psMax: 0, atk, def, mag, res, vit });

const L: EnemyDef[] = [
  // --- Acte 1 : Clairval, Bois Murmurant ---
  { id: 'gelee_rosee', nom: 'Gelée de rosée', niveau: 1, stats: s(26, 9, 5, 5, 4, 7), xp: 6, or: 5, faiblesses: ['feu', 'vent'], bouclier: 2, attaques: [{ id: 'e_charge', poids: 1 }], butin: [{ objet: 'herbe_douce', chance: 0.25 }], forme: 'gelee', teinte: '#7fd4e8' },
  { id: 'lievre_plume', nom: 'Lièvre-plume', niveau: 2, stats: s(24, 11, 4, 4, 4, 14), xp: 7, or: 6, faiblesses: ['vent', 'feu'], bouclier: 2, attaques: [{ id: 'e_morsure', poids: 1 }, { id: 'e_charge', poids: 1 }], forme: 'oiseau', teinte: '#e8d6b0' },
  { id: 'champi_dormeur', nom: 'Champi-dormeur', niveau: 3, stats: s(36, 10, 6, 10, 6, 6), xp: 10, or: 8, faiblesses: ['feu', 'vent'], bouclier: 3, attaques: [{ id: 'e_spores', poids: 35 }, { id: 'e_charge', poids: 65 }], butin: [{ objet: 'sel_ecume', chance: 0.3 }], forme: 'champi', teinte: '#d9645a' },
  { id: 'loup_brume', nom: 'Loup de brume', niveau: 4, stats: s(44, 15, 7, 5, 5, 13), xp: 14, or: 10, faiblesses: ['feu', 'lumiere'], bouclier: 3, attaques: [{ id: 'e_morsure', poids: 70 }, { id: 'e_hurlement', poids: 30 }], forme: 'loup', teinte: '#8f9bb3' },
  { id: 'pie_voleuse', nom: 'Pie voleuse', niveau: 4, stats: s(32, 12, 5, 8, 6, 16), xp: 12, or: 20, faiblesses: ['vent', 'eau'], bouclier: 2, attaques: [{ id: 'e_vol', poids: 60 }, { id: 'e_rafale', poids: 40 }], butin: [{ objet: 'gouttes_ciel', chance: 0.15 }], forme: 'oiseau', teinte: '#3d4a6b' },
  { id: 'grand_loup', nom: 'Grand Loup Cendré', niveau: 6, stats: s(190, 14, 10, 8, 8, 12), xp: 90, or: 80, faiblesses: ['feu', 'lumiere'], bouclier: 5, attaques: [{ id: 'e_morsure', poids: 60 }, { id: 'e_hurlement', poids: 40 }], butin: [{ objet: 'bague_vigueur', chance: 1 }], boss: true, forme: 'loup', teinte: '#5d6275' },
  // --- Acte 1 : Grotte des Échos, Sanctuaire ---
  { id: 'chauve_echo', nom: "Chauve-souris d'écho", niveau: 6, stats: s(40, 14, 6, 12, 7, 17), xp: 18, or: 12, faiblesses: ['lumiere', 'vent'], bouclier: 2, attaques: [{ id: 'e_echo', poids: 40 }, { id: 'e_morsure', poids: 60 }], forme: 'oiseau', teinte: '#6b4f8f' },
  { id: 'golem_mousse', nom: 'Golem de mousse', niveau: 7, stats: s(84, 19, 15, 4, 6, 5), xp: 28, or: 20, faiblesses: ['feu', 'vent'], bouclier: 4, attaques: [{ id: 'e_charge', poids: 60 }, { id: 'e_eboulis', poids: 40 }], butin: [{ objet: 'galet_tonnerre', chance: 0.3 }], forme: 'golem', teinte: '#6f9a5a' },
  { id: 'crabe_cristal', nom: 'Crabe de cristal', niveau: 7, stats: s(58, 17, 19, 6, 12, 8), xp: 24, or: 18, faiblesses: ['terre', 'lumiere'], bouclier: 3, attaques: [{ id: 'e_pince', poids: 1 }], forme: 'crabe', teinte: '#a6d8f0' },
  { id: 'feu_follet', nom: 'Feu follet', niveau: 8, stats: s(42, 6, 8, 16, 14, 14), xp: 22, or: 15, faiblesses: ['eau', 'vent'], bouclier: 3, attaques: [{ id: 'e_flamme', poids: 1 }], butin: [{ objet: 'bombe_braise', chance: 0.25 }], forme: 'esprit', teinte: '#f2a541' },
  { id: 'serpent_echo', nom: 'Serpent des Échos', niveau: 9, stats: s(560, 26, 15, 20, 13, 11), xp: 220, or: 200, faiblesses: ['vent', 'terre'], bouclier: 6, attaques: [{ id: 'e_constriction', poids: 40 }, { id: 'e_echo', poids: 35 }, { id: 'e_dard', poids: 25 }], butin: [{ objet: 'lame_alize', chance: 1 }], boss: true, forme: 'serpent', teinte: '#5fa39a' },
  { id: 'ombre_errante', nom: 'Ombre errante', niveau: 10, stats: s(62, 16, 10, 17, 12, 13), xp: 32, or: 22, faiblesses: ['lumiere', 'feu'], bouclier: 3, attaques: [{ id: 'e_ombre', poids: 60 }, { id: 'e_brume', poids: 40 }], forme: 'esprit', teinte: '#3a3550' },
  { id: 'sentinelle_voilee', nom: 'Sentinelle Voilée', niveau: 11, stats: s(600, 19, 17, 17, 16, 12), xp: 420, or: 300, faiblesses: ['lumiere', 'eau'], bouclier: 7, attaques: [{ id: 'e_lame', poids: 40 }, { id: 'e_brume', poids: 30 }, { id: 'e_garde', poids: 12 }, { id: 'e_ombre', poids: 18 }], boss: true, forme: 'chevalier', teinte: '#44405e' },
  // --- Acte 2 : Port-Venteux, Récifs Célestes ---
  { id: 'crabe_recif', nom: 'Crabe des récifs', niveau: 10, stats: s(88, 22, 22, 6, 10, 9), xp: 34, or: 22, faiblesses: ['terre', 'feu'], bouclier: 3, attaques: [{ id: 'e_pince', poids: 1 }], forme: 'crabe', teinte: '#e0714f' },
  { id: 'meduse_ciel', nom: 'Méduse céleste', niveau: 11, stats: s(72, 10, 12, 20, 18, 12), xp: 36, or: 24, faiblesses: ['terre', 'vent'], bouclier: 3, attaques: [{ id: 'e_dard', poids: 50 }, { id: 'e_ecume', poids: 50 }], butin: [{ objet: 'fiole_givre', chance: 0.25 }], forme: 'esprit', teinte: '#c79ae8' },
  { id: 'mouette_pirate', nom: 'Mouette pirate', niveau: 11, stats: s(62, 20, 10, 10, 9, 21), xp: 32, or: 40, faiblesses: ['vent', 'feu'], bouclier: 2, attaques: [{ id: 'e_vol', poids: 50 }, { id: 'e_rafale', poids: 50 }], forme: 'oiseau', teinte: '#f4f1ea' },
  { id: 'pirate_brume', nom: 'Pirate de brume', niveau: 12, stats: s(124, 26, 18, 10, 12, 12), xp: 46, or: 45, faiblesses: ['lumiere', 'feu'], bouclier: 4, attaques: [{ id: 'e_lame', poids: 70 }, { id: 'e_garde', poids: 30 }], butin: [{ objet: 'tonique', chance: 0.2 }], forme: 'chevalier', teinte: '#4f6a7a' },
  { id: 'anguille_nuage', nom: 'Anguille-nuage', niveau: 13, stats: s(116, 24, 14, 18, 14, 15), xp: 44, or: 30, faiblesses: ['terre'], bouclier: 3, attaques: [{ id: 'e_constriction', poids: 50 }, { id: 'e_ecume', poids: 50 }], forme: 'serpent', teinte: '#9fc7d9' },
  { id: 'capitaine_creux', nom: 'Capitaine Creux', niveau: 14, stats: s(1350, 40, 22, 26, 18, 14), xp: 650, or: 500, faiblesses: ['lumiere', 'terre'], bouclier: 7, attaques: [{ id: 'e_lame', poids: 45 }, { id: 'e_garde', poids: 15 }, { id: 'e_brume', poids: 25 }, { id: 'e_vol', poids: 15 }], butin: [{ objet: 'boucle_corsaire', chance: 1 }], boss: true, forme: 'chevalier', teinte: '#2c3e50' },
  { id: 'kraken_brume', nom: 'Kraken de brume', niveau: 17, stats: s(3000, 50, 24, 44, 22, 13), xp: 1300, or: 900, faiblesses: ['feu', 'terre', 'lumiere'], bouclier: 9, attaques: [{ id: 'e_tentacules', poids: 45 }, { id: 'e_maree', poids: 30 }, { id: 'e_constriction', poids: 25 }], boss: true, forme: 'serpent', teinte: '#3b3f6b' },
];

export const ENEMIES: Readonly<Record<string, EnemyDef>> = Object.fromEntries(L.map((e) => [e.id, e]));

export function enemy(id: string): EnemyDef {
  const e = ENEMIES[id];
  if (!e) throw new Error(`Ennemi inconnu : ${id}`);
  return e;
}
