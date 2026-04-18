# Plano de Refatoração — Tyghorn Melody

> **Tipo:** Artefato de referência. Este documento é **transitório** — orienta a refatoração e deve ser excluído ao final dela, com eventuais decisões preservadas em `docs/archive.md` ou `docs/architecture.md`.
>
> **Criado em:** 2026-04-17
> **Estado:** Rascunho inicial — pendente de aprovação final do plano antes da execução.

---

## 1. Contexto e Motivação

O projeto atingiu um ponto de inflexão: dois módulos de teoria concluídos, o player funcional com três músicas, módulo de recursos completo. O código cresceu organicamente e acumulou três classes de dívida que, se não tratadas agora, tornam cada módulo futuro mais caro que o anterior:

1. **CSS monolítico.** `css/style.css` tem 1797 linhas misturando 11+ contextos distintos (navbar, player inteiro, accordion de recursos, teoria, diagrama de teclado, "em construção"...).
2. **Scripts planos.** `js/` contém dez arquivos na raiz, sem separação por feature ou camada. Alguns (`play-app.js` com 600 linhas, `tools.js` com 548) concentram responsabilidades heterogêneas.
3. **Taxonomia da raiz.** Diretórios `songs/`, `midis/`, `music-sheets/`, `data/`, `images/` coexistem sem critério visível de separação entre runtime, autoria e domínio.

A refatoração visa reorganizar sem reescrever — preservar toda a funcionalidade e estética atuais, reduzir atrito de manutenção e preparar o terreno para os módulos 3–11 da teoria, o Módulo de Exercícios e a separação catálogo/player.

---

## 2. Diagnóstico do Estado Atual

### 2.1 Números

| Superfície | Valor |
|---|---|
| CSS | 1 arquivo, 1797 linhas |
| JS | 10 arquivos planos, ~2200 linhas |
| Arquivos JS > 500 linhas | 2 (`play-app.js`, `tools.js`) |
| Páginas HTML | 5 (index + 4 em `pages/`) |
| Documentos em `docs/` | 7, ~3089 linhas |
| Duplicação de `createElement` manual para `stats-grid` | 3 ocorrências em `tools.js` |
| Funções de validação com padrão `errors.push` | 2 (song-loader, resources) |

### 2.2 Dores Identificadas

1. **Falta de escopo visual no CSS.** Editar um estilo do accordion de Recursos exige rolar mil linhas sem saber se outro contexto é afetado.
2. **Acoplamento implícito no JS.** `play-app.js` importa cinco módulos e mistura carregamento de catálogo, controle do player, MIDI, seek bar e gamestate. Mudar qualquer parte exige entender o todo.
3. **Renderização à mão repetida.** `document.createElement` + `appendChild` repetido em blocos de 10–20 linhas para estruturas recorrentes (stat grids, badges, cards). Sem utilitário para eliminar o boilerplate.
4. **Estado em variáveis soltas no módulo.** `let player = null; let renderer = null; let animationId = null` no escopo de `play-app.js`. Funciona, mas dificulta evolução (ex: duas instâncias simultâneas para comparação futura).
5. **Taxonomia confusa na raiz.** Um leitor novo não distingue o que é runtime (`songs/`), fonte de autoria (`midis/`, `music-sheets/`) ou dados transversais (`data/`).
6. **Header não persistente.** Ao rolar para baixo, a navbar sai da vista — mudar de módulo exige rolar até o topo. Requisito funcional novo vinculado à refatoração de CSS.
7. **Documentação redundante com o código.** Especificações contêm detalhes de implementação (validações campo-a-campo, estrutura do `localStorage`, layout ASCII) que são deriváveis do código e do CSS. Esta é a motivação da **Parte II**.

---

## 3. Princípios que Guiam a Refatoração

Referência direta aos pilares do `CLAUDE.md`:

| Pilar | Tradução prática para este plano |
|---|---|
| Aprendizado | Cada bloco de refatoração deve ser pequeno o suficiente para ser entendido em uma sessão. Nomes explícitos em vez de clever tricks. |
| Simplicidade | Zero novas dependências. Zero build step. HTML/CSS/JS puros + ES modules nativos (já em uso). |
| Robustez/Segurança | CSP `default-src 'self'` permanece. Nenhuma regressão funcional aceitável. Validação de entrada onde já existe — sem flexibilização. |
| Manutenabilidade | Cada arquivo com propósito único e tamanho proporcional à sua responsabilidade. Dividir quando o bom senso sinalizar — sem regra numérica rígida. Documentação enxuta e precisa. |
| Organização | Árvore com significado — ler o caminho de um arquivo deve sugerir o que ele faz. |

---

## 4. Parte I — Arquitetura-Alvo

### 4.1 Árvore de Diretórios Proposta

```
tyghorn-melody/
├── index.html
├── README.md
├── CLAUDE.md
│
├── pages/                          ← Páginas HTML (inalterado)
│   ├── theory.html
│   ├── play.html
│   ├── tools.html
│   └── resources.html
│
├── css/
│   ├── base/                       ← Carregadas por TODAS as páginas
│   │   ├── tokens.css              ← Custom properties (paleta, glows)
│   │   ├── reset.css               ← Reset mínimo + base tipográfica
│   │   └── utilities.css           ← .text-cyan, .text-muted, etc.
│   ├── components/                 ← Componentes reutilizáveis entre páginas
│   │   ├── navbar.css
│   │   ├── footer.css
│   │   ├── buttons.css
│   │   ├── badges.css
│   │   ├── panels.css              ← .panel, .panel-info, .panel-hint
│   │   ├── callouts.css
│   │   ├── accordion.css
│   │   ├── stats-grid.css          ← .stats-grid, .stat-item
│   │   ├── hub-cards.css
│   │   ├── under-construction.css
│   │   └── keyboard-diagram.css
│   └── pages/                      ← Específicos por página
│       ├── theory.css              ← Sidebar, breadcrumb, topic-body, topic-figure
│       ├── play.css                ← Player layout, tracks, canvas, progress, controls
│       ├── tools.css               ← Setup flow, MIDI monitor, note log
│       └── resources.css           ← Resource items, archive, language badges
│
├── js/
│   ├── shared/                     ← Infraestrutura transversal
│   │   ├── midi.js
│   │   ├── storage.js
│   │   ├── dom.js                  ← NOVO: helpers de criação de DOM (el, stat-grid, badge)
│   │   └── note-utils.js           ← NOVO: noteToMidi, midiToNoteName, isBlackKey
│   ├── theory/
│   │   ├── theory.js               ← Shell (orquestração)
│   │   ├── manifest.js             ← NOVO: loadManifest, findTopic, findModule
│   │   ├── sidebar.js              ← NOVO: buildSidebar, updateActive
│   │   ├── topic-view.js           ← NOVO: renderTopicSkeleton, renderBreadcrumb, nav
│   │   └── keyboard-diagram.js
│   ├── play/
│   │   ├── play-app.js             ← Orquestração enxuta
│   │   ├── catalog-view.js         ← NOVO: renderCatalog, selectSong
│   │   ├── player-controls.js     ← NOVO: bindControls, updateControls
│   │   ├── track-selection.js     ← NOVO: renderTrackSelection, tolerance
│   │   ├── midi-bridge.js          ← NOVO: initMidi, reconnectMidi, updateStatus
│   │   ├── player.js               ← Engine (inalterado em responsabilidade)
│   │   ├── renderer.js             ← Canvas (inalterado em responsabilidade)
│   │   └── song-loader.js
│   ├── tools/
│   │   ├── tools.js                ← Orquestração
│   │   ├── midi-monitor.js         ← NOVO: log de notas, stats de sessão
│   │   ├── keyboard-setup.js       ← NOVO: fluxo de configuração
│   │   └── data-management.js     ← NOVO: limpar progresso, reset
│   └── resources/
│       ├── resources.js            ← Orquestração
│       ├── validator.js            ← NOVO: validateData
│       └── view.js                 ← NOVO: renderPage, renderCategory, renderResource
│
├── content/                        ← Assets carregados pelo app em runtime
│   ├── theory/                     ← HTML fragments (inalterado)
│   │   └── *.html
│   ├── songs/                      ← songs/ movido para cá
│   │   ├── catalog.json
│   │   ├── games/
│   │   ├── animes/
│   │   ├── movies/
│   │   └── artists/
│   ├── images/                     ← images/ movido para cá
│   │   └── theory/
│   └── data/                       ← Manifestos e dados de app
│       ├── theory-manifest.json
│       └── resources.json
│
├── authoring/                      ← Fontes de autoria (não carregadas pelo app)
│   ├── midis/                      ← midis/ movido para cá
│   │   ├── index.json
│   │   └── *.mid
│   └── sheets/                     ← music-sheets/ movido para cá
│       └── *.pdf
│
├── tools/                          ← Ferramentas internas (inalterado)
│   └── midi-to-json.py
│
└── docs/
    ├── architecture.md             ← Atualizado após refatoração
    ├── design.md
    ├── player-spec.md              ← Enxuto após Parte II
    ├── theory-spec.md              ← Enxuto após Parte II
    ├── resources-spec.md           ← Enxuto após Parte II
    ├── roadmap.md
    └── archive.md
```

### 4.2 Racional por Decisão

#### CSS em três camadas

- **base/**: obrigatória em toda página. Tokens (variáveis), reset, tipografia, utilitários. Sem selector algum específico de componente.
- **components/**: reutilizáveis entre páginas. A navbar aparece em todas; os accordions aparecem em Recursos e podem aparecer em Teoria; botões, badges, callouts são transversais. Cada página importa só o que usa — documenta consumo.
- **pages/**: ligado ao domínio da página. Se um estilo existe aqui, ele é *por definição* específico daquela tela.

**Ordem de importação no HTML**: tokens → reset → utilities → componentes (na ordem em que aparecem na árvore) → estilos da página. Cascata previsível.

**Tradeoff aceito**: mais requisições HTTP por página (6–10 em vez de 1). Mitigado pelo cache do browser e pela baixa massa agregada. HTTP/2 multiplexa. Para GitHub Pages, o impacto é marginal.

#### JS por feature, com `shared/`

Alternativa descartada: agrupamento por camada (`ui/`, `domain/`, `infra/`). Para um projeto deste porte, feature-first tem melhor alinhamento com o pilar da simplicidade e com a forma como o código é naturalmente consultado ("onde está a lógica do player?").

`shared/` é reservada ao que é efetivamente compartilhado *e estável*. Quando em dúvida sobre algo ser compartilhado, deixar na feature até nascer o segundo consumidor — regra da triplicação relaxada para duplicação (um projeto pessoal suporta duplicação maior antes de abstrair).

Novos módulos propostos:
- **`shared/dom.js`**: helpers minúsculos (`el(tag, attrs, children)`, `statGrid(items)`, `badge(variant, text)`). Elimina 30–40% do boilerplate de `createElement`.
- **`shared/note-utils.js`**: `noteToMidi`, `midiToNoteName`, `isBlackKey` hoje duplicados entre `midi.js`, `renderer.js`, `keyboard-diagram.js`. Unificar.

#### `content/` vs `authoring/`

A separação expressa o ciclo de vida:

- **content/** é o que o navegador *consome*. Se um arquivo não é acessado via `fetch`, não pertence aqui.
- **authoring/** é fonte. MIDI cru, PDF de partitura — entrada do `tools/midi-to-json.py` e referência humana. O produto dessa autoria (`.json` de música) vive em `content/songs/`.

Isso também esclarece o que pode ir num `.gitignore` futuro se o volume de MIDIs crescer (os PDFs tendem a ser grandes).

#### `data/` absorvido em `content/data/`

`theory-manifest.json` e `resources.json` são carregados via `fetch` em runtime — portanto são *content*. Nada os diferencia conceitualmente de `content/songs/catalog.json`. Unificar sob `content/` torna a regra legível.

---

### 4.3 Análise de Código — Pontual

Três arquivos são o cerne da refatoração. O resto recebe tratamento derivado.

#### 4.3.1 [player.js](js/player.js)

**Estado:** 239 linhas. Engine de timeline + matching + estado da sessão. Código limpo para o padrão atual.

**Pontos a endereçar:**
- Encapsulamento via closure é adequado. Manter.
- `accuracy` é recomputado a cada chamada de `getState()` — recalcular `percentage` é barato; não mexer.
- Ausência de eventos/callbacks: o orquestrador faz polling via `requestAnimationFrame`. Para o escopo atual, está certo. Não introduzir event emitter.
- `NOTE_STATE` exportado mas nunca consumido externamente além do próprio `getState` — remover do export se o consumidor não precisar.
- Mover para `js/play/`.

**Veredito:** Refator estrutural mínimo. Provavelmente apenas mover de pasta e remover export morto.

#### 4.3.2 [renderer.js](js/renderer.js)

**Estado:** 235 linhas. Canvas 2D, responsabilidade única bem definida.

**Pontos a endereçar:**
- `isBlackKey` e `isCNote` são helpers locais — `isBlackKey` está duplicado em `keyboard-diagram.js` e `midi.js`. Extrair para `shared/note-utils.js`.
- Constante `COLORS` hardcoded em hex. Duplica os tokens de `tokens.css`. **Tradeoff**: Canvas não lê CSS custom properties nativamente sem API extra (`getComputedStyle`). Opções: (a) manter duplicado e documentar; (b) ler via `getComputedStyle(document.documentElement)` em `resize()` e popular `COLORS` dinamicamente. Recomendo **(b)** — elimina a divergência silenciosa entre CSS e Canvas. Item separado no backlog.
- Mover para `js/play/`.

**Veredito:** Refator leve. Sem mudança de responsabilidade.

#### 4.3.3 [theory.js](js/theory.js)

**Estado:** 340 linhas. Único arquivo JS do projeto que não usa `import/export` (apesar de carregado como módulo). Mistura routing, manifest, sidebar, renderização de breadcrumb, topic view, placeholders.

**Pontos a endereçar:**
- Quebra natural por responsabilidade:
  - `theory/manifest.js` — load + `findTopic`, `findModule`
  - `theory/sidebar.js` — `buildSidebar`, `toggleSidebarModule`, `updateSidebarActive`
  - `theory/topic-view.js` — `renderTopicSkeleton`, `renderBreadcrumb`, `renderPrerequisites`, `renderTopicNav`, `renderTopicPlaceholder`, `showIndex`
  - `theory/theory.js` — shell: init, handleRoute, loadTopic, error
- `innerHTML` com template strings: coexistem com abordagem `createElement` dos demais arquivos. A CSP `default-src 'self'` permite, mas o conteúdo vem do manifesto JSON sob nosso controle. Aceitável por ora — alinhado ao pragmatismo do `docs/architecture.md`. Não mudar na refatoração estrutural; deixar para uma eventual padronização futura.
- State mutável em nível de módulo (`let manifest`, `let topicOrder`, `let currentTopicId`). Encapsular em um factory `createTheoryShell()` segue o padrão de `player.js` e `renderer.js`. **Recomendado**.

**Veredito:** Refator maior. Maior ganho de manutenabilidade do backlog JS.

#### 4.3.4 Problemas Transversais

**D1 — `createElement` de `stats-grid` triplicado em `tools.js`.**
`renderStats`, `renderKeyboardConfigStatus` e `renderSetupSummary` reimplementam o mesmo laço. Solução: `shared/dom.js` exporta `statGrid(items)` — parâmetro `items: Array<{label, value}>`. Reduz três blocos de ~20 linhas a três chamadas de 1 linha.

**D2 — Padrão de `errors.push(...)` repetido em validações.**
`song-loader.js` e `resources.js` usam o mesmo padrão imperativo para acumular erros. *Não* introduzir uma biblioteca de validação. Aceitar a duplicação — ambos são auto-contidos, longos mas claros. Tentar abstrair agora geraria complexidade desproporcional.

**D3 — Estado mutável no escopo do módulo em `play-app.js`.**
Seis `let` variables no topo: `midiAccess`, `player`, `renderer`, `animationId`, `catalog`, `currentSong`. Funciona, mas se torna frágil quando os controles se quebrarem em módulos separados (cada submódulo teria que importar o estado). Solução: `createPlayApp()` factory que encapsula o estado e expõe `init()`. Consistente com `player.js` e `renderer.js`.

**D4 — Hardcoded paths.**
`"../songs"`, `"../data/theory-manifest.json"`, etc. espalhados. Com a mudança para `content/`, esses caminhos mudam de qualquer forma. Centralizar em uma constante (`shared/paths.js` ou definições locais no topo de cada feature). Decisão final: **local a cada feature**, não centralizado — evita um singleton global para pouca economia.

**D5 — `isBlackKey` em três lugares.**
`midi.js` (não — esse calcula diferente, é para parsing), `renderer.js` (sim), `keyboard-diagram.js` (sim). Extrair para `shared/note-utils.js`.

**D6 — Inline styles em fragmentos de teoria e em `theory.js`.**
`style="text-align: center; font-size: 0.9rem..."` no HTML fragment de 2-3, e `style="padding: 2rem 0;"` no placeholder. Agora que `.topic-figure` existe, remover os inlines remanescentes e, quando houver, criar classes equivalentes. Item pequeno mas simbólico — respeita a Separação de Apresentação.

---

### 4.4 Backlog de Refatoração

Organização em **blocos** ordenados por dependência. Cada item tem ID, descrição, critério de aceitação e dependências. Itens de um mesmo bloco são independentes entre si e podem ser feitos em qualquer ordem (dentro do bloco).

> **Regra de execução:** cada item gera um commit distinto. Se um item ficar maior que o esperado, subdividir.
>
> **Coluna Status:** `⬜` pendente · `🟦` em progresso · `✅` concluído. Marcar imediatamente ao concluir cada item.

#### Bloco A — Preparação (sem mudanças visíveis ao usuário)

| ID | Status | Descrição | Critério de aceitação | Depende de |
|---|---|---|---|---|
| **A1** | ✅ | Criar `shared/note-utils.js` com `noteToMidi`, `midiToNoteName`, `isBlackKey`, `isCNote`. Remover as versões duplicadas em `renderer.js` e `keyboard-diagram.js`. | - Arquivo criado.<br>- Funções removidas dos demais arquivos.<br>- Nenhum uso direto das antigas.<br>- Páginas continuam funcionando no browser. | — |
| **A2** | ✅ | Criar `shared/dom.js` com helpers `el(tag, attrs, children)`, `statGrid(items)`, `badge(variant, text)`. Não migrar consumidores ainda. | - Funções exportadas e testadas manualmente via console.<br>- Nenhum consumidor introduzido. | — |
| **A3** | ✅ | Mover `storage.js` e `midi.js` para `js/shared/`. Atualizar imports. | - Arquivos na nova localização.<br>- Todas as páginas funcionais. | — |

#### Bloco B — CSS em três camadas

| ID | Status | Descrição | Critério de aceitação | Depende de |
|---|---|---|---|---|
| **B1** | ✅ | Criar `css/base/tokens.css` com as custom properties. Extrair de `style.css`. Importar em todas as páginas HTML. | - Arquivo existe com todas as variáveis.<br>- Páginas ainda renderizam idênticas. | — |
| **B2** | ✅ | Criar `css/base/reset.css` (reset + html/body + tipografia base). Extrair de `style.css`. Importar em todas as páginas. | - Reset e tipografia base isolados. | B1 |
| **B3** | ✅ | Criar `css/base/utilities.css` (`.text-cyan`, `.text-muted`, etc.). Também absorveu `.container` por ser layout utilitário transversal. | - Utilitários isolados. | B1 |
| **B4** | ✅ | Extrair componentes compartilhados em `css/components/*.css` (um arquivo por componente). Cada página importa apenas os que usa. **Decisão de execução:** adicionado `page-header.css` como décimo-segundo componente — `.page-header` aparece em 6 das 7 páginas, não cabia em utilities nem podia ficar espalhado. | - Navbar, footer, buttons, badges, panels, callouts, accordion, stats-grid, hub-cards, under-construction, keyboard-diagram, **page-header** separados.<br>- Sem duplicação.<br>- Páginas visualmente idênticas. | B1-B3 |
| **B5** | ✅ | Extrair `css/pages/theory.css` com todo o escopo de Teoria (sidebar, breadcrumb, topic-*, callouts específicos se houver, `.topic-figure`). | - `theory.html` importa apenas `base/* + components usados + pages/theory.css`.<br>- Página idêntica. | B4 |
| **B6** | ✅ | Extrair `css/pages/play.css` (player-*, tracks, tolerance, progress, midi-status, controls, setup). `.container-narrow` migrou junto por ser exclusivo do player. | - `play.html` idêntica visualmente. | B4 |
| **B7** | ✅ | Extrair `css/pages/tools.css` (setup-flow, device-list, note-log, note-entry). | - `tools.html` idêntica. | B4 |
| **B8** | ✅ | Extrair `css/pages/resources.css` (resource-*, archive, language/status badges específicos). `.accordion-header-archive` e `.archive-group-label` migrados como variantes de domínio. | - `resources.html` idêntica. | B4 |
| **B9** | ✅ | Remover `css/style.css`. Verificar que nada o referencia. | - Arquivo deletado.<br>- Todas as páginas funcionais. | B5-B8 |
| **B10** | ✅ | **Feature nova:** navbar sticky (fixa ao topo ao rolar) via `position: sticky; top: 0; z-index: 100` em `css/components/navbar.css`. Adicionado token `--navbar-height: 49px` em `tokens.css`, reutilizado por `.player-layout` (height: calc) e por `.theory-sidebar` (top: calc navbar-height + 1rem). | - Navbar permanece visível ao rolar em theory, resources, tools.<br>- Sem regressão no layout do player.<br>- Sem conteúdo coberto pela navbar nos links âncora. | B4 |

#### Bloco C — JavaScript por feature

| ID | Status | Descrição | Critério de aceitação | Depende de |
|---|---|---|---|---|
| **C1** | ✅ | Criar `js/play/` e mover `player.js`, `renderer.js`, `song-loader.js`, `play-app.js`. Ajustar imports. | - Estrutura nova funcional.<br>- Player inalterado em comportamento. | A1, A3 |
| **C2** | ✅ | Quebrar `play-app.js`: extrair `catalog-view.js` (renderCatalog, selectSong, difficulty helpers), `track-selection.js` (renderTrackSelection, createTrackGroup, tolerance, getSelectedTrackIds/ToleranceMs), `player-controls.js` (bindEvents, onPlay/Pause/Stop/Restart, updateControls, updateProgress, formatTime), `midi-bridge.js` (initMidi, reconnectMidi, updateMidiStatus, connectMidiToPlayer). Manter `play-app.js` como orquestrador enxuto com `createPlayApp()`. **Execução:** `midi-bridge` recebe `getPlayer` getter (closure sobre o player recriado a cada troca de música); `track-selection` recebe handlers injetados (stateless); `player-controls` é totalmente stateless (recebe `dom` + handlers). | - `play-app.js` é fino e apenas orquestra.<br>- Cada novo módulo com responsabilidade única.<br>- Estado encapsulado em factory.<br>- Comportamento idêntico. | C1 |
| **C3** | ✅ | Criar `js/theory/` e mover `theory.js`, `keyboard-diagram.js`. | - Estrutura nova funcional. | A3 |
| **C4** | ✅ | Quebrar `theory.js`: extrair `manifest.js` (load + findTopic + findModule), `sidebar.js` (buildSidebar, toggle, updateActive), `topic-view.js` (renderTopicSkeleton, breadcrumb, prerequisites, nav, placeholder, showIndex). Converter para `createTheoryShell()` factory. Adicionar `export` explícitos. **Execução:** `manifest.loadManifest` lança erros em vez de tocar DOM — orquestrador decide se renderiza painel de erro. `renderError` ficou em `topic-view` junto com as outras vistas. | - `theory.js` vira orquestrador enxuto.<br>- State encapsulado.<br>- Teoria funcional (navegação, fragments, sidebar). | C3 |
| **C5** | ✅ | Criar `js/tools/` e quebrar `tools.js` em `midi-monitor.js`, `keyboard-setup.js`, `data-management.js`, mantendo `tools.js` como orquestrador. **Execução:** `tools.js` detém o `midiAccess` e roteia notas — setup consome primeiro via `isActive()/handleNote()`, senão vão ao monitor. `keyboard-setup` recebe `getDeviceName` como dep do orquestrador (evita acoplar setup ao MIDIAccess). | - `tools.js` ≤ 100 linhas.<br>- Página de ferramentas idêntica. | A3 |
| **C6** | ✅ | Criar `js/resources/` e quebrar `resources.js` em `validator.js`, `view.js`, mantendo `resources.js` como orquestrador. **Execução:** `validator` é puro (retorna array de strings, sem DOM). Validação permanece não-bloqueante (só warn no console). | - `resources.js` ≤ 80 linhas.<br>- Página de recursos idêntica. | A3 |
| **C7** | ✅ | Migrar usos de boilerplate para `shared/dom.js` onde melhora legibilidade (stat grids, badges). **Escopo limitado**: apenas onde reduz o código em pelo menos 50%. Não forçar. **Execução:** 6 substituições efetivas — `midi-monitor` (status, access-denied, stats), `keyboard-setup` (config status, summary) e `catalog-view` (difficulty badge). Removidos dois `createStatItem` locais duplicados. | - Pelo menos 3 chamadas substituídas.<br>- Sem regressão visual. | A2, C2–C6 |
| **C8** | ✅ | `renderer.js`: ler tokens de cor via `getComputedStyle(document.documentElement)` em vez de hex hardcoded. **Execução:** cores sólidas (`--bg-deep`, `--neon-cyan`, `--neon-yellow`, `--neon-green`, `--neon-pink`, `--text-secondary`) lidas em `createRenderer`. RGBAs com alfa (whiteKey, blackKey, cMarker, hitLineGlow, noteMissed) permanecem hardcoded — documentado no `readColors()`. | - Paleta visual idêntica.<br>- Alterar um token no `tokens.css` altera o Canvas. | C1, B1 |

#### Bloco D — Conteúdo e assets

| ID | Status | Descrição | Critério de aceitação | Depende de |
|---|---|---|---|---|
| **D1** | ⬜ | Criar `content/`. Mover `songs/` → `content/songs/`, `images/` → `content/images/`, `data/` → `content/data/`. | - Estrutura física movida. | — |
| **D2** | ⬜ | Atualizar todos os fetchs e links de imagem para os novos paths (`content/data/theory-manifest.json`, `content/songs/...`, `../content/images/theory/...`). | - Todas as páginas carregam dados e imagens corretamente. | D1 |
| **D3** | ⬜ | Criar `authoring/`. Mover `midis/` → `authoring/midis/`, `music-sheets/` → `authoring/sheets/`. Ajustar `tools/midi-to-json.py` se referenciar paths relativos. | - Ferramenta de conversão funcional.<br>- Nenhum app runtime acessa `authoring/`. | — |
| **D4** | ⬜ | Inline styles remanescentes nos fragments de teoria: remover. Onde necessário, criar classe correspondente em `css/pages/theory.css`. | - Nenhum atributo `style=` em `content/theory/*.html`. | B5 |

#### Bloco E — Arremate

| ID | Status | Descrição | Critério de aceitação | Depende de |
|---|---|---|---|---|
| **E1** | ⬜ | Atualizar `docs/architecture.md` refletindo a nova árvore e módulos. | - Documento coerente com o código. | C*, D* |
| **E2** | ⬜ | Remover este arquivo (`docs/refactoring-plan.md`). Preservar eventuais decisões em `docs/archive.md`. | - Plano excluído.<br>- Archive atualizado se decisões novas emergirem. | F* |

#### Bloco F — Responsividade Básica

Trabalho distinto e ortogonal aos blocos anteriores. Separado para não confundir-se com a refatoração estrutural — aqui não movemos arquivos, apenas adicionamos regras `@media` e um overlay.

**Escopo intencionalmente limitado:** **não** tornar o Player e as Ferramentas responsivas de verdade. Em celular, esses módulos dependem de teclado MIDI físico (raro em mobile) e de tela grande para o canvas de notas caindo. Tentar fazê-los funcionar bem em mobile é custo alto por uso marginal. Apenas informamos o usuário.

**Estratégia de detecção:** `window.matchMedia('(pointer: coarse) and (max-width: 900px)')` — detecta "dispositivo tocado por dedo" em tela pequena. Mais confiável que sniffing de user agent e mais preciso que `max-width` puro (tablet deitado com mouse não dispara).

| ID | Status | Descrição | Critério de aceitação | Depende de |
|---|---|---|---|---|
| **F1** | ⬜ | Responsividade de Teoria: sidebar vira drawer (hambúrguer) em mobile, diagramas de teclado ganham `overflow-x: auto`, topic-body ajusta padding. | - Conteúdo legível em 360px de largura.<br>- Sidebar acessível via toggle.<br>- Sem scroll horizontal no body. | B5 |
| **F2** | ⬜ | Responsividade de Recursos, Index e páginas estáticas novas (Exercícios, Sobre): grids colapsam em coluna, cards reduzem padding, navbar adapta (menu compacto ou wrap). | - Layout legível em 360px.<br>- Sem corte de texto ou cards estourando. | B4, B8 |
| **F3** | ⬜ | Overlay de aviso em Prática: bloco visível em cima do conteúdo principal quando `matchMedia('(pointer: coarse) and (max-width: 900px)')` dispara. Texto: "A Prática requer teclado MIDI físico e tela maior — recomendamos desktop. Continuar mesmo assim?" com botão "Continuar" que dispensa o overlay por sessão (sessionStorage). | - Overlay aparece em celular.<br>- Overlay não aparece em desktop.<br>- Botão dispensa até recarregar. | B6 |
| **F4** | ⬜ | Overlay de aviso em Ferramentas: mesma lógica do F3, texto adaptado (MIDI requer conexão USB/OTG pouco comum em mobile). | - Idem F3, adaptado. | B7 |

---

### 4.5 Itens Registrados para Retomada Futura

Durante o diálogo que gerou este plano, dois itens foram propostos e **conscientemente deixados fora de escopo**, mas registrados no roadmap para eventual retomada quando o custo/benefício mudar:

- **Refatoração das validações duplicadas** (`song-loader.js` e `resources.js`) — ambas seguem o padrão imperativo `errors.push(...)`. Abstrair agora introduziria uma mini-DSL de schema para benefício marginal. Reavaliar quando aparecer uma terceira validação (ex: módulo de Exercícios).
- **Uniformização de `template strings` vs. `createElement`** — `theory.js` usa `innerHTML` com template strings; o restante usa `createElement`. A migração gradual para `shared/dom.js` (item C7) tende a convergir naturalmente. Forçar conversão total agora é custo sem retorno funcional.

---

## 5. Parte II — Limpeza Documental

### 5.1 Princípio

> Documento é útil quando contém informação que **não pode ser deduzida do código** e que **sobreviverá à refatoração**. O resto é duplicação — e duplicação em texto se torna mentira silenciosa quando o código muda.

Três classes de informação merecem documento:

1. **Arquitetura e decisões**: o porquê das escolhas, alternativas consideradas, restrições que moldaram o projeto.
2. **Especificações pedagógicas / de domínio**: como escrevemos teoria musical, critérios de curadoria de recursos, princípios de design — essas regras não aparecem no código.
3. **Diário e histórico**: o que foi feito, quando, por quê. Preserva contexto que `git log` não carrega.

Três classes **não** merecem documento:
1. **Estrutura de arquivos e schemas**: deriváveis do código.
2. **Algoritmos de validação campo-a-campo**: o código de validação é a especificação.
3. **Layouts ASCII de UI**: o CSS + screenshot valem mais que arte-texto, e não desatualizam.

### 5.2 Inventário Atual

| Documento | Linhas | Tipo predominante | Veredito |
|---|---|---|---|
| `architecture.md` | 152 | Arquitetura | **Manter, atualizar** |
| `design.md` | 60 | Princípios de design + paleta | **Manter, enxugar a paleta** (duplica tokens.css) |
| `roadmap.md` | 99 | Planejamento | **Manter** |
| `archive.md` | 422 | Diário/histórico | **Manter, revisar entradas antigas** |
| `theory-spec.md` | 1067 | Pedagogia + catálogo + decisões | **Enxugar drasticamente** |
| `player-spec.md` | 381 | Schema + decisões + UI | **Enxugar drasticamente** |
| `resources-spec.md` | 908 | Curadoria + schema + UI | **Enxugar drasticamente** |

### 5.3 Plano de Limpeza por Documento

#### `theory-spec.md` (1067 → estimado 350–400)

- **Manter**: Princípios pedagógicos (§2), Estrutura de blocos de conteúdo (§3), critérios de qualidade de texto, decisões de arquitetura (§7) com justificativa.
- **Remover ou migrar**: Catálogo completo de módulos com descrição tópico-a-tópico (§5 — o manifesto JSON já é a fonte de verdade; manter apenas uma visão panorâmica). Detalhes de HTML fragments (são convenções — podem ser um parágrafo curto referenciando `content/theory/*.html` como exemplo canônico).
- **Justificativa**: quando um tópico é escrito, a seção dele neste doc fica redundante. O manifesto é a autoridade de "o que existe"; os fragments são a autoridade de "como é escrito".

#### `player-spec.md` (381 → estimado 120–150)

- **Manter**: Decisões de produto (§"Decisões Confirmadas"), tolerância como conceito, princípio de timing em beats, princípio de range fixo, decisão de binário vs. gradação.
- **Remover**: Schema JSON completo com cada campo (duplicado em `song-loader.js`). Layout ASCII do player (duplica com o CSS + visual real). Tabela de cores por estado (duplica com `renderer.js`).
- **Migrar**: Fluxo de configuração do teclado → `architecture.md` seção curta, ou remover (é código em `keyboard-setup.js`).
- **Justificativa**: o schema de música é validado pelo código; se alguém quiser adicionar uma música, lê o JSON de uma existente + a validação retorna erros acionáveis.

#### `resources-spec.md` (908 → estimado 200–250)

- **Manter**: Princípios de curadoria (§2 inteira), Política de idioma, Política de links, Catálogo de categorias com descrição (§4.2 — a taxonomia humana é decisão editorial, não derivável).
- **Remover**: Schema JSON detalhado (§3.2–§3.5 — no código). Estrutura da página (§5 — no CSS + HTML). Componentes visuais (§6 — no CSS). Manutenção (§8 — processo geral pertence ao `archive.md` ou a um `CONTRIBUTING.md` futuro).
- **Justificativa**: ~70% do documento descreve UI e schema que o código entrega.

#### `design.md` (60 → estimado 30–40)

- **Manter**: Filosofia (§"Princípios"), diretrizes de uso (neons nunca em texto, um dominante por contexto).
- **Remover**: Tabela de hex e tokens (duplica `css/base/tokens.css`).
- **Substituir**: "Valores em `tokens.css`. Este documento explica o *porquê* das escolhas, não os valores."

#### `architecture.md` (152 → estimado 150, mas reescrito)

- **Atualizar** após a refatoração para refletir a nova árvore e módulos.
- **Manter** seções sobre APIs do navegador, estratégia `fetch` via HTTP, segurança/CSP.
- **Remover** tabela de scripts por página (duplica com o código) — manter apenas a lista de features e uma linha por uma.

#### `roadmap.md` e `archive.md`

- `roadmap.md`: **manter como está**. É o documento mais vivo e útil do conjunto.
- `archive.md`: **manter**. Revisar apenas a entrada "Catálogo de Músicas" se o que estiver lá duplica `content/songs/catalog.json`.

### 5.4 Bloco G — Limpeza Documental

Executar **após** a refatoração de código (Blocos A–F). O motivo: enxugar spec de algo que está mudando gera trabalho dobrado.

| ID | Status | Descrição | Critério de aceitação | Depende de |
|---|---|---|---|---|
| **G1** | ⬜ | Enxugar `design.md` (remover paleta duplicada com `tokens.css`). | - Paleta não aparece mais como tabela.<br>- Documento explica o *porquê* das escolhas. | B1 |
| **G2** | ⬜ | Enxugar `player-spec.md`. | - ~120–150 linhas finais.<br>- Sem schema JSON repetido.<br>- Sem layout ASCII. | C2 |
| **G3** | ⬜ | Enxugar `theory-spec.md`. | - ~350–400 linhas finais.<br>- Sem catálogo tópico-a-tópico (manifesto é a fonte). | C4 |
| **G4** | ⬜ | Enxugar `resources-spec.md`. | - ~200–250 linhas finais.<br>- Sem schema, estrutura de página ou componentes visuais. | C6 |
| **G5** | ⬜ | Atualizar `architecture.md` (já tocado em E1, validar consistência com os specs enxutos). | - Sem contradição com G1–G4. | E1, G1–G4 |
| **G6** | ⬜ | Revisão cruzada: ler os seis docs em sequência e verificar que não há contradições. | - Nenhuma duplicação ou afirmação conflitante entre docs. | G1–G5 |

---

## 6. Itens Explicitamente Fora de Escopo

Decisões tomadas para manter o plano focado. Todos os itens abaixo podem entrar em rodadas futuras de refatoração se provarem necessário.

| Item | Razão para ficar fora |
|---|---|
| Migrar fragments HTML de teoria para Markdown/JSON | Trade não compensa o ganho; HTML já funciona bem. |
| Introduzir framework/bundler | Fere o pilar da simplicidade. |
| Introduzir biblioteca de validação | `song-loader.js` e `resources.js` estão aceitáveis. |
| Introduzir event emitter no player | Polling via `requestAnimationFrame` está bem. |
| Separar `catalog.html` e `play.html` | Item próprio no `roadmap.md` — absorvido pelo item maior "Refatoração do módulo de Prática". |
| Testes automatizados | Não previstos no projeto. Verificação manual em browser é o método atual. |
| Pipeline de CI/CD | Não previsto. GitHub Pages dispensa. |
| Refatorar as validações para reduzir duplicação | Registrado no `roadmap.md` (Prioridade Baixa) para retomada futura. Ver §4.5. |
| Uniformizar template strings vs. createElement | Registrado no `roadmap.md` (Prioridade Baixa). Migração gradual via `shared/dom.js` (C7) cobre parcialmente. Ver §4.5. |
| Responsividade completa do Player | Mobile não é caso de uso realista para a Prática (depende de MIDI físico e tela grande). Apenas avisamos o usuário — ver Bloco F. |

---

## 7. Apêndice — Decisões de Alinhamento

Registro do diálogo que precedeu este plano. Preservado como contexto para quem ler o documento mais tarde.

| Decisão | Alinhamento |
|---|---|
| **A1** ES modules | Já em uso em todo o projeto. Hospedagem via GitHub Pages. Nenhuma ação específica — só reorganização por pasta. |
| **A2** CSS em três camadas (base/components/pages) | Confirmado. Imports explícitos em cada `<link>`, sem `@import`. |
| **A3** Taxonomia `content/` + `authoring/` (Opção β) | Confirmado. |
| **A4** JS feature-first + `shared/` | Confirmado. |
| **A5** Fragments HTML mantidos | Confirmado. Fora de escopo da refatoração. |
| **A6** Documento com diagramas e critérios de aceitação, sem estimativas de esforço | Confirmado. |
| **A7** Análise pontual dos três arquivos críticos, princípios gerais aos demais, leitura suficiente | Confirmado. |
| **Ponto Adicional 1** Navbar sticky | Incluído como item **B10**. |
| **Ponto Adicional 2** Limpeza documental profunda | Incluído como **Parte II**. |
| **Ponto Adicional 3** Sem regra rígida de "≤ 300 linhas" por arquivo | Substituído por "responsabilidade única e tamanho proporcional". Critérios de aceitação dos itens C2 e C4 ajustados. |
| **Ponto Adicional 4** Responsividade básica (mobile-aware) | Incluído como **Bloco F**. Teoria e Recursos recebem ajustes CSS; Prática e Ferramentas recebem overlay de aviso. |
| **Ponto Adicional 5** Validações e uniformização DOM fora de escopo, registradas no roadmap | Documentado em §4.5 e no `roadmap.md` (Prioridade Baixa). |

---

## 8. Próximos Passos Imediatos

1. Usuário revisa este plano e aprova/ajusta.
2. Após aprovação, execução começa pelo **Bloco A** (itens sem risco visual).
3. Cada item completo → commit dedicado → marcação no plano.
4. Este documento é **deletado** quando o Bloco E é concluído (item E2).
