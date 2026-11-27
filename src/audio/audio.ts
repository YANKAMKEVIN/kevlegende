// Son du jeu : bruitages et musique entièrement synthétisés (Web Audio), sans fichier à télécharger.
import { THEMES, type Theme } from './themes';

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

export class Audio {
  private ac: AudioContext | null = null;
  private maitre: GainNode | null = null;
  private busMusique: GainNode | null = null;
  private busSons: GainNode | null = null;
  private theme: Theme | null = null;
  private themeId = '';
  private prochain = 0;
  private temps = 0;
  private seed = 1;
  volMusique = 0.6;
  volSons = 0.8;

  /** Le navigateur exige un geste de l'utilisateur avant de produire du son. */
  deverrouiller(): void {
    if (this.ac) {
      if (this.ac.state === 'suspended') void this.ac.resume();
      return;
    }
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    this.ac = new AC();
    this.maitre = this.ac.createGain();
    this.maitre.gain.value = 0.9;
    const comp = this.ac.createDynamicsCompressor();
    this.maitre.connect(comp).connect(this.ac.destination);
    this.busMusique = this.ac.createGain();
    this.busSons = this.ac.createGain();
    this.busMusique.connect(this.maitre);
    this.busSons.connect(this.maitre);
    this.volumes(this.volMusique, this.volSons);
  }

  volumes(musique: number, sons: number): void {
    this.volMusique = musique;
    this.volSons = sons;
    if (this.busMusique) this.busMusique.gain.value = musique * 0.35;
    if (this.busSons) this.busSons.gain.value = sons * 0.5;
  }

  /** Change de thème (sans couper si c'est déjà le bon). */
  musique(id: string): void {
    if (id === this.themeId) return;
    this.themeId = id;
    this.theme = THEMES[id] ?? null;
    this.temps = 0;
    if (this.ac) this.prochain = this.ac.currentTime + 0.15;
    if (this.busMusique && this.ac) {
      const g = this.busMusique.gain;
      g.cancelScheduledValues(this.ac.currentTime);
      g.setValueAtTime(0, this.ac.currentTime);
      g.linearRampToValueAtTime(this.volMusique * 0.35, this.ac.currentTime + 0.8);
    }
  }

  /** Programme les notes à venir (appelé à chaque image). */
  maj(): void {
    const ac = this.ac;
    const th = this.theme;
    if (!ac || !th || !this.busMusique || ac.state !== 'running') return;
    const croche = 60 / th.tempo / 2;
    if (this.prochain < ac.currentTime) this.prochain = ac.currentTime + 0.05;
    while (this.prochain < ac.currentTime + 0.25) {
      this.jouerCroche(th, this.temps, this.prochain, croche);
      this.temps++;
      this.prochain += croche;
    }
  }

  private hasard(n: number): number {
    let x = Math.imul(n ^ (this.theme?.graine ?? 1), 2654435761) ^ this.seed;
    x ^= x >>> 15;
    x = Math.imul(x, 2246822519);
    x ^= x >>> 13;
    return (x >>> 0) / 4294967296;
  }

  private jouerCroche(th: Theme, k: number, t: number, croche: number): void {
    const mesure = Math.floor(k / 8);
    const pos = k % 8;
    const degre = th.accords[mesure % th.accords.length]!;
    const note = (d: number, oct = 0) => {
      const g = th.gamme;
      const i = ((d % g.length) + g.length) % g.length;
      return th.racine + g[i]! + 12 * (Math.floor(d / g.length) + oct);
    };
    const accord = [note(degre), note(degre + 2), note(degre + 4)];
    if (th.pad && pos === 0) for (const n of accord) this.voix(midi(n - 12), t, croche * 8, 'sine', 0.05, 0.4, this.busMusique!);
    if (th.basse && (pos === 0 || pos === 4 || (pos === 6 && th.percu))) this.voix(midi(note(degre, -2)), t, croche * 1.6, 'triangle', 0.16, 0.01, this.busMusique!);
    if (th.percu) {
      if (pos === 0 || pos === 4) this.tambour(t, 0.22, 90);
      if (pos === 2 || pos === 6) this.bruit(t, 0.05, 0.08, 4000);
      else this.bruit(t, 0.02, 0.03, 8000);
    }
    // Mélodie : motif répété sur 2 mesures, varié par la graine du thème.
    const motif = (mesure % 4 < 2 ? k % 16 : (k % 16) + 32) + Math.floor(mesure / 8) * 64;
    if (this.hasard(motif) < th.densite * (pos % 2 === 0 ? 1 : 0.55)) {
      const choix = Math.floor(this.hasard(motif + 999) * 5);
      const d = [degre, degre + 2, degre + 4, degre + 1, degre + 5][choix]!;
      const duree = croche * (this.hasard(motif + 77) < 0.3 ? 2 : 1);
      this.voix(midi(note(d, 1)), t, duree * 1.4, th.timbre, th.timbre === 'sine' ? 0.13 : 0.06, 0.005, this.busMusique!);
    }
  }

  private voix(f: number, t: number, duree: number, type: OscillatorType, vol: number, attaque: number, bus: AudioNode): void {
    const ac = this.ac!;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + attaque);
    g.gain.exponentialRampToValueAtTime(0.0008, t + duree);
    o.connect(g).connect(bus);
    o.start(t);
    o.stop(t + duree + 0.05);
  }

  private tambour(t: number, vol: number, f: number): void {
    const ac = this.ac!;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.frequency.setValueAtTime(f * 1.8, t);
    o.frequency.exponentialRampToValueAtTime(f * 0.6, t + 0.12);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    o.connect(g).connect(this.busMusique!);
    o.start(t);
    o.stop(t + 0.2);
  }

  private tampon: AudioBuffer | null = null;
  private bruit(t: number, vol: number, duree: number, coupure: number, bus: AudioNode | null = this.busMusique): void {
    const ac = this.ac!;
    if (!this.tampon) {
      this.tampon = ac.createBuffer(1, ac.sampleRate * 0.5, ac.sampleRate);
      const d = this.tampon.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = ac.createBufferSource();
    s.buffer = this.tampon;
    const f = ac.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = coupure;
    const g = ac.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duree);
    s.connect(f).connect(g).connect(bus!);
    s.start(t);
    s.stop(t + duree + 0.02);
  }

  /** Bruitages : petites mélodies et bruits synthétisés. */
  son(id: string): void {
    const ac = this.ac;
    const bus = this.busSons;
    if (!ac || !bus || ac.state !== 'running') return;
    const t = ac.currentTime + 0.01;
    const arpege = (notes: number[], pas: number, type: OscillatorType = 'triangle', vol = 0.25, duree = 0.25) =>
      notes.forEach((n, i) => this.voix(midi(n), t + i * pas, duree, type, vol, 0.005, bus));
    switch (id) {
      case 'voix':
        this.voix(midi(76 + Math.floor(Math.random() * 3)), t, 0.04, 'square', 0.04, 0.002, bus);
        break;
      case 'menu':
        arpege([84], 0, 'sine', 0.18, 0.08);
        break;
      case 'retour':
        arpege([79, 74], 0.05, 'sine', 0.15, 0.08);
        break;
      case 'erreur':
        arpege([50, 47], 0.08, 'square', 0.12, 0.12);
        break;
      case 'coffre':
      case 'objet':
        arpege([72, 76, 79, 84], 0.07);
        break;
      case 'soin':
        arpege([72, 79, 84, 88], 0.06, 'sine', 0.2, 0.4);
        break;
      case 'niveau':
        arpege([72, 76, 79, 84, 88, 91], 0.08, 'triangle', 0.25, 0.35);
        break;
      case 'victoire':
        arpege([67, 72, 76, 79, 76, 79, 84], 0.11, 'square', 0.12, 0.3);
        break;
      case 'defaite':
        arpege([67, 63, 60, 55], 0.22, 'triangle', 0.22, 0.5);
        break;
      case 'quete':
      case 'fanal':
      case 'cristal':
        arpege([76, 83, 88, 95], 0.1, 'sine', 0.2, 0.8);
        break;
      case 'rencontre':
        arpege([60, 63, 66, 69, 72], 0.04, 'square', 0.12, 0.12);
        this.bruit(t, 0.3, 0.4, 600, bus);
        break;
      case 'coup':
        this.bruit(t, 0.5, 0.12, 900, bus);
        this.tambourSon(t, 0.5, 120);
        break;
      case 'faible':
      case 'critique':
        this.bruit(t, 0.6, 0.18, 1500, bus);
        arpege([88, 93], 0.04, 'square', 0.12, 0.1);
        break;
      case 'brise':
        this.bruit(t, 0.7, 0.5, 300, bus);
        arpege([60, 72, 84], 0.05, 'sawtooth', 0.12, 0.3);
        break;
      case 'magie':
        arpege([79, 86, 91], 0.04, 'sine', 0.18, 0.3);
        break;
      case 'ko':
        arpege([60, 55, 48], 0.07, 'triangle', 0.2, 0.2);
        break;
      case 'porte':
      case 'pas':
        this.bruit(t, 0.15, 0.08, 2000, bus);
        break;
      case 'achat':
        arpege([84, 88], 0.06, 'square', 0.1, 0.1);
        break;
      case 'poule':
        arpege([88, 91, 86], 0.06, 'square', 0.08, 0.06);
        break;
      case 'chat':
        arpege([79, 83, 77], 0.12, 'sine', 0.15, 0.2);
        break;
      case 'levier':
      case 'grille':
      case 'forge':
        this.bruit(t, 0.4, 0.3, 400, bus);
        this.tambourSon(t, 0.4, 70);
        break;
      case 'voile':
        this.bruit(t, 0.3, 0.8, 1200, bus);
        break;
      case 'sauve':
        arpege([72, 79, 76, 84], 0.08, 'sine', 0.18, 0.3);
        break;
      default:
        arpege([80], 0, 'sine', 0.15, 0.1);
    }
  }

  private tambourSon(t: number, vol: number, f: number): void {
    const ac = this.ac!;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.frequency.setValueAtTime(f * 2, t);
    o.frequency.exponentialRampToValueAtTime(f * 0.5, t + 0.15);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o.connect(g).connect(this.busSons!);
    o.start(t);
    o.stop(t + 0.25);
  }
}
