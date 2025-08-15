---
title: Audio-Video
slug: lesson2
sidebar_position: 3
--------------------

## Prerequisites

* **Hardware**

  * Raspberry Pi Pico / Pico W (RP2040)
  * Passive piezo buzzer connected to **GP2** and **GND**
  * Pimoroni **Pico Explorer Base** with 240x240 LCD
  * USB cable

* **Software**

  * Pimoroni MicroPython for the Pico
  * A MicroPython-capable editor

---

## Wiring (Audio)

* Wire the **AUDIO** pin on the board to **GP2**

---

## Part 1 - Making Sound with PWM

### PWM Basics (Quick Theory)

* A PWM signal flips between HIGH and LOW at a **frequency** (Hz).
* We want to emulate a sine wave for a specific frequency. The highest volume will be at 50% duty cycle.

### Hello, Tone!

```python
from machine import Pin, PWM
from time import sleep

pwm = PWM(Pin(2))

def tone(freq_hz, duty=32768):
    pwm.freq(freq_hz)
    pwm.duty_u16(duty)

def silence():
    pwm.duty_u16(0)

# Play three tones
tone(440)   # A4
sleep(0.5)
tone(523)   # C5
sleep(0.5)
tone(659)   # E5
sleep(0.5)
silence()

# When done (optional):
# pwm.deinit()
```

#### Notes helper

```python
NOTES = {
    "C4": 261, "D4": 294, "E4": 329, "F4": 349, "G4": 392, "A4": 440, "B4": 494,
    "C5": 523, "D5": 587, "E5": 659, "F5": 698, "G5": 784, "A5": 880, "B5": 988,
}
```

### Melody Player (with rests)

```python
from machine import Pin, PWM
from time import sleep

pwm = PWM(Pin(2))
pwm.duty_u16(0)

NOTES = {"C4":261, "D4":294, "E4":329, "F4":349, "G4":392, "A4":440, "B4":494, "C5":523}

def play_note(name, duration=0.3, duty=30000):
    if name == "REST" or name is None:
        pwm.duty_u16(0)
        sleep(duration)
        return
    freq = NOTES.get(name, 0)
    if freq > 0:
        pwm.freq(freq)
        pwm.duty_u16(duty)
        sleep(duration)
        pwm.duty_u16(0)

melody = [
    ("C4", 0.25), ("D4", 0.25), ("E4", 0.25), ("REST", 0.1),
    ("E4", 0.25), ("D4", 0.25), ("C4", 0.25), ("REST", 0.2),
    ("C4", 0.25), ("G4", 0.25), ("C5", 0.35),
]

for name, dur in melody:
    play_note(name, dur)

# pwm.deinit()
```

### Exercises - Audio

1. **Scales Up & Down**
   Play C major ascending and descending (C4->C5->C4), with 0.2s per note.

2. **Volume Envelope**
   For each note, start with low `duty_u16`, ramp up, then ramp down.

3. **Tempo Control**
   Add a `bpm` parameter and convert beats to seconds (quarter note = 60/bpm).

5. **Arpeggiator**
   Cycle through a chord (e.g., C-E-G) at a set rate for 5 seconds.

---

## Part 2 - Drawing on the Pico Explorer with PicoGraphics

:::note
Look on the [pimoroni github repo](https://github.com/pimoroni/pimoroni-pico/tree/main/micropython/modules/picographics) for the documentation.
:::

### Set Up the Display

```python
from picographics import PicoGraphics, DISPLAY_PICO_EXPLORER

display = PicoGraphics(display=DISPLAY_PICO_EXPLORER)
W, H = display.get_bounds()   # expected 240x240
```

### Pens, Clear, Text

```python
from picographics import PicoGraphics, DISPLAY_PICO_EXPLORER

display = PicoGraphics(display=DISPLAY_PICO_EXPLORER)
W, H = display.get_bounds()

BLACK = display.create_pen(0, 0, 0)
WHITE = display.create_pen(255, 255, 255)
RED   = display.create_pen(255, 0, 0)

display.set_pen(BLACK)
display.clear()

display.set_pen(RED)
display.rectangle(10, 10, 100, 15)

display.set_pen(WHITE)
display.text("Hello IPW!", 10, 10, W, 2)  # (text, x, y, wrap, scale)

display.update()
```

### Shapes & Animation Loop (basic)

```python
from picographics import PicoGraphics, DISPLAY_PICO_EXPLORER
from time import sleep

display = PicoGraphics(display=DISPLAY_PICO_EXPLORER)
W, H = display.get_bounds()
bg = display.create_pen(10, 10, 40)
fg = display.create_pen(240, 240, 240)
ball = display.create_pen(0, 200, 200)

x, y = 30, 30
vx, vy = 3, 2
r = 12

while True:
    display.set_pen(bg); display.clear()
    display.set_pen(fg); display.text("Bouncy!", 10, 10, W, 2)
    display.set_pen(ball); display.circle(int(x), int(y), r)
    display.update()

    x += vx; y += vy
    if x < r or x > W - r: vx = -vx
    if y < r or y > H - r: vy = -vy
    sleep(0.01)
```

### Exercises - Display

1. **Centered Text**
   Write a helper `draw_centered(text, y, pen, scale)` that measures text using `display.measure_text(...)` and centers it.

2. **Progress Bar**
   Draw a horizontal bar that fills from 0% to 100% over 3 seconds.

3. **Color Cycler**
   Animate the background hue over time (convert HSV->RGB).

4. **Sprite Sheet (Simple)**
   Simulate a 2-frame sprite: alternate between two rectangles (different colors) to "blink".

5. **FPS Counter**
   Display frames per second by counting frames in 1 second windows.

---

## Part 3 - Putting It Together: Audio-Reactive Visuals

### Visual Metronome (with Click)

```python
from machine import Pin, PWM
from time import ticks_ms, ticks_diff, sleep
from picographics import PicoGraphics, DISPLAY_PICO_EXPLORER

# --- Audio ---
BUZZER_PIN = 2
pwm = PWM(Pin(BUZZER_PIN))
pwm.duty_u16(0)

def click(freq=1000, dur_ms=40, duty=25000):
    pwm.freq(freq)
    pwm.duty_u16(duty)
    sleep(dur_ms/1000)
    pwm.duty_u16(0)

# --- Display ---
display = PicoGraphics(display=DISPLAY_PICO_EXPLORER)
W, H = display.get_bounds()
BLACK = display.create_pen(0,0,0)
WHITE = display.create_pen(255,255,255)
ACCENT = display.create_pen(0,200,120)

BPM = 120
beat_ms = int(60000 / BPM)
last = ticks_ms()
beat = 0

while True:
    now = ticks_ms()
    if ticks_diff(now, last) >= beat_ms:
        last = now
        beat = (beat + 1) % 4
        click(1000 if beat == 0 else 800)

    phase = ticks_diff(now, last) / beat_ms  # 0..1 within a beat
    radius = int(20 + 40 * (1 - phase))

    display.set_pen(BLACK); display.clear()
    display.set_pen(WHITE)
    display.text("METRONOME", 8, 8, W, 2)
    display.text("BPM: %d" % BPM, 8, 30, W, 2)
    display.set_pen(ACCENT)
    display.circle(W//2, H//2, radius)
    display.update()

    sleep(0.005)
```

### Mini "Frequency Viz" (maps frequency to bar width)

```python
from machine import Pin, PWM
from time import sleep
from picographics import PicoGraphics, DISPLAY_PICO_EXPLORER

display = PicoGraphics(display=DISPLAY_PICO_EXPLORER)
W, H = display.get_bounds()
BG = display.create_pen(0,0,0)
BAR = display.create_pen(255,180,0)
TXT = display.create_pen(220,220,220)

BUZZER_PIN = 2
pwm = PWM(Pin(BUZZER_PIN))
pwm.duty_u16(0)

NOTES = [261, 294, 329, 349, 392, 440, 494, 523]  # C4..C5

def play_and_draw(freq, ms=300):
    pwm.freq(freq)
    pwm.duty_u16(28000)

    display.set_pen(BG); display.clear()
    display.set_pen(TXT)
    display.text("Freq: %d Hz" % freq, 10, 10, W, 2)

    # map 200..1000 Hz -> 0..W
    width = int((freq - 200) * (W / (1000 - 200)))
    width = max(0, min(W, width))

    display.set_pen(BAR)
    display.rectangle(0, H//2 - 20, width, 40)
    display.update()

    sleep(ms/1000)
    pwm.duty_u16(0)
    sleep(0.08)

while True:
    for f in NOTES:
        play_and_draw(f)
```

---

## Bigger Practice Set (Mix & Match)

1. **Piano Keys UI**
   Draw 4 on-screen "keys" (rectangles). Highlight the active key as you play a scale. Add button inputs (A/B/X/Y).

2. **Christmas Tree++**
   Add music to yesterday's Christmas tree.

3. **Simon Says**
   Flash a colored sequence (rectangles) while playing matching tones. Then wait for the user to repeat via buttons. Increase length each round.

4. **Rhythm Game**
   Drop circles from the top at beat times; the user taps a button when they hit a target line. Score accuracy. Beep on hits.

5. **Scope-ish View**
   Fake an oscilloscope by drawing a sine curve for the current freq. (Use `math.sin` to plot `y = mid + amp*sin(2 * pi * f * x)`.)

6. **Real music!**
   Get a **MIDI** file and transform it into tones using [this website](https://www.extramaster.net/tools/midiToArduino/). Play the song!
