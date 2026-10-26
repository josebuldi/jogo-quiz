// ============================================================
// app.js — lógica do quiz
// ============================================================

// ----- CONFIGURAÇÃO (mude à vontade) -----
const CONFIG = {
  tempoPorPergunta: 20,
  pontosPorAcerto: 10,
  quantidadePorPartida: 10,
  arquivosDePerguntas: [
    'perguntas-gerais.json',
    'perguntas-matematica.json',
    'perguntas-serie.json'
  ]
};

// ----- ESTADO DO JOGO -----
let perguntas = [];           // perguntas embaralhadas
let indiceAtual = 0;          // índice da pergunta atual
let pontos = 0;               // pontuação da partida
let timer = null;             // controle do cronômetro
let tempoRestante = 0;
let respostaCorretaTexto = '';

// ----- ELEMENTOS DA TELA -----
const elementos = {
  telaInicio: document.getElementById('tela-inicio'),
  telaPergunta: document.getElementById('tela-pergunta'),
  telaResultado: document.getElementById('tela-resultado'),
  botaoComecar: document.getElementById('botao-comecar'),
  botaoJogarNovamente: document.getElementById('botao-jogar-novamente'),
  infoPergunta: document.getElementById('info-pergunta'),
  infoPontos: document.getElementById('info-pontos'),
  barraTempo: document.getElementById('barra-tempo'),
  chipCategoria: document.getElementById('chip-categoria'),
  textoPergunta: document.getElementById('texto-pergunta'),
  listaAlternativas: document.getElementById('alternativas'),
  feedback: document.getElementById('feedback'),
  recordeInicio: document.getElementById('recorde-inicio'),
  pontuacaoFinal: document.getElementById('pontuacao-final'),
  recordeFinal: document.getElementById('recorde-final'),
  mensagemFinal: document.getElementById('mensagem-final')
};

// ----- FUNÇÕES AUXILIARES -----
function mostrarTela(tela) {
  [elementos.telaInicio, elementos.telaPergunta, elementos.telaResultado]
    .forEach(t => t.classList.add('escondida'));
  tela.classList.remove('escondida');
}

function atualizarRecordeNaTela() {
  elementos.recordeInicio.textContent = `🏆 Recorde: ${Storage.carregarRecorde()} pontos`;
}

// Embaralha uma cópia do array
function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// ----- CARREGAR PERGUNTAS -----
async function carregarPerguntas() {
  const resposta = await fetch('data/perguntas.json');
  if (!resposta.ok) {
    throw new Error('Não foi possível carregar as perguntas.');
  }
  return resposta.json();
}

// ----- FLUXO DO JOGO -----
async function comecarJogo() {
  try {
    const dados = await carregarPerguntas();
    perguntas = embaralhar(dados).slice(0, CONFIG.quantidadePorPartida);
    indiceAtual = 0;
    pontos = 0;
    mostrarTela(elementos.telaPergunta);
    mostrarPergunta();
  } catch (erro) {
    alert('Não consegui carregar as perguntas. Abra o jogo pelo link do GitHub Pages ou pelo Live Server (não pelo duplo clique no arquivo).');
  }
}

function mostrarPergunta() {
  const atual = perguntas[indiceAtual];
  respostaCorretaTexto = atual.alternativas[atual.correta];

  elementos.infoPergunta.textContent = `Pergunta ${indiceAtual + 1} de ${perguntas.length}`;
  elementos.infoPontos.textContent = `⭐ ${pontos} pontos`;
  elementos.chipCategoria.textContent = atual.categoria || 'Geral';
  elementos.textoPergunta.textContent = atual.pergunta;
  elementos.feedback.textContent = '';
  elementos.feedback.className = 'feedback';

  // Monta as alternativas já embaralhadas
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
      responder(null, false); // tempo esgotado = errou
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

  // Desabilita todos os botões e destaca a resposta certa
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

  // Próxima pergunta após 1,6 segundos
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
  const novoRecorde = Storage.salvarRecorde(pontos);

  elementos.pontuacaoFinal.textContent = `${pontos} pontos`;
  elementos.recordeFinal.textContent = novoRecorde
    ? '🏆 Novo recorde! 🎉'
    : `🏆 Recorde: ${Storage.carregarRecorde()} pontos`;

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
  atualizarRecordeNaTela();
}

// ----- INÍCIO -----
elementos.botaoComecar.addEventListener('click', comecarJogo);
elementos.botaoJogarNovamente.addEventListener('click', comecarJogo);
atualizarRecordeNaTela();