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
- [ ] Manifesto JSON de tópicos (índice com IDs, nomes, módulos, pré-requisitos — navegação automática)
- [ ] Implementar shell HTML (`theory.html`) com container, sidebar, breadcrumb, anterior/próximo
- [ ] CSS do módulo de teoria (layout de tópicos, blocos colapsáveis, callouts, diagramas)
- [ ] Navegação: índice de módulos/tópicos, breadcrumb, botões anterior/próximo
- [ ] Componente reutilizável de diagrama de teclado (teclas destacadas por cor/nota)

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

### Módulo de Recursos

Especificação completa em `docs/resources-spec.md`. Página de curadoria com 18 categorias de recursos externos (livros, cursos, vídeos, ferramentas, comunidades, entretenimento, etc.). Dados em JSON, render dinâmico, seções colapsáveis.

- [x] Implementar shell HTML (`pages/resources.html`) com navbar atualizada (4 itens)
- [x] Implementar `js/resources.js` (fetch JSON, render, accordion, validação)
- [x] Criar `data/resources.json` com schema de categorias e recursos
- [x] Adicionar card de Recursos no hub (`index.html`)
- [x] Atualizar navbar em todas as páginas existentes (theory, play, tools)
- [x] CSS dos componentes de recursos (accordion, badges, archive)
- [x] Curadoria e pesquisa de recursos reais para todas as 18 categorias (83 recursos)
- [ ] Revisão final de links e disponibilidade

### Prioridade Média

- **Separar catálogo e player em páginas distintas** — Atualmente `play.html` alterna entre duas vistas via `hidden`. Separar em `catalog.html` (seleção) e `play.html` (player) tornaria o código mais limpo e a navegação mais explícita. Requer refatoração de `play-app.js` e passagem da música selecionada via storage
- **Novas músicas** — Expandir catálogo (animes, movies, artists). Pelo menos 1 por categoria para diversificar. Usar `tools/midi-to-json.py` para conversão
- **Upload de MIDI pelo usuário** — Modo livre: carregar .mid no browser, selecionar tracks e praticar sem curadoria. Complementa o catálogo curado
- **Metrônomo** — Standalone na página de Ferramentas e/ou integrado ao player (Web Audio API)
- **Transposição automática** — Para teclados com menos teclas. Depende do range do teclado configurado
- **Auto-ajuste visual do player ao teclado** — Range visual do canvas adapta ao teclado MIDI configurado em vez do range fixo de 61 teclas. `renderer.setMidiRange()` já aceita range dinâmico; basta `play-app.js` ler o range salvo no localStorage

### Prioridade Baixa

- Exercícios práticos de teclado (escalas, progressões)
- Sistema de progresso e gamificação (conquistas, streaks)
- Gradações de acurácia (timing scoring além de hit/miss — perfect/good/late)
- Feedback sonoro (reprodução de áudio das notas)
- Filtros no catálogo de músicas (por categoria, dificuldade, compatibilidade)
