
const KEY="re_app_v2";

const defaults={
  firstRun:true,
  goal:null,
  xp:0,
  level:1,
  streak:0,
  completed:{},
  workout:{},
  quiz:{},
  incomeGoal:1000,
  name:"Vanessa"
};

let state = {
  ...defaults,
  ...JSON.parse(localStorage.getItem(KEY) || "{}")
};

state.completed=state.completed||{};
state.workout=state.workout||{};
state.quiz=state.quiz||{};

let screen=state.firstRun?"onboarding";
let quizIndex=0;
let quizAnswered=false;
let selectedQuiz=0;

const exercises=[
  ["Agachamento livre","3 séries · 10–12 reps"],
  ["Flexão de braço","3 séries · 8–12 reps"],
  ["Afundo alternado","3 séries · 10 cada perna"],
  ["Elevação pélvica","3 séries · 12–15 reps"],
  ["Prancha","3 séries · 20–30s"],
  ["Abdominal crunch","3 séries · 15 reps"]
];

const subjects=[
  "Matemática",
  "Português",
  "História",
  "Geografia",
  "Ciências",
  "Inglês",
  "Tecnologia",
  "Conhecimentos Gerais"
];

const quizzes=[
  {
    subject:"Conhecimentos Gerais",
    qs:[
      ["Quem é conhecido como o Rei do Futebol?",
       ["Pelé","Maradona","Messi","Zico"],0],
      ["Qual é a capital do Brasil?",
       ["São Paulo","Brasília","Rio de Janeiro","Salvador"],1],
      ["Quantos dias tem uma semana?",
       ["5","6","7","8"],2]
    ]
  },
  {
    subject:"Matemática",
    qs:[
      ["Quanto é 8 × 7?",
       ["54","56","64","48"],1],
      ["Qual é a metade de 100?",
       ["25","40","50","60"],2],
      ["Quanto é 15 + 9?",
       ["22","24","26","28"],1]
    ]
  },
  {
    subject:"Português",
    qs:[
      ["Qual palavra é um substantivo?",
       ["correr","bonito","casa","rapidamente"],2],
      ["Qual é o plural de animal?",
       ["animales","animais","animalis","animãos"],1],
      ["Qual sinal termina uma pergunta?",
       [".","!",";","?"],3]
    ]
  }
];

function save(){
  localStorage.setItem(KEY,JSON.stringify(state));
}

function xp(n){
  state.xp=Math.max(0,state.xp+n);
  state.level=Math.floor(state.xp/250)+1;
  save();
}

function go(s){
  screen=s;
  quizAnswered=false;
  render();
}

function nav(active){
  return `<nav class="nav">
    ${nb("home","⌂","Início",active)}
    ${nb("physical","💪","Físico",active)}
    ${nb("workout","🏃","Treino",active)}
    ${nb("income","💰","Renda",active)}
    ${nb("studies","📚","Estudos",active)}
  </nav>`;
}

function nb(id,ic,t,a){
  return `<button class="${a===id?"active":""}" onclick="go('${id}')">
    <b>${ic}</b>${t}
  </button>`;
}

function top(sub=""){
  return `<header class="top">
    <div class="brand">Renda <span>&</span> Evolução</div>
    ${sub?`<div class="sub">${sub}</div>`:""}
  </header>`;
}

function layout(body,a){
  document.getElementById("app").innerHTML=
    top("Disciplina hoje, liberdade amanhã.")+
    `<main class="content">${body}</main>`+
    nav(a);
}

function xpCard(){
  let cur=state.xp%250;
  let p=Math.min(100,cur/250*100);

  return `<div class="hero">
    <div class="profile">
      <div class="avatar">🚀</div>
      <div>
        <b>Olá, ${state.name}!</b>
        <div class="muted small">
          Nível ${state.level} · ${state.xp}/
          ${Math.ceil((state.xp+1)/250)*250} XP
        </div>
      </div>
    </div>

    <div class="statrow">
      <span>🔥 ${state.streak} dias</span>
      <span>⭐ ${state.xp} XP</span>
      <span>🏆 ${Object.keys(state.completed).length} conquistas</span>
    </div>

    <div class="xpbar">
      <i style="width:${p}%"></i>
    </div>
  </div>`;
}

function render(){
  if(screen==="onboarding")return onboarding();
  if(screen==="home")return home();
  if(screen==="physical")return physical();
  if(screen==="workout")return workout();
  if(screen==="income")return income();
  if(screen==="studies")return studies();
  if(screen==="quiz")return quiz();
  if(screen==="evolution")return evolution();
  if(screen==="profile")return profile();
  home();
}

function onboarding(){
  document.getElementById("app").innerHTML=`
    <main class="content" style="padding-top:35px">
      <div class="hero" style="text-align:center;padding:28px 20px">
        <div style="font-size:65px">📈</div>
        <h1>RENDA <span style="color:var(--orange)">&</span> EVOLUÇÃO</h1>
        <p class="muted">
          Sua jornada de físico, renda, estudos e hábitos em um só lugar.
        </p>
      </div>

      <h2>Como você quer começar?</h2>

      <button class="choice" onclick="choose('home')">
        🔥 Quero evoluir em tudo
        <small class="muted">Acompanhar todas as áreas</small>
      </button>

      <button class="choice" onclick="choose('physical')">
        💪 Melhorar meu físico
        <small class="muted">Treinos e rotina</small>
      </button>

      <button class="choice" onclick="choose('income')">
        💰 Aprender sobre renda
        <small class="muted">Educação e planejamento</small>
      </button>

      <button class="choice" onclick="choose('evolution')">
        🚀 Criar disciplina
        <small class="muted">Hábitos e organização</small>
      </button>
    </main>`;
}

function choose(g){
  state.firstRun=false;
  state.goal=g;
  save();
  go(g==="home"?"home":g);
}

function home(){
  layout(`
    ${xpCard()}

    <div class="card" style="background:linear-gradient(135deg,#5b2700,#9a4800);border:0">
      <h2 style="margin:0">🚀 Começar meu dia</h2>
      <p>Faça uma ação em cada área e acumule XP.</p>
      <button class="btn" onclick="go('workout')">
        Iniciar rotina
      </button>
    </div>

    <div class="sectionTitle">
      <h2>Seu progresso</h2>
      <button class="back" onclick="go('profile')">
        Perfil ›
      </button>
    </div>

    <div class="grid">
      <div class="card green click" onclick="go('physical')">
        <div class="icon">💪</div>
        <h3>Físico</h3>
        <div class="kpi">62%</div>
        <span class="muted small">hábitos e treino</span>
      </div>

      <div class="card" onclick="go('workout')">
        <div class="icon">🏃</div>
        <h3>Treino</h3>
        <div class="kpi">${Math.round(workoutDone()/6*100)}%</div>
        <span class="muted small">rotina de hoje</span>
      </div>

      <div class="card gold" onclick="go('income')">
        <div class="icon">💰</div>
        <h3>Renda</h3>
        <div class="kpi">38%</div>
        <span class="muted small">aprendizado</span>
      </div>

      <div class="card purple" onclick="go('studies')">
        <div class="icon">📚</div>
        <h3>Estudos</h3>
        <div class="kpi">71%</div>
        <span class="muted small">quizzes</span>
      </div>
    </div>

    <h2>Conquistas recentes</h2>

    <div class="card achievement">
      <div class="medal">⭐</div>
      <div>
        <b>Primeiro passo</b>
        <div class="muted small">
          Complete uma atividade hoje
        </div>
      </div>
    </div>

    <div class="card achievement">
      <div class="medal">🔥</div>
      <div>
        <b>Consistência</b>
        <div class="muted small">
          ${state.streak} dias de sequência
        </div>
      </div>
    </div>
  `,"home");
}

function physical(){
  layout(`
    <button class="back" onclick="go('home')">‹ Voltar</button>
    <h1>💪 Físico</h1>
    <p class="muted">
      Acompanhe hábitos simples e seu treino.
    </p>

    <div class="hero">
      <div class="statrow">
        <b>Progresso geral</b>
        <b>62%</b>
      </div>

      <div class="progress">
        <i style="width:62%"></i>
      </div>
    </div>

    ${habit("💧","Beber 2L de água","agua")}
    ${habit("🌙","Dormir bem","sono")}
    ${habit("🍎","Alimentação equilibrada","alimentacao")}
    ${habit("🧘","Alongamento","alongamento")}

    <button class="btn green block" onclick="go('workout')">
      🏋️ Registrar treino
    </button>
  `,"physical");
}

function habit(ic,t,k){
  let d=!!state.completed["h_"+k];

  return `<div class="card">
    <div class="sectionTitle">
      <div>
        <span class="icon">${ic}</span>
        <b>${t}</b>
      </div>

      <button class="btn ${d?"secondary":""}"
        onclick="toggleHabit('${k}')">
        ${d?"✓":"Concluir +5 XP"}
      </button>
    </div>
  </div>`;
}

function toggleHabit(k){
  let z="h_"+k;

  if(!state.completed[z]){
    state.completed[z]=true;
    xp(5);
    state.streak=Math.max(1,state.streak+1);
  }else{
    state.completed[z]=false;
    xp(-5);
  }

  save();
  physical();
}

function workout(){
  let d=workoutDone();

  layout(`
    <button class="back" onclick="go('home')">
      ‹ Voltar
    </button>

    <h1>🏃 Treino</h1>

    <div class="hero">
      <div class="sectionTitle">
        <b>Treino base</b>
        <b>${d}/6</b>
      </div>

      <p class="muted">
        ~25 min · corpo inteiro
      </p>

      <div class="progress">
        <i style="width:${d/6*100}%"></i>
      </div>
    </div>

    ${exercises.map((x,i)=>`
      <label class="card exercise ${state.workout[i]?"done":""}">
        <input type="checkbox"
          ${state.workout[i]?"checked":""}
          onchange="toggleEx(${i})">

        <span>
          <strong>${x[0]}</strong><br>
          <span class="muted small">${x[1]}</span>
        </span>
      </label>
    `).join("")}

    <button class="btn block" onclick="finishWorkout()">
      ${d===6
        ?"🏆 Finalizar treino +50 XP"
        :"Marque todos os exercícios"}
    </button>
  `,"workout");
}

function workoutDone(){
  return exercises.filter((_,i)=>state.workout[i]).length;
}

function toggleEx(i){
  state.workout[i]=!state.workout[i];
  save();
  workout();
}

function finishWorkout(){
  if(workoutDone()===6 && !state.completed.workout){
    state.completed.workout=true;
    xp(50);
    state.streak=Math.max(1,state.streak+1);
    save();
  }

  workout();
}

function income(){
  let goal=state.incomeGoal||1000;

  layout(`
    <button class="back" onclick="go('home')">
      ‹ Voltar
    </button>

    <h1>💰 Renda</h1>

    <p class="muted">
      Educação financeira e caminhos de monetização.
      Sem promessa de ganhos garantidos.
    </p>

    <div class="notice">
      ⚠️ Desconfie de métodos que prometem dinheiro fácil
      ou ganhos garantidos. Pesquise regras, custos, riscos
      e requisitos antes de usar qualquer plataforma.
    </div>

    <div class="card gold">
      <h2 style="margin-top:0">🎯 Minha meta</h2>
      <div class="kpi">
        R$ ${goal.toLocaleString("pt-BR")}
      </div>

      <p class="muted">
        Meta de referência para planejamento.
      </p>

      <button class="btn" onclick="setGoal()">
        Alterar meta
      </button>
    </div>

    ${mod("📚","Educação financeira",
      "Orçamento, reserva e organização.","fin1")}

    ${mod("🛒","Comissão por venda",
      "Entenda afiliados e comissões.","fin2")}

    ${mod("💻","Serviços digitais",
      "Aprenda a oferecer habilidades online.","fin3")}

    ${mod("📈","Planejamento",
      "Metas, custos e acompanhamento.","fin4")}

    <button class="btn block" onclick="completeIncome()">
      ${state.completed.income
        ?"✓ Módulo concluído"
        :"Concluir módulo +15 XP"}
    </button>
  `,"income");
}

function mod(ic,t,d,k){
  return `<div class="card">
    <div class="icon">${ic}</div>
    <h3>${t}</h3>
    <p class="muted">${d}</p>

    <button class="btn secondary"
      onclick="alert('Conteúdo de ${t} será ampliado na próxima etapa.')">
      Abrir conteúdo ›
    </button>
  </div>`;
}

function setGoal(){
  let n=prompt(
    "Digite sua meta em reais:",
    state.incomeGoal
  );

  if(n && Number(n)>0){
    state.incomeGoal=Number(n);
    save();
    income();
  }
}

function completeIncome(){
  if(!state.completed.income){
    state.completed.income=true;
    xp(15);
  }

  income();
}

function studies(){
  layout(`
    <button class="back" onclick="go('home')">
      ‹ Voltar
    </button>

    <h1>📚 Estudos</h1>

    <p class="muted">
      Pratique, responda quizzes e acumule XP.
    </p>

    <div class="hero">
      <div class="sectionTitle">
        <b>Progresso de estudos</b>
        <b>71%</b>
      </div>

      <div class="progress">
        <i style="width:71%"></i>
      </div>

      <p class="muted">
        Escolha uma matéria.
      </p>
    </div>

    <div class="grid">
      ${subjects.map((s,i)=>`
        <div class="card click"
          onclick="startQuiz(${i})">

          <div class="icon">
            ${["➗","📖","🏛️","🌎","🔬","🇬🇧","💻","🌐"][i]}
          </div>

          <h3>${s}</h3>
          <span class="muted small">
            Quiz · fácil
          </span>
        </div>
      `).join("")}
    </div>
  `,"studies");
}

function startQuiz(i){
  selectedQuiz=Math.min(i,2);
  quizIndex=0;
  quizAnswered=false;
  go("quiz");
}

function quiz(){
  let qs=quizzes[selectedQuiz].qs;
  let q=qs[quizIndex];

  layout(`
    <button class="back" onclick="go('studies')">
      ‹ Voltar
    </button>

    <div class="sectionTitle">
      <h1>Quiz</h1>
      <b>${quizIndex+1}/${qs.length}</b>
    </div>

    <p class="muted">
      ${quizzes[selectedQuiz].subject} · Fácil
    </p>

    <div class="progress">
      <i style="width:${(quizIndex+1)/qs.length*100}%"></i>
    </div>

    <div class="card">
      <div style="font-size:20px;font-weight:850">
        ${q[0]}
      </div>
    </div>

    ${q[1].map((a,i)=>`
      <button class="answer"
        id="a${i}"
        onclick="answer(${i})">
        <b>${String.fromCharCode(65+i)}</b> · ${a}
      </button>
    `).join("")}

    <div id="feedback"></div>
  `,"studies");
}

function answer(i){
  if(quizAnswered)return;

  quizAnswered=true;

  let q=quizzes[selectedQuiz].qs[quizIndex];
  let ok=i===q[2];

  document.querySelectorAll(".answer")
    .forEach((b,j)=>{
      b.disabled=true;

      if(j===q[2])
        b.classList.add("correct");

      if(j===i && !ok)
        b.classList.add("wrong");
    });

  let z=state.quiz[selectedQuiz]||{
    correct:0,
    total:0
  };

  z.total++;

  if(ok){
    z.correct++;
    xp(10);
  }

  state.quiz[selectedQuiz]=z;
  save();

  document.getElementById("feedback").innerHTML=`
    <div class="card ${ok?"green":""}">
      <b>
        ${ok?"✓ Correto!":"✕ Resposta incorreta"}
      </b>

      <p class="muted">
        Resposta: ${q[1][q[2]]}
      </p>

      <button class="btn block" onclick="nextQ()">
        ${quizIndex+1<quizzes[selectedQuiz].qs.length
          ?"Próxima"
          :"Ver resultado"}
      </button>
    </div>`;
}

function nextQ(){
  if(quizIndex+1<quizzes[selectedQuiz].qs.length){
    quizIndex++;
    quizAnswered=false;
    quiz();
  }else{
    let z=state.quiz[selectedQuiz]||{correct:0};

    alert(
      `Quiz concluído! ${z.correct} acertos registrados.`
    );

    go("studies");
  }
}

function evolution(){
  layout(`
    <button class="back" onclick="go('home')">
      ‹ Voltar
    </button>

    <h1>🚀 Evolução</h1>

    <p class="muted">
      Sua central de hábitos, metas e conquistas.
    </p>

    <div class="hero">
      <div class="kpi">${state.level}</div>
      <p class="muted">Nível atual</p>

      <div class="xpbar">
        <i style="width:${(state.xp%250)/250*100}%"></i>
      </div>
    </div>

    ${[
      "Beber água",
      "Estudar 20 minutos",
      "Organizar uma tarefa",
      "Planejar amanhã"
    ].map((x,i)=>`
      <div class="card">
        <b>
          ${["💧","📖","🧹","📝"][i]} ${x}
        </b>

        <p class="muted small">
          Pequeno passo para hoje.
        </p>

        <button class="btn secondary"
          onclick="alert('Meta registrada!')">
          Registrar
        </button>
      </div>
    `).join("")}

    <h2>🏆 Conquistas</h2>

    <div class="card achievement">
      <div class="medal">⭐</div>
      <div>
        <b>Primeiro treino</b>
        <div class="muted small">
          Complete seu primeiro treino
        </div>
      </div>
    </div>

    <div class="card achievement">
      <div class="medal">🔥</div>
      <div>
        <b>Sequência</b>
        <div class="muted small">
          Mantenha sua rotina por vários dias
        </div>
      </div>
    </div>
  `,"home");
}

function profile(){
  layout(`
    <button class="back" onclick="go('home')">
      ‹ Voltar
    </button>

    <h1>⚙️ Perfil</h1>

    <div class="card">
      <div class="profile">
        <div class="avatar">🚀</div>

        <div>
          <b>${state.name}</b>
          <div class="muted">
            Nível ${state.level}
          </div>
        </div>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <span class="muted small">XP</span>
        <div class="kpi">${state.xp}</div>
      </div>

      <div class="card">
        <span class="muted small">Sequência</span>
        <div class="kpi">${state.streak}</div>
      </div>

      <div class="card">
        <span class="muted small">Conquistas</span>
        <div class="kpi">
          ${Object.keys(state.completed).length}
        </div>
      </div>

      <div class="card">
        <span class="muted small">Áreas</span>
        <div class="kpi">4</div>
      </div>
    </div>

    <div class="card">
      <h3>👤 Nome</h3>

      <input
        class="text"
        id="name"
        value="${state.name}">

      <button class="btn" onclick="changeName()">
        Salvar
      </button>
    </div>

    <div class="card">
      <h3>☁️ Sincronização</h3>

      <p class="muted">
        A V2 está preparada visualmente para conta e nuvem.
        Nesta versão de demonstração, os dados continuam no
        armazenamento local do navegador.
      </p>
    </div>

    <button class="btn secondary block"
      onclick="resetApp()">
      Resetar progresso
    </button>
  `,"home");
}

function changeName(){
  let n=document.getElementById("name").value.trim();

  if(n){
    state.name=n;
    save();
    profile();
  }
}

function resetApp(){
  if(confirm("Apagar todo o progresso?")){
    localStorage.removeItem(KEY);
    location.reload();
  }
}

render();
