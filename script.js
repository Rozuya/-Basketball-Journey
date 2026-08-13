"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const SAVE_KEY = "basketball_journey_save_v4";

  let game = null;
  let selectedStyle = "scoreur";

  const $ = id => document.getElementById(id);

  const clamp = (n, min = 0, max = 100) =>
    Math.max(min, Math.min(max, n));

  const random = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const pick = arr =>
    arr[Math.floor(Math.random() * arr.length)];


  /* ========================================================
     CLUBS
  ======================================================== */

  const CLUBS = {

    1: [
      "Cholet Basket",
      "JL Bourg",
      "Le Mans",
      "Dijon",
      "Strasbourg",
      "Nanterre 92",
      "Limoges CSP"
    ],

    2: [
      "ASVEL",
      "Paris Basketball",
      "Monaco",
      "Valencia Basket",
      "Virtus Bologna",
      "Fenerbahçe",
      "Partizan"
    ],

    3: [
      "Real Madrid",
      "FC Barcelona",
      "Olympiacos",
      "Panathinaïkos",
      "Fenerbahçe",
      "Maccabi Tel Aviv"
    ],

    4: [
      "Boston Celtics",
      "Los Angeles Lakers",
      "Golden State Warriors",
      "Denver Nuggets",
      "Milwaukee Bucks",
      "New York Knicks"
    ]

  };


  /* ========================================================
     STYLES
  ======================================================== */

  const STYLES = {

    scoreur: {
      name: "Scoreur",
      shoot: 10,
      pass: 2,
      defense: 1,
      phys: 3,
      mental: 3
    },

    createur: {
      name: "Créateur",
      shoot: 4,
      pass: 10,
      defense: 2,
      phys: 2,
      mental: 4
    },

    defenseur: {
      name: "Défenseur",
      shoot: 2,
      pass: 3,
      defense: 11,
      phys: 6,
      mental: 4
    },

    interieur: {
      name: "Intérieur",
      shoot: 3,
      pass: 2,
      defense: 8,
      phys: 11,
      mental: 3
    }

  };


  /* ========================================================
     AFFICHAGE
  ======================================================== */

  function showScreen(id) {

    document
      .querySelectorAll(".screen")
      .forEach(screen => {
        screen.classList.remove("active");
      });

    const screen = $(id);

    if (screen) {
      screen.classList.add("active");
    }
  }


  /* ========================================================
     NOTIFICATION
  ======================================================== */

  function notify(text) {

    const toast = $("toast");

    if (!toast) return;

    toast.textContent = text;
    toast.classList.add("show");

    clearTimeout(toast.timer);

    toast.timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }


  /* ========================================================
     SAUVEGARDE
  ======================================================== */

  function saveGame(show = true) {

    if (!game) return;

    try {

      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(game)
      );

      if (show) {
        notify("💾 Carrière sauvegardée");
      }

    } catch (error) {

      console.error(error);
      notify("Impossible de sauvegarder");

    }
  }


  function loadGame() {

    try {

      const data =
        localStorage.getItem(SAVE_KEY);

      if (!data) return false;

      game = JSON.parse(data);

      return true;

    } catch (error) {

      console.error(error);

      localStorage.removeItem(SAVE_KEY);

      return false;
    }
  }


  /* ========================================================
     HISTORIQUE
  ======================================================== */

  function addHistory(text) {

    if (!game.history) {
      game.history = [];
    }

    game.history.unshift(text);

    if (game.history.length > 80) {
      game.history.pop();
    }
  }


  /* ========================================================
     NOTE
  ======================================================== */

  function overall() {

    const s = game.skills;

    return clamp(
      Math.round(
        38 +
        s.shoot * .22 +
        s.pass * .17 +
        s.defense * .22 +
        s.phys * .21 +
        s.mental * .18
      ),
      40,
      99
    );
  }


  /* ========================================================
     CLUB
  ======================================================== */

  function getClub(level) {

    const list =
      CLUBS[Math.min(level, 4)];

    return pick(list);
  }


  /* ========================================================
     CREATION DU JOUEUR
  ======================================================== */

  function createPlayer() {

    const first =
      $("firstName").value.trim() || "Alex";

    const last =
      $("lastName").value.trim() || "Martin";

    const age =
      Number($("age").value) || 18;

    const position =
      $("position").value || "Meneur";

    const height =
      $("height").value || "1m88";

    const country =
      $("country").value.trim() || "France";

    const style =
      STYLES[selectedStyle];


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
      year: 2026,
      match: 0,

      club: getClub(1),
      clubLevel: 1,

      salary: 900,

      form: 82,
      morale: 72,
      reputation: 8,
      popularity: 3,

      injured: false,
      injuryMatches: 0,

      nationalTeam: false,
      nationalCaps: 0,

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
      clubs: [],
      seasons: [],

      retired: false

    };


    game.clubs.push(game.club);


    addHistory(
      `🌱 Débuts professionnels avec ${game.club}.`
    );

    addHistory(
      `🏀 Premier contrat professionnel signé.`
    );


    saveGame(false);

    showScreen("screen-career");

    updateUI();

    generateEvent();

    notify(
      `🏀 Bienvenue chez ${game.club} !`
    );
  }


  /* ========================================================
     INTERFACE
  ======================================================== */

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
      `${game.height} • ${game.country} • ` +
      `${game.style}`;


    $("overall").textContent =
      overall();


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
        `🩹 Blessé — encore ` +
        `${game.injuryMatches} match(s) d'absence.`;

    } else {

      $("matchInfo").textContent =
        "Prends ta place sur le parquet et fais la différence.";

    }


    renderHistory();
    renderTrophies();
  }


  /* ========================================================
     HISTORIQUE
  ======================================================== */

  function renderHistory() {

    const element = $("history");

    if (!element) return;

    if (!game.history.length) {

      element.textContent =
        "Début de carrière...";

      return;
    }


    element.innerHTML =
      game.history
        .map(item =>
          `<div>${item}</div>`
        )
        .join("");
  }


  /* ========================================================
     TROPHÉES
  ======================================================== */

  function renderTrophies() {

    const element =
      $("trophies");

    if (!element) return;


    if (!game.trophies.length) {

      element.textContent =
        "Aucun trophée";

      return;
    }


    element.innerHTML =
      game.trophies
        .map(t =>
          `🏆 ${t}`
        )
        .join("<br>");
  }


  function addTrophy(name) {

    if (!game.trophies.includes(name)) {

      game.trophies.push(name);

      addHistory(
        `🏆 ${name}`
      );

    }
  }


  /* ========================================================
     EVENEMENTS
  ======================================================== */

  const EVENTS = [

    {
      tag: "ENTRAÎNEMENT",

      title: "Le coach te demande plus",

      text:
        "Tu dois choisir comment préparer le prochain match.",

      choices: [

        {
          text: "🔥 Travailler énormément",

          effects: {
            form: 5,
            morale: 2,
            shoot: 2,
            mental: 2,

            story:
              "Tu fais une séance supplémentaire."
          }
        },

        {
          text: "⚖️ Travailler intelligemment",

          effects: {
            form: 3,
            morale: 4,
            mental: 3,

            story:
              "Tu privilégies la qualité à la quantité."
          }
        },

        {
          text: "😴 Ne pas faire d'effort",

          effects: {
            form: -7,
            morale: -3,
            mental: -3,

            story:
              "Le coach remarque ton manque d'implication."
          }
        }

      ]
    },


    {
      tag: "VESTIAIRE",

      title: "Un coéquipier doute",

      text:
        "Un jeune joueur vient te demander conseil.",

      choices: [

        {
          text: "🤝 Le soutenir",

          effects: {
            morale: 5,
            reputation: 3,
            pass: 2,

            story:
              "Tu prends le temps de l'aider."
          }
        },

        {
          text: "🏀 T'entraîner avec lui",

          effects: {
            form: 3,
            pass: 3,
            morale: 3,

            story:
              "Vous progressez ensemble."
          }
        },

        {
          text: "🚶 L'ignorer",

          effects: {
            morale: -5,
            reputation: -2,

            story:
              "Tu préfères rester concentré sur toi."
          }
        }

      ]
    },


    {
      tag: "MÉDIAS",

      title: "Une interview après ton match",

      text:
        "Un journaliste te demande si tu peux devenir une star.",

      choices: [

        {
          text: "⭐ Assumer tes ambitions",

          effects: {
            reputation: 5,
            popularity: 6,
            morale: 3,
            mental: 2,

            story:
              "Tu annonces vouloir atteindre le sommet."
          }
        },

        {
          text: "🤝 Mettre l'équipe en avant",

          effects: {
            reputation: 3,
            morale: 4,
            pass: 2,

            story:
              "Ton humilité plaît au vestiaire."
          }
        },

        {
          text: "💢 Critiquer ton coach",

          effects: {
            reputation: -6,
            morale: -5,
            mental: -3,

            story:
              "Tes propos provoquent une polémique."
          }
        }

      ]
    },


    {
      tag: "DISCIPLINE",

      title: "Une soirée avant un gros match",

      text:
        "Tes amis veulent sortir la veille d'une rencontre importante.",

      choices: [

        {
          text: "🏠 Rentrer tôt",

          effects: {
            form: 6,
            mental: 3,

            story:
              "Tu fais passer le basket avant la fête."
          }
        },

        {
          text: "🎉 Faire la fête",

          effects: {
            morale: 6,
            form: -9,
            mental: -2,

            story:
              "Tu profites de la soirée mais arrives fatigué."
          }
        }

      ]
    },


    {
      tag: "AGENT",

      title: "Ton agent t'appelle",

      text:
        "Plusieurs clubs commencent à suivre tes performances.",

      choices: [

        {
          text: "💼 Écouter le marché",

          effects: {
            reputation: 3,
            morale: 2,

            story:
              "Ton agent commence à étudier les possibilités."
          }
        },

        {
          text: "❤️ Rester fidèle",

          effects: {
            morale: 6,
            mental: 2,

            story:
              "Tu confirmes ton attachement à ton club."
          }
        }

      ]
    },


    {
      tag: "RÉSEAUX",

      title: "Ta vidéo devient virale",

      text:
        "Tes meilleures actions font le tour des réseaux sociaux.",

      choices: [

        {
          text: "📱 Profiter de la popularité",

          effects: {
            popularity: 10,
            reputation: 4,
            morale: 3,

            story:
              "Ta popularité augmente fortement."
          }
        },

        {
          text: "🏀 Ignorer les réseaux",

          effects: {
            popularity: 1,
            mental: 5,
            form: 3,

            story:
              "Tu préfères rester concentré sur le terrain."
          }
        }

      ]
    }

  ];


  /* ========================================================
     GENERER EVENEMENT
  ======================================================== */

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
              ${choice.text}
            </button>
          `;

        })
        .join("");


    document
      .querySelectorAll(".choice")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const index =
              Number(button.dataset.choice);

            applyChoice(
              event.choices[index]
            );

          }
        );

      });
  }


  /* ========================================================
     CHOIX
  ======================================================== */

  function applyChoice(choice) {

    const effects =
      choice.effects;


    Object.keys(effects)
      .forEach(key => {

        const value =
          effects[key];


        if (key === "story") {

          addHistory(
            `🧠 ${value}`
          );

          return;
        }


        if (
          ["shoot",
           "pass",
           "defense",
           "phys",
           "mental"].includes(key)
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
          ["form",
           "morale",
           "reputation",
           "popularity"].includes(key)
        ) {

          game[key] =
            clamp(
              game[key] + value
            );

        }

      });


    updateUI();

    saveGame(false);

    notify("🧠 Ton choix a des conséquences");
  }


  /* ========================================================
     MATCH
  ======================================================== */

  function playMatch() {

    if (!game) return;


    if (game.injured) {

      notify(
        "🩹 Tu ne peux pas jouer blessé."
      );

      return;
    }


    const rating =
      overall();


    const performance =
      rating +
      random(-12, 12) +
      (game.form - 70) * .2 +
      (game.morale - 60) * .12;


    const opponent =
      random(58, 94);


    const win =
      performance >= opponent;


    let points =
      Math.round(
        rating / 5 +
        random(-3, 9)
      );


    let rebounds =
      Math.round(
        game.skills.phys / 15 +
        random(0, 4)
      );


    let assists =
      Math.round(
        game.skills.pass / 16 +
        random(0, 3)
      );


    let steals =
      Math.max(
        0,
        Math.round(
          game.skills.defense / 32 +
          random(0, 1)
        )
      );


    let blocks =
      game.position === "Pivot"
        ? random(0, 3)
        : random(0, 1);


    points =
      Math.max(2, points);

    rebounds =
      Math.max(0, rebounds);

    assists =
      Math.max(0, assists);


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
          game.form + random(1, 4)
        );

      game.reputation =
        clamp(
          game.reputation + random(1, 3)
        );

    } else {

      game.stats.losses++;

      game.morale =
        clamp(
          game.morale - random(1, 5)
        );

      game.form =
        clamp(
          game.form - random(1, 5)
        );

    }


    addHistory(
      `${win ? "🟢 Victoire" : "🔴 Défaite"} — ` +
      `${points} pts, ` +
      `${rebounds} reb, ` +
      `${assists} ast.`
    );


    /*
      Blessure
    */

    if (
      Math.random() <
      (game.form < 35 ? .14 : .035)
    ) {

      game.injured = true;

      game.injuryMatches =
        random(1, 3);

      addHistory(
        `🩹 Blessure : ` +
        `${game.injuryMatches} match(s) d'absence.`
      );

    }


    game.match++;


    notify(
      `${win ? "🏆 Victoire" : "💥 Défaite"} — ${points} points`
    );


    if (game.match >= 10) {

      finishSeason();

    } else {

      updateUI();

      setTimeout(
        generateEvent,
        300
      );

    }


    saveGame(false);
  }


  /* ========================================================
     FIN DE SAISON
  ======================================================== */

  function finishSeason() {

    const games =
      Math.max(
        1,
        game.stats.games
      );


    const average =
      game.stats.points /
      games;


    const wins =
      game.stats.wins;


    const rating =
      overall();


    let champion =
      false;


    if (
      wins >= 7 &&
      Math.random() < .75
    ) {

      champion = true;

      addTrophy(
        `Champion — Saison ${game.season}`
      );

    }


    if (
      average >= 20 &&
      rating >= 78
    ) {

      addTrophy(
        `Meilleur scoreur — Saison ${game.season}`
      );

    }


    if (
      game.stats.assists / games >= 6 &&
      game.skills.pass >= 75
    ) {

      addTrophy(
        `Meilleur passeur — Saison ${game.season}`
      );

    }


    if (
      rating >
