---
title: WiFi
slug: lesson3
sidebar_position: 4
--------------------

## Prerequisites

* **Hardware**

  * Raspberry Pi Pico **W** (Wi-Fi capable)
  * USB cable

* **Software**

  * A MicroPython-capable editor
  * Python 3 installed on your PC for running Flask

* **Networking**

  * A 2.4 GHz Wi-Fi network (Pico W does not support 5 GHz)
  * Internet access for public API exercises

---

## Part 1 - Connecting to Wi-Fi

The Pico W uses the `network` module for Wi-Fi.

```python
import network
import time

SSID = "your_wifi_name"
PASSWORD = "your_wifi_password"

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(SSID, PASSWORD)

print("Connecting to Wi-Fi", end="")
while not wlan.isconnected():
    print(".", end="")
    time.sleep(0.5)
print("\nConnected!")
print("IP address:", wlan.ifconfig()[0])
```

**Notes:**

* Use `wlan.ifconfig()` to get `(ip, subnet, gateway, dns)`.
* Connection loops are common; add a timeout in production.

---

## Part 2 - Talking to Public APIs

### Public APIs Resource

A great resource is the **Public APIs** [repo](https://github.com/public-apis/public-apis).
It lists hundreds of free, open APIs - weather, astronomy, jokes, space, finance, etc.

---

### Fetching Data (JSON)

MicroPython includes a minimal `urequests` library (install it if your firmware doesn't have it).

Example: **Fetching a random joke** from `https://official-joke-api.appspot.com/random_joke`

```python
import network
import urequests
import time

# --- connect to wifi ---
SSID = "your_wifi_name"
PASSWORD = "your_wifi_password"

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(SSID, PASSWORD)
while not wlan.isconnected():
    time.sleep(0.5)

# --- API request ---
url = "https://official-joke-api.appspot.com/random_joke"
response = urequests.get(url)
data = response.json()
response.close()

print("Joke:", data["setup"])
print("Punchline:", data["punchline"])
```

---

### Example: NASA Astronomy Picture of the Day

This requires a free API key (sign up at [https://api.nasa.gov](https://api.nasa.gov)).

```python
import urequests

API_KEY = "DEMO_KEY"  # replace with your key
url = f"https://api.nasa.gov/planetary/apod?api_key={API_KEY}"

resp = urequests.get(url)
info = resp.json()
resp.close()

print("Title:", info["title"])
print("Date:", info["date"])
print("URL:", info["url"])
print("Explanation:", info["explanation"])
```

---

### Exercises - Public API Practice

1. **Weather Fetcher**
   Use [Open-Meteo](https://open-meteo.com/en/docs) (no API key) to get the current temperature in your city.

2. **Crypto Price Display**
   Use [CoinGecko API](https://www.coingecko.com/en/api/documentation) to fetch Bitcoin and Ethereum prices in USD.

3. **SpaceX Launch Info**
   From `https://api.spacexdata.com/v4/launches/next`, print mission name, date, and rocket ID.

4. **Trivia Game**
   Use [Open Trivia Database](https://opentdb.com/api_config.php) to get 5 random questions. Ask the user to answer via REPL.

5. **Daily Cat Picture**
   Use [The Cat API](https://thecatapi.com/) to fetch a random cat image URL and print it.

---

## Part 3 - Running a server on the Pico

```python
import network, socket, time, json

# --- Wi-Fi ---
SSID = "your_wifi_name"
PASSWORD = "your_wifi_password"

def wifi_connect():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)    
    wlan.connect(SSID, PASSWORD)
    while not wlan.isconnected():
        time.sleep(0.2)
    return wlan

wlan = wifi_connect()
HOST = wlan.ifconfig()[0]
print("Pico listening at http://%s:80" % HOST)

# --- HTTP helpers ---
def http_response(conn, code=200, ctype="application/json", body="{}"):
    msg = "HTTP/1.1 %d OK\r\nContent-Type: %s\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: %d\r\n\r\n%s" % (
        code, ctype, len(body), body)
    conn.sendall(msg)

def parse_request(req_bytes):
    try:
        head = req_bytes.decode().split("\r\n")[0]
        method, path, _ = head.split(" ")
        return method, path
    except:
        return None, None

def query_value(path, key, default=None):
    if "?" not in path: return default
    qs = path.split("?", 1)[1]
    for pair in qs.split("&"):
        if "=" in pair:
            k, v = pair.split("=", 1)
            if k == key: return v
    return default

# --- Server loop ---
addr = socket.getaddrinfo("0.0.0.0", 80)[0][-1]
s = socket.socket()
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(addr)
s.listen(1)

value=1
while True:
    conn, _ = s.accept()
    try:
        req = conn.recv(1024)
        method, path = parse_request(req)
        if not method:
            http_response(conn, 400, "text/plain", "Bad Request")
            continue

        if path.startswith("/get"):
            http_response(conn, body=json.dumps({"val": value}))

        elif path.startswith("/set"):
            value = int(query_value(path, "val", "0"))
            http_response(conn, 200, "text/plain", f"Ok! Set value to {value}")

        else:
            http_response(conn, 200, "text/plain",
                          "Endpoints: /get, /set?val={int}")
    except Exception as e:
        http_response(conn, 500, "text/plain", "Error: %s" % e)
    finally:
        conn.close()
```

---

### Exercises

1. **Smart Sensor**
   Create an API to retrieve sensor data.
2. **Smart LED**
   Create an API to control a LED.
3. **Communication**
   Make a request to another pico!

---

## Part 4 - Creating a Local Flask Server

We'll now **run a Flask server on your PC** and have the Pico W connect to it.

### Install Flask

On your PC:

```bash
pip install flask
```

---

### Minimal Flask Server (`server.py`)

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

# Example data store
messages = []

@app.route("/")
def index():
    return "Hello from Flask!"

@app.route("/api/echo", methods=["GET"])
def echo():
    msg = request.args.get("msg", "")
    return jsonify({"you_sent": msg})

@app.route("/api/messages", methods=["POST"])
def add_message():
    content = request.json
    messages.append(content)
    return jsonify({"status": "ok", "count": len(messages)})

@app.route("/api/messages", methods=["GET"])
def get_messages():
    return jsonify(messages)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

Run with:

```bash
python server.py
```

---

### Pico W - Talking to Local Flask Server

Replace `SERVER_IP` with your computer's local IP (e.g., `192.168.1.100`).

```python
import network
import urequests
import time

SSID = "your_wifi_name"
PASSWORD = "your_wifi_password"
SERVER_IP = "192.168.1.100"

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(SSID, PASSWORD)
while not wlan.isconnected():
    time.sleep(0.5)

# GET request with query param
url = f"http://{SERVER_IP}:5000/api/echo?msg=HelloPico"
r = urequests.get(url)
print(r.json())
r.close()

# POST request with JSON body
data = {"from": "Pico W", "text": "Hi server!"}
url = f"http://{SERVER_IP}:5000/api/messages"
r = urequests.post(url, json=data)
print(r.json())
r.close()

# GET messages
r = urequests.get(url)
print(r.json())
r.close()
```

---

### Exercises - Flask Interaction

1. **Temperature Logger**
   Create a `/api/temp` endpoint in Flask that stores temperature readings from the Pico W (fake or real).
   Pico sends a reading every 10 seconds.

2. **LED Control**
   Add a `/api/led` endpoint that accepts `"on"`/`"off"` in JSON.
   Pico polls this endpoint every second and turns an onboard LED on/off accordingly.

3. **Two-Way Chat**
   Pico sends text to Flask, Flask stores it, and Pico retrieves all messages every 5 seconds.

4. **API Bridge**
   Flask fetches data from a public API (e.g., weather) and serves it locally.
   Pico only talks to Flask, not the internet directly.

5. **Mini Game Leaderboard**
   Pico sends `{player, score}` to Flask; Flask stores and returns top 5 scores.
