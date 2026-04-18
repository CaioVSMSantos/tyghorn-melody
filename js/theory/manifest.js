/**
 * manifest.js — Carregamento e lookup do manifesto da Teoria Musical.
 *
 * Encapsula fetch + validação mínima do JSON e expõe helpers de busca
 * por tópico e módulo. Não toca DOM — erros são lançados para que o
 * orquestrador decida como exibir.
 */

/**
 * Carrega e valida o manifesto. Lança Error em falha de rede ou formato.
 *
 * @param {string} path — URL relativa ao manifesto JSON.
 * @returns {Promise<{ modules: Array, topics: Array }>}
 */
export async function loadManifest(path) {
    const resp = await fetch(path);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const data = await resp.json();
    if (!Array.isArray(data.modules) || !Array.isArray(data.topics)) {
        throw new Error("Manifest inválido: modules ou topics ausentes");
    }
    return data;
}

/**
 * Busca um tópico por id.
 */
export function findTopic(manifest, id) {
    return manifest.topics.find(t => t.id === id) || null;
}

/**
 * Busca um módulo por id.
 */
export function findModule(manifest, id) {
    return manifest.modules.find(m => m.id === id) || null;
}
