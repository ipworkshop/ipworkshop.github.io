---
id: setup
title: Install & Set Up MicroPython
sidebar_label: Setup
sidebar_position: 1
description: Step-by-step guide to flash MicroPython on a Raspberry Pi Pico W with the Pimoroni Explorer extension board, using the official Raspberry Pi Pico extension for VS Code.
---

## Prerequisites

* **Hardware**

  * Raspberry Pi **Pico W** (RP2040 + Wi-Fi)
  * **Pimoroni Explorer Pico W** extension board
    (provides motors, analog sensors, capacitive touch, LEDs, and more)
  * USB data cable (USB-A/USB-C to micro-USB)
* **Software**

  * [Visual Studio Code](https://code.visualstudio.com/) installed
  * **Raspberry Pi Pico** extension for VS Code

:::tip Why use the extension?
The official Raspberry Pi Pico extension streamlines:

* Creating a MicroPython project
* Opening a REPL
* Uploading files to the Pico W
:::
:::note
Alternatively, you can use [Wyliodrin Studio](https://ecothings.wyliodrin.studio/).
:::

---

## 1) Install the Raspberry Pi Pico extension

1. Open **VS Code**.
2. Go to **Extensions** (left sidebar) -> search for **"Raspberry Pi Pico"**.
3. Install the extension published by **Raspberry Pi**.

---

## 2) How to open the VS Code Command Palette

The **Command Palette** is where you access all extension commands.

* **Windows / Linux:** Press `Ctrl + Shift + P`
* **macOS:** Press `Cmd + Shift + P`

You can also open it from the menu:
**View -> Command Palette...**

---

## 3) Create a MicroPython project (via the extension)

1. Open the **Command Palette** (`Ctrl/Cmd + Shift + P`).
2. Search for and select: **`Pico: New Project (MicroPython)`**.
3. Choose a folder for your project.
4. When asked for **Board**, pick **Raspberry Pi Pico W**.

---

## 4) Flash the MicroPython firmware

If firmware was already flashed, skip to step 5.

1. **Unplug** the Pico W from USB.
2. **Hold down** the **BOOTSEL** button on the Pico.
3. While holding, **connect** the USB cable to your computer.
4. Release the button when a USB mass-storage drive (e.g., `RPI-RP2`) appears.
5. Download the latest release for pimoroni **picow** micropython from the [releases](https://github.com/pimoroni/pimoroni-pico/releases) page.
6. Copy the `.uf2` file to the `RPI-RP2` drive.

---

## 5) Common VS Code commands for Pico W

Open the **Command Palette** and look for:

* **`Pico: New Project (MicroPython)`**
* **`Pico: Flash MicroPython (UF2)`**
* **`Pico: Open REPL`**
* **`Pico: Upload Project to Pico`**

---

## 6) Troubleshooting

### The `RPI-RP2` drive doesn't appear (BOOTSEL)

* Try a **different USB cable** (some are charge-only).
* Hold **BOOTSEL**, plug in, then release **after** connecting.
* Use a direct USB port (avoid hubs).

### REPL/serial port not found

* **Windows**: Check **Device Manager -> Ports (COM & LPT)**.
* **macOS**: Look for `/dev/tty.usbmodem*`.
* **Linux**: Look for `/dev/ttyACM*`. You may need to add your user to the `dialout` group and re-login:

  ```bash
  sudo usermod -a -G dialout $USER
  ```

  If still blocked, confirm your **udev** rules allow access to `ttyACM`.

### Upload succeeds but nothing runs

* Open the **REPL** to see exceptions printed at startup.

## 7) Useful links

* [rp2 micropython documentation](https://docs.micropython.org/en/latest/rp2/quickref.html)
* [Pimoroni examples and libraries](https://github.com/pimoroni/pimoroni-pico)

---
