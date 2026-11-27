// Création d'éléments DOM concise et sûre (texte via textContent, jamais d'innerHTML).

type Enfant = Node | string | null | undefined | false;
type Attrs = Record<string, string | number | boolean | ((e: Event) => void) | undefined>;

export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs = {}, ...enfants: (Enfant | Enfant[])[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === false) continue;
    if (typeof v === 'function') el.addEventListener(k.replace(/^on/, ''), v);
    else if (k === 'class') el.className = String(v);
    else if (k === 'text') el.textContent = String(v);
    else if (k === 'style') el.setAttribute('style', String(v));
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, String(v));
  }
  for (const e of enfants.flat()) {
    if (e === null || e === undefined || e === false) continue;
    el.append(typeof e === 'string' ? document.createTextNode(e) : e);
  }
  return el;
}

export function vider(el: HTMLElement): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

/** Bouton avec action (clic, tactile ou Entrée). */
export function bouton(texte: string, action: () => void, classe = 'btn', attrs: Attrs = {}): HTMLButtonElement {
  return h('button', { class: classe, type: 'button', ...attrs, onclick: (e: Event) => {
    e.stopPropagation();
    action();
  } }, texte);
}

export function jauge(val: number, max: number, classe: string): HTMLElement {
  const pct = max > 0 ? Math.max(0, Math.min(100, (val / max) * 100)) : 0;
  return h('div', { class: `jauge ${classe}` }, h('div', { class: 'jauge-plein', style: `width:${pct.toFixed(1)}%` }));
}

export const formatTemps = (s: number) => {
  const m = Math.floor(s / 60);
  return `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}`;
};
