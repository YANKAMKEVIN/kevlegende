// Acte III : arrivée à Ambrelune, l'oasis des Sables d'Ambre, et ses habitants.
import type { Script } from '../../core/story/script';
import { moineau } from './moineau';

const A = 'Aël';
const M = 'Mira';
const B = 'Brann';
const N = 'Nour';
const AM = 'Amastan';

export const ACTE3_AMBRELUNE: Record<string, Script> = {
  acte3_debut: [
    { c: 'acte', n: 3 },
    { c: 'flag', nom: 'acte3' },
    { c: 'son', id: 'voile' },
    { c: 'titre', texte: 'Acte III', sous: "Les Sables d'Ambre" },
    { c: 'teleporte', carte: 'ambrelune', ancre: 'B', dir: 'haut' },
    { c: 'dit', texte: "Trois jours de vent chaud. Puis, sous la quille du Moineau, la mer de nuages se teinte d'or : une île de dunes, posée sur le ciel comme une pièce de cuivre." },
    { c: 'dit', qui: B, portrait: 'brann', texte: "Par ma forge… On se croirait dans le foyer. Personne ne m'avait dit qu'il faisait si chaud au sud." },
    { c: 'dit', qui: M, portrait: 'mira', texte: "Ambrelune, l'oasis. Sur mes cartes, le lac fait trois fois cette taille. Il s'assèche." },
    { c: 'dit', qui: A, portrait: 'ael', texte: "Et là-bas, à l'est… ce mur gris qui avance sur les dunes. C'est de la brume ?" },
    { c: 'dit', qui: M, portrait: 'mira', texte: "De la brume mêlée de sable. Cherchons le chef du village, il saura." },
    { c: 'quete', id: 'q_ambre', etat: 'active' },
    { c: 'soin' },
    { c: 'sauve' },
  ],
  moineau_ambre: moineau('Le Moineau tire doucement sur ses amarres. Où mettre le cap ?', 'ambrelune', 'Rester à Ambrelune'),
  amastan: [
    { c: 'si', cond: ['fanal3_allume'], alors: [
      { c: 'dit', qui: AM, portrait: 'amastan', texte: "Le lac remonte, mes enfants. Chaque matin, un doigt de plus. Ambrelune vous doit sa source et son Fanal." },
    ], sinon: [
      { c: 'si', cond: ['astrolabe_obtenu'], alors: [
        { c: 'dit', qui: AM, portrait: 'amastan', texte: "L'Astrolabe du Soleil… Il n'était plus sorti du temple depuis mon grand-père. Suivez-le dans la tempête, et ne le lâchez pas." },
      ], sinon: [
        { c: 'si', cond: ['nour_rejointe'], alors: [
          { c: 'dit', qui: AM, portrait: 'amastan', texte: "Nour ! Petite tête brûlée. Tu m'as fait vieillir de dix ans." },
          { c: 'dit', qui: N, portrait: 'nour', texte: "Je sais, mon oncle. Mais j'avais raison : la clé de la tempête dort sous les ruines. Nous allons la chercher." },
        ], sinon: [
          { c: 'si', cond: ['amastan_vu'], alors: [
            { c: 'dit', qui: AM, portrait: 'amastan', texte: "Les Ruines de Sablon sont au nord-ouest des dunes. Suivez les pistes claires : les vers n'aiment pas le sable tassé." },
          ], sinon: [
            { c: 'dit', qui: AM, portrait: 'amastan', texte: "Des voyageurs venus du ciel, avec une flamme dans une lanterne. Les anciens disaient que ça arriverait." },
            { c: 'dit', qui: AM, portrait: 'amastan', texte: "Je suis Amastan, chef d'Ambrelune. Notre Fanal brûlait au sommet de la Tour d'Ambre, derrière le Canyon des Mirages. Il est mort il y a sept nuits." },
            { c: 'dit', qui: AM, portrait: 'amastan', texte: "Depuis, la Tempête Pâle a coupé les dunes en deux. Ceux qui y entrent n'en ressortent pas. Et l'oasis boit son lac jour après jour." },
            { c: 'dit', qui: A, portrait: 'ael', texte: "Nous avons rallumé les Fanaux de Clairval et des Récifs. Dites-nous comment atteindre le vôtre." },
            { c: 'dit', qui: AM, portrait: 'amastan', texte: "Seul l'Astrolabe du Soleil sait trouver l'œil de la tempête. Il dort dans le Tombeau, sous les Ruines de Sablon." },
            { c: 'dit', qui: AM, portrait: 'amastan', texte: "Ma nièce Nour, notre astromancienne, est partie le chercher il y a quatre jours. Seule. Elle n'est pas revenue." },
            { c: 'dit', qui: M, portrait: 'mira', texte: "Alors on commence par Nour. Les ruines, c'est par où ?" },
            { c: 'dit', qui: AM, portrait: 'amastan', texte: "Au nord-ouest, à travers les Dunes Chantantes. Que le soleil vous garde." },
            { c: 'flag', nom: 'amastan_vu' },
            { c: 'quete', id: 'q_nour', etat: 'active' },
            { c: 'sauve' },
          ] },
        ] },
      ] },
    ] },
  ],
  boutique_ambrelune: [
    { c: 'dit', qui: 'Sadia', portrait: 'sadia', texte: "Dattes, eau fraîche, remèdes ! Dans le désert, le meilleur bouclier, c'est une gourde pleine." },
    { c: 'boutique', id: 'ambrelune_provisions' },
  ],
  armurerie_ambrelune: [
    { c: 'dit', qui: 'Yanis', portrait: 'yanis', texte: "Lames courbes, marteaux de grès, burnous tissés main. Le sable use tout, sauf ce qui sort de mon atelier." },
    { c: 'boutique', id: 'ambrelune_armes' },
  ],
  zahra: [
    { c: 'dit', qui: 'Zahra', portrait: 'zahra', texte: "Chut… Mes trésors viennent de l'autre côté de la tempête. Ne demande pas comment." },
    { c: 'boutique', id: 'zahra' },
  ],
  tafat: [
    { c: 'si', cond: ['!quete_puits'], alors: [
      { c: 'dit', qui: 'Tafat', portrait: 'tafat', texte: "Bienvenue au caravansérail. Je suis Tafat, la fontainière. Ou ce qu'il en reste : mes puits meurent avec le lac." },
      { c: 'dit', qui: 'Tafat', portrait: 'tafat', texte: "Trois vieux puits dorment dans les Dunes Chantantes. Si quelqu'un dégageait leurs margelles, l'eau reviendrait sous l'oasis." },
      { c: 'dit', qui: B, portrait: 'brann', texte: "Dégager du sable ? Avec mon marteau, ça va être vite fait." },
      { c: 'flag', nom: 'quete_puits' },
      { c: 'quete', id: 'q_puits', etat: 'active' },
    ] },
    { c: 'si', cond: ['puits1', 'puits2', 'puits3', '!puits_rendus'], alors: [
      { c: 'dit', qui: 'Tafat', portrait: 'tafat', texte: "J'entends l'eau chanter sous mes pieds ! Les trois puits sont rouverts. Prenez ceci : la bague de ma mère, taillée dans une pierre de source." },
      { c: 'donne', objet: 'anneau_oasis' },
      { c: 'or', n: 400 },
      { c: 'flag', nom: 'puits_rendus' },
      { c: 'quete', id: 'q_puits', etat: 'terminee' },
    ] },
    { c: 'choix', texte: 'Tafat : « Une natte à l’ombre et un thé à la menthe, 30 pièces. »', options: [
      { texte: 'Se reposer (30 pièces)', faire: [
        { c: 'paye', n: 30,
          alors: [{ c: 'soin' }, { c: 'son', id: 'soin' }, { c: 'dit', texte: 'Le groupe dort au frais, bercé par le chant des grillons.' }],
          sinon: [{ c: 'dit', qui: 'Tafat', portrait: 'tafat', texte: 'Il te manque quelques pièces. Reviens vite.' }] },
      ] },
      { texte: 'Non merci', faire: [] },
    ] },
  ],
  ilyes: [
    { c: 'si', cond: ['tablettes_rendues'], alors: [
      { c: 'dit', qui: 'Ilyes', portrait: 'ilyes', texte: "Les tablettes parlent d'un quatrième Fanal, très haut, là où la neige ne fond jamais. Fascinant…" },
    ], sinon: [
      { c: 'si', cond: ['coffre:ruines:t1', 'coffre:tombeau:t2', 'coffre:canyon:t3'], alors: [
        { c: 'dit', qui: 'Ilyes', portrait: 'ilyes', texte: "Les trois Tablettes du Soleil ! La carte du ciel des anciens, enfin complète !" },
        { c: 'retire', objet: 'tablette_soleil', n: 3 },
        { c: 'donne', objet: 'oeil_soleil' },
        { c: 'flag', nom: 'tablettes_rendues' },
        { c: 'quete', id: 'q_tablettes', etat: 'terminee' },
        { c: 'dit', qui: 'Ilyes', portrait: 'ilyes', texte: "Cet Œil du Soleil était scellé dans l'obélisque. Il voit plus clair que nous : prenez-le." },
      ], sinon: [
        { c: 'dit', qui: 'Ilyes', portrait: 'ilyes', texte: "Ilyes, scribe et rêveur. Les anciens ont gravé le ciel sur trois tablettes d'argile, puis les ont cachées." },
        { c: 'dit', qui: 'Ilyes', portrait: 'ilyes', texte: "Une dans les ruines, une dans le tombeau, une au-delà de la tempête. Rapportez-les-moi, je saurai vous remercier." },
        { c: 'si', cond: ['!quete_tablettes'], alors: [{ c: 'flag', nom: 'quete_tablettes' }, { c: 'quete', id: 'q_tablettes', etat: 'active' }] },
      ] },
    ] },
  ],
  assia: [
    { c: 'si', cond: ['fanal3_allume'], alors: [{ c: 'dit', qui: 'Assia', portrait: 'assia', texte: "La tour brille ! Ce soir, je dors sur le toit pour la regarder." }], sinon: [
      { c: 'dit', qui: 'Assia', portrait: 'assia', texte: "Si on écoute bien, les dunes chantent. Grand-mère dit que c'est le sable qui roule. Moi je dis que c'est des géants qui ronflent." },
    ] },
  ],
  lalla: [
    { c: 'dit', qui: 'Lalla Fadma', portrait: 'lalla', texte: "Le gardien de la tour s'appelait Azrou. Le père de Nour. Il est monté rallumer la flamme quand elle a faibli… et il n'est jamais redescendu." },
    { c: 'dit', qui: 'Lalla Fadma', portrait: 'lalla', texte: "Depuis, on voit une silhouette dorée errer dans le canyon. Ne la suivez pas, mes petits." },
  ],
  obelisque_ambrelune: [{ c: 'dit', texte: "Un obélisque couvert d'étoiles gravées. Une niche vide, en forme d'œil, attend au sommet." }],
  source_ambrelune: [
    { c: 'si', cond: ['puits_rendus'], alors: [{ c: 'dit', texte: "L'eau monte dans la fontaine, claire et fraîche." }], sinon: [{ c: 'dit', texte: 'La fontaine est presque à sec. Une flaque tiède tremble au fond.' }] },
  ],
  panneau_ambrelune: [{ c: 'dit', texte: "↑ Dunes Chantantes. « Restez sur les pistes claires. Ne réveillez pas ce qui dort sous le sable. »" }],
};
