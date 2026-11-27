import { describe, expect, it } from 'vitest';
import { deballer, emballer, somme, valider, VERSION_SAUVEGARDE, SauvegardeInvalide } from '../../src/save/schema';
import { exporter, importer, Memoire, Sauvegardes } from '../../src/save/store';
import { nouvellePartie } from '../../src/core/state';

const partie = () => {
  const p = nouvellePartie(9, { carte: 'clairval', x: 10, y: 10 });
  p.flags['a'] = true;
  p.quetes['q_fanal'] = 'active';
  return p;
};

describe('Format', () => {
  it('aller-retour fidèle', () => {
    const p = partie();
    const e = deballer(JSON.parse(JSON.stringify(emballer(p, 123))));
    expect(e.partie).toEqual(p);
    expect(e.version).toBe(VERSION_SAUVEGARDE);
    expect(e.resume.niveau).toBe(1);
    expect(e.horodatage).toBe(123);
  });
  it('détecte corruption, format et version', () => {
    const e = emballer(partie());
    expect(() => deballer(null)).toThrow(SauvegardeInvalide);
    expect(() => deballer({ ...e, format: 'autre' })).toThrow(/pas une sauvegarde/);
    expect(() => deballer({ ...e, version: 0 })).toThrow();
    expect(() => deballer({ ...e, version: 99 })).toThrow(/plus récente/);
    expect(() => deballer({ ...e, partie: undefined })).toThrow();
    expect(() => deballer({ ...e, partie: { ...e.partie, or: 999999 } })).toThrow(/corrompue/);
    expect(somme('a')).not.toBe(somme('b'));
  });
  it('applique les migrations dans l’ordre', () => {
    const vieille = { ...partie(), ancienChamp: 1 } as Record<string, unknown>;
    delete vieille.vaincus;
    const env = { format: 'kevlegende', version: 0.5, horodatage: 1, somme: somme(JSON.stringify(vieille)), partie: vieille };
    expect(() => deballer(env)).toThrow();
    // Une migration fictive v1 -> v2 n'est pas appelée tant que la version courante est 1.
    const ok = deballer({ ...env, version: 1 }, { 1: () => ({}) });
    expect(ok.partie.vaincus).toEqual([]);
  });
  it('valide et normalise', () => {
    const p = partie() as unknown as Record<string, unknown>;
    const n = valider({ ...p, inventaire: { tonique: 2.7, faux: 3, herbe_douce: -1 }, or: -5, dir: 'nord', flags: { a: true, b: 'oui' }, quetes: { x: 'active', y: 'bof' } });
    expect(n.inventaire).toEqual({ tonique: 2 });
    expect(n.or).toBe(0);
    expect(n.dir).toBe('bas');
    expect(n.flags).toEqual({ a: true });
    expect(n.quetes).toEqual({ x: 'active' });
    expect(() => valider({ ...p, carte: 'atlantide' })).toThrow();
    expect(() => valider({ ...p, equipe: [] })).toThrow();
    expect(() => valider({ ...p, equipe: [{ id: 'zorro' }] })).toThrow();
    expect(() => valider({ ...p, equipe: [{ id: 'ael' }, { id: 'ael' }] })).toThrow();
    expect(() => valider({ ...p, equipe: 'x' })).toThrow();
    const eq = valider({ ...p, equipe: [{ id: 'ael', niveau: 999, equipement: { arme: 'tonique', armure: 'tunique' } }] }).equipe[0]!;
    expect(eq.niveau).toBe(60);
    expect(eq.equipement).toEqual({ armure: 'tunique' });
  });
});

describe('Emplacements', () => {
  it('écrit, relit, garde une copie de secours et récupère après corruption', () => {
    const m = new Memoire();
    const s = new Sauvegardes(m);
    expect(s.lire('1')).toMatchObject({ ok: false, vide: true });
    const p = partie();
    expect(s.ecrire('1', p, 1)).toBe(true);
    p.or = 777;
    expect(s.ecrire('1', p, 2)).toBe(true);
    const l = s.lire('1');
    expect(l.ok && l.enveloppe.partie.or).toBe(777);
    m.setItem('kevlegende:sauvegarde:1', '{cassé');
    const r = s.lire('1');
    expect(r.ok && r.secours).toBe(true);
    expect(r.ok && r.enveloppe.partie.or).toBe(30);
    m.setItem('kevlegende:sauvegarde:1:secours', 'non');
    expect(s.lire('1')).toMatchObject({ ok: false });
    s.effacer('1');
    expect(s.lire('1')).toMatchObject({ ok: false, vide: true });
  });
  it('la plus récente et les pannes de stockage', () => {
    const s = new Sauvegardes(new Memoire());
    expect(s.plusRecente()).toBeNull();
    s.ecrire('auto', partie(), 10);
    s.ecrire('2', partie(), 20);
    expect(s.plusRecente()?.emplacement).toBe('2');
    const panne = new Sauvegardes({ getItem: () => { throw new Error('x'); }, setItem: () => { throw new Error('plein'); }, removeItem: () => {} });
    expect(panne.ecrire('1', partie())).toBe(false);
    expect(panne.lire('1')).toMatchObject({ ok: false, erreur: 'Stockage indisponible' });
    const menteur = new Sauvegardes({ getItem: () => 'autre', setItem: () => {}, removeItem: () => {} });
    expect(menteur.ecrire('1', partie())).toBe(false);
  });
  it('export / import par code', () => {
    const p = partie();
    p.flags['accentué_é'] = true;
    const code = exporter(p);
    expect(importer(code).partie).toEqual(p);
    expect(() => importer('%%%')).toThrow(SauvegardeInvalide);
    expect(() => importer(btoa('pas du json'))).toThrow(SauvegardeInvalide);
    expect(() => importer(btoa('{"format":"x"}'))).toThrow(/pas une sauvegarde/);
  });
});
