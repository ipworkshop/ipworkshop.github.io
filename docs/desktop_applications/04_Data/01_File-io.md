---
title: File I/O in Rust
---

File Input/Output (I/O) is how your application reads and writes data to the computer's file system. In Rust, these operations are handled by the `std::fs` module and a set of I/O traits, all designed to be safe and to force you to handle potential errors.

---

### Opening a File

The main type for file operations is `std::fs::File`. To get an instance of this type, you use `File::open`. This function returns a **`Result<File, std::io::Error>`**, not the `File` itself. This is because a file might not exist or be accessible, and Rust requires you to handle these possibilities.

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let file_result = File::open("config.txt");

    // The 'match' expression handles both possible outcomes of the Result.
    let file = match file_result {
        Ok(file) => file, // The file was opened successfully, we can now use it.
        Err(error) => match error.kind() {
            // A common, recoverable error: file not found.
            ErrorKind::NotFound => {
                println!("File not found. Creating a new one...");
                File::create("config.txt").unwrap()
            },
            // Any other error is unrecoverable, so we panic.
            other_error => {
                panic!("Problem opening the file: {:?}", other_error);
            }
        },
    };
}
```

**Why it can throw errors**: Any interaction with the operating system is prone to failure. The disk could be full, the file could be deleted by another process, or you may not have the correct permissions. Rust's `Result` type prevents these failures from causing a program crash by making you explicitly write code to handle them.

---

### Reading and Writing

Once a file is open, you can read from or write to it. The traits `std::io::Read` and `std::io::Write` provide the necessary methods.

#### Reading a File

To read a text file's entire contents into a `String`, you can use the `read_to_string` method. This method also returns a `Result` because the read operation can fail.

```rust
use std::fs::File;
use std::io::{self, Read};

// Returns a Result containing the file contents on success, or an error on failure.
fn read_config(path: &str) -> Result<String, io::Error> {
    let mut file = File::open(path)?; // The '?' operator propagates an error if the file can't be opened.
    let mut contents = String::new();
    file.read_to_string(&mut contents)?; // '?' propagates an error if reading fails.
    Ok(contents)
}
```

Here, we use the **`?` operator** which is a clean and concise way to handle `Result` types. If the `Result` is `Ok`, the value is unwrapped. If it's `Err`, the function immediately returns with that error. This keeps the code from being cluttered with `match` statements.

#### Writing to a File

To write to a file, you first create it with `File::create`, and then use methods like `write_all`.

```rust
use std::fs::File;
use std::io::{self, Write};

fn save_data(path: &str, data: &str) -> Result<(), io::Error> {
    let mut file = File::create(path)?; // '?' propagates an error if the file can't be created.
    file.write_all(data.as_bytes())?; // '?' propagates an error if writing fails.
    Ok(())
}
```

This function demonstrates a common pattern where `Ok(())` is returned to signal a successful operation that doesn't produce a value.

---

### Putting It All Together

For a desktop application, you'll typically have functions that handle I/O and a top-level `main` function that manages the overall flow and displays any final errors to the user.

```rust
use std::io::{self, Write};
use std::fs::File;
use std::error::Error;

// main() can return a Result to handle errors gracefully.
fn main() -> Result<(), Box<dyn Error>> {
    // Attempt to save data.
    let save_result = save_data("log.txt", "Application started.");

    // Handle the result at the top level.
    if let Err(e) = save_result {
        eprintln!("Error saving log file: {}", e);
        // We can choose to continue or exit.
    }

    // This will work because the ? operator in save_data() ensures we get an error if saving fails.
    save_data("log.txt", "Another line of text.")?;

    println!("File operations successful!");
    Ok(()) // All went well.
}
```

In this example, the `main` function itself returns a `Result`, allowing the program to cleanly exit with an error code if any of the file operations fail. This is a robust pattern for real-world desktop applications.
