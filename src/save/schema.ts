// Format de sauvegarde versionné : enveloppe + somme de contrôle + migrations + validation stricte.
import type { Partie } from '../core/state';
import { DIRS, type EquipSlot, type HeroState } from '../core/types';
import { HEROES } from '../data/heroes';
import { ITEMS } from '../data/items';
import { CARTES } from '../data/maps';
import { NIVEAU_MAX } from '../core/progression';

export const VERSION_SAUVEGARDE = 1;
export const FORMAT = 'kevlegende';

export interface Enveloppe {
  format: typeof FORMAT;
  version: number;
  horodatage: number;
  somme: string;
  resume: Resume;
  partie: Partie;
}

export interface Resume {
  carte: string;
  acte: number;
  niveau: number;
  tempsJeu: number;
  equipe: string[];
}

/** FNV-1a 32 bits sur la chaîne JSON : détecte les corruptions accidentelles. */
export function somme(texte: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < texte.length; i++) {
    h ^= texte.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function resumer(p: Partie): Resume {
  return {
    carte: p.carte,
    acte: p.acte,
    niveau: Math.max(...p.equipe.map((h) => h.niveau)),
    tempsJeu: Math.floor(p.tempsJeu),
    equipe: p.equipe.map((h) => h.id),
  };
}

export function emballer(p: Partie, maintenant = Date.now()): Enveloppe {
  return { format: FORMAT, version: VERSION_SAUVEGARDE, horodatage: maintenant, somme: somme(JSON.stringify(p)), resume: resumer(p), partie: p };
}

type Migration = (partie: Record<string, unknown>) => Record<string, unknown>;

/** Migrations : MIGRATIONS[n] transforme une partie au format n en format n+1. */
export const MIGRATIONS: Record<number, Migration> = {};

export class SauvegardeInvalide extends Error {}

/** Lit une enveloppe brute (JSON), vérifie, migre et valide. Lève SauvegardeInvalide en cas de problème. */
export function deballer(brut: unknown, migrations: Record<number, Migration> = MIGRATIONS): Enveloppe {
  if (!brut || typeof brut !== 'object') throw new SauvegardeInvalide('Sauvegarde illisible');
  const e = brut as Partial<Enveloppe>;
  if (e.format !== FORMAT) throw new SauvegardeInvalide('Ce fichier n’est pas une sauvegarde de Kevlegende');
  if (typeof e.version !== 'number' || e.version < 1) throw new SauvegardeInvalide('Version inconnue');
  if (e.version > VERSION_SAUVEGARDE) throw new SauvegardeInvalide('Sauvegarde créée par une version plus récente du jeu');
  if (!e.partie || typeof e.partie !== 'object') throw new SauvegardeInvalide('Partie absente');
  if (e.somme !== somme(JSON.stringify(e.partie))) throw new SauvegardeInvalide('Sauvegarde corrompue (somme de contrôle)');
  let partie = e.partie as unknown as Record<string, unknown>;
  for (let v = e.version; v < VERSION_SAUVEGARDE; v++) {
    const m = migrations[v];
    if (!m) throw new SauvegardeInvalide(`Migration ${v} → ${v + 1} manquante`);
    partie = m(partie);
  }
  const p = valider(partie);
  return { format: FORMAT, version: VERSION_SAUVEGARDE, horodatage: Number(e.horodatage) || 0, somme: somme(JSON.stringify(p)), resume: resumer(p), partie: p };
}

const nombre = (v: unknown, def: number, min = 0, max = Number.MAX_SAFE_INTEGER) =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : def;

/** Validation stricte + normalisation (objets inconnus retirés, valeurs bornées). */
export function valider(d: Record<string, unknown>): Partie {
  const err = (m: string) => {
    throw new SauvegardeInvalide(m);
  };
  const carte = typeof d.carte === 'string' && CARTES[d.carte] ? d.carte : err('Carte inconnue');
  const equipeBrute = Array.isArray(d.equipe) ? d.equipe : err('Équipe absente');
  const equipe: HeroState[] = [];
  for (const h of equipeBrute as Record<string, unknown>[]) {
    if (!h || typeof h.id !== 'string' || !HEROES[h.id]) err('Héros inconnu');
    if (equipe.some((x) => x.id === h.id)) err('Héros en double');
    const equipement: Partial<Record<EquipSlot, string>> = {};
    const eq = (h.equipement ?? {}) as Record<string, unknown>;
    for (const slot of ['arme', 'armure', 'accessoire'] as EquipSlot[]) {
      const id = eq[slot];
      if (typeof id === 'string' && ITEMS[id]?.type === slot) equipement[slot] = id;
    }
    equipe.push({
      id: h.id as string,
      niveau: Math.round(nombre(h.niveau, 1, 1, NIVEAU_MAX)),
      xp: Math.round(nombre(h.xp, 0)),
      pv: Math.round(nombre(h.pv, 1)),
      ps: Math.round(nombre(h.ps, 0)),
      equipement,
    });
  }
  if (equipe.length === 0) err('Équipe vide');
  const inventaire: Record<string, number> = {};
  for (const [id, n] of Object.entries((d.inventaire ?? {}) as Record<string, unknown>)) {
    if (ITEMS[id] && typeof n === 'number' && n > 0) inventaire[id] = Math.min(999, Math.floor(n));
  }
  const flags: Record<string, boolean> = {};
  for (const [k, v] of Object.entries((d.flags ?? {}) as Record<string, unknown>)) if (v === true) flags[k] = true;
  const quetes: Partie['quetes'] = {};
  for (const [k, v] of Object.entries((d.quetes ?? {}) as Record<string, unknown>)) if (v === 'active' || v === 'terminee') quetes[k] = v;
  const chaines = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
  return {
    carte,
    x: Math.round(nombre(d.x, 0)),
    y: Math.round(nombre(d.y, 0)),
    dir: DIRS.includes(d.dir as never) ? (d.dir as Partie['dir']) : 'bas',
    equipe,
    inventaire,
    or: Math.round(nombre(d.or, 0, 0, 9_999_999)),
    flags,
    quetes,
    coffres: chaines(d.coffres),
    bestiaire: chaines(d.bestiaire),
    vaincus: chaines(d.vaincus),
    pas: Math.round(nombre(d.pas, 0)),
    pasRencontre: Math.round(nombre(d.pasRencontre, 0)),
    tempsJeu: nombre(d.tempsJeu, 0),
    combats: Math.round(nombre(d.combats, 0)),
    victoires: Math.round(nombre(d.victoires, 0)),
    rng: Math.round(nombre(d.rng, 1, 0, 0xffffffff)),
    acte: Math.round(nombre(d.acte, 1, 1, 6)),
  };
}
