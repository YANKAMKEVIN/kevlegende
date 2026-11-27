import { describe, expect, it } from 'vitest';
import { Jeu } from '../../src/core/game';
import { MONDE } from '../../src/data/monde';
import { Bot } from '../../src/bot/bot';
import { AVENTURE } from '../../src/bot/walkthrough';
import { chemin, directionVers, routeCartes } from '../../src/bot/nav';
import { choisirAction } from '../../src/bot/tactique';
import { equiperMieux, faireCourses, valeur } from '../../src/bot/equipement';
import { creerCombat } from '../../src/core/battle/setup';
import { nouveauHeros } from '../../src/core/state';
import { item } from '../../src/data/items';
import { jeuTest } from './helpers';

describe('Navigation', () => {
  it('chemin sur la carte et route entre cartes', () => {
    const j = jeuTest();
    expect(chemin(j, [{ x: 1, y: 1 }])).toEqual([]);
    expect(chemin(j, [{ x: 3, y: 1 }])).toEqual(['droite', 'droite']);
    expect(chemin(j, [{ x: 0, y: 0 }])).toBeNull();
    expect(routeCartes(j, 'ici')).toEqual([]);
    expect(routeCartes(j, 'labas')).toEqual([{ carte: 'ici', porte: 'D' }]);
    expect(routeCartes(j, 'nulle')).toBeNull();
    expect(directionVers({ x: 0, y: 0 }, { x: 0, y: -1 })).toBe('haut');
    expect(directionVers({ x: 0, y: 0 }, { x: -1, y: 0 })).toBe('gauche');
  });
});

describe('Tactique', () => {
  it('soigne, relève, attaque la faiblesse', () => {
    const eq = [nouveauHeros('ael', 12), nouveauHeros('mira', 12), nouveauHeros('brann', 12)];
    const b = creerCombat(['gelee_rosee', 'loup_brume'], eq, { seed: 1 });
    const [ael, mira, brann] = b.combattants;
    mira!.ps = 50;
    ael!.pv = 0;
    expect(choisirAction(b, mira!, {})).toMatchObject({ type: 'competence', id: 'eveil' });
    expect(choisirAction(b, brann!, { plume_aube: 1 })).toMatchObject({ type: 'objet', id: 'plume_aube' });
    ael!.pv = 5;
    brann!.pv = 5;
    expect(choisirAction(b, mira!, {})).toMatchObject({ id: 'brise_douce' });
    brann!.pv = brann!.stats.pvMax;
    expect(choisirAction(b, mira!, {})).toMatchObject({ id: 'baume' });
    expect(choisirAction(b, brann!, { tonique: 1 }).type).toBe('objet');
    ael!.pv = ael!.stats.pvMax;
    const a = choisirAction(b, ael!, {});
    expect(a.type === 'competence' || a.type === 'attaque').toBe(true);
    const boss = creerCombat(['serpent_echo'], eq, { seed: 1 });
    expect(choisirAction(boss, boss.combattants[2]!, {})).toMatchObject({ id: 'rempart' });
    boss.combattants[0]!.ps = 0;
    expect(choisirAction(boss, boss.combattants[0]!, { galet_tonnerre: 1 })).toMatchObject({ type: 'objet', id: 'galet_tonnerre' });
  });
});

describe('Équipement du bot', () => {
  it('valorise, achète et équipe', () => {
    expect(valeur(item('sabre_voile'), 'ael')).toBeGreaterThan(valeur(item('epee_bois'), 'ael'));
    const j = jeuTest();
    j.p.or = 500;
    faireCourses(j, ['sabre_voile', 'herbe_douce', 'veste_cuir']);
    expect(j.p.equipe[0]!.equipement.arme).toBe('sabre_voile');
    expect(j.p.inventaire['herbe_douce']).toBeGreaterThanOrEqual(3);
    j.p.inventaire['lame_alize'] = 1;
    equiperMieux(j);
    expect(j.p.equipe[0]!.equipement.arme).toBe('lame_alize');
  });
});

describe('Le bot termine les quatre actes', () => {
  it('sans défaite, avec toutes les quêtes', () => {
    const j = Jeu.nouvelle(MONDE, 1);
    const journal = new Bot(j).jouer(AVENTURE);
    expect(journal.fini).toBe(true);
    expect(journal.defaites).toBe(0);
    expect(Object.values(j.p.quetes).every((q) => q === 'terminee')).toBe(true);
    expect(Object.keys(j.p.quetes)).toHaveLength(18);
    expect(j.p.equipe.map((h) => h.id)).toEqual(['ael', 'mira', 'brann', 'nour']);
  });
  it('signale clairement un blocage', () => {
    const j = Jeu.nouvelle(MONDE, 2);
    expect(() => new Bot(j, 50).jouer(AVENTURE)).toThrow(/Bot bloqué/);
  });
});
