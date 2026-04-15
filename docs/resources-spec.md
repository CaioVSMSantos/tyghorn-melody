# Especificação — Módulo de Recursos

## 1. Visão Geral

Página de curadoria do Tyghorn Melody dedicada a reunir recomendações de recursos externos para quem deseja se aprofundar no mundo da música, do teclado e do piano. Público-alvo: desde iniciantes absolutos até quem busca profissionalização.

A página **não é** um agregador automatizado, um catálogo exaustivo ou uma loja. É uma **biblioteca pessoal curada** — cada recurso foi selecionado por sua qualidade, relevância e acessibilidade. A curadoria prioriza recursos em português do Brasil, mas inclui recursos em outros idiomas quando a qualidade justifica.

### Objetivos

- Oferecer uma lista organizada e confiável de recursos para aprofundamento musical
- Cobrir diversas mídias e formatos (livros, vídeos, cursos, ferramentas, comunidades, entretenimento)
- Facilitar a descoberta — o usuário deve conseguir encontrar o que procura rapidamente
- Manter-se atualizada — mecanismo claro de revisão e marcação de obsolescência
- Complementar o módulo de Teoria Musical e o Player de Prática, não substituí-los

### Escopo

A curadoria abrange música e teoria musical com foco no **teclado e no piano**, mas não se restringe exclusivamente a eles. Recursos de teoria musical geral, apreciação musical, cultura e história são bem-vindos quando relevantes para o público-alvo.

**Fora do escopo:** recursos sobre produção musical/DAWs, engenharia de som, DJing, marketing musical, ou instrumentos não relacionados ao teclado (exceto quando o recurso é de teoria geral aplicável).

---

## 2. Princípios de Curadoria

### 2.1 Critérios de Inclusão

Um recurso deve atender a **pelo menos três** dos seguintes critérios para ser incluído:

| Critério | Descrição |
|----------|-----------|
| **Qualidade reconhecida** | Boa reputação entre músicos, educadores ou comunidades musicais |
| **Relevância temática** | Diretamente relacionado a teoria musical, teclado, piano, ou aprendizado musical |
| **Acessibilidade** | Disponível para aquisição ou acesso pelo público brasileiro (compra, streaming, acesso online) |
| **Valor pedagógico** | Ensina, inspira ou contribui de forma tangível para o aprendizado musical |
| **Longevidade** | Não é conteúdo efêmero — tem valor duradouro ou é uma referência estabelecida |

### 2.2 Critérios de Exclusão

- Recursos de qualidade duvidosa ou sem reputação verificável
- Conteúdo exclusivamente promocional ou com viés comercial forte
- Recursos inacessíveis ao público brasileiro sem soluções alternativas (VPN, importação proibitiva)
- Material que exija conhecimento avançado sem indicar isso claramente (a menos que categorizado como avançado)

### 2.3 Política de Idioma

**Idioma preferencial:** Português do Brasil (pt-BR).

Recursos em outros idiomas são incluídos quando:
- Não existe equivalente de qualidade comparável em português
- O recurso é uma referência consagrada na área (ex.: livros-texto clássicos sem tradução)
- A qualidade é excepcional o suficiente para justificar a barreira linguística

**Marcação:** Recursos em idioma diferente de pt-BR recebem uma badge de idioma visível (ver seção 6.4). Recursos em português não recebem marcação — pt-BR é o padrão assumido.

### 2.4 Política de Links

Links diretos devem ser usados com cautela. A prioridade é que o usuário possa **encontrar** o recurso mesmo que um link específico quebre.

**Regra geral:**
- Sempre incluir o **título completo** e informações suficientes para busca (autor, editora, plataforma)
- Links diretos são bem-vindos para recursos com URLs estáveis (sites oficiais, plataformas consolidadas)
- Para recursos em plataformas de venda (Amazon, Steam, etc.), preferir informações de busca em vez de links diretos — URLs de e-commerce são notoriamente instáveis
- Para canais do YouTube, podcasts e cursos online, links diretos são aceitáveis (URLs de canais/perfis são mais estáveis que URLs de produtos)

**Indicações de onde encontrar** (Amazon, Spotify, YouTube, Steam, serviços de streaming, etc.) são incluídas como metadado do recurso, não como link obrigatório.

---

## 3. Arquitetura Técnica

### 3.1 Visão Geral

A página segue o padrão **JSON + render dinâmico**: os dados dos recursos ficam em um arquivo JSON estruturado, e um script JavaScript carrega, organiza e renderiza o conteúdo na página.

**Arquivos envolvidos:**

| Arquivo | Responsabilidade |
|---------|-----------------|
| `pages/resources.html` | Shell HTML da página (navbar, container, estrutura base) |
| `data/resources.json` | Dados completos de todos os recursos e categorias |
| `js/resources.js` | Carregamento do JSON, renderização, lógica de accordion e filtros |
| `css/style.css` | Estilos (reutiliza tokens existentes + componentes específicos) |

### 3.2 Estrutura do JSON

O arquivo `data/resources.json` possui dois blocos principais: `metadata`, `categories` e `resources`.

```json
{
  "metadata": {
    "lastReviewDate": "2026-04",
    "totalResources": 0,
    "version": "1.0"
  },
  "categories": [
    {
      "id": "books",
      "name": "Livros",
      "icon": "📚",
      "description": "Descrição da categoria exibida na página.",
      "group": "study",
      "order": 1
    }
  ],
  "resources": [
    {
      "id": "book-001",
      "title": "Título do Recurso",
      "subtitle": "Autor / Criador / Info adicional",
      "description": "Breve descrição do recurso e por que é recomendado.",
      "category": "books",
      "language": "pt-br",
      "url": "https://exemplo.com (opcional)",
      "searchHint": "Disponível na Amazon, Livraria Cultura",
      "status": "active",
      "tags": ["iniciante", "teoria", "piano"],
      "addedDate": "2026-04",
      "lastChecked": "2026-04"
    }
  ]
}
```

### 3.3 Schema Detalhado — Categorias

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | string | Sim | Identificador único da categoria (kebab-case) |
| `name` | string | Sim | Nome de exibição da categoria |
| `icon` | string | Sim | Emoji representativo |
| `description` | string | Sim | 1-2 frases descrevendo o tipo de recurso. Exibida na página |
| `group` | string | Sim | Agrupamento lógico (ver seção 4.1) |
| `order` | number | Sim | Ordem de exibição dentro do grupo |

### 3.4 Schema Detalhado — Recursos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | string | Sim | Identificador único do recurso (kebab-case, prefixado pela categoria) |
| `title` | string | Sim | Título completo do recurso |
| `subtitle` | string | Não | Autor, criador, editora, ou informação complementar |
| `description` | string | Sim | 1-3 frases sobre o recurso e por que é recomendado |
| `category` | string | Sim | ID da categoria à qual pertence |
| `language` | string | Sim | Código de idioma: `pt-br`, `en`, `es`, etc. |
| `url` | string | Não | Link direto (apenas se URL estável e confiável) |
| `searchHint` | string | Recomendado | Onde encontrar o recurso (plataformas, lojas, serviços) |
| `status` | string | Sim | `active`, `outdated` ou `unavailable` |
| `tags` | array | Não | Tags para contexto: nível (`iniciante`, `intermediario`, `avancado`), tema, formato |
| `addedDate` | string | Sim | Mês/ano de inclusão no catálogo (formato `YYYY-MM`) |
| `lastChecked` | string | Sim | Mês/ano da última verificação de disponibilidade |

### 3.5 Validação

O script `resources.js` deve validar a estrutura do JSON ao carregar:

- Campos obrigatórios presentes em cada recurso e categoria
- `category` de cada recurso referencia um `id` existente em `categories`
- `status` é um dos valores permitidos (`active`, `outdated`, `unavailable`)
- `language` é um código válido (pelo menos `pt-br` e `en`)
- `order` das categorias é único dentro de cada grupo

Erros de validação devem ser logados no console, mas não devem impedir a renderização dos itens válidos.

---

## 4. Catálogo de Categorias

### 4.1 Agrupamento

As categorias são organizadas em **grupos lógicos** para facilitar a navegação mental. Os grupos não são exibidos como seções separadas na página — servem como critério de ordenação e, potencialmente, agrupamento visual sutil (separador entre grupos).

| Grupo | ID | Descrição | Categorias |
|-------|----|-----------|------------|
| Estudo e Aprendizado | `study` | Materiais educacionais em diversos formatos | 6 categorias |
| Ferramentas e Prática | `tools` | Ferramentas digitais para prática e criação | 3 categorias |
| Equipamento | `gear` | Aquisição e cuidado com instrumentos | 2 categorias |
| Cultura e Inspiração | `culture` | Conteúdo para inspirar, motivar e ampliar repertório | 4 categorias |
| Comunidade e Carreira | `community` | Conexão com outros músicos e caminhos profissionais | 2 categorias |
| Público Específico | `audience` | Recursos para perfis específicos | 1 categoria |

**Ordem de exibição na página:** `study` → `tools` → `gear` → `culture` → `community` → `audience`

Lógica: começa pelo que o usuário mais provavelmente busca (material de estudo), passa por ferramentas práticas e equipamento, depois cultura e inspiração (engajamento), e finaliza com comunidade/carreira/públicos especiais.

---

### 4.2 Categorias Detalhadas

Cada categoria abaixo inclui: definição, público-alvo, diretrizes de curadoria e exemplos do tipo de recurso esperado (não são recomendações finais — são ilustrações do perfil).

---

#### 4.2.1 Livros

| Campo | Valor |
|-------|-------|
| **ID** | `books` |
| **Grupo** | `study` |
| **Ordem** | 1 |
| **Icone** | `📚` |
| **Descrição (página)** | Obras de referência sobre teoria musical, técnica pianística e história da música. De manuais introdutórios a tomos acadêmicos para quem aprecia profundidade. |

**Diretrizes de curadoria:**
- Priorizar livros que sejam referências reconhecidas no ensino de música ou piano
- Incluir tanto livros introdutórios (para quem está começando) quanto obras de referência (para consulta contínua)
- Métodos clássicos de piano (Hanon, Czerny, Beyer, etc.) são bem-vindos com contextualização de para quem servem
- Indicar claramente o nível de cada livro (iniciante, intermediário, avançado)
- Livros esgotados mas encontráveis em sebos podem ser incluídos com nota de disponibilidade

**Perfil de recurso esperado:** livros-texto de teoria musical, métodos de piano, enciclopédias musicais, livros de harmonia, biografias de compositores com valor educacional.

---

#### 4.2.2 Revistas e Periódicos

| Campo | Valor |
|-------|-------|
| **ID** | `magazines` |
| **Grupo** | `study` |
| **Ordem** | 2 |
| **Icone** | `📰` |
| **Descrição (página)** | Revistas, periódicos e publicações regulares sobre música, teclado e piano. Leitura mais leve e atualizada do que livros, com dicas práticas e novidades do mercado. |

**Diretrizes de curadoria:**
- Incluir publicações ativas e com histórico de qualidade
- Publicações descontinuadas só se o acervo ainda estiver disponível online
- Newsletters e blogs de alta qualidade podem ser incluídos se tiverem consistência editorial
- Indicar se a publicação é gratuita ou paga

**Perfil de recurso esperado:** revistas de música/teclado (digitais ou físicas), newsletters especializadas, blogs com valor editorial consistente.

---

#### 4.2.3 Cursos Online e Presenciais

| Campo | Valor |
|-------|-------|
| **ID** | `courses` |
| **Grupo** | `study` |
| **Ordem** | 3 |
| **Icone** | `🎓` |
| **Descrição (página)** | Cursos estruturados para aprender teoria musical e técnica no teclado ou piano. De plataformas online gratuitas a escolas e conservatórios reconhecidos. |

**Diretrizes de curadoria:**
- Priorizar cursos com boa reputação e avaliações verificáveis
- Incluir opções em diferentes faixas de preço (gratuitos, acessíveis, premium)
- Para cursos online, indicar a plataforma (Coursera, Udemy, YouTube, site próprio)
- Para presenciais, focar em instituições de alcance nacional ou amplamente reconhecidas
- Conservatórios e escolas de música devem ser referências consolidadas
- Indicar claramente se o curso é gratuito, pago, ou freemium

**Perfil de recurso esperado:** cursos de piano/teclado em plataformas de ensino, programas de conservatórios, cursos universitários abertos (MOOCs), masterclasses online.

---

#### 4.2.4 Vídeos e Playlists

| Campo | Valor |
|-------|-------|
| **ID** | `videos` |
| **Grupo** | `study` |
| **Ordem** | 4 |
| **Icone** | `🎬` |
| **Descrição (página)** | Canais do YouTube, playlists e videoaulas sobre teoria musical, técnica pianística e prática no teclado. Conteúdo visual e dinâmico para complementar o estudo. |

**Diretrizes de curadoria:**
- Priorizar canais com conteúdo consistente e bem produzido (não vídeos avulsos)
- Canais que cobrem teoria musical geral são válidos, não apenas teclado
- Indicar o foco principal do canal (teoria, prática, análise, entretenimento educativo)
- Playlists específicas podem ser recomendadas quando o canal é amplo demais
- Verificar que o canal ainda está ativo ou, se inativo, que o acervo permanece disponível

**Perfil de recurso esperado:** canais educacionais de teoria/piano no YouTube, playlists temáticas, videoaulas de professores reconhecidos.

---

#### 4.2.5 Podcasts e Programas de Áudio

| Campo | Valor |
|-------|-------|
| **ID** | `podcasts` |
| **Grupo** | `study` |
| **Ordem** | 5 |
| **Icone** | `🎙️` |
| **Descrição (página)** | Podcasts e programas de áudio sobre música, teoria musical, história e cultura pianística. Para ouvir no deslocamento, durante exercícios ou em momentos de pausa. |

**Diretrizes de curadoria:**
- Priorizar podcasts com catálogo substancial (pelo menos 10+ episódios)
- Podcasts inativos mas com catálogo disponível são válidos (com nota)
- Indicar a plataforma principal onde encontrar (Spotify, Apple Podcasts, YouTube, site próprio)
- Incluir tanto podcasts focados em ensino quanto os focados em cultura/história musical

**Perfil de recurso esperado:** podcasts de teoria musical, entrevistas com músicos, história da música, análise de composições.

---

#### 4.2.6 Documentários

| Campo | Valor |
|-------|-------|
| **ID** | `documentaries` |
| **Grupo** | `study` |
| **Ordem** | 6 |
| **Icone** | `🎞️` |
| **Descrição (página)** | Documentários sobre música, compositores, instrumentos e a cultura musical. Aprendizado através de narrativas visuais e histórias reais. |

**Diretrizes de curadoria:**
- Incluir documentários disponíveis em plataformas de streaming acessíveis no Brasil
- Documentários sobre compositores clássicos, história do piano, gêneros musicais
- Indicar onde assistir (Netflix, Prime Video, YouTube, etc.)
- Documentários fora de catálogo de streaming podem ser incluídos se encontráveis por outros meios

**Perfil de recurso esperado:** documentários sobre compositores (Bach, Mozart, Beethoven), história do piano, cultura musical, bastidores de orquestras/performances.

---

#### 4.2.7 Partituras e Songbooks

| Campo | Valor |
|-------|-------|
| **ID** | `sheet-music` |
| **Grupo** | `tools` |
| **Ordem** | 1 |
| **Icone** | `🎼` |
| **Descrição (página)** | Fontes de partituras gratuitas e pagas para piano e teclado. De domínio público a arranjos contemporâneos — material para tocar além do catálogo do Tyghorn Melody. |

**Diretrizes de curadoria:**
- Priorizar repositórios confiáveis e com acervo amplo
- Distinguir claramente entre fontes gratuitas (domínio público) e pagas
- Incluir tanto partituras clássicas quanto arranjos populares simplificados
- Sites com partituras interativas (MusicXML, MIDI) são um diferencial
- Partituras ilegais ou sites de pirataria estão explicitamente excluídos

**Perfil de recurso esperado:** bibliotecas digitais de partituras (IMSLP, MuseScore), lojas de partituras digitais, coletâneas impressas recomendadas.

---

#### 4.2.8 Software de Notação Musical

| Campo | Valor |
|-------|-------|
| **ID** | `notation-software` |
| **Grupo** | `tools` |
| **Ordem** | 2 |
| **Icone** | `🖊️` |
| **Descrição (página)** | Programas e aplicativos para escrever, editar e visualizar partituras musicais. Para quem deseja praticar escrita musical ou criar seus próprios arranjos. |

**Diretrizes de curadoria:**
- Incluir opções gratuitas e pagas, com ênfase nas gratuitas/open-source
- Indicar plataforma (desktop, web, mobile)
- Focar em ferramentas acessíveis a iniciantes, não apenas profissionais
- Ferramentas web (sem instalação) são especialmente valiosas para o público-alvo

**Perfil de recurso esperado:** editores de partituras (MuseScore, Flat.io, Noteflight), ferramentas de escrita musical simplificadas.

---

#### 4.2.9 Aplicativos e Ferramentas Online

| Campo | Valor |
|-------|-------|
| **ID** | `apps-tools` |
| **Grupo** | `tools` |
| **Ordem** | 3 |
| **Icone** | `📱` |
| **Descrição (página)** | Aplicativos e ferramentas digitais para treinamento auditivo, identificação de acordes, prática rítmica e outros exercícios musicais. Complementos para o estudo diário. |

**Diretrizes de curadoria:**
- Priorizar ferramentas com versão gratuita funcional
- Incluir tanto apps mobile quanto ferramentas web
- Focar em ferramentas de prática ativa (ear training, rhythm training, chord recognition)
- Afinadores, metrônomos e ferramentas utilitárias são válidos
- Evitar sobreposição com o próprio Tyghorn Melody — incluir ferramentas que fazem o que nós não fazemos

**Perfil de recurso esperado:** apps de ear training, treinadores de ritmo, identificadores de acorde, afinadores, teclados virtuais com funcionalidades extras.

---

#### 4.2.10 Lojas e Sites de Instrumentos

| Campo | Valor |
|-------|-------|
| **ID** | `stores` |
| **Grupo** | `gear` |
| **Ordem** | 1 |
| **Icone** | `🏪` |
| **Descrição (página)** | Lojas físicas e online onde comprar teclados, pianos digitais, acessórios e ter suporte técnico. Referências confiáveis para quem está escolhendo seu primeiro instrumento ou fazendo upgrade. |

**Diretrizes de curadoria:**
- Incluir apenas lojas com reputação consolidada e atendimento ao público brasileiro
- Priorizar lojas especializadas em instrumentos musicais (não marketplaces genéricos)
- Lojas físicas devem ter alcance nacional ou serem referências regionais amplamente conhecidas
- Para lojas online, verificar reputação em sites de avaliação (Reclame Aqui, etc.)
- Incluir tanto lojas de instrumentos novos quanto usados/recondicionados, quando confiáveis

**Perfil de recurso esperado:** lojas especializadas (físicas e online), marketplaces de instrumentos usados, importadoras confiáveis.

---

#### 4.2.11 Guias de Manutenção

| Campo | Valor |
|-------|-------|
| **ID** | `maintenance` |
| **Grupo** | `gear` |
| **Ordem** | 2 |
| **Icone** | `🔧` |
| **Descrição (página)** | Guias e instruções sobre cuidados, manutenção e conservação de teclados e pianos. Do básico (limpeza, armazenamento) ao avançado (afinação, regulagem). |

**Diretrizes de curadoria:**
- Distinguir entre manutenção de teclados digitais e pianos acústicos (públicos muito diferentes)
- Priorizar guias que o usuário pode seguir em casa (manutenção preventiva)
- Para manutenção profissional (afinação de piano, por exemplo), indicar como encontrar profissionais qualificados
- Vídeos instrutivos são especialmente valiosos nesta categoria
- Incluir orientações sobre transporte e armazenamento

**Perfil de recurso esperado:** guias de limpeza e conservação, tutoriais de manutenção preventiva, referências de afinadores profissionais, orientações de transporte.

---

#### 4.2.12 Músicos Recomendados

| Campo | Valor |
|-------|-------|
| **ID** | `musicians` |
| **Grupo** | `culture` |
| **Ordem** | 1 |
| **Icone** | `🎹` |
| **Descrição (página)** | Pianistas, tecladistas e compositores cujo trabalho vale conhecer — para inspiração, estudo e pura apreciação musical. De clássicos consagrados a contemporâneos surpreendentes. |

**Diretrizes de curadoria:**
- Incluir artistas de diferentes períodos, gêneros e estilos
- Priorizar músicos cujo trabalho é acessível para escuta (em plataformas de streaming)
- Incluir uma breve contextualização de por que cada músico é relevante
- Não se limitar a pianistas clássicos — incluir jazz, popular, contemporâneo, experimental
- Organizar por estilo/período pode ser útil (clássico, jazz, contemporâneo)

**Perfil de recurso esperado:** pianistas clássicos (Horowitz, Argerich), jazzistas (Bill Evans, Herbie Hancock), compositores (Chopin, Debussy), contemporâneos (Nils Frahm, Hiromi).

---

#### 4.2.13 Filmes, Séries e Entretenimento

| Campo | Valor |
|-------|-------|
| **ID** | `entertainment` |
| **Grupo** | `culture` |
| **Ordem** | 2 |
| **Icone** | `🍿` |
| **Descrição (página)** | Filmes, séries e animações com temática musical — para diversão, inspiração e uma perspectiva diferente sobre o mundo da música. Nem tudo precisa ser aula. |

**Diretrizes de curadoria:**
- Foco em obras onde a música é tema central, não mero pano de fundo
- Incluir uma breve sinopse sem spoilers e por que a obra é relevante
- Filmes sobre compositores, pianistas, escolas de música, competições musicais
- Indicar onde assistir (streaming, aluguel digital, etc.)
- Animações e animes com temática musical são bem-vindos (ex.: Your Lie in April, Piano no Mori)
- Obras que retratam a vida musical de forma realista ou inspiradora

**Perfil de recurso esperado:** filmes (Whiplash, The Pianist, Amadeus), séries (Mozart in the Jungle), animes musicais, biopics de compositores.

---

#### 4.2.14 Jogos Musicais

| Campo | Valor |
|-------|-------|
| **ID** | `games` |
| **Grupo** | `culture` |
| **Ordem** | 3 |
| **Icone** | `🎮` |
| **Descrição (página)** | Jogos de videogame e tabuleiro com temática musical ou que envolvam teclado e piano. Aprender e praticar brincando — diversão com valor educacional. |

**Diretrizes de curadoria:**
- Incluir jogos de diferentes plataformas (PC, consoles, mobile, tabuleiro)
- Priorizar jogos que tenham valor educacional musical (mesmo que secundário)
- Jogos de ritmo (rhythm games) são válidos quando envolvem conceitos musicais reais
- Indicar plataforma e onde encontrar (Steam, lojas de console, etc.)
- Jogos descontinuados mas encontráveis podem ser incluídos com nota

**Perfil de recurso esperado:** jogos de ritmo com teclado (Synthesia, Piano Tiles), jogos educativos musicais, jogos de tabuleiro sobre música, rhythm games com valor musical.

---

#### 4.2.15 Concertos, Festivais e Eventos

| Campo | Valor |
|-------|-------|
| **ID** | `events` |
| **Grupo** | `culture` |
| **Ordem** | 4 |
| **Icone** | `🎪` |
| **Descrição (página)** | Eventos musicais recorrentes, temporadas de orquestras e plataformas de concertos ao vivo ou gravados. Assistir a performances é uma das formas mais poderosas de motivação e aprendizado. |

**Diretrizes de curadoria:**
- Focar em eventos recorrentes/anuais (não eventos únicos que já passaram)
- Incluir opções presenciais no Brasil e transmissões online internacionais
- Plataformas de concertos gravados (Digital Concert Hall, Medici.tv) são válidas
- Temporadas de orquestras e salas de concerto brasileiras acessíveis
- Concursos de piano (Chopin, Van Cliburn, etc.) como referência de excelência
- Indicar periodicidade e como acompanhar

**Perfil de recurso esperado:** festivais de música clássica, temporadas de orquestras, plataformas de streaming de concertos, concursos internacionais de piano.

---

#### 4.2.16 Comunidades e Fóruns

| Campo | Valor |
|-------|-------|
| **ID** | `communities` |
| **Grupo** | `community` |
| **Ordem** | 1 |
| **Icone** | `👥` |
| **Descrição (página)** | Comunidades online onde trocar experiências, tirar dúvidas e encontrar outros estudantes e músicos. Aprender música é mais fácil (e mais divertido) acompanhado. |

**Diretrizes de curadoria:**
- Priorizar comunidades ativas (posts/mensagens recentes)
- Incluir comunidades em português e em inglês (com marcação)
- Reddit, Discord, Facebook, fóruns especializados
- Indicar o foco e o nível da comunidade (iniciante-friendly, avançado, geral)
- Comunidades com moderação ativa e ambiente acolhedor devem ser priorizadas

**Perfil de recurso esperado:** subreddits (r/piano, r/musictheory), servidores Discord, grupos Facebook, fóruns especializados em piano/teclado.

---

#### 4.2.17 Profissionalização

| Campo | Valor |
|-------|-------|
| **ID** | `career` |
| **Grupo** | `community` |
| **Ordem** | 2 |
| **Icone** | `💼` |
| **Descrição (página)** | Guias, orientações e indicações para quem deseja seguir carreira na área musical — como professor, performer, arranjador ou compositor. Os primeiros passos no caminho profissional. |

**Diretrizes de curadoria:**
- Focar em recursos que orientem sobre caminhos de carreira, não apenas "como ficar famoso"
- Incluir informações sobre formação acadêmica (bacharelado, licenciatura em música)
- Orientações sobre certificações, registros profissionais (OMB, etc.)
- Guias práticos: como dar aulas, como se apresentar profissionalmente, como precificar
- Recursos sobre o mercado de trabalho musical no Brasil

**Perfil de recurso esperado:** guias de carreira musical, informações sobre cursos superiores de música, orientações para professores particulares, recursos sobre mercado de trabalho.

---

#### 4.2.18 Recursos para Crianças e Pais

| Campo | Valor |
|-------|-------|
| **ID** | `kids` |
| **Grupo** | `audience` |
| **Ordem** | 1 |
| **Icone** | `👶` |
| **Descrição (página)** | Recursos voltados para crianças e para pais que desejam introduzir seus filhos ao mundo da música e do piano. Métodos, aplicativos, livros e orientações adaptados para os pequenos. |

**Diretrizes de curadoria:**
- Incluir recursos tanto para as crianças quanto para orientar os pais
- Métodos de piano para crianças (com abordagem lúdica)
- Indicar faixa etária recomendada quando possível
- Aplicativos e jogos educativos musicais para crianças
- Orientações sobre a idade adequada para começar, como escolher professor, etc.
- Livros infantis sobre música e instrumentos

**Perfil de recurso esperado:** métodos de piano infantil, apps musicais para crianças, livros infantis sobre música, guias para pais sobre ensino musical.

---

## 5. Estrutura da Página

### 5.1 Layout Geral

```
┌─────────────────────────────────────────────┐
│  Navbar (4 itens: Teoria, Prática,          │
│          Ferramentas, Recursos)              │
├─────────────────────────────────────────────┤
│                                             │
│  📚 Recursos e Recomendações                │
│  Subtítulo descritivo                       │
│  Última revisão: Abril 2026                 │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ ▶ 📚 Livros                        │    │
│  │   Descrição da categoria...         │    │
│  ├─────────────────────────────────────┤    │
│  │   • Recurso 1  [EN]                │    │
│  │     Descrição breve                 │    │
│  │     📍 Amazon, Livraria Cultura     │    │
│  │                                     │    │
│  │   • Recurso 2                       │    │
│  │     Descrição breve                 │    │
│  │     🔗 link-direto.com              │    │
│  │                                     │    │
│  │   • Recurso 3  ⚠️ Desatualizado     │    │
│  │     Descrição breve                 │    │
│  │     📍 Sebos, Estante Virtual       │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ ▶ 📰 Revistas e Periódicos         │    │
│  │   ...                               │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ... (demais categorias)                    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ 🗄️ Arquivo                          │    │
│  │   Recursos removidos da lista       │    │
│  │   principal por indisponibilidade.  │    │
│  │                                     │    │
│  │   • Recurso antigo (ex-books)       │    │
│  │     Motivo da remoção e data        │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### 5.2 Cabeçalho

- Título principal da página com emoji: `📚 Recursos e Recomendações`
- Subtítulo: 1-2 frases contextualizando a página (curadoria, foco em teclado/piano, convite a explorar)
- **Data de última revisão** em destaque abaixo do subtítulo, formato: `Última revisão: Mês Ano`
- A data é extraída de `metadata.lastReviewDate` no JSON

### 5.3 Seções Colapsáveis (Accordion)

Cada categoria é uma seção colapsável:

- **Cabeçalho da seção:** Emoji + Nome da categoria + indicador de expandir/colapsar (▶/▼)
- **Descrição:** Exibida logo abaixo do título da seção (sempre visível, dentro do header clicável ou imediatamente após abrir)
- **Conteúdo:** Lista de recursos, exibida ao expandir
- **Estado inicial:** Todas as seções colapsadas (página como índice navegável)
- **Interação:** Clicar no cabeçalho alterna entre expandido/colapsado
- **Comportamento:** Múltiplas seções podem estar abertas simultaneamente (não é exclusivo)

**Separação entre grupos:** Um separador visual sutil (linha ou espaço extra) entre grupos de categorias. Sem cabeçalhos de grupo explícitos — a organização deve ser sentida, não declarada.

### 5.4 Item de Recurso

Cada recurso individual dentro de uma seção:

```
📌 Título do Recurso  [EN]  ⚠️
   Autor / Criador / Info complementar
   Descrição breve do recurso e por que é recomendado.
   📍 Disponível em: Amazon, Livraria Cultura
   🔗 site-do-recurso.com
```

**Elementos:**
- **Título** (obrigatório): nome completo do recurso, em destaque
- **Badge de idioma** (condicional): exibido apenas se `language` ≠ `pt-br`
- **Badge de status** (condicional): exibido apenas se `status` ≠ `active`
- **Subtítulo** (opcional): autor, criador, editora — tom secundário
- **Descrição** (obrigatória): 1-3 frases
- **Onde encontrar** (quando presente): prefixado com `📍`
- **Link direto** (quando presente): prefixado com `🔗`, clicável

### 5.5 Seção de Arquivo

Ao final da página, após todas as categorias, uma seção fixa (não colapsável, ou colapsada por padrão):

- Título: `🗄️ Arquivo`
- Descrição: "Recursos anteriormente recomendados que foram removidos por indisponibilidade ou obsolescência. Mantidos aqui como referência histórica."
- Lista recursos com `status: "unavailable"`, agrupados por categoria de origem
- Cada item arquivado inclui: título, motivo da remoção, data aproximada

**Regra:** Recursos com `status: "unavailable"` **não** aparecem nas seções de categorias. Apenas no Arquivo.

Recursos com `status: "outdated"` **permanecem** nas seções de categorias, com badge de aviso visível, e **não** são duplicados no Arquivo.

---

## 6. Componentes Visuais

### 6.1 Paleta e Estilo

Segue a paleta Synthwave Cyberpunk definida em [design.md](design.md). Componentes específicos:

| Elemento | Estilo |
|----------|--------|
| Seção colapsável (header) | `--bg-surface` com borda `--neon-purple` sutil. Hover com glow leve |
| Seção colapsável (conteúdo) | `--bg-dark` |
| Título de recurso | `--text-primary`, peso bold |
| Subtítulo de recurso | `--text-secondary` |
| Descrição de recurso | `--text-primary`, peso normal |
| Link direto | `--neon-cyan` (consistente com links do projeto) |
| Onde encontrar | `--text-secondary` |
| Separador de grupo | Linha `--neon-purple` com opacidade reduzida |

### 6.2 Badge de Idioma

Exibido ao lado do título do recurso quando `language` ≠ `pt-br`.

| Idioma | Badge |
|--------|-------|
| Inglês | `EN` |
| Espanhol | `ES` |
| Outros | Código ISO 639-1 em maiúsculas |

**Estilo visual:** texto em caixa alta, tamanho reduzido, dentro de um retângulo arredondado com borda sutil. Cor neutra — não deve competir com o título. Sugestão: `--text-secondary` com borda `--neon-purple` de baixa opacidade.

### 6.3 Badge de Status

Exibido ao lado do título do recurso quando `status` ≠ `active`.

| Status | Badge | Estilo |
|--------|-------|--------|
| `outdated` | `Desatualizado` | Borda e texto `--neon-yellow` (aviso) |
| `unavailable` | `Indisponível` | Borda e texto `--neon-pink` (alerta) |

**Nota:** Recursos `unavailable` só aparecem no Arquivo, então o badge `Indisponível` aparece apenas naquela seção. O badge `Desatualizado` aparece nas categorias normais.

### 6.4 Indicador de Expandir/Colapsar

Caractere de seta que rotaciona ou alterna:
- **Colapsado:** `▶` (ou equivalente CSS com `transform: rotate`)
- **Expandido:** `▼`

Animação de transição suave (CSS `transition`) ao alternar.

### 6.5 Contagem de Recursos

Opcional mas recomendado: exibir a quantidade de recursos ativos ao lado do título de cada seção.

Exemplo: `📚 Livros (12)`

Gerado automaticamente pelo script ao renderizar. Conta apenas recursos com `status: "active"`.

---

## 7. Integração com o Projeto

### 7.1 Hub — Novo Card

Adicionar um card na página hub (`index.html`) para a seção de Recursos:

```
📚 Recursos
Livros, cursos, vídeos, ferramentas e recomendações para se aprofundar.
```

Posição: 4º card no hub-grid, após Ferramentas.

### 7.2 Navbar — Novo Link

Adicionar link `Recursos` na navbar de todas as páginas:

```
🎹 Tyghorn Melody    Teoria  Prática  Ferramentas  Recursos
```

Posição: último item à direita, após Ferramentas.

### 7.3 Atualização da Arquitetura

Adicionar à tabela de páginas em [architecture.md](architecture.md):

| Página | Arquivo | Script | Responsabilidade |
|--------|---------|--------|-----------------|
| Recursos | `pages/resources.html` | `js/resources.js` | Curadoria de recursos externos para aprofundamento |

Adicionar à estrutura de diretórios:
- `pages/resources.html`
- `js/resources.js`
- `data/resources.json`

Adicionar à tabela de módulos JavaScript:

| Módulo | Dependências | Responsabilidade |
|--------|-------------|-----------------|
| `resources.js` | — | Carregamento e renderização do catálogo de recursos a partir de JSON |

### 7.4 Cross-referência com Teoria Musical

O módulo de Teoria Musical pode, nos blocos de Aprofundamento de tópicos relevantes, incluir links para a página de Recursos como "para ir mais longe, consulte nossos Recursos recomendados". Essa integração é natural e não-intrusiva.

---

## 8. Manutenção

### 8.1 Ciclo de Revisão

A lista de recursos deve passar por revisão periódica para garantir que links funcionam, recursos continuam disponíveis e a curadoria permanece relevante.

**Frequência recomendada:** A cada **6 meses**, ou quando houver indícios de mudança significativa (plataforma fechou, recurso foi removido, etc.).

**Checklist de revisão:**
1. Verificar acessibilidade de todos os links diretos (`url`)
2. Verificar se recursos com `searchHint` ainda são encontráveis nas plataformas indicadas
3. Atualizar `lastChecked` de cada recurso verificado
4. Migrar recursos inacessíveis para `status: "unavailable"` (vão para o Arquivo)
5. Marcar recursos com problemas parciais como `status: "outdated"`
6. Atualizar `metadata.lastReviewDate`
7. Adicionar novos recursos descobertos durante a revisão

### 8.2 Ciclo de Vida de um Recurso

```
  Novo recurso encontrado
         │
         ▼
    ┌─────────┐
    │  active  │ ← Estado normal. Recurso disponível e funcional
    └────┬────┘
         │ Problemas parciais detectados
         ▼
   ┌────────────┐
   │  outdated  │ ← Recurso com problemas mas ainda encontrável/útil
   └─────┬──────┘   Ex.: site mudou de URL, livro esgotado mas em sebos
         │
         ├── Problemas resolvidos → volta a "active"
         │
         │ Completamente inacessível
         ▼
  ┌──────────────┐
  │ unavailable  │ ← Recurso removido. Migra para o Arquivo
  └──────────────┘   Ex.: site saiu do ar, plataforma fechou
```

### 8.3 Adição de Novos Recursos

Para adicionar um novo recurso:
1. Verificar que atende aos critérios de inclusão (seção 2.1)
2. Verificar que não duplica recurso existente
3. Preencher todos os campos obrigatórios do schema
4. Atribuir à categoria correta
5. Definir `status: "active"`, `addedDate` e `lastChecked` com a data atual
6. Atualizar `metadata.totalResources`

---

## 9. Acessibilidade

### 9.1 Navegação por Teclado

- Seções colapsáveis devem ser operáveis via teclado (Enter/Space para toggle)
- Links devem ter `focus` visível (consistente com o restante do projeto)
- Ordem de tabulação lógica: cabeçalhos de seção → itens dentro da seção aberta

### 9.2 Semântica HTML

- Seções colapsáveis devem usar `button` no header (acessível por teclado nativamente)
- Atributos `aria-expanded` e `aria-controls` nos botões de accordion
- Região de conteúdo com `role="region"` e `aria-labelledby` referenciando o header
- Links externos com `rel="noopener noreferrer"` e `target="_blank"` (abrir em nova aba)
- Links externos devem indicar visualmente que abrem em nova aba (ícone ou texto)

### 9.3 Contraste

Verificar contraste de todos os badges (idioma, status) contra o fundo. WCAG AA mínimo (4.5:1 para texto normal, 3:1 para texto grande).

---

## 10. Decisões de Arquitetura (Registro)

Decisões tomadas durante a especificação, com justificativa.

| # | Decisão | Alternativa rejeitada | Justificativa |
|---|---------|----------------------|---------------|
| 1 | JSON + render dinâmico para dados dos recursos | HTML estático | 18 categorias com metadados por recurso (status, idioma, data) tornam o JSON mais manutenível. Pattern já existente no projeto (catalog.json). Facilita contagem automática e filtragem futura |
| 2 | Accordion JS para seções colapsáveis | `<details>/<summary>` HTML nativo | Como o JS já renderiza os dados do JSON, adicionar lógica de accordion é trivial. Permite animação consistente e estilo alinhado com o restante do projeto. A theory-spec também prevê blocos colapsáveis — mesma solução para ambos garante consistência |
| 3 | Hub card + navbar (4 itens) | Apenas hub card | Navbar com 4 itens continua limpa. Recursos pode ser acessado a qualquer momento durante o estudo, esconder atrás do hub adiciona fricção desnecessária |
| 4 | Badge textual somente para idiomas não-PT-BR | Badge em todos os recursos / emoji de bandeira | Maioria será PT-BR, marcar a exceção é mais eficiente. Badge textual é mais sóbrio que bandeiras e alinhado com a estética do projeto |
| 5 | Status inline (outdated) + Arquivo (unavailable) | Apenas inline / apenas arquivo | Gradação: recurso com problemas leves fica visível com aviso na categoria; recurso completamente indisponível migra para Arquivo sem poluir a lista principal |
| 6 | Data de última revisão global no topo | Por seção / por recurso | Data global é suficiente e comunica "esta lista foi revisada em [data]" sem ruído visual. JSON mantém timestamps por recurso nos dados para uso futuro se necessário |

---

## 11. Fora do Escopo (Futuro)

Funcionalidades consideradas mas não incluídas nesta versão. Podem ser implementadas futuramente se houver demanda.

- **Busca/filtro por texto:** Campo de busca para filtrar recursos por título ou descrição
- **Filtro por tags:** Interface para filtrar por nível (iniciante/intermediário/avançado) ou tema
- **Favoritos do usuário:** Permitir que o usuário marque recursos como favoritos (localStorage)
- **Sugestão de recursos:** Formulário para usuários sugerirem novos recursos (requer backend ou serviço externo)
- **Ordenação:** Opções de ordenação dentro de cada categoria (por data de adição, alfabética, etc.)
- **Contagem de cliques:** Tracking de quais recursos são mais acessados (requer analytics)

Estas funcionalidades são listadas para registro. Nenhuma está planejada e nenhuma deve influenciar decisões de implementação da versão atual.
