# 🧠 Quiz Divertido

Jogo de perguntas e respostas para crianças de **8 a 12 anos**, feito em HTML, CSS e JavaScript puro.
Roda no navegador (PC e celular), é hospedado gratuitamente no **GitHub Pages** e não precisa de servidor nem banco de dados.

- **Jogar:** https://josebuldi.github.io/jogo-quiz/
- **Versão:** 1.0
- **Última atualização:** 27/10/2026
- **Responsável:** José Buldi

---

## 🎮 O que o jogo faz

### Fluxo do jogador
1. Tela inicial pergunta: **"O que você quer estudar hoje?"** — menu com as matérias disponíveis
2. Cada botão de matéria mostra o **recorde daquela matéria** (salvo no próprio navegador)
3. **Tabuada:** ao clicar, o jogo pergunta *"Tabuada de qual número?"* (de 2 a 10) e gera as perguntas na hora
4. **Outras matérias:** o jogo sorteia **10 perguntas aleatórias** do banco da matéria escolhida
5. A cada partida, perguntas **e alternativas são embaralhadas** — nunca sai igual
6. Fim de jogo mostra pontuação, mensagem motivacional e opção de jogar de novo ou trocar de matéria

### Durante a partida
- ⏱️ **Cronômetro de 20 segundos por pergunta**, com barra visual que fica amarela (10s) e vermelha (5s)
- ⭐ **10 pontos por acerto**, com contador em tempo real
- ✅ **Feedback imediato:** acerto soma pontos; erro destaca a resposta certa em verde
- 🔊 **Efeitos sonoros gerados pelo navegador** (sem arquivos de áudio): som alegre no acerto, som grave no erro e fanfarra no novo recorde
- 🏆 **Recorde por matéria** salvo no `localStorage` — o recorde da Tabuada do 7 não se mistura com o de Ciências

### Matérias disponíveis
| Matéria | Tipo | Banco de perguntas |
|---|---|---|
| ✖️ Tabuada (2 a 10) | Gerada pelo código | Infinita (90 combinações por número) |
| 🔬 Ciências | Arquivo JSON | 70 perguntas |
| 📚 Português | Arquivo JSON | 58 perguntas |
| 🏛️ História | Arquivo JSON | 56 perguntas |
| 🌍 Geografia | Arquivo JSON | 56 perguntas |
| 🔤 Inglês | Arquivo JSON | 54 perguntas |

**Total: 294 perguntas fixas + tabuada gerada dinamicamente.**

---

## 🛠️ Tecnologias

- **HTML5** — telas do jogo (menu, tabuada, pergunta, resultado)
- **CSS3** — visual responsivo (funciona em PC e celular, com media queries)
- **JavaScript puro** — lógica, sem frameworks nem bibliotecas
- **Web Audio API** — sons gerados por código, sem arquivos externos
- **localStorage** — recordes salvos no próprio navegador
- **GitHub Pages** — hospedagem gratuita e atualização automática a cada push

Nenhuma engine de jogo é usada: o quiz é interface + lógica, e JavaScript puro entrega isso com código simples de manter.

---

## 📁 Estrutura do projeto

```text
jogo-quiz/
├── index.html            # todas as telas do jogo
├── css/
│   └── style.css         # visual responsivo
├── js/
│   ├── app.js            # lógica do quiz, menu, tabuada, cronômetro
│   ├── storage.js        # recordes por matéria (localStorage)
│   └── sons.js           # efeitos sonoros (Web Audio API)
├── data/
│   ├── ciencias.json     # banco de Ciências
│   ├── portugues.json    # banco de Português
│   ├── historia.json     # banco de História
│   ├── geografia.json    # banco de Geografia
│   └── ingles.json       # banco de Inglês
├── assets/               # reservado para imagens futuras
└── README.md             # esta documentação
```

---

## ➕ Como adicionar perguntas

Cada arquivo em `data/` segue este formato:

```json
{
  "pergunta": "Texto da pergunta?",
  "alternativas": ["opção 1", "opção 2", "opção 3", "opção 4"],
  "correta": 0,
  "categoria": "Nome da matéria"
}
```

Regras:
- `"correta"` é a **posição** da resposta certa na lista (0 = primeira, 1 = segunda, 2 = terceira, 3 = quarta)
- A posição no arquivo **não importa**: o jogo embaralha as alternativas na tela a cada partida
- Cole novos blocos **entre** o último `}` (com vírgula) e o `]` de fechamento
- **Valide sempre em jsonlint.com** antes de commitar — vírgula sobrando ou faltando é o erro mais comum

### Como adicionar uma matéria nova
1. Crie o arquivo em `data/` (ex.: `esportes.json`) com perguntas no formato acima
2. Abra o `js/app.js` e adicione **uma linha** na lista `MATERIAS`:

```javascript
{ nome: 'Esportes', icone: '⚽', arquivo: 'esportes.json' }
```

3. Commit e push — a matéria já aparece no menu

---

## 🔄 Rotina de atualização (publicar mudanças)

1. Edite os arquivos no **VS Code**
2. No **GitHub Desktop**: escreva um resumo do que mudou → **Commit to main** → **Push origin**
3. Em ~1 minuto o site online se atualiza sozinho (o jogo força o navegador a baixar as perguntas novas — não precisa de Ctrl+F5)

O histórico completo de alterações fica salvo no GitHub, e é possível voltar a qualquer versão anterior.

---

## 🧩 Solução de problemas

| Problema | Causa provável | Solução |
|---|---|---|
| Página 404 no link do jogo | Pages desativado ou build não rodou | Confira **Settings → Pages** (Deploy from a branch, `main` + root) e a **aba Actions** |
| Perguntas não carregam | JSON inválido ou arquivo faltando | Valide o arquivo em jsonlint.com; confira o nome exato em `data/` |
| Site desatualizado | Push não concluído | Verifique no GitHub Desktop se o push terminou sem erro |
| Som não toca | Navegador exige interação | Os sons tocam a partir do primeiro toque/click — normal |
| Recorde sumiu | Dados do navegador apagados | Recordes ficam no `localStorage` do aparelho; trocar de navegador/aparelho zera |

---

## 📜 Histórico de versões

| Versão | Data | Alterações |
|---|---|---|
| 1.0 | 27/10/2026 | Primeira versão jogável publicada; menu de matérias; tabuada gerada por código; 294 perguntas; recordes por matéria; efeitos sonoros |

---

## 📄 Licença

Projeto pessoal e educacional. Sinta-se livre para usar e adaptar com crianças que você conhece. 🎓