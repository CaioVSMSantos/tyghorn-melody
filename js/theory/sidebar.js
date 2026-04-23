/**
 * sidebar.js — Índice lateral de módulos/tópicos da Teoria.
 *
 * Gera a árvore de módulos colapsáveis, amarra expand/collapse e expõe
 * a marcação do tópico ativo. Recebe o contêiner e o manifesto; não
 * conhece o roteamento (links via href="#id" e hashchange no orquestrador).
 */

import { findTopic } from "./manifest.js";

/**
 * Renderiza a sidebar e amarra os toggles de módulo.
 */
export function buildSidebar(navEl, manifest) {
    let html = "";
    for (const mod of manifest.modules) {
        const topics = manifest.topics.filter(t => t.module === mod.id);
        html += `
            <div class="sidebar-module" data-module="${mod.id}">
                <button class="sidebar-module-header"
                        aria-expanded="false"
                        aria-controls="sidebar-topics-${mod.id}">
                    <span class="sidebar-module-number">${mod.id}.</span>
                    <span>${mod.title}</span>
                    <span class="sidebar-module-arrow">▶</span>
                </button>
                <ul class="sidebar-topics" id="sidebar-topics-${mod.id}" hidden>
                    ${topics.map(t => `
                        <li>
                            <a href="#${t.id}" class="sidebar-topic-link" data-topic="${t.id}">
                                ${t.id} ${t.title}
                            </a>
                        </li>
                    `).join("")}
                </ul>
            </div>
        `;
    }
    navEl.innerHTML = html;

    navEl.addEventListener("click", (e) => {
        const header = e.target.closest(".sidebar-module-header");
        if (!header) return;
        toggleSidebarModule(header);
    });
}

/**
 * Marca o tópico ativo e expande o módulo correspondente.
 * Passar topicId=null para limpar (vista de índice).
 */
export function updateSidebarActive(navEl, manifest, topicId) {
    navEl.querySelectorAll(".sidebar-topic-link").forEach(link => {
        link.classList.toggle("active", link.dataset.topic === topicId);
    });

    navEl.querySelectorAll(".sidebar-module-header").forEach(header => {
        header.classList.remove("active");
    });

    if (!topicId) return;

    const topic = findTopic(manifest, topicId);
    if (!topic) return;

    const moduleEl = navEl.querySelector(`[data-module="${topic.module}"]`);
    if (!moduleEl) return;

    const header = moduleEl.querySelector(".sidebar-module-header");
    header.classList.add("active");
    header.setAttribute("aria-expanded", "true");
    const list = moduleEl.querySelector(".sidebar-topics");
    if (list) list.hidden = false;
}

function toggleSidebarModule(header) {
    const expanded = header.getAttribute("aria-expanded") === "true";
    const listId = header.getAttribute("aria-controls");
    const list = document.getElementById(listId);
    if (!list) return;

    header.setAttribute("aria-expanded", String(!expanded));
    list.hidden = expanded;
}

/**
 * Converte a sidebar em drawer deslizante em telas mobile.
 * Toggle abre/fecha; backdrop e clique em tópico fecham; Escape fecha.
 * No desktop (>768px) os controles ficam invisíveis via CSS e o estado é
 * reinicializado para evitar resquícios ao redimensionar.
 */
export function attachDrawer(sidebarEl, toggleEl, backdropEl) {
    if (!sidebarEl || !toggleEl || !backdropEl) return;

    const mql = window.matchMedia("(max-width: 768px)");

    const open = () => {
        sidebarEl.setAttribute("data-drawer-open", "true");
        toggleEl.setAttribute("aria-expanded", "true");
        backdropEl.hidden = false;
    };

    const close = () => {
        sidebarEl.setAttribute("data-drawer-open", "false");
        toggleEl.setAttribute("aria-expanded", "false");
        backdropEl.hidden = true;
    };

    toggleEl.addEventListener("click", () => {
        const isOpen = sidebarEl.getAttribute("data-drawer-open") === "true";
        if (isOpen) close();
        else open();
    });

    backdropEl.addEventListener("click", close);

    sidebarEl.addEventListener("click", (e) => {
        if (!mql.matches) return;
        if (e.target.closest(".sidebar-topic-link")) close();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && sidebarEl.getAttribute("data-drawer-open") === "true") {
            close();
        }
    });

    mql.addEventListener("change", (e) => {
        if (!e.matches) close();
    });
}
