"use strict";
document.addEventListener("DOMContentLoaded",()=>{

const $=id=>document.getElementById(id);
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const cap=n=>Math.max(0,Math.min(100,n));
const KEY="basketball_journey_save_v5";

let game=null,style="scoreur";

const ST={
 scoreur:["Scoreur",10,2,1,3,3],
 createur:["Créateur",4,10,2,2,4],
 defenseur:["Défenseur",2,3,11,6,4],
 interieur:["Intérieur",3,2,8,11,3]
};

const CLUBS={
 1:["Cholet Basket","JL Bourg","Le Mans","Dijon","Strasbourg","Nanterre 92","Limoges CSP"],
 2:["ASVEL","Paris Basketball","Monaco","Valencia Basket","Virtus Bologna","Fenerbahçe","Partizan"],
 3:["Real Madrid","FC Barcelona","Olympiacos","Panathinaïkos","Maccabi Tel Aviv"],
 4:["Boston Celtics","Los Angeles Lakers","Golden State Warriors","Denver Nuggets","Milwaukee Bucks","New York Knicks"]
};

const EVENTS=[
["ENTRAÎNEMENT","Le coach te demande plus.",[
["🔥 Travailler énormément",{form:5,morale:2,shoot:2,mental:2},"Tu fais une séance supplémentaire."],
["⚖️ Travailler intelligemment",{form:3,morale:4,mental:3},"Tu privilégies la qualité."],
["😴 Ne rien faire",{form:-7,morale:-3,mental:-3},"Le coach remarque ton manque d'implication."]
]],
["VESTIAIRE","Un jeune coéquipier doute.",[
["🤝 Le soutenir",{morale:5,reputation:3,pass:2},"Tu prends le temps de l'aider."],
["🏀 T'entraîner avec lui",{form:3,pass:3,morale:3},"Vous progressez ensemble."],
["🚶 L'ignorer",{morale:-5,reputation:-2},"Tu restes concentré sur toi."]
]],
["MÉDIAS","Un journaliste te demande si tu peux devenir une star.",[
["⭐ Assumer tes ambitions",{reputation:5,popularity:6,morale:3,mental:2},"Tu annonces vouloir atteindre le sommet."],
["🤝 Mettre l'équipe en avant",{reputation:3,morale:4,pass:2},"Ton humilité plaît au vestiaire."],
["💢 Critiquer le coach",{reputation:-6,morale:-5,mental:-3},"Tes propos provoquent une polémique."]
]],
["DISCIPLINE","Tes amis veulent sortir avant un gros match.",[
["🏠 Rentrer tôt",{form:6,mental:3},"Tu fais passer le basket avant la fête."],
["🎉 Faire la fête",{morale:6,form:-9,mental:-2},"Tu arrives fatigué au match."]
]],
["AGENT","Ton agent t'appelle : des clubs te suivent.",[
["💼 Écouter le marché",{reputation:3,morale:2},"Ton agent étudie les possibilités."],
["❤️ Rester fidèle",{morale:6,mental:2},"Tu confirmes ton attachement au club."]
]],
["RÉSEAUX","Une vidéo de tes actions devient virale.",[
["📱 Profiter de la popularité",{popularity:10,reputation:4,morale:3},"Ta popularité augmente fortement."],
["🏀 Ignorer les réseaux",{popularity:1,mental:5,form:3},"Tu restes concentré sur le terrain."]
]]
];

function screen(id){
 document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));
 const e=$(id);if(e)e.classList.add("active");
}

function toast(t){
 const e=$("toast");if(!e)return;
 e.textContent=t;e.classList.add("show");
 clearTimeout(e._t);
 e._t=setTimeout(()=>e.classList.remove("show"),2200);
}

function save(){
 if(!game)return;
 try{localStorage.setItem(KEY,JSON.stringify(game));}catch(e){}
}

function load(){
 try{
  const x=localStorage.getItem(KEY);
  if(!x)return false;
  game=JSON.parse(x);return true;
 }catch(e){return false}
}

function add(text){
 if(!game.history)game.history=[];
 game.history.unshift(text);
 if(game.history.length>80)game.history.pop();
}

function overall(){
 let s=game.skills;
 return Math.max(40,Math.min(99,Math.round(
  38+s.shoot*.22+s.pass*.17+s.defense*.22+s.phys*.21+s.mental*.18
 )));
}

function club(level){
 return pick(CLUBS[Math.min(level,4)]);
}

function create(){
 let s=ST[style];

 game={
  first:$("firstName").value.trim()||"Alex",
  last:$("lastName").value.trim()||"Martin",
  age:Number($("age").value)||18,
  position:$("position").value||"Meneur",
  height:$("height").value||"1m88",
  country:$("country").value.trim()||"France",
  style:s[0],styleKey:style,
  season:1,year:2026,match:0,
  club:club(1),clubLevel:1,salary:900,
  form:82,morale:72,reputation:8,popularity:3,
  injured:false,injuryMatches:0,nationalTeam:false,nationalCaps:0,
  skills:{shoot:45+s[1],pass:45+s[2],defense:45+s[3],phys:45+s[4],mental:45+s[5]},
  stats:{games:0,points:0,rebounds:0,assists:0,steals:0,blocks:0,wins:0,losses:0},
  trophies:[],history:[],clubs:[],seasons:[],retired:false
 };

 game.clubs.push(game.club);
 add("🌱 Débuts professionnels avec "+game.club+".");
 add("🏀 Premier contrat professionnel signé.");
 save();screen("screen-career");update();event();
 toast("🏀 Bienvenue chez "+game.club+" !");
}

function update(){
 if(!game)return;

 $("seasonLabel").textContent="Saison "+game.season+" • "+game.year;
 $("clubPill").textContent=game.club.toUpperCase();
 $("playerName").textContent=game.first+" "+game.last;
 $("playerMeta").textContent=game.age+" ans • "+game.position+" • "+game.height+" • "+game.country+" • "+game.style;
 $("overall").textContent=overall();
 $("form").textContent=game.form;
 $("morale").textContent=game.morale;
 $("reputation").textContent=game.reputation;
 $("salary").textContent=game.salary.toLocaleString("fr-FR")+" €";

 $("formBar").style.width=game.form+"%";
 $("moraleBar").style.width=game.morale+"%";
 $("repBar").style.width=game.reputation+"%";

 $("games").textContent=game.stats.games;
 $("points").textContent=game.stats.points;
 $("rebounds").textContent=game.stats.rebounds;
 $("assists").textContent=game.stats.assists;
 $("steals").textContent=game.stats.steals;
 $("blocks").textContent=game.stats.blocks;

 $("seasonProgress").textContent=(game.match+1)+"/10";
 $("progressText").textContent="S"+game.season;
 $("nextMatch").textContent="Match "+(game.match+1)+" — "+game.club;

 $("matchInfo").textContent=game.injured
 ? "🩹 Blessé — encore "+game.injuryMatches+" match(s) d'absence."
 : "Prends ta place sur le parquet et fais la différence.";

 $("history").innerHTML=game.history.length
 ? game.history.map(x=>"<div>"+x+"</div>").join("")
 : "Début de carrière...";

 $("trophies").innerHTML=game.trophies.length
 ? game.trophies.map(x=>"🏆 "+x).join("<br>")
 : "Aucun trophée";
}

function event(){
 if(!game||game.retired)return;

 let e=pick(EVENTS);
 $("eventTag").textContent=e[0];
 $("eventTitle").textContent=e[1];
 $("eventText").textContent="Choisis ta réaction.";

 $("choices").innerHTML=e[2].map((c,i)=>
  '<button class="choice" data-i="'+i+'" type="button">'+c[0]+"</button>"
 ).join("");

 document.querySelectorAll(".choice").forEach(b=>{
  b.onclick=()=>{
   let c=e[2][Number(b.dataset.i)];
   apply(c[1]);add("🧠 "+c[2]);save();update();toast("🧠 Ton choix a des conséquences");
  };
 });
}

function apply(e){
 Object.keys(e).forEach(k=>{
  if(["shoot","pass","defense","phys","mental"].includes(k))
   game.skills[k]=Math.max(1,Math.min(99,game.skills[k]+e[k]));
  else if(["form","morale","reputation","popularity"].includes(k))
   game[k]=cap(game[k]+e[k]);
 });
}

function match(){
 if(!game)return;

 if(game.injured){
  toast("🩹 Tu ne peux pas jouer blessé.");
  return;
 }

 let r=overall();
 let performance=r+rnd(-12,12)+(game.form-70)*.2+(game.morale-60)*.12;
 let win=performance>=rnd(58,94);

 let pts=Math.max(2,Math.round(r/5+rnd(-3,9)));
 let reb=Math.max(0,Math.round(game.skills.phys/15+rnd(0,4)));
 let ast=Math.max(0,Math.round(game.skills.pass/16+rnd(0,3)));
 let st=Math.max(0,Math.round(game.skills.defense/32+rnd(0,1)));
 let bl=game.position==="Pivot"?rnd(0,3):rnd(0,1);

 game.stats.games++;
 game.stats.points+=pts;
 game.stats.rebounds+=reb;
 game.stats.assists+=ast;
 game.stats.steals+=st;
 game.stats.blocks+=bl;

 if(win){
  game.stats.wins++;
  game.morale=cap(game.morale+rnd(2,6));
  game.form=cap(game.form+rnd(1,4));
  game.reputation=cap(game.reputation+rnd(1,3));
 }else{
  game.stats.losses++;
  game.morale=cap(game.morale-rnd(1,5));
  game.form=cap(game.form-rnd(1,5));
 }

 add((win?"🟢 Victoire":"🔴 Défaite")+" — "+pts+" pts, "+reb+" reb, "+ast+" ast.");

 if(Math.random()<(game.form<35?.14:.035)){
  game.injured=true;
  game.injuryMatches=rnd(1,3);
  add("🩹 Blessure : "+game.injuryMatches+" match(s) d'absence.");
 }

 game.match++;
 save();

 toast((win?"🏆 Victoire":"💥 Défaite")+" — "+pts+" points");

 if(game.match>=10)season();
 else{update();setTimeout(event,300);}
}

function trophy(x){
 if(!game.trophies.includes(x)){
  game.trophies.push(x);
  add("🏆 "+x);
 }
}

function season(){
 let g=Math.max(1,game.stats.games);
 let avg=game.stats.points/g;
 let wins=game.stats.wins;
 let r=overall();

 if(wins>=7&&Math.random()<.75)trophy("Champion — Saison "+game.season);
 if(avg>=20&&r>=78)trophy("Meilleur scoreur — Saison "+game.season);
 if(game.stats.assists/g>=6&&game.skills.pass>=75)trophy("Meilleur passeur — Saison "+game.season);
 if(r>=88&&avg>=18)trophy("MVP — Saison "+game.season);

 game.seasons.push({
  season:game.season,year:game.year,club:game.club,
  overall:r,average:Number(avg.toFixed(1)),wins:wins
 });

 add("📅 Saison "+game.season+" terminée — "+avg.toFixed(1)+" points/match.");

 game.season++;
 game.year++;
 game.age++;
 game.match=0;

 ["shoot","pass","defense","phys","mental"].forEach(k=>{
  game.skills[k]=Math.min(99,game.skills[k]+rnd(1,4));
 });

 game.form=cap(game.form+rnd(4,10));
 game.morale=cap(game.morale+rnd(3,8));
 game.salary=Math.round(game.salary*(1.08+rnd(0,15)/100));

 game.injured=false;
 game.injuryMatches=0;

 if(overall()>=76&&!game.nationalTeam){
  game.nationalTeam=true;
  game.nationalCaps=rnd(2,5);
  add("🇫🇷 Première sélection en équipe nationale !");
 }else if(game.nationalTeam){
  game.nationalCaps+=rnd(2,7);
 }

 transfer();

 if(game.age>=35){
  retire();
  return;
 }

 save();update();event();
 toast("📅 Nouvelle saison !");
}

function transfer(){
 let r=overall(),chance=.1;
 if(r>=70)chance+=.15;
 if(r>=78)chance+=.2;
 if(r>=85)chance+=.25;
 if(game.reputation>=60)chance+=.15;

 if(Math.random()>chance){
  add("✍️ Tu restes à "+game.club+".");
  return;
 }

 let level=game.clubLevel;
 if(r>=72)level=Math.max(level,2);
 if(r>=80)level=Math.max(level,3);
 if(r>=88)level=Math.max(level,4);

 let old=game.club,n=club(level);
 if(n===old)return;

 game.club=n;
 game.clubLevel=level;
 game.salary=Math.round(game.salary*(1.3+rnd(0,90)/100));

 if(!game.clubs.includes(n))game.clubs.push(n);

 game.reputation=cap(game.reputation+4);
 game.morale=cap(game.morale+5);

 add("🔄 TRANSFERT — "+old+" → "+n+".");
}

function story(avg){
 let s=game.first+" "+game.last+" commence sa carrière professionnelle à "+game.clubs[0]+". ";
 s+="Saison après saison, ses performances lui permettent de progresser et de découvrir de nouveaux clubs. ";
 s+="Son parcours l'a mené par "+game.clubs.join(" → ")+". ";
 s+="Au total, il dispute "+game.stats.games+" matchs, inscrit "+game.stats.points+" points, prend "+game.stats.rebounds+" rebonds et délivre "+game.stats.assists+" passes. ";
 s+="Il termine avec une note de "+overall()+"/99 et une moyenne de "+avg.toFixed(1)+" points par match. ";
 if(game.trophies.length)s+="Son palmarès compte "+game.trophies.length+" trophée"+(game.trophies.length>1?"s":"")+". ";
 if(game.nationalTeam)s+="Il porte également le maillot national à "+game.nationalCaps+" reprises. ";
 s+="À "+game.age+" ans, il décide finalement de mettre un terme à sa carrière.";
 return s;
}

function retire(){
 game.retired=true;

 let g=Math.max(1,game.stats.games);
 let avg=game.stats.points/g;

 $("endTitle").textContent=game.trophies.length>=8
 ?"👑 Une véritable légende."
 :game.trophies.length>=4
 ?"🏆 Une carrière exceptionnelle."
 :game.trophies.length
 ?"⭐ Une très belle carrière."
 :"🏀 Une carrière unique.";

 $("endStory").textContent=story(avg);

 let data=[
 ["NOTE FINALE",overall()],
 ["MATCHS",game.stats.games],
 ["POINTS / MATCH",avg.toFixed(1)],
 ["TROPHÉES",game.trophies.length],
 ["CLUBS",game.clubs.length],
 ["SÉLECTIONS",game.nationalCaps]
 ];

 $("endStats").innerHTML=data.map(x=>
 '<div class="info-card"><b>'+x[0]+"</b><span>"+x[1]+"</span></div>"
 ).join("");

 save();
 screen("screen-career-end");
}

async function share(){
 if(!game)return;

 let avg=game.stats.games?game.stats.points/game.stats.games:0;

 let text=
`🏀 BASKET JOURNEY

👤 ${game.first} ${game.last}
🎂 ${game.age} ans
🏀 ${game.position}
📏 ${game.height}
🔥 Style : ${game.style}

📖 MA CARRIÈRE

${story(avg)}

📊 STATISTIQUES

Matchs : ${game.stats.games}
Points : ${game.stats.points}
Points/match : ${avg.toFixed(1)}
Rebonds : ${game.stats.rebounds}
Passes : ${game.stats.assists}
Interceptions : ${game.stats.steals}
Contres : ${game.stats.blocks}

🏆 PALMARÈS

${game.trophies.length?game.trophies.map(x=>"🏆 "+x).join("\n"):"Aucun trophée"}

🏟️ CLUBS

${game.clubs.join(" → ")}

⭐ NOTE FINALE

${overall()}/99

🇫🇷 SÉLECTIONS

${game.nationalCaps}`;

 $("shareText").value=text;
 $("shareText").classList.remove("hidden");

 try{
  await navigator.clipboard.writeText(text);
  toast("📋 Carrière copiée !");
 }catch(e){
  $("shareText").select();
  toast("📖 Résumé généré !");
 }
}

$("newCareer").onclick=()=>screen("screen-create");

$("continueCareer").onclick=()=>{
 if(!load()){
  toast("Aucune carrière sauvegardée.");
  return;
 }
 if(game.retired){
  let avg=game.stats.games?game.stats.points/game.stats.games:0;
  $("endStory").textContent=story(avg);
  screen("screen-career-end");
 }else{
  screen("screen-career");
  update();
  event();
 }
};

$("createPlayer").onclick=create;
$("playMatch").onclick=match;
$("saveBtn").onclick=()=>{
 save();toast("💾 Carrière sauvegardée");
};
$("shareBtn").onclick=share;

$("restartBtn").onclick=()=>{
 localStorage.removeItem(KEY);
 game=null;
 screen("screen-create");
};

document.querySelectorAll("#styleChoices button").forEach(b=>{
 b.onclick=()=>{
  document.querySelectorAll("#styleChoices button").forEach(x=>x.classList.remove("selected"));
  b.classList.add("selected");
  style=b.dataset.style;
 };
});

if(load()){
 $("continueCareer").classList.remove("hidden");
 if(game.retired)$("continueCareer").textContent="🏆 Voir ma carrière";
}

let first=document.querySelector('#styleChoices [data-style="scoreur"]');
if(first)first.classList.add("selected");

});
