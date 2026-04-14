/**
 * midi.js — Módulo de interação com a Web MIDI API
 *
 * Responsabilidades:
 * - Verificar suporte do navegador
 * - Solicitar acesso MIDI
 * - Detectar dispositivos (entrada)
 * - Escutar conexão/desconexão (hot-plug)
 * - Parsear mensagens MIDI (Note On/Off)
 */

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const MIDI_STATUS = {
    NOTE_OFF: 0x80,
    NOTE_ON: 0x90,
};

/**
 * Converte um número MIDI (0-127) para nome legível.
 * Ex: 60 → "C4", 69 → "A4"
 */
function noteNumberToName(number) {
    const name = NOTE_NAMES[number % 12];
    const octave = Math.floor(number / 12) - 1;
    return `${name}${octave}`;
}

/**
 * Verifica se o navegador suporta a Web MIDI API.
 */
function isSupported() {
    return "requestMIDIAccess" in navigator;
}

/**
 * Solicita acesso à MIDI API e retorna o MIDIAccess.
 * Lança erro se não suportado ou se o usuário negar acesso.
 */
async function requestAccess() {
    if (!isSupported()) {
        throw new Error("Web MIDI API não suportada neste navegador.");
    }
    return navigator.requestMIDIAccess();
}

/**
 * Retorna lista de dispositivos de entrada MIDI conectados.
 * Cada item: { id, name, manufacturer, state }
 */
function getInputDevices(midiAccess) {
    const devices = [];
    for (const input of midiAccess.inputs.values()) {
        devices.push({
            id: input.id,
            name: input.name || "Dispositivo desconhecido",
            manufacturer: input.manufacturer || "—",
            state: input.state,
        });
    }
    return devices;
}

/**
 * Registra callback para mudanças de estado (conexão/desconexão).
 * O callback recebe o MIDIAccess atualizado.
 */
function onStateChange(midiAccess, callback) {
    midiAccess.onstatechange = () => {
        callback(midiAccess);
    };
}

/**
 * Parseia uma mensagem MIDI bruta.
 * Retorna objeto com tipo, nota, velocidade — ou null se não for Note On/Off.
 */
function parseMessage(data) {
    const status = data[0] & 0xf0;
    const noteNumber = data[1];
    const velocity = data[2];

    if (status === MIDI_STATUS.NOTE_ON && velocity > 0) {
        return {
            type: "on",
            note: noteNumberToName(noteNumber),
            noteNumber: noteNumber,
            velocity: velocity,
        };
    }

    if (status === MIDI_STATUS.NOTE_OFF || (status === MIDI_STATUS.NOTE_ON && velocity === 0)) {
        return {
            type: "off",
            note: noteNumberToName(noteNumber),
            noteNumber: noteNumber,
            velocity: 0,
        };
    }

    return null;
}

/**
 * Escuta mensagens MIDI de todas as entradas.
 * O callback recebe o resultado de parseMessage (apenas Note On/Off).
 */
function listenToInputs(midiAccess, callback) {
    for (const input of midiAccess.inputs.values()) {
        input.onmidimessage = (event) => {
            const parsed = parseMessage(event.data);
            if (parsed) {
                callback(parsed);
            }
        };
    }
}

export {
    isSupported,
    requestAccess,
    getInputDevices,
    onStateChange,
    listenToInputs,
    parseMessage,
    noteNumberToName,
};
