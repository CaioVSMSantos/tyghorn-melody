# Especificação — Player de Prática

Funcionalidade central do Tyghorn Melody: carrega uma música em JSON, exibe falling notes em Canvas 2D em sincronia com um timeline, lê o teclado MIDI do usuário e compara as teclas pressionadas com as notas esperadas.

**Referência conceitual:** FlowKey, Synthesia, Guitar Hero.

> **Escopo deste documento:** registra as decisões de produto e os *porquês* editoriais. O schema das músicas é validado por [`js/play/song-loader.js`](../js/play/song-loader.js); a estrutura de persistência em localStorage vive em [`js/shared/storage.js`](../js/shared/storage.js); o fluxo de configuração do teclado em [`js/tools/keyboard-setup.js`](../js/tools/keyboard-setup.js). Para adicionar uma música nova, inspecione um JSON existente em [`content/songs/`](../content/songs/) — o validador emite erros acionáveis quando algum campo está fora do contrato.

---

## Decisões de Produto

| Decisão | Escolha | Porquê |
|---------|---------|--------|
| Rendering de notas | Canvas 2D | Animação contínua de muitos elementos com performance aceitável sem bibliotecas externas |
| Pontuação | Binária (acertou/errou) | Simplicidade para MVP. Gradações (OK / Bom / Perfeito) ficam como evolução futura quando houver base de uso e métricas |
| Janela de tempo | Configurável: Fácil ±1000ms · Médio ±500ms · Preciso ±250ms | Público iniciante precisa de margem generosa. Também absorve o delay inerente do caminho tecla → USB → navegador |
| Velocity no matching | Ignorado | MVP aceita a tecla certa no tempo certo. Consciência de velocity vira toggle opcional quando algum tópico de teoria exigir |
| Feedback sonoro | Apenas visual | Áudio exigiria biblioteca de samples + mixagem — fora do escopo da stack pura |
| Timing das notas | Em batidas (beats) | Alterar BPM muda velocidade sem recalcular posições. Preserva a relação musical, não a temporal |
| Progresso do usuário | Simples (`bestAccuracy`, `timesPlayed`) | Baixo custo de código, alto valor motivacional |
| Range visual | Fixo 61 teclas (C2–C7) | Layout consistente entre músicas: mesma tecla, mesma posição. Teclados menores recebem aviso de compatibilidade. Auto-ajuste ao teclado detectado é evolução planejada |

---

## Princípio de Timing em Beats

Todas as notas (`start`, `duration`) são especificadas em batidas, não em segundos. Três consequências diretas:

- O controle de velocidade é um multiplicador sobre o BPM — a música toca mais rápida ou mais lenta sem recomputar nenhuma posição.
- Uma música em BPM 60 e uma em BPM 160 compartilham a mesma estrutura de JSON; muda apenas o campo `bpm`.
- Acordes são múltiplas notas com o mesmo `start`, sem estrutura especial.

---

## Tolerância

A tolerância é o conceito central de jogabilidade — não é "tempo para errar", é a **janela em que uma tecla pressionada conta para uma nota pendente**. Expressa em beats, escala automaticamente com BPM e com o multiplicador de velocidade. O renderer projeta essa janela como gradiente amarelo semi-transparente abaixo da hit line; o tamanho do gradiente é feedback direto de quão permissiva é a margem ativa.

Presets calibrados para o público iniciante (Fácil / Médio / Preciso). Não é configurável em milissegundos puros — é decisão pedagógica: o aluno escolhe entre "me dá espaço" e "me testa", não micro-ajustes que exigiriam compreensão de latência.

---

## Lead-in e Seek

- **Lead-in** — 4 beats de contagem regressiva (4→3→2→1) antes da primeira nota. O tempo interno começa negativo; o renderer mostra o número no centro do canvas. Sem lead-in o usuário não tem como preparar as mãos antes da primeira nota cair sobre a hit line.
- **Seek bar** — clicável abaixo do canvas. Ao pular para frente, notas anteriores ao novo ponto viram "missed" e notas posteriores voltam a "pending". Isso preserva a coerência do cálculo de acurácia mesmo após navegação não-linear — sem esse tratamento, voltar para trás inflacionaria a acurácia artificialmente.

---

## Controle de Velocidade

Multiplicador sobre o BPM original, em passos de 0.25x de 0.25x a 1.5x. Os passos não são arbitrários: múltiplos de 25% permitem cálculo mental rápido ("0.5x é metade do andamento", "0.75x é três quartos") e cobrem o ciclo pedagógico natural — estudar nota a nota → prática lenta → aquecimento → velocidade original → desafio — sem criar paralisia de escolha com granularidade fina demais.

---

## Render Visual

- **Colunas por nota MIDI** — teclas brancas em fundo claro, pretas em escuro, notas C destacadas em ciano. Reforça a orientação espacial do teclado real.
- **Notas pretas** — coluna de fundo a ~60% da largura (margem lateral de 20% por lado), notas caindo a ~40%. Visualmente correspondem à proporção física das teclas pretas no teclado real.
- **Hit line** — linha amarela horizontal a 85% da altura do canvas. Acima fica o espaço de antecipação; abaixo, a zona de tolerância.
- **Zona de tolerância** — gradiente amarelo semi-transparente, altura proporcional à tolerância ativa em beats. Feedback contínuo da janela disponível.
- **Tela de fim** — overlay com acurácia final em cor condicional (verde ≥80%, amarelo ≥50%, rosa <50%). O feedback emocional usa o mesmo vocabulário visual do hit/miss em jogo: a cor da conclusão dialoga com o que o aluno viu durante a execução.

A paleta do Canvas é lida dinamicamente de [`css/base/tokens.css`](../css/base/tokens.css) via `getComputedStyle` — alterar um token reflete no CSS e no rendering de notas sem duplicação. Ver [`architecture.md`](architecture.md) para detalhes.

---

## Músicas Disponíveis

| Música | Compositor | Origem | BPM | Beats | Tracks |
|--------|-----------|--------|-----|-------|--------|
| Stickerbrush Symphony | David Wise | Donkey Kong Country 2 | 90 | 420 | 4 (2R + 2L) |
| Peaceful Days | Yasunori Mitsuda | Chrono Trigger | 88 | 220 | 4 (2R + 2L) |
| Frog's Theme | Yasunori Mitsuda | Chrono Trigger | 192 | 288 | 4 (2R + 2L) |

Transcrições geradas a partir de arquivos MIDI reais via [`tools/midi-to-json.py`](../tools/midi-to-json.py). O conversor produz automaticamente quatro tracks por música: versão simplificada e standard, por mão.

---

## Futuro

Itens conscientemente deixados fora do MVP para preservar o foco:

- Gradação de acerto (OK / Bom / Perfeito) além do binário atual
- Matching opcional por velocity
- Transposição automática para teclados menores, em vez de apenas aviso de compatibilidade
- Auto-ajuste do range visual ao teclado MIDI detectado
- Filtros na tela de seleção (categoria, dificuldade, compatibilidade com o teclado)
- Vista de partitura sincronizada — decisão vinculada à evolução do Módulo 5 da Teoria
