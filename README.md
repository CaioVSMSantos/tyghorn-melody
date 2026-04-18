# Tyghorn Melody

Aplicativo web para aprendizado de teoria musical e prática no teclado com acompanhamento visual.

---

## O que é

Tyghorn Melody é uma aplicação web estática para quem quer aprender a tocar teclado. Ela combina uma base de teoria musical com um player de prática no estilo FlowKey/Guitar Hero — notas caem na tela enquanto você toca no teclado MIDI.

Construído com HTML, CSS e JavaScript puros. Sem frameworks, sem dependências externas, sem servidor backend.

## Funcionalidades

### Player de Prática
- Músicas em formato JSON carregadas a partir de um catálogo curado
- Notas caindo no Canvas sincronizadas com BPM — acompanhamento visual estilo Guitar Hero
- Suporte a teclado MIDI via **Web MIDI API** (Chrome/Edge)
- Seleção de tracks por mão (esquerda/direita) de forma independente
- Controle de velocidade (0.25x a 2.0x)
- 3 níveis de tolerância de timing: Fácil (1000ms), Médio (500ms), Preciso (250ms)
- Tela de resultado com acurácia final
- Progresso salvo por música (melhor acurácia e número de tentativas)

### Ferramentas
- Detector e monitor de dispositivos MIDI em tempo real
- Configuração guiada do range do teclado conectado
- Gerenciamento de dados: limpar progresso ou redefinir configurações

### Teoria Musical
- Módulo educacional organizado em 11 módulos (do básico absoluto a conceitos intermediários e avançados)
- Cada tópico combina texto, diagramas de teclado interativos e callouts conceituais
- Navegação por sidebar com progresso explícito, breadcrumb e pré-requisitos entre tópicos
- Status atual: estrutura e fundamentos implementados; expansão em andamento. Ver `docs/roadmap.md` para detalhe das fases

### Recursos
- Catálogo curado de livros, cursos, vídeos e ferramentas externas para aprofundamento
- Organizados por categoria, com badges de idioma, nível e custo

## Como Usar

### GitHub Pages

Acesse diretamente pelo browser — não requer instalação.

### Localmente

O browser bloqueia `fetch()` via `file://`. É necessário um servidor HTTP local:

```bash
# Python (incluso na instalação padrão)
python -m http.server 8080
```

Em seguida, abra `http://localhost:8080` no Chrome ou Edge.

> **Chrome/Edge obrigatórios.** A Web MIDI API não é suportada pelo Firefox nem pelo Safari.

## Compatibilidade

| Browser | Suporte |
|---------|---------|
| Chrome | ✅ Completo |
| Edge | ✅ Completo |
| Firefox | ⚠️ Sem MIDI (visualização apenas) |
| Safari | ⚠️ Sem MIDI (visualização apenas) |
