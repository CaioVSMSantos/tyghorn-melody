/**
 * validator.js — Validação do schema de data/resources.json.
 *
 * Retorna array de mensagens de erro (vazio quando válido). Não toca DOM —
 * o orquestrador decide entre apenas warn no console ou abortar a render.
 */

export const VALID_STATUSES = ["active", "outdated", "unavailable"];
export const VALID_GROUPS = ["study", "tools", "gear", "culture", "community", "audience"];

/**
 * Valida a estrutura de um objeto de recursos. Retorna array de erros
 * (strings). Lista vazia significa sem erros.
 */
export function validateResources(data) {
    const errors = [];

    if (!data || typeof data !== "object") {
        return ["JSON inválido: não é um objeto."];
    }

    validateMetadata(data.metadata, errors);

    if (!Array.isArray(data.categories) || data.categories.length === 0) {
        errors.push("Deve haver pelo menos uma categoria.");
        return errors;
    }

    const categoryIds = validateCategories(data.categories, errors);

    if (!Array.isArray(data.resources)) {
        errors.push('Campo obrigatório ausente: "resources" (deve ser um array).');
        return errors;
    }

    validateResourceList(data.resources, categoryIds, errors);
    return errors;
}

function validateMetadata(metadata, errors) {
    if (!metadata || typeof metadata !== "object") {
        errors.push('Campo obrigatório ausente: "metadata".');
        return;
    }
    if (typeof metadata.lastReviewDate !== "string") {
        errors.push("metadata.lastReviewDate deve ser uma string.");
    }
    if (typeof metadata.version !== "string") {
        errors.push("metadata.version deve ser uma string.");
    }
}

function validateCategories(categories, errors) {
    const ids = new Set();
    const ordersByGroup = {};

    for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];
        const p = `categories[${i}]`;

        if (typeof cat.id !== "string" || cat.id.trim() === "") {
            errors.push(`${p}: "id" ausente ou inválido.`);
        } else if (ids.has(cat.id)) {
            errors.push(`${p}: ID duplicado "${cat.id}".`);
        } else {
            ids.add(cat.id);
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

        if (cat.group && typeof cat.order === "number") {
            if (!ordersByGroup[cat.group]) ordersByGroup[cat.group] = new Set();
            if (ordersByGroup[cat.group].has(cat.order)) {
                errors.push(`${p}: "order" ${cat.order} duplicado no grupo "${cat.group}".`);
            } else {
                ordersByGroup[cat.group].add(cat.order);
            }
        }
    }

    return ids;
}

function validateResourceList(resources, categoryIds, errors) {
    const ids = new Set();

    for (let i = 0; i < resources.length; i++) {
        const res = resources[i];
        const p = `resources[${i}]`;

        if (typeof res.id !== "string" || res.id.trim() === "") {
            errors.push(`${p}: "id" ausente ou inválido.`);
        } else if (ids.has(res.id)) {
            errors.push(`${p}: ID duplicado "${res.id}".`);
        } else {
            ids.add(res.id);
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
}
