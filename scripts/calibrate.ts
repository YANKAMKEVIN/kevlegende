// Calibrage des boss : taux de victoire du bot selon le niveau du groupe (équipement typique de l'acte).
import { creerCombat } from '../src/core/battle/setup';
import { avancer, agir } from '../src/core/battle/battle';
import { nouveauHeros } from '../src/core/state';
import { xpPourNiveau } from '../src/core/progression';
import { choisirAction } from '../src/bot/tactique';
import type { HeroState } from '../src/core/types';

interface Cas { nom: string; groupe: string[]; heros: string[]; equip: Record<string, Record<string, string>>; inv: Record<string, number> }
const CAS: Cas[] = [
  { nom: 'Grand Loup', groupe: ['loup_brume', 'grand_loup'], heros: ['ael', 'mira'], equip: { ael: { arme: 'sabre_voile', armure: 'veste_cuir' }, mira: { arme: 'arc_saule' } }, inv: { herbe_douce: 6 } },
  { nom: 'Serpent', groupe: ['serpent_echo'], heros: ['ael', 'mira'], equip: { ael: { arme: 'sabre_voile', armure: 'veste_cuir' }, mira: { arme: 'arc_saule', armure: 'veste_cuir', accessoire: 'amulette_fanal' } }, inv: { herbe_douce: 6, tonique: 2, galet_tonnerre: 1 } },
  { nom: 'Sentinelle', groupe: ['ombre_errante', 'sentinelle_voilee', 'ombre_errante'], heros: ['ael', 'mira'], equip: { ael: { arme: 'lame_alize', armure: 'veste_cuir', accessoire: 'bague_vigueur' }, mira: { arme: 'arc_saule', armure: 'veste_cuir', accessoire: 'amulette_fanal' } }, inv: { herbe_douce: 6, tonique: 2, fiole_givre: 2 } },
  { nom: 'Capitaine Creux', groupe: ['pirate_brume', 'capitaine_creux', 'pirate_brume'], heros: ['ael', 'mira', 'brann'], equip: { ael: { arme: 'lame_alize', armure: 'manteau_brume', accessoire: 'bague_vigueur' }, mira: { arme: 'arc_saule', armure: 'veste_cuir', accessoire: 'amulette_fanal' }, brann: {} }, inv: { herbe_douce: 6, tonique: 4, plume_aube: 1 } },
  { nom: 'Kraken', groupe: ['kraken_brume'], heros: ['ael', 'mira', 'brann'], equip: { ael: { arme: 'epee_corail', armure: 'cotte_legere', accessoire: 'boucle_corsaire' }, mira: { arme: 'arc_lune', armure: 'manteau_brume', accessoire: 'amulette_fanal' }, brann: { arme: 'masse_ancre', armure: 'cotte_legere' } }, inv: { tonique: 5, plume_aube: 2, elixir_vents: 1 } },
];

function simuler(c: Cas, niveau: number, seed: number): boolean {
  const equipe: HeroState[] = c.heros.map((h) => {
    const s = nouveauHeros(h, niveau, xpPourNiveau(niveau));
    Object.assign(s.equipement, c.equip[h] ?? {});
    const full = nouveauHeros(h, niveau);
    Object.assign(full.equipement, s.equipement);
    return { ...s, pv: 9999, ps: 9999 };
  });
  const b = creerCombat(c.groupe, equipe, { seed, fuite: false });
  for (const x of b.combattants) if (x.camp === 'heros') (x.pv = x.stats.pvMax), (x.ps = x.stats.psMax);
  const inv = { ...c.inv };
  let g = 0;
  while (!b.fini && g++ < 2000) {
    avancer(b);
    if (b.attente) agir(b, choisirAction(b, b.combattants.find((x) => x.uid === b.attente)!, inv), inv);
  }
  return b.fini === 'victoire';
}

const filtre = process.argv[2];
const niveaux = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
for (const c of CAS) {
  if (filtre && c.nom !== filtre) continue;
  const ligne: string[] = [];
  for (const n of niveaux ?? Array.from({ length: 21 }, (_, i) => i + 2)) {
    let v = 0;
    for (let s = 1; s <= 60; s++) if (simuler(c, n, s * 7919)) v++;
    const pct = Math.round((v / 60) * 100);
    if (niveaux || (pct > 0 && pct < 100)) ligne.push(`niv${n}:${pct}%`);
    if (!niveaux && pct === 100) { ligne.push(`niv${n}:100%`); break; }
  }
  console.log(c.nom.padEnd(16), ligne.join(' '));
}
