// Acte IV : les Pentes Blanches, le Lac Gelé, la Grotte de Givre, le Col du Blizzard et le Fanal des Cimes.
import type { Cmd, Script } from '../../core/story/script';

const A = 'Aël';
const M = 'Mira';
const B = 'Brann';
const N = 'Nour';
const AU = 'Aurèle';
const ROI = 'Le Roi Pâle';

/** Une braise d'Aurèle, sur son brasero de pierre, libre une fois le gardien vaincu. */
const braise = (n: number, gardien: string): Script => [
  { c: 'si', cond: [`braise${n}`], alors: [{ c: 'dit', texte: 'Le brasero est froid. La braise voyage dans votre lanterne.' }], sinon: [
    { c: 'si', cond: [gardien], alors: [
      { c: 'son', id: 'cristal' },
      { c: 'flash', couleur: '#cfe8ff' },
      { c: 'donne', objet: 'braise_givre' },
      { c: 'flag', nom: `braise${n}` },
      { c: 'dit', texte: "Sous une gangue de glace, une braise brûle d'une flamme bleue, sans chaleur. Elle se laisse cueillir comme un fruit." },
      { c: 'si', cond: ['braise1', 'braise2', 'braise3'], alors: [{ c: 'dit', qui: M, portrait: 'mira', texte: "La troisième ! Retournons voir Maître Aubin à Givrebourg." }], sinon: [{ c: 'dit', qui: N, portrait: 'nour', texte: "Une braise d'Aurèle. Il en reste à trouver." }] },
      { c: 'sauve' },
    ], sinon: [{ c: 'dit', texte: 'Un brasero de pierre couvert de givre. Une lueur bleue bat sous la glace.' }] },
  ] },
];

/** Un yack égaré : il rentre au village une fois que Joris l'a demandé. */
const yak = (n: number): Script => [
  { c: 'si', cond: ['quete_yaks'], alors: [
    { c: 'dit', texte: "Le yack renifle la lanterne, souffle un nuage de vapeur… puis tourne les talons et trotte vers Givrebourg." },
    { c: 'flag', nom: `yak${n}` },
    { c: 'si', cond: ['yak1', 'yak2', 'yak3'], alors: [{ c: 'dit', qui: B, portrait: 'brann', texte: "C'était le dernier. Joris va pouvoir compter ses bêtes." }] },
  ], sinon: [{ c: 'dit', texte: 'Un yack égaré broute le lichen sous la neige. Il recule dès que vous approchez.' }] },
];

/** Un brasero de la grotte : Brann l'allume ; les trois ensemble font fondre le mur de glace. */
const brasero = (n: number): Script => {
  const tous: Cmd[] = [
    { c: 'flag', nom: 'glace_fondue' },
    { c: 'secousse' },
    { c: 'flash', couleur: '#ffd9a0' },
    { c: 'dit', texte: "Les trois feux se répondent. Au nord du grand hall, le mur de glace ruisselle, craque, puis s'effondre en une pluie de cristaux." },
    { c: 'sauve' },
  ];
  return [
    { c: 'si', cond: [`brasero_g${n}`], alors: [{ c: 'dit', texte: 'Le brasero brûle haut et clair.' }], sinon: [
      { c: 'dit', qui: B, portrait: 'brann', texte: "Du charbon de forge, une étincelle… et voilà le travail." },
      { c: 'son', id: 'forge' },
      { c: 'flag', nom: `brasero_g${n}` },
      { c: 'si', cond: ['brasero_g1', 'brasero_g2', 'brasero_g3'], alors: tous, sinon: [{ c: 'dit', texte: 'Le brasero s’embrase. Quelque part, la glace gémit.' }] },
    ] },
  ];
};

export const ACTE4_AVENTURE: Record<string, Script> = {
  // ---------- Pentes Blanches ----------
  panneau_pentes: [{ c: 'dit', texte: '« ← Lac Gelé. → Grotte de Givre. ↑ Col du Blizzard. Plateau des Sanctuaires : nord-ouest. »' }],
  yak1: yak(1),
  yak2: yak(2),
  yak3: yak(3),
  grand_yeti: [
    { c: 'secousse' },
    { c: 'dit', texte: "Un rugissement fait trembler le plateau. Une masse blanche se dresse devant le brasero : un yéti haut comme un chalet, la fourrure collée de brume." },
    { c: 'dit', qui: B, portrait: 'brann', texte: "Il garde la braise ? Alors il va devoir me la rendre." },
    { c: 'dit', qui: N, portrait: 'nour', texte: 'Ses yeux… ils sont pleins de brume, comme ceux de mon père. Il ne sait plus ce qu’il fait.' },
    { c: 'combat', groupe: ['grand_yeti'] },
    { c: 'flag', nom: 'yeti_vaincu' },
    { c: 'dit', texte: 'Le yéti secoue la tête, éternue un nuage gris, puis s’éloigne à pas lourds vers les sommets.' },
    { c: 'sauve' },
  ],
  braise_pentes: braise(1, 'yeti_vaincu'),
  // ---------- Lac Gelé ----------
  panneau_lac: [{ c: 'dit', texte: "« Lac Gelé. Ne marchez pas près des trous d'eau. Le sanctuaire est sur l'île. »" }],
  mathis: [
    { c: 'si', cond: ['mathis_vu'], alors: [{ c: 'dit', qui: 'Mathis', portrait: 'mathis', texte: "Ça ne mord pas. Le serpent fait fuir les poissons." }], sinon: [
      { c: 'dit', qui: 'Mathis', portrait: 'mathis', texte: "Mathis, pêcheur sur glace. Vous allez à l'île ? Le Serpent de Givre y dort enroulé autour du brasero." },
      { c: 'dit', qui: 'Mathis', portrait: 'mathis', texte: "Il craint le feu. Prenez ce thé, il vous gardera chauds pendant la bagarre." },
      { c: 'donne', objet: 'the_epices', n: 2 },
      { c: 'flag', nom: 'mathis_vu' },
    ] },
  ],
  serpent_givre: [
    { c: 'secousse' },
    { c: 'dit', texte: "La glace se fend autour de l'île. Un serpent long comme un navire jaillit d'un trou d'eau, ses écailles cliquetant comme des glaçons." },
    { c: 'dit', qui: M, portrait: 'mira', texte: 'Il craint le feu, a dit Mathis. Brann, mes flèches ardentes et toi : on le fait fondre !' },
    { c: 'combat', groupe: ['serpent_glace', 'serpent_givre'] },
    { c: 'flag', nom: 'serpent_givre_vaincu' },
    { c: 'dit', texte: "Le serpent replonge dans les eaux noires. La glace se referme derrière lui avec un long soupir." },
    { c: 'sauve' },
  ],
  braise_lac: braise(2, 'serpent_givre_vaincu'),
  // ---------- Grotte de Givre ----------
  brasero_grotte1: brasero(1),
  brasero_grotte2: brasero(2),
  brasero_grotte3: brasero(3),
  mur_glace: [
    { c: 'dit', texte: "Un mur de glace épais comme un rempart. À travers, on devine une salle bleutée et la lueur d'une braise." },
    { c: 'dit', qui: B, portrait: 'brann', texte: "Trois braseros éteints autour du hall… Si on les allume tous, ce mur ne tiendra pas longtemps." },
  ],
  statue_chevalier: [{ c: 'dit', texte: "« Au chevalier qui veilla sur la flamme, du premier hiver au dernier. » Le socle est vide." }],
  chevalier_glace: [
    { c: 'dit', texte: "Au fond de la salle, une armure de glace se dresse, une épée de givre à la main. Le socle de la statue, derrière elle, est vide." },
    { c: 'dit', qui: A, portrait: 'ael', texte: "La statue du chevalier… C'est elle qui s'est levée !" },
    { c: 'dit', qui: '???', portrait: 'roi', texte: "« Garde la braise, mon chevalier. Garde-la pour moi, pour toujours. »" },
    { c: 'combat', groupe: ['chevalier_givre', 'chevalier_glace', 'chevalier_givre'] },
    { c: 'flag', nom: 'chevalier_vaincu' },
    { c: 'dit', texte: "L'armure se fige, genou à terre, et la brume s'en échappe comme une haleine dans le froid." },
    { c: 'sauve' },
  ],
  braise_grotte: braise(3, 'chevalier_vaincu'),
  // ---------- Col du Blizzard ----------
  panneau_col: [{ c: 'dit', texte: "« Camp d'Hélène : à l'est. Le Fanal : tout droit, si le ciel le permet. »" }],
  blizzard_bloque: [
    { c: 'dit', texte: "Un mur de neige hurlante barre le passage. Le vent vous repousse à chaque pas, et la brume pique les yeux." },
    { c: 'si', cond: ['aubin_vu'], alors: [{ c: 'dit', qui: N, portrait: 'nour', texte: "Maître Aubin l'a dit : sans les trois braises d'Aurèle dans la lanterne, impossible de passer." }], sinon: [{ c: 'dit', qui: M, portrait: 'mira', texte: 'Impossible de passer comme ça. Demandons conseil au village.' }] },
  ],
  feu_helene: [{ c: 'dit', texte: 'Un feu de camp abrité par des peaux tendues. Une marmite de soupe mijote doucement.' }],
  helene: [
    { c: 'dit', qui: 'Hélène', portrait: 'helene', texte: "Hélène, guide des cimes. Asseyez-vous, le feu est à tout le monde." },
    { c: 'soin' },
    { c: 'son', id: 'soin' },
    { c: 'si', cond: ['!quete_wyverne'], alors: [
      { c: 'dit', qui: 'Hélène', portrait: 'helene', texte: "Vous avez vu les os, sur la corniche à l'est ? C'est le nid de la Wyverne blanche. Elle a pris mon frère, il y a dix hivers." },
      { c: 'dit', qui: 'Hélène', portrait: 'helene', texte: "Elle est vieille, énorme, et la brume l'a rendue folle. Si un jour vous vous sentez de taille… je vous paierai ce qu'il faudra." },
      { c: 'flag', nom: 'quete_wyverne' },
      { c: 'quete', id: 'q_wyverne', etat: 'active' },
    ] },
    { c: 'boutique', id: 'col' },
  ],
  wyverne: [
    { c: 'si', cond: ['wyverne_vaincue'], alors: [{ c: 'dit', texte: 'Le nid est vide. Le vent siffle entre les vieux os.' }], sinon: [
      { c: 'si', cond: ['quete_wyverne'], alors: [
        { c: 'choix', texte: "Une ombre immense tourne au-dessus de la corniche. Appeler la Wyverne blanche ?", options: [
          { texte: 'Frapper le bouclier', faire: [
            { c: 'secousse' },
            { c: 'dit', texte: 'Un cri déchire le ciel. La Wyverne fond sur vous, ailes déployées, dans un tourbillon de neige.' },
            { c: 'combat', groupe: ['wyverne_givre'] },
            { c: 'flag', nom: 'wyverne_vaincue' },
            { c: 'quete', id: 'q_wyverne', etat: 'terminee' },
            { c: 'or', n: 2000 },
            { c: 'dit', qui: 'Hélène', portrait: 'helene', texte: "Je l'ai entendue tomber depuis le camp. Mon frère peut dormir tranquille. Gardez son écaille : elle vous rendra plus vifs que le vent." },
            { c: 'sauve' },
          ] },
          { texte: 'Pas encore', faire: [] },
        ] },
      ], sinon: [{ c: 'dit', texte: "De grands os blanchis, et des plumes d'un mètre prises dans la glace. Quelque chose niche ici." }] },
    ] },
  ],
  // ---------- Fanal des Cimes ----------
  reflet_roi: [
    { c: 'dit', texte: "Au sommet, la tempête tombe d'un coup. Le silence est total. Devant le Fanal éteint, un énorme cœur de glace bat d'une lumière bleue." },
    { c: 'dit', qui: N, portrait: 'nour', texte: "Il y a quelqu'un, dedans ! Une jeune femme, les yeux fermés…" },
    { c: 'secousse' },
    { c: 'dit', texte: "La surface du cœur se trouble. Un visage s'y dessine, pâle, couronné de givre, d'une tristesse infinie." },
    { c: 'dit', qui: ROI, portrait: 'roi', texte: "« Petit voilier. Tu as monté toutes ces marches pour moi ? Comme c'est gentil. »" },
    { c: 'dit', qui: ROI, portrait: 'roi', texte: "« Aurèle dort. Elle n'a plus froid, elle n'a plus peur, elle n'a plus rien à garder. N'est-ce pas cela, la paix ? »" },
    { c: 'dit', qui: A, portrait: 'ael', texte: "Ce n'est pas la paix. C'est une prison. Et vous la gardez dedans parce que vous avez peur de la lumière." },
    { c: 'dit', qui: ROI, portrait: 'roi', texte: "« Peur ? … Peut-être. Alors regarde ce que la peur sait faire. »" },
    { c: 'combat', groupe: ['spectre_givre', 'reflet_roi', 'spectre_givre'] },
    { c: 'flag', nom: 'reflet_vaincu' },
    { c: 'flash', couleur: '#ffffff' },
    { c: 'dit', texte: "Le reflet se fend d'une seule fissure, de haut en bas. Le visage pâle sourit, presque soulagé." },
    { c: 'dit', qui: ROI, portrait: 'roi', texte: "« Quatre… Tu as de la suite dans les idées. Viens donc me voir chez moi, sous la Mer de Brume. Je t'attendrai au pied du dernier Fanal. »" },
    { c: 'dit', qui: M, portrait: 'mira', texte: 'Le cœur de glace ! Les braises, Aël, vite !' },
    { c: 'sauve' },
  ],
  coeur_glace: [
    { c: 'si', cond: ['aurele_libre'], alors: [{ c: 'dit', texte: "Il ne reste du cœur de glace qu'une flaque lumineuse qui fume dans le froid." }], sinon: [
      { c: 'si', cond: ['reflet_vaincu'], alors: [
        { c: 'dit', texte: "Aël lève la lanterne. Les trois braises bleues reconnaissent leur gardienne : la glace devient tiède, puis molle, puis plus rien." },
        { c: 'son', id: 'cristal' },
        { c: 'flash', couleur: '#cfe8ff' },
        { c: 'flag', nom: 'aurele_libre' },
        { c: 'dit', qui: AU, portrait: 'aurele', texte: "… Grand-père ? Non. Vous n'êtes pas de Givrebourg. Et cette lanterne… vous portez mes braises." },
        { c: 'dit', qui: N, portrait: 'nour', texte: "Votre grand-père nous les a confiées. Il vous attend en bas, avec une soupe et sans doute un sermon." },
        { c: 'dit', qui: AU, portrait: 'aurele', texte: "Ça lui ressemble. Merci… Rallumons le Fanal, avant que le froid ne revienne." },
        { c: 'sauve' },
      ], sinon: [{ c: 'dit', texte: 'Un cœur de glace bat doucement. Une silhouette dort à l’intérieur.' }] },
    ] },
  ],
  aurele: [
    { c: 'si', cond: ['fanal4_allume'], alors: [{ c: 'dit', qui: AU, portrait: 'aurele', texte: "Je garderai la flamme. Et cette fois, quand la voix triste reviendra, je lui répondrai." }], sinon: [
      { c: 'si', cond: ['!pendentif_aurele'], alors: [
        { c: 'dit', qui: AU, portrait: 'aurele', texte: "Prenez ceci. Ma mère l'a taillé dans la glace du premier hiver ; il ne fond jamais." },
        { c: 'donne', objet: 'pendentif_aurele' },
        { c: 'flag', nom: 'pendentif_aurele' },
      ] },
      { c: 'dit', qui: AU, portrait: 'aurele', texte: 'Les braises sont dans votre lanterne. Approchez-la du Fanal, je vous guiderai.' },
    ] },
  ],
  fanal_givre: [
    { c: 'si', cond: ['fanal4_allume'], alors: [{ c: 'dit', texte: 'Le Fanal des Cimes jette sur la neige des reflets de toutes les couleurs.' }], sinon: [
      { c: 'si', cond: ['aurele_libre'], alors: [
        { c: 'dit', qui: AU, portrait: 'aurele', texte: "Trois braises pour un feu, et la flamme de vos trois îles pour l'allumer. Maintenant !" },
        { c: 'flash', couleur: '#e6f4ff' },
        { c: 'son', id: 'fanal' },
        { c: 'retire', objet: 'braise_givre', n: 3 },
        { c: 'flag', nom: 'fanal4_allume' },
        { c: 'donne', objet: 'eclat_givre', silencieux: true },
        { c: 'secousse' },
        { c: 'dit', texte: "Le Fanal des Cimes s'embrase d'une flamme blanche. La lumière ricoche sur la neige et la glace, et le ciel tout entier se couvre d'une aurore verte et rose." },
        { c: 'quete', id: 'q_cimes', etat: 'terminee' },
        { c: 'appel', evenement: 'fin_acte4' },
      ], sinon: [{ c: 'dit', texte: 'Le Fanal est froid. Un givre épais couvre la vasque.' }] },
    ] },
  ],
  fin_acte4: [
    { c: 'si', cond: ['acte4_fini'], alors: [
      { c: 'dit', qui: N, portrait: 'nour', texte: 'Quatre Fanaux brillent sur Aérys. Le cinquième nous attend sous la Mer de Brume.' },
    ], sinon: [
      { c: 'dit', qui: M, portrait: 'mira', texte: "Regardez ! D'ici, on voit les trois autres Fanaux briller à l'horizon. Clairval, les Récifs, la Tour d'Ambre…" },
      { c: 'dit', qui: AU, portrait: 'aurele', texte: "Et là, sous les nuages. Vous la voyez, cette tache sombre qui ne bouge pas ? C'est le Royaume Pâle." },
      { c: 'dit', qui: AU, portrait: 'aurele', texte: "Les anciens disaient qu'un cinquième Fanal brûlait là-dessous, avant que la Brume ne monte. Le Fanal Premier." },
      { c: 'dit', qui: A, portrait: 'ael', texte: "Alors c'est là qu'on ira. Le Roi Pâle nous a invités, après tout." },
      { c: 'dit', qui: B, portrait: 'brann', texte: "Le Moineau va avoir besoin d'une coque renforcée pour plonger dans la Brume. Je m'en occupe." },
      { c: 'titre', texte: "Fin de l'Acte IV", sous: 'Quatre Fanaux brillent sur Aérys' },
      { c: 'flag', nom: 'acte4_fini' },
      { c: 'sauve' },
      { c: 'fin', texte: "L'Acte V, « Le Royaume Pâle », arrive bientôt. Ta sauvegarde t'attendra : termine les quêtes des Cimes de Givre, affronte la Wyverne blanche et renforce ton équipe." },
    ] },
  ],
};
