// Thèmes musicaux procéduraux : tempo, gamme, accords et caractère de chaque lieu.

export interface Theme {
  tempo: number;
  /** Note fondamentale (MIDI). */
  racine: number;
  /** Intervalles de la gamme (demi-tons). */
  gamme: readonly number[];
  /** Degrés d'accords (0 = I), un par mesure. */
  accords: readonly number[];
  /** Densité de la mélodie (0..1). */
  densite: number;
  timbre: OscillatorType;
  pad: boolean;
  basse: boolean;
  percu: boolean;
  /** Graine du motif mélodique. */
  graine: number;
}

const MAJ = [0, 2, 4, 5, 7, 9, 11];
const MIN = [0, 2, 3, 5, 7, 8, 10];
const DOR = [0, 2, 3, 5, 7, 9, 10];
const LYD = [0, 2, 4, 6, 7, 9, 11];

export const THEMES: Readonly<Record<string, Theme>> = {
  titre: { tempo: 76, racine: 62, gamme: LYD, accords: [0, 4, 5, 3], densite: 0.45, timbre: 'triangle', pad: true, basse: true, percu: false, graine: 11 },
  village: { tempo: 96, racine: 65, gamme: MAJ, accords: [0, 3, 4, 0, 5, 3, 4, 4], densite: 0.6, timbre: 'triangle', pad: true, basse: true, percu: true, graine: 3 },
  foyer: { tempo: 80, racine: 60, gamme: MAJ, accords: [0, 5, 3, 4], densite: 0.45, timbre: 'sine', pad: true, basse: true, percu: false, graine: 7 },
  bois: { tempo: 104, racine: 64, gamme: DOR, accords: [0, 6, 3, 0, 6, 4], densite: 0.55, timbre: 'triangle', pad: true, basse: true, percu: true, graine: 19 },
  col: { tempo: 112, racine: 62, gamme: MAJ, accords: [0, 4, 5, 3, 0, 4, 3, 4], densite: 0.6, timbre: 'square', pad: true, basse: true, percu: true, graine: 23 },
  grotte: { tempo: 70, racine: 57, gamme: MIN, accords: [0, 5, 3, 4], densite: 0.3, timbre: 'sine', pad: true, basse: true, percu: false, graine: 31 },
  sanctuaire: { tempo: 64, racine: 60, gamme: LYD, accords: [0, 1, 0, 4], densite: 0.3, timbre: 'sine', pad: true, basse: false, percu: false, graine: 37 },
  colline: { tempo: 84, racine: 63, gamme: MAJ, accords: [5, 3, 0, 4], densite: 0.45, timbre: 'triangle', pad: true, basse: true, percu: false, graine: 41 },
  port: { tempo: 116, racine: 67, gamme: MAJ, accords: [0, 0, 3, 4, 0, 5, 3, 4], densite: 0.65, timbre: 'square', pad: false, basse: true, percu: true, graine: 43 },
  recifs: { tempo: 100, racine: 66, gamme: LYD, accords: [0, 1, 5, 4], densite: 0.5, timbre: 'triangle', pad: true, basse: true, percu: true, graine: 47 },
  epave: { tempo: 78, racine: 58, gamme: DOR, accords: [0, 3, 6, 4], densite: 0.35, timbre: 'sine', pad: true, basse: true, percu: false, graine: 53 },
  combat: { tempo: 148, racine: 62, gamme: MIN, accords: [0, 5, 6, 4, 0, 5, 3, 4], densite: 0.75, timbre: 'square', pad: false, basse: true, percu: true, graine: 59 },
  boss: { tempo: 160, racine: 57, gamme: MIN, accords: [0, 0, 5, 6, 3, 3, 4, 4], densite: 0.8, timbre: 'sawtooth', pad: true, basse: true, percu: true, graine: 61 },
  fin: { tempo: 72, racine: 64, gamme: MAJ, accords: [0, 4, 5, 3, 0, 4, 3, 4], densite: 0.5, timbre: 'triangle', pad: true, basse: true, percu: false, graine: 67 },
};
