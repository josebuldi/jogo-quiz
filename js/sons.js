// ============================================================
// sons.js — efeitos sonoros gerados pelo navegador (sem arquivos)
// ============================================================

const Sons = {
  ctx: null,

  // Prepara o "alto-falante" do navegador na primeira vez
  obterContexto() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  },

  // Toca uma sequência de notas: cada par é [frequência Hz, duração s]
  tocar(notas, tipo, volume) {
    try {
      const ctx = this.obterContexto();
      let tempo = 0;
      notas.forEach(par => {
        const frequencia = par[0];
        const duracao = par[1];
        const oscilador = ctx.createOscillator();
        const ganho = ctx.createGain();
        oscilador.type = tipo;
        oscilador.frequency.value = frequencia;
        const inicio = ctx.currentTime + tempo;
        ganho.gain.setValueAtTime(volume, inicio);
        ganho.gain.exponentialRampToValueAtTime(0.001, inicio + duracao);
        oscilador.connect(ganho);
        ganho.connect(ctx.destination);
        oscilador.start(inicio);
        oscilador.stop(inicio + duracao);
        tempo += duracao;
      });
    } catch (e) {
      // Som é bônus: se o navegador bloquear, o jogo continua funcionando
    }
  },

  acerto() {
    // Três notas subindo: "tchim-tchim" alegre
    this.tocar([[523.25, 0.12], [659.25, 0.12], [783.99, 0.25]], 'triangle', 0.3);
  },

  erro() {
    // Notas graves descendo: som de "errou"
    this.tocar([[220, 0.2], [164.81, 0.3]], 'sawtooth', 0.2);
  },

  recorde() {
    // Fanfarra curta de novo recorde
    this.tocar([[523.25, 0.15], [659.25, 0.15], [783.99, 0.15], [1046.5, 0.4]], 'square', 0.25);
  }
};