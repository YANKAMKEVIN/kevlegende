// Parcours complet : le bot joue toute l'aventure sur plusieurs graines aléatoires.
import { describe, expect, it } from 'vitest';
import { Jeu } from '../../src/core/game';
import { MONDE } from '../../src/data/monde';
import { Bot } from '../../src/bot/bot';
import { ACTE1, ACTE2, AVENTURE } from '../../src/bot/walkthrough';
import { Memoire, Sauvegardes } from '../../src/save/store';

describe('Aventure complète', () => {
  for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
    it(`graine ${seed} : les deux actes sans défaite`, () => {
      const j = Jeu.nouvelle(MONDE, seed);
      const journal = new Bot(j).jouer(AVENTURE);
      expect(journal.fini).toBe(true);
      expect(journal.defaites).toBe(0);
      expect(j.p.flags['fanal1_allume'] && j.p.flags['fanal2_allume']).toBe(true);
      // Durée de jeu attendue : une centaine de combats et plusieurs milliers de pas.
      expect(journal.combats).toBeGreaterThan(70);
      expect(journal.pas).toBeGreaterThan(3000);
      const niv = Math.max(...j.p.equipe.map((h) => h.niveau));
      expect(niv).toBeGreaterThanOrEqual(17);
      expect(niv).toBeLessThanOrEqual(24);
    });
  }
  it('sauvegarder à la fin de l’Acte I puis reprendre jusqu’au bout', () => {
    const j = Jeu.nouvelle(MONDE, 11);
    new Bot(j).jouer(ACTE1);
    const s = new Sauvegardes(new Memoire());
    expect(s.ecrire('1', j.p)).toBe(true);
    const l = s.lire('1');
    if (!l.ok) throw new Error(l.erreur);
    const k = Jeu.charger(MONDE, l.enveloppe.partie);
    expect(k.p.flags['acte2']).toBe(true);
    expect(new Bot(k).jouer(ACTE2).fini).toBe(true);
  });
});
