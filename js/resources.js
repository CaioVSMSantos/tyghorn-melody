/**
 * resources.js — Carregamento e renderização do catálogo de recursos
 *
 * Seções:
 * 1. Constantes e referências DOM
 * 2. Validação do JSON
 * 3. Renderização
 * 4. Accordion (colapsar/expandir)
 * 5. Inicialização
 */

// =============================================================================
// 1. Constantes e referências DOM
// =============================================================================

const VALID_STATUSES = ["active", "outdated", "unavailable"];
const VALID_GROUPS = ["study", "tools", "gear", "culture", "community", "audience"];
const GROUP_ORDER = ["study", "tools", "gear", "culture", "community", "audience"];

const LANGUAGE_LABELS = {
    "pt-br": "PT",
    "en": "EN",
    "es": "ES",
    "fr": "FR",
    "de": "DE",
    "it": "IT",
    "ja": "JA",
};

const STATUS_LABELS = {
    "outdated": "Desatualizado",
    "unavailable": "Indisponível",
};

const containerEl = document.getElementById("resources-container");
const lastReviewEl = document.getElementById("last-review-date");

// =============================================================================
// 2. Validação do JSON
// =============================================================================

function validateData(data) {
    const errors = [];

    if (!data || typeof data !== "object") {
        return ["JSON inválido: não é um objeto."];
    }

    // Metadata
    if (!data.metadata || typeof data.metadata !== "object") {
        errors.push('Campo obrigatório ausente: "metadata".');
    } else {
        if (typeof data.metadata.lastReviewDate !== "string") {
            errors.push('metadata.lastReviewDate deve ser uma string.');
        }
        if (typeof data.metadata.version !== "string") {
            errors.push('metadata.version deve ser uma string.');
        }
    }

    // Categories
    if (!Array.isArray(data.categories) || data.categories.length === 0) {
        errors.push("Deve haver pelo menos uma categoria.");
        return errors;
    }

    const categoryIds = new Set();
    const ordersByGroup = {};

    for (let i = 0; i < data.categories.length; i++) {
        const cat = data.categories[i];
        const p = `categories[${i}]`;

        if (typeof cat.id !== "string" || cat.id.trim() === "") {
            errors.push(`${p}: "id" ausente ou inválido.`);
        } else if (categoryIds.has(cat.id)) {
            errors.push(`${p}: ID duplicado "${cat.id}".`);
        } else {
            categoryIds.add(cat.id);
        }

        if (typeof cat.name !== "string" || cat.name.trim() === "") {
            errors.push(`${p}: "name" ausente ou inválido.`);
        }
        if (typeof cat.icon !== "string" || cat.icon.trim() === "") {
            errors.push(`${p}: "icon" ausente ou inválido.`);
        }
        if (typeof cat.description !== "string" || cat.description.trim() === "") {
            errors.push(`${p}: "description" ausente ou inválido.`);
        }
        if (!VALID_GROUPS.includes(cat.group)) {
            errors.push(`${p}: "group" inválido: "${cat.group}". Válidos: ${VALID_GROUPS.join(", ")}.`);
        }
        if (typeof cat.order !== "number" || !Number.isInteger(cat.order) || cat.order < 1) {
            errors.push(`${p}: "order" deve ser inteiro positivo.`);
        }

        // Check unique order within group
        if (cat.group && typeof cat.order === "number") {
            if (!ordersByGroup[cat.group]) {
                ordersByGroup[cat.group] = new Set();
            }
            if (ordersByGroup[cat.group].has(cat.order)) {
                errors.push(`${p}: "order" ${cat.order} duplicado no grupo "${cat.group}".`);
            } else {
                ordersByGroup[cat.group].add(cat.order);
            }
        }
    }

    // Resources
    if (!Array.isArray(data.resources)) {
        errors.push('Campo obrigatório ausente: "resources" (deve ser um array).');
        return errors;
    }

    const resourceIds = new Set();

    for (let i = 0; i < data.resources.length; i++) {
        const res = data.resources[i];
        const p = `resources[${i}]`;

        if (typeof res.id !== "string" || res.id.trim() === "") {
            errors.push(`${p}: "id" ausente ou inválido.`);
        } else if (resourceIds.has(res.id)) {
            errors.push(`${p}: ID duplicado "${res.id}".`);
        } else {
            resourceIds.add(res.id);
        }

        if (typeof res.title !== "string" || res.title.trim() === "") {
            errors.push(`${p}: "title" ausente ou inválido.`);
        }
        if (typeof res.description !== "string" || res.description.trim() === "") {
            errors.push(`${p}: "description" ausente ou inválido.`);
        }
        if (typeof res.category !== "string" || !categoryIds.has(res.category)) {
            errors.push(`${p}: "category" "${res.category}" não referencia uma categoria válida.`);
        }
        if (typeof res.language !== "string" || res.language.trim() === "") {
            errors.push(`${p}: "language" ausente ou inválido.`);
        }
        if (!VALID_STATUSES.includes(res.status)) {
            errors.push(`${p}: "status" inválido: "${res.status}". Válidos: ${VALID_STATUSES.join(", ")}.`);
        }
        if (typeof res.addedDate !== "string" || res.addedDate.trim() === "") {
            errors.push(`${p}: "addedDate" ausente ou inválido.`);
        }
        if (typeof res.lastChecked !== "string" || res.lastChecked.trim() === "") {
            errors.push(`${p}: "lastChecked" ausente ou inválido.`);
        }
    }

    return errors;
}

// =============================================================================
// 3. Renderização
// =============================================================================

/**
 * Formata a data de revisão (YYYY-MM) para exibição (ex: "Abril 2026").
 */
function formatReviewDate(dateStr) {
    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ];
    const parts = dateStr.split("-");
    if (parts.length !== 2) return dateStr;

    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;

    if (monthIndex < 0 || monthIndex > 11) return dateStr;
    return months[monthIndex] + " " + year;
}

/**
 * Agrupa e ordena categorias por grupo, respeitando GROUP_ORDER e order interno.
 */
function sortCategories(categories) {
    return [...categories].sort((a, b) => {
        const groupDiff = GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group);
        if (groupDiff !== 0) return groupDiff;
        return a.order - b.order;
    });
}

/**
 * Indexa recursos por categoria. Retorna Map<categoryId, Resource[]>.
 */
function indexResourcesByCategory(resources) {
    const index = new Map();
    for (const res of resources) {
        if (!index.has(res.category)) {
            index.set(res.category, []);
        }
        index.get(res.category).push(res);
    }
    return index;
}

/**
 * Renderiza a página completa dentro do container.
 */
function renderPage(data) {
    containerEl.textContent = "";

    // Data de revisão
    if (data.metadata.lastReviewDate) {
        lastReviewEl.textContent = "Última revisão: " + formatReviewDate(data.metadata.lastReviewDate);
    }

    const sorted = sortCategories(data.categories);
    const resourceIndex = indexResourcesByCategory(data.resources);

    // Separar recursos ativos/outdated dos unavailable
    const activeResources = data.resources.filter(r => r.status !== "unavailable");
    const archivedResources = data.resources.filter(r => r.status === "unavailable");

    const activeIndex = indexResourcesByCategory(activeResources);

    let prevGroup = null;

    for (const category of sorted) {
        // Separador entre grupos
        if (prevGroup !== null && category.group !== prevGroup) {
            const separator = document.createElement("div");
            separator.className = "accordion-group-separator";
            containerEl.appendChild(separator);
        }
        prevGroup = category.group;

        const categoryResources = activeIndex.get(category.id) || [];
        renderCategory(category, categoryResources);
    }

    // Seção de Arquivo
    if (archivedResources.length > 0) {
        renderArchive(archivedResources, data.categories);
    }

    // Estado vazio global
    if (data.resources.length === 0) {
        renderEmptyState();
    }
}

/**
 * Renderiza uma seção de categoria (accordion).
 */
function renderCategory(category, resources) {
    const section = document.createElement("div");
    section.className = "accordion-section";

    // Header (botão clicável)
    const header = document.createElement("button");
    header.className = "accordion-header";
    header.type = "button";
    header.setAttribute("aria-expanded", "false");

    const headerLeft = document.createElement("span");
    headerLeft.className = "accordion-header-left";

    const icon = document.createElement("span");
    icon.className = "accordion-icon";
    icon.textContent = category.icon;

    const title = document.createElement("span");
    title.className = "accordion-title";
    title.textContent = category.name;

    const count = document.createElement("span");
    count.className = "accordion-count";
    const activeCount = resources.filter(r => r.status === "active").length;
    count.textContent = "(" + activeCount + ")";

    headerLeft.appendChild(icon);
    headerLeft.appendChild(title);
    headerLeft.appendChild(count);

    const arrow = document.createElement("span");
    arrow.className = "accordion-arrow";
    arrow.textContent = "▶";

    header.appendChild(headerLeft);
    header.appendChild(arrow);

    // Content panel
    const contentId = "accordion-content-" + category.id;
    header.setAttribute("aria-controls", contentId);

    const content = document.createElement("div");
    content.className = "accordion-content";
    content.id = contentId;
    content.setAttribute("role", "region");
    content.setAttribute("aria-labelledby", "accordion-header-" + category.id);
    content.hidden = true;
    header.id = "accordion-header-" + category.id;

    // Descrição da categoria
    const desc = document.createElement("p");
    desc.className = "accordion-description";
    desc.textContent = category.description;
    content.appendChild(desc);

    // Lista de recursos
    if (resources.length === 0) {
        const empty = document.createElement("p");
        empty.className = "accordion-empty";
        empty.textContent = "Nenhum recurso cadastrado nesta categoria ainda.";
        content.appendChild(empty);
    } else {
        const list = document.createElement("div");
        list.className = "resource-list";
        for (const resource of resources) {
            list.appendChild(renderResource(resource));
        }
        content.appendChild(list);
    }

    section.appendChild(header);
    section.appendChild(content);
    containerEl.appendChild(section);
}

/**
 * Renderiza um item de recurso individual.
 */
function renderResource(resource) {
    const item = document.createElement("div");
    item.className = "resource-item";

    // Linha do título (título + badges)
    const titleRow = document.createElement("div");
    titleRow.className = "resource-title-row";

    const title = document.createElement("span");
    title.className = "resource-title";
    title.textContent = resource.title;
    titleRow.appendChild(title);

    // Badge de idioma (se não for pt-br)
    if (resource.language && resource.language !== "pt-br") {
        const langBadge = document.createElement("span");
        langBadge.className = "badge-lang";
        langBadge.textContent = LANGUAGE_LABELS[resource.language] || resource.language.toUpperCase();
        titleRow.appendChild(langBadge);
    }

    // Badge de status (se não for active)
    if (resource.status && resource.status !== "active") {
        const statusBadge = document.createElement("span");
        statusBadge.className = resource.status === "outdated" ? "badge-status-outdated" : "badge-status-unavailable";
        statusBadge.textContent = STATUS_LABELS[resource.status] || resource.status;
        titleRow.appendChild(statusBadge);
    }

    item.appendChild(titleRow);

    // Subtítulo (autor, criador)
    if (resource.subtitle) {
        const subtitle = document.createElement("div");
        subtitle.className = "resource-subtitle";
        subtitle.textContent = resource.subtitle;
        item.appendChild(subtitle);
    }

    // Descrição
    const desc = document.createElement("div");
    desc.className = "resource-description";
    desc.textContent = resource.description;
    item.appendChild(desc);

    // Onde encontrar
    if (resource.searchHint) {
        const hint = document.createElement("div");
        hint.className = "resource-search-hint";
        hint.textContent = "📍 " + resource.searchHint;
        item.appendChild(hint);
    }

    // Link direto
    if (resource.url) {
        const linkRow = document.createElement("div");
        linkRow.className = "resource-link-row";

        const linkIcon = document.createTextNode("🔗 ");
        linkRow.appendChild(linkIcon);

        const link = document.createElement("a");
        link.href = resource.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = resource.url;
        link.className = "resource-link";
        linkRow.appendChild(link);

        item.appendChild(linkRow);
    }

    return item;
}

/**
 * Renderiza a seção de arquivo (recursos indisponíveis).
 */
function renderArchive(archivedResources, categories) {
    const separator = document.createElement("div");
    separator.className = "accordion-group-separator";
    containerEl.appendChild(separator);

    const section = document.createElement("div");
    section.className = "accordion-section accordion-section-archive";

    // Header
    const header = document.createElement("button");
    header.className = "accordion-header accordion-header-archive";
    header.type = "button";
    header.setAttribute("aria-expanded", "false");

    const headerLeft = document.createElement("span");
    headerLeft.className = "accordion-header-left";

    const icon = document.createElement("span");
    icon.className = "accordion-icon";
    icon.textContent = "🗄️";

    const title = document.createElement("span");
    title.className = "accordion-title";
    title.textContent = "Arquivo";

    const count = document.createElement("span");
    count.className = "accordion-count";
    count.textContent = "(" + archivedResources.length + ")";

    headerLeft.appendChild(icon);
    headerLeft.appendChild(title);
    headerLeft.appendChild(count);

    const arrow = document.createElement("span");
    arrow.className = "accordion-arrow";
    arrow.textContent = "▶";

    header.appendChild(headerLeft);
    header.appendChild(arrow);

    // Content
    const contentId = "accordion-content-archive";
    header.id = "accordion-header-archive";
    header.setAttribute("aria-controls", contentId);

    const content = document.createElement("div");
    content.className = "accordion-content";
    content.id = contentId;
    content.setAttribute("role", "region");
    content.setAttribute("aria-labelledby", "accordion-header-archive");
    content.hidden = true;

    const desc = document.createElement("p");
    desc.className = "accordion-description";
    desc.textContent = "Recursos anteriormente recomendados que foram removidos por indisponibilidade ou obsolescência. Mantidos aqui como referência histórica.";
    content.appendChild(desc);

    // Agrupar por categoria de origem
    const categoryMap = new Map();
    for (const cat of categories) {
        categoryMap.set(cat.id, cat);
    }

    const grouped = new Map();
    for (const res of archivedResources) {
        if (!grouped.has(res.category)) {
            grouped.set(res.category, []);
        }
        grouped.get(res.category).push(res);
    }

    for (const [catId, resources] of grouped) {
        const cat = categoryMap.get(catId);
        if (cat) {
            const groupLabel = document.createElement("div");
            groupLabel.className = "archive-group-label";
            groupLabel.textContent = cat.icon + " " + cat.name;
            content.appendChild(groupLabel);
        }

        const list = document.createElement("div");
        list.className = "resource-list";
        for (const resource of resources) {
            list.appendChild(renderResource(resource));
        }
        content.appendChild(list);
    }

    section.appendChild(header);
    section.appendChild(content);
    containerEl.appendChild(section);
}

/**
 * Renderiza estado vazio (nenhum recurso cadastrado).
 */
function renderEmptyState() {
    const empty = document.createElement("div");
    empty.className = "panel panel-info";
    empty.style.marginTop = "1.5rem";

    const text = document.createElement("p");
    text.textContent = "📋 A curadoria de recursos está em andamento. Em breve esta página estará populada com recomendações cuidadosamente selecionadas.";
    empty.appendChild(text);

    containerEl.appendChild(empty);
}

// =============================================================================
// 4. Accordion (colapsar/expandir)
// =============================================================================

/**
 * Configura event delegation para todos os accordions.
 */
function setupAccordion() {
    containerEl.addEventListener("click", (event) => {
        const header = event.target.closest(".accordion-header");
        if (!header) return;

        const contentId = header.getAttribute("aria-controls");
        const content = document.getElementById(contentId);
        if (!content) return;

        const isExpanded = header.getAttribute("aria-expanded") === "true";

        header.setAttribute("aria-expanded", String(!isExpanded));
        content.hidden = isExpanded;

        const arrow = header.querySelector(".accordion-arrow");
        if (arrow) {
            arrow.textContent = isExpanded ? "▶" : "▼";
        }
    });
}

// =============================================================================
// 5. Inicialização
// =============================================================================

async function init() {
    setupAccordion();

    try {
        const response = await fetch("../data/resources.json");
        if (!response.ok) {
            throw new Error("Falha ao carregar catálogo de recursos (HTTP " + response.status + ").");
        }

        const data = await response.json();
        const errors = validateData(data);

        if (errors.length > 0) {
            console.warn("Validação do resources.json — erros encontrados:");
            for (const error of errors) {
                console.warn("  • " + error);
            }
        }

        renderPage(data);
    } catch (error) {
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
        console.error("resources.js — Erro na inicialização:", error);
    }
}

init();
