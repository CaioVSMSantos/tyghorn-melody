# Especificação — Módulo de Teoria Musical

## 1. Visão Geral

Módulo educacional do Tyghorn Melody dedicado ao ensino de teoria musical e fundamentos do teclado. Público-alvo: iniciantes absolutos, sem conhecimento musical prévio.

O módulo é organizado em uma sequência linear de **Módulos** (capítulos) compostos por **Tópicos** (lições). A numeração indica a ordem recomendada de estudo, mas nenhum tópico é bloqueante — o usuário pode acessar qualquer conteúdo livremente.

### Objetivos

- Ensinar os fundamentos de teoria musical de forma acessível e prática
- Relacionar cada conceito teórico ao teclado musical
- Oferecer profundidade progressiva (conceito básico → aprofundamento → contexto histórico)
- Integrar exercícios práticos, incluindo interação via MIDI quando relevante
- Cobrir do absoluto zero (o que é som) até conceitos intermediários/avançados (campo harmônico, progressões, modos)

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

Conteúdo organizado em ordem recomendada de estudo (indicada pela numeração), mas sem pré-requisitos obrigatórios. A numeração serve como guia, não como trava. Cada tópico indica seus pré-requisitos sugeridos para que o leitor saiba o que facilitaria a compreensão.

### 2.2 Conceito Primeiro, Profundidade Depois

Cada tópico apresenta o essencial de forma direta no bloco **Conceito**. Quem deseja mais pode expandir os blocos opcionais (**Aprofundamento**, **Contexto Histórico**). A leitura mínima (Conceito) deve ser suficiente para compreender e aplicar.

### 2.3 Linguagem

- Simples, direta e neutra
- Sem metáforas, comparações forçadas ou figuras de linguagem desnecessárias
- Tom pedagógico: explicar com clareza, não impressionar com jargão
- Termos técnicos inevitáveis devem ser definidos imediatamente no contexto de uso
- Honesta: não simplificar a ponto de distorcer — se algo é complexo, dizer que é complexo e explicar com cuidado

### 2.4 Múltiplas Representações

Conceitos complexos devem ser explicados de mais de uma forma quando necessário. Combinações possíveis:

- Texto explicativo + diagrama de teclado
- Texto explicativo + tabela estruturada
- Definição formal + exemplo concreto
- Representação visual + descrição verbal

O objetivo é que diferentes perfis de aprendizado encontrem pelo menos uma representação que faça sentido. Informações particularmente densas podem receber até três formas de explicação.

### 2.5 Conexão com o Teclado

Sempre que possível, demonstrar como o conceito se manifesta no teclado. Diagramas visuais das teclas com destaque são um recurso primário do módulo. Exemplos visuais no teclado fazem parte do bloco **Conceito**, não são separados — o conceito teórico e sua manifestação no instrumento são inseparáveis.

### 2.6 Progressão Natural

Cada tópico pode referenciar e se apoiar em conceitos de tópicos anteriores, criando camadas de conhecimento. Referências cruzadas explícitas (links) ajudam o usuário a revisar fundamentos quando necessário.

---

## 3. Estrutura

### 3.1 Hierarquia

```
Módulo (capítulo) → Tópico (lição) → Bloco (seção)
```

- **Módulo**: agrupa tópicos por tema amplo (ex.: "Escalas"). Possui título, descrição breve e indicador de nível
- **Tópico**: unidade de estudo autocontida sobre um conceito específico (ex.: "Escala Maior"). Deve ser consumível em uma sessão de estudo (15–30 minutos)
- **Bloco**: seção dentro de um tópico (ex.: "Conceito", "Exercícios")

**Numeração:** `M.T` — módulo.tópico (ex.: 7.2 = Módulo 7, Tópico 2)

### 3.2 Blocos de Conteúdo

Cada tópico é composto pelos seguintes blocos, na ordem apresentada:

#### Blocos Principais (sempre presentes quando aplicáveis)

| Bloco | Obrigatório | Descrição |
|-------|-------------|-----------|
| **Neste Tópico** | Recomendado | Lista curta (3–5 itens) do que será aprendido. Preview e referência rápida para revisão. Pode ser omitido em tópicos muito curtos |
| **Conceito** | Sim | Núcleo do tópico. Explica o quê, por quê e como. Inclui exemplos visuais (diagramas de teclado, tabelas, listas) integrados ao texto |
| **Aprofundamento** | Não | Expansão para quem deseja ir além. Conecta a outros conhecimentos, explora nuances e variações. Colapsável por padrão |
| **Contexto Histórico** | Não | Origem e evolução do conceito. Como e por que surgiu, como era antes e como é hoje. Colapsável por padrão. Incluir apenas quando houver conteúdo genuinamente relevante |
| **Exercícios** | Quando relevante | Atividades práticas para fixar o conceito. Mix de exercícios textuais e interativos (MIDI). Nem todo tópico precisa |
| **Navegação** | Sim | Links para pré-requisitos sugeridos, próximo tópico na sequência, e tópicos relacionados |

#### Diretrizes por Bloco

**Conceito:**
- Ir direto ao ponto — parágrafos curtos, listas, subtítulos
- Incluir exemplos concretos, não apenas definições abstratas
- Quando relevante, mostrar o conceito no teclado visualmente (diagrama integrado)
- Responder: o que é, por que importa, como funciona, como se aplica
- Deve ser suficiente para o leitor se sentir confortável com o tema nas situações mais comuns

**Aprofundamento:**
- Maior densidade é aceitável — o leitor está optando por mais
- Conectar o tópico a conceitos mais amplos ou avançados
- Explorar casos especiais, exceções, variações
- Pode referenciar tópicos futuros como "preview"

**Contexto Histórico:**
- Focar em "por que as coisas são como são"
- Mencionar divergências entre tradições quando existirem
- Manter relevante — evitar digressões puramente acadêmicas
- OK não incluir este bloco se o tópico não tiver história interessante

**Exercícios:**
- Todo exercício MIDI deve ter alternativa textual/visual para usuários sem teclado conectado
- Exercícios exclusivamente MIDI devem ser claramente identificados
- Progressão de complexidade: quiz simples → identificação → tocar notas → sequências → acordes

### 3.3 Recursos Visuais

| Recurso | Quando Usar | Exemplo de Aplicação |
|---------|-------------|----------------------|
| Diagrama de teclado | Notas, intervalos, escalas, acordes | Teclas destacadas com cores para escala de Dó Maior |
| Tabela | Comparações, fórmulas, classificações | Tabela de intervalos com semitons e qualidade |
| Lista ordenada | Sequências, passos, procedimentos | Passos para construir uma escala maior |
| Lista não-ordenada | Características, propriedades | Propriedades de uma tríade maior |
| Destaque (callout/box) | Definições-chave, dicas, alertas | "Enarmonia: Dó# e Réb são a mesma tecla" |
| Notação simplificada | Figuras rítmicas, duração | Representação visual de semibreve, mínima, etc. |
| Exemplos lado a lado | Comparação direta | Escala maior vs. escala menor no teclado |

**Diagramas de teclado** são o recurso visual primário do módulo. Representação gráfica simplificada do teclado (ou parte dele) com teclas destacadas por cor. Decisão de implementação (HTML/CSS, SVG ou Canvas) pendente — ver seção 7.

---

## 4. Exercícios Interativos

### 4.1 Tipos de Exercício

| Tipo | Descrição | Requer MIDI | Complexidade |
|------|-----------|-------------|--------------|
| Quiz | Múltipla escolha ou verdadeiro/falso | Não | Baixa |
| Identificação visual | "Qual nota está destacada no teclado?" | Não | Baixa |
| Toque uma nota | Pressione a nota indicada no teclado | Sim | Baixa |
| Toque uma sequência | Pressione notas em ordem específica | Sim | Média |
| Toque um acorde | Pressione notas simultaneamente | Sim | Média |
| Toque uma escala | Pressione todos os graus da escala | Sim | Média |
| Ritmo | Pressione teclas no tempo correto | Sim | Alta |

### 4.2 Widgets MIDI

Componentes simples e reutilizáveis, independentes do player de prática. Compartilham o `midi.js` existente para acesso MIDI, mas possuem lógica própria e simplificada.

**Widgets planejados:**

- **NoteDetector** — Aguarda uma nota MIDI específica. Feedback visual imediato (correto/incorreto). Uso: "Toque a nota Ré no teclado"
- **SequenceChecker** — Aguarda uma sequência de notas em ordem. Progresso visual nota a nota. Uso: "Toque a escala de Dó Maior subindo"
- **ChordChecker** — Aguarda múltiplas notas pressionadas simultaneamente. Uso: "Toque o acorde de Sol Maior"

Estes widgets NÃO incluem lógica de timing, scoring, falling notes ou qualquer funcionalidade do player. São verificadores simples de entrada MIDI.

### 4.3 Fallback sem MIDI

Para usuários sem teclado MIDI conectado:
- Exercícios MIDI exibem instrução equivalente textual ("No teclado, toque as notas C-E-G simultaneamente")
- Exercícios de quiz e identificação visual funcionam normalmente
- Indicação clara de quais exercícios são MIDI-exclusivos

---

## 5. Catálogo de Módulos e Tópicos

### Visão Geral

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

**Total: 41+ tópicos** (35 no escopo principal + 6+ avançados)

---

### Módulo 1: O Que é Música

*Nível: Iniciante — 3 tópicos*

Fundamentos conceituais. O que é som, como a música se organiza, e por que existe uma linguagem para escrevê-la. Este módulo não requer teclado — é puramente conceitual.

---

#### 1.1 Som e Silêncio

O ponto de partida absoluto. O que é som fisicamente, como o ouvido o percebe, e por que o silêncio é parte da música.

**Conceitos-chave:**
- Som como vibração: frequência (grave/agudo), amplitude (fraco/forte), timbre (identidade do instrumento)
- Silêncio como elemento ativo na música (pausas, respiração, contraste)
- Diferença entre som musical (organizado, periódico) e ruído (desorganizado, aperiódico)

**Pré-requisitos:** nenhum
**Exercícios sugeridos:** quiz conceitual (identificar propriedades do som)

---

#### 1.2 Os Três Pilares: Melodia, Harmonia e Ritmo

Os três elementos fundamentais que compõem qualquer peça musical e como eles interagem.

**Conceitos-chave:**
- **Melodia**: sequência de notas no tempo — a "voz" da música, o que você cantarola
- **Harmonia**: notas soando simultaneamente — o "acompanhamento", a base de suporte
- **Ritmo**: organização do tempo — a "estrutura temporal", o que faz você balançar
- Como os três interagem: uma melodia sem ritmo é apenas uma lista de notas; acordes sem ritmo são apenas sons empilhados
- Exemplos: identificar cada pilar em uma música conhecida

**Pré-requisitos:** 1.1
**Exercícios sugeridos:** identificação dos três pilares em descrições textuais

---

#### 1.3 Notação Musical: A Linguagem da Música

Por que músicos precisam de uma forma de "escrever" música, e quais sistemas existem.

**Conceitos-chave:**
- Problema: como transmitir música sem tocá-la? Necessidade de registro
- Sistema de notação ocidental (pauta, claves, figuras) — será detalhado no Módulo 5
- Nomenclatura: sistema latino (Dó, Ré, Mi, Fá, Sol, Lá, Si) vs. sistema anglo-saxão (C, D, E, F, G, A, B)
- Tabela de equivalência entre os dois sistemas
- Qual sistema o Tyghorn Melody usa e por quê

**Pré-requisitos:** 1.1, 1.2
**Exercícios sugeridos:** quiz de equivalência entre nomenclaturas

**Contexto Histórico relevante:** Guido d'Arezzo e a origem dos nomes das notas (hino a São João Batista). Evolução da notação desde neumas medievais.

---

### Módulo 2: Conhecendo o Teclado

*Nível: Iniciante — 3 tópicos*

O instrumento físico: como é construído, como se orientar nele, e como posicionar as mãos.

---

#### 2.1 Anatomia do Teclado

Como o teclado é organizado e como encontrar qualquer nota nele.

**Conceitos-chave:**
- Teclas brancas (notas naturais) e teclas pretas (sustenidos/bemóis)
- O padrão visual de 2+3 teclas pretas como referência de orientação
- Como usar os grupos de pretas para encontrar qualquer nota
- Diferentes tamanhos de teclado (25, 49, 61, 76, 88 teclas) e o que isso significa
- Diagrama: teclado com notas identificadas

**Pré-requisitos:** 1.3 (nomenclatura das notas)
**Exercícios sugeridos:** identificar teclas no diagrama; localizar notas específicas no teclado MIDI

---

#### 2.2 Oitavas e o Padrão Visual

O conceito de oitava e como o padrão do teclado se repete.

**Conceitos-chave:**
- Oitava: distância entre uma nota e a próxima com o mesmo nome (ex.: Dó3 → Dó4)
- O padrão de 12 notas (7 brancas + 5 pretas) que se repete ao longo de todo o teclado
- Numeração de oitavas (C1, C2, C3...) e sistemas de numeração
- Por que notas com o mesmo nome em oitavas diferentes soam "iguais" (relação de frequência 2:1)
- Regiões do teclado: grave (esquerda), média (centro), aguda (direita)

**Pré-requisitos:** 2.1
**Exercícios sugeridos:** tocar a mesma nota em oitavas diferentes (MIDI); identificar oitavas no diagrama

---

#### 2.3 Postura e Dedilhado Básico

Como sentar ao teclado e posicionar as mãos para tocar com conforto e eficiência.

**Conceitos-chave:**
- Altura do banco/cadeira e distância do teclado
- Posição dos braços e pulsos (relaxados, alinhados)
- Curvatura natural dos dedos (como segurar uma bola)
- Numeração dos dedos: 1 (polegar) a 5 (mínimo), ambas as mãos
- Posição "de cinco notas" (Dó a Sol) como ponto de partida
- Diagrama: mãos sobre as teclas com numeração

**Pré-requisitos:** 2.1
**Exercícios sugeridos:** orientações práticas para posicionamento (sem validação MIDI — exercício físico/observacional)

**Nota:** Este tópico é naturalmente limitado em formato texto. Postura é melhor ensinada presencialmente ou via vídeo. O tópico fornece os princípios fundamentais e referências visuais.

---

### Módulo 3: Notas Musicais

*Nível: Iniciante — 3 tópicos*

As 12 notas do sistema musical ocidental, suas relações, e como encontrá-las no teclado.

---

#### 3.1 As 12 Notas

Os nomes de todas as notas e como localizá-las.

**Conceitos-chave:**
- 7 notas naturais: Dó (C), Ré (D), Mi (E), Fá (F), Sol (G), Lá (A), Si (B)
- 5 notas alteradas: Dó# (C#), Ré# (D#), Fá# (F#), Sol# (G#), Lá# (A#)
- Sustenido (#): eleva a nota em um semitom
- Bemol (b): abaixa a nota em um semitom
- **Enarmonia**: Dó# = Réb, Ré# = Mib, etc. — mesma tecla, nomes diferentes dependendo do contexto
- Tabela completa de equivalências enarmônicas
- Diagrama: teclado com todas as 12 notas identificadas (incluindo nomes enarmônicos)

**Pré-requisitos:** 2.1, 2.2
**Exercícios sugeridos:** tocar notas específicas no teclado MIDI; quiz de enarmonia

---

#### 3.2 Tom e Semitom

A menor unidade de distância entre notas e como medi-la no teclado.

**Conceitos-chave:**
- **Semitom**: menor distância entre duas notas no sistema ocidental. No teclado, é a tecla imediatamente ao lado (incluindo pretas)
- **Tom**: dois semitons. Ex.: de Dó a Ré = 1 tom (Dó → Dó# → Ré)
- Onde estão os semitons naturais: Mi→Fá e Si→Dó (sem tecla preta entre elas)
- Por que essa irregularidade existe (não é um "erro" — é a base do sistema diatônico)
- Como contar tons e semitons no teclado
- Diagrama: teclado com semitons marcados

**Pré-requisitos:** 3.1
**Exercícios sugeridos:** identificar tons e semitons entre pares de notas (quiz + MIDI)

**Contexto Histórico relevante:** O sistema temperado e por que dividimos a oitava em 12 partes iguais (temperamento igual). Breve menção a sistemas de afinação históricos.

---

#### 3.3 O Dó Central e as Regiões do Teclado

O ponto de referência mais importante do teclado e como se orientar nas diferentes regiões.

**Conceitos-chave:**
- **Dó Central (C4, MIDI 60)**: a nota de referência universal. Onde fica em teclados de diferentes tamanhos
- Como encontrá-lo: no centro do teclado, à esquerda do grupo de 2 teclas pretas central
- Regiões: grave (abaixo de C3), média (C3–C5), aguda (acima de C5) — nomenclatura aproximada
- Relação com as claves: clave de Sol (acima do Dó central), clave de Fá (abaixo) — prévia do Módulo 5
- Notação MIDI: cada nota tem um número (C4 = 60, A4 = 69 = 440Hz)
- Diagrama: teclado com Dó central e regiões destacadas

**Pré-requisitos:** 3.1, 2.2
**Exercícios sugeridos:** encontrar o Dó central no teclado MIDI; identificar regiões

---

### Módulo 4: Ritmo e Tempo

*Nível: Iniciante — 4 tópicos*

Como a música se organiza no tempo. Pulso, compasso e as figuras que indicam duração.

---

#### 4.1 Pulso e BPM

O "coração" da música — o que mantém tudo no tempo.

**Conceitos-chave:**
- **Pulso (beat)**: batida regular que marca o tempo da música. O que faz você bater o pé
- **BPM (batidas por minuto)**: velocidade do pulso. 60 BPM = 1 batida por segundo, 120 BPM = 2 por segundo
- **Andamento**: nome descritivo da velocidade (Largo ~40-60, Adagio ~66-76, Andante ~76-108, Allegro ~120-168, Presto ~168-200)
- Metrônomo: ferramenta que marca o pulso (relação com a feature do Tyghorn Melody)
- Como sentir o pulso: ouvir uma música e bater palmas no ritmo

**Pré-requisitos:** 1.2
**Exercícios sugeridos:** identificar BPM em exemplos; tocar notas no pulso do metrônomo (MIDI + timing)

---

#### 4.2 Compasso

Como os pulsos se agrupam para criar estrutura rítmica.

**Conceitos-chave:**
- **Compasso**: agrupamento de pulsos com acentuação regular
- **Fórmula de compasso**: numerador = quantos pulsos por compasso, denominador = qual figura vale 1 pulso
- **4/4 (quaternário)**: 4 pulsos, o mais comum em música popular (rock, pop, eletrônica)
- **3/4 (ternário)**: 3 pulsos, valsa
- **6/8 (composto)**: 6 pulsos agrupados em 2 grupos de 3
- **Tempo forte e fraco**: o primeiro pulso de cada compasso é naturalmente mais acentuado
- **Barra de compasso**: linha vertical que separa compassos na partitura
- Tabela: compassos comuns com exemplos de gêneros

**Pré-requisitos:** 4.1
**Exercícios sugeridos:** identificar a fórmula de compasso em exemplos; contar tempos

---

#### 4.3 Figuras Rítmicas

As "formas" que indicam quanto tempo cada nota dura.

**Conceitos-chave:**
- Figuras de som (nota soa) e figuras de silêncio (pausa):

| Figura | Duração (em 4/4) | Pausa correspondente |
|--------|-------------------|---------------------|
| Semibreve | 4 tempos | Pausa de semibreve |
| Mínima | 2 tempos | Pausa de mínima |
| Semínima | 1 tempo | Pausa de semínima |
| Colcheia | ½ tempo | Pausa de colcheia |
| Semicolcheia | ¼ tempo | Pausa de semicolcheia |

- Relação hierárquica: cada figura vale metade da anterior
- Representação visual de cada figura
- Como as figuras preenchem um compasso (ex.: um 4/4 pode ter 1 semibreve, ou 2 mínimas, ou 4 semínimas, ou combinações)

**Pré-requisitos:** 4.1, 4.2
**Exercícios sugeridos:** quiz de duração; completar um compasso com figuras

---

#### 4.4 Ponto de Aumento e Ligadura

Duas formas de modificar a duração das notas.

**Conceitos-chave:**
- **Ponto de aumento**: adicionado após uma figura, aumenta sua duração em 50%. Ex.: mínima pontuada = 2 + 1 = 3 tempos
- **Ligadura**: arco que conecta duas notas de mesma altura, somando suas durações. Ex.: semínima ligada a semínima = 2 tempos
- Diferença entre ligadura de duração e ligadura de expressão (legato) — a de expressão conecta notas de alturas *diferentes*
- Tabela: exemplos de durações com ponto
- Quando usar ponto vs. ligadura (ponto para valores fixos, ligadura para atravessar barras de compasso)

**Pré-requisitos:** 4.3
**Exercícios sugeridos:** calcular durações com ponto e ligadura (quiz)

---

### Módulo 5: Leitura Musical Básica

*Nível: Iniciante–Intermediário — 3 tópicos*

Introdução à leitura de partitura (pauta, claves, notas na pauta). Este módulo é suplementar — **não é requisito para usar o player do Tyghorn Melody** (que usa falling notes). É útil para quem deseja acessar outros materiais de estudo (livros, partituras, tutoriais).

---

#### 5.1 A Pauta (Pentagrama)

O "papel" onde a música é escrita.

**Conceitos-chave:**
- **Pauta/Pentagrama**: 5 linhas horizontais e 4 espaços entre elas
- As notas são posicionadas nas linhas ou nos espaços — quanto mais alto, mais agudo
- **Linhas suplementares**: linhas extras acima ou abaixo da pauta para notas que excedem o range
- Direção: de baixo para cima = do grave para o agudo
- A pauta sozinha não define quais notas são — isso é papel da **clave** (próximo tópico)

**Pré-requisitos:** 3.1
**Exercícios sugeridos:** identificar posições relativas na pauta (mais agudo/mais grave)

---

#### 5.2 Claves de Sol e Fá

Os símbolos que definem quais notas ocupam quais posições na pauta.

**Conceitos-chave:**
- **Clave de Sol**: define que a segunda linha é Sol (G4). Usada para a mão direita (região média/aguda)
- **Clave de Fá**: define que a quarta linha é Fá (F3). Usada para a mão esquerda (região média/grave)
- **Sistema grande (Grand Staff)**: clave de Sol + clave de Fá juntas, conectadas por uma chave. Cobre praticamente todo o range do teclado
- O Dó central (C4) fica na linha suplementar entre as duas pautas
- **Armadura de clave** (introdução): conjunto de sustenidos ou bemóis no início da pauta que indica a tonalidade da peça. Será aprofundado no Módulo 7 (Escalas)
- Tabela: notas em cada linha e espaço para ambas as claves
- Diagrama: grand staff com notas mapeadas ao teclado

**Pré-requisitos:** 5.1, 3.3
**Exercícios sugeridos:** identificar notas em cada clave (quiz visual)

---

#### 5.3 Leitura Aplicada ao Teclado

Como traduzir o que se lê na pauta para as teclas do teclado.

**Conceitos-chave:**
- Mapeamento direto: cada posição na pauta corresponde a uma tecla específica
- Dicas de leitura rápida: notas-guia (Dó central, Sol na clave de Sol, Fá na clave de Fá) e contagem a partir delas
- Leitura por padrão: reconhecer intervalos visuais na pauta (grau conjunto, salto de terça, etc.) em vez de identificar cada nota individualmente
- Prática de leitura: comece devagar, aumente gradualmente

**Pré-requisitos:** 5.1, 5.2, 3.1
**Exercícios sugeridos:** tocar notas lidas da pauta no teclado MIDI; quiz de correspondência pauta→nota

---

### Módulo 6: Intervalos

*Nível: Intermediário — 3 tópicos*

Distância entre notas — o fundamento para construir escalas, acordes e compreender harmonia. Este módulo é uma ponte entre os fundamentos e os conceitos harmônicos dos módulos seguintes.

---

#### 6.1 O Que São Intervalos

Definição e importância dos intervalos na teoria musical.

**Conceitos-chave:**
- **Intervalo**: distância entre duas notas, medida em graus (2ª, 3ª, 4ª, 5ª, 6ª, 7ª, 8ª)
- **Intervalo melódico**: notas tocadas em sequência (uma após a outra)
- **Intervalo harmônico**: notas tocadas simultaneamente
- Como contar: a nota de partida é o 1º grau (ex.: Dó a Mi = 3ª, pois Dó-Ré-Mi = 3 notas)
- Uníssono (mesma nota) e oitava (8ª) como intervalos especiais
- Por que intervalos importam: são os "tijolos" de escalas e acordes

**Pré-requisitos:** 3.1, 3.2
**Exercícios sugeridos:** identificar intervalos entre pares de notas (quiz); tocar intervalos no teclado (MIDI)

---

#### 6.2 Classificação dos Intervalos

As qualidades que diferenciam intervalos do mesmo número.

**Conceitos-chave:**
- Intervalos do mesmo número podem ter qualidades diferentes: **maior (M)**, **menor (m)**, **justo (J)**, **aumentado (aum)**, **diminuto (dim)**
- Intervalos justos: uníssono, 4ª, 5ª, 8ª
- Intervalos maiores/menores: 2ª, 3ª, 6ª, 7ª
- Tabela de intervalos com contagem de semitons:

| Intervalo | Semitons | Exemplo a partir de Dó |
|-----------|----------|----------------------|
| 2ª menor | 1 | Dó → Réb |
| 2ª maior | 2 | Dó → Ré |
| 3ª menor | 3 | Dó → Mib |
| 3ª maior | 4 | Dó → Mi |
| 4ª justa | 5 | Dó → Fá |
| 4ª aum / 5ª dim (trítono) | 6 | Dó → Fá# / Dó → Solb |
| 5ª justa | 7 | Dó → Sol |
| 6ª menor | 8 | Dó → Láb |
| 6ª maior | 9 | Dó → Lá |
| 7ª menor | 10 | Dó → Sib |
| 7ª maior | 11 | Dó → Si |
| 8ª justa | 12 | Dó → Dó (oitava acima) |

- **Trítono**: intervalo de 6 semitons (4ª aumentada / 5ª diminuta) — o intervalo mais instável

**Pré-requisitos:** 6.1, 3.2
**Exercícios sugeridos:** classificar intervalos por semitons (quiz); construir intervalos específicos a partir de uma nota (MIDI)

**Contexto Histórico relevante:** O trítono como "diabolus in musica" — por que era evitado na música medieval e como é usado hoje.

---

#### 6.3 Intervalos no Teclado

Como visualizar, encontrar e tocar intervalos no teclado.

**Conceitos-chave:**
- Visualização: cada intervalo tem um "formato" no teclado (distância física entre teclas)
- Intervalos consonantes (soam "bem"): 3ª, 5ª, 6ª, 8ª
- Intervalos dissonantes (soam "tensos"): 2ª, 7ª, trítono
- Uso prático: identificar intervalos de ouvido, construir acordes a partir de intervalos
- Diagramas: cada intervalo visualizado no teclado

**Pré-requisitos:** 6.1, 6.2
**Exercícios sugeridos:** tocar intervalos específicos a partir de notas indicadas (MIDI); quiz de consonância/dissonância

---

### Módulo 7: Escalas

*Nível: Intermediário — 5 tópicos*

Sequências de notas com padrão definido que formam a base da melodia e da harmonia. As escalas são o "vocabulário" de uma tonalidade.

---

#### 7.1 O Que São Escalas

Definição, estrutura e importância das escalas na música.

**Conceitos-chave:**
- **Escala**: sequência ordenada de notas seguindo um padrão de intervalos, do grave ao agudo (e vice-versa)
- **Graus**: cada nota na escala tem um número (I a VII) e um nome funcional (tônica, supertônica, mediante, subdominante, dominante, superdominante/submediante, sensível/subtônica)
- **Tônica**: primeiro grau, a nota "central" da escala — é a nota que dá nome à escala e à tonalidade
- **Tonalidade**: o "ambiente sonoro" definido por uma escala. Uma música em Dó Maior usa predominantemente as notas da escala de Dó Maior
- Escalas ascendentes (subindo) e descendentes (descendo)
- Por que escalas importam: definem quais notas "combinam" entre si e formam a base para acordes e melodias

**Pré-requisitos:** 3.1, 3.2, 6.1
**Exercícios sugeridos:** quiz conceitual

---

#### 7.2 Escala Maior

A escala mais fundamental da música ocidental.

**Conceitos-chave:**
- **Fórmula da escala maior**: Tom - Tom - Semitom - Tom - Tom - Tom - Semitom (T-T-S-T-T-T-S)
- **Dó Maior**: o exemplo mais simples (todas as teclas brancas: Dó-Ré-Mi-Fá-Sol-Lá-Si-Dó)
- Como construir a escala maior a partir de qualquer nota usando a fórmula
- Tabela: todas as 12 escalas maiores com suas notas
- Diagrama: escala de Dó Maior no teclado, depois Sol Maior, Fá Maior (mostrando o uso de sustenidos/bemóis)
- Armadura de clave: quantos sustenidos ou bemóis cada escala maior possui (introdução ao ciclo de quintas)

**Pré-requisitos:** 7.1, 3.2
**Exercícios sugeridos:** construir escalas maiores usando a fórmula (quiz); tocar escalas maiores no teclado (MIDI sequência)

**Contexto Histórico relevante:** O modo jônio medieval que deu origem à escala maior como a conhecemos.

---

#### 7.3 Escalas Menores

As três variações da escala menor e sua relação com a maior.

**Conceitos-chave:**
- **Escala menor natural**: T-S-T-T-S-T-T. Sonoridade mais "triste" ou "melancólica"
- **Relativa menor**: toda escala maior tem uma menor que usa as mesmas notas, começando no 6º grau (ex.: Lá menor é relativa de Dó Maior)
- **Escala menor harmônica**: menor natural com o 7º grau elevado em meio tom. Cria a "sensível" que resolve para a tônica
- **Escala menor melódica**: 6º e 7º graus elevados na subida, natural na descida (versão clássica); na versão jazz/moderna, mantém a alteração em ambas as direções
- Tabela comparativa: as três escalas menores partindo de Lá
- Diagrama: cada variação no teclado, destacando a(s) nota(s) alterada(s)

**Pré-requisitos:** 7.2
**Exercícios sugeridos:** tocar escalas menores (MIDI); identificar a relativa menor de escalas maiores (quiz)

---

#### 7.4 Escala Pentatônica e Blues

Escalas de 5 notas amplamente usadas em música popular, rock, blues e improvisação.

**Conceitos-chave:**
- **Pentatônica maior**: remove os graus 4 e 7 da escala maior (ex.: Dó-Ré-Mi-Sol-Lá). Sem semitons — por isso soa "segura" e agradável
- **Pentatônica menor**: remove os graus 2 e 6 da escala menor natural (ex.: Lá-Dó-Ré-Mi-Sol). A base do blues e do rock
- **Escala Blues**: pentatônica menor + "blue note" (5ª diminuta / 4ª aumentada). Ex.: Lá-Dó-Ré-Ré#-Mi-Sol
- Por que a pentatônica soa bem: ausência de semitons elimina tensões, qualquer combinação de notas é consonante
- Uso em improvisação: por que é a primeira escala que guitarristas/tecladistas aprendem para improvisar
- Diagrama: pentatônica maior e menor no teclado, escala blues

**Pré-requisitos:** 7.2, 7.3
**Exercícios sugeridos:** tocar pentatônicas e blues no teclado (MIDI)

**Contexto Histórico relevante:** Presença da pentatônica em culturas musicais do mundo inteiro (Ásia, África, música celta, blues americano). Por que é considerada "universal".

---

#### 7.5 Escala Cromática

Todas as 12 notas em sequência — a escala completa.

**Conceitos-chave:**
- **Escala cromática**: todas as 12 notas em ordem, separadas por semitons
- Uso: exercício técnico, passagens expressivas, "conectar" notas de diferentes escalas
- Diferença conceitual: a cromática não define uma tonalidade — é neutra
- A cromática como "superset" de todas as outras escalas — qualquer escala é um subconjunto da cromática

**Pré-requisitos:** 7.1, 3.2
**Exercícios sugeridos:** tocar a escala cromática no teclado (MIDI)

---

### Módulo 8: Acordes

*Nível: Intermediário — 5 tópicos*

Notas soando simultaneamente. Os acordes são a base da harmonia e definem o "clima" de uma passagem musical.

---

#### 8.1 O Que São Acordes

Definição e papel dos acordes na música.

**Conceitos-chave:**
- **Acorde**: três ou mais notas soando simultaneamente
- Formação básica: empilhamento de intervalos de terça (3ª maior ou menor)
- **Nota fundamental (root)**: a nota que dá nome ao acorde
- Acordes maiores soam "alegres/abertos", menores soam "tristes/fechados" — simplificação, mas útil como referência inicial
- Papel na música: acompanhamento, base harmônica, definição de tonalidade
- Acordes vs. intervalos: um intervalo = 2 notas, um acorde = 3+ notas

**Pré-requisitos:** 6.1, 6.2
**Exercícios sugeridos:** quiz conceitual; ouvir/identificar diferença entre acorde maior e menor (se áudio disponível)

---

#### 8.2 Tríades

O acorde de 3 notas — a forma mais fundamental de acorde.

**Conceitos-chave:**
- **Tríade**: fundamental + terça + quinta
- 4 tipos:

| Tipo | Fórmula (intervalos) | Exemplo em Dó | Sonoridade |
|------|---------------------|---------------|------------|
| Maior | 3ª maior + 3ª menor | C-E-G | Estável, "alegre" |
| Menor | 3ª menor + 3ª maior | C-Eb-G | Estável, "triste" |
| Diminuta | 3ª menor + 3ª menor | C-Eb-Gb | Instável, tensa |
| Aumentada | 3ª maior + 3ª maior | C-E-G# | Instável, suspensa |

- Como construir cada tipo a partir de qualquer nota
- Diagrama: cada tipo de tríade no teclado
- Notação: C (Dó Maior), Cm (Dó menor), Cdim (Dó diminuta), Caug (Dó aumentada)

**Pré-requisitos:** 8.1, 6.2
**Exercícios sugeridos:** construir e tocar tríades em diferentes notas (MIDI + quiz)

---

#### 8.3 Inversões

Reorganizar as notas de um acorde sem mudar sua identidade.

**Conceitos-chave:**
- **Posição fundamental**: nota fundamental na base (ex.: C-E-G)
- **1ª inversão**: terça na base (ex.: E-G-C)
- **2ª inversão**: quinta na base (ex.: G-C-E)
- As três formas contêm as mesmas notas — é o mesmo acorde, em disposição diferente
- Por que usar inversões: movimentação mais suave entre acordes (voice leading), sonoridade diferente sem mudar a harmonia
- **Voicing**: a disposição específica das notas de um acorde (conceito mais amplo que inversão)
- Diagrama: as três inversões de Dó Maior no teclado

**Pré-requisitos:** 8.2
**Exercícios sugeridos:** tocar acordes em diferentes inversões (MIDI)

---

#### 8.4 Tétrades (Acordes de Sétima)

Acordes de 4 notas — adicionando uma sétima à tríade.

**Conceitos-chave:**
- **Tétrade**: tríade + intervalo de sétima (maior ou menor)
- Tipos principais:

| Tipo | Símbolo | Fórmula | Exemplo em Dó | Uso comum |
|------|---------|---------|---------------|-----------|
| Sétima maior | Cmaj7 / CΔ7 | Maior + 7M | C-E-G-B | Pop, jazz, bossa |
| Sétima menor | Cm7 | Menor + 7m | C-Eb-G-Bb | Jazz, R&B |
| Sétima dominante | C7 | Maior + 7m | C-E-G-Bb | Blues, rock, resolução |
| Meio-diminuto | Cm7(b5) / Cø | Dim + 7m | C-Eb-Gb-Bb | Jazz |
| Diminuto | Cdim7 / C°7 | Dim + 7dim | C-Eb-Gb-Bbb(A) | Passagem, tensão |

- A sétima dominante (C7) é especial: cria tensão que "pede" resolução (dominante→tônica)
- Diagrama: comparação visual de tétrades no teclado

**Pré-requisitos:** 8.2, 6.2
**Exercícios sugeridos:** construir e tocar tétrades (MIDI)

**Aprofundamento relevante:** Inversões de tétrades (3 inversões possíveis), extensões (9ª, 11ª, 13ª) como prévia de harmonia avançada.

---

#### 8.5 Cifras

O sistema de notação de acordes mais usado na música popular.

**Conceitos-chave:**
- **Cifra**: representação abreviada de um acorde usando letras e símbolos
- Base: letra = nota fundamental (sistema anglo-saxão: C, D, E, F, G, A, B)
- Tabela de símbolos:

| Símbolo | Significado | Exemplo |
|---------|-------------|---------|
| (nada) | Maior | C = Dó Maior |
| m | Menor | Cm = Dó menor |
| 7 | Sétima dominante | C7 |
| maj7 / Δ7 | Sétima maior | Cmaj7 |
| dim / ° | Diminuto | Cdim |
| aug / + | Aumentado | Caug |
| sus2 / sus4 | Suspensão (sem terça) | Csus4 |
| add | Nota adicionada | Cadd9 |
| / | Nota no baixo (inversão) | C/E = Dó com Mi no baixo |

- Como ler uma cifra: C7(b9) = Dó, sétima dominante, nona bemol
- Leitura de sequências de cifras (ex.: C | Am | F | G7)

**Pré-requisitos:** 8.1, 8.2, 8.4
**Exercícios sugeridos:** ler cifras e identificar as notas correspondentes (quiz); tocar acordes a partir de cifras (MIDI)

---

### Módulo 9: Campo Harmônico

*Nível: Intermediário–Avançado — 3 tópicos*

Os acordes que pertencem a uma tonalidade — a conexão entre escalas e acordes.

---

#### 9.1 Construção do Campo Harmônico

Como gerar os acordes naturais de uma escala.

**Conceitos-chave:**
- **Campo harmônico**: conjunto de acordes formados ao empilhar terças sobre cada grau de uma escala
- Processo: para cada nota da escala, empilhar a 3ª e a 5ª usando apenas notas da própria escala (diatônicas)
- Resultado: 7 acordes (tríades) que "pertencem" àquela tonalidade
- Por que importa: explica por que certos acordes soam bem juntos — eles compartilham a mesma escala
- Exemplo passo a passo: construindo o campo harmônico de Dó Maior
- Diagrama: cada grau da escala com seu acorde no teclado

**Pré-requisitos:** 7.2, 8.2
**Exercícios sugeridos:** construir o campo harmônico de uma tonalidade (quiz guiado); tocar cada acorde do campo (MIDI)

---

#### 9.2 Campo Harmônico Maior e Menor

Os padrões fixos de acordes em cada tipo de campo harmônico.

**Conceitos-chave:**
- **Campo Harmônico Maior** (padrão fixo, independente da tonalidade):

| Grau | Tipo de acorde | Exemplo em Dó | Notação |
|------|---------------|---------------|---------|
| I | Maior | C | I |
| II | Menor | Dm | ii |
| III | Menor | Em | iii |
| IV | Maior | F | IV |
| V | Maior | G | V |
| VI | Menor | Am | vi |
| VII | Diminuto | Bdim | vii° |

- Notação: maiúscula = maior, minúscula = menor, ° = diminuto
- **Campo Harmônico Menor Natural**: i - ii° - III - iv - v - VI - VII
- Diferenças quando se usa a menor harmônica (V se torna maior, vii° se torna diminuto)
- A "assinatura" do campo harmônico: Maior-menor-menor-Maior-Maior-menor-dim é sempre a mesma, em qualquer tonalidade

**Pré-requisitos:** 9.1, 7.3
**Exercícios sugeridos:** identificar graus em diferentes tonalidades (quiz); tocar progressões usando graus do campo (MIDI)

---

#### 9.3 Funções Harmônicas

O papel que cada acorde desempenha dentro da tonalidade.

**Conceitos-chave:**
- **Função Tônica (repouso)**: sensação de resolução, "chegada". Graus I, iii, vi
- **Função Subdominante (transição)**: sensação de movimento, preparação. Graus ii, IV
- **Função Dominante (tensão)**: sensação de instabilidade que "pede" resolução para a tônica. Graus V, vii°
- O ciclo harmônico básico: Tônica → Subdominante → Dominante → Tônica
- A resolução V→I (dominante→tônica) como o movimento harmônico mais forte da música ocidental
- Diagrama: os três grupos funcionais com seus graus

**Pré-requisitos:** 9.2
**Exercícios sugeridos:** classificar acordes por função harmônica (quiz); tocar o ciclo T→S→D→T (MIDI)

**Contexto Histórico relevante:** Rameau e a teoria das funções harmônicas (séc. XVIII). Como esse sistema organizou a análise da música ocidental.

---

### Módulo 10: Progressões Harmônicas

*Nível: Intermediário–Avançado — 3 tópicos*

Sequências de acordes — como músicas são construídas harmonicamente.

---

#### 10.1 O Que São Progressões

Definição e como analisar sequências de acordes.

**Conceitos-chave:**
- **Progressão harmônica**: sequência de acordes que se repete como base de uma seção musical
- Notação em graus (algarismos romanos): I-V-vi-IV — independe da tonalidade
- Vantagem da notação em graus: uma mesma progressão pode ser tocada em qualquer tonalidade
- **Transposição de progressões**: como converter graus em acordes reais para qualquer tonalidade
- Exemplo: I-V-vi-IV em Dó = C-G-Am-F; em Sol = G-D-Em-C

**Pré-requisitos:** 9.2, 9.3
**Exercícios sugeridos:** converter progressões entre graus e cifras (quiz); tocar a mesma progressão em tonalidades diferentes (MIDI)

---

#### 10.2 Progressões Comuns

As sequências de acordes mais usadas na música popular.

**Conceitos-chave:**

| Progressão | Graus | Em Dó Maior | Gêneros/Uso |
|-----------|-------|-------------|-------------|
| "Pop" / "4 acordes" | I-V-vi-IV | C-G-Am-F | Pop, rock, incontáveis hits |
| "50s" | I-vi-IV-V | C-Am-F-G | Doo-wop, baladas |
| "Jazz/Bossa" | ii-V-I | Dm-G-C | Jazz, bossa nova, MPB |
| "Blues/Rock" | I-IV-V | C-F-G | Rock, country, folk |
| "12-bar Blues" | I-I-I-I-IV-IV-I-I-V-IV-I-V | (12 compassos) | Blues |
| "Andaluza" | i-VII-VI-V | Am-G-F-E | Flamenco, rock |
| "Canon" | I-V-vi-iii-IV-I-IV-V | C-G-Am-Em-F-C-F-G | Pachelbel, pop |

- Análise: por que I-V-vi-IV funciona tão bem (tensão e resolução, mistura de maior e menor)
- Exemplos de músicas reais que usam cada progressão

**Pré-requisitos:** 10.1
**Exercícios sugeridos:** tocar progressões em diferentes tonalidades (MIDI); identificar progressões em graus (quiz)

---

#### 10.3 Cadências

Os "pontos finais" e "vírgulas" da música — como frases harmônicas terminam.

**Conceitos-chave:**

| Cadência | Movimento | Sensação | Analogia |
|----------|-----------|----------|----------|
| Perfeita (autêntica) | V → I | Conclusão definitiva | Ponto final |
| Plagal | IV → I | Conclusão suave | "Amém" |
| De engano (deceptiva) | V → vi | Surpresa, continuação inesperada | Reviravolta |
| Semicadência | ? → V | Suspensão, pausa | Vírgula |

- A cadência perfeita (V→I) como o encerramento mais forte e comum
- A cadência de engano como recurso para prolongar uma seção ou criar surpresa
- Uso prático: reconhecer cadências ajuda a entender a estrutura de uma música

**Pré-requisitos:** 10.1, 9.3
**Exercícios sugeridos:** identificar tipos de cadência em exemplos (quiz); tocar cadências em diferentes tonalidades (MIDI)

---

### Módulo 11: Tópicos Avançados (Expansão Futura)

*Nível: Avançado — 6+ tópicos*

Tópicos para expansão futura do módulo. Não fazem parte do escopo inicial de implementação. Listados para referência e planejamento.

---

#### 11.1 Modos Gregos
Os 7 modos derivados da escala maior: Jônio, Dórico, Frígio, Lídio, Mixolídio, Eólio, Lócrio. Construção (rotação da escala maior), sonoridade característica de cada modo, uso em gêneros musicais.

#### 11.2 Modulação
Mudança de tonalidade dentro de uma peça. Modulação direta, por acorde pivô, por dominante secundária. Como identificar e executar.

#### 11.3 Contraponto Básico
Linhas melódicas independentes e simultâneas. Regras fundamentais (movimento paralelo, contrário, oblíquo). Contraponto a 2 vozes como introdução.

#### 11.4 Forma Musical
Estrutura de composições: verso-refrão (AABA), forma ternária (ABA), rondó (ABACA), sonata, theme and variations. Como reconhecer a forma de uma peça.

#### 11.5 Dinâmica e Expressão
Indicações de intensidade (pp, p, mp, mf, f, ff), crescendo, diminuendo. Articulação: staccato, legato, tenuto, acento. Pedal do piano.

#### 11.6 Transposição
Mover uma peça para outra tonalidade. Técnicas de transposição (por intervalo, por armadura). Aplicações práticas (adaptar a peça ao range vocal, ao tamanho do teclado).

---

## 6. Navegação e Experiência

### 6.1 Página Índice

Uma página central (ou seção principal de `theory.html`) listando todos os módulos e seus tópicos:

- Número e nome de cada módulo com descrição breve
- Lista de tópicos por módulo
- Indicador de nível por módulo (Iniciante / Intermediário / Avançado)
- (Futuro) Indicador de progresso (tópicos lidos/estudados)

### 6.2 Navegação dentro do Tópico

Cada tópico deve incluir:
- **Breadcrumb**: Teoria > Módulo X: Nome > Tópico Y: Nome
- **Botões anterior/próximo**: navegação sequencial entre tópicos
- **Link para o índice**: retorno rápido à página índice

### 6.3 Blocos Colapsáveis

Os blocos **Aprofundamento** e **Contexto Histórico** devem ser renderizados colapsados por padrão (accordion), usando `<details>/<summary>` nativo do HTML. Vantagens:

- Zero dependências (HTML nativo, sem JS)
- O leitor do Conceito não é sobrecarregado visualmente
- Conteúdo adicional permanece acessível a um clique
- Hierarquia visual clara: Conceito domina, opcionais recolhidos

### 6.4 Progresso (futuro)

Possibilidade de marcar tópicos como "estudados" via localStorage. Exibir progresso por módulo na página índice. Não é requisito para o lançamento inicial — pode ser adicionado depois.

---

## 7. Decisões de Arquitetura

Decisões tomadas em 2026-04-15 para orientar a implementação (Fase A).

### D1. Estrutura de Páginas — Página shell dinâmica ✔

**Decisão:** Uma `theory.html` com shell fixo (nav, header, sidebar) e conteúdo carregado dinamicamente via JS (`fetch`). Navegação via hash na URL (`theory.html#7.2`) para bookmarkability.

**Alternativas descartadas:**
- (a) Uma página HTML completa por tópico — boilerplate repetido (head, nav) em 35+ arquivos
- (b) Uma página por módulo — páginas longas, menos granularidade na navegação

**Justificativa:** Zero boilerplate repetido, navegação suave, padrão já usado no player (carrega músicas JSON dinamicamente). A navegação (breadcrumb, anterior/próximo, pré-requisitos) será gerada automaticamente por JS a partir de um manifesto JSON de tópicos — evita manutenção manual de links em cada fragmento.

### D2. Formato do Conteúdo — HTML fragments ✔

**Decisão:** Cada tópico como fragmento HTML (sem `<head>`/`<body>`) carregado via `fetch` pelo shell. O conteúdo é HTML rico (tabelas, diagramas, formatação), inserido no container principal da página.

**Alternativas descartadas:**
- (b) JSON + template — rígido demais para conteúdo educacional rico (tabelas variadas, diagramas, callouts)
- (c) HTML estático completo — boilerplate repetido, manutenção de nav em cada arquivo

**Justificativa:** HTML fragments combinam riqueza de conteúdo (nativo do HTML) com zero boilerplate. Compatível com o shell dinâmico (D1). Cada fragmento contém apenas o conteúdo do tópico — o shell cuida de nav, breadcrumb, estilos.

### D3. Diagramas de Teclado — HTML/CSS ✔

**Decisão:** Diagramas implementados com divs estilizadas representando teclas. Um componente JS reutilizável gera o HTML a partir de parâmetros (range de notas, notas destacadas, cores).

**Alternativas descartadas:**
- (b) SVG — mais complexo de gerar e manter
- (c) Canvas — mais complexo, não responsivo nativamente, overhead desnecessário para diagramas estáticos

**Justificativa:** HTML/CSS é a opção mais simples, responsiva por natureza, sem dependências. Suficiente para diagramas estáticos de teclado com teclas destacadas. Alinhado com a stack do projeto (sem complexidade desnecessária).
