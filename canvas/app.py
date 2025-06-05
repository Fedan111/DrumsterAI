from flask import Flask, request, jsonify, render_template
import os, shutil, json
import tempfile
from flask_socketio import SocketIO
import time
app_start_time = time.time()
import mido
import threading

global_current_time = 0.0

lock = threading.Lock()

app = Flask(__name__, static_folder='static', template_folder='templates')
socketio = SocketIO(app, cors_allowed_origins="*")

# Очистка data.json при заходе на главную
@app.route('/')
def index():
    return render_template('live_canvas.html')

# Получение списка песен из json_library
@app.route('/list-songs')
def list_songs():
    songs_dir = 'static/json_library'
    songs = [f.replace('.json', '') for f in os.listdir(songs_dir) if f.endswith('.json')]
    return jsonify({"songs": songs})


# Загрузка выбранной песни в рабочий data.json
@app.route('/load-song', methods=['POST'])
def load_song():
    song_name = request.json.get('song')
    src = f'static/json_library/{song_name}.json'
    dst = 'static/notes/data.json'
    try:
        with open(src, 'r') as f:
            song_data = json.load(f)
        # Проверяем наличие обязательных полей у каждой ноте
        for note in song_data.get("originalNotes", []):
            if "time" not in note or "instrument" not in note:
                return jsonify({"error": "Формат файла некорректен: каждой ноте должны соответствовать 'time' и 'instrument'."}), 400
        # Удаляем поле "played" из originalNotes, если оно есть
        for note in song_data.get("originalNotes", []):
            note.pop("played", None)

        # Очищаем studentNotes полностью
        song_data["studentNotes"] = []
        global app_start_time
        # Сброс времени начала приложения при загрузке новой песни
        app_start_time = time.time()

        # Очистить старые studentNotes из текущего data.json
        if os.path.exists(dst):
            try:
                with open(dst, 'r') as f:
                    existing = json.load(f)
                existing["studentNotes"] = []
                print("⏱️ app_start_time сброшено при загрузке новой песни")
                with open(dst, 'w') as f:
                    json.dump(existing, f, indent=2)
                print("🧹 Старые studentNotes очищены перед загрузкой новой песни.")
            except Exception as e:
                print(f"⚠️ Не удалось очистить старые studentNotes: {e}")
        print(f"✅ Загружено нот: {len(song_data['originalNotes'])}")
        print(f"🎼 Устанавливаем song_data в data.json с {len(song_data['originalNotes'])} нотами")
        with open(dst, 'w') as f:
            json.dump(song_data, f, indent=2)
            print("📥 Новый data.json успешно записан")
        return jsonify({"message": f"Песня {song_name} загружена"})
    except FileNotFoundError:
        return jsonify({"error": "Файл не найден"}), 404

@socketio.on("student_hit")
def handle_student_hit(data):
    # Данные приходят через socketio.emit из midi_listener()
    # Просто логируем или можем обработать, если нужно
    print(f"🥁 Получен удар: {data}")

# Преобразование MIDI в JSON и сохранение в библиотеку
from werkzeug.utils import secure_filename
import pretty_midi

@app.route('/upload-midi', methods=['POST'])
def upload_midi():
    file = request.files.get('file')
    song_name = request.form.get('name')

    if not file or not song_name:
        return jsonify({"error": "Файл и имя обязательны"}), 400

    filename = secure_filename(file.filename)
    midi_path = f'static/uploads/{filename}'
    json_path = f'static/json_library/{song_name}.json'

    # Сохраняем MIDI
    file.save(midi_path)

    try:
        # Обработка MIDI в JSON
        midi = pretty_midi.PrettyMIDI(midi_path)
        drum_notes = []
        DRUM_MAP = {
            36: "kick", 38: "snare", 40: "snare",
            42: "hihat", 46: "hihat"
        }

        print(f"🎧 Обнаружено дорожек: {len(midi.instruments)}")
        for instr in midi.instruments:
            print(f"🎵 Инструмент: {instr.name if instr.name else 'Без имени'} | is_drum={instr.is_drum} | notes={len(instr.notes)}")
            if True:  # временно анализируем все дорожки, даже если is_drum=False
                for note in instr.notes:
                    print(f"    🥁 Нота: pitch={note.pitch}, start={note.start}")
                    if note.pitch in DRUM_MAP:
                        drum_notes.append({
                            "time": round(note.start, 3),
                            "instrument": DRUM_MAP[note.pitch]
                        })

        bpm_changes = midi.get_tempo_changes()[1]
        bpm = round(bpm_changes[0]) if len(bpm_changes) > 0 else 120

        output = {
            "BPM": bpm,
            "originalNotes": sorted(drum_notes, key=lambda x: x["time"])
        }

        for note in output.get("originalNotes", []):
            note.pop("played", None)

        with open(json_path, 'w') as f:
            json.dump(output, f, indent=2)

        # Очистим и подготовим data.json только при генерации новой песни
        output["studentNotes"] = []
        file_path = 'static/notes/data.json'
        with open(file_path, 'w') as f:
            json.dump(output, f, indent=2)

        return jsonify({"message": f"Песня '{song_name}' успешно добавлена в библиотеку."})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@socketio.on("beat_position")
def handle_beat_position(time_position):
    global global_current_time
    global_current_time = time_position

# MIDI listener in a separate thread
def midi_listener():
    try:
        with mido.open_input() as port:
            print("🎹 MIDI-вход открыт. Ожидаем события...")
            for msg in port:
                if msg.type == 'note_on' and msg.velocity > 0:
                    socketio.emit('student_hit', {
                        'note': msg.note,
                        'time': time.time()
                    })

                    # --- Безопасная запись в data.json ---
                    file_path = 'static/notes/data.json'
                    # Преобразование note в инструмент
                    midi_to_instrument = {
                        36: "kick",
                        38: "snare",
                        42: "hihat",
                        40: "snare",
                        46: "hihat"
                    }
                    instrument = midi_to_instrument.get(msg.note, "unknown")

                    now = time.time()
                    current_time = round(global_current_time, 3)
                    if current_time == 0.0:
                        continue  # пропустить ноты с нулевым временем
                    data = {
                        "note": msg.note,
                        "instrument": instrument,
                        "time": current_time
                    }
                    with lock:
                        try:
                            if os.path.exists(file_path):
                                try:
                                    with open(file_path, 'r') as f:
                                        existing = json.load(f)
                                except json.JSONDecodeError:
                                    print("⚠️ Повреждённый JSON. Пересоздаю.")
                                    existing = {
                                        "originalNotes": [],
                                        "studentNotes": []
                                    }
                            else:
                                existing = {
                                    "originalNotes": [],
                                    "studentNotes": []
                                }

                            existing.setdefault("studentNotes", []).append(data)

                            matched = False
                            for original in existing.get("originalNotes", []):
                                if original["instrument"] == instrument and abs(original["time"] - current_time) <= 0.2:
                                    data["hit"] = True
                                    original["matched"] = True
                                    matched = True
                                    break
                            if not matched:
                                data["hit"] = False

                            with tempfile.NamedTemporaryFile('w', delete=False, dir='static/notes', suffix='.json') as tf:
                                json.dump(existing, tf, indent=2)
                                tf.flush()
                                os.fsync(tf.fileno())
                                temp_name = tf.name
                            os.replace(temp_name, file_path)
                        except Exception as e:
                            print(f"❌ Ошибка при записи в файл: {e}")
    except Exception as e:
        print(f"⚠️ Ошибка MIDI-входа: {e}")


if __name__ == '__main__':
    threading.Thread(target=midi_listener, daemon=True).start()
    socketio.run(app, debug=True)