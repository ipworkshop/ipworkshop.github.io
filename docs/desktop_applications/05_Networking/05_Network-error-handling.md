---
title: Network Error Handling
---

---

Network operations are inherently unreliable; connections can fail, servers can be offline, and data can be malformed. In Rust, the **`reqwest`** crate handles these possibilities by returning a `Result` for every operation, allowing you to build robust applications that can gracefully recover from failures. This lesson will show you how to handle these errors, from simple propagation to detailed analysis.

---

### 1\. The `reqwest::Error` Type

All errors from `reqwest` are consolidated into a single, comprehensive **`reqwest::Error`** enum. This error type provides detailed information about what went wrong, including connection issues, HTTP status codes, and serialization failures. You don't need to import `reqwest::Error` explicitly; it's the type returned by `reqwest`'s functions, and the `?` operator works on it automatically.

---

### 2\. Simple Error Handling with `?`

The simplest and most common way to handle a `reqwest` error is with the **`?`** operator. This works because most `reqwest` functions return a `Result<T, reqwest::Error>`. The `?` operator will propagate any error back to the caller, making your code concise.

```rust
use reqwest;
use tokio;

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    // This will work because main() returns a Result<(), reqwest::Error>
    // The '?' operator will propagate any error from the get() call.
    let response = reqwest::get("https://httpbin.org/get").await?;

    // The '?' will also propagate an error if the response body cannot be read.
    let body = response.text().await?;

    println!("Response body:\n{}", body);

    Ok(())
}
```

This is perfect for small applications or for when you simply want to log an error and exit.

---

### 3\. Granular Error Handling with `match`

For more advanced applications, you may want to handle different types of errors differently. For example, a network timeout might be retried, while a "404 Not Found" error might be displayed to the user. You can use a `match` expression or methods on the `reqwest::Error` type to get this level of detail.

The `reqwest::Error` has several useful methods to check for specific error categories:

- **`is_connect()`**: Returns true if the error was a connection issue (e.g., DNS failure, connection refused).
- **`is_timeout()`**: Returns true if the operation timed out.
- **`status()`**: Returns the `StatusCode` for non-successful HTTP responses. This is a `Option<StatusCode>`, so you must handle the `Some` and `None` cases.
- **`is_client_error()`**: Returns true if the status code is a `4xx`.
- **`is_server_error()`**: Returns true if the status code is a `5xx`.
- **`is_decode()`**: Returns true if deserializing the response body (e.g., JSON) failed.

<!-- end list -->

```rust
use reqwest::{self, StatusCode};
use tokio;

#[tokio::main]
async fn main() {
    let response = reqwest::get("https://httpbin.org/status/404").await;

    match response {
        Ok(res) => {
            // Check if the status code indicates a success (200-299)
            if res.status().is_success() {
                println!("Request was successful!");
            } else {
                // If the status is not a success, you can handle it here.
                println!("HTTP Error: {}", res.status());

                // You can also match on the status code itself.
                match res.status() {
                    StatusCode::NOT_FOUND => println!("The resource was not found (404)"),
                    StatusCode::UNAUTHORIZED => println!("Authentication failed (401)"),
                    _ => println!("An unexpected HTTP error occurred."),
                }
            }
        },
        Err(e) => {
            // Check for different kinds of network errors.
            if e.is_connect() {
                println!("A connection error occurred. Is the server running?");
            } else if e.is_timeout() {
                println!("The request timed out. Please check your network.");
            } else if e.is_decode() {
                println!("Failed to decode the response body. Is the format correct?");
            } else {
                println!("An unexpected request error occurred: {:?}", e);
            }
        },
    }
}
```

This granular approach gives you full control, allowing you to implement specific logic for each potential failure point.
