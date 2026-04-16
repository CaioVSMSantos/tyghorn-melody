/**
 * theory.js — Shell dinâmico do módulo de Teoria Musical
 *
 * Responsabilidades:
 * - Carregar o manifesto de tópicos (theory-manifest.json)
 * - Gerar sidebar com índice de módulos/tópicos
 * - Roteamento por hash (#1.1, #2.3, etc.)
 * - Fetch de HTML fragments por tópico
 * - Breadcrumb, navegação anterior/próximo, pré-requisitos
 * - Vista de índice quando nenhum tópico está selecionado
 */

// --- State ---

let manifest = null;     // { modules: [], topics: [] }
let topicOrder = [];      // topic IDs na ordem sequencial
let currentTopicId = null;

// --- DOM refs ---

const sidebarNav = document.getElementById('sidebar-nav');
const contentArea = document.getElementById('theory-content');

// --- Bootstrap ---

init();

async function init() {
    manifest = await loadManifest();
    if (!manifest) return;

    topicOrder = manifest.topics.map(t => t.id);
    buildSidebar();
    handleRoute();
    window.addEventListener('hashchange', handleRoute);
}

// --- Manifest ---

async function loadManifest() {
    try {
        const resp = await fetch('../data/theory-manifest.json');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();

        if (!Array.isArray(data.modules) || !Array.isArray(data.topics)) {
            throw new Error('Manifest inválido: modules ou topics ausentes');
        }
        return data;
    } catch (err) {
        console.error('[theory] Falha ao carregar manifesto:', err);
        contentArea.innerHTML = renderError('Não foi possível carregar o índice de tópicos.');
        return null;
    }
}

// --- Sidebar ---

function buildSidebar() {
    let html = '';
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
                    `).join('')}
                </ul>
            </div>
        `;
    }
    sidebarNav.innerHTML = html;

    sidebarNav.addEventListener('click', (e) => {
        const header = e.target.closest('.sidebar-module-header');
        if (!header) return;
        toggleSidebarModule(header);
    });
}

function toggleSidebarModule(header) {
    const expanded = header.getAttribute('aria-expanded') === 'true';
    const listId = header.getAttribute('aria-controls');
    const list = document.getElementById(listId);
    if (!list) return;

    header.setAttribute('aria-expanded', String(!expanded));
    if (expanded) {
        list.hidden = true;
    } else {
        list.hidden = false;
    }
}

function updateSidebarActive(topicId) {
    sidebarNav.querySelectorAll('.sidebar-topic-link').forEach(link => {
        link.classList.toggle('active', link.dataset.topic === topicId);
    });

    sidebarNav.querySelectorAll('.sidebar-module-header').forEach(header => {
        header.classList.remove('active');
    });

    if (!topicId) return;

    const topic = findTopic(topicId);
    if (!topic) return;

    const moduleEl = sidebarNav.querySelector(`[data-module="${topic.module}"]`);
    if (!moduleEl) return;

    const header = moduleEl.querySelector('.sidebar-module-header');
    header.classList.add('active');
    header.setAttribute('aria-expanded', 'true');
    const list = moduleEl.querySelector('.sidebar-topics');
    if (list) list.hidden = false;
}

// --- Routing ---

function handleRoute() {
    const hash = window.location.hash.slice(1);
    if (hash && findTopic(hash)) {
        loadTopic(hash);
    } else {
        showIndex();
    }
}

// --- Index view ---

function showIndex() {
    currentTopicId = null;
    updateSidebarActive(null);
    document.title = 'Teoria Musical — Tyghorn Melody';

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
                    `).join('')}
                </div>
            </div>
        `;
    }

    contentArea.innerHTML = html;
    contentArea.scrollTo(0, 0);
}

// --- Topic view ---

async function loadTopic(topicId) {
    currentTopicId = topicId;
    updateSidebarActive(topicId);

    const topic = findTopic(topicId);
    const mod = findModule(topic.module);
    document.title = `${topicId} ${topic.title} — Tyghorn Melody`;

    contentArea.innerHTML = renderTopicSkeleton(topic, mod);
    contentArea.scrollTo(0, 0);

    const fragment = await fetchFragment(topicId);
    const bodyEl = document.getElementById('topic-body');

    if (fragment) {
        bodyEl.innerHTML = fragment;
    } else {
        bodyEl.innerHTML = renderTopicPlaceholder(topic);
    }
}

async function fetchFragment(topicId) {
    const path = `../content/theory/${topicId.replace('.', '-')}.html`;
    try {
        const resp = await fetch(path);
        if (!resp.ok) return null;
        return await resp.text();
    } catch {
        return null;
    }
}

function renderTopicSkeleton(topic, mod) {
    const breadcrumb = renderBreadcrumb(topic, mod);
    const prerequisites = renderPrerequisites(topic);
    const nav = renderTopicNav(topic.id);

    return `
        ${breadcrumb}
        <div class="topic-header">
            <div class="topic-number">Tópico ${topic.id}</div>
            <h1 class="topic-title">${topic.title}</h1>
        </div>
        ${prerequisites}
        <div class="topic-body" id="topic-body"></div>
        ${nav}
    `;
}

// --- Breadcrumb ---

function renderBreadcrumb(topic, mod) {
    return `
        <div class="theory-breadcrumb">
            <a href="#" >Teoria</a>
            <span class="theory-breadcrumb-separator">›</span>
            <a href="#${mod.id}.1">Módulo ${mod.id}: ${mod.title}</a>
            <span class="theory-breadcrumb-separator">›</span>
            <span class="theory-breadcrumb-current">${topic.id} ${topic.title}</span>
        </div>
    `;
}

// --- Prerequisites ---

function renderPrerequisites(topic) {
    if (!topic.prerequisites || topic.prerequisites.length === 0) return '';

    const links = topic.prerequisites.map(preId => {
        const pre = findTopic(preId);
        if (!pre) return '';
        return `<a href="#${pre.id}">${pre.id} ${pre.title}</a>`;
    }).filter(Boolean);

    if (links.length === 0) return '';

    return `
        <div class="topic-prerequisites">
            <span>Pré-requisitos sugeridos:</span>
            ${links.join(' · ')}
        </div>
    `;
}

// --- Topic navigation (anterior/próximo) ---

function renderTopicNav(topicId) {
    const idx = topicOrder.indexOf(topicId);
    const prev = idx > 0 ? findTopic(topicOrder[idx - 1]) : null;
    const next = idx < topicOrder.length - 1 ? findTopic(topicOrder[idx + 1]) : null;

    let html = '<div class="topic-nav">';

    if (prev) {
        html += `
            <a href="#${prev.id}" class="topic-nav-link">
                <span class="topic-nav-label">← Anterior</span>
                <span class="topic-nav-title">${prev.id} ${prev.title}</span>
            </a>
        `;
    } else {
        html += '<div></div>';
    }

    if (next) {
        html += `
            <a href="#${next.id}" class="topic-nav-link topic-nav-link--next">
                <span class="topic-nav-label">Próximo →</span>
                <span class="topic-nav-title">${next.id} ${next.title}</span>
            </a>
        `;
    }

    html += '</div>';
    return html;
}

// --- Placeholder for topics without content yet ---

function renderTopicPlaceholder(topic) {
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

// --- Error state ---

function renderError(message) {
    return `
        <div class="under-construction" style="padding: 3rem 0;">
            <div class="uc-icon">⚠️</div>
            <h2 class="uc-title">Erro</h2>
            <p class="uc-desc">${escapeHtml(message)}</p>
            <a href="../index.html" class="btn uc-btn">Voltar ao início</a>
        </div>
    `;
}

// --- Helpers ---

function findTopic(id) {
    return manifest.topics.find(t => t.id === id) || null;
}

function findModule(id) {
    return manifest.modules.find(m => m.id === id) || null;
}

function escapeHtml(str) {
    const el = document.createElement('span');
    el.textContent = str;
    return el.innerHTML;
}
