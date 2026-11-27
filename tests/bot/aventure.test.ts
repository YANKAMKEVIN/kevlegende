// Parcours complet : le bot joue toute l'aventure sur plusieurs graines aléatoires.
import { describe, expect, it } from 'vitest';
import { Jeu } from '../../src/core/game';
import { MONDE } from '../../src/data/monde';
import { Bot } from '../../src/bot/bot';
import { ACTE1, ACTE2, ACTE3, AVENTURE } from '../../src/bot/walkthrough';
import { Memoire, Sauvegardes } from '../../src/save/store';

describe('Aventure complète', () => {
  for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
    it(`graine ${seed} : les trois actes sans défaite`, () => {
      const j = Jeu.nouvelle(MONDE, seed);
      const journal = new Bot(j).jouer(AVENTURE);
      expect(journal.fini).toBe(true);
      expect(journal.defaites).toBe(0);
      expect(j.p.flags['fanal1_allume'] && j.p.flags['fanal2_allume'] && j.p.flags['fanal3_allume']).toBe(true);
      // Durée de jeu attendue : près de deux cents combats et des milliers de pas.
      expect(journal.combats).toBeGreaterThan(150);
      expect(journal.pas).toBeGreaterThan(5000);
      const niv = Math.max(...j.p.equipe.map((h) => h.niveau));
      expect(niv).toBeGreaterThanOrEqual(27);
      expect(niv).toBeLessThanOrEqual(34);
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
    expect(new Bot(k).jouer([...ACTE2, ...ACTE3]).fini).toBe(true);
  });
  it('une partie qui avait fini l’Acte II enchaîne sur l’Acte III en parlant à Nell', () => {
    const j = Jeu.nouvelle(MONDE, 12);
    new Bot(j).jouer([...ACTE1, ...ACTE2]);
    // Ancienne sauvegarde : Acte II terminé, Acte III jamais commencé.
    for (const f of Object.keys(j.p.flags)) if (/^(acte3|amastan_vu)/.test(f)) delete j.p.flags[f];
    j.teleporter('phare', 'F', 'haut');
    const k = Jeu.charger(MONDE, JSON.parse(JSON.stringify(j.p)));
    const bot = new Bot(k);
    bot.jouer([{ type: 'parler', carte: 'phare', ancre: 'N', jusqua: 'acte3' }]);
    expect(k.p.carte).toBe('ambrelune');
    expect(bot.jouer(ACTE3).fini).toBe(true);
  });
});
