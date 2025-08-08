---
title: Module Organization
---

### Organizing Code with Modules

As your Rust projects grow, you'll want to organize your code into logical units. Rust's module system helps you do this.

- **Modules (`mod`):** Modules are like namespaces or containers for functions, structs, enums, and other modules. They help prevent naming conflicts and control visibility.
- **`use` Keyword:** The `use` keyword brings items from modules into your current scope, so you don't have to type the full path every time.
- **`pub` Keyword:** By default, everything in Rust is private. To make an item (function, struct, enum, module) visible outside its current module, you need to mark it with `pub` (public).

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

    - Inside `src/`, create a file named `greetings.rs`.
    - Inside `src/greetings/`, create a file named `formal.rs`. (You'll need to create the `greetings` folder first).

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

- **`mod` declaration:** When you write `mod greetings;` in `main.rs`, Rust looks for `src/greetings.rs` or `src/greetings/mod.rs`.
- **`pub` for Visibility:** Remember to use `pub` on items you want to expose from a module.
- **`use` for Convenience:** `use` statements are like shortcuts; they don't change visibility but make names easier to type.

---
