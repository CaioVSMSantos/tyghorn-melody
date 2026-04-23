#!/usr/bin/env python3
"""
midi-to-json.py — Conversor MIDI -> JSON para Tyghorn Melody

Ferramenta de desenvolvimento para converter arquivos MIDI no formato
JSON utilizado pelo player de pratica.

Uso:
    python tools/midi-to-json.py analyze <arquivo.mid>
    python tools/midi-to-json.py convert <arquivo.mid> [opcoes]
    python tools/midi-to-json.py status

Comandos:
    analyze     Exibe informacoes detalhadas sobre um arquivo MIDI
    convert     Converte um MIDI para JSON no formato do player
    status      Mostra MIDIs na pasta e status de conversao

Requer Python 3.8+. Sem dependencias externas.
"""

import argparse
import json
import math
import os
import struct
import sys
from datetime import date


# ============================================================
# Constantes
# ============================================================

RANGE_LOW = 36    # C2
RANGE_HIGH = 96   # C7
DEFAULT_GRID = 0.25   # 1/16 beat (semicolcheia)
DEFAULT_SPLIT = 60    # C4 (do central)

NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
BLACK_KEYS = {1, 3, 6, 8, 10}

# Caminhos relativos a raiz do projeto
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MIDIS_DIR = os.path.join(PROJECT_ROOT, "authoring", "midis")
SONGS_DIR = os.path.join(PROJECT_ROOT, "content", "songs")
INDEX_FILE = os.path.join(MIDIS_DIR, "index.json")
CATALOG_FILE = os.path.join(SONGS_DIR, "catalog.json")


# ============================================================
# Utilitarios
# ============================================================

def note_name(midi_note):
    """Retorna o nome legivel da nota (ex: C4, F#5)."""
    return f"{NOTE_NAMES[midi_note % 12]}{midi_note // 12 - 1}"


def clean_number(n):
    """Remove .0 de numeros inteiros para JSON mais limpo."""
    if isinstance(n, float) and n == int(n):
        return int(n)
    return round(n, 4) if isinstance(n, float) else n


# ============================================================
# Parser binario MIDI
# ============================================================

def read_varlen(data, offset):
    """Le um inteiro de comprimento variavel (VLQ) do MIDI."""
    result = 0
    while True:
        byte = data[offset]
        offset += 1
        result = (result << 7) | (byte & 0x7F)
        if not (byte & 0x80):
            break
    return result, offset


def parse_midi(filepath):
    """
    Parseia um arquivo MIDI e retorna dados estruturados.

    Retorna:
        dict com format, division (ticks/beat), tracks (lista de dicts
        com name, notes [{note, start_tick, dur_tick, vel}], tempos [(tick, bpm)])
    """
    with open(filepath, "rb") as f:
        data = f.read()

    if data[0:4] != b"MThd":
        raise ValueError(f"Nao e um arquivo MIDI valido: {filepath}")

    header_len = struct.unpack(">I", data[4:8])[0]
    fmt, ntrks, division = struct.unpack(">HHH", data[8:14])

    if division & 0x8000:
        raise ValueError("MIDI com divisao SMPTE nao e suportado. Apenas ticks-per-beat.")

    offset = 8 + header_len
    tracks = []

    for _track_idx in range(ntrks):
        if data[offset:offset + 4] != b"MTrk":
            raise ValueError(f"Chunk MTrk esperado na posicao {offset}")

        track_len = struct.unpack(">I", data[offset + 4:offset + 8])[0]
        track_end = offset + 8 + track_len
        offset += 8

        notes = []
        note_ons = {}
        current_tick = 0
        track_name = ""
        tempos = []
        running_status = None

        while offset < track_end:
            delta, offset = read_varlen(data, offset)
            current_tick += delta
            byte = data[offset]

            # Meta event (0xFF)
            if byte == 0xFF:
                offset += 1
                meta_type = data[offset]
                offset += 1
                meta_len, offset = read_varlen(data, offset)
                meta_data = data[offset:offset + meta_len]
                offset += meta_len

                if meta_type == 0x03:
                    track_name = meta_data.decode("latin-1", errors="replace")
                elif meta_type == 0x51:
                    tempo_us = struct.unpack(">I", b"\x00" + meta_data)[0]
                    bpm = 60_000_000 / tempo_us
                    tempos.append((current_tick, bpm))
                continue

            # SysEx (0xF0, 0xF7)
            if byte in (0xF0, 0xF7):
                offset += 1
                sysex_len, offset = read_varlen(data, offset)
                offset += sysex_len
                continue

            # Channel messages
            if byte & 0x80:
                status = byte
                offset += 1
                running_status = status
            else:
                status = running_status
                if status is None:
                    offset += 1
                    continue

            msg_type = status & 0xF0
            channel = status & 0x0F

            if msg_type == 0x90:  # Note On
                note_num = data[offset]
                vel = data[offset + 1]
                offset += 2
                key = (channel, note_num)
                if vel > 0:
                    note_ons[key] = (current_tick, vel)
                else:
                    if key in note_ons:
                        start_tick, start_vel = note_ons.pop(key)
                        notes.append({
                            "note": note_num,
                            "start_tick": start_tick,
                            "dur_tick": current_tick - start_tick,
                            "vel": start_vel,
                        })

            elif msg_type == 0x80:  # Note Off
                note_num = data[offset]
                offset += 2
                key = (channel, note_num)
                if key in note_ons:
                    start_tick, start_vel = note_ons.pop(key)
                    notes.append({
                        "note": note_num,
                        "start_tick": start_tick,
                        "dur_tick": current_tick - start_tick,
                        "vel": start_vel,
                    })

            elif msg_type in (0xA0, 0xB0, 0xE0):
                offset += 2
            elif msg_type in (0xC0, 0xD0):
                offset += 1

        # Fechar notas que ficaram abertas
        for key, (start_tick, vel) in note_ons.items():
            notes.append({
                "note": key[1],
                "start_tick": start_tick,
                "dur_tick": current_tick - start_tick,
                "vel": vel,
            })

        notes.sort(key=lambda n: (n["start_tick"], n["note"]))
        tracks.append({"name": track_name, "notes": notes, "tempos": tempos})

    return {"format": fmt, "division": division, "tracks": tracks}


# ============================================================
# Processamento de notas
# ============================================================

def quantize(value, grid):
    """Arredonda para o ponto mais proximo na grade."""
    return round(value / grid) * grid


def transpose_to_range(note, low=RANGE_LOW, high=RANGE_HIGH):
    """Transpoe a nota para dentro do range por oitavas."""
    while note < low:
        note += 12
    while note > high:
        note -= 12
    return note


def process_notes(raw_notes, division, grid=DEFAULT_GRID):
    """
    Converte notas MIDI brutas para formato beat-based.

    Pipeline: ticks->beats, quantizacao, transposicao, deduplicacao.
    """
    processed = []
    seen = set()

    for n in raw_notes:
        note = transpose_to_range(n["note"])
        start = quantize(n["start_tick"] / division, grid)
        duration = max(grid, quantize(n["dur_tick"] / division, grid))
        vel = n["vel"]

        key = (note, round(start, 4))
        if key in seen:
            continue
        seen.add(key)

        processed.append({
            "note": note,
            "start": round(start, 4),
            "duration": round(duration, 4),
            "velocity": vel,
        })

    processed.sort(key=lambda x: (x["start"], x["note"]))
    return processed


def resolve_overlaps(notes):
    """
    Para notas de mesmo pitch, recorta duracao para evitar sobreposicao.

    Necessario para que o player nao espere duas pressoes simultaneas
    da mesma tecla (fisicamente impossivel no piano).
    """
    by_pitch = {}
    for n in notes:
        by_pitch.setdefault(n["note"], []).append(n)

    for group in by_pitch.values():
        group.sort(key=lambda x: x["start"])
        for i in range(len(group) - 1):
            end = group[i]["start"] + group[i]["duration"]
            next_start = group[i + 1]["start"]
            if end > next_start:
                group[i]["duration"] = max(DEFAULT_GRID, next_start - group[i]["start"])

    return notes


def split_hands(notes, split_point=DEFAULT_SPLIT):
    """
    Separa notas em mao esquerda e direita pelo ponto de divisao.

    Notas >= split_point -> mao direita.
    Notas <  split_point -> mao esquerda.
    """
    left = [n for n in notes if n["note"] < split_point]
    right = [n for n in notes if n["note"] >= split_point]
    return left, right


def simplify_notes(notes, hand="right"):
    """
    Cria versao simplificada mantendo apenas notas em tempos fortes.

    - Filtra para notas em beats inteiros e meios beats
    - Para acordes grandes, mantem as 2 notas mais proeminentes
    - Duracao minima de 0.5 beats
    """
    if not notes:
        return []

    # Filtrar para tempos fortes (mod 0.5 ~= 0)
    strong = []
    for n in notes:
        remainder = round(n["start"] % 0.5, 4)
        if remainder < 0.01 or remainder > 0.49:
            strong.append(n)

    if not strong:
        return [dict(n) for n in notes]

    # Agrupar notas simultaneas
    by_time = {}
    for n in strong:
        t = round(n["start"], 4)
        by_time.setdefault(t, []).append(n)

    simplified = []
    for t in sorted(by_time.keys()):
        group = by_time[t]
        if len(group) <= 2:
            simplified.extend(dict(n) for n in group)
        else:
            # Mao direita: notas mais agudas. Mao esquerda: mais graves.
            reverse = hand == "right"
            group.sort(key=lambda n: n["note"], reverse=reverse)
            simplified.extend(dict(n) for n in group[:2])

    # Duracao minima
    for n in simplified:
        if n["duration"] < 0.5:
            n["duration"] = 0.5

    simplified.sort(key=lambda x: (x["start"], x["note"]))
    return simplified


# ============================================================
# Geracao de JSON
# ============================================================

def calculate_midi_range(track_data):
    """Calcula o range MIDI efetivo usado em todas as tracks."""
    all_notes = []
    for t in track_data:
        all_notes.extend(n["note"] for n in t["notes"])
    if not all_notes:
        return {"lowest": 60, "highest": 72}
    return {"lowest": min(all_notes), "highest": max(all_notes)}


def calculate_total_duration(track_data):
    """Calcula duracao total em beats, arredondada para compasso completo."""
    max_end = 0
    for t in track_data:
        for n in t["notes"]:
            end = n["start"] + n["duration"]
            if end > max_end:
                max_end = end
    return math.ceil(max_end / 4) * 4


def build_song_json(metadata, track_data):
    """Constroi o JSON da musica no formato do player."""
    midi_range = calculate_midi_range(track_data)
    total_duration = calculate_total_duration(track_data)

    return {
        "id": metadata["id"],
        "title": metadata["title"],
        "artist": metadata["artist"],
        "source": metadata["source"],
        "category": metadata["category"],
        "bpm": metadata["bpm"],
        "timeSignature": [4, 4],
        "difficulty": metadata["difficulty"],
        "keySignature": metadata["key"],
        "totalDurationBeats": total_duration,
        "midiRange": midi_range,
        "tracks": [
            {
                "id": t["id"],
                "name": t["name"],
                "hand": t["hand"],
                "difficulty": t["difficulty"],
                "notes": t["notes"],
            }
            for t in track_data
            if t["notes"]
        ],
    }


def format_song_json(song):
    """
    Formata o JSON da musica com notas compactas (uma por linha).

    Metadados e estrutura usam indentacao padrao.
    Arrays de notas usam formato compacto para legibilidade.
    """
    lines = ["{"]

    # Metadados
    str_fields = ["id", "title", "artist", "source", "category"]
    for key in str_fields:
        lines.append(f'    "{key}": {json.dumps(song[key], ensure_ascii=False)},')

    lines.append(f'    "bpm": {song["bpm"]},')
    lines.append(f'    "timeSignature": {json.dumps(song["timeSignature"])},')
    lines.append(f'    "difficulty": {json.dumps(song["difficulty"])},')
    lines.append(f'    "keySignature": {json.dumps(song["keySignature"])},')
    lines.append(f'    "totalDurationBeats": {song["totalDurationBeats"]},')
    lines.append(f'    "midiRange": {{ "lowest": {song["midiRange"]["lowest"]}, "highest": {song["midiRange"]["highest"]} }},')

    # Tracks
    lines.append('    "tracks": [')
    for ti, track in enumerate(song["tracks"]):
        lines.append("        {")
        lines.append(f'            "id": {json.dumps(track["id"])},')
        lines.append(f'            "name": {json.dumps(track["name"], ensure_ascii=False)},')
        lines.append(f'            "hand": {json.dumps(track["hand"])},')
        lines.append(f'            "difficulty": {json.dumps(track["difficulty"])},')
        lines.append('            "notes": [')

        for ni, note in enumerate(track["notes"]):
            comma = "," if ni < len(track["notes"]) - 1 else ""
            parts = [
                f'"note": {note["note"]}',
                f'"start": {clean_number(note["start"])}',
                f'"duration": {clean_number(note["duration"])}',
                f'"velocity": {note["velocity"]}',
            ]
            lines.append(f'                {{ {", ".join(parts)} }}{comma}')

        lines.append("            ]")
        track_comma = "," if ti < len(song["tracks"]) - 1 else ""
        lines.append(f"        }}{track_comma}")

    lines.append("    ]")
    lines.append("}")
    return "\n".join(lines) + "\n"


# ============================================================
# Gerenciamento de catalogos
# ============================================================

def load_json(filepath, default):
    """Carrega JSON de arquivo ou retorna default."""
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    return default


def save_json(filepath, data):
    """Salva JSON formatado."""
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
        f.write("\n")


def update_catalog(song_json, output_path):
    """Adiciona ou atualiza entrada no catalogo do app."""
    catalog = load_json(CATALOG_FILE, {"songs": []})
    rel_path = os.path.relpath(output_path, SONGS_DIR).replace("\\", "/")

    entry = {
        "id": song_json["id"],
        "file": rel_path,
        "title": song_json["title"],
        "artist": song_json["artist"],
        "source": song_json["source"],
        "category": song_json["category"],
        "difficulty": song_json["difficulty"],
        "midiRange": song_json["midiRange"],
    }

    existing = next((i for i, s in enumerate(catalog["songs"]) if s["id"] == entry["id"]), None)
    if existing is not None:
        catalog["songs"][existing] = entry
    else:
        catalog["songs"].append(entry)

    save_json(CATALOG_FILE, catalog)


def update_index(midi_file, song_id, params):
    """Registra conversao no indice de MIDIs."""
    index = load_json(INDEX_FILE, [])
    midi_basename = os.path.basename(midi_file)

    entry = {
        "file": midi_basename,
        "songId": song_id,
        "convertedAt": str(date.today()),
        "params": params,
    }

    existing = next((i for i, e in enumerate(index) if e["file"] == midi_basename), None)
    if existing is not None:
        index[existing] = entry
    else:
        index.append(entry)

    save_json(INDEX_FILE, index)


# ============================================================
# Comandos CLI
# ============================================================

def cmd_analyze(args):
    """Exibe analise detalhada de um arquivo MIDI."""
    midi = parse_midi(args.file)

    print(f"\n{'=' * 60}")
    print(f"  {os.path.basename(args.file)}")
    print(f"{'=' * 60}")
    print(f"  Formato: {midi['format']}  |  Tracks: {len(midi['tracks'])}  |  Division: {midi['division']} ticks/beat")

    all_tempos = []
    for t in midi["tracks"]:
        all_tempos.extend(t["tempos"])

    if all_tempos:
        bpms = [t[1] for t in all_tempos]
        rounded = [round(b) for b in bpms]
        predominant = max(set(rounded), key=rounded.count)
        print(f"  BPM: {min(bpms):.0f}-{max(bpms):.0f} (predominante: {predominant})")
        print(f"  Eventos de tempo: {len(all_tempos)}")

    for i, t in enumerate(midi["tracks"]):
        notes = t["notes"]
        if not notes:
            print(f"\n  Track {i}: \"{t['name']}\" -- sem notas")
            continue

        min_note = min(n["note"] for n in notes)
        max_note = max(n["note"] for n in notes)
        max_end = max(n["start_tick"] + n["dur_tick"] for n in notes)
        dur_beats = max_end / midi["division"]

        print(f"\n  Track {i}: \"{t['name']}\"")
        print(f"    Notas: {len(notes)}")
        print(f"    Range: {note_name(min_note)} ({min_note}) - {note_name(max_note)} ({max_note})")
        print(f"    Duracao: {dur_beats:.0f} beats")

        # Distribuicao por oitava
        octaves = {}
        for n in notes:
            oct_num = n["note"] // 12 - 1
            octaves[oct_num] = octaves.get(oct_num, 0) + 1

        print("    Oitavas:")
        for oct_num in sorted(octaves.keys()):
            low = (oct_num + 1) * 12
            count = octaves[oct_num]
            bar = "#" * min(50, count // 5)
            print(f"      {oct_num} ({note_name(low)}-{note_name(low + 11)}): {count:4d} {bar}")

        below = sum(1 for n in notes if n["note"] < RANGE_LOW)
        above = sum(1 for n in notes if n["note"] > RANGE_HIGH)
        if below or above:
            print(f"    Fora do range C2-C7: {below} abaixo, {above} acima (serao transpostas)")

        # Primeiras 5 notas
        print("    Primeiras notas:")
        for n in sorted(notes, key=lambda x: x["start_tick"])[:5]:
            beat = n["start_tick"] / midi["division"]
            dur = n["dur_tick"] / midi["division"]
            print(f"      {note_name(n['note'])}({n['note']}) beat={beat:.2f} dur={dur:.2f} vel={n['vel']}")


def cmd_convert(args):
    """Converte MIDI para JSON do player."""
    midi = parse_midi(args.file)
    division = midi["division"]

    # Determinar BPM
    if args.bpm:
        bpm = args.bpm
    else:
        all_tempos = []
        for t in midi["tracks"]:
            all_tempos.extend(t["tempos"])
        if all_tempos:
            rounded = [round(t[1]) for t in all_tempos]
            bpm = max(set(rounded), key=rounded.count)
        else:
            bpm = 120

    print(f"  BPM: {bpm}")
    print(f"  Grade de quantizacao: {args.grid} beats")
    print(f"  Ponto de divisao: {note_name(args.split)} ({args.split})")

    # Identificar tracks com notas
    note_tracks = [(i, t) for i, t in enumerate(midi["tracks"]) if t["notes"]]
    print(f"  Tracks com notas: {len(note_tracks)}")

    # Processar e separar maos
    if len(note_tracks) >= 2:
        # Multiplas tracks: atribuir por pitch medio
        processed = []
        for idx, t in note_tracks:
            notes = process_notes(t["notes"], division, args.grid)
            notes = resolve_overlaps(notes)
            avg = sum(n["note"] for n in notes) / len(notes) if notes else 60
            processed.append((avg, notes, t["name"]))

        processed.sort(key=lambda x: x[0], reverse=True)
        right_notes = processed[0][1]
        left_notes = processed[-1][1] if len(processed) > 1 else []

        print(f"    Mao direita: {len(right_notes)} notas (track: \"{processed[0][2]}\")")
        if left_notes:
            print(f"    Mao esquerda: {len(left_notes)} notas (track: \"{processed[-1][2]}\")")
    else:
        # Track unica: dividir por pitch
        all_notes = process_notes(note_tracks[0][1]["notes"], division, args.grid)
        all_notes = resolve_overlaps(all_notes)
        left_notes, right_notes = split_hands(all_notes, args.split)
        print(f"    Track unica dividida em {note_name(args.split)}:")
        print(f"    Mao direita: {len(right_notes)} notas")
        print(f"    Mao esquerda: {len(left_notes)} notas")

    # Gerar versoes simplificadas
    right_simplified = simplify_notes(right_notes, hand="right")
    left_simplified = simplify_notes(left_notes, hand="left")

    def pct(part, whole):
        return f"{len(part) * 100 // max(1, len(whole))}%" if whole else "N/A"

    print(f"    Melodia simplificada: {len(right_simplified)} notas ({pct(right_simplified, right_notes)})")
    if left_notes:
        print(f"    Acompanhamento simplificado: {len(left_simplified)} notas ({pct(left_simplified, left_notes)})")

    # Montar tracks
    track_data = []
    if right_simplified:
        track_data.append({
            "id": "right-simplified", "name": "Melodia (simplificada)",
            "hand": "right", "difficulty": "beginner", "notes": right_simplified,
        })
    if right_notes:
        track_data.append({
            "id": "right-standard", "name": "Melodia",
            "hand": "right", "difficulty": "intermediate", "notes": right_notes,
        })
    if left_simplified:
        track_data.append({
            "id": "left-simplified", "name": "Acompanhamento (simplificado)",
            "hand": "left", "difficulty": "beginner", "notes": left_simplified,
        })
    if left_notes:
        track_data.append({
            "id": "left-standard", "name": "Acompanhamento",
            "hand": "left", "difficulty": "intermediate", "notes": left_notes,
        })

    # Construir JSON
    metadata = {
        "id": args.id, "title": args.title, "artist": args.artist,
        "source": args.source, "category": args.category,
        "bpm": bpm, "key": args.key, "difficulty": args.difficulty,
    }
    song = build_song_json(metadata, track_data)

    # Escrever arquivo
    output_dir = os.path.join(SONGS_DIR, args.category)
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"{args.id}.json")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(format_song_json(song))

    print(f"\n  JSON gerado: {os.path.relpath(output_path, PROJECT_ROOT)}")
    print(f"    Tracks: {len(song['tracks'])}")
    print(f"    Duracao: {song['totalDurationBeats']} beats")
    print(f"    Range: {note_name(song['midiRange']['lowest'])} - {note_name(song['midiRange']['highest'])}")

    # Atualizar catalogos
    update_catalog(song, output_path)
    print(f"    Catalogo atualizado: {os.path.relpath(CATALOG_FILE, PROJECT_ROOT)}")

    update_index(args.file, args.id, {
        "bpm": bpm, "split": args.split, "grid": args.grid, "key": args.key,
    })
    print(f"    Indice atualizado: {os.path.relpath(INDEX_FILE, PROJECT_ROOT)}")


def cmd_status(args):
    """Mostra status de conversao dos MIDIs."""
    index = load_json(INDEX_FILE, [])
    catalog = load_json(CATALOG_FILE, {"songs": []})

    converted = {e["file"]: e for e in index}
    catalog_ids = {s["id"] for s in catalog["songs"]}

    if not os.path.isdir(MIDIS_DIR):
        print(f"\n  Diretorio {MIDIS_DIR} nao encontrado.")
        return

    midi_files = sorted(f for f in os.listdir(MIDIS_DIR) if f.lower().endswith(".mid"))

    print(f"\n  MIDIs em {os.path.relpath(MIDIS_DIR, PROJECT_ROOT)}/")
    print(f"  {'=' * 70}")

    for f in midi_files:
        if f in converted:
            entry = converted[f]
            in_catalog = entry["songId"] in catalog_ids
            status = "OK" if in_catalog else "CONVERTIDO (fora do catalogo)"
            print(f"  [+] {f}")
            print(f"      -> {entry['songId']} | {entry['convertedAt']} | {status}")
        else:
            print(f"  [ ] {f}")
            print(f"      -> Nao convertido")

    total = len(midi_files)
    done = sum(1 for f in midi_files if f in converted)
    print(f"\n  {done}/{total} convertidos")


# ============================================================
# Main
# ============================================================

def main():
    parser = argparse.ArgumentParser(
        description="Conversor MIDI -> JSON para Tyghorn Melody",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    subparsers = parser.add_subparsers(dest="command")

    # analyze
    p_analyze = subparsers.add_parser("analyze", help="Analisa um arquivo MIDI")
    p_analyze.add_argument("file", help="Caminho do arquivo MIDI")

    # convert
    p_convert = subparsers.add_parser("convert", help="Converte MIDI para JSON")
    p_convert.add_argument("file", help="Caminho do arquivo MIDI")
    p_convert.add_argument("--id", required=True, help="ID da musica (slug)")
    p_convert.add_argument("--title", required=True, help="Titulo da musica")
    p_convert.add_argument("--artist", required=True, help="Compositor")
    p_convert.add_argument("--source", required=True, help="Origem (jogo, anime, etc.)")
    p_convert.add_argument("--category", required=True,
                           choices=["games", "animes", "movies", "artists"],
                           help="Categoria")
    p_convert.add_argument("--bpm", type=int, default=None,
                           help="BPM fixo (default: auto-detectar)")
    p_convert.add_argument("--key", default="C",
                           help="Tonalidade (default: C)")
    p_convert.add_argument("--difficulty", default="intermediate",
                           choices=["beginner", "intermediate", "advanced"],
                           help="Dificuldade base (default: intermediate)")
    p_convert.add_argument("--split", type=int, default=DEFAULT_SPLIT,
                           help=f"Ponto de divisao das maos, nota MIDI (default: {DEFAULT_SPLIT} = C4)")
    p_convert.add_argument("--grid", type=float, default=DEFAULT_GRID,
                           help=f"Grade de quantizacao em beats (default: {DEFAULT_GRID})")

    # status
    subparsers.add_parser("status", help="Status de conversao dos MIDIs")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    commands = {"analyze": cmd_analyze, "convert": cmd_convert, "status": cmd_status}
    commands[args.command](args)


if __name__ == "__main__":
    main()
