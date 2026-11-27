// Portrait de repli (buste dessiné) quand l'illustration peinte n'est pas disponible.
import type { Apparence } from '../core/world/mapdef';
import { APP } from '../data/maps/apparences';
import { APP_HEROS, spritePerso } from './sprites';
import { ctx2d, rgba, toile } from './util';

const cache = new Map<string, HTMLCanvasElement>();

export function apparencePortrait(id: string): Apparence {
  return APP_HEROS[id] ?? (APP as Record<string, Apparence>)[id] ?? APP.villageois;
}

export function portraitDessine(id: string, taille = 192): HTMLCanvasElement {
  const k = `${id}:${taille}`;
  const deja = cache.get(k);
  if (deja) return deja;
  const c = toile(taille, taille);
  const x = ctx2d(c);
  const a = apparencePortrait(id);
  const g = x.createLinearGradient(0, 0, 0, taille);
  g.addColorStop(0, '#9fd3ec');
  g.addColorStop(1, '#f6e7c8');
  x.fillStyle = g;
  x.fillRect(0, 0, taille, taille);
  x.fillStyle = rgba('#ffffff', 0.5);
  x.beginPath();
  x.arc(taille * 0.2, taille * 0.8, taille * 0.25, 0, Math.PI * 2);
  x.arc(taille * 0.85, taille * 0.75, taille * 0.2, 0, Math.PI * 2);
  x.fill();
  // Le sprite « bas » agrandi, cadré sur la tête et le buste.
  const sp = spritePerso(a, 'bas', 0, 96);
  x.imageSmoothingEnabled = true;
  x.drawImage(sp, 4, 22, 88, 88, 0, taille * 0.06, taille, taille);
  cache.set(k, c);
  return c;
}
