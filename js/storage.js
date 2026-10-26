// ============================================================
// storage.js — salva o recorde no próprio navegador
// ============================================================

const Storage = {
  CHAVE: 'quiz-recorde',

  // Lê o recorde salvo. Se não existir, devolve 0.
  carregarRecorde() {
    const valor = localStorage.getItem(this.CHAVE);
    return valor === null ? 0 : Number(valor);
  },

  // Salva somente se for maior que o atual.
  // Devolve true quando um novo recorde é atingido.
  salvarRecorde(pontos) {
    if (pontos > this.carregarRecorde()) {
      localStorage.setItem(this.CHAVE, String(pontos));
      return true;
    }
    return false;
  }
};