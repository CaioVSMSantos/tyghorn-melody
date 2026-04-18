/**
 * view.js — Renderização do catálogo de recursos (accordion por categoria).
 *
 * Agrupa categorias por grupo (study/tools/gear/culture/community/audience)
 * respeitando GROUP_ORDER; separa recursos ativos dos arquivados; amarra
 * event delegation para expandir/colapsar seções.
 */

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

/**
 * Renderiza a página completa dentro do container principal.
 *
 * @param {HTMLElement} containerEl — onde as seções de accordion são montadas.
 * @param {HTMLElement|null} lastReviewEl — onde a data de revisão é exibida (opcional).
 * @param {object} data — objeto validado com { metadata, categories, resources }.
 */
export function renderResources(containerEl, lastReviewEl, data) {
    containerEl.textContent = "";

    if (lastReviewEl && data.metadata.lastReviewDate) {
        lastReviewEl.textContent = "Última revisão: " + formatReviewDate(data.metadata.lastReviewDate);
    }

    const sorted = sortCategories(data.categories);
    const activeResources = data.resources.filter(r => r.status !== "unavailable");
    const archivedResources = data.resources.filter(r => r.status === "unavailable");
    const activeIndex = indexResourcesByCategory(activeResources);

    let prevGroup = null;
    for (const category of sorted) {
        if (prevGroup !== null && category.group !== prevGroup) {
            const separator = document.createElement("div");
            separator.className = "accordion-group-separator";
            containerEl.appendChild(separator);
        }
        prevGroup = category.group;

        const categoryResources = activeIndex.get(category.id) || [];
        renderCategory(containerEl, category, categoryResources);
    }

    if (archivedResources.length > 0) {
        renderArchive(containerEl, archivedResources, data.categories);
    }

    if (data.resources.length === 0) {
        renderEmptyState(containerEl);
    }
}

/**
 * Amarra event delegation para expandir/colapsar accordions.
 */
export function setupAccordion(containerEl) {
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
        if (arrow) arrow.textContent = isExpanded ? "▶" : "▼";
    });
}

// --- Internos ---

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

function sortCategories(categories) {
    return [...categories].sort((a, b) => {
        const groupDiff = GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group);
        if (groupDiff !== 0) return groupDiff;
        return a.order - b.order;
    });
}

function indexResourcesByCategory(resources) {
    const index = new Map();
    for (const res of resources) {
        if (!index.has(res.category)) index.set(res.category, []);
        index.get(res.category).push(res);
    }
    return index;
}

function renderCategory(containerEl, category, resources) {
    const section = document.createElement("div");
    section.className = "accordion-section";

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

    const contentId = "accordion-content-" + category.id;
    header.setAttribute("aria-controls", contentId);
    header.id = "accordion-header-" + category.id;

    const content = document.createElement("div");
    content.className = "accordion-content";
    content.id = contentId;
    content.setAttribute("role", "region");
    content.setAttribute("aria-labelledby", "accordion-header-" + category.id);
    content.hidden = true;

    const desc = document.createElement("p");
    desc.className = "accordion-description";
    desc.textContent = category.description;
    content.appendChild(desc);

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

function renderResource(resource) {
    const item = document.createElement("div");
    item.className = "resource-item";

    const titleRow = document.createElement("div");
    titleRow.className = "resource-title-row";

    const title = document.createElement("span");
    title.className = "resource-title";
    title.textContent = resource.title;
    titleRow.appendChild(title);

    if (resource.language && resource.language !== "pt-br") {
        const langBadge = document.createElement("span");
        langBadge.className = "badge-lang";
        langBadge.textContent = LANGUAGE_LABELS[resource.language] || resource.language.toUpperCase();
        titleRow.appendChild(langBadge);
    }

    if (resource.status && resource.status !== "active") {
        const statusBadge = document.createElement("span");
        statusBadge.className = resource.status === "outdated" ? "badge-status-outdated" : "badge-status-unavailable";
        statusBadge.textContent = STATUS_LABELS[resource.status] || resource.status;
        titleRow.appendChild(statusBadge);
    }

    item.appendChild(titleRow);

    if (resource.subtitle) {
        const subtitle = document.createElement("div");
        subtitle.className = "resource-subtitle";
        subtitle.textContent = resource.subtitle;
        item.appendChild(subtitle);
    }

    const desc = document.createElement("div");
    desc.className = "resource-description";
    desc.textContent = resource.description;
    item.appendChild(desc);

    if (resource.searchHint) {
        const hint = document.createElement("div");
        hint.className = "resource-search-hint";
        hint.textContent = "📍 " + resource.searchHint;
        item.appendChild(hint);
    }

    if (resource.url) {
        const linkRow = document.createElement("div");
        linkRow.className = "resource-link-row";

        linkRow.appendChild(document.createTextNode("🔗 "));

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

function renderArchive(containerEl, archivedResources, categories) {
    const separator = document.createElement("div");
    separator.className = "accordion-group-separator";
    containerEl.appendChild(separator);

    const section = document.createElement("div");
    section.className = "accordion-section accordion-section-archive";

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

    const categoryMap = new Map();
    for (const cat of categories) categoryMap.set(cat.id, cat);

    const grouped = new Map();
    for (const res of archivedResources) {
        if (!grouped.has(res.category)) grouped.set(res.category, []);
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

function renderEmptyState(containerEl) {
    const empty = document.createElement("div");
    empty.className = "panel panel-info";
    empty.style.marginTop = "1.5rem";

    const text = document.createElement("p");
    text.textContent = "📋 A curadoria de recursos está em andamento. Em breve esta página estará populada com recomendações cuidadosamente selecionadas.";
    empty.appendChild(text);

    containerEl.appendChild(empty);
}
