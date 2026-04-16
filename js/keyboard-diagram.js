/**
 * keyboard-diagram.js — Componente reutilizável de diagrama de teclado
 *
 * Gera uma representação HTML/CSS de um trecho do teclado musical
 * com teclas destacadas por cor e labels opcionais.
 *
 * Uso em HTML fragments:
 *   <div class="keyboard-diagram"
 *        data-range="C4-B4"
 *        data-highlights='[{"note":"C4","color":"cyan","label":"Dó"},{"note":"E4","color":"cyan","label":"Mi"}]'>
 *   </div>
 *
 * Atributos:
 *   data-range       — Range de notas (ex: "C4-B4", "C3-C5"). Padrão: "C4-B4"
 *   data-highlights   — JSON array de { note, color, label? }
 *                        note: nome da nota (ex: "C4", "F#3", "Bb5")
 *                        color: "cyan" | "yellow" | "pink" | "green" | "purple" | "root"
 *                        label: texto exibido na tecla (opcional)
 *   data-compact      — Se presente, usa altura reduzida
 *
 * Também pode ser invocado programaticamente:
 *   renderKeyboardDiagram(containerEl, { range, highlights, compact })
 */

// --- Note name <-> MIDI mapping ---

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const BLACK_INDICES = new Set([1, 3, 6, 8, 10]); // C#, D#, F#, G#, A#

/**
 * Parse note name to MIDI number.
 * Accepts: C4, C#4, Db4, Cb4, etc.
 */
function noteToMidi(name) {
    const match = name.match(/^([A-G])(#|b)?(\d+)$/i);
    if (!match) return null;

    const letter = match[1].toUpperCase();
    const accidental = match[2] || '';
    const octave = parseInt(match[3], 10);

    const baseIndex = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[letter];
    if (baseIndex === undefined) return null;

    let noteIndex = baseIndex;
    if (accidental === '#') noteIndex += 1;
    if (accidental === 'b') noteIndex -= 1;

    // Wrap around (Cb4 = B3 equivalent, B#4 = C5 equivalent)
    return (octave + 1) * 12 + noteIndex;
}

/**
 * MIDI number to note name (using sharps).
 */
function midiToNoteName(midi) {
    const octave = Math.floor(midi / 12) - 1;
    const index = midi % 12;
    return NOTE_NAMES[index] + octave;
}

/**
 * Check if a MIDI number is a black key.
 */
function isBlackKey(midi) {
    return BLACK_INDICES.has(midi % 12);
}

/**
 * Parse a range string like "C4-B4" into [startMidi, endMidi].
 */
function parseRange(rangeStr) {
    const parts = rangeStr.split('-');
    if (parts.length !== 2) return null;

    // Handle notes with sharps/flats that contain a dash in the range separator
    // e.g., "C#4-B4" — split on the last dash that separates two note names
    const dashIdx = rangeStr.lastIndexOf('-');
    const startStr = rangeStr.slice(0, dashIdx);
    const endStr = rangeStr.slice(dashIdx + 1);

    const start = noteToMidi(startStr);
    const end = noteToMidi(endStr);

    if (start === null || end === null || start > end) return null;
    return [start, end];
}

// --- Rendering ---

/**
 * Render a keyboard diagram into a container element.
 *
 * @param {HTMLElement} container
 * @param {Object} options
 * @param {string} options.range - e.g. "C4-B4"
 * @param {Array} options.highlights - [{ note, color, label? }]
 * @param {boolean} options.compact - use reduced height
 */
export function renderKeyboardDiagram(container, options = {}) {
    const rangeStr = options.range || 'C4-B4';
    const highlights = options.highlights || [];
    const compact = options.compact || false;

    const range = parseRange(rangeStr);
    if (!range) {
        container.innerHTML = '<span class="text-muted" style="font-size:0.85rem;">Diagrama indisponível: range inválido.</span>';
        return;
    }

    const [startMidi, endMidi] = range;

    // Build highlight map: midi -> { color, label }
    const highlightMap = new Map();
    for (const h of highlights) {
        const midi = noteToMidi(h.note);
        if (midi !== null) {
            highlightMap.set(midi, { color: h.color || 'cyan', label: h.label || '' });
        }
    }

    // Collect white keys to determine flex layout
    const whiteKeys = [];
    const blackKeys = [];

    for (let midi = startMidi; midi <= endMidi; midi++) {
        if (isBlackKey(midi)) {
            blackKeys.push(midi);
        } else {
            whiteKeys.push(midi);
        }
    }

    if (whiteKeys.length === 0) {
        container.innerHTML = '<span class="text-muted" style="font-size:0.85rem;">Diagrama indisponível: nenhuma tecla branca no range.</span>';
        return;
    }

    // Build HTML
    const diagramEl = document.createElement('div');
    diagramEl.className = 'keyboard-diagram' + (compact ? ' keyboard-diagram--compact' : '');
    diagramEl.style.position = 'relative';

    // Render white keys
    for (const midi of whiteKeys) {
        const hl = highlightMap.get(midi);
        const el = document.createElement('div');
        el.className = 'kbd-white';
        if (hl) el.classList.add(`kbd-highlight-${hl.color}`);

        const labelText = hl && hl.label ? hl.label : '';
        if (labelText) {
            const label = document.createElement('span');
            label.className = 'kbd-label';
            label.textContent = labelText;
            el.appendChild(label);
        }

        diagramEl.appendChild(el);
    }

    // Calculate positions for black keys
    // Black keys are positioned relative to adjacent white keys
    const totalWhiteKeys = whiteKeys.length;
    const whiteKeyWidth = 100 / totalWhiteKeys; // percentage

    for (const midi of blackKeys) {
        // Find the white key index to the left of this black key
        const leftWhiteMidi = midi - 1; // The white key immediately to the left
        const whiteIdx = whiteKeys.indexOf(leftWhiteMidi);

        if (whiteIdx === -1) continue; // Black key's left neighbor not in range

        const hl = highlightMap.get(midi);
        const el = document.createElement('div');
        el.className = 'kbd-black';
        if (hl) el.classList.add(`kbd-highlight-${hl.color}`);

        // Position: centered between left and right white keys
        const leftPercent = (whiteIdx + 1) * whiteKeyWidth - (whiteKeyWidth * 0.3);
        el.style.left = leftPercent + '%';
        el.style.width = (whiteKeyWidth * 0.6) + '%';

        const labelText = hl && hl.label ? hl.label : '';
        if (labelText) {
            const label = document.createElement('span');
            label.className = 'kbd-label';
            label.textContent = labelText;
            el.appendChild(label);
        }

        diagramEl.appendChild(el);
    }

    container.innerHTML = '';
    container.appendChild(diagramEl);
}

// --- Auto-initialization from data attributes ---

function initDiagrams() {
    const containers = document.querySelectorAll('.keyboard-diagram[data-range]');
    for (const el of containers) {
        const range = el.dataset.range || 'C4-B4';
        const compact = el.hasAttribute('data-compact');
        let highlights = [];

        if (el.dataset.highlights) {
            try {
                highlights = JSON.parse(el.dataset.highlights);
            } catch (err) {
                console.error('[keyboard-diagram] JSON inválido em data-highlights:', err);
            }
        }

        renderKeyboardDiagram(el, { range, highlights, compact });
    }
}

// Run auto-init when called as a module side effect,
// and also observe for dynamically inserted diagrams
if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1) continue;
                // Check the node itself and its descendants
                const diagrams = node.matches?.('.keyboard-diagram[data-range]')
                    ? [node]
                    : node.querySelectorAll?.('.keyboard-diagram[data-range]') || [];
                for (const el of diagrams) {
                    if (el.children.length === 0) {
                        const range = el.dataset.range || 'C4-B4';
                        const compact = el.hasAttribute('data-compact');
                        let highlights = [];
                        if (el.dataset.highlights) {
                            try { highlights = JSON.parse(el.dataset.highlights); } catch { /* skip */ }
                        }
                        renderKeyboardDiagram(el, { range, highlights, compact });
                    }
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// Also run on initial load for any diagrams already in the DOM
initDiagrams();
