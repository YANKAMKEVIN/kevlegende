// Acte IV : arrivée à Givrebourg, le village perché des Cimes de Givre, et ses habitants.
import type { Script } from '../../core/story/script';
import { moineau } from './moineau';

const A = 'Aël';
const M = 'Mira';
const B = 'Brann';
const N = 'Nour';
const AU = 'Maître Aubin';

export const ACTE4_GIVREBOURG: Record<string, Script> = {
  acte4_debut: [
    { c: 'acte', n: 4 },
    { c: 'flag', nom: 'acte4' },
    { c: 'son', id: 'voile' },
    { c: 'titre', texte: 'Acte IV', sous: 'Les Cimes de Givre' },
    { c: 'teleporte', carte: 'givrebourg', ancre: 'B', dir: 'haut' },
    { c: 'dit', texte: "Cinq jours plein nord. Le vent tourne au gris, puis au blanc. La voile du Moineau se raidit de givre, et une île de neige surgit des nuages, hérissée de sapins." },
    { c: 'dit', qui: B, portrait: 'brann', texte: "Brr… Hier encore je me plaignais de la chaleur. Je retire tout. Je veux retourner dans le désert." },
    { c: 'dit', qui: N, portrait: 'nour', texte: "L'astrolabe ne s'était pas trompé : le quatrième Fanal est là-haut, sur le pic. Mais il ne brille plus." },
    { c: 'dit', qui: M, portrait: 'mira', texte: "Regardez le sommet. Une lueur bleue bat comme un cœur, sous la tempête de neige." },
    { c: 'dit', qui: A, portrait: 'ael', texte: "Allons trouver le chef du village. Il y a de la fumée aux cheminées : quelqu'un tient bon, ici." },
    { c: 'quete', id: 'q_cimes', etat: 'active' },
    { c: 'soin' },
    { c: 'sauve' },
  ],
  moineau_givre: moineau('Le Moineau, voile givrée, attend au bout du ponton. Où mettre le cap ?', 'givrebourg', 'Rester à Givrebourg'),
  aubin: [
    { c: 'si', cond: ['fanal4_allume'], alors: [
      { c: 'dit', qui: AU, portrait: 'aubin', texte: "Les cheminées fument droit, ce soir. Le vent est revenu du bon côté. Merci, jeunes gens." },
    ], sinon: [
      { c: 'si', cond: ['braises_reunies'], alors: [
        { c: 'dit', qui: AU, portrait: 'aubin', texte: "La lanterne tiendra le blizzard à distance. Montez au Col, au nord des Pentes, et ne vous arrêtez pas avant le sommet." },
      ], sinon: [
        { c: 'si', cond: ['braise1', 'braise2', 'braise3'], alors: [
          { c: 'dit', qui: AU, portrait: 'aubin', texte: "Les trois braises… Je n'osais plus y croire. Donnez-moi la lanterne, mon garçon." },
          { c: 'son', id: 'fanal' },
          { c: 'flash', couleur: '#ffd27a' },
          { c: 'dit', texte: "Le vieil homme dépose les trois braises dans la lanterne d'Aël. Elles se mêlent à la flamme de Clairval sans un bruit, et la lumière devient blanche comme la neige au soleil." },
          { c: 'dit', qui: AU, portrait: 'aubin', texte: "Voilà. Aucune neige ne tient devant cette lumière-là. Le blizzard du Col s'ouvrira devant vous." },
          { c: 'dit', qui: N, portrait: 'nour', texte: "Et Aurèle ? Si elle est encore là-haut…" },
          { c: 'dit', qui: AU, portrait: 'aubin', texte: "Alors ramenez-la. C'est ma petite-fille. Elle a la tête plus dure que la glace du lac." },
          { c: 'flag', nom: 'braises_reunies' },
          { c: 'quete', id: 'q_braises', etat: 'terminee' },
          { c: 'sauve' },
        ], sinon: [
          { c: 'si', cond: ['aubin_vu'], alors: [
            { c: 'dit', qui: AU, portrait: 'aubin', texte: "Une braise sur le plateau, au nord-ouest des Pentes. Une sur l'île du Lac Gelé. La dernière au fond de la Grotte de Givre, à l'est." },
          ], sinon: [
            { c: 'dit', qui: AU, portrait: 'aubin', texte: "Des voyageurs du ciel, par ce froid ? Entrez vous réchauffer près du brasero. Je suis Aubin, bourgmestre de Givrebourg." },
            { c: 'dit', qui: A, portrait: 'ael', texte: "Nous avons rallumé trois Fanaux. Le vôtre est éteint, n'est-ce pas ?" },
            { c: 'dit', qui: AU, portrait: 'aubin', texte: "Éteint… pas tout à fait. Sa gardienne, Aurèle, a senti la flamme faiblir il y a un mois. Une voix lui parlait la nuit, une voix triste, couronnée." },
            { c: 'dit', qui: AU, portrait: 'aubin', texte: "Plutôt que de la laisser mourir, elle a partagé la dernière flamme en trois braises et les a cachées dans trois sanctuaires. Puis elle est montée seule au sommet." },
            { c: 'dit', qui: AU, portrait: 'aubin', texte: "Le lendemain, le blizzard a fermé le Col. Et les bêtes des neiges se sont mises à garder les sanctuaires, les yeux pleins de brume." },
            { c: 'dit', qui: M, portrait: 'mira', texte: "Le Roi Pâle, encore. Il essaie la même chose sur chaque île." },
            { c: 'dit', qui: AU, portrait: 'aubin', texte: "Rapportez-moi les trois braises. Avec elles, votre lanterne percera le blizzard, et vous atteindrez le Fanal." },
            { c: 'dit', qui: AU, portrait: 'aubin', texte: "Le plateau des Pentes au nord-ouest, l'île du Lac Gelé à l'ouest, le fond de la Grotte de Givre à l'est. Couvrez-vous bien." },
            { c: 'flag', nom: 'aubin_vu' },
            { c: 'quete', id: 'q_braises', etat: 'active' },
            { c: 'sauve' },
          ] },
        ] },
      ] },
    ] },
  ],
  boutique_givrebourg: [
    { c: 'dit', qui: 'Gaspard', portrait: 'gaspard', texte: "Soupe, thé, braises en pot ! Là-haut, ce n'est pas la faim qui tue, c'est le froid. Achetez chaud !" },
    { c: 'boutique', id: 'givrebourg_provisions' },
  ],
  armurerie_givrebourg: [
    { c: 'dit', qui: 'Inès', portrait: 'ines', texte: "Fourrure, acier trempé dans la neige, bois de sapin noir. Ce que je forge ne casse pas au gel." },
    { c: 'boutique', id: 'givrebourg_armes' },
  ],
  solene: [
    { c: 'si', cond: ['!soupe_solene'], alors: [
      { c: 'dit', qui: 'Solène', portrait: 'solene', texte: "Vous êtes bleus de froid ! Tenez, une soupe aux châtaignes, offerte par la maison." },
      { c: 'donne', objet: 'soupe_chaude', n: 2 },
      { c: 'flag', nom: 'soupe_solene' },
    ] },
    { c: 'choix', texte: 'Solène : « Un lit sous l’édredon et un feu toute la nuit, 60 pièces. »', options: [
      { texte: 'Se reposer (60 pièces)', faire: [
        { c: 'paye', n: 60,
          alors: [{ c: 'soin' }, { c: 'son', id: 'soin' }, { c: 'dit', texte: 'Le groupe dort au chaud, bercé par le craquement des bûches.' }],
          sinon: [{ c: 'dit', qui: 'Solène', portrait: 'solene', texte: 'Il vous manque quelques pièces. Revenez vite, il fait froid dehors.' }] },
      ] },
      { texte: 'Non merci', faire: [] },
    ] },
  ],
  agathe: [
    { c: 'si', cond: ['fleurs_rendues'], alors: [
      { c: 'dit', qui: 'Mère Agathe', portrait: 'agathe', texte: "Mes fleurs-de-givre sèchent au-dessus de l'âtre. Cet hiver, personne ne toussera à Givrebourg." },
    ], sinon: [
      { c: 'si', cond: ['coffre:pentes:f1', 'coffre:lac_givre:f2', 'coffre:grotte_givre:f3'], alors: [
        { c: 'dit', qui: 'Mère Agathe', portrait: 'agathe', texte: "Trois fleurs-de-givre, intactes ! Vous avez des mains de guérisseurs. Prenez cette broche : elle a gardé ma mère du froid toute sa vie." },
        { c: 'retire', objet: 'fleur_givre', n: 3 },
        { c: 'donne', objet: 'broche_edelweiss' },
        { c: 'or', n: 500 },
        { c: 'flag', nom: 'fleurs_rendues' },
        { c: 'quete', id: 'q_fleurs', etat: 'terminee' },
      ], sinon: [
        { c: 'dit', qui: 'Mère Agathe', portrait: 'agathe', texte: "Agathe, herboriste. La fièvre du givre court au village, et mes remèdes demandent des fleurs-de-givre." },
        { c: 'dit', qui: 'Mère Agathe', portrait: 'agathe', texte: "Il en pousse une sur les Pentes, une sur la glace du lac, une dans la grotte. Les bêtes les gardent jalousement." },
        { c: 'si', cond: ['!quete_fleurs'], alors: [{ c: 'flag', nom: 'quete_fleurs' }, { c: 'quete', id: 'q_fleurs', etat: 'active' }] },
      ] },
    ] },
  ],
  joris: [
    { c: 'si', cond: ['yaks_rendus'], alors: [
      { c: 'dit', qui: 'Joris', portrait: 'joris', texte: "Tout mon troupeau est rentré. Vous entendez ce vacarme ? Ce sont des yacks heureux." },
    ], sinon: [
      { c: 'si', cond: ['yak1', 'yak2', 'yak3'], alors: [
        { c: 'dit', qui: 'Joris', portrait: 'joris', texte: "Neige, Grêlon et Bourrasque ! Tous les trois ! Tenez, mon cor de berger : il a fait revenir plus de bêtes que tous les chiens de l'île." },
        { c: 'donne', objet: 'cor_yak' },
        { c: 'or', n: 600 },
        { c: 'flag', nom: 'yaks_rendus' },
        { c: 'quete', id: 'q_yaks', etat: 'terminee' },
      ], sinon: [
        { c: 'dit', qui: 'Joris', portrait: 'joris', texte: "Joris, berger. Le blizzard a dispersé trois de mes yacks sur les Pentes Blanches. Ils ont peur de tout, depuis que la brume rôde." },
        { c: 'dit', qui: 'Joris', portrait: 'joris', texte: "Si vous les croisez, parlez-leur doucement. Ils rentreront tout seuls en sentant votre lanterne." },
        { c: 'si', cond: ['!quete_yaks'], alors: [{ c: 'flag', nom: 'quete_yaks' }, { c: 'quete', id: 'q_yaks', etat: 'active' }] },
      ] },
    ] },
  ],
  leon: [
    { c: 'si', cond: ['fanal4_allume'], alors: [{ c: 'dit', qui: 'Léon', portrait: 'leon', texte: "Le Fanal fait des arcs-en-ciel sur la neige ! Demain, je construis un bonhomme deux fois plus grand." }], sinon: [
      { c: 'dit', qui: 'Léon', portrait: 'leon', texte: "Le bonhomme de neige, c'est moi qui l'ai fait. Il garde le village pendant que grand-père cherche une solution." },
    ] },
  ],
  bonhomme: [{ c: 'dit', texte: 'Un bonhomme de neige avec un nez de carotte et une écharpe rouge. Il a l’air très sérieux.' }],
  brasero_place: [{ c: 'dit', texte: "Le brasero de la place crépite. Les villageois s'y relaient jour et nuit pour qu'il ne s'éteigne pas." }],
  yak_village: [{ c: 'dit', texte: 'Un yack laineux mâchonne du foin glacé. Il vous regarde avec une infinie patience.' }],
  panneau_givrebourg: [{ c: 'dit', texte: '↑ Pentes Blanches. « Au-delà du Col, nul ne passe tant que souffle le blizzard. »' }],
};
