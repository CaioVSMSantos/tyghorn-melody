# Arquitetura — Tyghorn Melody

---

## Visão Geral

Aplicação web estática multi-página. Sem framework, sem bundler, sem servidor backend.

**Runtime:** Navegador moderno (Chrome/Edge recomendados — suporte obrigatório à Web MIDI API).

---

## Estrutura de Páginas

Aplicação multi-página. `index.html` na raiz como ponto de entrada; demais páginas em `pages/`.

| Página | Arquivo | Responsabilidade |
|--------|---------|-----------------|
| Hub | `index.html` | Ponto de entrada. Navegação para as demais seções |
| Teoria | `pages/theory.html` | Shell dinâmico: manifesto, sidebar, roteamento por hash, fetch de HTML fragments |
| Prática | `pages/play.html` | Player de músicas com acompanhamento MIDI |
| Exercícios | `pages/exercises.html` | *(Em construção)* Exercícios de teoria e prática |
| Ferramentas | `pages/tools.html` | Teste de conexão MIDI, configuração de teclado, gerenciamento de dados |
| Recursos | `pages/resources.html` | Curadoria de recursos externos para aprofundamento |
| Sobre | `pages/about.html` | *(Em construção)* Contexto e motivação do projeto |

**Navegação:** Barra de navegação no topo de todas as páginas — nome do app à esquerda, links às seções à direita. Sem JavaScript necessário.

> **Nota sobre caminhos:** Páginas em `pages/` referenciam recursos compartilhados com `../css/`, `../js/`, `../content/`. O `index.html` na raiz usa `./css/` e `./js/`.

---

## Estrutura de Diretórios

```
tyghorn-melody/
├── index.html              ← Ponto de entrada (hub)
├── CLAUDE.md               ← Diretrizes do assistente
├── README.md
│
├── pages/                  ← Páginas HTML (sem index)
│   ├── theory.html
│   ├── play.html
│   ├── exercises.html
│   ├── tools.html
│   ├── resources.html
│   └── about.html
│
├── css/
│   ├── base/               ← Obrigatória em toda página (tokens, reset, utilities)
│   ├── components/         ← Reutilizáveis entre páginas (navbar, buttons, badges, ...)
│   └── pages/              ← Específicos por página (theory, play, tools, resources)
│
├── js/
│   ├── shared/             ← Transversal: midi, storage, dom helpers, note-utils
│   ├── play/               ← Módulo de Prática (orquestrador + engine + controles + bridge MIDI)
│   ├── theory/             ← Módulo de Teoria (shell + manifest + sidebar + topic-view + diagrama)
│   ├── tools/              ← Módulo de Ferramentas (monitor + setup de teclado + data mgmt)
│   └── resources/          ← Módulo de Recursos (validator + view)
│
├── content/                ← Assets consumidos pelo navegador em runtime
│   ├── theory/             ← HTML fragments dos tópicos (1-1.html, 2-1.html, ...)
│   ├── songs/              ← catalog.json + games/animes/movies/artists/
│   ├── data/               ← theory-manifest.json, resources.json
│   └── images/             ← Imagens ilustrativas (theory/, futuros subcontextos)
│
├── authoring/              ← Fontes de autoria (não carregadas pelo app)
│   ├── midis/              ← *.mid + index.json (índice de conversões)
│   └── sheets/             ← Partituras PDF de referência
│
├── tools/                  ← Ferramentas internas
│   └── midi-to-json.py     ← Conversor MIDI→JSON (Python puro, sem deps)
│
└── docs/                   ← Documentação do projeto
    ├── roadmap.md
    ├── archive.md
    ├── architecture.md
    ├── design.md
    ├── player-spec.md
    ├── theory-spec.md
    └── resources-spec.md
```

**Separação `content/` vs `authoring/`:** `content/` é tudo que o navegador consome via `fetch()` ou `src=`. `authoring/` é fonte humana/de ferramenta (MIDI cru, PDF de partitura) — entrada do `tools/midi-to-json.py`, cujo produto (JSON da música) vive em `content/songs/`. Nenhum código runtime acessa `authoring/`.

---

## Módulos JavaScript

Todos os scripts usam ES modules (`type="module"`). Organização por feature — cada diretório é auto-contido exceto pela dependência em `shared/`.

| Feature | Localização | Responsabilidade |
|---------|-------------|------------------|
| Shared | `js/shared/` | Web MIDI API (`midi.js`), localStorage (`storage.js`), helpers de DOM (`dom.js`), conversão de notas (`note-utils.js`). |
| Prática | `js/play/` | Orquestrador (`play-app.js` via `createPlayApp`), engine de timeline (`player.js`), Canvas (`renderer.js`), catálogo, seleção de faixas, controles, bridge MIDI, loader de música. |
| Teoria | `js/theory/` | Shell (`theory.js` via `createTheoryShell`), carregamento do manifesto, sidebar de navegação, topic view (skeleton + breadcrumb + prerequisites + nav), diagrama de teclado (`keyboard-diagram.js`). |
| Ferramentas | `js/tools/` | Orquestrador (`tools.js` via `createToolsApp`), monitor MIDI (log de notas + stats), fluxo de configuração de teclado, gerenciamento de dados (reset de localStorage). |
| Recursos | `js/resources/` | Orquestrador (`resources.js`), validador puro de schema, renderização do catálogo com accordion. |

Cada feature segue padrão de **factory** para estado mutável (ex: `createPlayApp()` encapsula `player`, `renderer`, `animationId`) e **módulos stateless** (recebem `dom` + handlers injetados) para as camadas de vista e controle.

---

## Estilos CSS

CSS dividido em três camadas, todas carregadas explicitamente via `<link>` (sem `@import` — cada página documenta seu consumo no próprio HTML):

- **`css/base/`** — Obrigatória em toda página. Tokens (custom properties), reset tipográfico, utilitários (`.text-cyan`, `.text-muted`, `.container`, etc).
- **`css/components/`** — Componentes reutilizáveis entre páginas (navbar, footer, buttons, badges, panels, callouts, accordion, stats-grid, hub-cards, under-construction, keyboard-diagram, page-header).
- **`css/pages/`** — Específicos de cada página (layout do player, sidebar de teoria, setup de ferramentas, accordion de recursos).

**Ordem de import**: tokens → reset → utilities → components (conforme uso) → pages. Cascata previsível, sem override inesperado.

**Tokens e Canvas:** A paleta mora em `css/base/tokens.css` como custom properties. [js/play/renderer.js](../js/play/renderer.js) lê os tokens via `getComputedStyle(document.documentElement)` — alterar um token reflete tanto no CSS quanto no rendering de falling notes, sem duplicação.

**Navbar sticky:** `position: sticky; top: 0` definido em `components/navbar.css`, com altura reservada via token `--navbar-height` (usado por `.player-layout` e `.theory-sidebar` para evitar sobreposição).

---

## APIs do Navegador Utilizadas

| API | Uso | Suporte |
|-----|-----|---------|
| Web MIDI API | Leitura de teclado MIDI conectado | Chrome, Edge, Opera (não Firefox, não Safari) |
| Web Audio API | Metrônomo, reprodução de sons (futuro) | Universal |
| localStorage | Persistência de preferências e progresso do usuário | Universal |
| Canvas 2D | Rendering de falling notes no player | Universal |

---

## Músicas em JSON

As músicas são arquivos `.json` em [`content/songs/`](../content/songs/), organizados por categoria em subpastas. O **contrato dos campos** é validado por [`js/play/song-loader.js`](../js/play/song-loader.js) — a mensagem de erro do validador, quando algum campo falha, é a especificação operacional. As **decisões de produto** atrás do formato (timing em beats, range fixo, tolerância configurável) vivem em [`docs/player-spec.md`](player-spec.md).

**Manifesto:** [`content/songs/catalog.json`](../content/songs/catalog.json) lista todas as músicas disponíveis. O JSON completo só é carregado quando o usuário seleciona uma música.

**Carregamento:** via `fetch()` — funciona em GitHub Pages e servidor local. **Atenção:** `file://` bloqueia `fetch()` por CORS. Para uso local, necessário servidor HTTP (ex.: `python -m http.server`).

---

## Segurança

| Medida | Implementação |
|--------|---------------|
| Content Security Policy | `<meta http-equiv="Content-Security-Policy" content="default-src 'self'">` em todas as páginas |
| Sem innerHTML com dados externos | Todo conteúdo dinâmico usa `createElement` + `textContent`. Exceção: o shell de teoria insere HTML fragments via `innerHTML` — conteúdo do próprio domínio (restrito por CSP `default-src 'self'`) |
| Scripts externos proibidos | CSP `default-src 'self'` bloqueia scripts de terceiros |
| Sem inline scripts | Todos os scripts em arquivos `.js` separados (conformidade CSP) |

---

## Informações MIDI Disponíveis via Web MIDI API

Ao solicitar acesso MIDI (`navigator.requestMIDIAccess()`), o navegador expõe:

**Sobre o dispositivo (por porta de entrada/saída):**
- `name` — Nome do dispositivo (geralmente modelo, ex: "CASIO USB-MIDI")
- `manufacturer` — Fabricante (quando informado pelo dispositivo)
- `id` — Identificador único da porta
- `state` — Estado da conexão (`connected` / `disconnected`)

**Mensagens MIDI recebidas em tempo real:**
- Note On / Note Off — qual tecla, com qual velocidade (intensidade)
- Control Change — pedais, knobs, sliders
- Program Change, Pitch Bend, etc.

> **Nota:** A qualidade das informações do dispositivo depende do fabricante. Alguns teclados reportam nome e fabricante detalhados; outros enviam apenas um nome genérico. A leitura de teclas (Note On/Off) é universalmente confiável.
