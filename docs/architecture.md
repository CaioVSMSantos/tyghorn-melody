# Arquitetura — Tyghorn Melody

---

## Visão Geral

Aplicação web estática multi-página. Sem framework, sem bundler, sem servidor backend.

**Runtime:** Navegador moderno (Chrome/Edge recomendados — suporte obrigatório à Web MIDI API).

---

## Estrutura de Páginas

Aplicação multi-página. `index.html` na raiz como ponto de entrada; demais páginas em `pages/`.

| Página | Arquivo | Script | Responsabilidade |
|--------|---------|--------|-----------------|
| Hub | `index.html` | — | Ponto de entrada. Navegação para as demais seções |
| Teoria | `pages/theory.html` | — | Conteúdo educacional de teoria musical |
| Prática | `pages/play.html` | `js/play-app.js` | Player de músicas com acompanhamento MIDI |
| Ferramentas | `pages/tools.html` | `js/tools.js` | Teste de conexão MIDI, utilitários |
| Recursos | `pages/resources.html` | `js/resources.js` | Curadoria de recursos externos para aprofundamento |

**Navegação:** Barra de navegação no topo de todas as páginas — nome do app à esquerda, links às seções à direita. Sem JavaScript necessário.

> **Nota sobre caminhos:** Páginas em `pages/` referenciam recursos compartilhados com `../css/` e `../js/`. O `index.html` na raiz usa `./css/` e `./js/`.

---

## Estrutura de Diretórios

```
tyghorn-melody/
├── index.html              ← Ponto de entrada (hub)
├── CLAUDE.md               ← Diretrizes do assistente
├── css/
│   └── style.css           ← Estilos compartilhados (paleta, componentes, player)
├── js/
│   ├── midi.js             ← Web MIDI API (detecção, hot-plug, parsing)
│   ├── storage.js          ← Persistência localStorage
│   ├── song-loader.js      ← Carregamento e validação de músicas
│   ├── player.js           ← Engine do player (timeline, matching, controles)
│   ├── renderer.js         ← Rendering Canvas 2D (falling notes)
│   ├── play-app.js         ← Orquestração da página de prática
│   └── tools.js            ← Lógica da página de ferramentas
├── pages/
│   ├── theory.html
│   ├── play.html
│   └── tools.html
├── songs/
│   ├── catalog.json        ← Manifesto de músicas disponíveis
│   ├── games/
│   │   ├── stickerbrush-symphony.json
│   │   ├── peaceful-days.json
│   │   └── frogs-theme.json
│   ├── animes/
│   ├── movies/
│   └── artists/
├── midis/
│   ├── index.json          ← Índice de conversões (quais MIDIs já foram convertidos)
│   └── *.mid               ← Arquivos MIDI fonte para conversão
├── tools/
│   └── midi-to-json.py     ← Conversor MIDI→JSON (Python puro, sem deps)
├── data/
│   ├── resources.json     ← Catálogo de recursos externos (categorias + itens)
│   └── (JSONs de teoria musical, escalas, acordes — futuro)
└── docs/
    ├── roadmap.md
    ├── archive.md
    ├── architecture.md
    ├── design.md
    ├── player-spec.md
    ├── theory-spec.md
    └── resources-spec.md
```

---

## Módulos JavaScript

Todos os scripts usam ES modules (`type="module"`).

| Módulo | Dependências | Responsabilidade |
|--------|-------------|-----------------|
| `midi.js` | — | Wrapper da Web MIDI API. Detecção, hot-plug, parsing de mensagens MIDI |
| `storage.js` | — | CRUD no localStorage sob chave `tyghorn-melody`. Validação de estrutura |
| `song-loader.js` | — | Fetch + validação de schema de `catalog.json` e JSONs de músicas |
| `player.js` | — | Engine: timeline baseada em beats, BPM sync, note matching com tolerância configurável (1000/500/250ms), seek, restart |
| `renderer.js` | `midi.js` | Canvas 2D: falling notes, colunas de teclas (range fixo 61 teclas C2–C7), hit line, countdown, tela de fim |
| `play-app.js` | `storage.js`, `song-loader.js`, `player.js`, `renderer.js`, `midi.js` | Orquestra catálogo, seleção de tracks, controles, MIDI, progress bar |
| `tools.js` | `midi.js`, `storage.js` | Teste de conexão MIDI, monitor de notas, estatísticas de sessão, gerenciamento de dados (reset) |
| `resources.js` | — | Carregamento e renderização do catálogo de recursos a partir de JSON |

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

As músicas são arquivos `.json` em `songs/`, organizados por categoria em subpastas. O formato completo está especificado em `docs/player-spec.md`.

**Manifesto:** `songs/catalog.json` lista todas as músicas disponíveis. O JSON completo só é carregado quando o usuário seleciona uma música.

**Carregamento:** Via `fetch()` — funciona em GitHub Pages e servidor local. **Atenção:** `file://` bloqueia `fetch()` por CORS. Para uso local, necessário servidor HTTP (ex: `python -m http.server`).

---

## Segurança

| Medida | Implementação |
|--------|---------------|
| Content Security Policy | `<meta http-equiv="Content-Security-Policy" content="default-src 'self'">` em todas as páginas |
| Sem innerHTML com dados externos | Todo conteúdo dinâmico usa `createElement` + `textContent` |
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
