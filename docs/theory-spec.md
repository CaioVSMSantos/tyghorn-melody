# Especificação — Módulo de Teoria Musical

> **Escopo deste documento:** registra princípios pedagógicos, estrutura editorial e decisões de arquitetura. O catálogo vivo de módulos e tópicos (IDs, ordem, pré-requisitos) é a fonte de verdade em [`content/data/theory-manifest.json`](../content/data/theory-manifest.json); o texto efetivo de cada tópico vive em [`content/theory/*.html`](../content/theory/). Este documento ilumina o *como* e o *porquê*, não o *o quê* nota a nota.

---

## 1. Visão Geral

Módulo educacional do Tyghorn Melody dedicado ao ensino de teoria musical e fundamentos do teclado. Público-alvo: iniciantes absolutos, sem conhecimento musical prévio.

Organizado em uma sequência linear de **Módulos** (capítulos) compostos por **Tópicos** (lições). A numeração indica ordem recomendada de estudo, mas nenhum tópico é bloqueante — o usuário pode acessar qualquer conteúdo livremente.

### Objetivos

- Ensinar fundamentos de teoria musical de forma acessível e prática
- Relacionar cada conceito teórico ao teclado musical
- Oferecer profundidade progressiva (conceito básico → aprofundamento → contexto histórico)
- Integrar exercícios práticos, incluindo interação via MIDI quando relevante
- Cobrir do absoluto zero (o que é som) até intermediário/avançado (campo harmônico, progressões, modos)

### Escopo por Nível

| Nível | Módulos | Descrição |
|-------|---------|-----------|
| Iniciante | 1–5 | Fundamentos: som, teclado, notas, ritmo, leitura básica |
| Intermediário | 6–8 | Construção: intervalos, escalas, acordes |
| Intermediário–Avançado | 9–10 | Harmonia: campo harmônico, progressões |
| Avançado | 11+ | Expansão futura: modos, modulação, contraponto |

---

## 2. Princípios Pedagógicos

### 2.1 Linearidade sem Bloqueio

Conteúdo organizado em ordem recomendada (pela numeração), mas sem pré-requisitos obrigatórios. A numeração serve como guia, não como trava. Cada tópico indica seus pré-requisitos sugeridos para que o leitor saiba o que facilitaria a compreensão.

### 2.2 Conceito Primeiro, Profundidade Depois

Cada tópico apresenta o essencial de forma direta no bloco **Conceito**. Quem deseja mais pode expandir os blocos opcionais (**Aprofundamento**, **Contexto Histórico**). A leitura mínima (Conceito) deve ser suficiente para compreender e aplicar.

### 2.3 Linguagem

- Simples, direta e neutra
- Sem metáforas, comparações forçadas ou figuras de linguagem desnecessárias
- Tom pedagógico: explicar com clareza, não impressionar com jargão
- Termos técnicos inevitáveis devem ser definidos imediatamente no contexto de uso
- Honesta: não simplificar a ponto de distorcer — se algo é complexo, dizer que é complexo e explicar com cuidado

### 2.4 Múltiplas Representações

Conceitos complexos devem ser explicados de mais de uma forma quando necessário: texto + diagrama de teclado; texto + tabela estruturada; definição formal + exemplo concreto; representação visual + descrição verbal. Informações particularmente densas podem receber até três formas de explicação.

### 2.5 Conexão com o Teclado

Sempre que possível, demonstrar como o conceito se manifesta no teclado. Diagramas visuais são recurso primário. Exemplos no teclado fazem parte do bloco **Conceito** — o conceito teórico e sua manifestação no instrumento são inseparáveis.

### 2.6 Progressão Natural

Cada tópico pode referenciar e se apoiar em conceitos anteriores, criando camadas de conhecimento. Referências cruzadas explícitas (links) ajudam o usuário a revisar fundamentos quando necessário.

---

## 3. Estrutura

### 3.1 Hierarquia

```
Módulo (capítulo) → Tópico (lição) → Bloco (seção)
```

- **Módulo** — agrupa tópicos por tema amplo (ex.: "Escalas"). Possui título, descrição breve e indicador de nível
- **Tópico** — unidade de estudo autocontida sobre um conceito específico. Deve ser consumível em uma sessão de estudo (15–30 minutos)
- **Bloco** — seção dentro de um tópico (ex.: "Conceito", "Exercícios")

**Numeração:** `M.T` — módulo.tópico (ex.: 7.2 = Módulo 7, Tópico 2).

### 3.2 Blocos de Conteúdo

Cada tópico é composto pelos seguintes blocos, na ordem apresentada:

| Bloco | Obrigatório | Descrição |
|-------|-------------|-----------|
| **Neste Tópico** | Recomendado | Lista curta (3–5 itens) do que será aprendido. Preview e referência rápida para revisão. Pode ser omitido em tópicos muito curtos |
| **Conceito** | Sim | Núcleo do tópico. Explica o quê, por quê e como. Inclui exemplos visuais (diagramas, tabelas, listas) integrados ao texto |
| **Aprofundamento** | Não | Expansão para quem deseja ir além. Conecta a outros conhecimentos, explora nuances e variações. Colapsável por padrão |
| **Contexto Histórico** | Não | Origem e evolução do conceito. Como e por que surgiu. Colapsável por padrão. Incluir apenas quando houver conteúdo genuinamente relevante |
| **Exercícios** | Quando relevante | Atividades práticas para fixar o conceito. Mix de exercícios textuais e interativos (MIDI). Nem todo tópico precisa |
| **Navegação** | Sim | Links para pré-requisitos sugeridos, próximo tópico na sequência, e tópicos relacionados |

> **Diretriz geral de profundidade (decisão 2026-04-15):** Todo conteúdo deve ser completo, explicativo e abordar o assunto por múltiplos ângulos. Não simplificar excessivamente nem temer extensão quando ela serve à compreensão genuína. O leitor é leigo em música mas capaz de absorver conteúdo denso — a profundidade é um valor, não um problema. Aplica-se a todos os blocos, com ênfase especial no Aprofundamento.

**Conceito** — explicações completas e auto-suficientes. Abordar por diferentes ângulos (definição + exemplo concreto + analogia + representação visual). Parágrafos curtos, listas, subtítulos, tabelas — usar a estrutura que melhor serve cada parte. Não temer extensão: 15 parágrafos que explicam bem vencem 3 que deixam dúvidas.

**Aprofundamento** — mergulho real. Técnico pesado, filosófico, conexões interdisciplinares. Este é o espaço para a "viagem a mais" que vai além do operacional. Maior densidade esperada — o leitor optou conscientemente. Conectar a conceitos amplos (física, matemática, psicologia, filosofia), explorar casos especiais, exceções, debates teóricos. Pode referenciar tópicos futuros como "preview".

**Contexto Histórico** — narrativa completa, não nota de rodapé decorativa. Personagens, datas, evolução, impacto. Focar em "por que as coisas são como são" — conectar passado ao presente. OK não incluir se o tópico não tem história genuinamente interessante.

**Exercícios** — exercícios textuais (quiz, identificação) usando `<details>/<summary>` nativo — pergunta visível, resposta colapsada. Podem incluir escuta ativa (praticar com músicas reais). Todo exercício MIDI deve ter alternativa textual/visual para usuários sem teclado conectado. Progressão: quiz simples → identificação → tocar notas → sequências → acordes.

### 3.3 Recursos Visuais

| Recurso | Quando Usar |
|---------|-------------|
| Diagrama de teclado | Notas, intervalos, escalas, acordes |
| Tabela | Comparações, fórmulas, classificações |
| Lista ordenada | Sequências, passos, procedimentos |
| Lista não-ordenada | Características, propriedades |
| Destaque (callout) | Definições-chave, dicas, alertas |
| Notação simplificada | Figuras rítmicas, duração |
| Exemplos lado a lado | Comparação direta |

**Diagramas de teclado** são o recurso visual primário. Implementação em HTML/CSS via [`js/theory/keyboard-diagram.js`](../js/theory/keyboard-diagram.js) — ver decisão D3 na §6.

---

## 4. Exercícios Interativos

### 4.1 Tipos de Exercício

| Tipo | Descrição | Requer MIDI | Complexidade |
|------|-----------|-------------|--------------|
| Quiz | Múltipla escolha ou verdadeiro/falso | Não | Baixa |
| Identificação visual | "Qual nota está destacada no teclado?" | Não | Baixa |
| Toque uma nota | Pressione a nota indicada | Sim | Baixa |
| Toque uma sequência | Pressione notas em ordem específica | Sim | Média |
| Toque um acorde | Pressione notas simultaneamente | Sim | Média |
| Toque uma escala | Pressione todos os graus da escala | Sim | Média |
| Ritmo | Pressione teclas no tempo correto | Sim | Alta |

### 4.2 Widgets MIDI

Componentes simples e reutilizáveis, independentes do player de prática. Compartilham o [`midi.js`](../js/shared/midi.js) para acesso MIDI, mas possuem lógica própria e simplificada.

**Planejados:**

- **NoteDetector** — aguarda uma nota MIDI específica. Feedback visual imediato. Uso: "Toque a nota Ré"
- **SequenceChecker** — aguarda sequência em ordem. Progresso visual nota a nota. Uso: "Toque a escala de Dó Maior subindo"
- **ChordChecker** — aguarda múltiplas notas simultâneas. Uso: "Toque o acorde de Sol Maior"

Estes widgets **não** incluem lógica de timing, scoring, falling notes ou qualquer funcionalidade do player — são verificadores simples de entrada MIDI.

### 4.3 Fallback sem MIDI

Usuários sem teclado conectado:

- Exercícios MIDI exibem instrução equivalente textual ("No teclado, toque C-E-G simultaneamente")
- Quiz e identificação visual funcionam normalmente
- Indicação clara de quais exercícios são MIDI-exclusivos

---

## 5. Visão Panorâmica dos Módulos

A estrutura de tópicos (IDs, ordem, pré-requisitos, status de escrita) vive no manifesto. Esta seção enquadra a **tese pedagógica** de cada módulo — o papel que ele desempenha na progressão e as decisões editoriais específicas que o moldam.

| Módulo | Nome | Nível | Tópicos | Tema Central |
|--------|------|-------|---------|--------------|
| 1 | O Que é Música | Iniciante | 3 | Fundamentos conceituais |
| 2 | Conhecendo o Teclado | Iniciante | 3 | O instrumento |
| 3 | Notas Musicais | Iniciante | 3 | As 12 notas e suas relações |
| 4 | Ritmo e Tempo | Iniciante | 4 | Organização temporal |
| 5 | Leitura Musical Básica | Iniciante–Interm. | 3 | Notação em pauta |
| 6 | Intervalos | Intermediário | 3 | Distância entre notas |
| 7 | Escalas | Intermediário | 5 | Sequências de notas |
| 8 | Acordes | Intermediário | 5 | Notas simultâneas |
| 9 | Campo Harmônico | Interm.–Avançado | 3 | Acordes de uma tonalidade |
| 10 | Progressões Harmônicas | Interm.–Avançado | 3 | Sequências de acordes |
| 11 | Tópicos Avançados | Avançado | 6+ | Expansão futura |

**Total: 41+ tópicos** (35 no escopo principal + 6+ avançados).

---

### Módulo 1 — O Que é Música

Puramente conceitual — não requer teclado. Estabelece o vocabulário absolutamente básico (som, silêncio, melodia/harmonia/ritmo, notação) antes de qualquer contato com o instrumento. Ponto de entrada seguro para leitores que nunca pensaram em música de forma estruturada.

### Módulo 2 — Conhecendo o Teclado

Primeiro contato com o instrumento físico: anatomia (brancas/pretas, padrão 2+3), oitavas, postura e dedilhado básico. Ponte da teoria para a prática.

> **Decisão 2026-04-17 — Relação com o Módulo de Exercícios:** O tópico 2.3 (Postura e Dedilhado) deve apresentar **todas as informações básicas de forma completa e bem informada** (postura, altura do banco, braços/pulsos, curvatura dos dedos, numeração 1–5, posição de cinco notas). O Módulo de Exercícios, quando existir, será uma **extensão prática** — rotinas, progressões, aquecimento, prevenção de LER. Redundância parcial é intencional: Teoria explica, Exercícios treina. Não truncar 2.3 esperando que o usuário veja em Exercícios — cada módulo deve ser autossuficiente dentro do seu propósito.

### Módulo 3 — Notas Musicais

As 12 notas: naturais e alteradas, sustenido e bemol, enarmonia, tom e semitom, Dó central como referência universal. O vocabulário que sustenta tudo o que vem depois. Contexto histórico relevante em 3.2 (sistema temperado e por que dividimos a oitava em 12 partes iguais).

### Módulo 4 — Ritmo e Tempo

Dimensão temporal da música: pulso, BPM, compasso, figuras rítmicas, ponto de aumento e ligadura. Complementa o Módulo 3 (altura) com a outra metade do esqueleto musical.

### Módulo 5 — Leitura Musical Básica

Introdução à leitura de partitura: pauta, claves de Sol e Fá, leitura aplicada ao teclado. **Não é requisito para usar o player do Tyghorn Melody** (que usa falling notes) — é útil para quem quer acessar outros materiais de estudo (livros, partituras, tutoriais). Módulo suplementar.

### Módulo 6 — Intervalos

Ponte entre fundamentos e harmonia. Distância entre notas como unidade que sustenta escalas e acordes. Contexto histórico em 6.2 (o trítono como *diabolus in musica* e sua reabilitação moderna).

### Módulo 7 — Escalas

Escala como sequência ordenada com padrão definido de intervalos. Cobre maior, menores (natural/harmônica/melódica), pentatônicas, blues, cromática. Aborda o conceito de tonalidade e o uso prático em improvisação. Contexto histórico da pentatônica como fenômeno transcultural.

### Módulo 8 — Acordes

Harmonia como empilhamento de intervalos de terça. Tríades, inversões, tétrades (acordes de sétima), cifras. Introduz o sistema de notação de acordes mais usado em música popular. Aprofundamento sobre inversões de tétrades e extensões (9ª, 11ª, 13ª) como preview de harmonia avançada.

### Módulo 9 — Campo Harmônico

Conexão entre escalas e acordes: quais acordes pertencem naturalmente a uma tonalidade, e as funções (tônica, subdominante, dominante) que eles desempenham. Contexto histórico: Rameau e a teoria funcional (séc. XVIII).

### Módulo 10 — Progressões Harmônicas

Como músicas são construídas harmonicamente. Notação em graus (algarismos romanos), progressões comuns da música popular, cadências. Fecha o ciclo de harmonia do escopo principal.

### Módulo 11 — Tópicos Avançados (Expansão Futura)

Listado para referência e planejamento, **fora do escopo inicial de implementação**. Tópicos previstos: Modos Gregos, Modulação, Contraponto Básico, Forma Musical, Dinâmica e Expressão, Transposição. A ordem definitiva e o detalhamento serão decididos quando este módulo entrar em execução.

---

## 6. Navegação e Experiência

### 6.1 Página Índice

Uma seção em `theory.html` lista todos os módulos e tópicos: número e nome de cada módulo com descrição breve, lista de tópicos, indicador de nível. (Futuro) Indicador de progresso por módulo.

### 6.2 Navegação dentro do Tópico

Cada tópico inclui:

- **Breadcrumb** — Teoria > Módulo X: Nome > Tópico Y: Nome
- **Botões anterior/próximo** — navegação sequencial
- **Link para o índice** — retorno rápido

### 6.3 Blocos Colapsáveis

Os blocos **Aprofundamento** e **Contexto Histórico** renderizam colapsados por padrão, usando `<details>/<summary>` nativo. Vantagens: zero dependências, leitor do Conceito não é sobrecarregado, conteúdo adicional a um clique de distância, hierarquia visual clara — Conceito domina, opcionais recolhidos.

### 6.4 Progresso (futuro)

Possibilidade de marcar tópicos como "estudados" via localStorage. Exibir progresso por módulo. Não é requisito de lançamento — adição posterior.

---

## 7. Decisões de Arquitetura

Decisões tomadas em 2026-04-15 para orientar a implementação (Fase A).

### D1. Estrutura de Páginas — Página shell dinâmica

Uma `theory.html` com shell fixo (nav, header, sidebar) e conteúdo carregado dinamicamente via `fetch`. Navegação por hash na URL (`theory.html#7.2`) para bookmarkability.

**Alternativas descartadas:** (a) uma página HTML por tópico — boilerplate repetido em 35+ arquivos; (b) uma página por módulo — páginas longas, menos granularidade.

**Justificativa:** zero boilerplate, navegação suave, padrão já usado no player (JSON dinâmico). Breadcrumb, anterior/próximo e pré-requisitos são gerados automaticamente a partir do manifesto — elimina manutenção manual de links em cada fragmento.

### D2. Formato do Conteúdo — HTML fragments

Cada tópico é um fragmento HTML (sem `<head>`/`<body>`) carregado via `fetch` pelo shell. Conteúdo rico (tabelas, diagramas, formatação), inserido no container principal.

**Alternativas descartadas:** (b) JSON + template — rígido demais para conteúdo educacional rico; (c) HTML estático completo — boilerplate repetido.

**Justificativa:** HTML fragments combinam riqueza nativa com zero boilerplate. Compatível com o shell dinâmico (D1). Cada fragmento contém apenas o conteúdo — o shell cuida de nav, breadcrumb, estilos.

### D3. Diagramas de Teclado — HTML/CSS

Diagramas implementados com divs estilizadas representando teclas. Um componente JS reutilizável ([`js/theory/keyboard-diagram.js`](../js/theory/keyboard-diagram.js)) gera o HTML a partir de parâmetros (range, notas destacadas, cores).

**Alternativas descartadas:** (b) SVG — mais complexo de gerar e manter; (c) Canvas — não responsivo nativamente, overhead desnecessário para diagramas estáticos.

**Justificativa:** HTML/CSS é a opção mais simples, responsiva por natureza, sem dependências. Suficiente para diagramas estáticos de teclado com teclas destacadas. Alinhado com a stack do projeto.

### D4. Representação de Partitura — SVG manual + fonte Bravura

Quando trechos de partitura forem necessários (especialmente Módulo 5), usar:

1. **SVG manual embutido** no HTML do fragmento — para diagramas didáticos simples (pauta, claves isoladas, notas individuais posicionadas, até 1–2 compassos).
2. **Fonte musical [Bravura](https://github.com/steinbergmedia/bravura)** (SMuFL, open source da Steinberg) servida localmente — para símbolos inline no texto (uma clave, uma figura rítmica dentro de um parágrafo).

Padronizar um componente reutilizável de "mini-partitura" quando a primeira prova de conceito for feita no Módulo 5, seguindo o mesmo padrão do `keyboard-diagram.js`.

**Alternativas descartadas (por ora):** (a) imagens estáticas (SVG/PNG de MuseScore/Lilypond) — adiciona binários e/ou artefatos não editáveis; **reavaliar** quando algum tópico exigir trechos longos. (b) Biblioteca JS (VexFlow, OpenSheetMusicDisplay) — viola o pilar de simplicidade (~300KB); **reavaliar** apenas se o Player ganhar vista de partitura sincronizada, aí o custo se justifica pelo dinamismo.

**Justificativa:** mantém o stack intocado e todos os artefatos versionáveis como texto. Suficiente para o escopo educacional atual. Assume-se o custo de produção manual em troca da aderência à simplicidade.

**Ponto de atenção:** o assistente deve sinalizar explicitamente ao usuário quando um tópico pedir uma representação mais rica que a combinação SVG+Bravura consiga sustentar — nesse momento, reavaliar (a) ou (b) conscientemente.
