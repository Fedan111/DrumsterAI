# 🥁 Drumster AI — current repo layout (`canvas/` + `site/`)

> **Статус на сегодня**  
> * `canvas/` — Flask-сервер + HTML Canvas для отображения барабанных нот  
> * `site/`   — маркетинговый сайт (React / Lovable)  

README объясняет **как запустить проект сейчас** и **к какой структуре (backend / frontend) будем переходить**, чтобы Codex / Copilot мог легко помогать с рефакторингом.

---

## 1  Текущая структура
DrumsterAI/
├─ canvas/              # Flask + Socket.IO + live_canvas.html
│  ├─ app.py
│  ├─ static/
│  ├─ templates/
│  ├─ midi_listener.py
│  └─ … (Python utils)
├─ site/                # Lovable-сгенерированный React-фронт
│  ├─ package.json
│  ├─ vite.config.js (или next.config.js)
│  └─ src/
└─ README.md            # вы читаете его
---

## 2  Как запустить **сейчас**

### 2.1  Backend (canvas)

```bash
cd canvas
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt      # если файла нет – см. ниже
python app.py                        # http://localhost:5000/live_canvas.html
<details>
<summary>Мини-requirements, если нужен</summary>
Flask
flask-socketio
eventlet
mido
pretty_midi
python-rtmidi
setuptools
</details>
2.2  Frontend (site)
cd site
npm install
npm run dev                          # http://localhost:3000
Чтобы увидеть Canvas внутри сайта, временно открой http://localhost:5000/live_canvas.html
или вставь в React-страницу компонент
<iframe src="http://localhost:5000/live_canvas.html" />.

⸻

3  Куда идём — логичная схема backend / frontend
ai-drum-teacher/
├─ backend/                  # весь Python-код
│  ├─ app.py
│  ├─ static/ templates/
│  ├─ drum_split/            # Demucs + Klang wrappers
│  ├─ midi_tools/            # midi_listener.py и др.
│  └─ requirements.txt
└─ frontend/                 # весь клиент-код
    ├─ canvas/               # JS/TS логика Canvas
    └─ site/                 # React (Lovable)
Зачем
	•	отделяем зависимости (Python ≠ Node),
	•	удобный CI/CD,
	•	понятно новым контрибьютерам.

Подсказка Copilot-у для рефакторинга
Перемести canvas/static, templates, app.py в backend/
Перемести canvas/js-часть в frontend/canvas
Перемести site в frontend/site
Создай backend/requirements.txt, обнови пути в backend/app.py
4  Дальнейшие шаги
Sprint
Задача
Инструмент
S-1
requirements.txt, CORS, проброс портов
Codex
S-2
Перенос в backend/frontend
git mv + Copilot
S-3
Страница /practice с Canvas-iframe
Lovable
S-4
Demucs → Klang API + авто-ноты
Python, n8n
S-5
AI-Teacher (GPT-4o)
Flask route + JS chat
S-6
Stripe / Auth
React, Supabase, Stripe
5  FAQ

Почему предупреждения ALSA/rtmidi?
В облаке нет физического MIDI-устройства — не мешает Canvas.

Как обновлять Lovable-сайт?
Правь визуально → Publish → push в frontend/site.

Как звать Codex?
В Codespaces:
# Создай эндпоинт /health, верни JSON {"ok":true}"

⸻

Happy drumming & coding ! 🥁🚀
