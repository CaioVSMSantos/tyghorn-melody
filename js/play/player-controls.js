/**
 * player-controls.js — Controles do player (binding + updates de DOM).
 *
 * Camada stateless que amarra eventos dos botões e lê estado do player
 * para manter disabled, labels, barra de progresso e display de acurácia.
 * Orquestração (criar/destruir player, loop de animação) fica no play-app.
 */

/**
 * Amarra listeners dos controles do player a handlers do orquestrador.
 *
 * @param {object} dom — mapa de refs DOM (btnBack, btnPlay, btnPause, btnStop,
 *   btnRestart, btnSpeedDown, btnSpeedUp, btnMidiReconnect, progressBar).
 * @param {object} handlers — { onBack, onPlay, onPause, onStop, onRestart,
 *   onSpeedChange(delta), onMidiReconnect, onSeek(ratio) }.
 */
export function bindControls(dom, handlers) {
    dom.btnBack.addEventListener("click", handlers.onBack);
    dom.btnPlay.addEventListener("click", handlers.onPlay);
    dom.btnPause.addEventListener("click", handlers.onPause);
    dom.btnStop.addEventListener("click", handlers.onStop);
    dom.btnRestart.addEventListener("click", handlers.onRestart);
    dom.btnSpeedDown.addEventListener("click", () => handlers.onSpeedChange(-0.25));
    dom.btnSpeedUp.addEventListener("click", () => handlers.onSpeedChange(0.25));
    dom.btnMidiReconnect.addEventListener("click", handlers.onMidiReconnect);

    dom.progressBar.addEventListener("click", (e) => {
        const rect = dom.progressBar.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        handlers.onSeek(ratio);
    });
}

/**
 * Atualiza disabled dos botões e o display de velocidade.
 */
export function updateControls(dom, player) {
    if (!player) return;
    const state = player.getState();
    dom.btnPlay.disabled = state.playing;
    dom.btnPause.disabled = !state.playing;
    dom.btnStop.disabled = !state.playing && state.currentTimeMs <= 0;
    dom.speedDisplay.textContent = state.speed.toFixed(2) + "x";
}

/**
 * Atualiza barra de progresso (largura %) e tempo (m:ss / m:ss).
 */
export function updateProgress(dom, player) {
    if (!player) return;
    const state = player.getState();
    const beat = Math.max(0, state.currentBeat);
    const ratio = state.totalBeats > 0 ? Math.min(1, beat / state.totalBeats) : 0;
    dom.progressFill.style.width = (ratio * 100) + "%";

    const msPerBeat = state.msPerBeat;
    const currentSec = Math.max(0, beat * msPerBeat / 1000);
    const totalSec = state.totalBeats * msPerBeat / 1000;
    dom.progressTime.textContent = formatTime(currentSec) + " / " + formatTime(totalSec);
}

/**
 * Atualiza o display "Acertos: X/Y (Z%)".
 */
export function updateAccuracy(dom, player) {
    if (!player) return;
    const { accuracy } = player.getState();
    const matched = accuracy.hits + accuracy.misses;
    dom.accuracyDisplay.textContent =
        `Acertos: ${accuracy.hits}/${matched} (${accuracy.percentage}%)`;
}

/**
 * Formata segundos como "m:ss".
 */
export function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ":" + String(s).padStart(2, "0");
}
