/**
 * resources.js — Orquestrador da página de Recursos.
 *
 * Fetch de data/resources.json, validação não-bloqueante (apenas warn no
 * console) e renderização da página. Erros de rede/parsing abortam com
 * painel de erro no lugar do container.
 */

import { validateResources } from "./validator.js";
import { renderResources, setupAccordion } from "./view.js";

const DATA_URL = "../data/resources.json";

async function init() {
    const containerEl = document.getElementById("resources-container");
    const lastReviewEl = document.getElementById("last-review-date");

    setupAccordion(containerEl);

    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) {
            throw new Error("Falha ao carregar catálogo de recursos (HTTP " + response.status + ").");
        }

        const data = await response.json();
        const errors = validateResources(data);

        if (errors.length > 0) {
            console.warn("Validação do resources.json — erros encontrados:");
            for (const error of errors) {
                console.warn("  • " + error);
            }
        }

        renderResources(containerEl, lastReviewEl, data);
    } catch (error) {
        renderErrorPanel(containerEl, error);
        console.error("resources.js — Erro na inicialização:", error);
    }
}

function renderErrorPanel(containerEl, error) {
    containerEl.textContent = "";

    const errorPanel = document.createElement("div");
    errorPanel.className = "panel";

    const title = document.createElement("div");
    title.className = "panel-header";
    title.textContent = "Erro ao carregar recursos";
    errorPanel.appendChild(title);

    const msg = document.createElement("p");
    msg.className = "text-muted";
    msg.textContent = error.message;
    errorPanel.appendChild(msg);

    containerEl.appendChild(errorPanel);
}

init();
