# Diário de Bordo — Tyghorn Melody

Registro de decisões tomadas e itens concluídos ao longo do projeto.

---

## Registro de Tempo

| Etapa | Data | Tempo Aprox. | Observações |
|-------|------|-------------|-------------|
| Kickoff e estrutura inicial | 2026-04-13 | ~2h | Criação do repositório, documentação base e alinhamento de visão |
| Fase 1 — Fundação + Teste MIDI | 2026-04-13 | (incluso acima) | CSS base, hub page, teste MIDI funcional |
| Fase 2 — Player de Prática (MVP) | 2026-04-13 ~ 2026-04-14 | ~1h | Engine, renderer, catálogo, músicas, controles completos |
| Fase 2.5 — Refinamentos do Player | 2026-04-14 | ~1h | Tolerância configurável, gerenciamento de dados, ajustes visuais |
| Fase 3 — MIDIs reais + Range 61 teclas | 2026-04-14 | ~2h | Conversor MIDI→JSON, re-transcrição de 3 músicas, range fixo C2-C7 |
| Fase 4 — Configuração de teclado + Teoria (placeholder) | 2026-04-14 | ~1h | Fluxo guiado de detecção de range; página Em Construção para Teoria |
| Deploy GitHub Pages | 2026-04-14 | — | Publicação e validação em produção |
| Especificação do Módulo de Teoria Musical | 2026-04-14 ~ 2026-04-15 | ~2h | Spec completa, roadmap faseado, decisões de arquitetura |
| Módulo de Recursos (completo) | 2026-04-15 | ~3h | Spec, implementação, curadoria (83 recursos, 18 categorias), revisão de links |

---

## Catálogo de Músicas

Referência consolidada das músicas disponíveis no player. Atualizar conforme novas músicas forem adicionadas.

| Música | Origem | Categoria | Dificuldade | Beats | Tracks | Fonte |
|--------|--------|-----------|-------------|-------|--------|-------|
| Stickerbrush Symphony | Donkey Kong Country 2 | games | intermediate | 420 | 4 (2R + 2L) | MIDI |
| Peaceful Days | Chrono Trigger | games | beginner | 220 | 4 (2R + 2L) | MIDI |
| Frog's Theme | Chrono Trigger | games | intermediate | 288 | 4 (2R + 2L) | MIDI |

### Detalhes de Conversão

| Música | BPM | Notas (R/L) | Simplificado (R/L) | Split | Observações |
|--------|-----|-------------|---------------------|-------|-------------|
| Stickerbrush Symphony | 90 | 909 / 968 | 527 / 773 | N/A (2 tracks) | 13 notas em oitava 1 transpostas +12 |
| Peaceful Days | 88 | 749 / 86 | 660 / 86 | C4 (60) | Track única dividida; melodia dominante |
| Frog's Theme | 192 | 322 / 560 | 288 / 448 | C4 (60) | Track única; acompanhamento mais denso que melodia |

- Todas convertidas via `tools/midi-to-json.py` a partir de MIDIs reais
- 4 tracks por música: 2 por mão (standard + simplified)
- Range: C2–C7 (MIDI 36–96), 61 teclas
- Versões simplificadas geradas automaticamente (filtro por tempos fortes)

---

## 2026-04-13 — Kickoff

- Repositório criado e hospedado no GitHub (`CaioVSMSantos/tyghorn-melody`)
- Stack definida: HTML + CSS + JavaScript puros, dados em JSON
- Hospedagem planejada: GitHub Pages ou uso local (abrir HTML diretamente)
- Armazenamento de dados do usuário: memória do navegador (localStorage)
- Estrutura de documentação criada: README, roadmap, archive, CLAUDE.md

## 2026-04-13 — Especificações e Fase 1

**Decisões tomadas:**
- Arquitetura multi-página confirmada (index.html na raiz, demais em pages/)
- Electron descartado — complexidade desnecessária, browser nativo supre todas as necessidades (Web MIDI API, Web Audio API)
- Nomenclatura `index.html` (não `tyghorn-melody.html`) para compatibilidade com GitHub Pages
- Diretórios: `css/`, `js/`, `pages/`, `songs/`, `data/`, `docs/project/`, `docs/core/`
- Paleta synthwave cyberpunk definida com 3 tons de fundo, 2 neons dominantes (ciano, amarelo), 3 de apoio (verde, rosa, roxo), 2 neutros
- Uso de ES modules para JavaScript (`type="module"`)
- Emojis como recurso visual primário; sem imagens customizadas

**Implementado:**
- `css/style.css` — CSS base com paleta, reset, tipografia, componentes (navbar, panels, badges, monitor MIDI, hub cards)
- `index.html` — Hub com navegação e cards para as 3 seções
- `pages/tools.html` — Teste de conexão MIDI (suporte do navegador, lista de dispositivos, monitor de teclas)
- `js/midi.js` — Módulo de interação com Web MIDI API (detecção, hot-plug, parsing de Note On/Off)

## 2026-04-13 — Fase 2: Player de Prática (MVP)

**Decisões tomadas:**
- Canvas 2D escolhido sobre DOM para rendering de falling notes (performance em animação contínua)
- Timing baseado em beats (não milissegundos) — controle de velocidade funciona automaticamente via BPM
- Pontuação binária (hit/miss) com janela de ±150ms para MVP
- Velocity ignorada no matching para MVP
- Formato JSON de músicas especificado com multi-track por mão e dificuldade
- Seleção de tracks por radio groups (mutuamente exclusivas dentro da mesma mão)
- Catálogo como manifesto separado (`catalog.json`) — JSON completo carregado sob demanda
- Validação rigorosa de schema no song-loader antes de carregar qualquer música
- Progresso persistido: `bestAccuracy`, `timesPlayed`, `lastPlayed`, `tracksPlayed`

**Implementado:**
- `js/storage.js` — Persistência localStorage com validação de estrutura
- `js/song-loader.js` — Carregamento e validação completa de schema de músicas
- `js/player.js` — Engine do player (timeline, BPM sync, note matching, seek, lead-in)
- `js/renderer.js` — Rendering Canvas 2D (falling notes, colunas brancas/pretas, hit line)
- `js/play-app.js` — Orquestração da página de prática
- `pages/play.html` — Catálogo de músicas + interface do player
- `songs/catalog.json` — Manifesto com Stickerbrush Symphony
- `songs/games/stickerbrush-symphony.json` — Primeira transcrição (64 beats, 3 tracks)

**Correções de segurança:**
- `innerHTML` com dados externos (nomes de dispositivos MIDI) substituído por `createElement` + `textContent`
- Script inline em `tools.html` extraído para `js/tools.js` por conformidade com CSP (`default-src 'self'`)

## 2026-04-14 — Refinamentos do Player (7 pontos de ajuste)

**Apontamentos do usuário e implementação:**

1. **Restart + Seek bar** — Botão `⟳ Reiniciar` e barra de progresso clicável com display de tempo formatado. `player.js` recebeu `seek(targetBeat)` e `restart()`.

2. **Countdown (lead-in)** — 4 beats de contagem regressiva antes da primeira nota. O player inicia em tempo negativo (`-leadInMs`). O renderer exibe contagem quando `currentBeat < 0`.

3. **Distinção teclas brancas/pretas + destaque C** — Colunas do canvas diferenciadas por cor (brancas claras, pretas escuras, notas C com tom ciano). Notas pretas renderizadas mais estreitas (15% de margem lateral).

4. **Radio groups por mão** — Seleção de tracks mudou de checkboxes para radio buttons agrupados por mão (esquerda/direita), com opção "Nenhuma". Mutuamente exclusivas dentro do grupo.

5. **Aumento de tamanhos (~30-50%)** — Botões, títulos, textos de detalhe, speed display, accuracy display e catalog cards ampliados para melhor legibilidade.

6. **MIDI status + reconexão** — Indicador visual no header do player (🟢 conectado / 🔴 sem MIDI / 🟡 nenhum dispositivo). Botão `🔄 Reconectar` para re-requisitar acesso MIDI sem recarregar a página.

7. **Músicas expandidas:**
   - Stickerbrush Symphony estendida de 64 para 192 beats (48 compassos). Seções adicionais: B, A', C, Outro.
   - Peaceful Days (Chrono Trigger) criada: 128 beats, C maior, 100 BPM, 3 tracks (melodia simplificada, melodia, acompanhamento).
   - `catalog.json` atualizado com entrada do Peaceful Days.

**CSS adicionado:**
- `.track-group`, `.track-group-label`, `.track-group-options`, `.track-option`, `.track-separator` — Seleção de tracks por radio
- `.player-progress`, `.progress-bar`, `.progress-fill`, `.progress-time` — Seek bar
- `.midi-status`, `.midi-indicator`, `.midi-on`, `.midi-off` — Status MIDI
- `.player-header-right` — Layout do header
- `.btn:disabled` — Estado desabilitado dos botões

**Estado ao final da sessão:**
- Player funcional com todas as features do MVP implementadas
- Pendente: teste visual detalhado pelo usuário (apontamentos adicionais mencionados)
- Pendente: configuração de teclado (detecção de range)

## 2026-04-14 — Fase 2.5: Refinamentos do Player

**Contexto:** Após testes reais pelo usuário, foram identificados 4 pontos de ajuste na sessão anterior e 4 adicionais nesta sessão. Tempo total acumulado do projeto: ~4 horas.

**Sessão 1 — Ajustes iniciais:**

1. **Tolerância configurável** — `TOLERANCE_MS` (constante fixa 150ms) substituída por sistema configurável com 3 níveis via radio buttons na barra de tracks. Preferência persistida no localStorage. `player.js` recebeu `setTolerance()` para alteração em tempo real.

2. **Gerenciamento de dados** — Nova seção na página de Ferramentas com dois botões: "Limpar Progresso" (remove histórico de músicas) e "Redefinir Tudo" (remove todos os dados do localStorage). Ambos com `confirm()` de segurança. `storage.js` recebeu `clearProgress()` e `resetAll()`.

3. **Ícones de mãos trocados** — Emojis direcionais com cores distintas: 🔴🫲 Mão Esquerda, 🟢🫱 Mão Direita. Verde = mão primária (melodia, selecionada por padrão), vermelho = secundária.

4. **Tentativa de reduzir teclas pretas** — Margem das notas caindo alterada de 15% para 30%. Porém o impacto visual foi insuficiente porque as colunas de fundo (lanes) permaneceram com largura uniforme.

**Sessão 2 — Ajustes adicionais:**

1. **Valores de tolerância ampliados** — Fácil: 1000ms, Médio: 500ms, Preciso: 250ms. Justificativa: público iniciante + delay inerente da conexão MIDI.

2. **Zona visual de tolerância** — Gradiente amarelo (transparente) renderizado abaixo da hit line, cuja altura corresponde à janela de tolerância em pixels (proporcional ao BPM e velocidade). Feedback visual do quão "generosa" é a janela.

3. **Teclas pretas corrigidas** — Diagnóstico: a alteração anterior afetava apenas as notas caindo, não as colunas de fundo. Correção: colunas de fundo de teclas pretas agora são faixas centralizadas a ~60% da largura da coluna (20% de margem por lado), com opacidade aumentada (0.25 → 0.40). Notas caindo mantidas a 40% da largura.

4. **Documentação e roadmap** — Registro da Fase 2.5, reorganização do backlog com prioridades, recomendação de próximas features.

**Decisões tomadas:**
- Tolerâncias altas são válidas para público iniciante — o objetivo é acompanhar, não competir
- Zona de tolerância como gradiente sutil (não invasivo) que escala dinamicamente com BPM/velocidade
- Teclas pretas devem ser visualmente menores tanto nas colunas quanto nas notas

**Estado ao final da sessão:**
- Player refinado e funcional com todas as melhorias de usabilidade
- Backlog reorganizado com prioridades claras
- Próxima fase recomendada: Configuração de teclado + Catálogo de recursos + Teoria musical

## 2026-04-14 — Fase 3: MIDIs Reais + Range 61 Teclas

**Contexto:** Após testes reais, as transcrições manuais das músicas (geradas por aproximação) estavam com notas incorretas. Decisão: refazer transcrições a partir de arquivos MIDI reais e padronizar o player para 61 teclas (C2–C7). Tempo total acumulado do projeto: ~6 horas.

**Ferramenta de conversão (`tools/midi-to-json.py`):**

Script Python puro (zero dependências externas) para converter arquivos MIDI no formato JSON do player. Três comandos:
- `analyze` — Exibe informações detalhadas de um MIDI (tracks, notas, range, distribuição por oitava, BPM)
- `convert` — Converte MIDI para JSON com parâmetros configuráveis (BPM, split point, quantização, tonalidade)
- `status` — Mostra quais MIDIs em `midis/` já foram convertidos

Pipeline de conversão:
1. Parser binário MIDI (header, chunks MTrk, mensagens channel/meta, running status, SysEx)
2. Conversão ticks → beats usando division do header
3. Quantização para semicolcheias (0.25 beats) via grade configurável
4. Transposição de notas fora do range C2–C7 por oitavas
5. Deduplicação (mesma nota + mesmo beat)
6. Resolução de overlaps (mesma nota com sobreposição temporal)
7. Separação de mãos: multi-track por pitch médio, single-track por split point
8. Geração automática de versão simplificada (notas em tempos fortes, acordes reduzidos, duração mínima 0.5 beats)
9. Formatação JSON compacta (notas em linha única) e atualização de `songs/catalog.json` + `midis/index.json`

**MIDIs convertidos:**

| Música | BPM | Notas (R/L) | Simplificado (R/L) | Split | Observações |
|--------|-----|-------------|---------------------|-------|-------------|
| Stickerbrush Symphony | 90 | 909 / 968 | 527 / 773 | N/A (2 tracks) | 13 notas em oitava 1 transpostas +12 |
| Peaceful Days | 88 | 749 / 86 | 660 / 86 | C4 (60) | Track única dividida; melodia dominante |
| Frog's Theme | 192 | 322 / 560 | 288 / 448 | C4 (60) | Track única; acompanhamento mais denso que melodia |

**Range fixo de 61 teclas:**

- Renderer alterado para exibir sempre C2–C7 (MIDI 36–96) independente da música
- Layout visual consistente entre músicas — mesma tecla na mesma posição
- `play-app.js` passa range fixo ao renderer (antes passava `midiRange` da música)
- Futuro: auto-ajuste ao teclado MIDI conectado quando a configuração de range estiver implementada

**Decisões tomadas:**
- Conversões manuais de música são inviáveis para precisão — MIDIs reais são a fonte correta
- Script de conversão versionado no repositório (não sensível, útil para futuras músicas)
- Abordagem faseada para MIDI: (1) dev tool agora, (2) upload pelo usuário no futuro
- Quantização em semicolcheias (0.25 beats) preserva ritmo sem excesso de detalhe
- Versões simplificadas geradas automaticamente (filtro por tempos fortes), refinamento manual quando necessário

**Estado ao final da sessão:**
- 3 músicas convertidas de MIDIs reais com 4 tracks cada (2 mãos × 2 dificuldades)
- Player com range fixo de 61 teclas
- Ferramenta de conversão funcional e documentada
- Catálogo e índice atualizados automaticamente

## 2026-04-14 — Fase 4: Configuração de Teclado + Teoria (placeholder)

**Contexto:** Dois itens independentes implementados na mesma sessão.

### Página "Em Construção" — Teoria Musical

`pages/theory.html` criada como placeholder para o módulo de teoria. O botão no hub levava a um erro 404. A página mantém a navbar e identidade visual; comunica que o módulo está em desenvolvimento com link de retorno ao hub.

### Ferramenta de Configuração de Teclado

**Decisões tomadas:**
- Integrada em `tools.html` (não página dedicada) — complexidade insuficiente para justificar novo arquivo. Revisitar quando Ferramentas crescer
- Fluxo sequencial guiado em 3 etapas: (1) tecla mais grave, (2) tecla mais aguda, (3) confirmação e salvamento
- A cada etapa, qualquer tecla pressionada atualiza o display em tempo real — o usuário só avança ao clicar "Confirmar". Pode pressionar quantas teclas quiser antes de confirmar, inclusive corrigir erros
- Botão "Voltar" no passo 2 permite retornar ao passo 1 sem reiniciar
- Botão "Refazer" na confirmação reinicia todo o fluxo
- Botão "Reconfigurar teclado" visível quando já há configuração salva
- Eventos MIDI durante o fluxo são interceptados pelo `setupState` e **não chegam ao monitor de teclas** — isolamento total

**Arquitetura do roteamento MIDI:**
- `onMidiNote()` adicionado como roteador central em `tools.js`
- Substitui o callback direto `addNoteEntry` nos listeners — verifica `setupState.active` antes de rotear
- `handleSetupNote()` consome o evento e retorna `true` quando o fluxo está ativo
- `_midiAccessRef` exposto para que o fluxo capture o nome do dispositivo conectado no momento do save

**Dados persistidos** (via `storage.js` `setKeyboard()`):
- `lowestNote` e `highestNote` (número MIDI)
- `totalKeys` (calculado)
- `deviceName` (primeiro dispositivo conectado no momento)
- `configuredAt` (ISO timestamp)

**CSS adicionado:**
- `.under-construction`, `.uc-icon`, `.uc-title`, `.uc-desc`, `.uc-btn` — placeholder de teoria
- `.setup-step`, `.setup-step-instruction`, `.setup-step-number` — estrutura do fluxo
- `.setup-note-feedback`, `.setup-note-display`, `.setup-note-name`, `.setup-note-midi` — display de nota detectada
- `.setup-step-actions` — container dos botões de ação por etapa

**Estado ao final da sessão:**
- Configuração de teclado funcional, integrada em Ferramentas
- Placeholder de Teoria Musical no ar
- Auto-ajuste visual do player ao range do teclado permanece no backlog (Prioridade Média)

## 2026-04-14 — Deploy no GitHub Pages

Projeto publicado no GitHub Pages e validado pelo usuário. Todas as funcionalidades testadas e funcionais no ambiente de produção. Tempo total acumulado do projeto até o deploy: ~7 horas.

## 2026-04-15 — Especificação do Módulo de Teoria Musical

**Contexto:** Início da especificação do módulo educacional, a próxima grande iniciativa do projeto. Tempo total acumulado: ~9 horas.

### Reestruturação de `docs/`

Subpastas `docs/project/` e `docs/core/` eliminadas. Todos os documentos movidos para `docs/` diretamente — a quantidade de arquivos não justificava subdiretórios. Referências atualizadas em `CLAUDE.md`, `roadmap.md`, `architecture.md`.

### Especificação — `docs/theory-spec.md`

Documento completo cobrindo:

- **Princípios pedagógicos**: linearidade sem bloqueio, conceito primeiro, múltiplas representações, conexão com teclado
- **Estrutura**: hierarquia Módulo → Tópico → Bloco. 6 blocos por tópico (Neste Tópico, Conceito, Aprofundamento, Contexto Histórico, Exercícios, Navegação), sendo 2 colapsáveis
- **Catálogo de 41+ tópicos** em 11 módulos (do básico ao avançado): som, teclado, notas, ritmo, leitura, intervalos, escalas, acordes, campo harmônico, progressões, tópicos avançados
- **Exercícios interativos**: 3 widgets MIDI planejados (NoteDetector, SequenceChecker, ChordChecker), com fallback textual para usuários sem teclado

### Decisões de arquitetura tomadas

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Estrutura de páginas | Página shell dinâmica (`theory.html`) | Zero boilerplate, navegação via hash, manifesto JSON para links automáticos |
| Formato do conteúdo | HTML fragments carregados via fetch | Conteúdo rico nativo, compatível com shell dinâmico |
| Diagramas de teclado | HTML/CSS (divs estilizadas) | Simples, responsivo, sem dependências |

### Roadmap atualizado

Módulo de Teoria Musical dividido em 7 fases (A–G): estrutura/template → conteúdo fundamental → intermediário → avançado → exercícios interativos → tópicos avançados.

## 2026-04-15 — Módulo de Recursos (Completo)

**Contexto:** Página de curadoria de recursos externos para aprofundamento musical. Especificação, implementação completa e curadoria de conteúdo realizadas. Tempo total acumulado do projeto: ~12 horas.

### Especificação — `docs/resources-spec.md`

Documento completo cobrindo:

- **Princípios de curadoria**: 5 critérios de inclusão, política de idioma (pt-BR preferencial), política de links (título + searchHint > link direto)
- **18 categorias** em 6 grupos lógicos: Estudo (livros, revistas, cursos, vídeos, podcasts, documentários), Ferramentas (partituras, notação, apps), Equipamento (lojas, manutenção), Cultura (músicos, entretenimento, jogos, eventos), Comunidade (fóruns, profissionalização), Público Específico (crianças)
- **Arquitetura**: JSON + render dinâmico, accordion colapsável, badges de idioma/status, seção de arquivo para recursos indisponíveis
- **Ciclo de manutenção**: revisão semestral, ciclo de vida active → outdated → unavailable

### Implementação

| Arquivo | Responsabilidade |
|---------|-----------------|
| `pages/resources.html` | Shell HTML com navbar atualizada (4 itens) |
| `js/resources.js` | Fetch JSON, renderização dinâmica, accordion, validação de schema |
| `data/resources.json` | 83 recursos em 18 categorias, metadados completos |
| `css/style.css` | Componentes: accordion, badges (idioma, status), cards de recurso, seção de arquivo |

### Decisões tomadas

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Dados dos recursos | JSON + render dinâmico | 18 categorias com metadados por recurso tornam JSON mais manutenível. Pattern existente (catalog.json) |
| Seções colapsáveis | Accordion JS | JS já renderiza dados — lógica de accordion é trivial. Permite animação e estilo consistente |
| Navbar | 4 itens (Teoria, Prática, Ferramentas, Recursos) | Navbar limpa, acesso direto sem fricção |
| Badges de idioma | Somente para não-PT-BR | Maioria PT-BR — marcar a exceção é mais eficiente |
| Status de recursos | Inline (outdated) + Arquivo (unavailable) | Gradação: problemas leves ficam visíveis com aviso; indisponíveis migram para arquivo |

### Curadoria

- 83 recursos pesquisados e verificados manualmente
- Cobertura das 18 categorias planejadas
- Links validados quanto à disponibilidade
- Recursos em PT-BR priorizados; recursos em inglês incluídos com badge [EN] quando qualidade justifica
- Revisão final de links e disponibilidade concluída

**Estado ao final:** Módulo de Recursos 100% completo. Todas as tarefas do roadmap concluídas.
