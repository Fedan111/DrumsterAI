import time
import threading
import json
from mido import open_input

canvas_time = 0.0

# === Настройки ===
BPM = 120
GRID_DIVISION = 4  # четвертные: 1/4 → восьмые: 1/8 → шестнадцатые: 1/16
TOLERANCE_BEAT = 0.125  # допуск для попадания в долю
NOTE_MAP = {
    36: "kick",
    38: "snare",
    42: "hihat"
}

# === Общие переменные ===
student_grid = []  # сетка из student notes
current_beat = 0.0
start_time = None
lock = threading.Lock()
original_notes = []


def create_beat_grid():
    # Загрузка originalNotes из файла
    with open("static/notes/data.json", "r") as f:
        data = json.load(f)

    with lock:
        student_grid.clear()


def add_student_note_on_beat(beat_time, original_notes):
    with lock:
        for note in original_notes:
            if (
                note["time"] == beat_time
                and not any(n["time"] == beat_time and n["note"] == note.get("note") for n in student_grid)
            ):
                print(f"🧱 Добавляем ноту: {note.get('note')} на beat_time {beat_time}")
                student_grid.append({
                    "time": note["time"],
                    "note": note.get("note"),
                    "instrument": note.get("instrument"),
                    "played": None
                })


def midi_listener():
    global original_notes
    with open_input() as port:
        while True:
            msg = port.receive()
            if msg.type == 'note_on' and msg.velocity > 0:
                if start_time is None:
                    continue
                beat_time = round(time.time() - start_time, 3)
                print(f"🥁 Удар: {msg.note}, beat_time: {beat_time}")

                with lock:
                    matched = False
                    for note in original_notes:
                        if note.get("instrument") == NOTE_MAP.get(msg.note) and abs(note["time"] - beat_time) <= TOLERANCE_BEAT:
                            matched = True
                            break
                    if not matched:
                        print("❗ Промах: ни одна нота не совпала по инструменту — сохраняем как отдельный удар")
                    # Фиксация сыгранной ноты ученика в student_grid
                    if beat_time > 0.05:
                        instrument = NOTE_MAP.get(msg.note, "unknown")
                        hit = False
                        for note in original_notes:
                            if note.get("instrument") == instrument and abs(note["time"] - beat_time) <= TOLERANCE_BEAT:
                                hit = True
                                note["matched"] = True
                                break
                        student_grid.append({
                            "time": beat_time,
                            "note": msg.note,
                            "instrument": instrument,
                            "played": True,
                            "hit": hit
                        })


def start_recording():
    global start_time
    global original_notes
    start_time = time.time()

    with open("static/notes/data.json", "r") as f:
        data = json.load(f)
    original_notes = data.get("originalNotes", [])

    with lock:
        student_grid.clear()
        print("🧹 student_grid очищен при старте записи")

    threading.Thread(target=midi_listener, daemon=True).start()
