// Le bot joue l'aventure à travers l'API du jeu, exactement comme un joueur (sans tricher sur l'état).
import type { Jeu } from '../core/game';
import { statsHeros } from '../core/state';
import { ancre, casesProp, condVraie, type Pos } from '../core/world/map';
import { pnjVisibles } from '../core/world/explore';
import { tuile } from '../core/world/map';
import { chemin, directionVers, routeCartes, voisins } from './nav';
import { choisirAction } from './tactique';
import { equiperMieux, faireCourses } from './equipement';
import { REPOS, type Etape } from './walkthrough';

export interface Journal {
  pas: number;
  combats: number;
  defaites: number;
  etapes: number;
  fini: boolean;
}

export class Bot {
  journal: Journal = { pas: 0, combats: 0, defaites: 0, etapes: 0, fini: false };
  private actions = 0;
  constructor(
    readonly j: Jeu,
    private readonly maxActions = 400_000,
    private readonly log: (m: string) => void = () => {},
  ) {}

  private tic(): void {
    if (++this.actions > this.maxActions) throw new Error(`Bot bloqué (carte ${this.j.p.carte}, ${this.j.p.x},${this.j.p.y}, objectif « ${this.j.objectif()} »)`);
  }

  /** Résout tout ce qui n'est pas de l'exploration (dialogues, combats, boutiques). */
  gerer(): void {
    const j = this.j;
    while (j.mode !== 'exploration') {
      this.tic();
      if (j.mode === 'combat') this.combattre();
      else if (j.mode === 'defaite') {
        this.journal.defaites++;
        this.log(`Défaite (${j.p.carte}) contre ${j.combat?.groupe.join("+") ?? "?"} niv ${j.p.equipe.map((h) => h.niveau).join("/")}`);
        if (this.journal.defaites > 25) throw new Error('Trop de défaites');
        j.reessayerCombat();
      } else if (j.mode === 'evenement') {
        const a = j.attente;
        if (!a) throw new Error('Événement sans attente');
        if (a.type === 'choix') j.choisir(0);
        else if (a.type === 'boutique') {
          faireCourses(j, j.monde.boutiques[a.id]!.articles);
          j.continuer();
        } else if (a.type === 'fin') {
          this.journal.fini = true;
          j.continuer();
        } else j.continuer();
      } else return;
      j.prendreEffets();
    }
    equiperMieux(j);
  }

  private combattre(): void {
    const j = this.j;
    this.journal.combats++;
    while (j.combat && !j.combat.fini) {
      this.tic();
      j.combatAvancer();
      const b = j.combat;
      if (!b || b.fini || !b.attente) continue;
      const acteur = b.combattants.find((c) => c.uid === b.attente)!;
      j.combatAgir(choisirAction(b, acteur, j.p.inventaire));
    }
    j.terminerCombat();
  }

  /** Marche jusqu'à une case (sur) ou à côté (adjacent), en changeant de carte si besoin. */
  aller(carte: string, cibles: () => Pos[], adjacent: boolean): boolean {
    for (let essai = 0; essai < 400; essai++) {
      this.gerer();
      if (this.j.p.carte !== carte) {
        const route = routeCartes(this.j, carte);
        if (!route || route.length === 0) return false;
        const porte = ancre(this.j.carte(), route[0]!.porte);
        this.marcher(chemin(this.j, [porte], false));
        continue;
      }
      const buts = adjacent ? cibles().flatMap(voisins) : cibles();
      if (buts.some((b) => b.x === this.j.p.x && b.y === this.j.p.y)) return true;
      const ch = chemin(this.j, buts);
      if (!ch) return false;
      this.marcher(ch);
    }
    return false;
  }

  private marcher(ch: ReturnType<typeof chemin>): void {
    if (!ch) throw new Error(`Aucun chemin sur ${this.j.p.carte} depuis ${this.j.p.x},${this.j.p.y}`);
    for (const d of ch) {
      this.tic();
      const r = this.j.deplacer(d);
      this.journal.pas++;
      if (r !== 'avance') return; // rencontre, porte ou événement : on recalcule.
    }
  }

  /** Se tourne vers une case adjacente et interagit. */
  private interagirAvec(cases: Pos[]): void {
    const p = this.j.p;
    const cible = cases.find((c) => Math.abs(c.x - p.x) + Math.abs(c.y - p.y) === 1);
    if (!cible) return;
    p.dir = directionVers(p, cible);
    this.j.interagir();
    this.gerer();
  }

  etape(e: Etape): void {
    this.journal.etapes++;
    const fait = () => 'jusqua' in e && !!this.j.p.flags[e.jusqua];
    if (fait()) return;
    if ('niveau' in e && e.niveau) this.entrainer(e.niveau, e.carte);
    if ('niveau' in e && e.niveau) this.seReposer();
    const j = this.j;
    for (let essai = 0; essai < 30; essai++) {
      if (fait()) return;
      if (e.type === 'coffres') return this.ouvrirCoffres(e.carte);
      const c = () => {
        const cc = j.carte(e.carte);
        if (e.type === 'parler' || e.type === 'boutique') return [ancre(cc, e.ancre)];
        if (e.type === 'interagir') {
          const prop = (cc.def.props ?? []).find((pr) => pr.ancre === e.ancre);
          return prop ? casesProp(cc, prop) : [ancre(cc, e.ancre)];
        }
        const zone = (cc.def.declencheurs ?? []).find((d) => d.ancre === e.ancre);
        const o = ancre(cc, e.ancre);
        if (!zone) return [o];
        const cases: Pos[] = [];
        for (let dy = 0; dy < (zone.h ?? 1); dy++) for (let dx = 0; dx < (zone.w ?? 1); dx++) cases.push({ x: o.x + dx, y: o.y + dy });
        return cases;
      };
      if (!this.aller(e.carte, c, e.type !== 'aller')) throw new Error(`Inaccessible : ${JSON.stringify(e)}`);
      if (e.type === 'aller') this.gerer();
      else this.interagirAvec(c());
      if (e.type === 'boutique') return;
    }
    if ('jusqua' in e && !fait()) throw new Error(`Étape non accomplie : ${JSON.stringify(e)}`);
  }

  private ouvrirCoffres(carte: string): void {
    const cc = this.j.carte(carte);
    for (const co of cc.def.coffres ?? []) {
      if (this.j.p.coffres.includes(`${carte}:${co.id}`)) continue;
      const pos = ancre(cc, co.ancre);
      if (this.aller(carte, () => [pos], true)) this.interagirAvec([pos]);
    }
  }

  niveauMin(): number {
    return Math.min(...this.j.p.equipe.map((h) => h.niveau));
  }

  /** Combat dans les zones de rencontre jusqu'au niveau voulu. */
  entrainer(niveau: number, carteCible: string): void {
    let garde = 0;
    while (this.niveauMin() < niveau) {
      if (++garde > 600) throw new Error(`Entraînement interminable (niveau ${this.niveauMin()} / ${niveau})`);
      const zone = this.zoneEntrainement(carteCible);
      if (!zone) throw new Error(`Pas de zone d'entraînement pour ${carteCible}`);
      this.seReposer(0.5);
      if (!this.aller(zone, () => this.casesRencontre(zone), false)) throw new Error('Zone d’entraînement inaccessible');
      if (this.j.mode !== 'exploration' || this.j.p.carte !== zone) continue;
      const ici = { x: this.j.p.x, y: this.j.p.y };
      const autre = voisins(ici).find((v) => tuile(this.j.carte(), v.x, v.y).rencontres && chemin(this.j, [v])?.length === 1);
      if (!autre) throw new Error('Zone d’entraînement trop étroite');
      for (let k = 0; k < 80 && this.j.mode === 'exploration'; k++) {
        const ch = chemin(this.j, [k % 2 === 0 ? autre : ici]);
        if (!ch?.length) break;
        this.j.deplacer(ch[0]!);
        this.journal.pas++;
      }
      this.gerer();
    }
  }

  private zoneEntrainement(carteCible: string): string | null {
    // La carte visée si elle a des rencontres, sinon la carte courante, sinon une carte accessible.
    const ordre = [carteCible, this.j.p.carte, ...Object.keys(this.j.monde.cartes).reverse()];
    for (const id of ordre) {
      const d = this.j.monde.cartes[id];
      if (!d?.rencontres || (id !== this.j.p.carte && !routeCartes(this.j, id))) continue;
      if (d.rencontres.niveauConseille > this.niveauMin() + 4) continue;
      return id;
    }
    return null;
  }

  private casesRencontre(carte: string): Pos[] {
    const cc = this.j.carte(carte);
    const out: Pos[] = [];
    for (let y = 0; y < cc.hauteur; y++)
      for (let x = 0; x < cc.largeur; x++)
        if (tuile(cc, x, y).rencontres && voisins({ x, y }).some((v) => tuile(cc, v.x, v.y).rencontres)) out.push({ x, y });
    return out;
  }

  /** Va se reposer si le groupe est entamé (seuil sur les PV/PS moyens). */
  seReposer(seuil = 0.85): void {
    const j = this.j;
    const etat = j.p.equipe.reduce((s, h) => {
      const st = statsHeros(h);
      return s + h.pv / st.pvMax + (st.psMax ? h.ps / st.psMax : 1);
    }, 0) / (2 * j.p.equipe.length);
    if (etat >= seuil) return;
    for (const r of REPOS) {
      if (!condVraie(r.si, j.p.flags)) continue;
      if (j.p.carte !== r.carte && !routeCartes(j, r.carte)) continue;
      const cc = j.carte(r.carte);
      const pnj = pnjVisibles(j, cc).find((n) => n.def.ancre === r.ancre);
      if (!pnj) continue;
      if (this.aller(r.carte, () => [ancre(cc, r.ancre)], true)) {
        this.interagirAvec([ancre(cc, r.ancre)]);
        return;
      }
    }
  }

  jouer(etapes: readonly Etape[]): Journal {
    this.gerer();
    for (const e of etapes) {
      this.etape(e);
      this.seReposer(0.4);
    }
    return this.journal;
  }
}

