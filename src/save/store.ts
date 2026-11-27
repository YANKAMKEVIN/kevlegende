// Stockage des sauvegardes : 3 emplacements + sauvegarde automatique, copie de secours, export/import.
import type { Partie } from '../core/state';
import { deballer, emballer, SauvegardeInvalide, type Enveloppe } from './schema';

export interface Stockage {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

export const EMPLACEMENTS = ['auto', '1', '2', '3'] as const;
export type Emplacement = (typeof EMPLACEMENTS)[number];

const cle = (e: Emplacement) => `kevlegende:sauvegarde:${e}`;
const cleSecours = (e: Emplacement) => `${cle(e)}:secours`;

export class Memoire implements Stockage {
  m = new Map<string, string>();
  getItem(k: string) {
    return this.m.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.m.set(k, v);
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
}

export type Lecture = { ok: true; enveloppe: Enveloppe; secours: boolean } | { ok: false; erreur: string } | { ok: false; vide: true; erreur: string };

export class Sauvegardes {
  constructor(private readonly s: Stockage) {}

  /** Écrit la partie ; l'ancienne version devient la copie de secours. Vérifie l'écriture en relisant. */
  ecrire(e: Emplacement, p: Partie, maintenant = Date.now()): boolean {
    const texte = JSON.stringify(emballer(p, maintenant));
    try {
      const ancien = this.s.getItem(cle(e));
      if (ancien && this.valide(ancien)) this.s.setItem(cleSecours(e), ancien);
      this.s.setItem(cle(e), texte);
      if (this.s.getItem(cle(e)) !== texte) throw new Error('Relecture différente');
      return true;
    } catch {
      return false;
    }
  }

  private valide(texte: string): boolean {
    try {
      deballer(JSON.parse(texte));
      return true;
    } catch {
      return false;
    }
  }

  /** Lit un emplacement ; bascule sur la copie de secours si la principale est abîmée. */
  lire(e: Emplacement): Lecture {
    let principal: string | null = null;
    try {
      principal = this.s.getItem(cle(e));
    } catch {
      return { ok: false, erreur: 'Stockage indisponible' };
    }
    let erreur = 'Emplacement vide';
    if (principal) {
      try {
        return { ok: true, enveloppe: deballer(JSON.parse(principal)), secours: false };
      } catch (x) {
        erreur = x instanceof SauvegardeInvalide ? x.message : 'Sauvegarde illisible';
      }
    }
    const secours = this.s.getItem(cleSecours(e));
    if (secours) {
      try {
        return { ok: true, enveloppe: deballer(JSON.parse(secours)), secours: true };
      } catch {
        /* rien à récupérer */
      }
    }
    return principal ? { ok: false, erreur } : { ok: false, vide: true, erreur };
  }

  effacer(e: Emplacement): void {
    this.s.removeItem(cle(e));
    this.s.removeItem(cleSecours(e));
  }

  /** La plus récente des sauvegardes valides (pour « Continuer »). */
  plusRecente(): { emplacement: Emplacement; enveloppe: Enveloppe } | null {
    let best: { emplacement: Emplacement; enveloppe: Enveloppe } | null = null;
    for (const e of EMPLACEMENTS) {
      const l = this.lire(e);
      if (l.ok && (!best || l.enveloppe.horodatage > best.enveloppe.horodatage)) best = { emplacement: e, enveloppe: l.enveloppe };
    }
    return best;
  }
}

/** Export texte (pour changer d'appareil) : JSON compact encodé en base64 URL. */
export function exporter(p: Partie): string {
  const json = JSON.stringify(emballer(p));
  const octets = new TextEncoder().encode(json);
  let bin = '';
  for (const o of octets) bin += String.fromCharCode(o);
  return btoa(bin);
}

export function importer(texte: string): Enveloppe {
  let json: string;
  try {
    const bin = atob(texte.trim());
    json = new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
  } catch {
    throw new SauvegardeInvalide('Code de sauvegarde illisible');
  }
  try {
    return deballer(JSON.parse(json));
  } catch (e) {
    if (e instanceof SauvegardeInvalide) throw e;
    throw new SauvegardeInvalide('Code de sauvegarde illisible');
  }
}
