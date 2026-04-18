/**
 * catalog-view.js — Renderização do catálogo de músicas.
 *
 * Responsável por agrupar músicas por categoria, exibir badge de dificuldade,
 * compatibilidade de range com o teclado configurado e histórico de progresso.
 * Seleção de música é delegada ao callback `onSelectSong`.
 */

import { badge } from "../shared/dom.js";

const CATEGORY_LABELS = {
    games: "🎮 Games",
    animes: "🌸 Animes",
    movies: "🎬 Movies",
    artists: "🎤 Artistas",
};

export function difficultyLabel(d) {
    return { beginner: "Iniciante", intermediate: "Intermediário", advanced: "Avançado" }[d] || d;
}

export function difficultyBadgeClass(d) {
    return { beginner: "success", intermediate: "warn", advanced: "error" }[d] || "warn";
}

/**
 * Renderiza o catálogo completo dentro do contêiner informado.
 *
 * @param {HTMLElement} container — elemento onde o catálogo será montado
 * @param {object} catalog        — objeto catálogo com lista de músicas
 * @param {object|null} keyboard  — configuração do teclado (para cálculo de range)
 * @param {(songId: string) => object|null} getProgress — busca de progresso por música
 * @param {(song: object) => void} onSelectSong — callback ao clicar num card
 */
export function renderCatalog(container, catalog, keyboard, getProgress, onSelectSong) {
    container.textContent = "";

    const byCategory = {};
    for (const song of catalog.songs) {
        if (!byCategory[song.category]) byCategory[song.category] = [];
        byCategory[song.category].push(song);
    }

    for (const [category, songs] of Object.entries(byCategory)) {
        const section = document.createElement("div");
        section.className = "catalog-section";

        const heading = document.createElement("h2");
        heading.textContent = CATEGORY_LABELS[category] || category;
        section.appendChild(heading);

        for (const song of songs) {
            section.appendChild(createSongCard(song, keyboard, getProgress, onSelectSong));
        }

        container.appendChild(section);
    }
}

function createSongCard(song, keyboard, getProgress, onSelectSong) {
    const card = document.createElement("button");
    card.className = "catalog-card";
    card.type = "button";

    let rangeInfo = "";
    if (keyboard) {
        const compatible =
            song.midiRange.lowest >= keyboard.lowestNote &&
            song.midiRange.highest <= keyboard.highestNote;
        rangeInfo = compatible ? "✅ Compatível" : "⚠️ Notas fora do range";
    }

    const progress = getProgress(song.id);
    const progressInfo = progress
        ? `Melhor: ${progress.bestAccuracy}% · ${progress.timesPlayed}x tocada`
        : "";

    const titleEl = document.createElement("div");
    titleEl.className = "catalog-card-title";
    titleEl.textContent = song.title;

    const detailEl = document.createElement("div");
    detailEl.className = "catalog-card-detail";
    detailEl.textContent = `${song.artist} — ${song.source}`;

    const metaEl = document.createElement("div");
    metaEl.className = "catalog-card-meta";

    metaEl.appendChild(badge(
        difficultyLabel(song.difficulty),
        "badge badge-" + difficultyBadgeClass(song.difficulty),
    ));

    if (rangeInfo) {
        const rangeSpan = document.createElement("span");
        rangeSpan.className = "catalog-card-range";
        rangeSpan.textContent = rangeInfo;
        metaEl.appendChild(rangeSpan);
    }

    if (progressInfo) {
        const progSpan = document.createElement("span");
        progSpan.className = "catalog-card-progress";
        progSpan.textContent = progressInfo;
        metaEl.appendChild(progSpan);
    }

    card.appendChild(titleEl);
    card.appendChild(detailEl);
    card.appendChild(metaEl);
    card.addEventListener("click", () => onSelectSong(song));
    return card;
}
