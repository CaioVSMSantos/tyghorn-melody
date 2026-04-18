/**
 * note-utils.js — Conversão e classificação de notas musicais
 *
 * Funções puras, sem estado e sem dependências. Compartilhadas entre módulos
 * que lidam com notas MIDI: renderer, keyboard-diagram e demais consumidores
 * futuros do módulo de Prática e da Teoria.
 *
 * Convenção de nomenclatura:
 *   - "midi" / "midiNote": número MIDI (0–127, onde 60 = C4)
 *   - "name": string como "C4", "F#3", "Bb5"
 *
 * Nota: `midi.js` mantém uma função equivalente `noteNumberToName` por razões
 * históricas (faz parte da API do módulo MIDI). Convergência será avaliada
 * em rodada futura.
 */

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const BLACK_KEY_INDICES = new Set([1, 3, 6, 8, 10]);

/**
 * Converte um nome de nota (ex: "C4", "F#3", "Bb5") para número MIDI.
 * Retorna `null` se a entrada for inválida.
 */
export function noteToMidi(name) {
    const match = name.match(/^([A-G])(#|b)?(\d+)$/i);
    if (!match) return null;

    const letter = match[1].toUpperCase();
    const accidental = match[2] || "";
    const octave = parseInt(match[3], 10);

    const baseIndex = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[letter];
    if (baseIndex === undefined) return null;

    let noteIndex = baseIndex;
    if (accidental === "#") noteIndex += 1;
    if (accidental === "b") noteIndex -= 1;

    return (octave + 1) * 12 + noteIndex;
}

/**
 * Converte um número MIDI para nome legível usando sustenidos.
 * Ex: 60 → "C4", 61 → "C#4", 69 → "A4"
 */
export function midiToNoteName(midi) {
    const octave = Math.floor(midi / 12) - 1;
    const index = midi % 12;
    return NOTE_NAMES[index] + octave;
}

/**
 * Verifica se um número MIDI corresponde a uma tecla preta.
 */
export function isBlackKey(midi) {
    return BLACK_KEY_INDICES.has(midi % 12);
}

/**
 * Verifica se um número MIDI é uma nota C (Dó) — útil como marcador de oitava.
 */
export function isCNote(midi) {
    return midi % 12 === 0;
}
