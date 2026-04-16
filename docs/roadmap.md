# Roadmap — Tyghorn Melody

Backlog de trabalho futuro. Histórico de fases concluídas e decisões tomadas estão em `docs/archive.md`.

---

## Módulo de Teoria Musical

Especificação completa em `docs/theory-spec.md`. Módulo educacional cobrindo do básico absoluto (o que é som) até conceitos intermediários/avançados (campo harmônico, progressões). 11 módulos, 41+ tópicos.

### Fase A — Estrutura e Template

Decisões de arquitetura e implementação do esqueleto técnico. Pré-requisito para todo o conteúdo.

- [x] Decidir estrutura de páginas → **Página shell dinâmica** (`theory.html` + fetch de fragmentos)
- [x] Decidir formato do conteúdo → **HTML fragments** (sem head/body, carregados no shell)
- [x] Decidir implementação de diagramas de teclado → **HTML/CSS** (divs estilizadas + componente JS)
- [x] Manifesto JSON de tópicos (`data/theory-manifest.json` — 11 módulos, 41 tópicos, pré-requisitos)
- [x] Implementar shell HTML (`theory.html`) com container, sidebar, breadcrumb, anterior/próximo
- [x] CSS do módulo de teoria (layout de tópicos, blocos colapsáveis, callouts, diagramas)
- [x] Navegação: índice de módulos/tópicos, breadcrumb, botões anterior/próximo (`js/theory.js`)
- [x] Componente reutilizável de diagrama de teclado (`js/keyboard-diagram.js`)

### Fase B — Conteúdo Fundamental (Módulos 1–3)

Primeiros tópicos. Base conceitual e familiarização com o teclado.

- [ ] Módulo 1: O Que é Música (3 tópicos — som, pilares, notação)
- [ ] Módulo 2: Conhecendo o Teclado (3 tópicos — anatomia, oitavas, postura)
- [ ] Módulo 3: Notas Musicais (3 tópicos — 12 notas, tom/semitom, Dó central)

### Fase C — Conteúdo Intermediário Parte 1 (Módulos 4–5)

Ritmo e leitura — pilares temporais e notação.

- [ ] Módulo 4: Ritmo e Tempo (4 tópicos — pulso, compasso, figuras rítmicas, ponto/ligadura)
- [ ] Módulo 5: Leitura Musical Básica (3 tópicos — pauta, claves, leitura aplicada)

### Fase D — Conteúdo Intermediário Parte 2 (Módulos 6–8)

Intervalos, escalas e acordes — as ferramentas de construção harmônica.

- [ ] Módulo 6: Intervalos (3 tópicos — definição, classificação, aplicação no teclado)
- [ ] Módulo 7: Escalas (5 tópicos — conceito, maior, menores, pentatônica/blues, cromática)
- [ ] Módulo 8: Acordes (5 tópicos — conceito, tríades, inversões, tétrades, cifras)

### Fase E — Conteúdo Avançado (Módulos 9–10)

Campo harmônico e progressões — como tudo se conecta.

- [ ] Módulo 9: Campo Harmônico (3 tópicos — construção, maior/menor, funções harmônicas)
- [ ] Módulo 10: Progressões Harmônicas (3 tópicos — conceito, progressões comuns, cadências)

### Fase F — Exercícios Interativos

Widgets MIDI para exercícios práticos dentro dos tópicos.

- [ ] Widget NoteDetector (detectar nota específica)
- [ ] Widget SequenceChecker (verificar sequência de notas)
- [ ] Widget ChordChecker (verificar acorde)
- [ ] Integrar exercícios nos tópicos relevantes dos Módulos 2–10

### Fase G — Tópicos Avançados (Módulo 11+)

Expansão futura. Sem prazo definido.

- [ ] Módulo 11: Modos Gregos, Modulação, Contraponto, Forma Musical, Dinâmica, Transposição

---

## Backlog Geral

*Outros itens do projeto, independentes do módulo de teoria.*

### Prioridade Alta

- **Refatoração e reorganização do código** — O projeto está crescendo e precisa de uma passada de organização: separar arquivos grandes (ex: `style.css` em módulos por página/componente), revisar nomes e responsabilidades de módulos JS, garantir separação clara de contextos. Objetivo: manutenibilidade a longo prazo sem acumular dívida técnica

### Prioridade Média

- **Separar catálogo e player em páginas distintas** — Atualmente `play.html` alterna entre duas vistas via `hidden`. Separar em `catalog.html` (seleção) e `play.html` (player) tornaria o código mais limpo e a navegação mais explícita. Requer refatoração de `play-app.js` e passagem da música selecionada via storage
- **Novas músicas** — Expandir catálogo (animes, movies, artists). Pelo menos 1 por categoria para diversificar. Usar `tools/midi-to-json.py` para conversão
- **Metrônomo** — Standalone na página de Ferramentas e/ou integrado ao player (Web Audio API)
- **Transposição automática** — Para teclados com menos teclas. Depende do range do teclado configurado
- **Auto-ajuste visual do player ao teclado** — Range visual do canvas adapta ao teclado MIDI configurado em vez do range fixo de 61 teclas. `renderer.setMidiRange()` já aceita range dinâmico; basta `play-app.js` ler o range salvo no localStorage

### Prioridade Baixa

- **Pipeline dual de transcrição (MIDI + PDF)** — Ao converter novas músicas, usar leitura visual de partitura PDF como verificação cruzada do MIDI. Valida notas/ritmos e captura informações que o MIDI não carrega (dinâmicas, articulações, intenção do arranjador). Detalhes em `docs/archive.md` (2026-04-16)
- Exercícios práticos de teclado (escalas, progressões)
- Sistema de progresso e gamificação (conquistas, streaks)
- Gradações de acurácia (timing scoring além de hit/miss — perfect/good/late)
- Feedback sonoro (reprodução de áudio das notas)
- Filtros no catálogo de músicas (por categoria, dificuldade, compatibilidade)
