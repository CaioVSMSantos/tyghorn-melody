# Design — Tyghorn Melody

> **Escopo deste documento:** explica o *porquê* das escolhas visuais. Os valores canônicos (hex, glows, métricas) vivem em [`css/base/tokens.css`](../css/base/tokens.css) — essa é a fonte de verdade técnica. Se a tabela abaixo divergir do CSS, o CSS vence.

---

## Filosofia de Design

Este é um projeto deliberadamente simples. O profissionalismo está na clareza e coesão visual, não na complexidade.

**Princípios:**

- **Sem imagens customizadas** — Evitar assets gráficos que demandem criação ou manutenção. Se algo precisar de ilustração, buscar alternativas textuais ou baseadas em CSS puro.
- **Emojis como recurso visual primário** — Ícones, indicadores e decoração devem usar emojis sempre que possível. São universais, leves e expressivos.
- **Sem design system complexo** — Sem biblioteca de componentes, sem build de tokens, sem sistema de grid elaborado. Apenas custom properties em `tokens.css` e classes CSS diretas, organizadas nas três camadas (`base/`, `components/`, `pages/`).
- **Bonito e simples** — A estética deve ser agradável sem ser espetacular. Nada de efeitos excessivos, animações pesadas ou ornamentação gratuita.
- **Se der trabalho demais, repensar** — Qualquer decisão visual que exija esforço desproporcional deve ser substituída por uma alternativa mais simples.

---

## Paleta de Cores

Estética: **Synthwave Cyberpunk** — neons com moderação, retrowave sem agressão visual.

### Fundos (roxos profundos)

| Token | Hex | Uso |
|-------|-----|-----|
| `--bg-deep` | `#0f0a1a` | Fundo principal da aplicação. Quase preto com tom roxo |
| `--bg-dark` | `#1a1230` | Fundo secundário. Painéis, seções alternadas, contraste sutil |
| `--bg-surface` | `#251b45` | Superfícies elevadas — cards, modais, áreas de destaque |

### Neons dominantes

| Token | Hex | Uso |
|-------|-----|-----|
| `--neon-cyan` | `#00e5ff` | Destaque principal. Links, elementos interativos, bordas ativas |
| `--neon-yellow` | `#ffe234` | Destaque secundário. Notas ativas, avisos, chamadas de atenção |

### Neons de apoio (uso pontual)

| Token | Hex | Uso |
|-------|-----|-----|
| `--neon-green` | `#39ff14` | Sucesso, acertos, feedback positivo |
| `--neon-pink` | `#ff2a6d` | Erros, alertas, acentos decorativos |
| `--neon-purple` | `#c77dff` | Bordas sutis, separadores, elementos terciários |

### Neutros

| Token | Hex | Uso |
|-------|-----|-----|
| `--text-primary` | `#e8e4f0` | Texto principal. Branco levemente roxeado |
| `--text-secondary` | `#9e99ab` | Texto secundário, legendas, placeholders |

### Glows

`--glow-cyan`, `--glow-yellow` e `--glow-pink` compartilham uma receita única: `box-shadow: 0 0 8px` com opacidade 40% da cor base. A uniformidade é proposital — raios maiores ou alfas mais altos quebram a moderação declarada acima e empurram a estética para "agressão visual". Novos glows devem seguir a mesma fórmula, variando apenas a cor base.

---

## Diretrizes de Uso

- **Neons nunca em texto corrido** — apenas em títulos, ícones, bordas e elementos interativos
- **Fundo sempre escuro** — os neons dependem do contraste com fundos profundos para funcionar
- **Um neon dominante por contexto** — evitar múltiplos neons competindo na mesma área visual
- **Glow com parcimônia** — efeitos de `box-shadow` / `text-shadow` neon apenas em elementos focais, nunca em massa

> **Acessibilidade:** contraste WCAG deve ser verificado especialmente para texto sobre fundos escuros — nunca assumir que um neon sobre `--bg-deep` é legível como corpo de texto.
