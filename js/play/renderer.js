/**
 * renderer.js — Rendering visual do player (Canvas 2D)
 *
 * Falling notes com distinção teclas brancas/pretas, marcador de C,
 * hit line e feedback visual de acerto/erro.
 */

import { noteNumberToName } from "../shared/midi.js";
import { isBlackKey, isCNote } from "../shared/note-utils.js";

/**
 * Lê a paleta sólida de css/base/tokens.css em runtime. Cores com alfa
 * (fundos sutis e glows) ficam hardcoded — o token CSS fica em sincronia
 * via convenção visual, sem conversão runtime de hex→rgba.
 */
function readColors() {
    const style = getComputedStyle(document.documentElement);
    const tok = (name) => style.getPropertyValue(name).trim();

    return {
        background: tok("--bg-deep"),
        whiteKey: "rgba(255, 255, 255, 0.06)",
        blackKey: "rgba(0, 0, 0, 0.40)",
        cMarker: "rgba(0, 229, 255, 0.12)",
        hitLine: tok("--neon-yellow"),
        hitLineGlow: "rgba(255, 226, 52, 0.15)",
        notePending: tok("--neon-cyan"),
        noteHit: tok("--neon-green"),
        noteMissed: "rgba(255, 226, 52, 0.25)",
        noteLabel: tok("--bg-deep"),
        textMuted: tok("--text-secondary"),
        textC: tok("--neon-cyan"),
        countdown: tok("--neon-yellow"),
        neonPink: tok("--neon-pink"),
    };
}

const HIT_LINE_RATIO = 0.85;
const LOOKAHEAD_BEATS = 6;
const NOTE_BORDER_RADIUS = 3;
const MIN_NOTE_HEIGHT = 8;

function createRenderer(canvas, options = {}) {
    const ctx = canvas.getContext("2d");
    const showNames = options.showNoteNames !== false;
    const COLORS = readColors();

    // Range fixo de 61 teclas (C2–C7), equivalente a um teclado padrão
    let midiRange = { lowest: 36, highest: 96 };

    function setMidiRange(range) {
        midiRange = range;
    }

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + "px";
        canvas.style.height = rect.height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function render(playerState) {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (w === 0 || h === 0) return;

        const hitLineY = h * HIT_LINE_RATIO;
        const pixelsPerBeat = hitLineY / LOOKAHEAD_BEATS;
        const currentBeat = playerState.currentBeat;
        const rangeSize = midiRange.highest - midiRange.lowest + 1;
        const colWidth = w / rangeSize;

        // --- Fundo ---
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(0, 0, w, h);

        // --- Colunas (teclas brancas/pretas) ---
        // Margem lateral das colunas pretas (60% da coluna → 40% de fundo visível)
        const blackColMargin = colWidth * 0.20;

        for (let i = 0; i < rangeSize; i++) {
            const midiNote = midiRange.lowest + i;
            const colX = i * colWidth;

            if (isBlackKey(midiNote)) {
                // Tecla preta: faixa centralizada mais estreita e mais escura
                ctx.fillStyle = COLORS.blackKey;
                ctx.fillRect(colX + blackColMargin, 0, colWidth - blackColMargin * 2, h);
            } else {
                ctx.fillStyle = isCNote(midiNote) ? COLORS.cMarker : COLORS.whiteKey;
                ctx.fillRect(colX, 0, colWidth, h);
            }

            // Separador sutil entre colunas
            ctx.strokeStyle = "rgba(199, 125, 255, 0.06)";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(colX, 0);
            ctx.lineTo(colX, h);
            ctx.stroke();
        }

        // --- Hit line ---
        ctx.fillStyle = COLORS.hitLineGlow;
        ctx.fillRect(0, hitLineY - 4, w, 8);
        ctx.strokeStyle = COLORS.hitLine;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, hitLineY);
        ctx.lineTo(w, hitLineY);
        ctx.stroke();

        // --- Zona de tolerância (gradiente abaixo da hit line) ---
        if (playerState.toleranceMs > 0 && playerState.msPerBeat > 0) {
            const toleranceBeats = playerState.toleranceMs / playerState.msPerBeat;
            const tolerancePixels = toleranceBeats * pixelsPerBeat;
            const gradient = ctx.createLinearGradient(0, hitLineY, 0, hitLineY + tolerancePixels);
            gradient.addColorStop(0, "rgba(255, 226, 52, 0.10)");
            gradient.addColorStop(1, "rgba(255, 226, 52, 0)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, hitLineY, w, tolerancePixels);
        }

        // --- Notas ---
        for (const note of playerState.notes) {
            const beatDelta = note.start - currentBeat;
            const noteBottomY = hitLineY - beatDelta * pixelsPerBeat;
            const noteHeight = Math.max(note.duration * pixelsPerBeat, MIN_NOTE_HEIGHT);
            const noteTopY = noteBottomY - noteHeight;

            // Culling
            if (noteTopY > h + 20 || noteBottomY < -20) continue;

            const colIndex = note.note - midiRange.lowest;
            const black = isBlackKey(note.note);
            const margin = black ? colWidth * 0.30 : 1;
            const x = colIndex * colWidth + margin;
            const noteW = colWidth - margin * 2;

            let color;
            switch (note.state) {
                case "hit": color = COLORS.noteHit; break;
                case "missed": color = COLORS.noteMissed; break;
                default: color = COLORS.notePending;
            }

            ctx.fillStyle = color;
            roundRect(ctx, x, noteTopY, noteW, noteHeight, NOTE_BORDER_RADIUS);
            ctx.fill();

            // Label
            if (showNames && noteW > 18 && noteHeight > 14) {
                const name = noteNumberToName(note.note);
                ctx.fillStyle = COLORS.noteLabel;
                ctx.font = "bold 11px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(name, x + noteW / 2, noteTopY + noteHeight / 2);
            }
        }

        // --- Labels de referência na hit line ---
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        for (let i = 0; i < rangeSize; i++) {
            const midiNote = midiRange.lowest + i;
            const name = noteNumberToName(midiNote);
            if (isCNote(midiNote)) {
                ctx.fillStyle = COLORS.textC;
                ctx.font = "bold 11px sans-serif";
                ctx.fillText(name, i * colWidth + colWidth / 2, hitLineY + 6);
                ctx.font = "10px sans-serif";
            } else if (!isBlackKey(midiNote)) {
                ctx.fillStyle = COLORS.textMuted;
                ctx.fillText(name, i * colWidth + colWidth / 2, hitLineY + 6);
            }
        }

        // --- Countdown (lead-in) ---
        if (currentBeat < 0 && playerState.playing) {
            const beatsLeft = Math.ceil(-currentBeat);
            ctx.fillStyle = COLORS.countdown;
            ctx.font = "bold 48px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(String(beatsLeft), w / 2, hitLineY / 2);
        }

        // --- Tela de fim ---
        if (playerState.finished) {
            ctx.fillStyle = "rgba(15, 10, 26, 0.8)";
            ctx.fillRect(0, 0, w, h);

            ctx.fillStyle = COLORS.hitLine;
            ctx.font = "bold 28px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Música finalizada!", w / 2, h / 2 - 24);

            const pct = playerState.accuracy.percentage;
            ctx.fillStyle = pct >= 80 ? COLORS.noteHit : pct >= 50 ? COLORS.hitLine : COLORS.neonPink;
            ctx.font = "20px sans-serif";
            ctx.fillText(
                `Acurácia: ${playerState.accuracy.hits}/${playerState.accuracy.total} (${pct}%)`,
                w / 2, h / 2 + 20
            );
        }
    }

    return { render, resize, setMidiRange };
}

function roundRect(ctx, x, y, w, h, r) {
    if (h < 0) { y += h; h = -h; }
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}

export { createRenderer };
