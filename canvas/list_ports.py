import mido

print("🎛 Доступные MIDI-входы:")
for name in mido.get_input_names():
    print(f"👉 '{name}'")