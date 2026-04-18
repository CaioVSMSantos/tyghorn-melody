/**
 * midi-monitor.js — Painel de monitoramento de teclas MIDI.
 *
 * Renderiza status do navegador, lista de dispositivos, log rolante das
 * últimas notas e estatísticas de sessão (grave/aguda/range). Encapsula
 * logEntries e stats em closure; expõe apenas métodos de renderização.
 */

import { noteNumberToName } from "../shared/midi.js";
import { statGrid, badge } from "../shared/dom.js";

const MAX_LOG_ENTRIES = 50;

/**
 * Cria uma instância do monitor. A cada chamada de addNoteEntry o log e
 * as stats são atualizados; o limpar-log é amarrado via dom.btnClearLog.
 *
 * @param {object} dom — { browserStatusEl, devicesContainerEl, noteLogEl,
 *   btnClearLog, sessionStatsEl }
 */
export function createMidiMonitor(dom) {
    let logEntries = 0;
    const stats = {
        noteCount: 0,
        lowestNote: null,
        highestNote: null,
    };

    dom.btnClearLog.addEventListener("click", clearLog);

    function renderBrowserStatus(supported) {
        dom.browserStatusEl.textContent = "";

        const variant = supported ? "badge badge-success" : "badge badge-error";
        const text = supported
            ? "✅ Web MIDI API suportada"
            : "❌ Web MIDI API não suportada";
        dom.browserStatusEl.appendChild(badge(text, variant));

        if (!supported) {
            const hint = document.createElement("p");
            hint.className = "text-muted panel-hint";
            hint.textContent = "Use o Google Chrome ou Microsoft Edge para acessar esta funcionalidade.";
            dom.browserStatusEl.appendChild(hint);
        }
    }

    function renderDevices(devices) {
        dom.devicesContainerEl.textContent = "";

        if (devices.length === 0) {
            const msg = document.createElement("p");
            msg.className = "text-muted";
            msg.textContent = "Nenhum dispositivo MIDI detectado. Conecte um teclado via cabo USB-MIDI.";
            dom.devicesContainerEl.appendChild(msg);
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

        dom.devicesContainerEl.appendChild(list);
    }

    function renderAccessDenied() {
        dom.devicesContainerEl.textContent = "";

        dom.devicesContainerEl.appendChild(badge("❌ Acesso MIDI negado", "badge badge-error"));

        const hint = document.createElement("p");
        hint.className = "text-muted panel-hint";
        hint.textContent = "O navegador bloqueou o acesso MIDI. Verifique as permissões do site.";
        dom.devicesContainerEl.appendChild(hint);
    }

    function renderUnsupportedMessage() {
        dom.devicesContainerEl.textContent = "";
        const msg = document.createElement("p");
        msg.className = "text-muted";
        msg.textContent = "Funcionalidade indisponível neste navegador.";
        dom.devicesContainerEl.appendChild(msg);
    }

    function renderStats() {
        dom.sessionStatsEl.textContent = "";

        if (stats.noteCount === 0) {
            const msg = document.createElement("p");
            msg.className = "text-muted";
            msg.textContent = "Nenhuma tecla pressionada ainda.";
            dom.sessionStatsEl.appendChild(msg);
            return;
        }

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

        dom.sessionStatsEl.appendChild(statGrid(items));
    }

    function addNoteEntry(noteEvent) {
        const placeholder = dom.noteLogEl.querySelector(".note-log-empty");
        if (placeholder) placeholder.remove();

        dom.btnClearLog.disabled = false;

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

        dom.noteLogEl.prepend(entry);
        logEntries++;

        if (logEntries > MAX_LOG_ENTRIES) {
            dom.noteLogEl.lastElementChild.remove();
            logEntries--;
        }
    }

    function clearLog() {
        dom.noteLogEl.textContent = "";
        const placeholder = document.createElement("div");
        placeholder.className = "note-log-empty";
        placeholder.textContent = "Pressione uma tecla no seu teclado MIDI...";
        dom.noteLogEl.appendChild(placeholder);

        logEntries = 0;
        dom.btnClearLog.disabled = true;
    }

    return {
        renderBrowserStatus,
        renderDevices,
        renderAccessDenied,
        renderUnsupportedMessage,
        addNoteEntry,
    };
}
