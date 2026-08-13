"use strict";

/* ============================================================
   🏀 BASKET JOURNEY
   Career / Story Engine
   ============================================================ */

const SAVE_KEY = "basketball_journey_save_v3";

let game = null;
let selectedStyle = "scoreur";


/* ============================================================
   OUTILS
   ============================================================ */

const $ = id => document.getElementById(id);

const clamp = (value, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value));

const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = array =>
  array[Math.floor(Math.random() * array.length)];

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}


/* ============================================================
   CLUBS
   ============================================================ */

const CLUBS = {

  1: [
    "ASVEL Espoirs",
    "Cholet Basket",
    "Nanterre 92",
    "JL Bourg",
    "Le Mans",
    "Dijon",
    "Strasbourg"
  ],

  2: [
    "Limoges CSP",
    "ASVEL",
    "Paris Basketball",
    "Monaco",
    "Valencia Basket",
    "Virtus Bologna",
    "Fenerbahçe"
  ],

  3: [
    "Real Madrid",
    "FC Barcelona",
    "Olympiacos",
    "Panathinaïkos",
    "Fenerbahçe",
    "Partizan"
  ],

  4: [
    "Boston Celtics",
    "Los Angeles Lakers",
    "Golden State",
    "Milwaukee Bucks",
    "Denver Nuggets",
    "New York Knicks"
  ]

};


/* ============================================================
   STYLES DE JOUEUR
   ============================================================ */

const STYLES = {

  scoreur: {
    name: "Scoreur",
    shoot: 8,
    pass: 1,
    defense: 0,
    phys: 2,
    mental: 2
  },

  createur: {
    name: "Créateur",
    shoot: 2,
    pass: 8,
    defense: 1,
    phys: 0,
    mental: 3
  },

  defenseur: {
    name: "Défenseur",
    shoot: 0,
    pass: 2,
    defense: 9,
    phys: 4,
    mental: 3
  },

  interieur: {
    name: "Intérieur",
    shoot: 1,
    pass: 1,
    defense: 6,
    phys: 9,
    mental: 2
  }

};


/* ============================================================
   ECRANS
   ============================================================ */

function showScreen(id) {

  document
    .querySelectorAll(".screen")
    .forEach(screen => {
      screen.classList.remove("active");
    });

  $(id).classList.add("active");
}


/* ============================================================
   NOTIFICATIONS
   ============================================================ */

function notify(message) {

  const toast = $("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(notify.timer);

  notify.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}


/* ============================================================
   SAUVEGARDE
   ============================================================ */

function saveGame(showMessage = true) {

  if (!game) return;

  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify(game)
  );

  if (showMessage) {
    notify("💾 Carrière sauvegardée");
  }
}


function loadGame() {

  try {

    const saved =
      localStorage.getItem(SAVE_KEY);

    if (!saved) return false;

    game = JSON.parse(saved);

    return true;

  } catch (error) {

    console.error(error);

    return false;
  }
}


/* ============================================================
   HISTORIQUE
   ============================================================ */

function addHistory(text) {

  if (!game.history) {
    game.history = [];
  }

  game.history.unshift(text);

  if (game.history.length > 100) {
    game.history.pop();
  }
}


/* ============================================================
   TROPHÉES
   ============================================================ */

function addTrophy(name) {

  if (!game.trophies.includes(name)) {
    game.trophies.push(name);
  }

  addHistory(`🏆 ${name}`);
}


/* ============================================================
   NOTE GENERALE
   ============================================================ */

function getOverall() {

  if (!game) return 0;

  const s = game.skills;

  const result =
    42 +
    s.shoot * 0.25 +
    s.pass * 0.18 +
    s.defense * 0.22 +
    s.phys * 0.18 +
    s.mental * 0.17;

  return clamp(Math.round(result), 40, 99);
}


/* ============================================================
   CLUB ACTUEL
   ============================================================ */

function getClub() {
  return game.club;
}


function chooseClub(level) {

  const list =
    CLUBS[Math.min(level, 4)];

  return pick(list);
}


/* ============================================================
   CREATION
   ============================================================ */

function createGame() {

  const style =
    STYLES[selectedStyle];

  const first =
    $("firstName").value.trim() || "Alex";

  const last =
    $("lastName").value.trim() || "Martin";

  const age =
    Number($("age").value);

  const position =
    $("position").value;

  const height =
    $("height").value;

  const country =
    $("country").value.trim() || "France";

  game = {

    first,
    last,

    age,
    position,
    height,
    country,

    style: style.name,

    styleKey: selectedStyle,

    season: 1,

    year: new Date().getFullYear(),

    match: 0,

    club: chooseClub(1),

    clubLevel: 1,

    salary: 900,

    morale: 72,

    form: 82,

    reputation: 8,

    popularity: 5,

    injured: false,

    injuryMatches: 0,

    nationalTeam: false,

    nationalCaps: 0,

    nationalPoints: 0,

    skills: {

      shoot: 45 + style.shoot,

      pass: 45 + style.pass,

      defense: 45 + style.defense,

      phys: 45 + style.phys,

      mental: 45 + style.mental

    },

    stats: {

      games: 0,

      points: 0,

      rebounds: 0,

      assists: 0,

      steals: 0,

      blocks: 0,

      wins: 0,

      losses: 0

    },

    trophies: [],

    history: [],

    seasons: [],

    clubs: [],

    retired: false

  };


  game.clubs.push(game.club);

  addHistory(
    `🌱 Débuts professionnels avec ${game.club}.`
  );

  addHistory(
    `🏀 Tu signes ton premier contrat professionnel.`
  );


  saveGame(false);

  showScreen("screen-career");

  updateUI();

  generateEvent();
}


/* ============================================================
   INTERFACE
   ============================================================ */

function updateUI() {

  if (!game) return;


  $("seasonLabel").textContent =
    `Saison ${game.season} • ${game.year}`;


  $("clubPill").textContent =
    game.club.toUpperCase();


  $("playerName").textContent =
    `${game.first} ${game.last}`;


  $("playerMeta").textContent =
    `${game.age} ans • ${game.position} • ` +
    `${game.height} • ${game.country} • ${game.style}`;


  $("overall").textContent =
    getOverall();


  $("form").textContent =
    game.form;


  $("morale").textContent =
    game.morale;


  $("reputation").textContent =
    game.reputation;


  $("salary").textContent =
    game.salary.toLocaleString("fr-FR") + " €";


  $("formBar").style.width =
    game.form + "%";


  $("moraleBar").style.width =
    game.morale + "%";


  $("repBar").style.width =
    game.reputation + "%";


  $("games").textContent =
    game.stats.games;


  $("points").textContent =
    game.stats.points;


  $("rebounds").textContent =
    game.stats.rebounds;


  $("assists").textContent =
    game.stats.assists;


  $("steals").textContent =
    game.stats.steals;


  $("blocks").textContent =
    game.stats.blocks;


  $("seasonProgress").textContent =
    `${game.match + 1}/10`;


  $("progressText").textContent =
    `S${game.season}`;


  $("nextMatch").textContent =
    `Match ${game.match + 1} — ${game.club}`;


  if (game.injured) {

    $("matchInfo").textContent =
      `🩹 Blessure : encore ${game.injuryMatches} match(s) avant ton retour.`;

  } else {

    $("matchInfo").textContent =
      game.match >= 7
        ? "🔥 La fin de saison approche. Chaque match compte."
        : "Continue à gagner ta place dans la rotation.";

  }


  renderTrophies();

  renderHistory();
}


/* ============================================================
   TROPHÉES
   ============================================================ */

function renderTrophies() {

  if (!game.trophies.length) {

    $("trophies").textContent =
      "Aucun trophée";

    return;
  }


  $("trophies").innerHTML =
    game.trophies
      .map(t => `🏆 ${escapeHTML(t)}`)
      .join("<br>");
}


/* ============================================================
   HISTORIQUE
   ============================================================ */

function renderHistory() {

  if (!game.history.length) {

    $("history").textContent =
      "Début de carrière...";

    return;
  }


  $("history").innerHTML =
    game.history
      .map(item =>
        `<div>${escapeHTML(item)}</div>`
      )
      .join("");
}


/* ============================================================
   EVENEMENTS
   ============================================================ */

const EVENTS = [

  {
    tag: "ENTRAÎNEMENT",

    title: "Le coach te surveille",

    text:
      "Le coach pense que tu peux progresser rapidement. " +
      "Il te demande de choisir comment tu veux travailler.",

    choices: [

      {
        text: "🔥 Travailler deux fois plus",

        effects: {
          form: 4,
          morale: 2,
          mental: 4,
          story:
            "Tu arrives très tôt à l'entraînement et travailles sans relâche."
        }
      },

      {
        text: "⚖️ Trouver un meilleur équilibre",

        effects: {
          form: 2,
          morale: 5,
          mental: 2,
          story:
            "Tu apprends à gérer ton énergie et ta récupération."
        }
      },

      {
        text: "😴 Faire le minimum",

        effects: {
          form: -5,
          morale: -2,
          mental: -3,
          story:
            "Ton manque d'investissement commence à se remarquer."
        }
      }

    ]

  },


  {
    tag: "CONFIANCE",

    title: "Une mauvaise série",

    text:
      "Tu viens de rater plusieurs tirs importants. " +
      "Les critiques commencent à apparaître.",

    choices: [

      {
        text: "🎯 Continuer à shooter",

        effects: {
          shoot: 4,
          morale: 4,
          form: 2,
          story:
            "Tu refuses de douter et travailles ton tir."
        }
      },

      {
        text: "🧠 Jouer plus simplement",

        effects: {
          pass: 3,
          morale: 1,
          shoot: -1,
          story:
            "Tu adaptes ton jeu et privilégies les bonnes décisions."
        }
      },

      {
        text: "😡 T'énerver contre les critiques",

        effects: {
          morale: -7,
          reputation: -2,
          mental: -3,
          story:
            "Ta réaction fait parler et ton image en prend un coup."
        }
      }

    ]

  },


  {
    tag: "MÉDIAS",

    title: "Une interview",

    text:
      "Après une belle performance, un journaliste te demande " +
      "si tu te vois devenir une star.",

    choices: [

      {
        text: "⭐ « Je veux devenir le meilleur »",

        effects: {
          reputation: 5,
          popularity: 5,
          morale: 3,
          mental: 2,
          story:
            "Ton ambition impressionne les médias."
        }
      },

      {
        text: "🤝 « Je pense d'abord à l'équipe »",

        effects: {
          reputation: 3,
          popularity: 2,
          morale: 4,
          pass: 2,
          story:
            "Ton humilité plaît au vestiaire."
        }
      },

      {
        text: "💢 Critiquer ton coach",

        effects: {
          reputation: -5,
          morale: -4,
          mental: -3,
          story:
            "Ta déclaration crée une tension avec ton entraîneur."
        }
      }

    ]

  },


  {
    tag: "VESTIAIRE",

    title: "Un coéquipier a besoin d'aide",

    text:
      "Un jeune joueur de ton équipe traverse une mauvaise période " +
      "et vient te demander conseil.",

    choices: [

      {
        text: "🤝 Le soutenir",

        effects: {
          morale: 5,
          reputation: 2,
          pass: 2,
          mental: 2,
          story:
            "Tu deviens un vrai leader dans le vestiaire."
        }
      },

      {
        text: "🏀 Lui proposer de travailler ensemble",

        effects: {
          form: 2,
          pass: 3,
          morale: 3,
          story:
            "Vous progressez ensemble à l'entraînement."
        }
      },

      {
        text: "🚶 Ignorer le problème",

        effects: {
          morale: -4,
          reputation: -1,
          story:
            "Tu préfères rester concentré uniquement sur ta carrière."
        }
      }

    ]

  },


  {
    tag: "AGENT",

    title: "Ton agent appelle",

    text:
      "Tes performances commencent à attirer l'attention " +
      "d'autres clubs.",

    choices: [

      {
        text: "💼 Écouter les offres",

        effects: {
          reputation: 3,
          morale: 1,
          story:
            "Ton agent commence à sonder le marché."
        }
      },

      {
        text: "🏠 Rester fidèle à ton club",

        effects: {
          morale: 6,
          mental: 2,
          story:
            "Tu confirmes ton attachement à ton équipe."
        }
      }

    ]

  },


  {
    tag: "RÉSEAUX",

    title: "Ton nombre d'abonnés explose",

    text:
      "Une vidéo de tes meilleures actions devient virale.",

    choices: [

      {
        text: "📱 Profiter de la visibilité",

        effects: {
          popularity: 10,
          reputation: 4,
          morale: 2,
          story:
            "Ta popularité explose sur les réseaux."
        }
      },

      {
        text: "🏀 Rester concentré sur le basket",

        effects: {
          popularity: 2,
          mental: 4,
          form: 3,
          story:
            "Tu refuses de laisser les réseaux perturber ta carrière."
        }
      }

    ]

  },


  {
    tag: "DISCIPLINE",

    title: "Une soirée avant un match",

    text:
      "Tes amis organisent une grosse soirée la veille d'un match important.",

    choices: [

      {
        text: "🏠 Rentrer tôt",

        effects: {
          form: 5,
          mental: 3,
          story:
            "Tu fais passer ta carrière avant la fête."
        }
      },

      {
        text: "🎉 Faire la fête",

        effects: {
          morale: 5,
          form: -8,
          mental: -2,
          story:
            "Tu profites de la soirée, mais ton corps le ressent."
        }
      }

    ]

  }

];


/* ============================================================
   GENERER EVENEMENT
   ============================================================ */

function generateEvent() {

  if (!game || game.retired) return;


  const event =
    pick(EVENTS);


  $("eventTag").textContent =
    event.tag;


  $("eventTitle").textContent =
    event.title;


  $("eventText").textContent =
    event.text;


  $("choices").innerHTML =
    event.choices
      .map((choice, index) => {

        return `
          <button
            class="choice"
            data-choice="${index}">
            ${escapeHTML(choice.text)}
          </button>
        `;

      })
      .join("");


  document
    .querySelectorAll(".choice")
    .forEach(button => {

      button.onclick = () => {

        const index =
          Number(button.dataset.choice);

        applyChoice(
          event.choices[index]
        );

      };

    });

}


/* ============================================================
   CHOIX
   ============================================================ */

function applyChoice(choice) {

  const effects =
    choice.effects;


  Object.entries(effects)
    .forEach(([key, value]) => {

      if (key === "story") {

        addHistory(
          `🧠 ${value}`
        );

        return;
      }


      if (
        key === "shoot" ||
        key === "pass" ||
        key === "defense" ||
        key === "phys" ||
        key === "mental"
      ) {

        game.skills[key] =
          clamp(
            game.skills[key] + value,
            1,
            99
          );

        return;
      }


      if (
        key === "form" ||
        key === "morale" ||
        key === "reputation" ||
        key === "popularity"
      ) {

        game[key] =
          clamp(
            game[key] + value
          );

      }

    });


  notify("🧠 Choix enregistré");

  updateUI();

  saveGame(false);

  setTimeout(
    generateEvent,
    400
  );
}


/* ============================================================
   MATCH
   ============================================================ */

function playMatch() {

  if (!game || game.retired) return;


  if (game.injured) {

    notify(
      "🩹 Tu es encore blessé."
    );

    return;
  }


  const rating =
    getOverall();


  const performance =
    rating +
    random(-12, 12) +
    (game.form - 70) * .18 +
    (game.morale - 60) * .12;


  const opponentStrength =
    random(55, 92);


  const win =
    performance > opponentStrength;


  let points =
    Math.round(
      rating / 5 +
      random(-4, 8)
    );


  let rebounds =
    Math.round(
      game.skills.phys / 14 +
      random(-2, 4)
    );


  let assists =
    Math.round(
      game.skills.pass / 17 +
      random(-1, 3)
    );


  let steals =
    Math.max(
      0,
      Math.round(
        game.skills.defense / 30 +
        random(0, 1)
      )
    );


  let blocks =
    game.position === "Pivot"
      ? Math.max(
          0,
          Math.round(
            game.skills.defense / 27 +
            random(0, 1)
          )
        )
      : Math.max(0, random(0, 1));


  points =
    Math.max(3, points);

  rebounds =
    Math.max(1, rebounds);

  assists =
    Math.max(0, assists);


  /* =========================
     STATISTIQUES
  ========================= */

  game.stats.games++;

  game.stats.points +=
    points;

  game.stats.rebounds +=
    rebounds;

  game.stats.assists +=
    assists;

  game.stats.steals +=
    steals;

  game.stats.blocks +=
    blocks;


  if (win) {

    game.stats.wins++;

    game.morale =
      clamp(
        game.morale + random(2, 6)
      );

    game.form =
      clamp(
        game.form + random(1, 5)
      );

    game.reputation =
      clamp(
        game.reputation + random(1, 3)
      );

    game.popularity =
      clamp(
        game.popularity + random(0, 2)
      );

  } else {

    game.stats.losses++;

    game.morale =
      clamp(
        game.morale + random(-5, 0)
      );

    game.form =
      clamp(
        game.form + random(-6, 1)
      );

  }


  addHistory(
    `${win ? "🟢 Victoire" : "🔴 Défaite"} — ` +
    `${points} pts • ${rebounds} reb • ` +
    `${assists} passes`
  );


  /* =========================
     EVENEMENT BLESSURE
  ========================= */

  const injuryChance =
    game.form < 35
      ? 0.14
      : 0.045;


  if (
    Math.random() < injuryChance
  ) {

    game.injured = true;

    game.injuryMatches =
      random(1, 4);

    addHistory(
      `🩹 Blessure — absence prévue de ` +
      `${game.injuryMatches} match(s).`
    );

  }


  game.match++;


  notify(
    `${win ? "🏆 Victoire !" : "💥 Défaite"} ` +
    `• ${points} points`
  );


  if (
    game.match >= 10
  ) {

    finishSeason(win);

  } else {

    updateUI();

    setTimeout(
      generateEvent,
      350
    );

  }


  saveGame(false);
}


/* ============================================================
   FIN DE SAISON
