/**
 * song-loader.js — Carregamento e validação de músicas
 *
 * Carrega o catálogo (songs/catalog.json) e músicas individuais.
 * Valida o schema completo antes de retornar.
 */

const VALID_CATEGORIES = ["games", "animes", "movies", "artists"];
const VALID_DIFFICULTIES = ["beginner", "intermediate", "advanced"];
const VALID_HANDS = ["right", "left", "both"];

function validateSong(song) {
    const errors = [];

    if (!song || typeof song !== "object") {
        return ["JSON inválido: não é um objeto."];
    }

    // --- Metadados (strings obrigatórias) ---
    const requiredStrings = ["id", "title", "artist", "source", "keySignature"];
    for (const field of requiredStrings) {
        if (typeof song[field] !== "string" || song[field].trim() === "") {
            errors.push(`Campo obrigatório ausente ou inválido: "${field}".`);
        }
    }

    if (!VALID_CATEGORIES.includes(song.category)) {
        errors.push(`Categoria inválida: "${song.category}". Válidos: ${VALID_CATEGORIES.join(", ")}.`);
    }
    if (!VALID_DIFFICULTIES.includes(song.difficulty)) {
        errors.push(`Dificuldade inválida: "${song.difficulty}". Válidos: ${VALID_DIFFICULTIES.join(", ")}.`);
    }

    // --- Metadados (numéricos) ---
    if (typeof song.bpm !== "number" || song.bpm <= 0) {
        errors.push("BPM deve ser um número positivo.");
    }
    if (!Array.isArray(song.timeSignature) || song.timeSignature.length !== 2 ||
        !Number.isInteger(song.timeSignature[0]) || !Number.isInteger(song.timeSignature[1]) ||
        song.timeSignature[0] <= 0 || song.timeSignature[1] <= 0) {
        errors.push("timeSignature deve ser [inteiro > 0, inteiro > 0].");
    }
    if (typeof song.totalDurationBeats !== "number" || song.totalDurationBeats <= 0) {
        errors.push("totalDurationBeats deve ser um número positivo.");
    }

    // --- MIDI Range ---
    if (!song.midiRange || typeof song.midiRange !== "object") {
        errors.push('Campo obrigatório ausente: "midiRange".');
    } else {
        const { lowest, highest } = song.midiRange;
        if (!Number.isInteger(lowest) || lowest < 0 || lowest > 127) {
            errors.push("midiRange.lowest deve ser inteiro 0-127.");
        }
        if (!Number.isInteger(highest) || highest < 0 || highest > 127) {
            errors.push("midiRange.highest deve ser inteiro 0-127.");
        }
        if (typeof lowest === "number" && typeof highest === "number" && lowest > highest) {
            errors.push("midiRange.lowest não pode ser maior que highest.");
        }
    }

    // --- Tracks ---
    if (!Array.isArray(song.tracks) || song.tracks.length === 0) {
        errors.push("Deve haver pelo menos uma track.");
        return errors;
    }

    const trackIds = new Set();
    for (let i = 0; i < song.tracks.length; i++) {
        const track = song.tracks[i];
        const p = `Track[${i}]`;

        if (typeof track.id !== "string" || track.id.trim() === "") {
            errors.push(`${p}: "id" ausente ou inválido.`);
        } else if (trackIds.has(track.id)) {
            errors.push(`${p}: ID duplicado "${track.id}".`);
        } else {
            trackIds.add(track.id);
        }

        if (typeof track.name !== "string" || track.name.trim() === "") {
            errors.push(`${p}: "name" ausente ou inválido.`);
        }
        if (!VALID_HANDS.includes(track.hand)) {
            errors.push(`${p}: "hand" inválido: "${track.hand}".`);
        }
        if (!VALID_DIFFICULTIES.includes(track.difficulty)) {
            errors.push(`${p}: "difficulty" inválido: "${track.difficulty}".`);
        }

        if (!Array.isArray(track.notes) || track.notes.length === 0) {
            errors.push(`${p}: deve ter pelo menos uma nota.`);
            continue;
        }

        for (let j = 0; j < track.notes.length; j++) {
            const note = track.notes[j];
            const np = `${p}.notes[${j}]`;

            if (!Number.isInteger(note.note) || note.note < 0 || note.note > 127) {
                errors.push(`${np}: "note" deve ser inteiro 0-127.`);
            }
            if (typeof note.start !== "number" || note.start < 0) {
                errors.push(`${np}: "start" deve ser >= 0.`);
            }
            if (typeof note.duration !== "number" || note.duration <= 0) {
                errors.push(`${np}: "duration" deve ser > 0.`);
            }
            if (note.velocity !== undefined) {
                if (typeof note.velocity !== "number" || note.velocity < 0 || note.velocity > 127) {
                    errors.push(`${np}: "velocity" deve ser 0-127.`);
                }
            }
        }
    }

    return errors;
}

async function loadCatalog(basePath) {
    const response = await fetch(basePath + "/catalog.json");
    if (!response.ok) {
        throw new Error("Falha ao carregar catálogo de músicas.");
    }
    return response.json();
}

async function loadSong(basePath, filePath) {
    const response = await fetch(basePath + "/" + filePath);
    if (!response.ok) {
        throw new Error("Falha ao carregar música: " + filePath);
    }

    const song = await response.json();
    const errors = validateSong(song);

    if (errors.length > 0) {
        throw new Error("Música inválida:\n• " + errors.join("\n• "));
    }

    return song;
}

export { loadCatalog, loadSong, validateSong };
