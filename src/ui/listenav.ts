// Navigation clavier/manette dans une liste de boutons (haut/bas + A), en plus du tactile.
import type { Dir } from '../core/types';

export class ListeNav {
  i = 0;
  constructor(private readonly racine: HTMLElement, private readonly selecteur = 'button:not([disabled])') {}

  private items(): HTMLElement[] {
    return [...this.racine.querySelectorAll<HTMLElement>(this.selecteur)].filter((e) => e.offsetParent !== null || e.getClientRects().length > 0);
  }
  maj(): void {
    const it = this.items();
    if (it.length === 0) return;
    this.i = Math.max(0, Math.min(this.i, it.length - 1));
    it.forEach((e, k) => e.classList.toggle('focus', k === this.i));
    it[this.i]?.scrollIntoView?.({ block: 'nearest' });
  }
  dir(d: Dir): void {
    const it = this.items();
    if (it.length === 0) return;
    if (d === 'haut' || d === 'gauche') this.i = (this.i - 1 + it.length) % it.length;
    else this.i = (this.i + 1) % it.length;
    this.maj();
  }
  valider(): boolean {
    const it = this.items();
    const e = it[this.i];
    if (!e) return false;
    e.click();
    return true;
  }
}
