---
title: Advanced Concepts & Data Structures
sidebar_position: 3
---

-----

# Lesson 3: Rust Fundamentals - Advanced Concepts & Data Structures

Welcome to the most conceptually challenging, yet incredibly rewarding, part of our Rust journey: understanding **Ownership**. This is what makes Rust unique and powerful. We'll also dive into how to create your own custom data types using `struct`s and `enum`s, and how to organize your growing codebase with modules.

-----

### 3.1 Demystifying Ownership, Borrowing, and Lifecycles (30 min)

This is the heart of Rust's memory safety guarantees. Don't worry if it doesn't click instantly; it takes practice\! The goal here is to understand the core rules and *why* they exist.

**The Core Rules of Ownership:**

1.  **Each value in Rust has a variable that's called its *owner*.**
2.  **There can only be one owner at a time.**
3.  **When the owner goes out of scope, the value will be *dropped* (memory is freed).**

Let's see what this means in practice.

#### **Ownership and Moves:**

For complex data types (like `String` or `Vec`), when you assign one variable to another, Rust doesn't copy the data. Instead, it **moves** ownership. The original variable becomes invalid.

```rust
fn main() {
    let s1 = String::from("hello"); // s1 owns the String data
    println!("s1 initially: {}", s1);

    let s2 = s1; // Ownership of the String data MOVES from s1 to s2
    println!("s2: {}", s2);

    // println!("s1 after move: {}", s1); // ERROR! s1 is no longer valid here.
                                        // Rust prevents you from using s1 after it's moved.
                                        // This prevents "use-after-free" bugs.
}
```

  * **Why?** If `s1` and `s2` both owned the data, they might try to free it twice when they go out of scope, leading to a crash. Rust's ownership system prevents this.

#### **The `Copy` Trait:**

For simple, fixed-size types (like integers, booleans, characters, fixed-size arrays), Rust implements the `Copy` trait. When you assign these, the value is actually copied, and the original variable remains valid.

```rust
fn main() {
    let x = 5; // x owns the integer 5
    let y = x; // The integer 5 is COPIED. x is still valid.

    println!("x: {}, y: {}", x, y); // Output: x: 5, y: 5
}
```

#### **Borrowing (References):**

What if you want to use a value without taking ownership? You **borrow** it by creating a **reference**. References don't take ownership, so they don't free the memory when they go out of scope.

  * **Immutable References (`&`):** You can have multiple immutable references to a piece of data at the same time. This is like lending someone a book to read – many people can read it simultaneously.

    ```rust
    fn main() {
        let s = String::from("hello"); // s owns the String

        let len = calculate_length(&s); // Pass an immutable reference (&s)
        println!("The length of '{}' is {}.", s, len); // s is still valid here!

        // You can have multiple immutable references:
        let r1 = &s;
        let r2 = &s;
        println!("r1: {}, r2: {}", r1, r2); // Both r1 and r2 are valid
    }

    fn calculate_length(s: &String) -> usize { // Function takes an immutable reference
        s.len() // .len() method returns the length
    } // s goes out of scope here, but it didn't own the String, so nothing is dropped.
    ```

  * **Mutable References (`&mut`):** You can have **only one mutable reference** to a piece of data at a time. This is like lending someone a book to edit – only one person can edit it at a time to avoid conflicts.

    ```rust
    fn main() {
        let mut s = String::from("hello"); // s must be mutable to get a mutable reference

        change_string(&mut s); // Pass a mutable reference (&mut s)
        println!("Modified string: {}", s); // s is still valid and modified!

        // let r1 = &mut s; // First mutable reference
        // let r2 = &mut s; // ERROR! Cannot have two mutable references at once
        // println!("{}, {}", r1, r2);

        // let r1 = &s; // Immutable reference
        // let r2 = &mut s; // ERROR! Cannot have a mutable and immutable reference at the same time
    }

    fn change_string(some_string: &mut String) { // Function takes a mutable reference
        some_string.push_str(", world!"); // Modify the string through the reference
    }
    ```

#### **Lifetimes (High-Level):**

Lifetimes are a concept the Rust compiler uses to ensure that all references are valid for as long as they are used. They prevent "dangling references" (references pointing to data that has already been freed).

  * You'll often see them implicitly handled by the compiler.
  * Sometimes, for functions that take references and return references, you might need to explicitly annotate lifetimes (e.g., `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str`).
  * **Key takeaway:** Lifetimes are about ensuring that data lives as long as any reference to it exists. The compiler checks this for you\!

#### **The Borrow Checker:**

Rust's compiler includes a "Borrow Checker." This is the part that enforces all the ownership and borrowing rules *at compile time*. If your code violates a rule, the Borrow Checker will prevent it from compiling, giving you helpful error messages. This is Rust's way of guaranteeing memory safety without a runtime garbage collector.

**Practice:** The best way to understand Ownership is to write code and let the Borrow Checker guide you. Try to break the rules (e.g., try to use a moved variable, create two mutable references) and understand the compiler errors.

-----

### 3.2 Structuring Data with `struct`s (30 min)

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

#### **Associated Functions (Methods) using `impl`:**

You can define functions that belong to a `struct` using an `impl` (implementation) block. These are often called **methods** if their first parameter is `self` (a reference to the instance of the struct).

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

// Implement methods for the Rectangle struct
impl Rectangle {
    // A method that takes an immutable reference to self
    fn area(&self) -> u32 {
        self.width * self.height
    }

    // A method that takes a mutable reference to self
    fn scale(&mut self, factor: u32) {
        self.width *= factor;
        self.height *= factor;
    }

    // An associated function (not a method, doesn't take self)
    // Often used as constructors (like 'new' in other languages)
    fn square(size: u32) -> Rectangle {
        Rectangle {
            width: size,
            height: size,
        }
    }
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };
    println!("The area of the rectangle is {} square pixels.", rect1.area()); // Call method

    let mut rect2 = Rectangle { width: 10, height: 20 };
    rect2.scale(2); // Call mutable method
    println!("Scaled rectangle: width={}, height={}", rect2.width, rect2.height);

    let sq = Rectangle::square(25); // Call associated function using ::
    println!("Square area: {}", sq.area());
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

-----

### 3.3 Modeling Data with `enum`s (15 min)

`enum`s (enumerations) allow you to define a type by enumerating its possible variants. In Rust, `enum`s are much more powerful than in many other languages; they are "sum types," meaning a value of an `enum` can be *one of* a set of defined possibilities.

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

  * **Key takeaway for `Option` and `Result`:** Rust forces you to explicitly handle the possibility of a value being absent or an operation failing, leading to more robust code.

-----

### 3.4 Organizing Code with Modules (15 min)

As your Rust projects grow, you'll want to organize your code into logical units. Rust's module system helps you do this.

  * **Modules (`mod`):** Modules are like namespaces or containers for functions, structs, enums, and other modules. They help prevent naming conflicts and control visibility.
  * **`use` Keyword:** The `use` keyword brings items from modules into your current scope, so you don't have to type the full path every time.
  * **`pub` Keyword:** By default, everything in Rust is private. To make an item (function, struct, enum, module) visible outside its current module, you need to mark it with `pub` (public).

#### **Example: Single File Module**

```rust
// src/main.rs

// Declare a module named 'greetings'
mod greetings {
    // This function is private by default
    fn english() {
        println!("Hello!");
    }

    // This function is public, so it can be accessed from outside 'greetings'
    pub fn spanish() {
        println!("¡Hola!");
    }

    // Declare a nested module
    pub mod formal {
        pub fn english_formal() {
            println!("Good day!");
        }
    }
}

fn main() {
    // Call a public function from the greetings module
    greetings::spanish();

    // Call a public function from the nested formal module
    greetings::formal::english_formal();

    // greetings::english(); // ERROR! 'english' is private
}
```

#### **Example: Modules in Separate Files**

For larger projects, you'll put modules in separate files.

1.  **Create a new Cargo project:** `cargo new my_app_modules`

2.  **Create module files:**

      * Inside `src/`, create a file named `greetings.rs`.
      * Inside `src/greetings/`, create a file named `formal.rs`. (You'll need to create the `greetings` folder first).

3.  **Content of `src/greetings.rs`:**

    ```rust
    // src/greetings.rs
    pub fn spanish() {
        println!("¡Hola desde el módulo de saludos!");
    }

    // Declare the nested module 'formal'
    pub mod formal;
    ```

4.  **Content of `src/greetings/formal.rs`:**

    ```rust
    // src/greetings/formal.rs
    pub fn english_formal() {
        println!("Good day from the formal submodule!");
    }
    ```

5.  **Content of `src/main.rs`:**

    ```rust
    // src/main.rs

    mod greetings; // Declare the 'greetings' module (Rust looks for src/greetings.rs or src/greetings/mod.rs)

    // Bring specific items into scope using 'use' for easier access
    use greetings::spanish;
    use greetings::formal::english_formal;

    fn main() {
        spanish(); // Now you can call it directly
        english_formal(); // And this one too

        // You can still use the full path if you prefer
        greetings::spanish();
    }
    ```

<!-- end list -->

  * **`mod` declaration:** When you write `mod greetings;` in `main.rs`, Rust looks for `src/greetings.rs` or `src/greetings/mod.rs`.
  * **`pub` for Visibility:** Remember to use `pub` on items you want to expose from a module.
  * **`use` for Convenience:** `use` statements are like shortcuts; they don't change visibility but make names easier to type.

-----

**End of Lesson 3.** You've now tackled Rust's most advanced core concepts: Ownership, Structs, Enums, and Modules. These are the building blocks for writing robust and well-organized Rust applications. You're now ready to start building graphical user interfaces with Slint\!