/**
 * topic-view.js — Renderização das vistas de conteúdo da Teoria.
 *
 * Três vistas: índice (cards de módulos), tópico (skeleton + fragment HTML)
 * e erro. Ajusta document.title conforme a vista. Fragments são carregados
 * de content/theory/<topicId-com-hífen>.html; ausência resulta em placeholder.
 */

import { findTopic, findModule } from "./manifest.js";

/**
 * Renderiza a vista de índice (cards de módulos na home de Teoria).
 */
export function renderIndex(container, manifest) {
    document.title = "Teoria Musical — Tyghorn Melody";

    let html = `
        <div class="theory-index-header">
            <h1>📖 Teoria Musical</h1>
            <p>Fundamentos de teoria musical para iniciantes ao teclado. Escolha um módulo para começar.</p>
        </div>
    `;

    for (const mod of manifest.modules) {
        const topics = manifest.topics.filter(t => t.module === mod.id);
        html += `
            <div class="module-card">
                <div class="module-card-header">
                    <span class="module-card-number">${mod.id}</span>
                    <span class="module-card-title">${mod.title}</span>
                    <span class="module-card-level">${mod.level}</span>
                </div>
                <div class="module-card-desc">${mod.description}</div>
                <div class="module-card-topics">
                    ${topics.map(t => `
                        <a href="#${t.id}" class="module-card-topic">${t.id} ${t.title}</a>
                    `).join("")}
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
    container.scrollTo(0, 0);
}

/**
 * Renderiza a vista de tópico individual: skeleton síncrono + fetch
 * assíncrono do fragment HTML. Se o fragment não existir, usa placeholder.
 */
export async function renderTopic(container, manifest, topicOrder, topicId) {
    const topic = findTopic(manifest, topicId);
    const mod = findModule(manifest, topic.module);
    document.title = `${topicId} ${topic.title} — Tyghorn Melody`;

    container.innerHTML = renderTopicSkeleton(topic, mod, manifest, topicOrder);
    container.scrollTo(0, 0);

    const fragment = await fetchFragment(topicId);
    const bodyEl = document.getElementById("topic-body");
    if (!bodyEl) return;

    bodyEl.innerHTML = fragment || renderTopicPlaceholder();
}

/**
 * Renderiza a vista de erro (ex: manifesto indisponível).
 */
export function renderError(container, message) {
    container.innerHTML = `
        <div class="under-construction" style="padding: 3rem 0;">
            <div class="uc-icon">⚠️</div>
            <h2 class="uc-title">Erro</h2>
            <p class="uc-desc">${escapeHtml(message)}</p>
            <a href="../index.html" class="btn uc-btn">Voltar ao início</a>
        </div>
    `;
}

// --- Internos ---

async function fetchFragment(topicId) {
    const path = `../content/theory/${topicId.replace(".", "-")}.html`;
    try {
        const resp = await fetch(path);
        if (!resp.ok) return null;
        return await resp.text();
    } catch {
        return null;
    }
}

function renderTopicSkeleton(topic, mod, manifest, topicOrder) {
    return `
        ${renderBreadcrumb(topic, mod)}
        <div class="topic-header">
            <div class="topic-number">Tópico ${topic.id}</div>
            <h1 class="topic-title">${topic.title}</h1>
        </div>
        ${renderPrerequisites(topic, manifest)}
        <div class="topic-body" id="topic-body"></div>
        ${renderTopicNav(topic.id, manifest, topicOrder)}
    `;
}

function renderBreadcrumb(topic, mod) {
    return `
        <div class="theory-breadcrumb">
            <a href="#">Teoria</a>
            <span class="theory-breadcrumb-separator">›</span>
            <a href="#${mod.id}.1">Módulo ${mod.id}: ${mod.title}</a>
            <span class="theory-breadcrumb-separator">›</span>
            <span class="theory-breadcrumb-current">${topic.id} ${topic.title}</span>
        </div>
    `;
}

function renderPrerequisites(topic, manifest) {
    if (!topic.prerequisites || topic.prerequisites.length === 0) return "";

    const links = topic.prerequisites
        .map(preId => findTopic(manifest, preId))
        .filter(Boolean)
        .map(pre => `<a href="#${pre.id}">${pre.id} ${pre.title}</a>`);

    if (links.length === 0) return "";

    return `
        <div class="topic-prerequisites">
            <span>Pré-requisitos sugeridos:</span>
            ${links.join(" · ")}
        </div>
    `;
}

function renderTopicNav(topicId, manifest, topicOrder) {
    const idx = topicOrder.indexOf(topicId);
    const prev = idx > 0 ? findTopic(manifest, topicOrder[idx - 1]) : null;
    const next = idx >= 0 && idx < topicOrder.length - 1
        ? findTopic(manifest, topicOrder[idx + 1])
        : null;

    let html = '<div class="topic-nav">';

    if (prev) {
        html += `
            <a href="#${prev.id}" class="topic-nav-link">
                <span class="topic-nav-label">← Anterior</span>
                <span class="topic-nav-title">${prev.id} ${prev.title}</span>
            </a>
        `;
    } else {
        html += "<div></div>";
    }

    if (next) {
        html += `
            <a href="#${next.id}" class="topic-nav-link topic-nav-link--next">
                <span class="topic-nav-label">Próximo →</span>
                <span class="topic-nav-title">${next.id} ${next.title}</span>
            </a>
        `;
    }

    html += "</div>";
    return html;
}

function renderTopicPlaceholder() {
    return `
        <div class="under-construction" style="padding: 2rem 0;">
            <div class="uc-icon">📝</div>
            <h2 class="uc-title">Conteúdo em Desenvolvimento</h2>
            <p class="uc-desc">
                O conteúdo deste tópico está sendo elaborado. Em breve estará disponível aqui.
            </p>
        </div>
    `;
}

function escapeHtml(str) {
    const el = document.createElement("span");
    el.textContent = str;
    return el.innerHTML;
}
