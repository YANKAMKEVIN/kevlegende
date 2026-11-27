import { describe, expect, it } from 'vitest';
import { agir, avancer, ordrePrevu, trouver, validerAction, vivants } from '../../src/core/battle/battle';
import { creerCombat, offenseEnnemi } from '../../src/core/battle/setup';
import { affinite, calculerDegats, degatsObjet } from '../../src/core/battle/damage';
import { ajouterStatut, aStatut, purifier, retirerStatut, vieillirStatuts } from '../../src/core/battle/status';
import type { BattleState } from '../../src/core/battle/types';
import { nouveauHeros } from '../../src/core/state';
import { xpPourNiveau } from '../../src/core/progression';

const equipe = (niv = 10) => ['ael', 'mira'].map((h) => nouveauHeros(h, niv, xpPourNiveau(niv)));

function jusquAuHeros(b: BattleState) {
  avancer(b);
  return b.attente;
}

describe('Mise en place', () => {
  it('crée héros et ennemis, nomme les doublons, refuse un groupe vide', () => {
    const b = creerCombat(['gelee_rosee', 'gelee_rosee'], equipe(), { seed: 1 });
    expect(b.combattants.map((c) => c.nom)).toEqual(['Aël', 'Mira', 'Gelée de rosée A', 'Gelée de rosée B']);
    expect(b.fuitePossible).toBe(true);
    expect(() => creerCombat([], equipe(), { seed: 1 })).toThrow();
    expect(() => creerCombat(['inconnu'], equipe(), { seed: 1 })).toThrow();
    const boss = creerCombat(['grand_loup'], equipe(), { seed: 1 });
    expect(boss.boss).toBe(true);
    expect(boss.fuitePossible).toBe(false);
  });
  it('la pression offensive augmente avec le niveau des ennemis', () => {
    expect(offenseEnnemi(1, false)).toBe(1);
    expect(offenseEnnemi(20, false)).toBeCloseTo(1.6);
    expect(offenseEnnemi(1, true)).toBeGreaterThan(2);
  });
  it('mémorise les faiblesses connues', () => {
    const b = creerCombat(['gelee_rosee'], equipe(), { seed: 1, connues: ['gelee_rosee:feu'] });
    expect(trouver(b, 'e:0').revelees).toEqual(['feu']);
  });
});

describe('Dégâts et affinités', () => {
  const b = creerCombat(['gelee_rosee'], equipe(), { seed: 1 });
  const ael = trouver(b, 'h:ael');
  const gelee = trouver(b, 'e:0');
  it('faiblesse ×1,5, défense et brisé', () => {
    expect(affinite(gelee, 'feu')).toBe('faible');
    expect(affinite(gelee, 'neutre')).toBe('normal');
    const n = calculerDegats(ael, gelee, 'physique', 10, 'neutre', 0.5, 0.9).valeur;
    const f = calculerDegats(ael, gelee, 'physique', 10, 'feu', 0.5, 0.9);
    expect(f.faible).toBe(true);
    expect(f.valeur).toBeGreaterThan(n);
    const crit = calculerDegats(ael, gelee, 'physique', 10, 'neutre', 0.5, 0);
    expect(crit.critique).toBe(true);
    gelee.defense = true;
    expect(calculerDegats(ael, gelee, 'physique', 10, 'neutre', 0.5, 0.9).valeur).toBeLessThan(n);
    gelee.defense = false;
    gelee.resistances = ['eau'];
    expect(calculerDegats(ael, gelee, 'magique', 10, 'eau', 0.5, 0.9).resiste).toBe(true);
    expect(degatsObjet(gelee, 30, 'feu').valeur).toBeGreaterThan(degatsObjet(gelee, 30, 'neutre').valeur);
  });
});

describe('Statuts', () => {
  it('ajout, durée, purification', () => {
    const b = creerCombat(['gelee_rosee'], equipe(), { seed: 1 });
    const c = trouver(b, 'h:ael');
    ajouterStatut(c, 'poison', 2);
    ajouterStatut(c, 'poison', 1);
    ajouterStatut(c, 'hate', 1);
    expect(aStatut(c, 'poison')).toBe(true);
    expect(vieillirStatuts(c)).toEqual(['hate']);
    expect(purifier(c)).toEqual(['poison']);
    expect(retirerStatut(c, 'protege')).toBe(false);
  });
});

describe('Déroulement', () => {
  it('ordre des tours prévisible et victoire contre une gelée', () => {
    const b = creerCombat(['gelee_rosee'], equipe(15), { seed: 3 });
    expect(ordrePrevu(b, 6)).toHaveLength(6);
    let garde = 0;
    while (!b.fini && garde++ < 50) {
      if (jusquAuHeros(b)) agir(b, { type: 'attaque', cible: 'e:0' }, {});
    }
    expect(b.fini).toBe('victoire');
    expect(vivants(b, 'ennemis')).toHaveLength(0);
    expect(() => agir(b, { type: 'defense' }, {})).toThrow();
  });
  it('briser un bouclier fait perdre des tours à l’ennemi', () => {
    const b = creerCombat(['gelee_rosee'], equipe(1), { seed: 3 });
    const g = trouver(b, 'e:0');
    g.pv = 9999;
    g.stats.pvMax = 9999;
    let brise = false;
    let garde = 0;
    while (!brise && garde++ < 40) {
      if (!jusquAuHeros(b)) continue;
      const ev = agir(b, { type: 'competence', id: b.attente === 'h:ael' ? 'tranche_vent' : 'fleche_givre', cible: 'e:0' }, {});
      if (b.attente === null && trouver(b, b.combattants[0]!.uid).ps < 3) trouver(b, 'h:ael').ps = 99;
      brise = ev.some((e) => e.t === 'brise');
    }
    expect(brise).toBe(true);
    expect(g.brise).toBeGreaterThan(0);
    expect(g.revelees).toContain('vent');
  });
  it('validation des actions', () => {
    const b = creerCombat(['gelee_rosee'], equipe(), { seed: 2 });
    jusquAuHeros(b);
    const c = trouver(b, b.attente!);
    expect(validerAction(b, c, { type: 'competence', id: 'inconnue', cible: 'e:0' }, {})).toBeTruthy();
    expect(validerAction(b, c, { type: 'objet', id: 'tonique', cible: c.uid }, {})).toBeTruthy();
    expect(validerAction(b, c, { type: 'objet', id: 'epee_bois', cible: c.uid }, { epee_bois: 1 })).toBeTruthy();
    expect(validerAction(b, c, { type: 'attaque', cible: c.uid }, {})).toBeTruthy();
    expect(validerAction(b, c, { type: 'attaque', cible: 'zz' }, {})).toBeTruthy();
    expect(validerAction(b, c, { type: 'defense' }, {})).toBeNull();
    c.ps = 0;
    expect(validerAction(b, c, { type: 'competence', id: c.competences.find((x) => x !== 'baume') ?? 'tranche_vent', cible: 'e:0' }, {})).toBeTruthy();
    expect(() => agir(b, { type: 'attaque', cible: 'h:ael' }, {})).toThrow();
  });
  it('objets, soins, réveil et défense', () => {
    const b = creerCombat(['gelee_rosee'], equipe(12), { seed: 4 });
    const inv: Record<string, number> = { herbe_douce: 1, plume_aube: 1, bombe_braise: 1, gouttes_ciel: 1, sel_ecume: 1, elixir_vents: 1 };
    const ael = trouver(b, 'h:ael');
    const mira = trouver(b, 'h:mira');
    const g = trouver(b, 'e:0');
    g.pv = g.stats.pvMax = 5000;
    const ordres = [
      () => ({ type: 'objet' as const, id: 'herbe_douce', cible: 'h:ael' }),
      () => ({ type: 'objet' as const, id: 'plume_aube', cible: 'h:mira' }),
      () => ({ type: 'objet' as const, id: 'bombe_braise', cible: 'e:0' }),
      () => ({ type: 'objet' as const, id: 'gouttes_ciel', cible: 'h:ael' }),
      () => ({ type: 'objet' as const, id: 'sel_ecume', cible: 'h:ael' }),
      () => ({ type: 'objet' as const, id: 'elixir_vents', cible: 'h:ael' }),
      () => ({ type: 'competence' as const, id: 'brise_douce', cible: 'h:mira' }),
      () => ({ type: 'competence' as const, id: 'eveil', cible: 'h:ael' }),
      () => ({ type: 'competence' as const, id: 'purification', cible: 'h:ael' }),
      () => ({ type: 'defense' as const }),
    ];
    const vus = new Set<string>();
    for (const o of ordres) {
      if (!jusquAuHeros(b)) break;
      ael.pv = Math.max(1, ael.pv - 30);
      ael.ps = 0;
      mira.ps = 99;
      if (o().type === 'objet' && (o() as { id: string }).id === 'plume_aube') mira.pv = 0;
      if (o().type === 'competence' && (o() as { id: string }).id === 'eveil') {
        ael.pv = 0;
        b.attente = 'h:mira';
      } else if (o().type === 'competence') b.attente = 'h:mira';
      if (mira.pv <= 0 && b.attente === 'h:mira') b.attente = 'h:ael';
      ajouterStatut(ael, 'poison', 3);
      for (const e of agir(b, o(), inv)) vus.add(e.t);
      if (b.fini) break;
    }
    expect(vus).toContain('soin');
    expect(vus).toContain('releve');
    expect(vus).toContain('degats');
    expect(inv['herbe_douce']).toBeUndefined();
  });
  it('la fuite finit par réussir, sauf contre un boss', () => {
    const b = creerCombat(['gelee_rosee'], equipe(20), { seed: 9 });
    let garde = 0;
    while (!b.fini && garde++ < 50) if (jusquAuHeros(b)) agir(b, { type: 'fuite' }, {});
    expect(b.fini).toBe('fuite');
    const boss = creerCombat(['grand_loup'], equipe(), { seed: 9 });
    jusquAuHeros(boss);
    expect(() => agir(boss, { type: 'fuite' }, {})).toThrow();
  });
  it('défaite quand tout le groupe tombe ; sommeil et poison font leur effet', () => {
    const b = creerCombat(['champi_dormeur', 'champi_dormeur', 'champi_dormeur'], [nouveauHeros('ael')], { seed: 11 });
    const ael = trouver(b, 'h:ael');
    ael.stats.def = 0;
    ael.stats.res = 0;
    ajouterStatut(ael, 'sommeil', 1);
    let garde = 0;
    const vus = new Set<string>();
    while (!b.fini && garde++ < 200) {
      for (const e of avancer(b)) vus.add(e.t === 'message' ? 'message' : e.t);
      if (b.attente) {
        ajouterStatut(ael, 'poison', 2);
        for (const e of agir(b, { type: 'defense' }, {})) vus.add(e.t);
      }
    }
    expect(b.fini).toBe('defaite');
    expect(vus).toContain('message');
  });
});
