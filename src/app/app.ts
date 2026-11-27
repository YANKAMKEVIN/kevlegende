// Chef d'orchestre : boucle d'affichage, écrans, routage des attentes du moteur, sauvegardes, sons.
import { Audio } from '../audio/audio';
import { Jeu, type Recompense } from '../core/game';
import type { Attente, Effet } from '../core/story/script';
import { hero } from '../data/heroes';
import { MONDE } from '../data/monde';
import { Controles, type Bouton } from '../input/controles';
import { chargerArt } from '../render/assets';
import { Scene } from '../render/scene';
import { deballer } from '../save/schema';
import { exporter, importer, Sauvegardes, type Emplacement } from '../save/store';
import { Boutique } from '../ui/boutique';
import { Cartons } from '../ui/cartons';
import { EcranCombat } from '../ui/combat/combat';
import { Dialogue } from '../ui/dialogue';
import { formatTemps, h } from '../ui/dom';
import { Hud } from '../ui/hud';
import { Menu } from '../ui/menu';
import { EcranTitre, type EmplacementResume } from '../ui/titre';
import { actionDevant, Marche } from './marche';
import { ecrireOptions, lireOptions, StockageNavigateur, type Options } from './stockage';

type Ecran = 'titre' | 'jeu';

export class App {
  readonly racine: HTMLElement;
  readonly canvas: HTMLCanvasElement;
  readonly scene: Scene;
  readonly audio = new Audio();
  readonly ctl = new Controles();
  readonly saves = new Sauvegardes(new StockageNavigateur());
  j: Jeu | null = null;
  ecran: Ecran = 'titre';
  options: Options = lireOptions();
  private marche = new Marche();
  private hud: Hud;
  private dialogue: Dialogue;
  private boutique: Boutique;
  private menu: Menu;
  private combat: EcranCombat;
  private titre: EcranTitre;
  private cartons: Cartons;
  private attenteAffichee: Attente | null = null;
  private menuOuvert = false;
  private sauvegardeDemandee = false;
  private dernierAuto = 0;
  private t = 0;
  private dernier = 0;

  constructor(racine: HTMLElement) {
    this.racine = racine;
    this.canvas = h('canvas', { class: 'ecran-jeu', 'aria-label': 'Monde de Kevlegende' });
    this.scene = new Scene(this.canvas);
    const son = (id: string) => this.audio.son(id);
    this.hud = new Hud(this.ctl, () => this.ouvrirMenu());
    this.dialogue = new Dialogue({ continuer: () => this.jeu().continuer(), choisir: (i) => this.jeu().choisir(i), son });
    this.boutique = new Boutique(() => this.jeu(), () => this.fermerBoutique(), son);
    this.combat = new EcranCombat({ jeu: () => this.jeu(), son, termine: (r) => this.finCombat(r) });
    this.cartons = new Cartons();
    this.menu = new Menu({
      jeu: () => this.jeu(),
      fermer: () => this.fermerMenu(),
      son,
      sauver: (e) => this.sauver(e),
      resumeEmplacement: (e) => this.resume(e).detail,
      exporter: () => exporter(this.jeu().p),
      importer: (t) => this.importer(t),
      options: () => this.options,
      changerOptions: (o) => this.changerOptions(o),
      retourTitre: () => this.retourTitre(),
    });
    this.titre = new EcranTitre(this.rappelsTitre());
    const ui = h('div', { class: 'ui' }, this.hud.el, this.combat.el, this.dialogue.el, this.boutique.el, this.menu.el, this.titre.el, this.cartons.el, this.cartons.fondu);
    racine.append(this.canvas, ui);
    this.canvas.addEventListener('pointerdown', (e) => {
      this.audio.deverrouiller();
      if (this.combat.visible()) this.combat.toucher(e.offsetX, e.offsetY);
    });
    racine.addEventListener('pointerdown', () => this.audio.deverrouiller(), { capture: true });
    window.addEventListener('keydown', () => this.audio.deverrouiller(), { capture: true });
    this.ctl.surBouton((b) => this.bouton(b));
    window.addEventListener('resize', () => this.redimensionner());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') this.autoSauver();
    });
    this.redimensionner();
    this.appliquerOptions();
    for (const id of ['titre', 'portrait_ael', 'portrait_odile', 'portrait_mira']) void chargerArt(id);
  }

  jeu(): Jeu {
    if (!this.j) throw new Error('Aucune partie en cours');
    return this.j;
  }

  demarrer(): void {
    this.allerTitre();
    const boucle = (ms: number) => {
      const dt = Math.min(0.05, this.dernier ? (ms - this.dernier) / 1000 : 0.016);
      this.dernier = ms;
      this.image(dt);
      requestAnimationFrame(boucle);
    };
    requestAnimationFrame(boucle);
  }

  private redimensionner(): void {
    const r = this.racine.getBoundingClientRect();
    this.scene.redimensionner(r.width || window.innerWidth, r.height || window.innerHeight, window.devicePixelRatio || 1);
  }

  // ---------- Écrans ----------
  private rappelsTitre() {
    const plus = this.saves.plusRecente();
    return {
      continuer: plus ? () => this.chargerEmplacement(plus.emplacement) : null,
      nouvelle: () => this.nouvellePartie(),
      emplacements: (): EmplacementResume[] => (['auto', '1', '2', '3'] as const).map((e) => this.resume(e)),
      charger: (id: string) => this.chargerEmplacement(id as Emplacement),
      son: (id: string) => this.audio.son(id),
    };
  }

  private allerTitre(): void {
    this.ecran = 'titre';
    this.j = null;
    this.hud.afficher(false);
    this.combat.masquer();
    this.dialogue.masquer();
    this.titre.ouvrir(this.rappelsTitre());
    this.audio.musique('titre');
  }

  private retourTitre(): void {
    this.autoSauver();
    this.fermerMenu();
    void this.cartons.transition(() => this.allerTitre());
  }

  private lancer(j: Jeu): void {
    this.j = j;
    this.ecran = 'jeu';
    this.attenteAffichee = null;
    this.marche.arreter();
    this.scene.reinitialiserTrace();
    this.titre.masquer();
    this.hud.afficher(true);
    this.dernierAuto = this.t;
  }

  private nouvellePartie(): void {
    this.audio.son('menu');
    void this.cartons.transition(() => this.lancer(Jeu.nouvelle(MONDE, (Date.now() ^ (Math.random() * 2 ** 31)) >>> 0)), 0.6);
  }

  private chargerEmplacement(e: Emplacement): void {
    const l = this.saves.lire(e);
    if (!l.ok) {
      this.audio.son('erreur');
      return;
    }
    this.audio.son('menu');
    void this.cartons.transition(() => this.lancer(Jeu.charger(MONDE, l.enveloppe.partie)), 0.5);
  }

  private resume(e: Emplacement): EmplacementResume {
    const l = this.saves.lire(e);
    const titre = e === 'auto' ? 'Sauvegarde automatique' : `Carnet ${e}`;
    if (!l.ok) return { id: e, titre, detail: 'vide' in l ? 'Vide' : `Abîmée : ${l.erreur}`, valide: false };
    const r = l.enveloppe.resume;
    const lieu = MONDE.cartes[r.carte]?.nom ?? r.carte;
    const equipe = r.equipe.map((id) => hero(id).nom).join(', ');
    return { id: e, titre, detail: `Acte ${r.acte} · ${lieu} · Niv. ${r.niveau} · ${equipe} · ${formatTemps(r.tempsJeu)}${l.secours ? ' (copie de secours)' : ''}`, valide: true };
  }

  // ---------- Sauvegarde ----------
  private sauver(e: Emplacement): boolean {
    if (!this.j) return false;
    return this.saves.ecrire(e, this.j.p);
  }
  private autoSauver(): void {
    if (this.j && this.j.mode === 'exploration') this.sauver('auto');
  }
  private importer(texte: string): string | null {
    try {
      const env = importer(texte);
      deballer(env);
      this.fermerMenu();
      void this.cartons.transition(() => this.lancer(Jeu.charger(MONDE, env.partie)));
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : 'Code invalide';
    }
  }

  // ---------- Options ----------
  private changerOptions(o: Partial<Options>): void {
    this.options = { ...this.options, ...o };
    ecrireOptions(this.options);
    this.appliquerOptions();
  }
  private appliquerOptions(): void {
    this.audio.volumes(this.options.musique, this.options.sons);
    this.dialogue.vitesse = 20 + this.options.texte * 100;
    this.hud.controlesTactiles(this.options.tactile);
  }

  // ---------- Menus ----------
  private ouvrirMenu(): void {
    if (!this.j || this.j.mode !== 'exploration' || this.marche.enCours() || this.menuOuvert) return;
    this.menuOuvert = true;
    this.audio.son('menu');
    this.ctl.toutRelacher();
    this.menu.ouvrir();
  }
  private fermerMenu(): void {
    if (!this.menuOuvert) return;
    this.menuOuvert = false;
    this.audio.son('retour');
    this.menu.masquer();
  }
  private fermerBoutique(): void {
    this.boutique.masquer();
    this.audio.son('retour');
    this.jeu().continuer();
  }

  // ---------- Entrées ----------
  private bouton(b: Bouton): void {
    if (this.cartons.visible()) return this.cartons.bouton(b);
    if (this.ecran === 'titre') return this.titre.bouton(b);
    const j = this.j;
    if (!j) return;
    if (this.menuOuvert) return this.menu.bouton(b);
    if (this.combat.visible()) return this.combat.bouton(b);
    const a = j.attente;
    if (a?.type === 'boutique') return this.boutique.bouton(b);
    if (a?.type === 'dit' || a?.type === 'choix') return this.dialogue.bouton(b);
    if (j.mode === 'exploration' && !this.marche.enCours()) {
      if (b === 'menu') this.ouvrirMenu();
      else if (b === 'a') {
        const r = j.interagir();
        if (r !== 'rien') this.audio.son('menu');
      }
    }
  }

  private directionMenus(): void {
    // Navigation au clavier dans les menus : on transforme les nouvelles pressions en pas de liste.
    const d = this.ctl.direction();
    if (d && d !== this.derniereDir) {
      if (this.menuOuvert) this.menu.dir(d);
      else if (this.ecran === 'titre') this.titre.dir(d);
      else if (this.combat.visible()) this.combat.dir(d);
      else if (this.j?.attente?.type === 'boutique') this.boutique.dir(d);
      else if (this.j?.attente?.type === 'choix') this.dialogue.dir(d);
    }
    this.derniereDir = d;
  }
  private derniereDir: string | null = null;

  // ---------- Boucle ----------
  private image(dt: number): void {
    this.t += dt;
    this.audio.maj();
    this.cartons.maj(dt);
    const ctx = this.scene.ctx;
    const j = this.j;
    if (this.ecran === 'titre' || !j) {
      this.directionMenus();
      ctx.setTransform(this.scene.dpr, 0, 0, this.scene.dpr, 0, 0);
      this.scene.ciel.dessiner(ctx, this.scene.w, this.scene.h, 'jour', this.t, this.t * 20, 0);
      return;
    }
    const enExplo = j.mode === 'exploration' && !this.menuOuvert && !this.cartons.visible() && !this.combat.visible();
    if (enExplo || this.marche.enCours()) {
      const r = this.marche.maj(j, enExplo ? this.ctl.direction() : null, dt, (de) => this.scene.pas(de));
      if (r === 'rencontre') this.audio.son('rencontre');
      this.derniereDir = this.ctl.direction();
    } else this.directionMenus();
    j.ecouler(dt);
    this.traiterEffets(j.prendreEffets());
    this.router(j);
    if (this.combat.visible()) {
      ctx.setTransform(this.scene.dpr, 0, 0, this.scene.dpr, 0, 0);
      this.combat.maj(ctx, j.p.carte, this.scene.w, this.scene.h, dt);
    } else {
      this.scene.dessiner(j, this.marche.position(j), this.t, dt);
      const c = j.carte();
      this.hud.maj(c.def.nom, j.objectif(), j.p.or, actionDevant(j));
      this.audio.musique(c.def.musique);
    }
    this.dialogue.maj(dt);
    if (this.sauvegardeDemandee && j.mode === 'exploration') {
      this.sauvegardeDemandee = false;
      if (this.sauver('auto')) this.hud.toast('Partie sauvegardée', 'info');
    }
    if (j.mode === 'exploration' && this.t - this.dernierAuto > 90) {
      this.dernierAuto = this.t;
      this.autoSauver();
    }
  }


  private traiterEffets(effets: Effet[]): void {
    for (const e of effets) {
      switch (e.type) {
        case 'son':
          this.audio.son(e.id);
          break;
        case 'secousse':
          this.scene.secousse = 0.6;
          break;
        case 'flash':
          this.scene.flash = { couleur: e.couleur, t: 0.6 };
          break;
        case 'objet':
          this.audio.son('objet');
          break;
        case 'or':
          if (e.n > 0) this.audio.son('achat');
          break;
        case 'rejoint':
          this.audio.son('niveau');
          break;
        case 'quete': {
          const q = this.jeu().monde.quetes[e.id];
          if (q) this.hud.toast(`${e.etat === 'active' ? 'Nouvelle quête' : 'Quête accomplie'} : ${q.nom}`, 'quete');
          this.audio.son('quete');
          break;
        }
        case 'sauve':
          this.sauvegardeDemandee = true;
          break;
        case 'teleporte':
          this.marche.arreter();
          this.scene.reinitialiserTrace();
          this.cartons.fondu.classList.add('noir', 'instant');
          requestAnimationFrame(() => requestAnimationFrame(() => this.cartons.fondu.classList.remove('noir', 'instant')));
          this.audio.son('porte');
          this.dernierAuto = -Infinity;
          break;
      }
    }
  }

  /** Affiche ce que le moteur attend (dialogue, choix, boutique, titre, combat, fin). */
  private router(j: Jeu): void {
    const a = j.attente;
    if (a === this.attenteAffichee || this.combat.visible()) return;
    this.attenteAffichee = a;
    if (!a || (a.type !== 'dit' && a.type !== 'choix')) this.dialogue.masquer();
    if (a?.type !== 'titre' && a?.type !== 'fin' && this.cartons.visible()) this.cartons.fermer();
    if (!a) {
      this.hud.afficher(true);
      return;
    }
    switch (a.type) {
      case 'dit':
      case 'choix':
        this.dialogue.afficher(a);
        break;
      case 'boutique':
        this.boutique.ouvrir(a.id);
        break;
      case 'titre':
        this.cartons.titre(a.texte, a.sous, () => j.continuer());
        break;
      case 'fin':
        this.sauver('auto');
        this.audio.musique('fin');
        this.cartons.fin(a.texte, `Temps de jeu ${formatTemps(j.p.tempsJeu)} · ${j.p.victoires} victoires · niveau ${Math.max(...j.p.equipe.map((x) => x.niveau))}`, () => this.allerTitre());
        break;
      case 'combat':
        this.marche.arreter();
        this.ctl.toutRelacher();
        this.hud.afficher(false);
        this.audio.musique(j.combat?.boss ? 'boss' : 'combat');
        this.scene.flash = { couleur: '#ffffff', t: 0.4 };
        this.combat.demarrer();
        break;
    }
  }

  private finCombat(rec: Recompense | null): void {
    this.combat.masquer();
    this.attenteAffichee = null;
    if (!rec) {
      // Défaite définitive : on reprend la sauvegarde la plus récente.
      const plus = this.saves.plusRecente();
      if (plus) this.chargerEmplacement(plus.emplacement);
      else this.allerTitre();
      return;
    }
    this.hud.afficher(true);
  }
}
