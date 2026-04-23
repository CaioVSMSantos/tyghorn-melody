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

- [x] Módulo 1: O Que é Música (3 tópicos — som, pilares, notação)
- [x] Módulo 2: Conhecendo o Teclado (3 tópicos — anatomia, oitavas, postura e dedilhado)
- [ ] Módulo 3: Notas Musicais (3 tópicos — 12 notas, tom/semitom, Dó central)

### Fase C — Conteúdo Intermediário Parte 1 (Módulos 4–5)

Ritmo e leitura — pilares temporais e notação.

- [ ] Módulo 4: Ritmo e Tempo (4 tópicos — pulso, compasso, figuras rítmicas, ponto/ligadura)
- [ ] Módulo 5: Leitura Musical Básica (3 tópicos — pauta, claves, leitura aplicada)
- [ ] Componente reutilizável de mini-partitura (SVG manual) — primeira prova de conceito no Módulo 5. Ver decisão D4 em `docs/theory-spec.md`
- [ ] Integrar fonte Bravura localmente para símbolos musicais inline — preparar antes do Módulo 5. Ver decisão D4 em `docs/theory-spec.md`

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

- **Refatoração do módulo de Prática** — Retomada profunda do módulo após a refatoração estrutural. Três frentes: (a) **pipeline robusto de transcrição** combinando MIDI e partitura (visão cruzada para validar notas/ritmos e capturar o que o MIDI isolado não carrega — dinâmicas, articulações, intenção do arranjador); (b) **seletor de músicas melhorado** — catálogo com filtros (categoria, dificuldade, compatibilidade com o range do teclado), preview, informações de origem mais ricas; (c) **revisão do Player** — separação `catalog.html` / `play.html`, reavaliação da arquitetura interna, eventual transposição automática e range dinâmico do canvas. Engloba e substitui os itens antigos "Separar catálogo e player", "Pipeline dual de transcrição" e "Filtros no catálogo". Requer especificação própria antes da execução
- **Módulo de Exercícios (técnica e condicionamento)** — Novo módulo dedicado à preparação física e técnica do tecladista: postura ao instrumento, posicionamento e formato das mãos, independência e relaxamento dos dedos, rotinas de aquecimento, ganho progressivo de velocidade e resistência, prevenção de lesões por esforço repetitivo (LER/DORT) e sinais de alerta. Escopo complementar ao módulo de Teoria: enquanto a Teoria responde "o que tocar", Exercícios responde "como treinar o corpo para tocar". Requer especificação própria (`docs/exercises-spec.md`) antes da implementação — estrutura de páginas, formato do conteúdo, eventuais exercícios interativos com MIDI (ex: verificação de padrões de dedilhado)
  - **Nota — métodos Hanon e Czerny:** avaliar inclusão (total, parcial ou apenas referencial) dos métodos técnicos clássicos durante a especificação. **Charles-Louis Hanon** (1819–1900) publicou em 1873 *The Virtuoso Pianist in 60 Exercises*, focado em força, agilidade e independência dos dedos — amplamente usado, mas controverso: alguns pedagogos modernos apontam risco de LER se o padrão repetitivo for mal executado. **Carl Czerny** (1791–1857), aluno de Beethoven e professor de Liszt, escreveu vasta coleção de estudos progressivos (op. 299 *School of Velocity*, op. 740 *The Art of Finger Dexterity*, op. 849), considerada padrão histórico do ensino pianístico. Ambos são de domínio público. A decisão final virá com a especificação do módulo
- **Revisão textual e factual do Módulo de Teoria Musical** — Revisão aprofundada, feita por partes de forma focada, para garantir (a) veracidade factual das informações apresentadas (datas, atribuições históricas, afirmações teóricas, etimologias), (b) concisão e clareza do texto, (c) consistência terminológica entre tópicos e (d) qualidade gramatical e de estilo. A revisão acontecerá tópico a tópico, com foco direcionado a cada rodada, e deverá anteceder a declaração de "conclusão" de qualquer fase de conteúdo.
  - **Nota especial — uso de travessões:** há uso abusivo de travessões (—) nos textos atuais, frequentemente substituindo vírgulas comuns apenas por efeito estilístico. A revisão deve podar travessões, mantendo-os apenas em três casos: (a) aposto com ênfase genuína, (b) quebra abrupta de pensamento ou (c) introdução de conclusão incisiva. Nos demais casos, substituir por vírgula, parênteses, dois-pontos ou ponto final, conforme a situação

### Prioridade Média

- **Módulo Sobre (incluindo Patch Notes)** — Página dedicada a informações gerais sobre o Tyghorn Melody (o que é, propósito, pilares) e uma seção de **Patch Notes** com histórico de mudanças relevantes ao usuário final. Conteúdo escrito para o usuário, não para o desenvolvedor — distingue-se de `docs/archive.md`, que é registro técnico interno. Placeholder "Em Construção" criado em `pages/about.html`; conteúdo real a ser escrito em rodada dedicada
- **Novas músicas** — Expandir catálogo (animes, movies, artists). Pelo menos 1 por categoria para diversificar. Usar `tools/midi-to-json.py` enquanto o pipeline atual vigora; depois da refatoração do módulo de Prática, usar o novo pipeline
- **Metrônomo** — Standalone na página de Ferramentas e/ou integrado ao player (Web Audio API)

### Prioridade Baixa

- **Refatoração das validações duplicadas** — `song-loader.js` e `resources.js` seguem o padrão imperativo `errors.push(...)`. Abstrair agora introduziria uma mini-DSL de schema para ganho marginal (~40% de linhas). Reavaliar quando aparecer uma terceira validação (ex: módulo de Exercícios) — aí o benefício passa a superar o custo da abstração. Decisão registrada em `docs/refactoring-plan.md` §4.5
- **Uniformização de template strings vs. createElement** — `theory.js` usa `innerHTML` com template strings; o restante usa `createElement`. A migração gradual para `shared/dom.js` (item C7 do plano de refatoração) tende a convergir o estilo ao longo do tempo. Forçar conversão total agora é custo sem retorno funcional. Decisão registrada em `docs/refactoring-plan.md` §4.5
- **Responsividade completa do Player** — O Bloco F do plano de refatoração apenas avisa o usuário via overlay em mobile. Tornar o canvas de notas caindo responsivo de verdade exige trabalho significativo para um caso de uso marginal (MIDI em celular é incomum). Reabrir apenas se demanda real aparecer
- Exercícios práticos de teclado (escalas, progressões)
- Sistema de progresso e gamificação (conquistas, streaks)
- Gradações de acurácia (timing scoring além de hit/miss — perfect/good/late)
- Feedback sonoro (reprodução de áudio das notas)
