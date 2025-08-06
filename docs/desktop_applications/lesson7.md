---
title: API Integration & UI Updates
sidebar_position: 7
---

Okay, understood\! Let's simplify Module 7 to make it even more approachable for beginners, focusing on the core concepts of API calls and UI updates without getting bogged down in too much data complexity or advanced Rust features. We'll stick to essential country info and keep the code as straightforward as possible.

---

# Lesson 7: API Integration & UI Updates

Fantastic\! You've learned how Rust handles asynchronous operations and how to talk to APIs. Now, it's time to bring that power into your desktop applications\! In this module, we'll integrate our API communication skills with Slint, making our UIs dynamic and data-driven. Get ready to fetch real-world data and display it beautifully\! 🌍

---

### 7.1 Practical Exercises: Consuming External APIs and Parsing Responses (Rest Countries API)

Our main goal here is to fetch data from the **Rest Countries API** and display it in our Slint application. This will involve:

1.  Defining simple Rust `struct`s to match the API's JSON response for the data we care about.
2.  Making `async` HTTP `GET` requests using `reqwest`.
3.  Deserializing the JSON response into our Rust `struct`s using `serde`.
4.  **Crucially:** Handling the asynchronous nature of the API call so that our Slint UI remains responsive.

#### **Exercise 1: Displaying a Basic List of All Countries**

Let's start by fetching a list of all countries and displaying their names in a scrollable list within our Slint app.

**Preparation:**

1.  **Create a new Cargo project:** `cargo new slint_countries_app`

2.  **Update `Cargo.toml`:** Add `slint`, `slint-build`, `tokio`, `reqwest`, `serde`, and `serde_json` dependencies.

    ```toml
    # Cargo.toml
    [package]
    name = "slint_countries_app"
    version = "0.1.0"
    edition = "2021"

    [dependencies]
    slint = "1.x"
    tokio = { version = "1", features = ["full"] } # For async runtime
    reqwest = { version = "0.11", features = ["json"] } # For HTTP requests
    serde = { version = "1.0", features = ["derive"] } # For JSON serialization/deserialization
    serde_json = "1.0"

    [build-dependencies]
    slint-build = "1.x"
    ```

3.  **Define Simple Rust Structs for Country Data:**
    We'll focus on just a few key pieces of information from the Rest Countries API (`https://restcountries.com/v3.1/all`) to keep our structs straightforward.

    ```rust
    // src/main.rs (add these struct definitions at the top, before main)
    use serde::Deserialize; // Make sure this is imported
    use std::collections::HashMap; // Needed for the 'languages' field

    #[derive(Debug, Deserialize, Clone)] // Clone is useful for passing data around
    pub struct Country {
        pub name: CountryName,
        pub population: u64,
        pub region: String,
        #[serde(default)] // Use default if 'capital' array is missing
        pub capital: Vec<String>, // Capital is an array of strings
        pub languages: Option<HashMap<String, String>>, // Languages is a map, can be optional
        pub cca3: String, // Country code, useful for detail lookup
    }

    #[derive(Debug, Deserialize, Clone)]
    pub struct CountryName {
        pub common: String,
        pub official: String,
    }
    ```

**UI Design (`ui.slint`):**

We'll use a `ListView` to display the country names. `ListView` works by taking a `model` property, which expects a list of items. Slint can automatically generate a model from a `Vec<T>` in Rust if `T` implements `Default` and `Clone`.

```slint
// ui.slint
import { ListView, VerticalBox, Text, LineEdit, StandardListView } from "std-widgets.slint";

// Define a Slint struct that mirrors the essential parts of our Rust Country struct
// This is what the ListView will display.
component CountryListItem {
    in property <string> name;
    in property <string> code; // To identify the country when clicked later

    Rectangle {
        width: 100%;
        height: 40px;
        background: #CFD8DC; // Light grey background
        border-radius: 5px;
        padding: 10px;

        Text {
            text: name;
            vertical-alignment: center;
            horizontal-alignment: left;
            font-size: 16px;
            color: #263238;
        }

        // We'll add click handling in the next exercise
    }
}

export component MainWindow inherits Window {
    width: 800px;
    height: 600px;
    title: "Global Countries Dashboard";

    // This property will hold our list of countries
    // It's an 'in' property because Rust will provide the data.
    in property <[CountryListItem]> countries_model: [];

    VerticalBox {
        alignment: center;
        spacing: 10px;
        padding: 15px;

        Text {
            text: "All Countries";
            font-size: 32px;
            font-weight: 700;
            color: #0D47A1; // Dark blue
            horizontal-alignment: center;
        }

        // Search bar (static for now)
        LineEdit {
            placeholder-text: "Search for a country...";
            width: 90%;
            height: 40px;
            font-size: 16px;
        }

        // The ListView to display our countries
        ListView {
            width: 90%;
            height: 100%; // Take available vertical space
            model: countries_model; // Bind to our property
            // Delegate defines how each item in the list looks
            delegate: CountryListItem {
                name: root.name; // Bind delegate's name to model item's name
                code: root.code; // Bind delegate's code to model item's code
            }
        }
    }
}
```

**Rust Logic (`src/main.rs`):**

Now, let's put it all together. We'll make the API call in an `async` task and then update the Slint UI.

```rust
// src/main.rs
slint::include_modules!(); // This compiles ui.slint and generates Rust code

use tokio; // For async runtime
use reqwest; // For HTTP requests
use serde::Deserialize; // For JSON deserialization
use slint::VecModel; // For managing lists in Slint
use std::rc::Rc; // For shared ownership (needed for VecModel)
use std::collections::HashMap; // For the languages map

// --- Structs for API Response (defined above in the lesson content) ---
// #[derive(Debug, Deserialize, Clone)]
// pub struct Country { ... }
// #[derive(Debug, Deserialize, Clone)]
// pub struct CountryName { ... }

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let ui = MainWindow::new().unwrap();
    let ui_handle_weak = ui.as_weak(); // Get a weak handle for use in closures

    // --- Spawn an async task to fetch data ---
    tokio::spawn(async move {
        let api_url = "https://restcountries.com/v3.1/all";
        println!("Fetching all countries from API...");

        let client = reqwest::Client::new();
        let response = client.get(api_url).send().await;

        match response {
            Ok(res) => {
                if res.status().is_success() {
                    let countries_data: Result<Vec<Country>, _> = res.json().await;
                    match countries_data {
                        Ok(mut fetched_countries) => {
                            // Sort countries alphabetically by common name
                            fetched_countries.sort_by(|a, b| a.name.common.cmp(&b.name.common));

                            // Prepare data for Slint's model
                            let slint_items: Vec<CountryListItem> = fetched_countries.into_iter().map(|c| {
                                CountryListItem {
                                    name: c.name.common.into(), // Convert String to slint::SharedString
                                    code: c.cca3.into(),        // Convert String to slint::SharedString
                                }
                            }).collect();

                            // Update the UI on the Slint event loop
                            if let Some(ui) = ui_handle_weak.upgrade() {
                                // Use Rc::new(VecModel::from(...)) to create a model from our Vec
                                ui.set_countries_model(Rc::new(VecModel::from(slint_items)));
                                println!("Successfully loaded {} countries into UI.", ui.get_countries_model().row_count());
                            }
                        },
                        Err(e) => {
                            eprintln!("Failed to deserialize countries data: {:?}", e);
                            if let Some(ui) = ui_handle_weak.upgrade() {
                                ui.set_countries_model(Rc::new(VecModel::from(vec![
                                    CountryListItem { name: "Error loading data!".into(), code: "".into() }
                                ])));
                            }
                        }
                    }
                } else {
                    eprintln!("API returned an error status: {}", res.status());
                    if let Some(ui) = ui_handle_weak.upgrade() {
                        ui.set_countries_model(Rc::new(VecModel::from(vec![
                            CountryListItem { name: format!("API Error: {}", res.status()).into(), code: "".into() }
                        ])));
                    }
                }
            },
            Err(e) => {
                eprintln!("Network request failed: {:?}", e);
                if let Some(ui) = ui_handle_weak.upgrade() {
                    ui.set_countries_model(Rc::new(VecModel::from(vec![
                        CountryListItem { name: format!("Network Error: {:?}", e).into(), code: "".into() }
                    ])));
                }
            }
        }
    });

    ui.run().unwrap(); // Run the Slint UI event loop
    Ok(())
}
```

---

### 7.2 Dynamically Updating Slint UI Elements with Collected Data

Now that we can display a list, let's make it interactive. When a user clicks on a country in the `ListView`, we want to fetch its detailed information and display it in a separate panel.

#### **Exercise 2: Displaying Country Details on Click**

**UI Design (`ui.slint` - Modifications):**

1.  Add a `callback` to `CountryListItem` so it can signal when it's clicked.
2.  Add a new section (e.g., a `VerticalBox` or `GridBox`) to `MainWindow` to display country details.
3.  Add properties to `MainWindow` to hold the currently selected country's details.

<!-- end list -->

```slint
// ui.slint (MODIFIED)
import { ListView, VerticalBox, Text, LineEdit, StandardListView, GridBox, HorizontalBox } from "std-widgets.slint";

// MODIFIED: Add a callback to signal when an item is clicked
component CountryListItem {
    in property <string> name;
    in property <string> code;
    callback clicked(string code); // New callback

    Rectangle {
        width: 100%;
        height: 40px;
        background: #CFD8DC;
        border-radius: 5px;
        padding: 10px;

        Text {
            text: name;
            vertical-alignment: center;
            horizontal-alignment: left;
            font-size: 16px;
            color: #263238;
        }

        // Add a TouchArea to make the entire item clickable
        TouchArea {
            clicked => {
                root.clicked(code); // When clicked, emit our callback with the country code
            }
        }
    }
}

export component MainWindow inherits Window {
    width: 1000px; // Wider window to accommodate details
    height: 600px;
    title: "Global Countries Dashboard";

    in property <[CountryListItem]> countries_model: [];

    // NEW PROPERTIES to display selected country details
    in property <string> selected_country_name: "Select a Country";
    in property <string> selected_country_population: "";
    in property <string> selected_country_region: "";
    in property <string> selected_country_capital: "";
    in property <string> selected_country_languages: "";

    // NEW CALLBACK: When a country list item is clicked
    callback request_country_details(string code);

    HorizontalBox { // Use HorizontalBox to split into list and details
        spacing: 10px;
        padding: 15px;

        VerticalBox { // Left side: Search and List
            width: 300px; // Fixed width for the list panel
            alignment: center;
            spacing: 10px;

            Text {
                text: "All Countries";
                font-size: 32px;
                font-weight: 700;
                color: #0D47A1;
                horizontal-alignment: center;
            }

            LineEdit {
                placeholder-text: "Search for a country...";
                width: 100%;
                height: 40px;
                font-size: 16px;
                // We'll add search logic in a later module!
            }

            ListView {
                width: 100%;
                height: 100%;
                model: countries_model;
                delegate: CountryListItem {
                    name: root.name;
                    code: root.code;
                    // When a list item is clicked, trigger the MainWindow's callback
                    clicked => { root.request_country_details(root.code); }
                }
            }
        }

        VerticalBox { // Right side: Country Details
            width: 1fr; // Take remaining space
            alignment: center;
            spacing: 15px;
            padding: 20px;
            background: #E3F2FD; // Light blue background for details panel
            border-radius: 8px;

            Text {
                text: selected_country_name;
                font-size: 36px;
                font-weight: 700;
                color: #1A237E; // Darker blue
                horizontal-alignment: center;
                wrap: word-wrap;
            }

            GridBox { // Use a grid for key-value pairs
                columns: 2;
                rows: 4; // Reduced rows
                column-spacing: 10px;
                row-spacing: 5px;
                width: 100%;

                Text { text: "Population:"; font-weight: 600; } Text { text: selected_country_population; }
                Text { text: "Region:"; font-weight: 600; } Text { text: selected_country_region; }
                Text { text: "Capital:"; font-weight: 600; } Text { text: selected_country_capital; }
                Text { text: "Languages:"; font-weight: 600; } Text { text: selected_country_languages; wrap: word-wrap; }
            }
        }
    }
}
```

**Rust Logic (`src/main.rs` - MODIFIED):**

We'll add the `on_request_country_details` callback and the logic to fetch and display the details. We'll simplify the language and capital processing.

```rust
// src/main.rs (MODIFIED)
slint::include_modules!();

use tokio;
use reqwest;
use serde::Deserialize;
use slint::{VecModel, SharedString}; // No Image, ImageBuffer needed
use std::rc::Rc;
use std::collections::HashMap; // For languages map

// --- Structs for API Response (defined previously) ---
#[derive(Debug, Deserialize, Clone)]
pub struct Country {
    pub name: CountryName,
    pub population: u64,
    pub region: String,
    #[serde(default)]
    pub capital: Vec<String>, // Capital is an array of strings
    pub languages: Option<HashMap<String, String>>, // Languages is a map, can be optional
    pub cca3: String, // Country code, useful for detail lookup
}

#[derive(Debug, Deserialize, Clone)]
pub struct CountryName {
    pub common: String,
    pub official: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let ui = MainWindow::new().unwrap();
    let ui_handle_weak = ui.as_weak(); // Weak handle for initial country list fetch

    // --- Initial fetch for all countries (same as before) ---
    let ui_handle_clone_for_all_countries = ui_handle_weak.clone();
    tokio::spawn(async move {
        let api_url = "https://restcountries.com/v3.1/all";
        println!("Fetching all countries from API...");

        let client = reqwest::Client::new();
        let response = client.get(api_url).send().await;

        match response {
            Ok(res) => {
                if res.status().is_success() {
                    let countries_data: Result<Vec<Country>, _> = res.json().await;
                    match countries_data {
                        Ok(mut fetched_countries) => {
                            fetched_countries.sort_by(|a, b| a.name.common.cmp(&b.name.common));
                            let slint_items: Vec<CountryListItem> = fetched_countries.into_iter().map(|c| {
                                CountryListItem {
                                    name: c.name.common.into(), // Convert String to slint::SharedString
                                    code: c.cca3.into(),        // Convert String to slint::SharedString
                                }
                            }).collect();

                            if let Some(ui) = ui_handle_clone_for_all_countries.upgrade() {
                                ui.set_countries_model(Rc::new(VecModel::from(slint_items)));
                                println!("Successfully loaded {} countries into UI.", ui.get_countries_model().row_count());
                            }
                        },
                        Err(e) => eprintln!("Failed to deserialize countries data: {:?}", e),
                    }
                } else {
                    eprintln!("API returned an error status: {}", res.status());
                }
            },
            Err(e) => eprintln!("Network request failed: {:?}", e),
        }
    });

    // --- NEW: Handle request for specific country details ---
    let ui_handle_for_details = ui.as_weak(); // Another weak handle for the details callback
    ui.on_request_country_details(move |code| {
        let ui_handle_clone = ui_handle_for_details.clone(); // Clone for use inside the spawned task
        let country_code = code.to_string(); // Convert SharedString to String

        tokio::spawn(async move {
            let api_url = format!("https://restcountries.com/v3.1/alpha/{}", country_code);
            println!("Fetching details for country code: {}", country_code);

            let client = reqwest::Client::new();
            let response = client.get(&api_url).send().await;

            match response {
                Ok(res) => {
                    if res.status().is_success() {
                        let countries_data: Result<Vec<Country>, _> = res.json().await;
                        match countries_data {
                            Ok(fetched_countries) => {
                                if let Some(country) = fetched_countries.into_iter().next() {
                                    // Use invoke_from_event_loop (implicitly handled by Slint when setting properties)
                                    if let Some(ui) = ui_handle_clone.upgrade() {
                                        // Simplify languages: get values, convert to Vec<String>, join
                                        let languages_str = country.languages
                                            .map(|langs_map| {
                                                langs_map.values()
                                                    .map(|s| s.to_string())
                                                    .collect::<Vec<String>>()
                                                    .join(", ") // Join them with a comma and space
                                            })
                                            .unwrap_or_else(|| "N/A".to_string()); // Default if no languages

                                        // Simplify capital: take the first capital or "N/A"
                                        let capital_str = country.capital.get(0)
                                            .map(|s| s.to_string())
                                            .unwrap_or_else(|| "N/A".to_string());


                                        ui.set_selected_country_name(country.name.common.into());
                                        ui.set_selected_country_population(format!("{}", country.population).into());
                                        ui.set_selected_country_region(country.region.into());
                                        ui.set_selected_country_capital(capital_str.into());
                                        ui.set_selected_country_languages(languages_str.into());
                                        ui.set_selected_country_code(country.cca3.into()); // Also display code
                                    }
                                } else {
                                    eprintln!("No country data found in details response.");
                                    if let Some(ui) = ui_handle_clone.upgrade() {
                                        ui.set_selected_country_name("Details Not Found".into());
                                        ui.set_selected_country_population("".into());
                                        ui.set_selected_country_region("".into());
                                        ui.set_selected_country_capital("".into());
                                        ui.set_selected_country_languages("".into());
                                        ui.set_selected_country_code("".into());
                                    }
                                }
                            },
                            Err(e) => {
                                eprintln!("Failed to deserialize country details: {:?}", e);
                                if let Some(ui) = ui_handle_clone.upgrade() {
                                    ui.set_selected_country_name(format!("Error: {:?}", e).into());
                                    ui.set_selected_country_population("".into());
                                    ui.set_selected_country_region("".into());
                                    ui.set_selected_country_capital("".into());
                                    ui.set_selected_country_languages("".into());
                                    ui.set_selected_country_code("".into());
                                }
                            }
                        }
                    } else {
                        eprintln!("API returned an error status for details: {}", res.status());
                        if let Some(ui) = ui_handle_clone.upgrade() {
                            ui.set_selected_country_name(format!("API Error: {}", res.status()).into());
                            ui.set_selected_country_population("".into());
                            ui.set_selected_country_region("".into());
                            ui.set_selected_country_capital("".into());
                            ui.set_selected_country_languages("".into());
                            ui.set_selected_country_code("".into());
                        }
                    }
                },
                Err(e) => {
                    eprintln!("Network request for details failed: {:?}", e);
                    if let Some(ui) = ui_handle_clone.upgrade() {
                        ui.set_selected_country_name(format!("Network Error: {:?}", e).into());
                        ui.set_selected_country_population("".into());
                        ui.set_selected_country_region("".into());
                        ui.set_selected_country_capital("".into());
                        ui.set_selected_country_languages("".into());
                        ui.set_selected_country_code("".into());
                    }
                }
            }
        });
    });

    ui.run().unwrap();
    Ok(())
}
```

---

**End of Lesson 7.** You've successfully integrated external API data into your Slint UI\! You can now fetch lists of data, handle user clicks to get more details, and dynamically update your application's interface. This is a huge step towards building truly functional desktop applications. Next, we'll learn how to make your UIs more modular and reusable\!
