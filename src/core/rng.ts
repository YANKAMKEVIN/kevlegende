// Générateur pseudo-aléatoire déterministe (mulberry32) : rejouable, sérialisable.

export class Rng {
  private s: number;
  constructor(seed: number) {
    this.s = seed >>> 0 || 0x9e3779b9;
  }
  get state(): number {
    return this.s;
  }
  set state(v: number) {
    this.s = v >>> 0;
  }
  next(): number {
    this.s = (this.s + 0x6d2b79f5) >>> 0;
    let t = this.s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  /** Entier dans [min, max]. */
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }
  chance(p: number): boolean {
    return this.next() < p;
  }
  pick<T>(arr: readonly T[]): T {
    if (arr.length === 0) throw new Error('pick sur un tableau vide');
    return arr[Math.floor(this.next() * arr.length)] as T;
  }
  weighted<T>(arr: readonly T[], weight: (t: T) => number): T {
    const total = arr.reduce((s, t) => s + Math.max(0, weight(t)), 0);
    if (total <= 0) return this.pick(arr);
    let r = this.next() * total;
    for (const t of arr) {
      r -= Math.max(0, weight(t));
      if (r < 0) return t;
    }
    return arr[arr.length - 1] as T;
  }
}
