# Especificação — Player de Prática

Documento de especificação do módulo de prática musical. Contém decisões tomadas e definições técnicas.

---

## Visão Geral

O player é a funcionalidade central do Tyghorn Melody. Ele carrega uma música em formato JSON, exibe as notas visualmente em sincronia com um timeline, lê o teclado MIDI do usuário e compara as teclas pressionadas com as notas esperadas, fornecendo feedback em tempo real.

**Referência conceitual:** FlowKey, Synthesia, Guitar Hero.

---

## Decisões Confirmadas

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Rendering de notas | Canvas 2D | Performance superior para animação contínua de muitos elementos |
| Sistema de pontuação | Binário (acertou/errou) | Simplicidade para MVP. Gradações futuras |
| Janela de tempo | Configurável: Fácil ±1000ms, Médio ±500ms, Preciso ±250ms | Público iniciante precisa de margem generosa. Inclui delay inerente da conexão MIDI |
| Velocity no matching | Ignorado no MVP | Futuro: toggle opcional na UI |
| Feedback sonoro | Apenas visual | Áudio exigiria arquivos de música — fora do escopo |
| Timing das notas | Em batidas (beats) | Controle de velocidade (BPM) funciona automaticamente |
| Progresso do usuário | Sim, simples | `bestAccuracy` e `timesPlayed` por música — baixo custo, alto valor |
| Adaptação para teclados menores | Aviso ao usuário | MVP: informar notas fora do range. Futuro: transposição |

---

## Catálogo de Músicas

### Manifesto (`songs/catalog.json`)

Arquivo índice que lista todas as músicas disponíveis. O player carrega este arquivo para exibir a lista de seleção — o JSON completo da música só é buscado quando o usuário a seleciona.

```json
{
    "songs": [
        {
            "id": "stickerbrush-symphony",
            "file": "games/stickerbrush-symphony.json",
            "title": "Stickerbrush Symphony",
            "artist": "David Wise",
            "source": "Donkey Kong Country 2",
            "category": "games",
            "difficulty": "intermediate",
            "midiRange": { "lowest": 48, "highest": 84 }
        }
    ]
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | Identificador único (mesmo do JSON da música) |
| `file` | string | Caminho relativo ao diretório `songs/` |
| `title` | string | Nome da música |
| `artist` | string | Compositor |
| `source` | string | Origem (jogo, anime, filme, álbum) |
| `category` | string | `games`, `animes`, `movies`, `artists` |
| `difficulty` | string | Dificuldade geral (`beginner`, `intermediate`, `advanced`) |
| `midiRange` | object | Range de notas da música (para verificação com teclado do usuário) |

### Tela de Seleção de Músicas

Integrada em `pages/play.html` como estado inicial:

1. Ao abrir, exibe lista de músicas agrupadas por categoria
2. Cada item mostra: título, artista, origem, dificuldade, e compatibilidade com o teclado do usuário (se configurado)
3. Ao clicar, carrega o JSON completo e transiciona para o player
4. Botão de voltar para retornar à lista

> **Futuro:** Filtros por categoria, dificuldade, compatibilidade de range.

---

## Formato JSON das Músicas

### Metadados

```json
{
    "id": "stickerbrush-symphony",
    "title": "Stickerbrush Symphony",
    "artist": "David Wise",
    "source": "Donkey Kong Country 2",
    "category": "games",
    "bpm": 80,
    "timeSignature": [4, 4],
    "difficulty": "intermediate",
    "keySignature": "C",
    "totalDurationBeats": 64,
    "midiRange": {
        "lowest": 48,
        "highest": 84
    },
    "tracks": []
}
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | string | Sim | Identificador único (slug) |
| `title` | string | Sim | Nome da música |
| `artist` | string | Sim | Compositor original |
| `source` | string | Sim | Jogo, anime, filme ou álbum de origem |
| `category` | string | Sim | Categoria (`games`, `animes`, `movies`, `artists`) |
| `bpm` | number | Sim | Batidas por minuto (> 0) |
| `timeSignature` | [number, number] | Sim | Fórmula de compasso |
| `difficulty` | string | Sim | `beginner`, `intermediate`, `advanced` |
| `keySignature` | string | Sim | Tonalidade principal |
| `totalDurationBeats` | number | Sim | Duração total em batidas (> 0) |
| `midiRange` | object | Sim | `{ lowest: number, highest: number }` (0-127) |
| `tracks` | array | Sim | Pelo menos uma track |

### Tracks

Cada track representa uma camada independente da música. O usuário seleciona quais tracks praticar.

```json
{
    "tracks": [
        {
            "id": "right-simplified",
            "name": "Melodia (simplificada)",
            "hand": "right",
            "difficulty": "beginner",
            "notes": []
        },
        {
            "id": "right-standard",
            "name": "Melodia",
            "hand": "right",
            "difficulty": "intermediate",
            "notes": []
        },
        {
            "id": "left-simplified",
            "name": "Acompanhamento (simplificado)",
            "hand": "left",
            "difficulty": "beginner",
            "notes": []
        },
        {
            "id": "left-standard",
            "name": "Acompanhamento",
            "hand": "left",
            "difficulty": "intermediate",
            "notes": []
        }
    ]
}
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | string | Sim | Identificador da track (único dentro da música) |
| `name` | string | Sim | Nome legível para exibição |
| `hand` | string | Sim | `right`, `left`, ou `both` |
| `difficulty` | string | Sim | `beginner`, `intermediate`, `advanced` |
| `notes` | array | Sim | Lista de notas (pelo menos uma) |

**Combinações típicas de prática:**

| Nível do usuário | Tracks ativas | Descrição |
|------------------|---------------|-----------|
| Iniciante | `right-simplified` | Apenas melodia simplificada, mão direita |
| Progredindo | `right-standard` | Melodia completa, mão direita |
| Intermediário | `right-standard` + `left-simplified` | Melodia completa + acompanhamento básico |
| Avançado | `right-standard` + `left-standard` | Ambas as mãos, versão completa |

> **Flexibilidade:** Nem toda música precisa de 4 tracks. Algumas podem ter apenas uma melodia simplificada. O player exibe o que existir no JSON.

### Notas

```json
{
    "note": 60,
    "start": 0,
    "duration": 1,
    "velocity": 80
}
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `note` | number | Sim | Número MIDI (0-127). Ex: 60 = C4 |
| `start` | number | Sim | Início em batidas (≥ 0) |
| `duration` | number | Sim | Duração em batidas (> 0) |
| `velocity` | number | Não | Intensidade sugerida (0-127). Default: 80 |

> **Timing em batidas:** Alterar o BPM muda a velocidade sem recalcular posições. `start: 4` com BPM 60 = 4s; com BPM 120 = 2s.

> **Acordes:** Múltiplas notas com o mesmo `start`. Sem estrutura especial.

### Validação do JSON

O `song-loader.js` deve validar antes de executar:

**Metadados:**
- Todos os campos obrigatórios presentes
- `bpm` > 0
- `totalDurationBeats` > 0
- `midiRange.lowest` ≥ 0 e ≤ 127, `midiRange.highest` ≥ `lowest`
- `tracks` é array não-vazio
- `difficulty` é um dos valores válidos
- `category` é um dos valores válidos

**Tracks:**
- Cada track tem `id`, `name`, `hand`, `difficulty`, `notes`
- IDs de tracks são únicos dentro da música
- `hand` é `right`, `left`, ou `both`
- `notes` é array não-vazio

**Notas:**
- `note` é inteiro entre 0 e 127
- `start` ≥ 0
- `duration` > 0
- `velocity` (se presente) entre 0 e 127

**Em caso de falha:** Exibir mensagem de erro clara indicando qual campo/regra falhou. Não carregar a música.

---

## Persistência (localStorage)

### Estrutura

```json
{
    "keyboard": {
        "lowestNote": 36,
        "highestNote": 96,
        "totalKeys": 61,
        "deviceName": "USB AudioDevice",
        "configuredAt": "2026-04-13T20:00:00Z"
    },
    "preferences": {
        "defaultSpeed": 1.0,
        "showNoteNames": true
    },
    "progress": {
        "stickerbrush-symphony": {
            "bestAccuracy": 85,
            "timesPlayed": 3,
            "lastPlayed": "2026-04-13",
            "tracksPlayed": ["right-standard"]
        }
    }
}
```

**Chave no localStorage:** `tyghorn-melody`

**Validação ao ler:** Sempre validar a estrutura. Se corrompida, tratar como dados inexistentes (reset silencioso com aviso ao usuário).

### Configuração do Teclado

Fluxo de detecção de range:

1. Na primeira visita (ou em Ferramentas > Configurar Teclado), exibir instrução
2. Pedir ao usuário para pressionar a tecla mais grave
3. Registrar a nota
4. Pedir ao usuário para pressionar a tecla mais aguda
5. Registrar a nota
6. Calcular `totalKeys = highestNote - lowestNote + 1` e persistir
7. Ao carregar uma música, comparar `midiRange` com o range do teclado e avisar se incompatível

---

## Interface do Player

### Fluxo do Usuário

```
play.html
  ├── Estado: Seleção de Música
  │     Lista de músicas por categoria
  │     Compatibilidade com teclado indicada
  │     Clique → carrega música
  │
  └── Estado: Player
        Seleção de tracks
        Canvas com falling notes
        Controles (play/pause/stop/velocidade)
        Acurácia em tempo real
        Botão de voltar à lista
```

### Layout do Player

```
┌───────────────────────────────────────────────────────┐
│ Nav bar                                               │
├───────────────────────────────────────────────────────┤
│ [← Voltar] Título — Artista · BPM    🟢 MIDI [🔄]   │
├───────────────────────────────────────────────────────┤
│ 🔴🫲 Mão Esquerda        │ 🟢🫱 Mão Direita  │ ⏱ Tol. │
│ ○ Nenhuma                 │ ○ Nenhuma                  │
│ ○ Acompanhamento (simpl.) │ ● Melodia (simplificada)   │
│                           │ ○ Melodia                  │
├───────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────────────────────────────────────────────┐  │
│  │      Colunas: brancas / pretas / C destacado    │  │
│  │                                                 │  │
│  │            Notas descendo (Canvas)              │  │
│  │            ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓                 │  │
│  │                                                 │  │
│  │▔▔▔▔▔▔▔▔▔▔▔▔▔ HIT LINE ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔│  │
│  │  C3  D3  E3 ... labels de referência            │  │
│  └─────────────────────────────────────────────────┘  │
│                                                       │
├───────────────────────────────────────────────────────┤
│ ████████████████░░░░░░░░░░░░░░░░░░  1:24 / 3:10     │
├───────────────────────────────────────────────────────┤
│ [⏵] [⏸] [⏹] [⟳]    [- 1.00x +]    Acertos: 42/50  │
└───────────────────────────────────────────────────────┘
```

**Elementos do layout (de cima para baixo):**
1. Header: botão voltar, info da música, MIDI status + botão reconectar
2. Track selection: radio groups por mão (mutuamente exclusivos), separador vertical
3. Canvas: colunas por nota MIDI, falling notes, hit line, labels de referência
4. Progress bar: seek clicável + display de tempo
5. Controles: play/pause/stop/restart, velocidade, acurácia em tempo real

### Cores das Notas no Canvas

| Estado | Cor | Token CSS |
|--------|-----|-----------|
| Pendente (descendo) | Ciano | `--neon-cyan` |
| Acerto | Verde | `--neon-green` |
| Erro (nota errada ou atrasada) | Rosa | `--neon-pink` |
| Passada sem tocar | Amarelo escurecido | `--neon-yellow` com opacidade reduzida |
| Hit line | Amarelo | `--neon-yellow` |

### Controle de Velocidade

Multiplicador sobre o BPM original da música:

| Velocidade | BPM efetivo (se original = 80) | Uso |
|------------|-------------------------------|-----|
| 0.25x | 20 | Estudo nota a nota |
| 0.5x | 40 | Prática lenta |
| 0.75x | 60 | Aquecimento |
| 1x | 80 | Velocidade original |
| 1.25x | 100 | Desafio |
| 1.5x | 120 | Velocidade avançada |

Incrementos de 0.25x via botões + e -.

### Lead-in Countdown

Ao iniciar uma música, o player insere 4 beats de contagem regressiva antes da primeira nota. O tempo interno começa negativo (`-leadInMs`) e o renderer exibe a contagem (4, 3, 2, 1) no centro do canvas.

### Seek Bar

Barra de progresso clicável abaixo do canvas. Ao clicar, calcula o beat correspondente à posição do clique e chama `player.seek(targetBeat)`. Notas anteriores ao ponto de seek são marcadas como "missed"; notas posteriores voltam a "pending".

### Rendering Visual

- **Range fixo:** O canvas exibe sempre 61 teclas (C2–C7, MIDI 36–96), independente do range da música. Layout consistente entre músicas — mesma tecla, mesma posição. Futuro: auto-ajuste ao teclado MIDI detectado.
- **Colunas:** Cada nota MIDI no range fixo recebe uma coluna vertical. Teclas brancas têm fundo claro, pretas têm fundo escuro, notas C são destacadas em ciano.
- **Notas pretas:** Colunas de fundo renderizadas a ~60% da largura (20% de margem por lado), fundo `rgba(0,0,0,0.40)`. Notas caindo a ~40% da largura (30% de margem por lado). Visualmente metade das teclas brancas.
- **Hit line:** Linha horizontal amarela a 85% da altura do canvas.
- **Zona de tolerância:** Gradiente amarelo semi-transparente abaixo da hit line. Altura proporcional à tolerância ativa em beats (escala com BPM e velocidade). Feedback visual da janela de timing.
- **Labels de referência:** Nomes das notas brancas exibidos abaixo da hit line. Notas C em destaque.
- **Tela de fim:** Overlay semi-transparente com mensagem "Música finalizada!" e acurácia final com cor condicional (verde ≥80%, amarelo ≥50%, rosa <50%).

---

## Músicas

| Música | Compositor | Origem | Categoria | BPM | Beats | Tracks | Fonte |
|--------|-----------|--------|-----------|-----|-------|--------|-------|
| Stickerbrush Symphony | David Wise | Donkey Kong Country 2 | games | 90 | 420 | 4 (2R + 2L) | MIDI |
| Peaceful Days | Yasunori Mitsuda | Chrono Trigger | games | 88 | 220 | 4 (2R + 2L) | MIDI |
| Frog's Theme | Yasunori Mitsuda | Chrono Trigger | games | 192 | 288 | 4 (2R + 2L) | MIDI |

> Transcrições geradas a partir de arquivos MIDI reais via `tools/midi-to-json.py`. Cada música possui versão simplificada e standard por mão, geradas automaticamente pelo conversor.
