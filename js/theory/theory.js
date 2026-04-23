/**
 * theory.js — Orquestrador do shell de Teoria Musical.
 *
 * Carrega o manifesto, constrói a sidebar, roteia por hash (#1.1, #2.3, ...)
 * e delega a renderização a topic-view. Todo o trabalho pesado vive nos
 * módulos auxiliares (manifest, sidebar, topic-view); este arquivo só faz
 * o wiring e mantém o estado de alto nível.
 */

import { loadManifest, findTopic } from "./manifest.js";
import { buildSidebar, updateSidebarActive, attachDrawer } from "./sidebar.js";
import { renderIndex, renderTopic, renderError } from "./topic-view.js";

const MANIFEST_PATH = "../content/data/theory-manifest.json";

function createTheoryShell() {
    const sidebarNav = document.getElementById("sidebar-nav");
    const contentArea = document.getElementById("theory-content");
    const sidebarEl = document.getElementById("theory-sidebar");
    const drawerToggle = document.getElementById("theory-drawer-toggle");
    const drawerBackdrop = document.getElementById("theory-drawer-backdrop");

    let manifest = null;
    let topicOrder = [];

    async function init() {
        try {
            manifest = await loadManifest(MANIFEST_PATH);
        } catch (err) {
            console.error("[theory] Falha ao carregar manifesto:", err);
            renderError(contentArea, "Não foi possível carregar o índice de tópicos.");
            return;
        }

        topicOrder = manifest.topics.map(t => t.id);
        buildSidebar(sidebarNav, manifest);
        attachDrawer(sidebarEl, drawerToggle, drawerBackdrop);
        handleRoute();
        window.addEventListener("hashchange", handleRoute);
    }

    function handleRoute() {
        const hash = window.location.hash.slice(1);
        const topic = hash ? findTopic(manifest, hash) : null;

        if (topic) {
            updateSidebarActive(sidebarNav, manifest, topic.id);
            renderTopic(contentArea, manifest, topicOrder, topic.id);
        } else {
            updateSidebarActive(sidebarNav, manifest, null);
            renderIndex(contentArea, manifest);
        }
    }

    return { init };
}

createTheoryShell().init();
