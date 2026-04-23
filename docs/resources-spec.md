# Especificação — Módulo de Recursos

> **Escopo deste documento:** registra os princípios de curadoria e a taxonomia editorial do catálogo. O schema técnico, a validação e o fluxo de render são código — vivem em [`js/resources/`](../js/resources/) e [`content/data/resources.json`](../content/data/resources.json). Este documento ilumina o *porquê* das escolhas editoriais, não o *como* da implementação.

---

## 1. Visão Geral

Página de curadoria do Tyghorn Melody dedicada a reunir recomendações de recursos externos para quem deseja se aprofundar no mundo da música, do teclado e do piano. Público-alvo: desde iniciantes absolutos até quem busca profissionalização.

A página **não é** um agregador automatizado, um catálogo exaustivo ou uma loja. É uma **biblioteca pessoal curada** — cada recurso foi selecionado por sua qualidade, relevância e acessibilidade. A curadoria prioriza recursos em português do Brasil, mas inclui outros idiomas quando a qualidade justifica.

### Objetivos

- Oferecer uma lista organizada e confiável de recursos para aprofundamento musical
- Cobrir diversas mídias e formatos (livros, vídeos, cursos, ferramentas, comunidades, entretenimento)
- Facilitar a descoberta — o usuário deve encontrar o que procura rapidamente
- Manter-se atualizada — mecanismo claro de revisão e marcação de obsolescência
- Complementar o módulo de Teoria Musical e o Player de Prática, não substituí-los

### Escopo

A curadoria abrange música e teoria musical com foco no **teclado e no piano**, mas não se restringe a eles. Recursos de teoria musical geral, apreciação, cultura e história são bem-vindos quando relevantes para o público-alvo.

**Fora do escopo:** recursos sobre produção musical/DAWs, engenharia de som, DJing, marketing musical, ou instrumentos não relacionados ao teclado (exceto quando o recurso é de teoria geral aplicável).

---

## 2. Princípios de Curadoria

### 2.1 Critérios de Inclusão

Um recurso deve atender a **pelo menos três** dos seguintes critérios:

| Critério | Descrição |
|----------|-----------|
| **Qualidade reconhecida** | Boa reputação entre músicos, educadores ou comunidades musicais |
| **Relevância temática** | Diretamente relacionado a teoria musical, teclado, piano ou aprendizado musical |
| **Acessibilidade** | Disponível para aquisição ou acesso pelo público brasileiro (compra, streaming, acesso online) |
| **Valor pedagógico** | Ensina, inspira ou contribui de forma tangível para o aprendizado musical |
| **Longevidade** | Não é conteúdo efêmero — tem valor duradouro ou é referência estabelecida |

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

Recursos em idioma diferente de pt-BR recebem badge de idioma visível. Recursos em português não recebem marcação — pt-BR é o padrão assumido.

### 2.4 Política de Links

Links diretos devem ser usados com cautela. A prioridade é que o usuário possa **encontrar** o recurso mesmo que um link específico quebre.

- Sempre incluir o **título completo** e informações suficientes para busca (autor, editora, plataforma)
- Links diretos são bem-vindos para recursos com URLs estáveis (sites oficiais, plataformas consolidadas)
- Para recursos em plataformas de venda (Amazon, Steam, etc.), preferir informações de busca — URLs de e-commerce são notoriamente instáveis
- Para canais do YouTube, podcasts e cursos online, links diretos são aceitáveis (URLs de canais/perfis são mais estáveis que URLs de produtos)

**Indicações de onde encontrar** (Amazon, Spotify, YouTube, Steam, etc.) são metadado do recurso, não link obrigatório.

---

## 3. Agrupamento de Categorias

Categorias são organizadas em **grupos lógicos** que servem como critério de ordenação e agrupamento visual sutil (separador entre grupos). Os grupos **não** aparecem como seções rotuladas na página — a organização deve ser sentida, não declarada.

| Grupo | ID | Descrição | Categorias |
|-------|----|-----------|------------|
| Estudo e Aprendizado | `study` | Materiais educacionais em diversos formatos | 6 |
| Ferramentas e Prática | `tools` | Ferramentas digitais para prática e criação | 4 |
| Equipamento | `gear` | Aquisição e cuidado com instrumentos | 2 |
| Cultura e Inspiração | `culture` | Conteúdo para inspirar, motivar e ampliar repertório | 4 |
| Comunidade e Carreira | `community` | Conexão com outros músicos e caminhos profissionais | 2 |
| Público Específico | `audience` | Recursos para perfis específicos | 1 |

**Ordem de exibição:** `study` → `tools` → `gear` → `culture` → `community` → `audience`. Começa pelo que o usuário mais provavelmente busca (material de estudo), passa por ferramentas e equipamento, depois cultura (engajamento), e finaliza com comunidade/carreira/públicos especiais.

---

## 4. Catálogo de Categorias

Cada categoria preserva sua diretriz curatorial distintiva e o perfil de recurso esperado. Campos estruturais (`id`, `group`, `order`, `icon`) vivem no JSON de dados.

### 4.1 Livros (grupo `study`)

Obras de referência sobre teoria musical, técnica pianística e história da música. De manuais introdutórios a tomos acadêmicos.

- Priorizar livros que sejam referências reconhecidas no ensino de música ou piano
- Incluir tanto introdutórios quanto obras de consulta contínua
- Métodos clássicos (Hanon, Czerny, Beyer) são bem-vindos com contextualização de para quem servem
- Indicar claramente o nível (iniciante, intermediário, avançado)
- Livros esgotados encontráveis em sebos são aceitos com nota de disponibilidade

**Perfil esperado:** livros-texto de teoria, métodos de piano, enciclopédias musicais, livros de harmonia, biografias de compositores com valor educacional.

### 4.2 Revistas e Periódicos (grupo `study`)

Publicações regulares sobre música, teclado e piano — leitura mais leve e atualizada que livros, com dicas práticas e novidades.

- Incluir publicações ativas e com histórico de qualidade
- Descontinuadas só se o acervo ainda estiver disponível online
- Newsletters e blogs de alta qualidade são válidos se tiverem consistência editorial
- Indicar se é gratuita ou paga

**Perfil esperado:** revistas digitais ou físicas, newsletters especializadas, blogs com valor editorial consistente.

### 4.3 Cursos Online e Presenciais (grupo `study`)

Cursos estruturados — de plataformas online gratuitas a escolas e conservatórios reconhecidos.

- Reputação e avaliações verificáveis
- Opções em diferentes faixas de preço (gratuitos, acessíveis, premium)
- Para cursos online, indicar a plataforma (Coursera, Udemy, YouTube, site próprio)
- Para presenciais, focar em instituições de alcance nacional ou referências regionais amplamente reconhecidas
- Conservatórios devem ser referências consolidadas
- Indicar claramente o modelo (gratuito, pago, freemium)

**Perfil esperado:** cursos em plataformas de ensino, programas de conservatórios, MOOCs, masterclasses online.

### 4.4 Vídeos e Playlists (grupo `study`)

Canais do YouTube, playlists e videoaulas — conteúdo visual e dinâmico para complementar o estudo.

- Canais com conteúdo consistente e bem produzido (não vídeos avulsos)
- Canais de teoria musical geral são válidos, não apenas teclado
- Indicar o foco principal (teoria, prática, análise, entretenimento educativo)
- Playlists específicas podem ser recomendadas quando o canal é amplo demais
- Verificar que o canal está ativo ou, se inativo, que o acervo permanece disponível

**Perfil esperado:** canais educacionais de teoria/piano, playlists temáticas, videoaulas de professores reconhecidos.

### 4.5 Podcasts e Programas de Áudio (grupo `study`)

Podcasts e programas sobre música, teoria, história e cultura pianística — para ouvir no deslocamento, durante exercícios ou em pausas.

- Catálogo substancial (10+ episódios)
- Inativos mas com catálogo disponível são válidos (com nota)
- Indicar a plataforma principal (Spotify, Apple Podcasts, YouTube, site próprio)
- Incluir tanto foco em ensino quanto em cultura/história musical

**Perfil esperado:** podcasts de teoria, entrevistas com músicos, história da música, análise de composições.

### 4.6 Documentários (grupo `study`)

Documentários sobre música, compositores, instrumentos e cultura musical — aprendizado por narrativas visuais.

- Disponíveis em plataformas de streaming acessíveis no Brasil
- Obras sobre compositores clássicos, história do piano, gêneros musicais
- Indicar onde assistir (Netflix, Prime Video, YouTube, etc.)
- Fora de catálogo podem ser incluídos se encontráveis por outros meios

**Perfil esperado:** documentários sobre compositores, história do piano, cultura musical, bastidores de orquestras/performances.

### 4.7 MIDIs e Partituras — Jogos, Anime e Filmes (grupo `tools`)

Fontes de arquivos MIDI e partituras de músicas de videogames, animes, filmes e séries — para prática no próprio Tyghorn Melody, Synthesia ou para estudo visual.

- Foco em fontes gratuitas e comunitárias — o público-alvo são praticantes, não profissionais
- Priorizar sites com boa cobertura de jogos, animes e filmes/séries
- Distinguir entre MIDI (prática/conversão) e partituras (estudo visual)
- Sites que oferecem ambos os formatos são diferencial
- Verificar legitimidade e segurança (domínios conhecidos, comunidades estabelecidas)
- Pirataria de soundtracks comerciais (MP3/FLAC de álbuns oficiais) está fora do escopo — o foco é MIDI e partituras de arranjos

**Perfil esperado:** VGMusic, Ichigo's, NinSheetMusic, BitMidi, TuneOnMusic e similares.

### 4.8 Partituras e Songbooks (grupo `tools`)

Fontes de partituras gratuitas e pagas para piano e teclado — material para tocar além do catálogo do Tyghorn Melody.

- Repositórios confiáveis e com acervo amplo
- Distinguir claramente gratuitas (domínio público) vs pagas
- Partituras clássicas e arranjos populares simplificados
- Partituras interativas (MusicXML, MIDI) são diferencial
- Partituras ilegais e sites de pirataria estão explicitamente excluídos

**Perfil esperado:** IMSLP, MuseScore, lojas de partituras digitais, coletâneas impressas recomendadas.

### 4.9 Software de Notação Musical (grupo `tools`)

Programas para escrever, editar e visualizar partituras — para quem deseja praticar escrita musical ou criar arranjos.

- Opções gratuitas e pagas, com ênfase nas gratuitas/open-source
- Indicar plataforma (desktop, web, mobile)
- Ferramentas acessíveis a iniciantes, não apenas profissionais
- Ferramentas web (sem instalação) são especialmente valiosas

**Perfil esperado:** MuseScore, Flat.io, Noteflight, ferramentas simplificadas.

### 4.10 Aplicativos e Ferramentas Online (grupo `tools`)

Apps e ferramentas digitais para treinamento auditivo, identificação de acordes, prática rítmica e outros exercícios.

- Ferramentas com versão gratuita funcional
- Apps mobile e ferramentas web
- Foco em prática ativa (ear training, rhythm training, chord recognition)
- Afinadores, metrônomos e utilitários são válidos
- **Evitar sobreposição com o próprio Tyghorn Melody** — incluir ferramentas que fazem o que nós não fazemos

**Perfil esperado:** apps de ear training, treinadores de ritmo, identificadores de acorde, afinadores, teclados virtuais com funcionalidades extras.

### 4.11 Lojas e Sites de Instrumentos (grupo `gear`)

Lojas físicas e online de teclados, pianos digitais, acessórios e suporte técnico — referências para quem escolhe o primeiro instrumento ou faz upgrade.

- Apenas lojas com reputação consolidada e atendimento ao público brasileiro
- Lojas especializadas em instrumentos musicais (não marketplaces genéricos)
- Físicas com alcance nacional ou referências regionais amplamente conhecidas
- Para online, verificar reputação (Reclame Aqui, etc.)
- Incluir novas e usadas/recondicionadas, quando confiáveis

**Perfil esperado:** lojas especializadas, marketplaces de instrumentos usados, importadoras confiáveis.

### 4.12 Guias de Manutenção (grupo `gear`)

Guias e instruções sobre cuidado, manutenção e conservação — do básico (limpeza, armazenamento) ao avançado (afinação, regulagem).

- Distinguir manutenção de teclados digitais vs pianos acústicos (públicos muito diferentes)
- Priorizar guias que o usuário pode seguir em casa
- Para manutenção profissional (afinação), indicar como encontrar qualificados
- Vídeos instrutivos são especialmente valiosos aqui
- Incluir orientações sobre transporte e armazenamento

**Perfil esperado:** guias de limpeza, tutoriais de manutenção preventiva, referências de afinadores, orientações de transporte.

### 4.13 Músicos Recomendados (grupo `culture`)

Pianistas, tecladistas e compositores cujo trabalho vale conhecer — inspiração, estudo e pura apreciação.

- Diferentes períodos, gêneros e estilos
- Trabalho acessível para escuta (plataformas de streaming)
- Breve contextualização de por que cada músico é relevante
- Não se limitar a pianistas clássicos — incluir jazz, popular, contemporâneo, experimental
- Organização por estilo/período pode ajudar (clássico, jazz, contemporâneo)

**Perfil esperado:** clássicos (Horowitz, Argerich), jazzistas (Bill Evans, Herbie Hancock), compositores (Chopin, Debussy), contemporâneos (Nils Frahm, Hiromi).

### 4.14 Filmes, Séries e Entretenimento (grupo `culture`)

Obras com temática musical — diversão, inspiração e uma perspectiva diferente sobre o mundo da música. Nem tudo precisa ser aula.

- A música é tema central, não pano de fundo
- Sinopse breve sem spoilers e por que a obra é relevante
- Filmes sobre compositores, pianistas, escolas de música, competições
- Indicar onde assistir (streaming, aluguel digital)
- Animações e animes musicais são bem-vindos (Your Lie in April, Piano no Mori)

**Perfil esperado:** Whiplash, The Pianist, Amadeus, Mozart in the Jungle, animes musicais, biopics de compositores.

### 4.15 Jogos Musicais (grupo `culture`)

Jogos de videogame e tabuleiro com temática musical ou que envolvam teclado e piano — aprender e praticar brincando.

- Diferentes plataformas (PC, consoles, mobile, tabuleiro)
- Valor educacional musical (mesmo que secundário)
- Jogos de ritmo são válidos quando envolvem conceitos musicais reais
- Indicar plataforma e onde encontrar (Steam, lojas de console, etc.)

**Perfil esperado:** Synthesia, Piano Tiles, jogos educativos musicais, jogos de tabuleiro sobre música.

### 4.16 Concertos, Festivais e Eventos (grupo `culture`)

Eventos recorrentes, temporadas de orquestras e plataformas de concertos — assistir a performances é uma das formas mais poderosas de motivação.

- Focar em recorrentes/anuais (não eventos únicos que já passaram)
- Opções presenciais no Brasil e transmissões online internacionais
- Plataformas de concertos gravados (Digital Concert Hall, Medici.tv) são válidas
- Concursos de piano (Chopin, Van Cliburn) como referência de excelência
- Indicar periodicidade e como acompanhar

**Perfil esperado:** festivais de música clássica, temporadas de orquestras, plataformas de streaming de concertos, concursos internacionais.

### 4.17 Comunidades e Fóruns (grupo `community`)

Comunidades online para trocar experiências, tirar dúvidas e encontrar outros estudantes — aprender música acompanhado é mais fácil.

- Comunidades ativas (posts/mensagens recentes)
- Português e inglês (com marcação)
- Reddit, Discord, Facebook, fóruns especializados
- Indicar foco e nível (iniciante-friendly, avançado, geral)
- Priorizar moderação ativa e ambiente acolhedor

**Perfil esperado:** r/piano, r/musictheory, servidores Discord, grupos Facebook, fóruns especializados.

### 4.18 Profissionalização (grupo `community`)

Guias e orientações para quem deseja seguir carreira na área musical — professor, performer, arranjador ou compositor.

- Orientar sobre caminhos de carreira, não apenas "como ficar famoso"
- Formação acadêmica (bacharelado, licenciatura em música)
- Certificações, registros profissionais (OMB, etc.)
- Guias práticos: dar aulas, se apresentar profissionalmente, precificar
- Mercado de trabalho musical no Brasil

**Perfil esperado:** guias de carreira, informações sobre cursos superiores, orientações para professores particulares, recursos sobre mercado.

### 4.19 Recursos para Crianças e Pais (grupo `audience`)

Recursos para crianças e para pais que desejam introduzir os filhos ao mundo da música e do piano.

- Tanto para as crianças quanto para orientar pais
- Métodos de piano infantil (abordagem lúdica)
- Indicar faixa etária quando possível
- Apps e jogos educativos para crianças
- Orientações sobre idade adequada para começar, como escolher professor
- Livros infantis sobre música e instrumentos

**Perfil esperado:** métodos de piano infantil, apps musicais para crianças, livros infantis sobre música, guias para pais.

---

## 5. Ciclo de Vida e Revisão

O catálogo exige manutenção periódica — links quebram, plataformas fecham, recursos saem de catálogo. As decisões editoriais sobre isso:

**Revisão semestral.** A cada 6 meses, ou quando houver indício forte de mudança (plataforma fechou, recurso removido). `metadata.lastReviewDate` no JSON é a fonte dessa data.

**Três estados possíveis:**

- `active` — disponível e funcional. Estado normal
- `outdated` — problemas parciais mas ainda encontrável/útil (site mudou de URL, livro esgotado mas em sebos). **Permanece** nas categorias com badge de aviso
- `unavailable` — completamente inacessível. **Migra para o Arquivo** ao final da página, fora das categorias normais. Preserva-se como referência histórica

A gradação (outdated visível, unavailable arquivado) é decisão editorial: recurso com problema leve fica à vista com aviso; recurso morto não polui a lista principal mas também não é apagado — quem buscava por ele pode ainda reconhecer o motivo da ausência.

---

## 6. Acessibilidade

- Seções colapsáveis operáveis via teclado (Enter/Space para toggle), com `aria-expanded` e `aria-controls`
- Links externos com `rel="noopener noreferrer"` e indicação visual de que abrem em nova aba
- **WCAG AA mínimo** para contraste (4.5:1 texto normal, 3:1 texto grande) — especialmente crítico nos badges de idioma e status, que usam cores de neon sobre fundo escuro

---

## 7. Decisões de Arquitetura (Registro)

| # | Decisão | Alternativa rejeitada | Justificativa |
|---|---------|----------------------|---------------|
| 1 | JSON + render dinâmico | HTML estático | 19 categorias com metadados por recurso (status, idioma, data) tornam o JSON mais manutenível. Pattern já existente (catalog.json do player). Facilita contagem automática e filtragem futura |
| 2 | Accordion JS | `<details>/<summary>` HTML nativo | O JS já renderiza os dados do JSON; adicionar accordion é trivial. Permite animação consistente e estilo alinhado com o restante do projeto |
| 3 | Hub card + navbar | Apenas hub card | Navbar com Recursos no topo continua limpa. Acesso durante o estudo sem ter que voltar ao hub — remove fricção |
| 4 | Badge textual só para idiomas não-PT-BR | Badge em todos os recursos / emoji de bandeira | Maioria será PT-BR; marcar a exceção é mais eficiente. Badge textual é mais sóbrio que bandeiras, alinhado com a estética |
| 5 | Status inline (outdated) + Arquivo (unavailable) | Apenas inline / apenas arquivo | Gradação: problema leve fica visível com aviso; morto migra para Arquivo sem poluir a lista principal |
| 6 | Data de última revisão global no topo | Por seção / por recurso | Data global comunica "esta lista foi revisada em [data]" sem ruído visual. JSON mantém timestamps por recurso para uso futuro |

---

## 8. Fora do Escopo (Futuro)

Funcionalidades consideradas mas não incluídas. Podem ser implementadas se houver demanda real — nenhuma deve influenciar decisões da versão atual.

- **Busca/filtro por texto** — campo de busca para filtrar por título ou descrição
- **Filtro por tags** — interface para filtrar por nível (iniciante/intermediário/avançado) ou tema
- **Favoritos** — marcar recursos como favoritos (localStorage)
- **Sugestão de recursos** — formulário para usuários sugerirem novos (requer backend ou serviço externo)
- **Ordenação** — opções dentro de cada categoria (por data, alfabética)
- **Contagem de cliques** — tracking de quais recursos são mais acessados (requer analytics)
