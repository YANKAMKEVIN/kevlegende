import { describe, expect, it } from 'vitest';
import { validerMonde } from '../../src/data/validate';
import { MONDE } from '../../src/data/monde';
import { mondeTest } from './helpers';
import { enemy } from '../../src/data/enemies';
import { hero } from '../../src/data/heroes';
import { item } from '../../src/data/items';
import { skill } from '../../src/data/skills';
import { ACTE1, ACTE2, ACTE3, ACTE4, AVENTURE } from '../../src/bot/walkthrough';

describe('Contenu du jeu', () => {
  it('est entièrement cohérent (références, ancres, accessibilité)', () => {
    expect(validerMonde(MONDE)).toEqual([]);
  });
  it('les recherches inconnues échouent clairement', () => {
    expect(() => enemy('x')).toThrow();
    expect(() => hero('x')).toThrow();
    expect(() => item('x')).toThrow();
    expect(() => skill('x')).toThrow();
  });
  it('la solution couvre les quatre actes', () => {
    expect(AVENTURE.length).toBe(ACTE1.length + ACTE2.length + ACTE3.length + ACTE4.length);
    for (const fin of ['acte2_fini', 'acte3_fini', 'acte4_fini']) expect(AVENTURE.some((e) => 'jusqua' in e && e.jusqua === fin)).toBe(true);
  });
  it('chaque quête est donnée et terminée quelque part', () => {
    const textes = JSON.stringify(MONDE.evenements);
    for (const id of Object.keys(MONDE.quetes)) {
      expect(textes).toContain(`"id":"${id}","etat":"active"`);
      expect(textes).toContain(`"id":"${id}","etat":"terminee"`);
    }
  });
  it('le validateur détecte les erreurs', () => {
    const m = mondeTest();
    const casse = {
      ...m,
      evenements: { ...m.evenements, x: [{ c: 'donne' as const, objet: 'zz' }, { c: 'combat' as const, groupe: ['zz'] }, { c: 'rejoint' as const, hero: 'zz' }, { c: 'teleporte' as const, carte: 'zz', ancre: 'A' }, { c: 'teleporte' as const, carte: 'ici', ancre: 'µ' }, { c: 'boutique' as const, id: 'zz' }, { c: 'quete' as const, id: 'zz', etat: 'active' as const }, { c: 'appel' as const, evenement: 'zz' }, { c: 'si' as const, cond: [], alors: [{ c: 'appel' as const, evenement: 'zz2' }], sinon: [] }, { c: 'choix' as const, texte: '', options: [{ texte: '', faire: [{ c: 'appel' as const, evenement: 'zz3' }] }] }, { c: 'paye' as const, n: 1, alors: [], sinon: [{ c: 'appel' as const, evenement: 'zz4' }] }] },
      boutiques: { b: { nom: 'b', articles: ['zz'] } },
      cartes: {
        ...m.cartes,
        ici: { ...m.cartes['ici']!, pnj: [{ ...m.cartes['ici']!.pnj![0]!, ancre: 'µ', evenement: 'zz' }], portes: [{ ancre: 'D', vers: 'zz', arrivee: 'A' }, { ancre: 'D', vers: 'labas', arrivee: 'µ' }, { ancre: 'D', vers: 'labas', arrivee: 'A', sinon: 'zz' }], coffres: [{ ancre: '1', id: 'c', objet: 'zz' }], rencontres: { taux: 1, niveauConseille: 1, groupes: [{ ennemis: ['zz'], poids: 1 }] } },
        bancale: { ...m.cartes['labas']!, id: 'bancale', plan: ['CCC', 'CA'] },
      },
      depart: { carte: 'zz', ancre: '@', evenement: 'zz' },
    };
    const err = validerMonde(casse);
    expect(err.length).toBeGreaterThan(15);
    expect(err.join('\n')).toMatch(/largeurs différentes/);
  });
  it('détecte un élément inaccessible', () => {
    const m = mondeTest();
    const ici = m.cartes['ici']!;
    const plan = [...ici.plan];
    plan[4] = '#.Y#Z#####';
    plan[5] = '#...G.#2##';
    const err = validerMonde({ ...m, cartes: { ...m.cartes, ici: { ...ici, plan, coffres: [] } } });
    expect(err.some((e) => /inaccessible/.test(e))).toBe(true);
  });
});

describe('Illustrations', () => {
  it('la liste correspond exactement aux fichiers de public/art', async () => {
    const { readdirSync } = await import('node:fs');
    const { ILLUSTRATIONS } = await import('../../src/render/assets');
    const fichiers = readdirSync('public/art').filter((f) => f.endsWith('.webp')).map((f) => f.slice(0, -5)).sort();
    expect([...ILLUSTRATIONS].sort()).toEqual(fichiers);
  });
});
