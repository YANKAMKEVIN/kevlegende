import { describe, expect, it } from 'vitest';
import { jeuTest } from './helpers';
import { lancerEvenement } from '../../src/core/story/runner';
import { statsHeros } from '../../src/core/state';

describe('Menus', () => {
  it('acheter, vendre, refuser', () => {
    const j = jeuTest();
    j.p.or = 200;
    expect(j.acheter('sabre_voile')).toBe(true);
    expect(j.p.or).toBe(60);
    expect(j.acheter('sabre_voile')).toBe(false);
    expect(j.acheter('herbe_douce', 0)).toBe(false);
    expect(j.vendre('sabre_voile')).toBe(true);
    expect(j.p.or).toBe(130);
    expect(j.vendre('sabre_voile')).toBe(false);
    j.p.inventaire['lanterne'] = 1;
    expect(j.vendre('lanterne')).toBe(false);
  });
  it('équiper et déséquiper', () => {
    const j = jeuTest();
    j.p.inventaire['sabre_voile'] = 1;
    const avant = statsHeros(j.p.equipe[0]!).atk;
    expect(j.equiper('ael', 'arme', 'sabre_voile')).toBe(true);
    expect(statsHeros(j.p.equipe[0]!).atk).toBe(avant + 5);
    expect(j.p.inventaire['epee_bois']).toBe(1);
    expect(j.equiper('ael', 'arme', 'arc_osier')).toBe(false);
    expect(j.equiper('ael', 'armure', 'sabre_voile')).toBe(false);
    expect(j.equiper('personne', 'arme', null)).toBe(false);
    expect(j.equiper('ael', 'accessoire', 'bague_vigueur')).toBe(false);
    expect(j.equiper('ael', 'arme', null)).toBe(true);
    expect(j.p.equipe[0]!.equipement.arme).toBeUndefined();
  });
  it('objets et soins hors combat', () => {
    const j = jeuTest();
    const ael = j.p.equipe[0]!;
    expect(j.utiliserObjet('herbe_douce', 'ael')).toBe(false);
    ael.pv = 5;
    expect(j.utiliserObjet('herbe_douce', 'ael')).toBe(true);
    expect(ael.pv).toBe(50);
    expect(j.utiliserObjet('tonique', 'ael')).toBe(false);
    j.p.inventaire['plume_aube'] = 1;
    ael.pv = 0;
    expect(j.utiliserObjet('plume_aube', 'ael')).toBe(true);
    expect(ael.pv).toBeGreaterThan(0);
    j.p.inventaire['gouttes_ciel'] = 1;
    ael.ps = 0;
    expect(j.utiliserObjet('gouttes_ciel', 'ael')).toBe(true);
    j.p.inventaire['elixir_vents'] = 1;
    ael.pv = 3;
    expect(j.utiliserObjet('elixir_vents', 'ael')).toBe(true);
  });
  it('compétences de soin hors combat', () => {
    const j = jeuTest({ m: [{ c: 'rejoint', hero: 'mira', niveau: 12 }] });
    lancerEvenement(j, 'm');
    j.continuer();
    const [ael, mira] = j.p.equipe;
    ael!.pv = 1;
    expect(j.lancerSoin('mira', 'baume', 'ael')).toBe(true);
    expect(ael!.pv).toBeGreaterThan(1);
    expect(j.lancerSoin('mira', 'tranche_vent', 'ael')).toBe(false);
    expect(j.lancerSoin('mira', 'fleche_givre', 'ael')).toBe(false);
    expect(j.lancerSoin('ael', 'baume', 'ael')).toBe(false);
    ael!.pv = 0;
    expect(j.lancerSoin('mira', 'eveil', 'ael')).toBe(true);
    ael!.pv = 2;
    expect(j.lancerSoin('mira', 'brise_douce', 'ael')).toBe(true);
    mira!.ps = 0;
    expect(j.lancerSoin('mira', 'baume', 'ael')).toBe(false);
    mira!.pv = 0;
    expect(j.lancerSoin('mira', 'baume', 'ael')).toBe(false);
  });
});

describe('Combats', () => {
  it('récompenses, bestiaire et montée de niveau', () => {
    const j = jeuTest();
    j.demarrerCombat(['grand_loup'], { fuite: false, defaiteOk: false });
    expect(j.mode).toBe('combat');
    expect(() => j.terminerCombat()).toThrow();
    const loup = j.combat!.combattants[1]!;
    loup.revelees.push('feu');
    loup.pv = 0;
    j.combatAvancer();
    const r = j.terminerCombat()!;
    expect(r.xp).toBe(90);
    expect(r.butin).toContain('bague_vigueur');
    expect(r.niveaux.length).toBe(1);
    expect(j.p.bestiaire).toContain('grand_loup:feu');
    expect(j.p.vaincus).toContain('grand_loup');
    expect(j.mode).toBe('exploration');
  });
  it('défaite, puis « Réessayer » relance le combat depuis l’état d’avant', () => {
    const j = jeuTest();
    const orAvant = j.p.or;
    j.demarrerCombat(['loup_brume'], { fuite: true, defaiteOk: false });
    j.p.or = 0;
    j.combat!.combattants[0]!.pv = 0;
    j.combatAvancer();
    j.terminerCombat();
    expect(j.mode).toBe('defaite');
    j.reessayerCombat();
    expect(j.mode).toBe('combat');
    expect(j.p.or).toBe(orAvant);
    expect(j.combatAgir).toBeTypeOf('function');
    j.reessayerCombat();
  });
  it('agir et avancer via le jeu', () => {
    const j = jeuTest();
    expect(j.combatAvancer()).toEqual([]);
    expect(() => j.combatAgir({ type: 'defense' })).toThrow();
    j.demarrerCombat(['gelee_rosee'], { fuite: true, defaiteOk: false });
    j.combatAvancer();
    if (j.combat!.attente) expect(j.combatAgir({ type: 'defense' }).length).toBeGreaterThan(0);
    j.ecouler(12);
    expect(j.p.tempsJeu).toBe(12);
  });
});
