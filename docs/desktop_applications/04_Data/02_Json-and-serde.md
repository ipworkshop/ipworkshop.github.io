---
title: JSON and the Serde Crate
---

---

JSON (JavaScript Object Notation) is a lightweight, human-readable data format used to exchange data between a server and a web application, or as a configuration file format. It is language-independent, making it the de-facto standard for APIs and many other data-sharing scenarios. A typical JSON object looks like a key-value map, with nested structures and arrays.

---

### Introducing Serde

**Serde** is Rust's premier framework for **ser**ializing and **de**serializing data. Serialization is the process of converting a Rust data structure into a format like JSON, while deserialization is the reverse—converting JSON data into a Rust data structure. Serde is so widely used because it's fast, robust, and provides a simple way to convert complex data structures without writing boilerplate code. We'll use the `serde_json` crate, which provides the tools for handling JSON specifically.

---

### Setting Up Serde

To use Serde in your project, you must add it and `serde_json` to your `Cargo.toml` file. The `derive` feature for `serde` is essential, as it allows Rust to automatically generate the code for serialization and deserialization for your structs and enums.

```toml
[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

---

### Deserialization: JSON to Rust Struct

The most common use case is reading a JSON file or API response and converting it into a usable Rust data structure. You do this by defining a `struct` that mirrors the structure of your JSON data and then using the `serde_json::from_str` or `serde_json::from_reader` functions.

Let's assume we have a JSON file named `user.json`:

```json
{
  "user_id": 42,
  "username": "alice",
  "is_active": true,
  "roles": ["admin", "member"]
}
```

Now, let's create a Rust struct that corresponds to this JSON data.

```rust
use serde::Deserialize;
use std::fs::File;
use std::io::Read;

// Use the Deserialize trait to allow Serde to parse JSON into this struct.
#[derive(Deserialize, Debug)]
struct User {
    user_id: u32,
    username: String,
    is_active: bool,
    roles: Vec<String>,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Open the JSON file.
    let mut file = File::open("user.json")?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    // Use serde_json::from_str to deserialize the JSON into our User struct.
    // This function returns a Result, which we handle with the '?' operator.
    let user: User = serde_json::from_str(&contents)?;

    println!("Deserialized user: {:?}", user);

    Ok(())
}
```

The `#[derive(Deserialize, Debug)]` attribute is a procedural macro that automatically generates the code needed to convert a JSON object into a `User` struct. This is the core of Serde's power.

---

### Serialization: Rust Struct to JSON

The reverse process, serialization, is just as easy. You create an instance of your Rust struct and use `serde_json::to_string` to convert it into a JSON string.

```rust
use serde::Serialize;
use std::fs::File;
use std::io::Write;

// We derive Serialize to convert the struct into JSON.
#[derive(Serialize, Debug)]
struct Product {
    id: u32,
    name: String,
    price: f64,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let product = Product {
        id: 101,
        name: "Laptop".to_string(),
        price: 1200.50,
    };

    // Serialize the Product struct into a JSON string.
    let serialized_product = serde_json::to_string(&product)?;

    println!("Serialized JSON: {}", serialized_product);

    // Save the serialized JSON to a file.
    let mut file = File::create("product.json")?;
    file.write_all(serialized_product.as_bytes())?;

    println!("Product saved to product.json");

    Ok(())
}
```

The `to_string` function returns a `Result`, which is crucial for handling potential errors during serialization.

---

### Advanced Serde Attributes

Serde provides many attributes to customize the serialization and deserialization process, which are essential for handling real-world JSON data.

- `#[serde(rename = "...")]`: This attribute is used when the key in your JSON file has a different naming convention than your Rust struct field. For example, a common convention is to use snake_case in Rust and kebab-case or camelCase in JSON.

  ```rust
  #[derive(Deserialize, Debug)]
  struct UserProfile {
      #[serde(rename = "first-name")] // Handles "first-name" from JSON
      first_name: String,
      #[serde(rename = "last_name")] // Handles "last_name" from JSON
      last_name: String,
  }
  ```

- `#[serde(default)]`: If a field is optional in the JSON data, you can mark it with `default`. Serde will use the default value for the field's type if the key is missing from the JSON.

  ```rust
  #[derive(Deserialize, Debug)]
  struct Settings {
      theme: String,
      #[serde(default)] // This field will be 'false' if not present in the JSON.
      dark_mode: bool,
  }
  ```

### Naming Convention Differences with Serde

When the naming conventions in your JSON data don't match Rust's standard **snake_case**, you can use the **`#[serde(rename = "...")]`** attribute to map the JSON key to your Rust struct field. This is very common for handling JSON from APIs that use **camelCase** or **kebab-case**.

---

For example, if your JSON data uses `userName` (camelCase) and `isVerified` (camelCase), but you want to use `user_name` and `is_verified` in your Rust struct, you would do this:

```rust
use serde::{Deserialize, Serialize};

// The JSON data has keys 'userName' and 'isVerified'
// but our Rust struct uses snake_case as per Rust conventions.
#[derive(Debug, Serialize, Deserialize)]
struct User {
    #[serde(rename = "userName")] // Maps 'userName' from JSON to user_name in Rust
    user_name: String,

    #[serde(rename = "isVerified")] // Maps 'isVerified' from JSON to is_verified
    is_verified: bool,
}

fn main() {
    let json_data = r#"
        {
          "userName": "rustacean_user",
          "isVerified": true
        }
    "#;

    let user: User = serde_json::from_str(json_data).unwrap();

    println!("Deserialized User: {:?}", user);
    // Output: Deserialized User: User { user_name: "rustacean_user", is_verified: true }
}
```

The `#[serde(rename = "…")]` attribute tells Serde to look for the key specified in the JSON data and use its value to populate the corresponding Rust field. This allows you to maintain idiomatic Rust code while working with different external data formats.

---

Serde's power lies in these attributes, which allow you to effortlessly map complex JSON data to clean, idiomatic Rust code.
