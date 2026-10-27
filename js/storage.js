// ============================================================
// storage.js — salva o recorde de cada matéria no navegador
// ============================================================

const Storage = {
  CHAVE_BASE: 'quiz-recorde-',

  carregarRecorde(chave) {
    const valor = localStorage.getItem(this.CHAVE_BASE + chave);
    return valor === null ? 0 : Number(valor);
  },

  salvarRecorde(chave, pontos) {
    if (pontos > this.carregarRecorde(chave)) {
      localStorage.setItem(this.CHAVE_BASE + chave, String(pontos));
      return true;
    }
    return false;
  }
};