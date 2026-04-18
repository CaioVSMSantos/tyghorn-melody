/**
 * tools.js — Orquestrador da página de Ferramentas.
 *
 * Compõe três sub-apps: monitor MIDI, configuração de teclado e gerenciamento
 * de dados. Detém o MIDIAccess e roteia notas — setup consome primeiro, se
 * ativo; caso contrário, vão para o monitor.
 */

import {
    isSupported,
    requestAccess,
    getInputDevices,
    onStateChange,
    listenToInputs,
} from "../shared/midi.js";

import { createMidiMonitor } from "./midi-monitor.js";
import { createKeyboardSetup } from "./keyboard-setup.js";
import { bindDataManagement } from "./data-management.js";

function createToolsApp() {
    const dom = {
        // Monitor
        browserStatusEl: document.getElementById("browser-status"),
        devicesContainerEl: document.getElementById("devices-container"),
        noteLogEl: document.getElementById("note-log"),
        btnClearLog: document.getElementById("btn-clear-log"),
        sessionStatsEl: document.getElementById("session-stats"),

        // Keyboard setup
        keyboardConfigDisplayEl: document.getElementById("keyboard-config-display"),
        keyboardSetupFlowEl: document.getElementById("keyboard-setup-flow"),
        btnStartSetup: document.getElementById("btn-start-keyboard-setup"),
        setupStepLowEl: document.getElementById("setup-step-low"),
        setupStepHighEl: document.getElementById("setup-step-high"),
        setupStepConfirmEl: document.getElementById("setup-step-confirm"),
        setupLowFeedbackEl: document.getElementById("setup-low-feedback"),
        setupHighFeedbackEl: document.getElementById("setup-high-feedback"),
        setupSummaryEl: document.getElementById("setup-summary"),
        btnConfirmLow: document.getElementById("btn-confirm-low"),
        btnConfirmHigh: document.getElementById("btn-confirm-high"),
        btnCancelSetup: document.getElementById("btn-cancel-setup"),
        btnBackToLow: document.getElementById("btn-back-to-low"),
        btnSaveKeyboard: document.getElementById("btn-save-keyboard"),
        btnRestartSetup: document.getElementById("btn-restart-setup"),

        // Data management
        btnClearProgress: document.getElementById("btn-clear-progress"),
        btnResetAll: document.getElementById("btn-reset-all"),
    };

    let midiAccess = null;

    const monitor = createMidiMonitor(dom);
    const setup = createKeyboardSetup(dom, {
        getDeviceName: getFirstConnectedDeviceName,
    });
    bindDataManagement(dom);

    function getFirstConnectedDeviceName() {
        if (!midiAccess) return "Desconhecido";
        for (const input of midiAccess.inputs.values()) {
            if (input.state === "connected") return input.name || "Desconhecido";
        }
        return "Desconhecido";
    }

    function onMidiNote(noteEvent) {
        if (setup.isActive() && setup.handleNote(noteEvent)) return;
        monitor.addNoteEntry(noteEvent);
    }

    async function init() {
        monitor.renderBrowserStatus(isSupported());

        if (!isSupported()) {
            monitor.renderUnsupportedMessage();
            return;
        }

        try {
            midiAccess = await requestAccess();
            monitor.renderDevices(getInputDevices(midiAccess));

            onStateChange(midiAccess, (updated) => {
                midiAccess = updated;
                monitor.renderDevices(getInputDevices(updated));
                listenToInputs(updated, onMidiNote);
            });

            listenToInputs(midiAccess, onMidiNote);
        } catch {
            monitor.renderAccessDenied();
        }
    }

    return { init };
}

createToolsApp().init();
