# Roadmap — Tyghorn Melody

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

---

## Backlog Ativo

*Itens prontos para execução. Cada item deve ser independente e entregável.*

### Fase 1 — Fundação + Teste MIDI ✔

Objetivo: estabelecer a base visual e técnica do projeto e entregar a primeira funcionalidade utilizável.

- [x] **CSS Foundation** — `css/style.css` com reset, paleta synthwave (custom properties), tipografia, nav bar, painéis, badges, monitor MIDI
- [x] **HTML Skeleton** — Nav bar + container. `index.html` como hub com cards para Teoria, Prática e Ferramentas
- [x] **Teste de Conexão MIDI** — `pages/tools.html` + `js/midi.js` (ES module). Detecta suporte do navegador, lista dispositivos, hot-plug, monitor de teclas em tempo real

> Validado pelo usuário em 2026-04-13.

### Fase 2 — Player de Prática (MVP) ✔

Especificação em `docs/core/player-spec.md`.

**Módulos implementados:**

- [x] `js/storage.js` — Persistência localStorage (keyboard, preferences, progress)
- [x] `songs/catalog.json` — Manifesto com lista de músicas disponíveis
- [x] `js/song-loader.js` — Carregamento, validação completa de schema e parsing
- [x] `js/player.js` — Engine (timeline, BPM sync, note matching ±150ms, seek, restart, lead-in)
- [x] `js/renderer.js` — Rendering Canvas 2D (falling notes, teclas brancas/pretas, destaque C, countdown)
- [x] `js/play-app.js` — Orquestração da página (catálogo, seleção, controles, MIDI status)
- [x] `pages/play.html` — Catálogo de músicas + interface do player
- [x] `css/style.css` — Estilos para player, track groups, progress bar, MIDI status, catalog cards
- [x] Progresso por música — `bestAccuracy` e `timesPlayed` via localStorage

**Músicas transcritas:**

- [x] Stickerbrush Symphony (DKC2) — 192 beats, 3 tracks, Bb maior
- [x] Peaceful Days (Chrono Trigger) — 128 beats, 3 tracks, C maior

**Funcionalidades do player:**

- [x] Seleção de tracks por mão via radio groups (mutuamente exclusivas por mão)
- [x] Controle de velocidade (0.25x a 2.0x, incrementos de 0.25x)
- [x] Lead-in countdown de 4 beats antes da primeira nota
- [x] Seek bar clicável com display de tempo
- [x] Botão de reiniciar
- [x] MIDI status no header + botão de reconexão
- [x] Distinção visual teclas brancas/pretas + destaque notas C
- [x] Tela de fim com acurácia final
- [x] Aviso de range incompatível (compara com teclado configurado)

**Pendente (não-bloqueante):**

- [ ] Configuração de teclado — Fluxo de detecção de range (tools.html) + persistência

### Fase 2.5 — Refinamentos do Player ✔

Ajustes baseados em testes reais pelo usuário. Foco em usabilidade e conforto.

- [x] **Tolerância configurável** — 3 níveis (Fácil 1000ms, Médio 500ms, Preciso 250ms) com radio buttons na barra de tracks. Preferência salva no localStorage. Alterável em tempo real sem reiniciar a música
- [x] **Zona visual de tolerância** — Gradiente amarelo abaixo da hit line que representa visualmente a janela de tolerância ativa
- [x] **Teclas pretas menores** — Colunas de fundo e notas caindo para teclas pretas renderizadas a ~40% da largura das brancas. Fundo mais escuro para maior contraste
- [x] **Ícones de mãos** — 🔴🫲 Mão Esquerda / 🟢🫱 Mão Direita (cor + direção para distinção visual)
- [x] **Gerenciamento de dados** — Seção na página de Ferramentas: "Limpar Progresso" e "Redefinir Tudo" com confirmação de segurança
- [x] **Funções de reset** — `clearProgress()` e `resetAll()` no `storage.js`

### Fase 3 — MIDIs Reais + Range 61 Teclas ✔

Transcrições refeitas a partir de arquivos MIDI reais. Player padronizado para 61 teclas.

**Ferramenta de conversão:**

- [x] `tools/midi-to-json.py` — Conversor MIDI→JSON (Python puro, sem dependências). Comandos: `analyze`, `convert`, `status`
- [x] `midis/index.json` — Índice de conversões (parâmetros usados, data, song ID)
- [x] Quantização para semicolcheias (0.25 beats), transposição de notas fora do range, deduplicação, resolução de overlaps
- [x] Geração automática de versões simplificadas (filtro por tempos fortes) e standard (completa)
- [x] Atualização automática de `songs/catalog.json` e `midis/index.json` após conversão

**Range do player:**

- [x] Range fixo de 61 teclas (C2–C7, MIDI 36–96) no renderer — layout consistente entre músicas
- [x] Notas fora do range transpostas por oitava durante a conversão

### Músicas

| Música | Origem | Categoria | Dificuldade | Beats | Tracks | Fonte | Status |
|--------|--------|-----------|-------------|-------|--------|-------|--------|
| Stickerbrush Symphony | Donkey Kong Country 2 | games | intermediate | 420 | 4 (2R + 2L) | MIDI | ✔ Re-transcrita |
| Peaceful Days | Chrono Trigger | games | beginner | 220 | 4 (2R + 2L) | MIDI | ✔ Re-transcrita |
| Frog's Theme | Chrono Trigger | games | intermediate | 288 | 4 (2R + 2L) | MIDI | ✔ Nova |

---

## Backlog a Especificar

*Itens identificados mas que precisam de detalhamento antes de entrar no backlog ativo. Ordenados por prioridade recomendada.*

### Prioridade Alta (próximas fases)

- **Configuração de teclado MIDI** ✔ — Fluxo guiado implementado em `tools.html`. Range salvo no localStorage via `storage.js`. Auto-ajuste visual do player ao teclado detectado pendente (backlog médio)
- **Catálogo de recursos externos** — Nova página/card no hub: cursos, vídeos, partituras, lojas de instrumentos, comunidades. Curadoria manual com links e descrições
- **Módulo de teoria musical** — Conteúdo sintetizado sobre notas, escalas, acordes, tempo, ritmo, leitura de partituras. Base conceitual para o aprendizado

### Prioridade Média

- **Separar catálogo e player em páginas distintas** — Atualmente `play.html` alterna entre duas vistas via `hidden`. Separar em `catalog.html` (seleção) e `play.html` (player) tornaria o código mais limpo e a navegação mais explícita (botão Voltar vira link nativo do browser). Requer refatoração de `play-app.js` e passagem da música selecionada via `localStorage` ou `sessionStorage`.
- **Novas músicas** — Expandir catálogo (animes, movies, artists). Pelo menos 1 por categoria para diversificar. Usar `tools/midi-to-json.py` para conversão
- **Upload de MIDI pelo usuário** — Modo livre: carregar .mid no browser, selecionar tracks e praticar sem curadoria. Complementa o catálogo curado
- **Metrônomo** — Standalone na página de Ferramentas e/ou integrado ao player (Web Audio API)
- **Transposição automática** — Para teclados com menos teclas. Requer configuração de teclado implementada primeiro

### Prioridade Baixa (futuro)

- Exercícios práticos de teclado (escalas, progressões)
- Sistema de progresso e gamificação (conquistas, streaks)
- Gradações de acurácia (timing scoring além de hit/miss — perfect/good/late)
- Feedback sonoro (reprodução de áudio das notas)
- Filtros no catálogo de músicas (por categoria, dificuldade, compatibilidade)
