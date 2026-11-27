// Choix d'équipement et d'achats du bot.
import { ITEMS, item } from '../data/items';
import type { Jeu } from '../core/game';
import type { EquipSlot, ItemDef } from '../core/types';

const SLOTS: EquipSlot[] = ['arme', 'armure', 'accessoire'];

/** Valeur d'un équipement pour un héros donné. */
export function valeur(it: ItemDef, heroId: string): number {
  const b = it.bonus ?? {};
  const mage = heroId === 'mira';
  return (
    (b.atk ?? 0) * (mage ? 1 : 2) +
    (b.mag ?? 0) * (mage ? 2 : 0.3) +
    (b.def ?? 0) * 1.5 +
    (b.res ?? 0) * 1.2 +
    (b.vit ?? 0) * 1.5 +
    (b.pvMax ?? 0) * 0.25 +
    (b.psMax ?? 0) * 0.4 +
    (it.elementArme ? 3 : 0)
  );
}

const utilisable = (it: ItemDef, heroId: string) => !it.pour || it.pour.includes(heroId);

/** Équipe le meilleur matériel possédé. */
export function equiperMieux(j: Jeu): void {
  for (const h of j.p.equipe) {
    for (const slot of SLOTS) {
      const actuel = h.equipement[slot] ? valeur(item(h.equipement[slot]!), h.id) : -1;
      let best: string | null = null;
      let bv = actuel;
      for (const [id, n] of Object.entries(j.p.inventaire)) {
        const it = ITEMS[id];
        if (!it || n <= 0 || it.type !== slot || !utilisable(it, h.id)) continue;
        const v = valeur(it, h.id);
        if (v > bv) (best = id), (bv = v);
      }
      if (best) j.equiper(h.id, slot, best);
    }
  }
}

const STOCK: Record<string, number> = { herbe_douce: 8, tonique: 6, plume_aube: 3, gouttes_ciel: 4, sel_ecume: 2, elixir_vents: 2 };

/** Achats dans une boutique : améliorations d'équipement d'abord, puis consommables. */
export function faireCourses(j: Jeu, articles: readonly string[]): void {
  for (const h of j.p.equipe) {
    for (const slot of SLOTS) {
      const actuel = h.equipement[slot] ? valeur(item(h.equipement[slot]!), h.id) : -1;
      const candidats = articles
        .map(item)
        .filter((it) => it.type === slot && utilisable(it, h.id) && valeur(it, h.id) > actuel && it.prix <= j.p.or)
        .sort((a, b) => valeur(b, h.id) - valeur(a, h.id));
      const choix = candidats[0];
      if (choix && j.acheter(choix.id)) j.equiper(h.id, slot, choix.id);
    }
  }
  for (const id of articles) {
    const cible = STOCK[id];
    if (!cible) continue;
    while ((j.p.inventaire[id] ?? 0) < cible && j.p.or >= item(id).prix + 20) j.acheter(id);
  }
}
