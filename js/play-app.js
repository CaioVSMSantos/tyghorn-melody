/**
 * play-app.js — Orquestração da página de Prática
 *
 * Gerencia catálogo vs player, seleção de tracks por mão (radio groups),
 * conexão MIDI com status/reconexão, seek bar e controles.
 */

import * as storage from "./storage.js";
import { loadCatalog, loadSong } from "./song-loader.js";
import { createPlayer } from "./player.js";
import { createRenderer } from "./renderer.js";
import { isSupported as midiSupported, requestAccess, getInputDevices, listenToInputs, onStateChange } from "./midi.js";

const SONGS_BASE = "../songs";

const TOLERANCE_LEVELS = {
    easy: { label: "Fácil", ms: 1000 },
    normal: { label: "Médio", ms: 500 },
    precise: { label: "Preciso", ms: 250 },
};

// --- DOM ---
const viewCatalog = document.getElementById("view-catalog");
const viewPlayer = document.getElementById("view-player");
const songListEl = document.getElementById("song-list");
const songInfoEl = document.getElementById("song-info");
const trackSelectionEl = document.getElementById("track-selection");
const canvas = document.getElementById("game-canvas");
const btnBack = document.getElementById("btn-back");
const btnPlay = document.getElementById("btn-play");
const btnPause = document.getElementById("btn-pause");
const btnStop = document.getElementById("btn-stop");
const btnRestart = document.getElementById("btn-restart");
const btnSpeedDown = document.getElementById("btn-speed-down");
const btnSpeedUp = document.getElementById("btn-speed-up");
const speedDisplay = document.getElementById("speed-display");
const accuracyDisplay = document.getElementById("accuracy-display");
const midiStatusEl = document.getElementById("midi-status");
const btnMidiReconnect = document.getElementById("btn-midi-reconnect");
const rangeWarning = document.getElementById("range-warning");
const progressBar = document.getElementById("progress-bar");
const progressFill = document.getElementById("progress-fill");
const progressTime = document.getElementById("progress-time");

// --- Estado ---
let midiAccess = null;
let player = null;
let renderer = null;
let animationId = null;
let catalog = null;
let currentSong = null;

// --- Inicialização ---

async function init() {
    await initMidi();
    await showCatalog();
    bindEvents();
}

async function initMidi() {
    if (!midiSupported()) {
        updateMidiStatus(false);
        return;
    }
    try {
        midiAccess = await requestAccess();
        onStateChange(midiAccess, () => {
            connectMidiToPlayer();
            updateMidiStatus(true);
        });
        updateMidiStatus(true);
    } catch {
        updateMidiStatus(false);
    }
}

async function reconnectMidi() {
    try {
        midiAccess = await requestAccess();
        onStateChange(midiAccess, () => {
            connectMidiToPlayer();
            updateMidiStatus(true);
        });
        connectMidiToPlayer();
        updateMidiStatus(true);
    } catch {
        updateMidiStatus(false);
    }
}

function updateMidiStatus(available) {
    if (!midiStatusEl) return;
    midiStatusEl.textContent = "";

    if (!available || !midiAccess) {
        const indicator = document.createElement("span");
        indicator.className = "midi-indicator midi-off";
        indicator.textContent = "🔴 Sem MIDI";
        midiStatusEl.appendChild(indicator);
        return;
    }

    const devices = getInputDevices(midiAccess);
    const connected = devices.filter(d => d.state === "connected");

    const indicator = document.createElement("span");
    if (connected.length > 0) {
        indicator.className = "midi-indicator midi-on";
        indicator.textContent = "🟢 " + connected[0].name;
    } else {
        indicator.className = "midi-indicator midi-off";
        indicator.textContent = "🟡 Nenhum dispositivo";
    }
    midiStatusEl.appendChild(indicator);
}

function connectMidiToPlayer() {
    if (!midiAccess) return;
    listenToInputs(midiAccess, (event) => {
        if (event.type === "on" && player) {
            player.handleNoteOn(event.noteNumber);
        }
    });
}

function bindEvents() {
    btnBack.addEventListener("click", () => {
        if (player && player.getState().playing) player.pause();
        showCatalog();
    });
    btnPlay.addEventListener("click", onPlay);
    btnPause.addEventListener("click", onPause);
    btnStop.addEventListener("click", onStop);
    btnRestart.addEventListener("click", onRestart);
    btnSpeedDown.addEventListener("click", () => changeSpeed(-0.25));
    btnSpeedUp.addEventListener("click", () => changeSpeed(0.25));
    btnMidiReconnect.addEventListener("click", reconnectMidi);

    // Seek bar click
    progressBar.addEventListener("click", (e) => {
        if (!player) return;
        const rect = progressBar.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const state = player.getState();
        const targetBeat = ratio * state.totalBeats;
        player.seek(targetBeat);
        renderFrame(performance.now());
    });
}

// --- Catálogo ---

async function showCatalog() {
    stopGame();
    currentSong = null;
    viewCatalog.hidden = false;
    viewPlayer.hidden = true;
    btnBack.hidden = true;
    window.scrollTo(0, 0);
    viewCatalog.scrollTop = 0;

    if (!catalog) {
        try {
            catalog = await loadCatalog(SONGS_BASE);
        } catch (error) {
            songListEl.textContent = "";
            const msg = document.createElement("p");
            msg.className = "text-pink";
            msg.textContent = "Erro ao carregar catálogo: " + error.message;
            songListEl.appendChild(msg);
            return;
        }
    }

    renderCatalog();
}

function renderCatalog() {
    songListEl.textContent = "";
    const keyboard = storage.getKeyboard();

    const byCategory = {};
    for (const song of catalog.songs) {
        if (!byCategory[song.category]) byCategory[song.category] = [];
        byCategory[song.category].push(song);
    }

    const categoryLabels = {
        games: "🎮 Games",
        animes: "🌸 Animes",
        movies: "🎬 Movies",
        artists: "🎤 Artistas",
    };

    for (const [category, songs] of Object.entries(byCategory)) {
        const section = document.createElement("div");
        section.className = "catalog-section";

        const heading = document.createElement("h2");
        heading.textContent = categoryLabels[category] || category;
        section.appendChild(heading);

        for (const song of songs) {
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

            const progress = storage.getProgress(song.id);
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

            const diffBadge = document.createElement("span");
            diffBadge.className = "badge badge-" + difficultyBadgeClass(song.difficulty);
            diffBadge.textContent = difficultyLabel(song.difficulty);
            metaEl.appendChild(diffBadge);

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
            card.addEventListener("click", () => selectSong(song));
            section.appendChild(card);
        }

        songListEl.appendChild(section);
    }
}

function difficultyLabel(d) {
    return { beginner: "Iniciante", intermediate: "Intermediário", advanced: "Avançado" }[d] || d;
}

function difficultyBadgeClass(d) {
    return { beginner: "success", intermediate: "warn", advanced: "error" }[d] || "warn";
}

// --- Seleção de Música ---

async function selectSong(songEntry) {
    try {
        currentSong = await loadSong(SONGS_BASE, songEntry.file);
    } catch (error) {
        alert("Erro ao carregar música:\n" + error.message);
        return;
    }

    viewCatalog.hidden = true;
    viewPlayer.hidden = false;
    btnBack.hidden = false;

    renderSongInfo();
    renderTrackSelection();
    checkRangeCompatibility();
    initPlayer();
}

function renderSongInfo() {
    songInfoEl.textContent = "";

    const title = document.createElement("span");
    title.className = "player-song-title";
    title.textContent = currentSong.title;

    const detail = document.createElement("span");
    detail.className = "player-song-detail";
    detail.textContent = `${currentSong.artist} · ${currentSong.bpm} BPM`;

    songInfoEl.appendChild(title);
    songInfoEl.appendChild(detail);
}

function renderTrackSelection() {
    trackSelectionEl.textContent = "";

    const leftTracks = currentSong.tracks.filter(t => t.hand === "left");
    const rightTracks = currentSong.tracks.filter(t => t.hand === "right");

    // Mão esquerda à esquerda
    if (leftTracks.length > 0) {
        trackSelectionEl.appendChild(
            createTrackGroup("🔴🫲 Mão Esquerda", "left-hand", leftTracks, false)
        );
    }

    // Separador
    if (leftTracks.length > 0 && rightTracks.length > 0) {
        const sep = document.createElement("div");
        sep.className = "track-separator";
        trackSelectionEl.appendChild(sep);
    }

    // Mão direita à direita (primeira selecionada por padrão)
    if (rightTracks.length > 0) {
        trackSelectionEl.appendChild(
            createTrackGroup("🟢🫱 Mão Direita", "right-hand", rightTracks, true)
        );
    }

    // Separador antes da tolerância
    if (leftTracks.length > 0 || rightTracks.length > 0) {
        const sep = document.createElement("div");
        sep.className = "track-separator";
        trackSelectionEl.appendChild(sep);
    }

    // Controle de tolerância
    trackSelectionEl.appendChild(createToleranceGroup());
}

function createTrackGroup(label, groupName, tracks, selectFirst) {
    const container = document.createElement("div");
    container.className = "track-group";

    const labelEl = document.createElement("span");
    labelEl.className = "track-group-label";
    labelEl.textContent = label;
    container.appendChild(labelEl);

    const optionsEl = document.createElement("div");
    optionsEl.className = "track-group-options";

    // Opção "Nenhuma"
    optionsEl.appendChild(createRadioOption(groupName, "", "Nenhuma", !selectFirst));

    for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const checked = selectFirst && i === 0;
        const opt = createRadioOption(groupName, track.id, track.name, checked);

        const diff = document.createElement("span");
        diff.className = "track-difficulty";
        diff.textContent = difficultyLabel(track.difficulty);
        opt.appendChild(diff);

        optionsEl.appendChild(opt);
    }

    container.appendChild(optionsEl);
    return container;
}

function createRadioOption(groupName, value, text, checked) {
    const label = document.createElement("label");
    label.className = "track-option";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = groupName;
    radio.value = value;
    radio.checked = checked;
    radio.addEventListener("change", onTrackChange);

    const span = document.createElement("span");
    span.textContent = text;

    label.appendChild(radio);
    label.appendChild(span);
    return label;
}

function checkRangeCompatibility() {
    const keyboard = storage.getKeyboard();
    rangeWarning.hidden = true;
    if (!keyboard) return;

    const out =
        currentSong.midiRange.lowest < keyboard.lowestNote ||
        currentSong.midiRange.highest > keyboard.highestNote;
    if (out) rangeWarning.hidden = false;
}

function getSelectedTrackIds() {
    const radios = trackSelectionEl.querySelectorAll("input[type=radio]:checked");
    const ids = [];
    for (const radio of radios) {
        if (radio.value) ids.push(radio.value);
    }
    return ids;
}

function createToleranceGroup() {
    const savedLevel = storage.getPreferences().tolerance || "normal";

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
        radio.addEventListener("change", onToleranceChange);

        const span = document.createElement("span");
        span.textContent = level.label;

        label.appendChild(radio);
        label.appendChild(span);
        optionsEl.appendChild(label);
    }

    container.appendChild(optionsEl);
    return container;
}

function getSelectedToleranceMs() {
    const selected = trackSelectionEl.querySelector("input[name=tolerance]:checked");
    const key = selected ? selected.value : "normal";
    return TOLERANCE_LEVELS[key].ms;
}

function onToleranceChange(e) {
    const key = e.target.value;
    storage.setPreference("tolerance", key);
    if (player) {
        player.setTolerance(TOLERANCE_LEVELS[key].ms);
    }
}

// --- Player ---

function initPlayer() {
    const trackIds = getSelectedTrackIds();
    const toleranceMs = getSelectedToleranceMs();

    player = createPlayer(currentSong, trackIds, { toleranceMs });
    renderer = createRenderer(canvas, {
        showNoteNames: storage.getPreferences().showNoteNames,
    });
    // Range fixo de 61 teclas (C2-C7) — futuro: auto-ajustar ao teclado conectado
    renderer.setMidiRange({ lowest: 36, highest: 96 });
    renderer.resize();
    connectMidiToPlayer();
    updateControls();
    updateProgress();
    renderFrame(performance.now());
}

function onTrackChange() {
    if (player && player.getState().playing) player.stop();
    initPlayer();
}

function onPlay() {
    if (!player) return;
    player.play();
    updateControls();
    animationId = requestAnimationFrame(renderFrame);
}

function onPause() {
    if (!player) return;
    player.pause();
    updateControls();
}

function onStop() {
    if (!player) return;
    player.stop();
    updateControls();
    updateProgress();
    renderFrame(performance.now());
}

function onRestart() {
    if (!player) return;
    player.restart();
    updateControls();
    animationId = requestAnimationFrame(renderFrame);
}

function changeSpeed(delta) {
    if (!player) return;
    const current = player.getState().speed;
    player.setSpeed(current + delta);
    updateControls();
}

function stopGame() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    player = null;
    renderer = null;
}

function updateControls() {
    if (!player) return;
    const state = player.getState();
    btnPlay.disabled = state.playing;
    btnPause.disabled = !state.playing;
    btnStop.disabled = !state.playing && state.currentTimeMs <= 0;
    speedDisplay.textContent = state.speed.toFixed(2) + "x";
}

function updateAccuracy() {
    if (!player) return;
    const { accuracy } = player.getState();
    const matched = accuracy.hits + accuracy.misses;
    accuracyDisplay.textContent =
        `Acertos: ${accuracy.hits}/${matched} (${accuracy.percentage}%)`;
}

function updateProgress() {
    if (!player) return;
    const state = player.getState();
    const beat = Math.max(0, state.currentBeat);
    const ratio = Math.min(1, beat / state.totalBeats);
    progressFill.style.width = (ratio * 100) + "%";

    const msPerBeatVal = state.msPerBeat;
    const currentSec = Math.max(0, beat * msPerBeatVal / 1000);
    const totalSec = state.totalBeats * msPerBeatVal / 1000;
    progressTime.textContent = formatTime(currentSec) + " / " + formatTime(totalSec);
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ":" + String(s).padStart(2, "0");
}

function renderFrame(timestamp) {
    if (!player || !renderer) return;

    player.update(timestamp);
    const state = player.getState();
    renderer.render(state);
    updateAccuracy();
    updateProgress();

    if (state.finished) {
        updateControls();
        const trackIds = getSelectedTrackIds();
        if (trackIds.length > 0) {
            storage.updateProgress(currentSong.id, state.accuracy.percentage, trackIds);
        }
        return;
    }

    if (state.playing) {
        animationId = requestAnimationFrame(renderFrame);
    }
}

// --- Resize ---
window.addEventListener("resize", () => {
    if (renderer) renderer.resize();
});

// --- Start ---
init();
