/**
 * player.js — Engine do player de prática
 *
 * Gerencia timeline, sincronização com BPM, matching de notas MIDI
 * e estado da sessão (acertos, erros, progresso).
 */

const DEFAULT_TOLERANCE_MS = 250;
const LEAD_IN_BEATS = 4;

const NOTE_STATE = {
    PENDING: "pending",
    HIT: "hit",
    MISSED: "missed",
};

/**
 * Cria uma instância do player para uma música e tracks selecionadas.
 * @param {object} song - Dados da música
 * @param {string[]} activeTrackIds - IDs das tracks ativas
 * @param {object} [options] - Opções de configuração
 * @param {number} [options.toleranceMs] - Tolerância de timing em ms
 */
function createPlayer(song, activeTrackIds, options = {}) {
    const speed = { value: 1.0 };
    const tolerance = { value: options.toleranceMs || DEFAULT_TOLERANCE_MS };
    const state = {
        playing: false,
        finished: false,
        currentTimeMs: 0,
        startTimestamp: null,
        pausedAtMs: 0,
    };

    // Mescla notas das tracks ativas, ordenadas por start
    const notes = [];
    for (const track of song.tracks) {
        if (!activeTrackIds.includes(track.id)) continue;
        for (const note of track.notes) {
            notes.push({
                note: note.note,
                start: note.start,
                duration: note.duration,
                velocity: note.velocity || 80,
                trackId: track.id,
                hand: track.hand,
                state: NOTE_STATE.PENDING,
            });
        }
    }
    notes.sort((a, b) => a.start - b.start || a.note - b.note);

    const accuracy = { hits: 0, misses: 0, total: notes.length };

    function msPerBeat() {
        return 60000 / (song.bpm * speed.value);
    }

    function currentBeat() {
        return state.currentTimeMs / msPerBeat();
    }

    function beatToMs(beat) {
        return beat * msPerBeat();
    }

    function update(timestamp) {
        if (!state.playing || state.finished) return;

        if (state.startTimestamp === null) {
            state.startTimestamp = timestamp;
        }

        state.currentTimeMs = state.pausedAtMs + (timestamp - state.startTimestamp);

        // Marca notas que passaram da janela de tolerância como missed
        const now = state.currentTimeMs;
        if (now >= 0) {
            for (const n of notes) {
                if (n.state !== NOTE_STATE.PENDING) continue;
                const noteMs = beatToMs(n.start);
                if (now > noteMs + tolerance.value) {
                    n.state = NOTE_STATE.MISSED;
                    accuracy.misses++;
                }
            }
        }

        // Verifica se a música terminou
        const totalMs = beatToMs(song.totalDurationBeats);
        if (state.currentTimeMs >= totalMs + tolerance.value) {
            state.finished = true;
            state.playing = false;
        }
    }

    function handleNoteOn(midiNote) {
        if (!state.playing || state.finished) return;
        if (state.currentTimeMs < 0) return;

        const now = state.currentTimeMs;

        let bestMatch = null;
        let bestDelta = Infinity;

        for (const n of notes) {
            if (n.state !== NOTE_STATE.PENDING) continue;
            if (n.note !== midiNote) continue;

            const noteMs = beatToMs(n.start);
            const delta = Math.abs(now - noteMs);

            if (delta <= tolerance.value && delta < bestDelta) {
                bestMatch = n;
                bestDelta = delta;
            }
        }

        if (bestMatch) {
            bestMatch.state = NOTE_STATE.HIT;
            accuracy.hits++;
        }
    }

    function play() {
        if (state.finished) {
            stop();
        }
        // Lead-in: começa com tempo negativo na primeira execução
        if (state.currentTimeMs === 0 && state.pausedAtMs === 0) {
            const leadInMs = LEAD_IN_BEATS * msPerBeat();
            state.pausedAtMs = -leadInMs;
            state.currentTimeMs = -leadInMs;
        }
        state.playing = true;
        state.startTimestamp = null;
    }

    function pause() {
        if (!state.playing) return;
        state.playing = false;
        state.pausedAtMs = state.currentTimeMs;
        state.startTimestamp = null;
    }

    function stop() {
        state.playing = false;
        state.finished = false;
        state.currentTimeMs = 0;
        state.pausedAtMs = 0;
        state.startTimestamp = null;
        accuracy.hits = 0;
        accuracy.misses = 0;
        for (const n of notes) {
            n.state = NOTE_STATE.PENDING;
        }
    }

    function restart() {
        stop();
        play();
    }

    function seek(targetBeat) {
        const targetMs = Math.max(0, targetBeat * msPerBeat());
        state.pausedAtMs = targetMs;
        state.currentTimeMs = targetMs;
        state.startTimestamp = null;
        state.finished = false;

        // Recalcula estado das notas
        accuracy.hits = 0;
        accuracy.misses = 0;
        for (const n of notes) {
            const noteMs = beatToMs(n.start);
            if (targetMs > noteMs + tolerance.value) {
                n.state = NOTE_STATE.MISSED;
                accuracy.misses++;
            } else {
                n.state = NOTE_STATE.PENDING;
            }
        }
    }

    function setSpeed(newSpeed) {
        if (state.playing) {
            state.pausedAtMs = state.currentTimeMs;
            state.startTimestamp = null;
        }
        speed.value = Math.max(0.25, Math.min(2.0, newSpeed));
    }

    function setTolerance(newToleranceMs) {
        tolerance.value = newToleranceMs;
    }

    function getState() {
        const pct = accuracy.total > 0
            ? Math.round((accuracy.hits / accuracy.total) * 100)
            : 0;

        return {
            playing: state.playing,
            finished: state.finished,
            currentBeat: currentBeat(),
            currentTimeMs: state.currentTimeMs,
            totalBeats: song.totalDurationBeats,
            speed: speed.value,
            bpm: song.bpm,
            effectiveBpm: song.bpm * speed.value,
            msPerBeat: msPerBeat(),
            notes: notes,
            toleranceMs: tolerance.value,
            accuracy: {
                hits: accuracy.hits,
                misses: accuracy.misses,
                total: accuracy.total,
                percentage: pct,
            },
            song: song,
        };
    }

    return {
        play,
        pause,
        stop,
        restart,
        seek,
        update,
        handleNoteOn,
        setSpeed,
        setTolerance,
        getState,
        NOTE_STATE,
    };
}

export { createPlayer, NOTE_STATE };
