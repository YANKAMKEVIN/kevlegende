// Acte II : Port-Venteux, les Récifs Célestes, l'Épave du Fendeur et le Phare des Récifs.
import type { Script } from '../../core/story/script';

const A = 'Aël';
const M = 'Mira';
const B = 'Brann';

export const ACTE2: Record<string, Script> = {
  acte2_debut: [
    { c: 'acte', n: 2 },
    { c: 'flag', nom: 'acte2' },
    { c: 'titre', texte: 'Acte II', sous: 'Les Récifs Célestes' },
    { c: 'teleporte', carte: 'port', ancre: 'B', dir: 'haut' },
    { c: 'dit', texte: 'Porté par le courant de vent, le Moineau glisse au-dessus des nuages jusqu’aux quais de Port-Venteux.' },
    { c: 'dit', qui: M, portrait: 'mira', texte: "Port-Venteux ! La plus grande cité de l'archipel. D'habitude, le port grouille de voiles…" },
    { c: 'dit', qui: A, portrait: 'ael', texte: "Là, il n'y a presque personne. Et regarde, au large : la Brume entoure les récifs." },
    { c: 'dit', qui: M, portrait: 'mira', texte: 'Trouvons la capitaine du port. Elle saura ce qui se passe.' },
    { c: 'quete', id: 'q_recifs', etat: 'active' },
    { c: 'soin' },
    { c: 'sauve' },
  ],
  moineau: [{ c: 'dit', texte: 'Le Moineau, le petit voilier de tes parents. Sa voile bleue claque doucement au vent.' }],
  maelle: [
    { c: 'si', cond: ['fanal2_allume'], alors: [
      { c: 'dit', qui: 'Maëlle', portrait: 'maelle', texte: 'Les voiles reviennent au port ! Port-Venteux ne t’oubliera pas, Aël de Clairval.' },
    ], sinon: [
      { c: 'si', cond: ['creux_vaincu'], alors: [
        { c: 'dit', qui: 'Maëlle', portrait: 'maelle', texte: 'Creux est tombé ? Alors la chaîne de la Passe est levée. Le Phare est à l’est des récifs. Faites vite.' },
      ], sinon: [
        { c: 'si', cond: ['maelle_vue'], alors: [
          { c: 'dit', qui: 'Maëlle', portrait: 'maelle', texte: 'Brann le forgeron, dans la forge à l’ouest du port. Il connaît les récifs mieux que personne.' },
        ], sinon: [
          { c: 'dit', qui: 'Maëlle', portrait: 'maelle', texte: 'Des voyageurs de Clairval ? Par tous les vents… Vous êtes les premiers à passer depuis dix jours.' },
          { c: 'dit', qui: 'Maëlle', portrait: 'maelle', texte: "Le Capitaine Creux et ses pirates de brume ont tendu une chaîne en travers de la Passe des Récifs. Plus rien n'entre, plus rien ne sort." },
          { c: 'dit', qui: 'Maëlle', portrait: 'maelle', texte: 'Et derrière la chaîne, le Phare des Récifs, notre Fanal, s’éteint. Une bête énorme s’est enroulée autour.' },
          { c: 'dit', qui: A, portrait: 'ael', texte: 'Nous avons rallumé celui de Clairval. On peut le refaire ici.' },
          { c: 'dit', qui: 'Maëlle', portrait: 'maelle', texte: "Vous ? … Allez voir Brann, à la forge. Sa sœur Nell est la gardienne du Phare. Il cherche des fous pour l'accompagner." },
          { c: 'flag', nom: 'maelle_vue' },
        ] },
      ] },
    ] },
  ],
  garde_est: [
    { c: 'dit', qui: 'Garde', portrait: 'marin', texte: "Les récifs sont infestés de pirates et de bêtes de brume. Personne ne sort sans quelqu'un qui connaît les passes." },
    { c: 'dit', qui: 'Garde', portrait: 'marin', texte: 'Brann le forgeron, par exemple. Mais il ne sort plus de sa forge.' },
  ],
  brann: [
    { c: 'dit', qui: B, portrait: 'brann', texte: "La forge est froide. Le feu est mort quand le Phare a faibli. Alors qu'est-ce que vous voulez ?" },
    { c: 'dit', qui: A, portrait: 'ael', texte: "Rallumer le Phare des Récifs. Et sauver votre sœur, si on peut." },
    { c: 'dit', qui: B, portrait: 'brann', texte: '… Nell. Elle est restée là-bas, toute seule, à garder une flamme qui meurt. Moi je n’ai pas pu passer la chaîne.' },
    { c: 'dit', qui: M, portrait: 'mira', texte: "La chaîne est tenue par le Capitaine Creux, non ? Si on prend son épave, on prend la chaîne." },
    { c: 'dit', qui: B, portrait: 'brann', texte: 'Elle me plaît, la cartographe. Bon. Je prends mon marteau. Je connais les passes, je vous guide.' },
    { c: 'rejoint', hero: 'brann', niveau: 9 },
    { c: 'flag', nom: 'brann_rejoint' },
    { c: 'dit', qui: B, portrait: 'brann', texte: "Et si vous trouvez du corail céleste là-bas, rapportez-le. Avec trois branches, je vous forge une lame digne de ce nom." },
    { c: 'flag', nom: 'quete_corail' },
    { c: 'quete', id: 'q_corail', etat: 'active' },
    { c: 'sauve' },
  ],
  forge_foyer: [
    { c: 'si', cond: ['fanal2_allume'], alors: [{ c: 'dit', texte: 'Le foyer ronfle, chauffé à blanc.' }], sinon: [{ c: 'dit', texte: 'Le foyer est froid. Une seule braise rougeoie encore sous la cendre.' }] },
  ],
  forge_enclume: [
    { c: 'si', cond: ['corail_forge'], alors: [{ c: 'dit', texte: "L'enclume porte encore la marque de l'Épée de corail." }], sinon: [
      { c: 'si', cond: ['corail1', 'corail2', 'corail3', 'brann_rejoint'], alors: [
        { c: 'dit', qui: B, portrait: 'brann', texte: 'Trois branches de corail céleste ! Laisse-moi faire.' },
        { c: 'son', id: 'forge' },
        { c: 'flash', couleur: '#ffb36b' },
        { c: 'retire', objet: 'corail_celeste', n: 3 },
        { c: 'donne', objet: 'epee_corail' },
        { c: 'flag', nom: 'corail_forge' },
        { c: 'quete', id: 'q_corail', etat: 'terminee' },
        { c: 'dit', qui: B, portrait: 'brann', texte: 'Légère, tranchante, et elle ne rouille jamais. Équipe-la, petit voilier.' },
      ], sinon: [{ c: 'dit', texte: "Une enclume massive, polie par des années de coups de marteau." }] },
    ] },
  ],
  boutique_port: [
    { c: 'dit', qui: 'Corentin', portrait: 'villageois', texte: 'Provisions de voyage ! Tout ce qu’il faut pour survivre aux récifs.' },
    { c: 'boutique', id: 'port_provisions' },
  ],
  armurerie_port: [
    { c: 'dit', qui: 'Ysolde', portrait: 'villageoise', texte: 'Lames, arcs, mailles. Rien de mieux dans tout Aérys, je le jure sur ma grand-mère.' },
    { c: 'boutique', id: 'port_armes' },
  ],
  auberge_port: [
    { c: 'choix', texte: 'Barnabé : « Une nuit au Hamac Doré, 20 pièces. »', options: [
      { texte: 'Se reposer (20 pièces)', faire: [
        { c: 'paye', n: 20,
          alors: [{ c: 'soin' }, { c: 'son', id: 'soin' }, { c: 'dit', texte: 'Le groupe a dormi comme des loirs bercés par le vent.' }],
          sinon: [{ c: 'dit', qui: 'Barnabé', portrait: 'villageois', texte: 'Il te manque quelques pièces, voyageur.' }] },
      ] },
      { texte: 'Non merci', faire: [] },
    ] },
  ],
  anselme: [
    { c: 'si', cond: ['pieces_rendues'], alors: [{ c: 'dit', qui: 'Anselme', portrait: 'tobias', texte: 'Ma collection est complète ! Je les regarde briller tous les soirs.' }], sinon: [
      { c: 'si', cond: ['coffre:epave:p1', 'coffre:epave:p2', 'coffre:epave:p3'], alors: [
        { c: 'dit', qui: 'Anselme', portrait: 'tobias', texte: 'Les trois pièces du Fendeur ! Frappées au phare ! Tu ne sais pas ce que ça représente pour moi.' },
        { c: 'retire', objet: 'piece_ancienne', n: 3 },
        { c: 'donne', objet: 'arc_lune' },
        { c: 'flag', nom: 'pieces_rendues' },
        { c: 'quete', id: 'q_pieces', etat: 'terminee' },
      ], sinon: [
        { c: 'dit', qui: 'Anselme', portrait: 'tobias', texte: "Je collectionne les monnaies anciennes. Le Fendeur, l'épave sur les récifs, transportait trois pièces frappées d'un phare." },
        { c: 'dit', qui: 'Anselme', portrait: 'tobias', texte: "Rapporte-les-moi et je t'offre mon plus bel arc. Il était à mon père, il brille au clair de lune." },
        { c: 'si', cond: ['!quete_pieces'], alors: [{ c: 'flag', nom: 'quete_pieces' }, { c: 'quete', id: 'q_pieces', etat: 'active' }] },
      ] },
    ] },
  ],
  marin1: [{ c: 'dit', qui: 'Marin', portrait: 'marin', texte: "Mon navire est coincé au port depuis dix jours. Si ça continue, je vais devoir apprendre à pêcher des nuages." }],
  lili: [{ c: 'dit', qui: 'Lili', portrait: 'pim', texte: "Ma maman dit que la bête du Phare a huit bras. Moi je dis qu'elle en a au moins douze." }],
  hulotte: [
    { c: 'dit', qui: 'Mère Hulotte', portrait: 'odile', texte: "Le Roi Pâle… Quand j'étais petite, on disait qu'il vivait au Fond, là où les îles tombent." },
    { c: 'dit', qui: 'Mère Hulotte', portrait: 'odile', texte: "On disait aussi qu'il pleurait. Un homme qui pleure, ça peut faire de terribles bêtises." },
  ],
  port_fontaine: [{ c: 'dit', texte: "Une fontaine en forme de voile. L'eau coule… vers le haut." }],
  panneau_recifs: [{ c: 'dit', texte: '→ Passe des Récifs. « Défense de pêcher les méduses. Elles piquent et elles portent plainte. »' }],
  // ---------- Récifs ----------
  panneau_recifs_int: [{ c: 'dit', texte: '« Épave du Fendeur : nord-est. Phare des Récifs : est, derrière la chaîne. »' }],
  chaine_recifs: [
    { c: 'dit', texte: "Une énorme chaîne rouillée barre la passerelle, cadenassée d'un crâne de brume." },
    { c: 'dit', qui: B, portrait: 'brann', texte: "C'est la chaîne de Creux. Son épave est au nord-est. On lui reprend la clé." },
  ],
  lou: [
    { c: 'dit', qui: 'Lou', portrait: 'marin', texte: "Lou, marchande ambulante ! Je campe sur mon corail en attendant que ça se calme. Un petit achat ? Et une sieste, c'est gratuit." },
    { c: 'soin' },
    { c: 'son', id: 'soin' },
    { c: 'boutique', id: 'recifs' },
  ],
  corail1: [{ c: 'son', id: 'cristal' }, { c: 'donne', objet: 'corail_celeste' }, { c: 'flag', nom: 'corail1' }],
  corail2: [{ c: 'son', id: 'cristal' }, { c: 'donne', objet: 'corail_celeste' }, { c: 'flag', nom: 'corail2' }],
  corail3: [{ c: 'son', id: 'cristal' }, { c: 'donne', objet: 'corail_celeste' }, { c: 'flag', nom: 'corail3' }],
  // ---------- Épave ----------
  jonas: [
    { c: 'si', cond: ['creux_vaincu'], alors: [{ c: 'dit', qui: 'Jonas', portrait: 'pip', texte: "Le capitaine n'est plus… Je crois que je vais devenir boulanger." }], sinon: [
      { c: 'dit', qui: 'Jonas', portrait: 'pip', texte: "Je suis Jonas, le mousse. Le capitaine n'était pas comme ça avant. La Brume l'a vidé de l'intérieur." },
      { c: 'dit', qui: 'Jonas', portrait: 'pip', texte: "Il garde la clé de la chaîne à la poupe, tout à l'est. Il craint la lumière… et les coups de marteau, je crois." },
    ] },
  ],
  creux_vu: [{ c: 'dit', texte: 'Le capitaine fixe l’horizon sans vous voir.' }],
  creux_combat: [
    { c: 'dit', qui: 'Capitaine Creux', portrait: 'creux', texte: 'Des passagers clandestins sur MON navire ? Le Roi Pâle m’a promis le ciel entier en échange de ce Phare.' },
    { c: 'dit', qui: B, portrait: 'brann', texte: 'Tu as vendu les récifs pour une promesse, Creux. Rends-moi la clé de la chaîne.' },
    { c: 'dit', qui: 'Capitaine Creux', portrait: 'creux', texte: 'Viens la chercher, forgeron.' },
    { c: 'combat', groupe: ['pirate_brume', 'capitaine_creux', 'pirate_brume'] },
    { c: 'flag', nom: 'creux_vaincu' },
    { c: 'flag', nom: 'passe_ouverte' },
    { c: 'dit', texte: "Le capitaine s'effondre. Son manteau se vide d'un coup : il n'y avait plus que de la brume dedans." },
    { c: 'dit', qui: M, portrait: 'mira', texte: 'Il était creux… vraiment creux. C’est ça que le Roi Pâle fait aux gens ?' },
    { c: 'dit', qui: B, portrait: 'brann', texte: "J'ai la clé. La chaîne de la Passe est ouverte. Nell, on arrive." },
    { c: 'sauve' },
  ],
  // ---------- Phare ----------
  kraken: [
    { c: 'secousse' },
    { c: 'dit', texte: 'Le corail tremble. Des tentacules gris, gros comme des mâts, se déroulent autour du Phare.' },
    { c: 'dit', qui: 'Nell', portrait: 'nell', texte: 'Brann ?! BRANN ! Attention, il est juste sous vos pieds !' },
    { c: 'dit', qui: B, portrait: 'brann', texte: 'Tiens bon, Nell ! On s’occupe de ta pieuvre !' },
    { c: 'dit', qui: M, portrait: 'mira', texte: 'Il est fait de brume et d’eau. Le feu, la terre et la lumière devraient le briser !' },
    { c: 'combat', groupe: ['kraken_brume'] },
    { c: 'flag', nom: 'kraken_vaincu' },
    { c: 'dit', texte: 'Le Kraken se délite en une pluie grise qui retombe dans la mer de nuages.' },
    { c: 'sauve' },
  ],
  nell: [
    { c: 'si', cond: ['fanal2_allume'], alors: [{ c: 'appel', evenement: 'fin_acte2' }], sinon: [
      { c: 'dit', qui: 'Nell', portrait: 'nell', texte: "Grand frère ! Et… des inconnus avec une lanterne qui brille ? Ne me dites pas que…" },
      { c: 'dit', qui: A, portrait: 'ael', texte: 'La flamme de Clairval. Elle peut rallumer ton Fanal.' },
      { c: 'dit', qui: 'Nell', portrait: 'nell', texte: 'Alors vite, avant qu’il ne reste plus rien. Montez avec moi !' },
      { c: 'flash', couleur: '#fff3c4' },
      { c: 'son', id: 'fanal' },
      { c: 'flag', nom: 'fanal2_allume' },
      { c: 'donne', objet: 'eclat_recif', silencieux: true },
      { c: 'secousse' },
      { c: 'dit', texte: 'Les deux flammes se touchent. Le Phare des Récifs s’embrase et sa lumière balaie la mer de nuages jusqu’à l’horizon.' },
      { c: 'quete', id: 'q_recifs', etat: 'terminee' },
      { c: 'appel', evenement: 'fin_acte2' },
    ] },
  ],
  fanal_recifs: [
    { c: 'si', cond: ['fanal2_allume'], alors: [{ c: 'dit', texte: 'Le Phare des Récifs brille de toutes ses forces.' }], sinon: [{ c: 'dit', texte: 'La flamme du Phare est presque morte.' }] },
  ],
  fin_acte2: [
    { c: 'si', cond: ['acte2_fini'], alors: [
      { c: 'dit', qui: 'Nell', portrait: 'nell', texte: 'La suite de votre route vous attend. Le Moineau peut vous porter vers les Sables d’Ambre dès qu’ils seront prêts.' },
    ], sinon: [
      { c: 'dit', qui: '???', portrait: 'roi', texte: '« Deux… Tu es têtu, petit voilier. Mais les Sables d’Ambre sont à moi depuis bien longtemps. Viens donc t’y perdre. »' },
      { c: 'dit', qui: 'Nell', portrait: 'nell', texte: 'Les Sables d’Ambre… L’île du désert, au sud. Son Fanal est éteint depuis une semaine. Je l’ai vu mourir d’ici.' },
      { c: 'dit', qui: B, portrait: 'brann', texte: 'Alors on y va. Nell, garde le Phare. Cette fois, je ne reste pas derrière une chaîne.' },
      { c: 'titre', texte: 'Fin de l’Acte II', sous: 'Deux Fanaux brillent sur Aérys' },
      { c: 'flag', nom: 'acte2_fini' },
      { c: 'sauve' },
      { c: 'fin', texte: "L'Acte III, « Les Sables d'Ambre », arrive bientôt. Ta sauvegarde t'attendra : continue d'explorer, termine les quêtes secondaires et renforce ton équipe." },
    ] },
  ],
};
