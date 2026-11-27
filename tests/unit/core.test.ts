import { describe, expect, it } from 'vitest';
import { Rng } from '../../src/core/rng';
import { competencesConnues, gagnerXp, niveauPourXp, statsCompletes, statsDeBase, xpPourNiveau } from '../../src/core/progression';
import { hero } from '../../src/data/heroes';
import { itemOpt } from '../../src/data/items';
import { nouveauHeros, nouvellePartie, ajouterObjet, possede, soignerEquipe, statsHeros } from '../../src/core/state';

describe('Rng', () => {
  it('est déterministe et sérialisable', () => {
    const a = new Rng(7);
    const b = new Rng(7);
    const sa = [a.next(), a.next(), a.next()];
    expect([b.next(), b.next(), b.next()]).toEqual(sa);
    const c = new Rng(1);
    c.state = a.state;
    expect(c.next()).toBe(a.next());
  });
  it('respecte les bornes et les poids', () => {
    const r = new Rng(3);
    for (let i = 0; i < 500; i++) {
      const v = r.int(2, 5);
      expect(v).toBeGreaterThanOrEqual(2);
      expect(v).toBeLessThanOrEqual(5);
    }
    let n = 0;
    for (let i = 0; i < 1000; i++) if (r.weighted(['a', 'b'], (x) => (x === 'a' ? 9 : 1)) === 'a') n++;
    expect(n).toBeGreaterThan(800);
    expect(r.weighted(['x', 'y'], () => 0)).toMatch(/[xy]/);
    expect(() => r.pick([])).toThrow();
    expect(typeof r.chance(0.5)).toBe('boolean');
    expect(new Rng(0).next()).toBeGreaterThanOrEqual(0);
  });
});

describe('Progression', () => {
  it('courbe d’XP croissante et réciproque', () => {
    expect(xpPourNiveau(1)).toBe(0);
    for (let n = 2; n < 60; n++) {
      expect(xpPourNiveau(n + 1)).toBeGreaterThan(xpPourNiveau(n));
      expect(niveauPourXp(xpPourNiveau(n))).toBe(n);
      expect(niveauPourXp(xpPourNiveau(n) - 1)).toBe(n - 1);
    }
  });
  it('les stats augmentent avec le niveau et l’équipement', () => {
    const d = hero('ael');
    expect(statsDeBase(d, 10).atk).toBeGreaterThan(statsDeBase(d, 1).atk);
    const h = nouveauHeros('ael');
    const sans = statsCompletes(d, { ...h, equipement: {} }, itemOpt);
    expect(statsCompletes(d, h, itemOpt).atk).toBe(sans.atk + 4);
  });
  it('gagner de l’XP fait monter de niveau et apprend des compétences', () => {
    const h = nouveauHeros('ael');
    expect(gagnerXp(hero('ael'), h, 1, itemOpt)).toBeNull();
    const g = gagnerXp(hero('ael'), h, xpPourNiveau(6), itemOpt)!;
    expect(g.de).toBe(1);
    expect(g.a).toBe(6);
    expect(g.nouvellesCompetences).toContain('lame_tourbillon');
    expect(h.pv).toBeLessThanOrEqual(statsHeros(h).pvMax);
    expect(competencesConnues(hero('ael'), 1)).toEqual(['tranche_vent']);
  });
  it('un héros KO ne récupère pas de PV en montant de niveau', () => {
    const h = nouveauHeros('mira');
    h.pv = 0;
    gagnerXp(hero('mira'), h, 5000, itemOpt);
    expect(h.pv).toBe(0);
  });
});

describe('État de partie', () => {
  it('nouvelle partie, objets, soins', () => {
    const p = nouvellePartie(5, { carte: 'x', x: 1, y: 2 });
    expect(p.equipe[0]!.id).toBe('ael');
    ajouterObjet(p, 'tonique', 2);
    expect(possede(p, 'tonique', 2)).toBe(true);
    ajouterObjet(p, 'tonique', -2);
    expect(p.inventaire['tonique']).toBeUndefined();
    p.equipe[0]!.pv = 1;
    soignerEquipe(p);
    expect(p.equipe[0]!.pv).toBe(statsHeros(p.equipe[0]!).pvMax);
  });
});
