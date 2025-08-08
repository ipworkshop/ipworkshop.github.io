---
title: Http Requests with reqwest
---

---

Up until now, our apps have been self-contained. But real-world applications often need to fetch data from the internet (like weather updates, news, or country statistics) or send data to a server (like saving user preferences or posting messages). Today, we'll learn the fundamental principles of how computers communicate over the web

---

### Introduction to Inter-Computer Communication

Why do our applications need to talk to other computers?

Imagine a world where every app is an island. Your weather app would only know the weather you manually typed in. Your social media app couldn't show you friends' updates. That's not very useful, right?

- **Accessing Remote Data:** The internet is a vast repository of information (APIs\!). Our apps need to fetch this data.
- **Sharing Information:** Multiple users need to access and modify the same data (e.g., a shared to-do list, a chat application). This data lives on a central server.
- **Leveraging Services:** Apps can use specialized services running on other computers (e.g., payment processing, machine learning models, cloud storage).

This communication is typically done over networks, and for web-based services, the **HTTP protocol** is the universal language.

---

### HTTP Protocol: Structure and Fundamentals

**HTTP** stands for **Hypertext Transfer Protocol**. It's the foundation of data communication for the World Wide Web. Think of it as a set of rules for how clients (like your browser or your Rust desktop app) and servers (where data lives) exchange messages.

#### **Client-Server Model:**

- **Client:** Your Rust desktop application (or a web browser) that _requests_ data or services.
- **Server:** A remote computer that _provides_ data or services in response to client requests.

#### **Request-Response Cycle:**

The core of HTTP is a simple cycle:

1.  **Client sends a Request:** Your app sends a message to the server, asking for something.
2.  **Server sends a Response:** The server processes the request and sends a message back to your app.

#### **Key Parts of an HTTP Request:**

- **Method (Verb):** Tells the server what action you want to perform.
  - **`GET`**: Retrieve data (e.g., get a list of countries).
  - **`POST`**: Send new data to create a resource (e.g., create a new user).
  - **`PUT`**: Send data to update an existing resource (e.g., update a user's profile).
  - **`DELETE`**: Remove a resource (e.g., delete a user).
  - _(These map directly to the **CRUD** operations: Create, Read, Update, Delete)_
- **URL (Uniform Resource Locator):** The address of the resource you're interacting with (e.g., `https://restcountries.com/v3.1/all`).
- **Headers:** Key-value pairs providing metadata about the request (e.g., `Content-Type: application/json`, `Authorization: Bearer <token>`).
- **Body (Optional):** The actual data you're sending to the server, typically for `POST` or `PUT` requests (e.g., a JSON object representing a new country).

#### **Key Parts of an HTTP Response:**

- **Status Code:** A three-digit number indicating the outcome of the request.
  - `200 OK`: Request successful.
  - `201 Created`: Resource successfully created (for `POST`).
  - `204 No Content`: Request successful, but no content to return (for `DELETE`).
  - `400 Bad Request`: Client sent an invalid request.
  - `404 Not Found`: Resource not found on the server.
  - `500 Internal Server Error`: Server encountered an error.
- **Headers:** Metadata about the response (e.g., `Content-Type: application/json`).
- **Body (Optional):** The data returned by the server (e.g., a JSON array of countries).

---

### 6.4 Making External API Calls with `reqwest` and `tokio` (25 min)

`reqwest` is the most popular and robust HTTP client library for Rust. It integrates seamlessly with Tokio for asynchronous operations.

#### **Setting Up `reqwest`:**

1.  **Add `reqwest` to `Cargo.toml`:**
    ```toml
    # Cargo.toml
    [dependencies]
    # ... other dependencies ...
    tokio = { version = "1", features = ["full"] }
    reqwest = { version = "0.11", features = ["json"] } # "json" feature for easy JSON handling
    ```
    - `features = ["json"]` is important as it enables `reqwest`'s convenient `.json()` method for responses and `.json(&data)` for requests.

#### **Example: Making a `GET` Request to the Rest Countries API**

Let's fetch data for a specific country (e.g., Japan) using `reqwest`.

```rust
// src/main.rs
use reqwest; // The HTTP client library
use tokio;   // The async runtime

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> { // main now returns a Result
    println!("Fetching country data...");

    let country_code = "JPN"; // Japan's code
    let url = format!("https://restcountries.com/v3.1/alpha/{}", country_code);

    // Make the GET request. .await? handles the Future and propagates errors.
    let response = reqwest::get(&url).await?;

    // Check if the request was successful (2xx status code)
    if response.status().is_success() {
        // Get the response body as text
        let body = response.text().await?;
        println!("Response for {}:\n{}", country_code, body);
    } else {
        println!("Failed to fetch data for {}. Status: {}", country_code, response.status());
    }

    Ok(()) // Indicate success
}
```

- **`Result<(), Box<dyn std::error::Error>>`:** This return type for `main` is common for async Rust examples. It means the function either succeeds (`Ok(())`) or returns an error that can be boxed (useful for diverse error types).
- **`.await?`:** This is a powerful shorthand. It's equivalent to:
  ```rust
  let result = some_async_operation().await;
  match result {
      Ok(val) => val,
      Err(err) => return Err(err.into()), // Convert error and return from function
  }
  ```
  It allows you to write async code that looks sequential but handles errors gracefully.

---

### Processing API Responses with `serde`

APIs almost always communicate using **JSON** (JavaScript Object Notation). Rust needs a way to convert this JSON text into Rust `struct`s (Deserialization) and convert Rust `struct`s into JSON text (Serialization). This is where the `serde` ecosystem comes in.

- **`serde`**: The core serialization/deserialization framework.
- **`serde_json`**: A crate that implements `serde` for JSON data.

#### **Setting Up `serde`:**

1.  **Add `serde` and `serde_json` to `Cargo.toml`:**
    ```toml
    # Cargo.toml
    [dependencies]
    # ... other dependencies ...
    tokio = { version = "1", features = ["full"] }
    reqwest = { version = "0.11", features = ["json"] }
    serde = { version = "1.0", features = ["derive"] } # "derive" feature for automatic trait implementation
    serde_json = "1.0"
    ```
    - `features = ["derive"]` for `serde` allows you to automatically implement `Serialize` and `Deserialize` traits on your structs using `#[derive()]`.

#### **Example: Deserializing Country Data (JSON to Rust Struct)**

Let's define a Rust `struct` that matches the structure of the JSON response we expect from the Rest Countries API for a single country.

```rust
// src/main.rs
use reqwest;
use tokio;
use serde::Deserialize; // Import Deserialize trait

// Use #[derive(Debug, Deserialize)] to automatically implement traits
// Debug allows us to print the struct with {:?}
// Deserialize allows serde to convert JSON into this struct
#[derive(Debug, Deserialize)]
struct Country {
    name: CountryName,
    population: u64,
    region: String,
    languages: Option<std::collections::HashMap<String, String>>, // Languages can be optional
    capital: Option<Vec<String>>, // Capital can be optional and an array
}

#[derive(Debug, Deserialize)]
struct CountryName {
    common: String,
    official: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("Fetching country data...");

    let country_code = "JPN";
    let url = format!("https://restcountries.com/v3.1/alpha/{}", country_code);

    let client = reqwest::Client::new(); // It's good practice to reuse a reqwest client
    let response = client.get(&url).send().await?;

    if response.status().is_success() {
        // The Rest Countries API for /alpha/:code returns an array of countries,
        // even if it's just one. So we expect a Vec<Country>.
        let countries_data: Vec<Country> = response.json().await?; // Deserialize JSON directly to Vec<Country>

        if let Some(country) = countries_data.into_iter().next() { // Take the first country from the array
            println!("Fetched Country: {:#?}", country);
            println!("Common Name: {}", country.name.common);
            println!("Population: {}", country.population);
            println!("Region: {}", country.region);

            if let Some(langs) = country.languages {
                println!("Languages: {:?}", langs.values().collect::<Vec<&String>>());
            }
            if let Some(caps) = country.capital {
                println!("Capital: {}", caps.join(", "));
            }
        } else {
            println!("No country data found in response.");
        }
    } else {
        println!("Failed to fetch data for {}. Status: {}", country_code, response.status());
    }

    Ok(())
}
```

- **`#[derive(Debug, Deserialize)]`**: These are procedural macros that automatically generate the necessary code for your `Country` and `CountryName` structs to be printable for debugging and deserializable from JSON.
- **`response.json().await?`**: This is a convenient `reqwest` method (enabled by the `json` feature) that attempts to parse the response body directly into the specified Rust type (here, `Vec<Country>`). It returns a `Result`.
- **`Option<T>` and `Vec<String>` for missing/array data:** Notice how `languages` and `capital` are wrapped in `Option` and `Vec` to correctly match the API's JSON structure, which might have missing fields or arrays.

---
