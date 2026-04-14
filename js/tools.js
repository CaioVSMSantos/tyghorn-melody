/**
 * tools.js — Lógica da página de Ferramentas
 *
 * Seções:
 * 1. Monitor de Teclas MIDI
 * 2. Configuração de Teclado
 * 3. Roteador MIDI + Inicialização
 * 4. Gerenciamento de Dados
 */

import {
    isSupported,
    requestAccess,
    getInputDevices,
    onStateChange,
    listenToInputs,
    noteNumberToName,
} from "./midi.js";

import { clearProgress, resetAll, getKeyboard, setKeyboard } from "./storage.js";

// =============================================================================
// 1. Monitor de Teclas MIDI
// =============================================================================

const MAX_LOG_ENTRIES = 50;

const browserStatusEl = document.getElementById("browser-status");
const devicesContainerEl = document.getElementById("devices-container");
const noteLogEl = document.getElementById("note-log");
const btnClearLog = document.getElementById("btn-clear-log");
const sessionStatsEl = document.getElementById("session-stats");

let logEntries = 0;

const stats = {
    noteCount: 0,
    lowestNote: null,
    highestNote: null,
};

function renderBrowserStatus(supported) {
    browserStatusEl.textContent = "";

    const badge = document.createElement("span");
    badge.className = supported ? "badge badge-success" : "badge badge-error";
    badge.textContent = supported
        ? "✅ Web MIDI API suportada"
        : "❌ Web MIDI API não suportada";
    browserStatusEl.appendChild(badge);

    if (!supported) {
        const hint = document.createElement("p");
        hint.className = "text-muted panel-hint";
        hint.textContent = "Use o Google Chrome ou Microsoft Edge para acessar esta funcionalidade.";
        browserStatusEl.appendChild(hint);
    }
}

function renderDevices(devices) {
    devicesContainerEl.textContent = "";

    if (devices.length === 0) {
        const msg = document.createElement("p");
        msg.className = "text-muted";
        msg.textContent = "Nenhum dispositivo MIDI detectado. Conecte um teclado via cabo USB-MIDI.";
        devicesContainerEl.appendChild(msg);
        return;
    }

    const list = document.createElement("ul");
    list.className = "device-list";

    for (const device of devices) {
        const stateEmoji = device.state === "connected" ? "🟢" : "🔴";
        const stateText = device.state === "connected" ? "Conectado" : "Desconectado";

        const item = document.createElement("li");
        item.className = "device-item";

        const nameEl = document.createElement("div");
        nameEl.className = "device-name";
        nameEl.textContent = "🎹 " + device.name;

        const manufacturerEl = document.createElement("div");
        manufacturerEl.className = "device-detail";
        manufacturerEl.textContent = "Fabricante: " + device.manufacturer;

        const stateEl = document.createElement("div");
        stateEl.className = "device-detail";
        stateEl.textContent = "Estado: " + stateEmoji + " " + stateText;

        item.appendChild(nameEl);
        item.appendChild(manufacturerEl);
        item.appendChild(stateEl);
        list.appendChild(item);
    }

    devicesContainerEl.appendChild(list);
}

function renderStats() {
    sessionStatsEl.textContent = "";

    if (stats.noteCount === 0) {
        const msg = document.createElement("p");
        msg.className = "text-muted";
        msg.textContent = "Nenhuma tecla pressionada ainda.";
        sessionStatsEl.appendChild(msg);
        return;
    }

    const grid = document.createElement("div");
    grid.className = "stats-grid";

    const items = [
        { label: "Teclas pressionadas", value: String(stats.noteCount) },
        { label: "Nota mais grave", value: noteNumberToName(stats.lowestNote) + " (MIDI " + stats.lowestNote + ")" },
        { label: "Nota mais aguda", value: noteNumberToName(stats.highestNote) + " (MIDI " + stats.highestNote + ")" },
    ];

    if (stats.lowestNote !== stats.highestNote) {
        const range = stats.highestNote - stats.lowestNote + 1;
        items.push({
            label: "Range detectado",
            value: range + " semitons (" + noteNumberToName(stats.lowestNote) + " → " + noteNumberToName(stats.highestNote) + ")",
        });
    }

    for (const item of items) {
        const statEl = document.createElement("div");
        statEl.className = "stat-item";

        const labelEl = document.createElement("span");
        labelEl.className = "stat-label";
        labelEl.textContent = item.label;

        const valueEl = document.createElement("span");
        valueEl.className = "stat-value";
        valueEl.textContent = item.value;

        statEl.appendChild(labelEl);
        statEl.appendChild(valueEl);
        grid.appendChild(statEl);
    }

    sessionStatsEl.appendChild(grid);
}

function addNoteEntry(noteEvent) {
    const placeholder = noteLogEl.querySelector(".note-log-empty");
    if (placeholder) placeholder.remove();

    btnClearLog.disabled = false;

    if (noteEvent.type === "on") {
        stats.noteCount++;
        if (stats.lowestNote === null || noteEvent.noteNumber < stats.lowestNote) {
            stats.lowestNote = noteEvent.noteNumber;
        }
        if (stats.highestNote === null || noteEvent.noteNumber > stats.highestNote) {
            stats.highestNote = noteEvent.noteNumber;
        }
        renderStats();
    }

    const entry = document.createElement("div");
    entry.className = "note-entry";

    const nameSpan = document.createElement("span");
    nameSpan.className = "note-name";
    nameSpan.textContent = noteEvent.note;

    const velSpan = document.createElement("span");
    velSpan.className = "note-velocity";
    velSpan.textContent = "Vel: " + noteEvent.velocity;

    const typeSpan = document.createElement("span");
    typeSpan.className = noteEvent.type === "on" ? "note-type-on" : "note-type-off";
    typeSpan.textContent = noteEvent.type === "on" ? "Note On" : "Note Off";

    entry.appendChild(nameSpan);
    entry.appendChild(velSpan);
    entry.appendChild(typeSpan);

    noteLogEl.prepend(entry);
    logEntries++;

    if (logEntries > MAX_LOG_ENTRIES) {
        noteLogEl.lastElementChild.remove();
        logEntries--;
    }
}

function clearLog() {
    noteLogEl.textContent = "";
    const placeholder = document.createElement("div");
    placeholder.className = "note-log-empty";
    placeholder.textContent = "Pressione uma tecla no seu teclado MIDI...";
    noteLogEl.appendChild(placeholder);

    logEntries = 0;
    btnClearLog.disabled = true;
}

function renderAccessDenied() {
    devicesContainerEl.textContent = "";

    const badge = document.createElement("span");
    badge.className = "badge badge-error";
    badge.textContent = "❌ Acesso MIDI negado";
    devicesContainerEl.appendChild(badge);

    const hint = document.createElement("p");
    hint.className = "text-muted panel-hint";
    hint.textContent = "O navegador bloqueou o acesso MIDI. Verifique as permissões do site.";
    devicesContainerEl.appendChild(hint);
}

btnClearLog.addEventListener("click", clearLog);

// =============================================================================
// 2. Configuração de Teclado
// =============================================================================

const keyboardConfigDisplayEl = document.getElementById("keyboard-config-display");
const keyboardSetupFlowEl = document.getElementById("keyboard-setup-flow");
const btnStartSetup = document.getElementById("btn-start-keyboard-setup");

const setupStepLowEl = document.getElementById("setup-step-low");
const setupStepHighEl = document.getElementById("setup-step-high");
const setupStepConfirmEl = document.getElementById("setup-step-confirm");

const setupLowFeedbackEl = document.getElementById("setup-low-feedback");
const setupHighFeedbackEl = document.getElementById("setup-high-feedback");
const setupSummaryEl = document.getElementById("setup-summary");

const btnConfirmLow = document.getElementById("btn-confirm-low");
const btnConfirmHigh = document.getElementById("btn-confirm-high");
const btnCancelSetup = document.getElementById("btn-cancel-setup");
const btnBackToLow = document.getElementById("btn-back-to-low");
const btnSaveKeyboard = document.getElementById("btn-save-keyboard");
const btnRestartSetup = document.getElementById("btn-restart-setup");

/**
 * Estado interno do fluxo de configuração.
 * Isolado do monitor de teclas — eventos são roteados exclusivamente para
 * o fluxo enquanto setupState.active === true.
 */
const setupState = {
    active: false,
    currentNote: null, // { noteNumber, name } — nota detectada no passo atual
    lowNote: null,     // { noteNumber, name } — confirmada no passo 1
    highNote: null,    // { noteNumber, name } — confirmada no passo 2
    deviceName: null,
};

function renderKeyboardConfigStatus() {
    const kb = getKeyboard();
    keyboardConfigDisplayEl.textContent = "";

    if (!kb) {
        const msg = document.createElement("p");
        msg.className = "text-muted";
        msg.textContent = "Nenhum teclado configurado. Use o botão abaixo para iniciar.";
        keyboardConfigDisplayEl.appendChild(msg);
        btnStartSetup.textContent = "Iniciar configuração";
        return;
    }

    const grid = document.createElement("div");
    grid.className = "stats-grid";

    const items = [
        { label: "Dispositivo", value: kb.deviceName },
        { label: "Nota mais grave", value: noteNumberToName(kb.lowestNote) + " (MIDI " + kb.lowestNote + ")" },
        { label: "Nota mais aguda", value: noteNumberToName(kb.highestNote) + " (MIDI " + kb.highestNote + ")" },
        { label: "Total de teclas", value: kb.totalKeys + " teclas" },
        { label: "Configurado em", value: new Date(kb.configuredAt).toLocaleDateString("pt-BR") },
    ];

    for (const item of items) {
        const statEl = document.createElement("div");
        statEl.className = "stat-item";

        const labelEl = document.createElement("span");
        labelEl.className = "stat-label";
        labelEl.textContent = item.label;

        const valueEl = document.createElement("span");
        valueEl.className = "stat-value";
        valueEl.textContent = item.value;

        statEl.appendChild(labelEl);
        statEl.appendChild(valueEl);
        grid.appendChild(statEl);
    }

    keyboardConfigDisplayEl.appendChild(grid);
    btnStartSetup.textContent = "Reconfigurar teclado";
}

function showSetupStep(step) {
    setupStepLowEl.style.display = step === "low" ? "" : "none";
    setupStepHighEl.style.display = step === "high" ? "" : "none";
    setupStepConfirmEl.style.display = step === "confirm" ? "" : "none";
}

function startSetup() {
    setupState.active = true;
    setupState.currentNote = null;
    setupState.lowNote = null;
    setupState.highNote = null;
    setupState.deviceName = null;

    setupLowFeedbackEl.innerHTML = '<span class="text-muted">Aguardando...</span>';
    setupHighFeedbackEl.innerHTML = '<span class="text-muted">Aguardando...</span>';
    btnConfirmLow.disabled = true;
    btnConfirmHigh.disabled = true;

    keyboardSetupFlowEl.style.display = "";
    showSetupStep("low");

    keyboardSetupFlowEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function cancelSetup() {
    setupState.active = false;
    setupState.currentNote = null;
    keyboardSetupFlowEl.style.display = "none";
}

function renderSetupNoteFeedback(feedbackEl, noteNumber, noteName) {
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

function renderSetupSummary(lowNote, highNote, deviceName) {
    setupSummaryEl.textContent = "";

    const items = [
        { label: "Dispositivo", value: deviceName || "Desconhecido" },
        { label: "Nota mais grave", value: lowNote.name + " (MIDI " + lowNote.noteNumber + ")" },
        { label: "Nota mais aguda", value: highNote.name + " (MIDI " + highNote.noteNumber + ")" },
        { label: "Total de teclas", value: (highNote.noteNumber - lowNote.noteNumber + 1) + " teclas" },
    ];

    for (const item of items) {
        const statEl = document.createElement("div");
        statEl.className = "stat-item";

        const labelEl = document.createElement("span");
        labelEl.className = "stat-label";
        labelEl.textContent = item.label;

        const valueEl = document.createElement("span");
        valueEl.className = "stat-value";
        valueEl.textContent = item.value;

        statEl.appendChild(labelEl);
        statEl.appendChild(valueEl);
        setupSummaryEl.appendChild(statEl);
    }
}

/**
 * Intercepta eventos MIDI enquanto o fluxo de configuração está ativo.
 * Retorna true se o evento foi consumido (não deve ir ao monitor).
 */
function handleSetupNote(noteEvent) {
    if (noteEvent.type !== "on") return false;

    const onLowStep = setupStepLowEl.style.display !== "none";
    const noteName = noteNumberToName(noteEvent.noteNumber);

    if (onLowStep) {
        setupState.currentNote = { noteNumber: noteEvent.noteNumber, name: noteName };
        renderSetupNoteFeedback(setupLowFeedbackEl, noteEvent.noteNumber, noteName);
        btnConfirmLow.disabled = false;
    } else {
        setupState.currentNote = { noteNumber: noteEvent.noteNumber, name: noteName };
        renderSetupNoteFeedback(setupHighFeedbackEl, noteEvent.noteNumber, noteName);
        btnConfirmHigh.disabled = false;
    }

    return true;
}

btnStartSetup.addEventListener("click", startSetup);

btnCancelSetup.addEventListener("click", cancelSetup);

btnRestartSetup.addEventListener("click", startSetup);

btnConfirmLow.addEventListener("click", () => {
    if (!setupState.currentNote) return;
    setupState.lowNote = setupState.currentNote;
    setupState.currentNote = null;
    btnConfirmHigh.disabled = true;
    setupHighFeedbackEl.innerHTML = '<span class="text-muted">Aguardando...</span>';
    showSetupStep("high");
});

btnBackToLow.addEventListener("click", () => {
    setupState.highNote = null;
    setupState.currentNote = null;

    if (setupState.lowNote) {
        renderSetupNoteFeedback(setupLowFeedbackEl, setupState.lowNote.noteNumber, setupState.lowNote.name);
        btnConfirmLow.disabled = false;
    } else {
        setupLowFeedbackEl.innerHTML = '<span class="text-muted">Aguardando...</span>';
        btnConfirmLow.disabled = true;
    }

    showSetupStep("low");
});

btnConfirmHigh.addEventListener("click", () => {
    if (!setupState.currentNote) return;
    setupState.highNote = setupState.currentNote;
    setupState.currentNote = null;
    setupState.deviceName = getFirstConnectedDeviceName();
    renderSetupSummary(setupState.lowNote, setupState.highNote, setupState.deviceName);
    showSetupStep("confirm");
});

btnSaveKeyboard.addEventListener("click", () => {
    if (!setupState.lowNote || !setupState.highNote) return;

    setKeyboard({
        lowestNote: setupState.lowNote.noteNumber,
        highestNote: setupState.highNote.noteNumber,
        deviceName: setupState.deviceName,
    });

    cancelSetup();
    renderKeyboardConfigStatus();
});

renderKeyboardConfigStatus();

// =============================================================================
// 3. Roteador MIDI + Inicialização
// =============================================================================

/**
 * Referência ao MIDIAccess ativo, necessária para identificar o dispositivo
 * durante o fluxo de configuração.
 */
let _midiAccessRef = null;

function getFirstConnectedDeviceName() {
    if (!_midiAccessRef) return "Desconhecido";
    for (const input of _midiAccessRef.inputs.values()) {
        if (input.state === "connected") return input.name || "Desconhecido";
    }
    return "Desconhecido";
}

/**
 * Roteador central de eventos MIDI.
 * Quando o fluxo de configuração está ativo, os eventos são consumidos por ele.
 * Caso contrário, seguem para o monitor de teclas.
 */
function onMidiNote(noteEvent) {
    if (setupState.active && handleSetupNote(noteEvent)) return;
    addNoteEntry(noteEvent);
}

async function init() {
    renderBrowserStatus(isSupported());

    if (!isSupported()) {
        const msg = document.createElement("p");
        msg.className = "text-muted";
        msg.textContent = "Funcionalidade indisponível neste navegador.";
        devicesContainerEl.textContent = "";
        devicesContainerEl.appendChild(msg);
        return;
    }

    try {
        const midiAccess = await requestAccess();
        _midiAccessRef = midiAccess;

        renderDevices(getInputDevices(midiAccess));

        onStateChange(midiAccess, (updatedAccess) => {
            _midiAccessRef = updatedAccess;
            renderDevices(getInputDevices(updatedAccess));
            listenToInputs(updatedAccess, onMidiNote);
        });

        listenToInputs(midiAccess, onMidiNote);
    } catch (error) {
        renderAccessDenied();
    }
}

init();

// =============================================================================
// 4. Gerenciamento de Dados
// =============================================================================

const btnClearProgress = document.getElementById("btn-clear-progress");
const btnResetAll = document.getElementById("btn-reset-all");

btnClearProgress.addEventListener("click", () => {
    const confirmed = confirm(
        "Tem certeza que deseja limpar todo o progresso das músicas?\n\n" +
        "Isso removerá o histórico de prática (melhor acurácia, vezes tocadas).\n" +
        "Configurações de teclado e preferências serão mantidas."
    );
    if (!confirmed) return;
    clearProgress();
    alert("Progresso limpo com sucesso.");
});

btnResetAll.addEventListener("click", () => {
    const confirmed = confirm(
        "⚠️ Tem certeza que deseja redefinir TODOS os dados do aplicativo?\n\n" +
        "Isso removerá:\n" +
        "• Progresso das músicas\n" +
        "• Configuração do teclado MIDI\n" +
        "• Preferências pessoais\n\n" +
        "Esta ação não pode ser desfeita."
    );
    if (!confirmed) return;
    resetAll();
    alert("Todos os dados foram redefinidos. O aplicativo voltou ao estado inicial.");
});
