/**
 * storage.js — Módulo de persistência localStorage
 *
 * Chave única: "tyghorn-melody"
 * Estrutura: { keyboard, preferences, progress }
 * Validação na leitura — dados corrompidos são tratados como inexistentes.
 */

const STORAGE_KEY = "tyghorn-melody";

const DEFAULT_DATA = {
    keyboard: null,
    preferences: {
        defaultSpeed: 1.0,
        showNoteNames: true,
    },
    progress: {},
};

function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return structuredClone(DEFAULT_DATA);

        const data = JSON.parse(raw);
        if (typeof data !== "object" || data === null) return structuredClone(DEFAULT_DATA);
        if (!data.preferences || typeof data.preferences !== "object") {
            data.preferences = { ...DEFAULT_DATA.preferences };
        }
        if (!data.progress || typeof data.progress !== "object") {
            data.progress = {};
        }
        return data;
    } catch {
        return structuredClone(DEFAULT_DATA);
    }
}

function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getKeyboard() {
    return load().keyboard;
}

function setKeyboard(config) {
    const data = load();
    data.keyboard = {
        lowestNote: config.lowestNote,
        highestNote: config.highestNote,
        totalKeys: config.highestNote - config.lowestNote + 1,
        deviceName: config.deviceName || "Desconhecido",
        configuredAt: new Date().toISOString(),
    };
    save(data);
    return data.keyboard;
}

function getPreferences() {
    return load().preferences;
}

function setPreference(key, value) {
    const data = load();
    data.preferences[key] = value;
    save(data);
}

function getProgress(songId) {
    return load().progress[songId] || null;
}

function updateProgress(songId, accuracy, tracksPlayed) {
    const data = load();
    const existing = data.progress[songId];

    data.progress[songId] = {
        bestAccuracy: existing ? Math.max(existing.bestAccuracy, accuracy) : accuracy,
        timesPlayed: existing ? existing.timesPlayed + 1 : 1,
        lastPlayed: new Date().toISOString().split("T")[0],
        tracksPlayed: tracksPlayed,
    };

    save(data);
    return data.progress[songId];
}

function clearProgress() {
    const data = load();
    data.progress = {};
    save(data);
}

function resetAll() {
    localStorage.removeItem(STORAGE_KEY);
}

export {
    getKeyboard,
    setKeyboard,
    getPreferences,
    setPreference,
    getProgress,
    updateProgress,
    clearProgress,
    resetAll,
};
