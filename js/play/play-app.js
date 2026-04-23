/**
 * play-app.js — Orquestrador da página de Prática.
 *
 * Compõe os módulos do feature (player, renderer, midi-bridge, catalog-view,
 * track-selection, player-controls) em um único app via factory createPlayApp.
 * Aqui ficam apenas: estado do app, wiring entre módulos e loop de animação.
 */

import * as storage from "../shared/storage.js";
import { showMobileWarning } from "../shared/mobile-warning.js";
import { loadCatalog, loadSong } from "./song-loader.js";
import { createPlayer } from "./player.js";
import { createRenderer } from "./renderer.js";
import { createMidiBridge } from "./midi-bridge.js";
import { renderCatalog } from "./catalog-view.js";
import {
    TOLERANCE_LEVELS,
    renderTrackSelection,
    getSelectedTrackIds,
    getSelectedToleranceMs,
} from "./track-selection.js";
import {
    bindControls,
    updateControls,
    updateProgress,
    updateAccuracy,
} from "./player-controls.js";

const SONGS_BASE = "../content/songs";

function createPlayApp() {
    // --- DOM refs ---
    const dom = {
        viewCatalog: document.getElementById("view-catalog"),
        viewPlayer: document.getElementById("view-player"),
        songListEl: document.getElementById("song-list"),
        songInfoEl: document.getElementById("song-info"),
        trackSelectionEl: document.getElementById("track-selection"),
        canvas: document.getElementById("game-canvas"),
        btnBack: document.getElementById("btn-back"),
        btnPlay: document.getElementById("btn-play"),
        btnPause: document.getElementById("btn-pause"),
        btnStop: document.getElementById("btn-stop"),
        btnRestart: document.getElementById("btn-restart"),
        btnSpeedDown: document.getElementById("btn-speed-down"),
        btnSpeedUp: document.getElementById("btn-speed-up"),
        speedDisplay: document.getElementById("speed-display"),
        accuracyDisplay: document.getElementById("accuracy-display"),
        midiStatusEl: document.getElementById("midi-status"),
        btnMidiReconnect: document.getElementById("btn-midi-reconnect"),
        rangeWarning: document.getElementById("range-warning"),
        progressBar: document.getElementById("progress-bar"),
        progressFill: document.getElementById("progress-fill"),
        progressTime: document.getElementById("progress-time"),
    };

    // --- Estado ---
    let player = null;
    let renderer = null;
    let animationId = null;
    let catalog = null;
    let currentSong = null;

    const midi = createMidiBridge(dom.midiStatusEl, () => player);

    // --- Inicialização ---

    async function init() {
        showMobileWarning({
            message: "A Prática requer teclado MIDI físico e tela maior — recomendamos usar um desktop. Continuar mesmo assim?",
            sessionKey: "tyghorn-melody:mobile-warning-dismissed:play",
        });
        await midi.init();
        await showCatalog();
        bindControls(dom, {
            onBack: handleBack,
            onPlay: handlePlay,
            onPause: handlePause,
            onStop: handleStop,
            onRestart: handleRestart,
            onSpeedChange: handleSpeedChange,
            onMidiReconnect: midi.reconnect,
            onSeek: handleSeek,
        });
        window.addEventListener("resize", () => {
            if (renderer) renderer.resize();
        });
    }

    // --- Catálogo ---

    async function showCatalog() {
        stopGame();
        currentSong = null;
        dom.viewCatalog.hidden = false;
        dom.viewPlayer.hidden = true;
        dom.btnBack.hidden = true;
        window.scrollTo(0, 0);
        dom.viewCatalog.scrollTop = 0;

        if (!catalog) {
            try {
                catalog = await loadCatalog(SONGS_BASE);
            } catch (error) {
                dom.songListEl.textContent = "";
                const msg = document.createElement("p");
                msg.className = "text-pink";
                msg.textContent = "Erro ao carregar catálogo: " + error.message;
                dom.songListEl.appendChild(msg);
                return;
            }
        }

        renderCatalog(
            dom.songListEl,
            catalog,
            storage.getKeyboard(),
            (songId) => storage.getProgress(songId),
            selectSong,
        );
    }

    // --- Seleção de Música ---

    async function selectSong(songEntry) {
        try {
            currentSong = await loadSong(SONGS_BASE, songEntry.file);
        } catch (error) {
            alert("Erro ao carregar música:\n" + error.message);
            return;
        }

        dom.viewCatalog.hidden = true;
        dom.viewPlayer.hidden = false;
        dom.btnBack.hidden = false;

        renderSongInfo();

        const savedTolerance = storage.getPreferences().tolerance || "normal";
        renderTrackSelection(dom.trackSelectionEl, currentSong, savedTolerance, {
            onTrackChange: handleTrackChange,
            onToleranceChange: handleToleranceChange,
        });

        checkRangeCompatibility();
        initPlayer();
    }

    function renderSongInfo() {
        dom.songInfoEl.textContent = "";

        const title = document.createElement("span");
        title.className = "player-song-title";
        title.textContent = currentSong.title;

        const detail = document.createElement("span");
        detail.className = "player-song-detail";
        detail.textContent = `${currentSong.artist} · ${currentSong.bpm} BPM`;

        dom.songInfoEl.appendChild(title);
        dom.songInfoEl.appendChild(detail);
    }

    function checkRangeCompatibility() {
        const keyboard = storage.getKeyboard();
        dom.rangeWarning.hidden = true;
        if (!keyboard) return;

        const out =
            currentSong.midiRange.lowest < keyboard.lowestNote ||
            currentSong.midiRange.highest > keyboard.highestNote;
        if (out) dom.rangeWarning.hidden = false;
    }

    // --- Player ---

    function initPlayer() {
        const trackIds = getSelectedTrackIds(dom.trackSelectionEl);
        const toleranceMs = getSelectedToleranceMs(dom.trackSelectionEl);

        player = createPlayer(currentSong, trackIds, { toleranceMs });
        renderer = createRenderer(dom.canvas, {
            showNoteNames: storage.getPreferences().showNoteNames,
        });
        // Range fixo de 61 teclas (C2-C7) — futuro: auto-ajustar ao teclado conectado
        renderer.setMidiRange({ lowest: 36, highest: 96 });
        renderer.resize();
        midi.connectToPlayer();
        updateControls(dom, player);
        updateProgress(dom, player);
        renderFrame(performance.now());
    }

    function stopGame() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        player = null;
        renderer = null;
    }

    // --- Handlers ---

    function handleBack() {
        if (player && player.getState().playing) player.pause();
        showCatalog();
    }

    function handlePlay() {
        if (!player) return;
        player.play();
        updateControls(dom, player);
        animationId = requestAnimationFrame(renderFrame);
    }

    function handlePause() {
        if (!player) return;
        player.pause();
        updateControls(dom, player);
    }

    function handleStop() {
        if (!player) return;
        player.stop();
        updateControls(dom, player);
        updateProgress(dom, player);
        renderFrame(performance.now());
    }

    function handleRestart() {
        if (!player) return;
        player.restart();
        updateControls(dom, player);
        animationId = requestAnimationFrame(renderFrame);
    }

    function handleSpeedChange(delta) {
        if (!player) return;
        const current = player.getState().speed;
        player.setSpeed(current + delta);
        updateControls(dom, player);
    }

    function handleSeek(ratio) {
        if (!player) return;
        const state = player.getState();
        const targetBeat = ratio * state.totalBeats;
        player.seek(targetBeat);
        renderFrame(performance.now());
    }

    function handleTrackChange() {
        if (player && player.getState().playing) player.stop();
        initPlayer();
    }

    function handleToleranceChange(key) {
        storage.setPreference("tolerance", key);
        if (player) {
            player.setTolerance(TOLERANCE_LEVELS[key].ms);
        }
    }

    // --- Loop ---

    function renderFrame(timestamp) {
        if (!player || !renderer) return;

        player.update(timestamp);
        const state = player.getState();
        renderer.render(state);
        updateAccuracy(dom, player);
        updateProgress(dom, player);

        if (state.finished) {
            updateControls(dom, player);
            const trackIds = getSelectedTrackIds(dom.trackSelectionEl);
            if (trackIds.length > 0) {
                storage.updateProgress(currentSong.id, state.accuracy.percentage, trackIds);
            }
            return;
        }

        if (state.playing) {
            animationId = requestAnimationFrame(renderFrame);
        }
    }

    return { init };
}

// --- Start ---
createPlayApp().init();
