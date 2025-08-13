# Fetching Public APIs in Rust 

This guide shows how to fetch public APIs in Rust using `reqwest` and `tokio`.  
We’ll walk through small examples and explain what’s happening.

---

## 1. Setup

In `Cargo.toml`:

```toml
[dependencies]
tokio   = { version = "1", features = ["full"] }
reqwest = { version = "0.11", features = ["json"] }
serde   = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

**Explanation:**  
- **tokio**: Async runtime that allows us to write asynchronous code (`async`/`await`).  
- **reqwest**: HTTP client library for making GET/POST requests.  
- **serde** and **serde_json**: For converting JSON data into Rust structs automatically.

---

## 2. Fetch a Joke

```rust
use reqwest::Client;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct Joke { setup: String, punchline: String }

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new();
    let url = "https://official-joke-api.appspot.com/random_joke";

    let joke: Joke = client.get(url).send().await?.json().await?;

    println!("{} — {}", joke.setup, joke.punchline);
    Ok(())
}
```

**Explanation:**  
- We create a `Client` to make HTTP requests.  
- `client.get(url)` creates a GET request.  
- `.send().await?` sends the request and waits for the response.  
- `.json().await?` converts the JSON into our `Joke` struct automatically using `serde`.  
- We then print the joke’s setup and punchline.

---

## 3. Weather API Example (OpenWeatherMap)

You can sign up for a free API key at [https://openweathermap.org/](https://openweathermap.org/).

```rust
use reqwest::Client;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct WeatherResponse {
    name: String,
    main: Main,
    weather: Vec<Weather>,
}

#[derive(Debug, Deserialize)]
struct Main { temp: f64 }

#[derive(Debug, Deserialize)]
struct Weather { description: String }

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let api_key = "YOUR_API_KEY"; // from OpenWeather
    let city = "London";
    let url = format!(
        "https://api.openweathermap.org/data/2.5/weather?q={}&appid={}&units=metric",
        city, api_key
    );

    let client = Client::new();
    let resp: WeatherResponse = client.get(&url).send().await?.json().await?;

    println!("Weather in {}: {}°C, {}",
        resp.name,
        resp.main.temp,
        resp.weather.first().map(|w| &w.description).unwrap_or(&"No data".to_string())
    );

    Ok(())
}
```

**Explanation:**  
- The `WeatherResponse` struct matches the JSON structure returned by OpenWeather.  
- We use `format!` to insert the city name and API key into the URL.  
- The `units=metric` parameter tells the API to return Celsius temperatures.  
- After parsing the JSON, we display the city name, temperature, and weather description.  
- Always store your API key in an environment variable in real apps for security.

---

## 4. Fetch a Random Cat Fact

```rust
use reqwest::Client;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct CatFact { fact: String }

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new();
    let url = "https://catfact.ninja/fact";

    let fact: CatFact = client.get(url).send().await?.json().await?;
    println!("Cat fact: {}", fact.fact);
    Ok(())
}
```

**Explanation:**  
- This example is almost identical to the joke example but uses another API.  
- The API returns JSON with a single field, `fact`.  
- This is perfect for learning because you can easily change the URL and struct to fetch other simple APIs.

---

## General Notes

- **Error handling**: In production, always check if the request succeeded before parsing. Use `.error_for_status()` to catch HTTP errors.  
- **Performance**: Reuse the same `Client` across requests instead of creating a new one each time.  
- **Security**: Never hardcode API keys in your source code. Use environment variables or secure config files.  
- **Data mapping**: Struct field names must match the JSON keys or use `#[serde(rename = "json_key_name")]`.
