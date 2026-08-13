"use strict";

/* ============================================================
   🏀 BASKETBALL JOURNEY
   MOTEUR COMPLET DE CARRIÈRE
   Compatible avec l'index.html + style.css fournis
============================================================ */

const SAVE_KEY = "basketball_journey_save_v4";

let game = null;
let selectedRegion = null;
let selectedClub = null;


/* ============================================================
   OUTILS
============================================================ */

const $ = id => document.getElementById(id);

function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = value;
}

function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chance(percent) {
    return Math.random() * 100 < percent;
}

function pick(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function signed(value) {
    return value > 0 ? `+${value}` : `${value}`;
}

function toast(message) {
    const element = $("toast");
    if (!element) return;

    element.textContent = message;
    element.hidden = false;

    clearTimeout(toast.timer);

    toast.timer = setTimeout(() => {
        element.hidden = true;
    }, 2800);
}


/* ============================================================
   ÉCRANS
============================================================ */

function showScreen(name) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.hidden = true;
        screen.classList.remove("active");
    });

    const target = $(`screen-${name}`);

    if (!target) return;

    target.hidden = false;
    target.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ============================================================
   RÉGIONS / CLUBS
============================================================ */

const REGIONS = {
    "Île-de-France": {
        emoji: "🗼",
        clubs: [
            ["Paris Basket Academy", "Paris", 72],
            ["Cergy Basket", "Cergy", 57],
            ["Nanterre Jeunes", "Nanterre", 65],
            ["Versailles Basket", "Versailles", 55]
        ]
    },

    "Occitanie": {
        emoji: "☀️",
        clubs: [
            ["Montpellier Basket", "Montpellier", 67],
            ["Toulouse Basket", "Toulouse", 64],
            ["Nîmes Basket", "Nîmes", 54],
            ["Perpignan Basket", "Perpignan", 51]
        ]
    },

    "Provence-Alpes-Côte d’Azur": {
        emoji: "🌊",
        clubs: [
            ["Marseille Basket Academy", "Marseille", 68],
            ["Nice Basket", "Nice", 59],
            ["Toulon Basket", "Toulon", 63],
            ["Avignon Basket", "Avignon", 51]
        ]
    },

    "Auvergne-Rhône-Alpes": {
        emoji: "🏔️",
        clubs: [
            ["Lyon Basket Academy", "Lyon", 70],
            ["Grenoble Basket", "Grenoble", 57],
            ["Clermont Basket", "Clermont-Ferrand", 53],
            ["Annecy Basket", "Annecy", 52]
        ]
    },

    "Nouvelle-Aquitaine": {
        emoji: "🌊",
        clubs: [
            ["Bordeaux Basket", "Bordeaux", 65],
            ["Limoges Basket", "Limoges", 67],
            ["Pau Basket", "Pau", 62],
            ["La Rochelle Basket", "La Rochelle", 52]
        ]
    },

    "Hauts-de-France": {
        emoji: "🏀",
        clubs: [
            ["Lille Basket Academy", "Lille", 66],
            ["Amiens Basket", "Amiens", 54],
            ["Dunkerque Basket", "Dunkerque", 52],
            ["Calais Basket", "Calais", 49]
        ]
    },

    "Grand Est": {
        emoji: "⭐",
        clubs: [
            ["Strasbourg Basket Academy", "Strasbourg", 68],
            ["Nancy Basket", "Nancy", 64],
            ["Reims Basket", "Reims", 54],
            ["Metz Basket", "Metz", 51]
        ]
    },

    "Bretagne": {
        emoji: "🌊",
        clubs: [
            ["Rennes Basket", "Rennes", 60],
            ["Brest Basket", "Brest", 52],
            ["Vannes Basket", "Vannes", 49]
        ]
    },

    "Pays de la Loire": {
        emoji: "🏀",
        clubs: [
            ["Nantes Basket Academy", "Nantes", 64],
            ["Le Mans Basket", "Le Mans", 68],
            ["Angers Basket", "Angers", 52]
        ]
    },

    "Normandie": {
        emoji: "🌧️",
        clubs: [
            ["Rouen Basket", "Rouen", 59],
            ["Caen Basket", "Caen", 53],
            ["Le Havre Basket", "Le Havre", 51]
        ]
    },

    "Bourgogne-Franche-Comté": {
        emoji: "🍇",
        clubs: [
            ["Dijon Basket", "Dijon", 63],
            ["Besançon Basket", "Besançon", 51],
            ["Belfort Basket", "Belfort", 48]
        ]
    },

    "Centre-Val de Loire": {
        emoji: "🏀",
        clubs: [
            ["Orléans Basket", "Orléans", 60],
            ["Tours Basket", "Tours", 53],
            ["Bourges Basket", "Bourges", 62]
        ]
    },

    "Corse": {
        emoji: "🏝️",
        clubs: [
            ["Ajaccio Basket", "Ajaccio", 48],
            ["Bastia Basket", "Bastia", 47]
        ]
    }
};


/* ============================================================
   CRÉATION DE LA CARRIÈRE
============================================================ */

function createPlayer(firstName, lastName, position, region, club) {

    const stats = {
        speed: random(62, 68),
        shooting: random(62, 68),
        dribbling: random(62, 68),
        passing: random(62, 68),
        defense: random(61, 67),
        physical: random(64, 70)
    };

    game = {
        version: 4,

        player: {
            firstName,
            lastName,
            position,

            age: 16,

            morale: 75,
            form: 82,
            coachRelation: 60,
            popularity: 8,
            confidence: 65,

            potential: random(80, 94),

            money: 0,
            salary: 0,

            stats
        },

        career: {
            season: 1,
            eventNumber: 0,

            currentClub: {
                name: club.name,
                city: club.city,
                region,
                prestige: club.prestige
            },

            role: "🟢 Jeune espoir",

            clubs: [{
                name: club.name,
                city: club.city,
                region,
                startSeason: 1,
                endSeason: null
            }],

            trophies: [],

            history: [],

            matches: 0,
            starts: 0,

            totalPoints: 0,
            totalAssists: 0,
            totalRebounds: 0,

            season: {
                matches: 0,
                starts: 0,
                points: 0,
                assists: 0,
                rebounds: 0,
                ratings: [],
                averageRating: 0
            },

            relationships: {
                teammate: 50,
                captain: 50,
                agent: 50
            },

            flags: {
                ignoredCoach: 0,
                disciplinaryProblems: 0,
                comeback: false,
                injured: false,
                nationalTeam: false,
                captain: false,
                star: false,
                transferInterest: false,
                rivalry: false,
                mediaScandal: false,
                greatSeason: false,
                champion: false
            }
        }
    };

    calculateOverall();
    saveGame();
}


/* ============================================================
   GÉNÉRAL
============================================================ */

function calculateOverall() {
    if (!game) return 0;

    const s = game.player.stats;

    let overall =
        (
            s.speed +
            s.shooting +
            s.dribbling +
            s.passing +
            s.defense +
            s.physical
        ) / 6;

    overall += (game.player.morale - 50) * 0.04;
    overall += (game.player.form - 50) * 0.025;
    overall += (game.player.confidence - 50) * 0.025;

    return Math.round(clamp(overall, 1, 99));
}


/* ============================================================
   STATS
============================================================ */

function improveStat(stat, amount) {
    if (!game || game.player.stats[stat] === undefined) return;

    game.player.stats[stat] =
        clamp(game.player.stats[stat] + amount, 1, 99);
}

function randomImprovement(count = 1) {
    const stats = Object.keys(game.player.stats);

    for (let i = 0; i < count; i++) {
        improveStat(pick(stats), random(1, 2));
    }
}


/* ============================================================
   JAUGES
============================================================ */

function updateMeters() {
    if (!game) return;

    const values = {
        "player-morale": game.player.morale,
        "player-forme": game.player.form,
        "player-coach": game.player.coachRelation,
        "player-popularity": game.player.popularity
    };

    Object.entries(values).forEach(([id, value]) => {
        setText(id, Math.round(value));
    });

    const bars = {
        "morale-bar": game.player.morale,
        "forme-bar": game.player.form,
        "coach-bar": game.player.coachRelation,
        "popularity-bar": game.player.popularity
    };

    Object.entries(bars).forEach(([id, value]) => {
        const element = $(id);
        if (element) {
            element.style.width = `${clamp(value)}%`;
        }
    });
}


/* ============================================================
   RÔLE
============================================================ */

function updateRole() {
    const overall = calculateOverall();
    const coach = game.player.coachRelation;

    if (overall >= 86 && coach >= 75) {
        game.career.role = "⭐ Star de l'équipe";
        game.career.flags.star = true;
    }
    else if (overall >= 78 && coach >= 60) {
        game.career.role = "🔥 Titulaire";
    }
    else if (overall >= 70 && coach >= 45) {
        game.career.role = "🟡 Sixième homme";
    }
    else if (coach < 35) {
        game.career.role = "🪑 Remplaçant";
    }
    else {
        game.career.role = "🟢 Jeune espoir";
    }
}


/* ============================================================
   INTERFACE CARRIÈRE
============================================================ */

function updateCareerInterface() {
    if (!game) return;

    updateRole();

    const p = game.player;
    const c = game.career;

    setText(
        "career-player-name",
        `${p.firstName} ${p.lastName}`
    );

    setText("career-season", `SAISON ${c.season}`);
    setText("player-age", p.age);
    setText("player-overall", calculateOverall());

    setText("career-club-name", c.currentClub.name);

    setText(
        "career-club-city",
        `${c.currentClub.city} • ${c.currentClub.region}`
    );

    setText(
        "career-club-level",
        `Prestige : ${c.currentClub.prestige}/100`
    );

    setText(
        "career-role",
        `Rôle : ${c.role}`
    );

    setText("stat-speed", p.stats.speed);
    setText("stat-shooting", p.stats.shooting);
    setText("stat-dribbling", p.stats.dribbling);
    setText("stat-passing", p.stats.passing);
    setText("stat-defense", p.stats.defense);
    setText("stat-physical", p.stats.physical);

    updateMeters();

    setText("season-games", c.season.matches);
    setText("season-starts", c.season.starts);
    setText("season-points", c.season.points);
    setText("season-assists", c.season.assists);
    setText("season-rebounds", c.season.rebounds);

    setText("career-clubs-count", c.clubs.length);
    setText("career-trophies-count", c.trophies.length);

    const trophyList = $("career-trophies-list");

    if (trophyList) {
        trophyList.innerHTML = c.trophies.length
            ? c.trophies.map(t => `<p>🏆 ${t}</p>`).join("")
            : "Aucun trophée pour le moment.";
    }

    renderHistory();
}


/* ============================================================
   RÉGIONS
============================================================ */

function renderRegions() {
    const grid = $("region-grid");
    if (!grid) return;

    grid.innerHTML = "";

    Object.entries(REGIONS).forEach(([name, region]) => {

        const card = document.createElement("button");

        card.type = "button";
        card.className = "region-card";

        card.innerHTML = `
            <span class="region-name">
                ${region.emoji} ${name}
            </span>
            <span class="region-type">
                ${region.clubs.length} clubs disponibles
            </span>
        `;

        card.addEventListener("click", () => {

            document
                .querySelectorAll(".region-card")
                .forEach(c => c.classList.remove("selected"));

            card.classList.add("selected");

            selectedRegion = name;

            const error = $("region-error");
            if (error) error.textContent = "";
        });

        grid.appendChild(card);
    });
}


/* ============================================================
   CLUBS
============================================================ */

function renderClubs(regionName) {
    const grid = $("clubs-grid");
    if (!grid) return;

    grid.innerHTML = "";

    const region = REGIONS[regionName];
    if (!region) return;

    setText(
        "selected-region-label",
        `${region.emoji} ${regionName}`
    );

    region.clubs.forEach(([name, city, prestige]) => {

        const card = document.createElement("article");

        card.className = "club-card";

        card.innerHTML = `
            <h3>🏀 ${name}</h3>

            <p class="club-city">
                ${city}
            </p>

            <span class="club-level">
                Prestige ${prestige}/100
            </span>

            <button class="btn btn-primary">
                Choisir ce club
            </button>
        `;

        card.querySelector("button").addEventListener("click", () => {

            selectedClub = {
                name,
                city,
                prestige
            };

            showConfirmation(regionName, selectedClub);
        });

        grid.appendChild(card);
    });
}


/* ============================================================
   CONFIRMATION
============================================================ */

function showConfirmation(region, club) {

    const firstName = $("first-name")?.value.trim() || "";
    const lastName = $("last-name")?.value.trim() || "";
    const position = $("player-position")?.value || "Meneur";

    setText(
        "summary-name",
        `${firstName} ${lastName}`
    );

    setText("summary-position", position);
    setText("summary-region", region);
    setText("summary-city", club.city);
    setText("summary-club", club.name);

    showScreen("confirmation");
}


/* ============================================================
   EFFETS
============================================================ */

function effects(changes = {}) {

    const p = game.player;

    p.morale = clamp(
        p.morale + (changes.morale || 0)
    );

    p.form = clamp(
        p.form + (changes.form || 0)
    );

    p.coachRelation = clamp(
        p.coachRelation + (changes.coach || 0)
    );

    p.popularity = clamp(
        p.popularity + (changes.popularity || 0)
    );

    p.confidence = clamp(
        p.confidence + (changes.confidence || 0)
    );

    p.money += changes.money || 0;

    if (changes.stats) {
        Object.entries(changes.stats).forEach(([stat, amount]) => {
            improveStat(stat, amount);
        });
    }

    if (p.morale < 30) {
        p.confidence = clamp(p.confidence - 3);
        p.form = clamp(p.form - 2);
    }

    if (p.morale > 85) {
        p.confidence = clamp(p.confidence + 2);
    }

    if (p.form < 25) {
        p.morale = clamp(p.morale - 2);
    }

    if (p.coachRelation < 25) {
        p.confidence = clamp(p.confidence - 2);
    }
}


/* ============================================================
   HISTORIQUE
============================================================ */

function addHistory(type, title, description) {
    game.career.history.push({
        age: game.player.age,
        season: game.career.season,
        event: game.career.eventNumber,
        type,
        title,
        description
    });
}

function renderHistory() {
    const log = $("career-log");
    if (!log || !game) return;

    if (!game.career.history.length) {
        log.innerHTML =
            `<p class="muted">Ton histoire commencera ici…</p>`;
        return;
    }

    const recent =
        game.career.history.slice(-12).reverse();

    log.innerHTML = recent.map(item => `
        <div class="history-entry">
            <strong>
                Saison ${item.season} • ${item.title}
            </strong>
            <p class="muted">
                ${item.description}
            </p>
        </div>
    `).join("");
}


/* ============================================================
   SITUATIONS
============================================================ */

const EVENTS = [

    {
        id: "coach_criticism",

        title: "Le coach te met face à tes responsabilités",

        text:
            "Après l'entraînement, ton coach te demande de rester. Il pense que tu as du talent, mais il estime que ton implication n'est pas encore suffisante.",

        choices: [

            {
                text: "Accepter la critique et travailler davantage",

                description:
                    "Tu reconnais tes erreurs et demandes au coach comment progresser.",

                effects: {
                    coach: 6,
                    morale: 3,
                    confidence: 4,
                    form: 2,
                    stats: {
                        defense: 1
                    }
                },

                result:
                    "Le coach apprécie ton attitude. Il décide de te donner davantage de responsabilités."
            },

            {
                text: "Lui répondre que tu mérites déjà ta place",

                description:
                    "Tu défends ton niveau, mais ton ton agace le coach.",

                effects: {
                    coach: -10,
                    morale: -4,
                    confidence: 2,
                    popularity: 2
                },

                result:
                    "Tu assumes ton caractère. Certains coéquipiers aiment ton assurance, mais le coach est clairement contrarié."
            },

            {
                text: "Ignorer ses conseils",

                description:
                    "Tu écoutes à peine et quittes rapidement la salle.",

                effects: {
                    coach: -7,
                    morale: -5,
                    form: -3
                },

                result:
                    "Le coach garde ton comportement en mémoire. Ton temps de jeu pourrait en pâtir."
            }
        ]
    },


    {
        id: "extra_training",

        title: "Une séance supplémentaire",

        text:
            "Ton équipe termine l'entraînement. Tu peux rentrer chez toi ou rester une heure de plus pour travailler ton tir.",

        choices: [

            {
                text: "Rester travailler",

                description:
                    "Tu sacrifies ton temps libre pour progresser.",

                effects: {
                    form: -3,
                    morale: 2,
                    confidence: 3,
                    coach: 4,
                    stats: {
                        shooting: 2
                    }
                },

                result:
                    "Tes efforts commencent à payer. Ton tir 
