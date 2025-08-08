---
title: Project Structure
---

**What is Cargo?**

Cargo is Rust's **build system and package manager** which streamlines almost every aspect of your Rust workflow:

- **Project Creation:** `cargo new` quickly sets up a new Rust project with the correct structure.
- **Building:** `cargo build` compiles your code into an executable program.
- **Running:** `cargo run` builds and then executes your program.
- **Testing:** `cargo test` runs your project's tests.

Let's create our classic "Hello, world\!" program using Cargo.

1.  **Create a New Project:**
    - In your terminal, navigate to a directory where you want to create your project (e.g., your Desktop or a `dev` folder).
    - Run this command:
      ```bash
      cargo new hello_rust_app
      ```
    - Cargo will create a new folder named `hello_rust_app` with a basic project structure inside.
2.  **Explore the Project Structure:**
    - Navigate into the new folder: `cd hello_rust_app`
    - Look at the contents:
      - `Cargo.toml`: This is the manifest file for your project. It contains metadata about your project (name, version) and lists its dependencies.
      - `src/main.rs`: This is where your main Rust code lives.
      - `target/`: (Created after you build) This is where compiled executable files go.
3.  **Examine `src/main.rs`:**
    - Open `src/main.rs` in your VS Code. You'll see:
      ```rust
      fn main() {
          println!("Hello, world!");
      }
      ```
      - `fn main()`: This is the main function, the entry point of every Rust executable program.
      - `println!`: This is a **macro** (indicated by the `!`). It prints text to the console.
4.  **Run Your Application:**
    - In your terminal (make sure you're inside the `hello_rust_app` folder), run:
      ```bash
      cargo run
      ```
    - **What happens?**
      - Cargo first **compiles** your code (you'll see messages like "Compiling hello_rust_app v0.1.0...").
      - Then, it **executes** the compiled program.
    - You should see: `Hello, world!` printed in your terminal.

Congratulations\! You've just created and run your very first Rust application.
