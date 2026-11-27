// Acte V : arrivée à Bordebrume, le dernier rocher des Veilleurs au bord du Royaume Pâle, et ses habitants.
import type { Script } from '../../core/story/script';
import { moineau } from './moineau';

const A = 'Aël';
const M = 'Mira';
const B = 'Brann';
const N = 'Nour';
const S = 'Séléné';

export const ACTE5_BORDEBRUME: Record<string, Script> = {
  acte5_debut: [
    { c: 'acte', n: 5 },
    { c: 'flag', nom: 'acte5' },
    { c: 'son', id: 'voile' },
    { c: 'titre', texte: 'Acte V', sous: 'Le Royaume Pâle' },
    { c: 'teleporte', carte: 'bordebrume', ancre: 'B', dir: 'haut' },
    { c: 'dit', texte: "Dix jours au chantier de Givrebourg. Brann a doublé la coque du Moineau de glace éternelle et d'ambre. Puis cap au sud-ouest, là où la Mer de Brume se creuse comme un puits." },
    { c: 'dit', texte: "Au bord du gouffre, un dernier rocher tient bon : Bordebrume, le village des Veilleurs, dont les lanternes brûlent depuis mille ans face au Royaume Pâle." },
    { c: 'dit', qui: B, portrait: 'brann', texte: "Coque renforcée, voile neuve, et pas un clou de travers. Le Moineau peut descendre où vous voulez." },
    { c: 'dit', qui: N, portrait: 'nour', texte: "L'astrolabe s'affole. Le dernier Fanal est juste sous nos pieds. Tout en bas." },
    { c: 'dit', qui: M, portrait: 'mira', texte: "Les Veilleurs… Ma mère disait qu'ils gardent un escalier qui descend sous la Brume." },
    { c: 'dit', qui: A, portrait: 'ael', texte: "Alors trouvons leur chef. C'est la dernière marche." },
    { c: 'quete', id: 'q_royaume', etat: 'active' },
    { c: 'soin' },
    { c: 'sauve' },
  ],
  moineau_brume: moineau('Le Moineau, coque cerclée d’ambre, flotte au-dessus du gouffre. Où mettre le cap ?', 'bordebrume', 'Rester à Bordebrume'),
  selene: [
    { c: 'si', cond: ['fanal5_allume'], alors: [
      { c: 'dit', qui: S, portrait: 'selene', texte: "Mille ans de veille, et je suis la Grande Veilleuse qui a pu éteindre sa lanterne. Allez, jeunes gens. Le ciel est à vous." },
    ], sinon: [
      { c: 'si', cond: ['portail_ouvert'], alors: [
        { c: 'dit', qui: S, portrait: 'selene', texte: "Le palais est ouvert. Je le sens d'ici : la Brume retient son souffle. Allez jusqu'au trône, et gardez les souvenirs de Lune contre vous." },
      ], sinon: [
        { c: 'si', cond: ['selene_vue'], alors: [
          { c: 'dit', qui: S, portrait: 'selene', texte: "La couronne est au Rivage, gardée par le Passeur. La boîte à musique dort dans Aubefonde, à l'est. Le portrait, dans les Jardins de Lune, à l'ouest." },
        ], sinon: [
          { c: 'dit', qui: S, portrait: 'selene', texte: "Des voyageurs du ciel, avec une lanterne à quatre flammes. Je suis Séléné, Grande Veilleuse. Nous vous attendions depuis mille ans. Ne faites pas cette tête : c'est notre métier." },
          { c: 'dit', qui: S, portrait: 'selene', texte: "Sous la Brume dort Aubefonde, la plus ancienne des îles. Son roi, Morvane, gardait le Fanal Premier, celui qui alluma tous les autres." },
          { c: 'dit', qui: S, portrait: 'selene', texte: "Chez nous, on dit que les âmes des morts montent dans la lumière des Fanaux. Quand sa fille Lune est morte, Morvane n'a pas voulu la laisser monter." },
          { c: 'dit', qui: S, portrait: 'selene', texte: "Il a éteint le Fanal pour la retenir. Et Aubefonde est tombée dans la Brume, jusqu'au Fond, avec tout son peuple endormi." },
          { c: 'dit', qui: N, portrait: 'nour', texte: "Le Roi Pâle… C'est lui. Il veut éteindre les autres Fanaux pour que plus personne ne parte jamais." },
          { c: 'dit', qui: S, portrait: 'selene', texte: "Oui. Son palais est fermé par trois sceaux de chagrin. Pour les lever, il faut trois souvenirs de Lune : sa couronne de fleurs, sa boîte à musique, son portrait." },
          { c: 'dit', qui: S, portrait: 'selene', texte: "La Brume les a confiés à ses gardiens. L'Escalier des Veilleurs, au nord du village, descend jusqu'au Rivage Pâle. Prenez cette cape : elle a gardé trois Veilleurs avant vous." },
          { c: 'donne', objet: 'cape_veilleur' },
          { c: 'dit', qui: M, portrait: 'mira', texte: "Une enfant qui meurt, un père qui ne veut pas la laisser partir… Je ne sais pas si je dois le détester ou le plaindre." },
          { c: 'dit', qui: A, portrait: 'ael', texte: "On le saura en le regardant dans les yeux." },
          { c: 'flag', nom: 'selene_vue' },
          { c: 'quete', id: 'q_souvenirs', etat: 'active' },
          { c: 'sauve' },
        ] },
      ] },
    ] },
  ],
  boutique_bordebrume: [
    { c: 'dit', qui: 'Corin', portrait: 'corin', texte: "Lait de lune, rosée d'étoile, larmes de Fanal. Là-dessous, la nuit dure toujours. Prenez de quoi tenir." },
    { c: 'boutique', id: 'bordebrume_provisions' },
  ],
  armurerie_bordebrume: [
    { c: 'dit', qui: 'Ysé', portrait: 'yse', texte: "Nos armes ont mille ans de veille dans le métal. Elles ne craignent ni la Brume ni ce qu'elle cache." },
    { c: 'boutique', id: 'bordebrume_armes' },
  ],
  lio: [
    { c: 'si', cond: ['!chanson_lio'], alors: [
      { c: 'dit', qui: 'Lio', portrait: 'lio', texte: "Lio, barde et aubergiste. Une chanson pour les héros ? Elle parle d'une petite princesse qui riait si fort que les nuages s'écartaient." },
      { c: 'dit', qui: 'Lio', portrait: 'lio', texte: "On la chante ici depuis mille ans. Plus personne ne se souvient de la fin." },
      { c: 'flag', nom: 'chanson_lio' },
    ] },
    { c: 'choix', texte: 'Lio : « Un lit près de la grande lanterne, 80 pièces. »', options: [
      { texte: 'Se reposer (80 pièces)', faire: [
        { c: 'paye', n: 80,
          alors: [{ c: 'soin' }, { c: 'son', id: 'soin' }, { c: 'dit', texte: 'Le groupe dort à la lueur des lanternes, bercé par la chanson de Lio.' }],
          sinon: [{ c: 'dit', qui: 'Lio', portrait: 'lio', texte: "Pas assez de pièces ? Je vous chanterai quand même quelque chose. Mais le lit, c'est payant." }] },
      ] },
      { texte: 'Non merci', faire: [] },
    ] },
  ],
  ambroise: [
    { c: 'si', cond: ['leviathan_rendu'], alors: [
      { c: 'dit', qui: 'Ambroise', portrait: 'ambroise', texte: "Cinquante ans que je n'avais pas dormi une nuit entière. Merci, petits." },
    ], sinon: [
      { c: 'si', cond: ['leviathan_vaincu'], alors: [
        { c: 'dit', qui: 'Ambroise', portrait: 'ambroise', texte: "Vous l'avez fait. Le Léviathan… Je l'ai entendu hurler jusqu'ici. Mon bateau est vengé." },
        { c: 'dit', qui: 'Ambroise', portrait: 'ambroise', texte: "Prenez mes économies et ces larmes de Fanal. Un vieux pêcheur n'en a plus besoin." },
        { c: 'or', n: 5000 },
        { c: 'donne', objet: 'larme_fanal', n: 3 },
        { c: 'flag', nom: 'leviathan_rendu' },
        { c: 'quete', id: 'q_leviathan', etat: 'terminee' },
      ], sinon: [
        { c: 'dit', qui: 'Ambroise', portrait: 'ambroise', texte: "Ambroise. J'étais pêcheur de brume, avant. J'avais vingt ans quand le Léviathan a avalé mon bateau, et mon frère avec." },
        { c: 'dit', qui: 'Ambroise', portrait: 'ambroise', texte: "Il chasse toujours dans la grande mare, au sud du Rivage Pâle. Ma vieille barque y est échouée. Frappez trois coups sur sa coque : il viendra." },
        { c: 'dit', qui: B, portrait: 'brann', texte: "Un monstre de mer qui vit dans la brume. Pourquoi pas, après tout." },
        { c: 'si', cond: ['!quete_leviathan'], alors: [{ c: 'flag', nom: 'quete_leviathan' }, { c: 'quete', id: 'q_leviathan', etat: 'active' }] },
      ] },
    ] },
  ],
  basile: [
    { c: 'si', cond: ['pages_rendues'], alors: [
      { c: 'dit', qui: 'Basile', portrait: 'basile', texte: "Je recopie le journal du roi pour la bibliothèque. Personne ne devrait oublier qu'il a d'abord été un père." },
    ], sinon: [
      { c: 'si', cond: ['coffre:rivage_pale:p1', 'coffre:jardins_lune:p2', 'coffre:palais_pale:p3'], alors: [
        { c: 'dit', qui: 'Basile', portrait: 'basile', texte: "Les trois pages ! Voyons… C'est l'écriture du roi Morvane." },
        { c: 'retire', objet: 'page_journal', n: 3 },
        { c: 'dit', qui: 'Basile', portrait: 'basile', texte: "« Lune tousse depuis l'hiver. Le Fanal brille plus fort que jamais, et il ne peut rien pour elle. »" },
        { c: 'dit', qui: 'Basile', portrait: 'basile', texte: "« La Brume m'a parlé cette nuit. Elle dit qu'elle sait arrêter le temps. Plus de dernier jour. Plus jamais. »" },
        { c: 'dit', qui: 'Basile', portrait: 'basile', texte: "« Pardonne-moi, ma lune. Je n'ai pas su te laisser partir. »" },
        { c: 'dit', qui: M, portrait: 'mira', texte: "…" },
        { c: 'dit', qui: 'Basile', portrait: 'basile', texte: "Prenez son sceau. Il était glissé entre les pages. Je crois qu'il voudrait qu'il serve à le réveiller." },
        { c: 'donne', objet: 'sceau_morvane' },
        { c: 'flag', nom: 'pages_rendues' },
        { c: 'quete', id: 'q_pages', etat: 'terminee' },
      ], sinon: [
        { c: 'dit', qui: 'Basile', portrait: 'basile', texte: "Basile, archiviste des Veilleurs. Il manque trois pages au journal du roi Morvane : arrachées le jour où Aubefonde est tombée." },
        { c: 'dit', qui: 'Basile', portrait: 'basile', texte: "Une au Rivage, une dans les Jardins de Lune, une dans le palais. Si vous les trouvez, nous saurons enfin ce qui s'est passé." },
        { c: 'si', cond: ['!quete_pages'], alors: [{ c: 'flag', nom: 'quete_pages' }, { c: 'quete', id: 'q_pages', etat: 'active' }] },
      ] },
    ] },
  ],
  pia: [
    { c: 'si', cond: ['fanal5_allume'], alors: [{ c: 'dit', qui: 'Pia', portrait: 'pia', texte: "La Brume est descendue ! On voit le soleil d'en dessous, maintenant. Il est tout jaune !" }], sinon: [
      { c: 'dit', qui: 'Pia', portrait: 'pia', texte: "Quand je serai grande, je serai Veilleuse. Je resterai éveillée toute la nuit. … Bon, peut-être pas toute la nuit." },
    ] },
  ],
  lanterne_bordebrume: [{ c: 'dit', texte: "La Grande Lanterne des Veilleurs. Sa flamme n'a pas vacillé depuis mille ans, dit-on." }],
  escalier_veilleurs: [{ c: 'dit', texte: "« Escalier des Veilleurs. Mille marches jusqu'au Rivage Pâle. Comptez-les : ça tient éveillé. »" }],
  panneau_bordebrume: [{ c: 'dit', texte: '↑ Escalier des Veilleurs, vers le Rivage Pâle. ↓ Ponton du Moineau.' }],
};
