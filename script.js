"use strict";

/* ============================================================
   🏀 BASKETBALL JOURNEY
   Career / Story Engine
   ============================================================ */

const SAVE_KEY = "basketball_journey_save_v3";

let game = null;
let selectedRegion = null;
let selectedClub = null;


/* ============================================================
   OUTILS
   ============================================================ */

const $ = id => document.getElementById(id);

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
    }, 2500);
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
   RÉGIONS
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
   POSTES
   ============================================================ */

const POSITIONS = [
    "Meneur",
    "Arrière",
    "Ailier",
    "Ailier fort",
    "Pivot"
];


/* ============================================================
   CRÉATION DU JOUEUR
   ============================================================ */

function createPlayer(firstName, lastName, position, region, club) {

    const base = {
        speed: random(62, 68),
        shooting: random(62, 68),
        dribbling: random(62, 68),
        passing: random(62, 68),
        defense: random(61, 67),
        physical: random(64, 70)
    };

    game = {

        version: 3,

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
            potential: random(78, 92),

            money: 0,
            salary: 0,

            stats: base
        },

        career: {

            season: 1,

            month: 9,

            eventNumber: 0,

            currentClub: {
                name: club.name,
                city: club.city,
                region,
                prestige: club.prestige
            },

            clubs: [
                {
                    name: club.name,
                    city: club.city,
                    region,
                    startSeason: 1,
                    endSeason: null
                }
            ],

            role: "Jeune espoir",

            trophies: [],

            injuries: [],

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
                averageRating: 0,
                ratings: []
            },

            relationships: {
                teammate: 50,
                captain: 50,
                agent: 50
            },

            flags: {

                ignoredCoach: 0,
                coachTrust: 0,

                disciplinaryProblems: 0,

                comeback: false,

                injured: false,

                nationalTeam: false,

                captain: false,

                star: false,

                transferInterest: false,

                rivalry: false,

                mediaScandal: false,

                greatSeason: false
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

    overall +=
        (game.player.morale - 50) * 0.04;

    overall +=
        (game.player.form - 50) * 0.025;

    overall +=
        (game.player.confidence - 50) * 0.025;

    return Math.round(
        clamp(overall, 1, 99)
    );
}


/* ============================================================
   PROGRESSION
   ============================================================ */

function improveStat(stat, amount) {

    if (!game.player.stats[stat]) return;

    game.player.stats[stat] =
        clamp(
            game.player.stats[stat] + amount,
            1,
            99
        );
}


function randomImprovement(amount = 1) {

    const stats = Object.keys(game.player.stats);

    for (let i = 0; i < amount; i++) {

        const stat = pick(stats);

        improveStat(
            stat,
            random(1, 2)
        );
    }
}


/* ============================================================
   JAUGES
   ============================================================ */

function updateMeters() {

    if (!game) return;

    /*
       Ces éléments seront utilisés si présents
       dans ton index.
    */

    const ids = {

        "morale-value": game.player.morale,
        "form-value": game.player.form,
        "coach-value": game.player.coachRelation,
        "popularity-value": game.player.popularity,

        "confidence-value": game.player.confidence
    };

    Object.entries(ids).forEach(([id, value]) => {

        const element = $(id);

        if (element) {
            element.textContent =
                Math.round(value);
        }
    });


    const bars = {

        "morale-bar": game.player.morale,
        "form-bar": game.player.form,
        "coach-bar": game.player.coachRelation,
        "popularity-bar": game.player.popularity,

        "confidence-bar": game.player.confidence
    };

    Object.entries(bars).forEach(([id, value]) => {

        const element = $(id);

        if (element) {
            element.style.width =
                `${clamp(value)}%`;
        }
    });
}


/* ============================================================
   RÔLE
   ============================================================ */

function updateRole() {

    const overall = calculateOverall();

    const coach = game.player.coachRelation;

    if (
        overall >= 86 &&
        coach >= 75
    ) {
        game.career.role =
            "⭐ Star de l'équipe";

        game.career.flags.star = true;

        return;
    }

    if (
        overall >= 77 &&
        coach >= 60
    ) {
        game.career.role =
            "🔥 Titulaire";

        return;
    }

    if (
        overall >= 70 &&
        coach >= 45
    ) {
        game.career.role =
            "🟡 Sixième homme";

        return;
    }

    if (coach < 35) {

        game.career.role =
            "🪑 Remplaçant";

        return;
    }

    game.career.role =
        "🟢 Jeune espoir";
}


/* ============================================================
   INTERFACE
   ============================================================ */

function updateCareerInterface() {

    if (!game) return;

    const p = game.player;
    const c = game.career;

    const name =
        `${p.firstName} ${p.lastName}`;

    setText("career-player-name", name);

    setText(
        "career-season",
        `SAISON ${c.season}`
    );

    setText("player-age", p.age);

    setText(
        "player-overall",
        calculateOverall()
    );

    setText(
        "career-club-name",
        c.currentClub.name
    );

    setText(
        "career-club-city",
        `${c.currentClub.city} • ${c.currentClub.region}`
    );

    setText(
        "career-role",
        c.role
    );

    setText("stat-speed", p.stats.speed);
    setText("stat-shooting", p.stats.shooting);
    setText("stat-dribbling", p.stats.dribbling);
    setText("stat-passing", p.stats.passing);
    setText("stat-defense", p.stats.defense);
    setText("stat-physical", p.stats.physical);

    updateMeters();

    updateOptionalCareerStats();
}


function setText(id, value) {

    const element = $(id);

    if (element) {
        element.textContent = value;
    }
}


function updateOptionalCareerStats() {

    if (!game) return;

    const c = game.career;

    setText(
        "season-games",
        c.season.matches
    );

    setText(
        "season-starts",
        c.season.starts
    );

    setText(
        "season-points",
        c.season.points
    );

    setText(
        "season-assists",
        c.season.assists
    );

    setText(
        "season-rebounds",
        c.season.rebounds
    );

    setText(
        "career-games",
        c.matches
    );

    setText(
        "career-points",
        c.totalPoints
    );

    setText(
        "career-assists",
        c.totalAssists
    );

    setText(
        "career-rebounds",
        c.totalRebounds
    );

    setText(
        "career-trophies",
        c.trophies.length
    );
}


/* ============================================================
   RÉGIONS
   ============================================================ */

function renderRegions() {

    const grid = $("region-grid");

    if (!grid) return;

    grid.innerHTML = "";

    Object.entries(REGIONS)
        .forEach(([name, region]) => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "selection-card";

            button.innerHTML = `
                <span class="selection-card-icon">
                    ${region.emoji}
                </span>

                <strong>${name}</strong>

                <small>
                    ${region.clubs.length} clubs
                </small>
            `;

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            "#region-grid .selection-card"
                        )
                        .forEach(card =>
                            card.classList.remove(
                                "selected"
                            )
                        );

                    button.classList.add(
                        "selected"
                    );

                    selectedRegion = name;

                    if ($("region-error")) {
                        $("region-error").textContent =
                            "";
                    }
                }
            );

            grid.appendChild(button);
        });
}


/* ============================================================
   CLUBS
   ============================================================ */

function renderClubs(regionName) {

    const grid = $("clubs-grid");

    if (!grid) return;

    grid.innerHTML = "";

    const region =
        REGIONS[regionName];

    if (!region) return;

    setText(
        "selected-region-label",
        `${region.emoji} ${regionName}`
    );


    region.clubs.forEach(data => {

        const [name, city, prestige] =
            data;

        const club = {
            name,
            city,
            prestige
        };


        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "club-card";

        button.innerHTML = `
            <strong>🏀 ${name}</strong>
            <span>${city}</span>
            <small>
                Prestige ${prestige}/100
            </small>
        `;


        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".club-card"
                    )
                    .forEach(card =>
                        card.classList.remove(
                            "selected"
                        )
                    );

                button.classList.add(
                    "selected"
                );

                selectedClub = club;

                showConfirmation(
                    regionName,
                    club
                );
            }
        );

        grid.appendChild(button);
    });
}


/* ============================================================
   CONFIRMATION
   ============================================================ */

function showConfirmation(
    region,
    club
) {

    setText(
        "summary-name",
        `${$("first-name").value.trim()} ${$("last-name").value.trim()}`
    );

    setText(
        "summary-region",
        region
    );

    setText(
        "summary-city",
        club.city
    );

    setText(
        "summary-club",
        club.name
    );

    showScreen("confirmation");
}


/* ============================================================
   HISTORIQUE
   ============================================================ */

function addHistory(
    type,
    title,
    description,
    extra = {}
) {

    if (!game) return;

    game.career.history.push({

        age: game.player.age,

        season: game.career.season,

        event:
            game.career.eventNumber,

        type,

        title,

        description,

        ...extra
    });
}


/* ============================================================
   APPLICATION DES CONSÉQUENCES
   ============================================================ */

function effects(changes = {}) {

    const p = game.player;

    if (changes.morale)
        p.morale =
            clamp(
                p.morale +
                changes.morale
            );

    if (changes.form)
        p.form =
            clamp(
                p.form +
                changes.form
            );

    if (changes.coach)
        p.coachRelation =
            clamp(
                p.coachRelation +
                changes.coach
            );

    if (changes.popularity)
        p.popularity =
            clamp(
                p.popularity +
                changes.popularity
            );

    if (changes.confidence)
        p.confidence =
            clamp(
                p.confidence +
                changes.confidence
            );

    if (changes.money)
        p.money +=
            changes.money;

    if (changes.stats) {

        Object.entries(
            changes.stats
        ).forEach(
            ([stat, amount]) =>
                improveStat(
                    stat,
                    amount
                )
        );
    }


    /*
       Conséquences secondaires.
    */

    if (p.morale < 30) {

        p.confidence =
            clamp(
                p.confidence - 3
            );

        p.form =
            clamp(
                p.form - 2
            );
    }


    if (p.morale > 85) {

        p.confidence =
            clamp(
                p.confidence + 2
            );
    }


    if (p.form < 25) {

        p.morale =
            clamp(
                p.morale - 2
            );
    }


    if (p.coachRelation < 25) {

        p.confidence =
            clamp(
                p.confidence - 2
            );
    }
}


/* ============================================================
   MOTEUR DES SITUATIONS
   ============================================================ */

const EVENTS = [

/* ------------------------------------------------------------
   COACH
   ------------------------------------------------------------ */

{
    id: "coach_criticism",

    title: "Le coach te reproche ton implication",

    text:
        "Après l'entraînement, ton coach te demande de rester quelques minutes. Il pense que tu pourrais faire beaucoup plus d'efforts.",

    choices: [

        {
            text:
         
