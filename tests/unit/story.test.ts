import { describe, expect, it } from 'vitest';
import { jeuTest } from './helpers';
import { lancerEvenement } from '../../src/core/story/runner';
import { statsHeros } from '../../src/core/state';

describe('Interpréteur de scripts', () => {
  it('exécute toutes les commandes', () => {
    const j = jeuTest({
      tout: [
        { c: 'flag', nom: 'a' },
        { c: 'si', cond: ['a'], alors: [{ c: 'flag', nom: 'b' }], sinon: [{ c: 'flag', nom: 'non' }] },
        { c: 'si', cond: ['!a'], alors: [{ c: 'flag', nom: 'non2' }] },
        { c: 'si', cond: ['!a'], alors: [], sinon: [{ c: 'flag', nom: 'c' }] },
        { c: 'donne', objet: 'tonique', n: 2 },
        { c: 'donne', objet: 'herbe_douce', silencieux: true },
        { c: 'retire', objet: 'herbe_douce' },
        { c: 'or', n: 50 },
        { c: 'or', n: -5 },
        { c: 'paye', n: 10, alors: [{ c: 'flag', nom: 'paye' }], sinon: [{ c: 'flag', nom: 'fauche' }] },
        { c: 'paye', n: 99999, alors: [], sinon: [{ c: 'flag', nom: 'fauche' }] },
        { c: 'rejoint', hero: 'mira', niveau: 3 },
        { c: 'rejoint', hero: 'mira' },
        { c: 'quete', id: 'q_fanal', etat: 'active' },
        { c: 'quete', id: 'q_fanal', etat: 'active' },
        { c: 'acte', n: 2 },
        { c: 'son', id: 'x' },
        { c: 'secousse' },
        { c: 'flash' },
        { c: 'sauve' },
        { c: 'appel', evenement: 'sous' },
        { c: 'titre', texte: 'T', sous: 'S' },
        { c: 'teleporte', carte: 'labas', ancre: 'A', dir: 'haut' },
        { c: 'soin' },
        { c: 'boutique', id: 'b' },
        { c: 'fin', texte: 'Fin' },
      ],
    });
    j.p.equipe[0]!.pv = 1;
    lancerEvenement(j, 'tout');
    const vus: string[] = [];
    for (let i = 0; i < 30 && j.attente; i++) {
      vus.push(j.attente.type);
      j.continuer();
    }
    expect(vus).toEqual(['dit', 'dit', 'dit', 'titre', 'boutique', 'fin']);
    const f = j.p.flags;
    expect([f.a, f.b, f.c, f.paye, f.fauche, f.sous, f.non, f.non2]).toEqual([true, true, true, true, true, true, undefined, undefined]);
    expect(j.p.inventaire['tonique']).toBe(2);
    expect(j.p.inventaire['herbe_douce']).toBe(3);
    expect(j.p.or).toBe(30 + 50 - 5 - 10);
    expect(j.p.equipe.map((h) => h.id)).toEqual(['ael', 'mira']);
    expect(j.p.equipe[1]!.niveau).toBe(3);
    expect(j.p.quetes['q_fanal']).toBe('active');
    expect(j.p.acte).toBe(2);
    expect(j.p.carte).toBe('labas');
    expect(j.p.equipe[0]!.pv).toBe(statsHeros(j.p.equipe[0]!).pvMax);
    const effets = j.prendreEffets().map((e) => e.type);
    expect(effets).toEqual(expect.arrayContaining(['objet', 'or', 'rejoint', 'quete', 'son', 'secousse', 'flash', 'sauve', 'teleporte']));
    expect(j.mode).toBe('exploration');
  });
  it('choix', () => {
    const j = jeuTest({
      ch: [{ c: 'choix', texte: '?', options: [{ texte: 'A', faire: [{ c: 'flag', nom: 'A' }] }, { texte: 'B', faire: [{ c: 'flag', nom: 'B' }] }] }],
    });
    lancerEvenement(j, 'ch');
    expect(j.attente).toEqual({ type: 'choix', texte: '?', options: ['A', 'B'] });
    j.continuer();
    expect(j.attente?.type).toBe('choix');
    expect(() => j.choisir(5)).toThrow();
    j.choisir(1);
    expect(j.p.flags['B']).toBe(true);
    expect(j.mode).toBe('exploration');
    j.choisir(0);
  });
  it('erreurs claires', () => {
    const j = jeuTest({ mauvais: [{ c: 'appel', evenement: 'absent' }] });
    expect(() => lancerEvenement(j, 'absent')).toThrow();
    expect(() => lancerEvenement(j, 'mauvais')).toThrow();
  });
  it('combat scénarisé : victoire puis suite, défaite acceptée', () => {
    const j = jeuTest({
      duel: [{ c: 'combat', groupe: ['gelee_rosee'] }, { c: 'flag', nom: 'gagne' }],
      perdu: [{ c: 'combat', groupe: ['gelee_rosee'], defaiteOk: true }, { c: 'flag', nom: 'apres' }],
    });
    lancerEvenement(j, 'duel');
    expect(j.mode).toBe('combat');
    j.combat!.combattants[1]!.pv = 0;
    j.combatAvancer();
    expect(j.combat!.fini).toBe('victoire');
    const r = j.terminerCombat()!;
    expect(r.xp).toBeGreaterThan(0);
    expect(j.p.flags['gagne']).toBe(true);
    lancerEvenement(j, 'perdu');
    j.combat!.combattants[0]!.pv = 0;
    j.combatAvancer();
    j.terminerCombat();
    expect(j.p.flags['apres']).toBe(true);
    expect(j.p.equipe[0]!.pv).toBeGreaterThan(0);
  });
});
