---
title: Structs and Enums
---

### Structuring Data with `struct`s

`struct`s (short for "structures") allow you to create custom data types by grouping related data together. They are similar to classes in object-oriented languages or objects/dictionaries in JavaScript/Python, but without built-in methods initially.

#### **Defining a `struct`:**

You define a `struct` using the `struct` keyword, followed by its name (typically `PascalCase`), and then curly braces containing its fields (each with a name and a type).

```rust
// Define a struct named 'User'
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn main() {
    // Creating an instance of a struct
    let user1 = User { // Order of fields doesn't matter
        active: true,
        username: String::from("alice123"),
        email: String::from("alice@example.com"),
        sign_in_count: 1,
    };

    // Accessing values using dot notation
    println!("User 1 Name: {}", user1.username);
    println!("User 1 Email: {}", user1.email);

    // To modify a field, the struct instance itself must be mutable
    let mut user2 = User {
        active: false,
        username: String::from("bob456"),
        email: String::from("bob@example.com"),
        sign_in_count: 5,
    };

    user2.email = String::from("new_bob@example.com"); // This is allowed
    println!("User 2 New Email: {}", user2.email);

    // You can also create new instances from existing ones using the struct update syntax
    let user3 = User {
        email: String::from("charlie@example.com"),
        username: String::from("charlie789"),
        ..user1 // Fills remaining fields from user1 (active, sign_in_count)
    };
    println!("User 3 Name: {}, Active: {}", user3.username, user3.active);
}
```

#### **Tuple Structs:**

Tuple structs are like tuples but have a name. They are useful when you want to give a name to a tuple but don't need named fields.

```rust
struct Color(i32, i32, i32); // RGB values
struct Point(i32, i32, i32); // X, Y, Z coordinates

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);

    println!("Black RGB: ({}, {}, {})", black.0, black.1, black.2);
    // Note: black.0 is the first element, black.1 the second, etc.
}
```

#### **Unit-Like Structs:**

These are useful when you need to implement a trait on some type but don't have any data that you want to store inside the type itself.

```rust
struct AlwaysEqual; // No fields

fn main() {
    let subject = AlwaysEqual;
    // You can use it as a type, but it holds no data.
}
```

#### **Printing Structs with `Debug` Trait:**

By default, `println!` cannot directly print structs in a readable format. You need to derive the `Debug` trait for your struct using `#[derive(Debug)]`.

```rust
#[derive(Debug)] // Add this line above your struct definition
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn main() {
    let user1 = User {
        active: true,
        username: String::from("alice123"),
        email: String::from("alice@example.com"),
        sign_in_count: 1,
    };

    println!("User 1: {:?}", user1); // Use {:?} for debug printing
    println!("User 1 (pretty print): {:#?}", user1); // Use {:#?} for pretty printing
}
```

---

### Modeling Data with `enum`s

`enum`s (enumerations) allow you to define a type by enumerating its possible variants. In Rust, `enum`s are much more powerful than in many other languages; they are "sum types," meaning a value of an `enum` can be _one of_ a set of defined possibilities.

#### **Simple `enum`s:**

You've already seen `Ordering` in the guessing game, which is a simple enum.

```rust
enum TrafficLight {
    Red,
    Yellow,
    Green,
}

fn main() {
    let current_light = TrafficLight::Red;

    match current_light { // Often used with 'match' for exhaustive handling
        TrafficLight::Red => println!("Stop!"),
        TrafficLight::Yellow => println!("Prepare to stop!"),
        TrafficLight::Green => println!("Go!"),
    }
}
```

#### **`enum`s with Associated Data:**

This is where Rust's enums become extremely powerful. Each variant of an enum can hold its own specific data.

```rust
enum Message {
    Quit, // No data
    Move { x: i32, y: i32 }, // Anonymous struct-like data
    Write(String), // Single String data
    ChangeColor(i32, i32, i32), // Tuple-like data (RGB values)
}

fn main() {
    let m1 = Message::Quit;
    let m2 = Message::Move { x: 10, y: 20 };
    let m3 = Message::Write(String::from("hello"));
    let m4 = Message::ChangeColor(255, 0, 128);

    // Using match to destructure and handle different enum variants
    match m2 {
        Message::Quit => println!("The Quit message has no data."),
        Message::Move { x, y } => println!("Move to x: {}, y: {}", x, y),
        Message::Write(text) => println!("Write message: {}", text),
        Message::ChangeColor(r, g, b) => println!("Change color to R:{}, G:{}, B:{}", r, g, b),
    }
}
```

#### **The `Option<T>` Enum (Handling Absence of a Value):**

`Option<T>` is a standard library enum that represents a value that might or might not be present. It's Rust's way of handling null/nil without null pointer exceptions.

```rust
enum Option<T> { // Conceptual definition
    None,    // Represents no value
    Some(T), // Represents a value of type T
}

fn main() {
    let some_number = Some(5); // A value is present
    let no_number: Option<i32> = None; // No value is present

    // You MUST use match (or other Option methods) to safely get the value out
    match some_number {
        Some(value) => println!("We have a number: {}", value),
        None => println!("No number here."),
    }

    match no_number {
        Some(value) => println!("We have a number: {}", value),
        None => println!("No number here."),
    }
}
```

#### **The `Result<T, E>` Enum (Handling Recoverable Errors):**

`Result<T, E>` is another fundamental enum for handling operations that can succeed or fail. You saw it with `read_line()` in Lesson 1.

```rust
enum Result<T, E> { // Conceptual definition
    Ok(T),  // Represents success, holding a value of type T
    Err(E), // Represents failure, holding an error of type E
}

fn main() {
    // Example: A function that might fail
    fn divide(numerator: f64, denominator: f64) -> Result<f64, String> {
        if denominator == 0.0 {
            Err(String::from("Cannot divide by zero!"))
        } else {
            Ok(numerator / denominator)
        }
    }

    let division_result = divide(10.0, 2.0);
    match division_result {
        Ok(value) => println!("Division successful: {}", value),
        Err(error) => println!("Division failed: {}", error),
    }

    let division_by_zero = divide(10.0, 0.0);
    match division_by_zero {
        Ok(value) => println!("Division successful: {}", value),
        Err(error) => println!("Division failed: {}", error),
    }
}
```

- **Key takeaway for `Option` and `Result`:** Rust forces you to explicitly handle the possibility of a value being absent or an operation failing, leading to more robust code.

---
