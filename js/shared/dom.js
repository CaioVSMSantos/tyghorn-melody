/**
 * dom.js — Helpers minimalistas de criação de DOM
 *
 * Substitui o boilerplate `document.createElement` + `setAttribute` + `appendChild`
 * por funções declarativas. Sem dependências, sem mágica.
 *
 * Princípios:
 *   - Nunca aceitar `innerHTML` ou strings de HTML — elimina vetor de XSS.
 *   - Texto é sempre `textContent`. Strings em `children` viram nós de texto.
 *   - API mínima: tudo o mais o consumidor faz com `addEventListener` ou
 *     manipulação direta sobre o nó retornado.
 *
 * Uso típico:
 *   const card = el("div", { className: "hub-card" }, [
 *     el("div", { className: "hub-card-icon" }, "🎵"),
 *     el("div", { className: "hub-card-title" }, "Prática"),
 *   ]);
 *
 *   const grid = statGrid([
 *     { label: "Notas tocadas", value: 42 },
 *     { label: "Sessão",        value: "00:12:34" },
 *   ]);
 *
 *   const tag = badge("Português", "badge-lang");
 */

/**
 * Cria um elemento HTML com atributos e filhos.
 *
 * @param {string} tag                  — nome da tag (ex: "div", "span", "button")
 * @param {Object} [attrs]              — atributos. Chaves especiais:
 *                                          - `className`: definido via .className
 *                                          - `textContent`: definido via .textContent
 *                                          - `dataset`: objeto que é mesclado em el.dataset
 *                                          - `style`: objeto chave→valor mesclado em el.style
 *                                        Demais chaves viram setAttribute.
 *                                        `innerHTML` é deliberadamente proibido.
 * @param {Array<Node|string>|Node|string} [children] — filhos. Strings viram textNodes.
 * @returns {HTMLElement}
 */
export function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);

    for (const [key, value] of Object.entries(attrs)) {
        if (value === null || value === undefined) continue;

        if (key === "innerHTML") {
            throw new Error("dom.el(): innerHTML não é permitido. Use children ou textContent.");
        }

        if (key === "className") {
            node.className = value;
        } else if (key === "textContent") {
            node.textContent = value;
        } else if (key === "dataset") {
            for (const [dk, dv] of Object.entries(value)) node.dataset[dk] = dv;
        } else if (key === "style" && typeof value === "object") {
            for (const [sk, sv] of Object.entries(value)) node.style[sk] = sv;
        } else {
            node.setAttribute(key, value);
        }
    }

    const childList = Array.isArray(children) ? children : [children];
    for (const child of childList) {
        if (child === null || child === undefined || child === false) continue;
        node.appendChild(typeof child === "string" || typeof child === "number"
            ? document.createTextNode(String(child))
            : child);
    }

    return node;
}

/**
 * Constrói um grid de estatísticas a partir de uma lista de pares { label, value }.
 *
 * Estrutura gerada:
 *   <div class="stats-grid">
 *     <div class="stat-item">
 *       <span class="stat-label">{label}</span>
 *       <span class="stat-value">{value}</span>
 *     </div>
 *     ...
 *   </div>
 *
 * @param {Array<{label: string, value: string|number}>} items
 * @returns {HTMLElement}
 */
export function statGrid(items) {
    return el("div", { className: "stats-grid" }, items.map((item) =>
        el("div", { className: "stat-item" }, [
            el("span", { className: "stat-label", textContent: item.label }),
            el("span", { className: "stat-value", textContent: String(item.value) }),
        ])
    ));
}

/**
 * Constrói um badge (`<span>` com classe e texto).
 *
 * @param {string} text       — conteúdo textual
 * @param {string} className  — classe CSS (ex: "badge-lang", "badge-status-outdated")
 * @returns {HTMLElement}
 */
export function badge(text, className) {
    return el("span", { className, textContent: text });
}
