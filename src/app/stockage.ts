// Accès sûr au localStorage (mode privé, quota plein…) et options du joueur.
import type { Stockage } from '../save/store';

export class StockageNavigateur implements Stockage {
  private secours = new Map<string, string>();
  getItem(k: string): string | null {
    try {
      return window.localStorage.getItem(k);
    } catch {
      return this.secours.get(k) ?? null;
    }
  }
  setItem(k: string, v: string): void {
    try {
      window.localStorage.setItem(k, v);
    } catch {
      this.secours.set(k, v);
      throw new Error('Stockage plein ou indisponible');
    }
  }
  removeItem(k: string): void {
    try {
      window.localStorage.removeItem(k);
    } catch {
      this.secours.delete(k);
    }
  }
}

export interface Options {
  musique: number;
  sons: number;
  texte: number;
  tactile: boolean;
}

const CLE = 'kevlegende:options';

export function lireOptions(): Options {
  const defaut: Options = {
    musique: 0.6,
    sons: 0.8,
    texte: 0.5,
    tactile: typeof matchMedia === 'function' ? matchMedia('(pointer: coarse)').matches : false,
  };
  try {
    const o = JSON.parse(window.localStorage.getItem(CLE) ?? 'null') as Partial<Options> | null;
    if (!o || typeof o !== 'object') return defaut;
    const n = (v: unknown, d: number) => (typeof v === 'number' && v >= 0 && v <= 1 ? v : d);
    return { musique: n(o.musique, defaut.musique), sons: n(o.sons, defaut.sons), texte: n(o.texte, defaut.texte), tactile: typeof o.tactile === 'boolean' ? o.tactile : defaut.tactile };
  } catch {
    return defaut;
  }
}

export function ecrireOptions(o: Options): void {
  try {
    window.localStorage.setItem(CLE, JSON.stringify(o));
  } catch {
    /* options non persistées */
  }
}
