import mido
import time
import requests
import os
import json

# Настройка: имя MIDI-входа
MIDI_INPUT_NAME = '–î—Ä–∞–π–≤–µ—Ä IAC IAC Input'
N8N_WEBHOOK_URL = 'http://localhost:5678/webhook-test/student-midi'

# Простая карта нот → инструменты
NOTE_TO_INSTRUMENT = {
    36: 'kick',
    38: 'snare',
    40: 'snare',
    42: 'hihat',
    46: 'hihat',
    49: 'crash',
    51: 'ride',
    45: 'tom',
    48: 'tom',
    41: 'floor tom'
}

print("🔁 MIDI-бработчик запускается...")

start_time = None
reset_requested = False

import socketio
sio = socketio.Client()

try:
    sio.connect('http://localhost:5000')
    print("📡 Socket.IO подключен")
except Exception as e:
    print(f"❌ Socket.IO ошибка подключения: {e}")

@sio.on('start_canvas_now')
def handle_start_canvas():
    global start_time
    start_time = time.time()
    print("▶️ Старт канвы зафиксирован")


# Новый обработчик события reset_timer
@sio.on('reset_timer')
def handle_reset_timer():
    global start_time
    start_time = None
    print("🔄 Таймер сброшен (reset_timer)")

@sio.on('reset_canvas_timer')
def handle_reset_canvas_timer():
    global start_time
    start_time = None
    print("⏹️ Таймер studentNotes сброшен после загрузки песни")

try:
    with mido.open_input(MIDI_INPUT_NAME) as inport:
        print(f"✅ Подключено к: {MIDI_INPUT_NAME}")

        for msg in inport:
            if msg.type == 'note_on' and msg.velocity > 0:
                if start_time is None:
                    continue
                elapsed = round(time.time() - start_time, 3)
                if elapsed == 0.0:
                    print("⚠️ Удар проигнорирован из-за времени 0.0")
                    continue
                instrument = NOTE_TO_INSTRUMENT.get(msg.note, 'unknown')

                data = {
                    'note': msg.note,
                    'velocity': msg.velocity,
                    'time': elapsed,
                    'raw_time': time.time(),
                    'instrument': instrument
                }

                file_path = 'data.json'

                try:
                    # Загружаем существующий JSON или создаём новый, если файл не существует
                    if os.path.exists(file_path):
                        with open(file_path, 'r') as f:
                            existing = json.load(f)
                    else:
                        existing = {
                            "originalNotes": [],
                            "studentNotes": []
                        }


                    # Добавляем удар в массив studentNotes
                    if "studentNotes" not in existing:
                        existing["studentNotes"] = []

                    existing["studentNotes"].append(data)

                    with open(file_path, 'w') as f:
                        json.dump(existing, f, indent=2)
                except Exception as e:
                    print(f"❌ Ошибка при записи в файл: {e}")

                print(f"🥁 Удар: {data}")
                try:
                    requests.post(N8N_WEBHOOK_URL, json=data)
                except Exception as e:
                    print(f"❌ Ошибка отправки в n8n: {e}")

except Exception as e:
    print(f"❌ Не удалось подключиться к MIDI: {e}")
