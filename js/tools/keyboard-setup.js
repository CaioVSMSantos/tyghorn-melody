/**
 * keyboard-setup.js — Fluxo de configuração do teclado MIDI do usuário.
 *
 * Três passos: detectar nota mais grave, mais aguda, confirmar. Mantém
 * setupState interno e roteia notas via handleNote enquanto isActive() ===
 * true. A identificação do dispositivo vem de fora (getDeviceName) pois o
 * orquestrador detém o MIDIAccess.
 */

import { noteNumberToName } from "../shared/midi.js";
import { getKeyboard, setKeyboard } from "../shared/storage.js";
import { statGrid } from "../shared/dom.js";

/**
 * Cria a instância do fluxo e amarra os listeners dos botões.
 *
 * @param {object} dom — { keyboardConfigDisplayEl, keyboardSetupFlowEl,
 *   btnStartSetup, setupStepLowEl, setupStepHighEl, setupStepConfirmEl,
 *   setupLowFeedbackEl, setupHighFeedbackEl, setupSummaryEl,
 *   btnConfirmLow, btnConfirmHigh, btnCancelSetup, btnBackToLow,
 *   btnSaveKeyboard, btnRestartSetup }
 * @param {{ getDeviceName: () => string }} deps
 */
export function createKeyboardSetup(dom, deps) {
    const setupState = {
        active: false,
        currentNote: null,
        lowNote: null,
        highNote: null,
        deviceName: null,
    };

    bindEvents();
    renderKeyboardConfigStatus();

    function renderKeyboardConfigStatus() {
        const kb = getKeyboard();
        dom.keyboardConfigDisplayEl.textContent = "";

        if (!kb) {
            const msg = document.createElement("p");
            msg.className = "text-muted";
            msg.textContent = "Nenhum teclado configurado. Use o botão abaixo para iniciar.";
            dom.keyboardConfigDisplayEl.appendChild(msg);
            dom.btnStartSetup.textContent = "Iniciar configuração";
            return;
        }

        const items = [
            { label: "Dispositivo", value: kb.deviceName },
            { label: "Nota mais grave", value: noteNumberToName(kb.lowestNote) + " (MIDI " + kb.lowestNote + ")" },
            { label: "Nota mais aguda", value: noteNumberToName(kb.highestNote) + " (MIDI " + kb.highestNote + ")" },
            { label: "Total de teclas", value: kb.totalKeys + " teclas" },
            { label: "Configurado em", value: new Date(kb.configuredAt).toLocaleDateString("pt-BR") },
        ];

        dom.keyboardConfigDisplayEl.appendChild(statGrid(items));
        dom.btnStartSetup.textContent = "Reconfigurar teclado";
    }

    function showStep(step) {
        dom.setupStepLowEl.style.display = step === "low" ? "" : "none";
        dom.setupStepHighEl.style.display = step === "high" ? "" : "none";
        dom.setupStepConfirmEl.style.display = step === "confirm" ? "" : "none";
    }

    function startSetup() {
        setupState.active = true;
        setupState.currentNote = null;
        setupState.lowNote = null;
        setupState.highNote = null;
        setupState.deviceName = null;

        dom.setupLowFeedbackEl.innerHTML = '<span class="text-muted">Aguardando...</span>';
        dom.setupHighFeedbackEl.innerHTML = '<span class="text-muted">Aguardando...</span>';
        dom.btnConfirmLow.disabled = true;
        dom.btnConfirmHigh.disabled = true;

        dom.keyboardSetupFlowEl.style.display = "";
        showStep("low");

        dom.keyboardSetupFlowEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function cancelSetup() {
        setupState.active = false;
        setupState.currentNote = null;
        dom.keyboardSetupFlowEl.style.display = "none";
    }

    /**
     * Consome um evento MIDI enquanto o fluxo está ativo.
     * Retorna true se o evento foi consumido (não deve ir ao monitor).
     */
    function handleNote(noteEvent) {
        if (noteEvent.type !== "on") return false;

        const onLowStep = dom.setupStepLowEl.style.display !== "none";
        const noteName = noteNumberToName(noteEvent.noteNumber);

        setupState.currentNote = { noteNumber: noteEvent.noteNumber, name: noteName };

        if (onLowStep) {
            renderNoteFeedback(dom.setupLowFeedbackEl, noteEvent.noteNumber, noteName);
            dom.btnConfirmLow.disabled = false;
        } else {
            renderNoteFeedback(dom.setupHighFeedbackEl, noteEvent.noteNumber, noteName);
            dom.btnConfirmHigh.disabled = false;
        }

        return true;
    }

    function renderNoteFeedback(feedbackEl, noteNumber, noteName) {
        feedbackEl.textContent = "";

        const noteDisplay = document.createElement("div");
        noteDisplay.className = "setup-note-display";

        const nameSpan = document.createElement("span");
        nameSpan.className = "setup-note-name";
        nameSpan.textContent = noteName;

        const midiSpan = document.createElement("span");
        midiSpan.className = "setup-note-midi";
        midiSpan.textContent = "MIDI " + noteNumber;

        noteDisplay.appendChild(nameSpan);
        noteDisplay.appendChild(midiSpan);
        feedbackEl.appendChild(noteDisplay);
    }

    function renderSummary(lowNote, highNote, deviceName) {
        dom.setupSummaryEl.textContent = "";

        const items = [
            { label: "Dispositivo", value: deviceName || "Desconhecido" },
            { label: "Nota mais grave", value: lowNote.name + " (MIDI " + lowNote.noteNumber + ")" },
            { label: "Nota mais aguda", value: highNote.name + " (MIDI " + highNote.noteNumber + ")" },
            { label: "Total de teclas", value: (highNote.noteNumber - lowNote.noteNumber + 1) + " teclas" },
        ];

        // setupSummaryEl já possui classe .stats-grid no CSS; usamos statGrid
        // mas anexamos apenas os stat-items (dispensando o wrapper duplicado).
        const grid = statGrid(items);
        while (grid.firstChild) dom.setupSummaryEl.appendChild(grid.firstChild);
    }

    function bindEvents() {
        dom.btnStartSetup.addEventListener("click", startSetup);
        dom.btnCancelSetup.addEventListener("click", cancelSetup);
        dom.btnRestartSetup.addEventListener("click", startSetup);

        dom.btnConfirmLow.addEventListener("click", () => {
            if (!setupState.currentNote) return;
            setupState.lowNote = setupState.currentNote;
            setupState.currentNote = null;
            dom.btnConfirmHigh.disabled = true;
            dom.setupHighFeedbackEl.innerHTML = '<span class="text-muted">Aguardando...</span>';
            showStep("high");
        });

        dom.btnBackToLow.addEventListener("click", () => {
            setupState.highNote = null;
            setupState.currentNote = null;

            if (setupState.lowNote) {
                renderNoteFeedback(dom.setupLowFeedbackEl, setupState.lowNote.noteNumber, setupState.lowNote.name);
                dom.btnConfirmLow.disabled = false;
            } else {
                dom.setupLowFeedbackEl.innerHTML = '<span class="text-muted">Aguardando...</span>';
                dom.btnConfirmLow.disabled = true;
            }

            showStep("low");
        });

        dom.btnConfirmHigh.addEventListener("click", () => {
            if (!setupState.currentNote) return;
            setupState.highNote = setupState.currentNote;
            setupState.currentNote = null;
            setupState.deviceName = deps.getDeviceName();
            renderSummary(setupState.lowNote, setupState.highNote, setupState.deviceName);
            showStep("confirm");
        });

        dom.btnSaveKeyboard.addEventListener("click", () => {
            if (!setupState.lowNote || !setupState.highNote) return;

            setKeyboard({
                lowestNote: setupState.lowNote.noteNumber,
                highestNote: setupState.highNote.noteNumber,
                deviceName: setupState.deviceName,
            });

            cancelSetup();
            renderKeyboardConfigStatus();
        });
    }

    return {
        handleNote,
        isActive: () => setupState.active,
    };
}
