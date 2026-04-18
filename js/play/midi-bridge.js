/**
 * midi-bridge.js — Ponte entre Web MIDI API e o player.
 *
 * Encapsula estado da MIDIAccess, expõe initMidi/reconnectMidi e repassa
 * eventos note-on ao player atual via getter (para acompanhar o player
 * recriado a cada troca de música).
 */

import {
    isSupported as midiSupported,
    requestAccess,
    getInputDevices,
    listenToInputs,
    onStateChange,
} from "../shared/midi.js";

/**
 * Cria uma ponte MIDI que mantém sua própria referência à MIDIAccess.
 *
 * @param {HTMLElement} statusEl    — contêiner onde o indicador visual será renderizado
 * @param {() => object|null} getPlayer — getter do player ativo (para repassar note-on)
 * @returns {{ init: Function, reconnect: Function, connectToPlayer: Function, updateStatus: Function }}
 */
export function createMidiBridge(statusEl, getPlayer) {
    let midiAccess = null;

    async function init() {
        if (!midiSupported()) {
            updateStatus(false);
            return;
        }
        try {
            midiAccess = await requestAccess();
            onStateChange(midiAccess, () => {
                connectToPlayer();
                updateStatus(true);
            });
            updateStatus(true);
        } catch {
            updateStatus(false);
        }
    }

    async function reconnect() {
        try {
            midiAccess = await requestAccess();
            onStateChange(midiAccess, () => {
                connectToPlayer();
                updateStatus(true);
            });
            connectToPlayer();
            updateStatus(true);
        } catch {
            updateStatus(false);
        }
    }

    function connectToPlayer() {
        if (!midiAccess) return;
        listenToInputs(midiAccess, (event) => {
            const player = getPlayer();
            if (event.type === "on" && player) {
                player.handleNoteOn(event.noteNumber);
            }
        });
    }

    function updateStatus(available) {
        if (!statusEl) return;
        statusEl.textContent = "";

        if (!available || !midiAccess) {
            const indicator = document.createElement("span");
            indicator.className = "midi-indicator midi-off";
            indicator.textContent = "🔴 Sem MIDI";
            statusEl.appendChild(indicator);
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
        statusEl.appendChild(indicator);
    }

    return { init, reconnect, connectToPlayer, updateStatus };
}
