---
title: Variables and data types
---

Now let's dive into how Rust handles variables and data. This is where you'll see some key differences from languages like JavaScript or Python.

#### **Immutability by Default:**
This is one of Rust's core principles. By default, variables in Rust are **immutable**, meaning once you give them a value, you cannot change that value. This helps prevent unexpected bugs.

  * **Declaring an Immutable Variable:**
    ```rust
    fn main() {
        let x = 5; // 'x' is immutable. Its value is 5, and it cannot be changed.
        println!("The value of x is: {}", x);
        // x = 6; // This would cause a compile-time error! Try uncommenting it.
        // println!("The value of x is: {}", x);
    }
    ```

  * **Making a Variable Mutable:**
    If you *do* want to change a variable's value, you must explicitly mark it as `mut` (short for mutable).
    ```rust
    fn main() {
        let mut y = 10; // 'y' is mutable. We can change its value.
        println!("The initial value of y is: {}", y);
        y = 15; // This is allowed because 'y' is mutable.
        println!("The new value of y is: {}", y);
    }
    ```
#### **Type Inference vs. Explicit Types:**
Rust is a **statically typed** language, meaning it knows the type of every variable at compile time. However, it's also very smart and can often **infer** the type based on the value you assign. You don't always *have* to write the type.
  * **Type Inference (Common):**
    ```rust
    fn main() {
        let age = 30; // Rust infers 'age' is an integer (i32 by default)
        let pi = 3.14; // Rust infers 'pi' is a floating-point number (f64 by default)
        let is_active = true; // Rust infers 'is_active' is a boolean
        let initial = 'A'; // Rust infers 'initial' is a character (single quotes)
        let greeting = "Hello"; // Rust infers 'greeting' is a string slice (&str)
        println!("Age: {}, Pi: {}, Active: {}, Initial: {}, Greeting: {}", age, pi, is_active, initial, greeting);
    }
    ```
  * **Explicit Type Annotation (When needed or for clarity):**
    You can explicitly tell Rust the type of a variable. This is useful when inference is ambiguous or for better readability.
    ```rust
    fn main() {
        let count: i64 = 100_000_000_000; // Explicitly a 64-bit integer
        let temperature: f32 = 25.5; // Explicitly a 32-bit float
        let message: &str = "Welcome!"; // Explicitly a string slice
        println!("Count: {}, Temp: {}, Message: {}", count, temperature, message);
    }
    ```
#### **Common Primitive Data Types:**
Rust has several built-in primitive types:
  * **Integers:** `i8`, `i16`, `i32` (default), `i64`, `i128` (signed integers) and `u8`, `u16`, `u32`, `u64`, `u128` (unsigned integers). The number indicates the bits they use. `isize` and `usize` depend on the architecture (e.g., 32-bit or 64-bit).
  * **Floating-Point Numbers:** `f32` (single-precision), `f64` (double-precision, default).
  * **Booleans:** `bool` (`true` or `false`).
  * **Characters:** `char` (single Unicode scalar value, uses single quotes, e.g., `'A'`, `'😊'`).
  * **Strings:** We'll learn more about strings later, but for now, know that `&str` (string slice, immutable reference to text) and `String` (growable, owned string) are the main types.

#### **Constants:**

Constants are always immutable and must have their type explicitly annotated. They can be declared in any scope, including global.

```rust
const MAX_POINTS: u32 = 100_000; // Constants are typically named in SCREAMING_SNAKE_CASE
const APP_VERSION: &str = "1.0.0";
fn main() {
    println!("Max points: {}", MAX_POINTS);
    println!("App version: {}", APP_VERSION);
}
```

#### **Shadowing:**

Rust allows you to declare a *new* variable with the same name as a previous variable. This "shadows" the previous variable, meaning the new variable takes precedence. This is different from `mut`, as you're creating a new variable, not changing an existing one.
```rust
fn main() {
    let spaces = "   "; // First 'spaces' variable (string slice)
    println!("Spaces (initial): '{}'", spaces);
    let spaces = spaces.len(); // 'spaces' is now a new variable, holding the length (an integer)
    println!("Spaces (length): {}", spaces); // The old 'spaces' is no longer accessible
}
```
Shadowing is useful when you want to transform a variable's value but keep the same name, without needing to make the original variable mutable.