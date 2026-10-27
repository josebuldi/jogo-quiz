// ============================================================
// app.js — quiz com menu de matérias
// ============================================================

const CONFIG = {
  tempoPorPergunta: 30,       // segundos
  pontosPorAcerto: 10,        // pontos
  quantidadePorPartida: 10    // perguntas por partida
};

// Para adicionar uma matéria nova:
// 1) crie o arquivo em data/ (ex.: esportes.json)
// 2) adicione uma linha aqui embaixo
const MATERIAS = [
  { nome: 'Tabuada',   icone: '✖️', tipo: 'gerada' },
  { nome: 'Ciências',  icone: '🔬', arquivo: 'ciencias.json' },
  { nome: 'Português', icone: '📚', arquivo: 'portugues.json' },
  { nome: 'História',  icone: '🏛️', arquivo: 'historia.json' },
  { nome: 'Geografia', icone: '🌍', arquivo: 'geografia.json' },
  { nome: 'Inglês',    icone: '🔤', arquivo: 'ingles.json' }
];

let perguntas = [];
let indiceAtual = 0;
let pontos = 0;
let timer = null;
let tempoRestante = 0;
let respostaCorretaTexto = '';
let materiaAtual = null;

const elementos = {
  telaInicio: document.getElementById('tela-inicio'),
  telaTabuada: document.getElementById('tela-tabuada'),
  telaPergunta: document.getElementById('tela-pergunta'),
  telaResultado: document.getElementById('tela-resultado'),
  menuMaterias: document.getElementById('menu-materias'),
  gradeNumeros: document.getElementById('grade-numeros'),
  botaoVoltarInicio: document.getElementById('botao-voltar-inicio'),
  botaoJogarNovamente: document.getElementById('botao-jogar-novamente'),
  botaoTrocarMateria: document.getElementById('botao-trocar-materia'),
  infoPergunta: document.getElementById('info-pergunta'),
  infoPontos: document.getElementById('info-pontos'),
  barraTempo: document.getElementById('barra-tempo'),
  chipCategoria: document.getElementById('chip-categoria'),
  textoPergunta: document.getElementById('texto-pergunta'),
  listaAlternativas: document.getElementById('alternativas'),
  feedback: document.getElementById('feedback'),
  pontuacaoFinal: document.getElementById('pontuacao-final'),
  recordeFinal: document.getElementById('recorde-final'),
  mensagemFinal: document.getElementById('mensagem-final')
};

function mostrarTela(tela) {
  [elementos.telaInicio, elementos.telaTabuada, elementos.telaPergunta, elementos.telaResultado]
    .forEach(t => t.classList.add('escondida'));
  tela.classList.remove('escondida');
}

function voltarAoInicio() {
  montarMenuMaterias();
  montarGradeNumeros();
  mostrarTela(elementos.telaInicio);
}

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// ----- MENUS -----
function montarMenuMaterias() {
  elementos.menuMaterias.innerHTML = '';
  MATERIAS.forEach(materia => {
    const botao = document.createElement('button');
    botao.className = 'botao-materia';
    botao.innerHTML =
      `${materia.icone} ${materia.nome}` +
      `<br><small class="recorde-mini">🏆 ${Storage.carregarRecorde(materia.nome)} pts</small>`;
    botao.addEventListener('click', () => selecionarMateria(materia));
    elementos.menuMaterias.appendChild(botao);
  });
}

function montarGradeNumeros() {
  elementos.gradeNumeros.innerHTML = '';
  for (let numero = 2; numero <= 10; numero++) {
    const chave = `Tabuada do ${numero}`;
    const botao = document.createElement('button');
    botao.className = 'botao-materia botao-numero';
    botao.innerHTML = `${numero}<br><small class="recorde-mini">🏆 ${Storage.carregarRecorde(chave)} pts</small>`;
    botao.addEventListener('click', () => jogarTabuada(numero));
    elementos.gradeNumeros.appendChild(botao);
  }
}

// ----- TABUADA (perguntas geradas na hora) -----
function gerarPerguntasTabuada(numero) {
  const lista = [];
  for (let i = 1; i <= 10; i++) {
    const resposta = numero * i;
    const candidatas = [
      resposta + numero, resposta - numero,
      resposta + 1, resposta - 1,
      resposta + 10, resposta - 10
    ];
    const erros = [...new Set(candidatas)]
      .filter(valor => valor > 0 && valor !== resposta)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const alternativas = embaralhar([resposta, ...erros]);
    lista.push({
      pergunta: `Quanto é ${numero} × ${i}?`,
      alternativas: alternativas.map(String),
      correta: alternativas.indexOf(resposta),
      categoria: `Tabuada do ${numero}`
    });
  }
  return lista;
}

function jogarTabuada(numero) {
  materiaAtual = { nome: `Tabuada do ${numero}`, icone: '✖️', tipo: 'gerada', numero: numero };
  iniciarPartida(gerarPerguntasTabuada(numero));
}

// ----- CARREGAR ARQUIVO -----
async function carregarArquivo(caminho) {
  const resposta = await fetch(`${caminho}?v=${Date.now()}`);
  if (!resposta.ok) throw new Error('Falha ao carregar ' + caminho);
  return resposta.json();
}

// ----- FLUXO -----
async function selecionarMateria(materia) {
  materiaAtual = materia;
  if (materia.tipo === 'gerada') {
    mostrarTela(elementos.telaTabuada);
    return;
  }
  try {
    const dados = await carregarArquivo(`data/${materia.arquivo}`);
    if (!Array.isArray(dados) || dados.length === 0) throw new Error('arquivo vazio');
    iniciarPartida(embaralhar(dados).slice(0, CONFIG.quantidadePorPartida));
  } catch (erro) {
    alert(`Não consegui carregar ${materia.arquivo}. Confira se o arquivo existe em data/ e se o JSON é válido (teste em jsonlint.com).`);
  }
}

function iniciarPartida(sorteadas) {
  perguntas = sorteadas;
  indiceAtual = 0;
  pontos = 0;
  mostrarTela(elementos.telaPergunta);
  mostrarPergunta();
}

function mostrarPergunta() {
  const atual = perguntas[indiceAtual];
  respostaCorretaTexto = atual.alternativas[atual.correta];

  elementos.infoPergunta.textContent = `Pergunta ${indiceAtual + 1} de ${perguntas.length}`;
  elementos.infoPontos.textContent = `⭐ ${pontos} pontos`;
  elementos.chipCategoria.textContent = atual.categoria || materiaAtual.nome;
  elementos.textoPergunta.textContent = atual.pergunta;
  elementos.feedback.textContent = '';
  elementos.feedback.className = 'feedback';

  const alternativas = embaralhar(
    atual.alternativas.map((texto, indice) => ({
      texto: texto,
      correta: indice === atual.correta
    }))
  );

  elementos.listaAlternativas.innerHTML = '';
  alternativas.forEach(opcao => {
    const botao = document.createElement('button');
    botao.className = 'alternativa';
    botao.textContent = opcao.texto;
    botao.addEventListener('click', () => responder(botao, opcao.correta));
    elementos.listaAlternativas.appendChild(botao);
  });

  iniciarTimer();
}

// ----- CRONÔMETRO -----
function iniciarTimer() {
  pararTimer();
  tempoRestante = CONFIG.tempoPorPergunta;
  atualizarBarraTempo();

  timer = setInterval(() => {
    tempoRestante--;
    atualizarBarraTempo();
    if (tempoRestante <= 0) {
      pararTimer();
      responder(null, false);
    }
  }, 1000);
}

function pararTimer() {
  if (timer) clearInterval(timer);
  timer = null;
}

function atualizarBarraTempo() {
  const percentual = (tempoRestante / CONFIG.tempoPorPergunta) * 100;
  elementos.barraTempo.style.width = percentual + '%';
  elementos.barraTempo.style.background =
    tempoRestante <= 5 ? '#d94040' : (tempoRestante <= 10 ? '#ffa726' : '#4caf50');
}

// ----- RESPOSTA -----
function responder(botaoClicado, acertou) {
  pararTimer();

  if (acertou) { Sons.acerto(); } else { Sons.erro(); }

  elementos.listaAlternativas.querySelectorAll('button').forEach(b => {
    b.disabled = true;
    if (b.textContent === respostaCorretaTexto) b.classList.add('correta');
  });

  if (acertou) {
    pontos += CONFIG.pontosPorAcerto;
    elementos.infoPontos.textContent = `⭐ ${pontos} pontos`;
    elementos.feedback.textContent = `✅ Acertou! +${CONFIG.pontosPorAcerto} pontos`;
    elementos.feedback.classList.add('acerto');
  } else {
    if (botaoClicado) botaoClicado.classList.add('errada');
    elementos.feedback.textContent = `❌ Errou! A resposta certa era: ${respostaCorretaTexto}`;
    elementos.feedback.classList.add('erro');
  }

  setTimeout(() => {
    indiceAtual++;
    if (indiceAtual < perguntas.length) {
      mostrarPergunta();
    } else {
      finalizarJogo();
    }
  }, 1600);
}

// ----- RESULTADO -----
function finalizarJogo() {
  const novoRecorde = Storage.salvarRecorde(materiaAtual.nome, pontos);
   if (novoRecorde) { Sons.recorde(); }

   
  elementos.pontuacaoFinal.textContent = `${pontos} pontos`;
  elementos.recordeFinal.textContent = novoRecorde
    ? `🏆 Novo recorde de ${materiaAtual.nome}! 🎉`
    : `🏆 Recorde de ${materiaAtual.nome}: ${Storage.carregarRecorde(materiaAtual.nome)} pontos`;

  const total = perguntas.length;
  const acertos = pontos / CONFIG.pontosPorAcerto;

  if (acertos === total) {
    elementos.mensagemFinal.textContent = 'PERFEITO! Você acertou todas! 🌟';
  } else if (acertos >= total * 0.7) {
    elementos.mensagemFinal.textContent = 'Muito bem! Você é craque! 👏';
  } else if (acertos >= total * 0.4) {
    elementos.mensagemFinal.textContent = 'Boa! Continue treinando! 💪';
  } else {
    elementos.mensagemFinal.textContent = 'Não desista! Tente de novo! 😉';
  }

  mostrarTela(elementos.telaResultado);
}

async function jogarDeNovo() {
  if (materiaAtual.tipo === 'gerada') {
    iniciarPartida(gerarPerguntasTabuada(materiaAtual.numero));
    return;
  }
  try {
    const dados = await carregarArquivo(`data/${materiaAtual.arquivo}`);
    iniciarPartida(embaralhar(dados).slice(0, CONFIG.quantidadePorPartida));
  } catch (erro) {
    alert('Não consegui recarregar as perguntas.');
  }
}

// ----- INÍCIO -----
montarMenuMaterias();
montarGradeNumeros();
elementos.botaoVoltarInicio.addEventListener('click', voltarAoInicio);
elementos.botaoTrocarMateria.addEventListener('click', voltarAoInicio);
elementos.botaoJogarNovamente.addEventListener('click', jogarDeNovo);