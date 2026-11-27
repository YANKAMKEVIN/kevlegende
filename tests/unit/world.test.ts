import { describe, expect, it } from 'vitest';
import { jeuTest, toutLire, mondeTest } from './helpers';
import { Jeu } from '../../src/core/game';
import { compilerCarte, condVraie, tuile, ancre } from '../../src/core/world/map';
import { devant, franchissable, inverse, obstacles, pnjVisibles, surPorte } from '../../src/core/world/explore';
import type { MapDef } from '../../src/core/world/mapdef';

describe('Cartes', () => {
  it('compile le plan et résout les ancres', () => {
    const j = jeuTest();
    const c = j.carte();
    expect(c.largeur).toBe(10);
    expect(ancre(c, 'N')).toEqual({ x: 4, y: 1 });
    expect(tuile(c, 0, 0).passable).toBe(false);
    expect(tuile(c, 99, 99).id).toBe('ciel');
    expect(() => ancre(c, 'Q')).toThrow();
  });
  it('refuse les ancres en double et les sols inconnus', () => {
    const base: MapDef = { id: 'x', nom: 'x', acte: 1, ambiance: 'jour', musique: 'm', solDefaut: '.', plan: ['AA'] };
    expect(() => compilerCarte(base)).toThrow();
    expect(() => compilerCarte({ ...base, id: 'y', plan: ['A'], solDefaut: 'µ' })).toThrow();
  });
  it('conditions de drapeaux', () => {
    expect(condVraie(undefined, {})).toBe(true);
    expect(condVraie(['a', '!b'], { a: true })).toBe(true);
    expect(condVraie(['a', '!b'], { a: true, b: true })).toBe(false);
  });
});

describe('Exploration', () => {
  it('déplacements, murs, PNJ et coffres bloquent', () => {
    const j = jeuTest();
    expect(j.deplacer('haut')).toBe('bloque');
    expect(j.p.dir).toBe('haut');
    expect(j.deplacer('droite')).toBe('avance');
    expect(j.p.x).toBe(2);
    expect(franchissable(j, 4, 1)).toBe(false); // PNJ
    expect(obstacles(j).has('8,3')).toBe(true); // coffre
    expect(pnjVisibles(j).map((n) => n.def.id)).toEqual(['pnj']);
    expect(franchissable(j, 4, 4)).toBe(false); // grille fermée
    j.p.flags['ouvert'] = true;
    expect(franchissable(j, 4, 4)).toBe(true);
  });
  it('parler à un PNJ lance son événement et le tourne vers le joueur', () => {
    const j = jeuTest();
    j.p.x = 3;
    j.p.dir = 'droite';
    expect(j.interagir()).toBe('pnj');
    expect(j.mode).toBe('evenement');
    expect(j.regards['pnj']).toBe('gauche');
    expect(toutLire(j)).toEqual(['Bonjour.']);
    expect(j.mode).toBe('exploration');
    expect(j.p.flags['parle']).toBe(true);
    expect(j.objectif()).toBe('Après');
    j.p.dir = 'bas';
    expect(j.interagir()).toBe('rien');
  });
  it('ouvrir un coffre une seule fois', () => {
    const j = jeuTest();
    j.p.x = 8;
    j.p.y = 2;
    j.p.dir = 'bas';
    expect(j.interagir()).toBe('coffre');
    toutLire(j);
    expect(j.p.inventaire['herbe_douce']).toBe(5);
    expect(j.p.or).toBe(40);
    expect(j.p.flags['coffre:ici:c']).toBe(true);
    expect(j.interagir()).toBe('rien');
  });
  it('décor interactif', () => {
    const j = jeuTest();
    j.p.x = 7;
    j.p.y = 4;
    j.p.dir = 'bas';
    expect(j.interagir()).toBe('decor');
    expect(toutLire(j)).toEqual(['Un panneau.']);
  });
  it('déclencheur, porte, porte conditionnelle', () => {
    const j = jeuTest();
    j.p.x = 1;
    j.p.y = 4;
    expect(j.deplacer('droite')).toBe('evenement');
    toutLire(j);
    expect(j.p.flags['piege_vu']).toBe(true);
    j.p.x = 7;
    j.p.y = 1;
    expect(j.deplacer('droite')).toBe('porte');
    expect(j.p.carte).toBe('labas');
    expect(j.p.dir).toBe('bas');
    expect(j.prendreEffets().some((e) => e.type === 'teleporte')).toBe(true);
    j.p.x = 2;
    j.p.y = 1;
    expect(j.deplacer('bas')).toBe('evenement');
    expect(j.p.y).toBe(1);
    expect(toutLire(j)).toEqual(['Bloqué.']);
    j.p.flags['sortie'] = true;
    expect(j.deplacer('bas')).toBe('porte');
    expect(j.p.carte).toBe('ici');
  });
  it('rencontres aléatoires dans les hautes herbes', () => {
    const j = jeuTest();
    delete j.p.flags['debug_sans_rencontre'];
    j.p.x = 3;
    j.p.y = 2;
    let r = '';
    for (let i = 0; i < 20 && r !== 'rencontre'; i++) r = j.deplacer(i % 2 ? 'gauche' : 'droite');
    expect(r).toBe('rencontre');
    expect(j.mode).toBe('combat');
    expect(j.deplacer('droite')).toBe('occupe');
  });
  it('outils divers', () => {
    const j = jeuTest();
    expect(devant(j)).toEqual({ x: 1, y: 2 });
    expect(inverse('haut')).toBe('bas');
    expect(inverse('gauche')).toBe('droite');
    expect(surPorte(j)).toBe(false);
  });
  it('charger replace le joueur sur une case sûre', () => {
    const j = jeuTest();
    j.p.x = 0;
    j.p.y = 0;
    const k = Jeu.charger(mondeTest(), j.p);
    expect(franchissable(k, k.p.x, k.p.y)).toBe(true);
    const p2 = { ...j.p, carte: 'nulle_part' };
    expect(Jeu.charger(mondeTest(), p2).p.carte).toBe('ici');
  });
});
