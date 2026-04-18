/**
 * track-selection.js — Seleção de tracks por mão e tolerância de matching.
 *
 * Renderiza dois radio groups (esquerda/direita) a partir das tracks da música
 * e um grupo de tolerância. Expõe queries para ler a seleção atual do DOM.
 */

import { difficultyLabel } from "./catalog-view.js";

export const TOLERANCE_LEVELS = {
    easy: { label: "Fácil", ms: 1000 },
    normal: { label: "Médio", ms: 500 },
    precise: { label: "Preciso", ms: 250 },
};

/**
 * Renderiza os grupos de seleção de tracks + tolerância.
 *
 * @param {HTMLElement} container — contêiner onde os grupos serão montados
 * @param {object} song           — música atual (precisa de .tracks)
 * @param {string} savedTolerance — chave da tolerância persistida (easy/normal/precise)
 * @param {{ onTrackChange: Function, onToleranceChange: (key: string) => void }} handlers
 */
export function renderTrackSelection(container, song, savedTolerance, handlers) {
    container.textContent = "";

    const leftTracks = song.tracks.filter(t => t.hand === "left");
    const rightTracks = song.tracks.filter(t => t.hand === "right");

    if (leftTracks.length > 0) {
        container.appendChild(
            createTrackGroup("🔴🫲 Mão Esquerda", "left-hand", leftTracks, false, handlers.onTrackChange)
        );
    }

    if (leftTracks.length > 0 && rightTracks.length > 0) {
        container.appendChild(createSeparator());
    }

    if (rightTracks.length > 0) {
        container.appendChild(
            createTrackGroup("🟢🫱 Mão Direita", "right-hand", rightTracks, true, handlers.onTrackChange)
        );
    }

    if (leftTracks.length > 0 || rightTracks.length > 0) {
        container.appendChild(createSeparator());
    }

    container.appendChild(createToleranceGroup(savedTolerance, handlers.onToleranceChange));
}

/**
 * Lê os IDs de tracks selecionados a partir do DOM.
 */
export function getSelectedTrackIds(container) {
    const radios = container.querySelectorAll("input[type=radio]:checked");
    const ids = [];
    for (const radio of radios) {
        if (radio.value && radio.name !== "tolerance") ids.push(radio.value);
    }
    return ids;
}

/**
 * Lê a tolerância selecionada em ms.
 */
export function getSelectedToleranceMs(container) {
    const selected = container.querySelector("input[name=tolerance]:checked");
    const key = selected ? selected.value : "normal";
    return TOLERANCE_LEVELS[key].ms;
}

// --- helpers internos ---

function createSeparator() {
    const sep = document.createElement("div");
    sep.className = "track-separator";
    return sep;
}

function createTrackGroup(label, groupName, tracks, selectFirst, onTrackChange) {
    const container = document.createElement("div");
    container.className = "track-group";

    const labelEl = document.createElement("span");
    labelEl.className = "track-group-label";
    labelEl.textContent = label;
    container.appendChild(labelEl);

    const optionsEl = document.createElement("div");
    optionsEl.className = "track-group-options";

    optionsEl.appendChild(createRadioOption(groupName, "", "Nenhuma", !selectFirst, onTrackChange));

    for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const checked = selectFirst && i === 0;
        const opt = createRadioOption(groupName, track.id, track.name, checked, onTrackChange);

        const diff = document.createElement("span");
        diff.className = "track-difficulty";
        diff.textContent = difficultyLabel(track.difficulty);
        opt.appendChild(diff);

        optionsEl.appendChild(opt);
    }

    container.appendChild(optionsEl);
    return container;
}

function createRadioOption(groupName, value, text, checked, onChange) {
    const label = document.createElement("label");
    label.className = "track-option";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = groupName;
    radio.value = value;
    radio.checked = checked;
    radio.addEventListener("change", onChange);

    const span = document.createElement("span");
    span.textContent = text;

    label.appendChild(radio);
    label.appendChild(span);
    return label;
}

function createToleranceGroup(savedLevel, onToleranceChange) {
    const container = document.createElement("div");
    container.className = "tolerance-group";

    const labelEl = document.createElement("span");
    labelEl.className = "tolerance-group-label";
    labelEl.textContent = "⏱ Tolerância";
    container.appendChild(labelEl);

    const optionsEl = document.createElement("div");
    optionsEl.className = "tolerance-options";

    for (const [key, level] of Object.entries(TOLERANCE_LEVELS)) {
        const label = document.createElement("label");
        label.className = "tolerance-option";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "tolerance";
        radio.value = key;
        radio.checked = key === savedLevel;
        radio.addEventListener("change", (e) => onToleranceChange(e.target.value));

        const span = document.createElement("span");
        span.textContent = level.label;

        label.appendChild(radio);
        label.appendChild(span);
        optionsEl.appendChild(label);
    }

    container.appendChild(optionsEl);
    return container;
}
