---
title: Error Handling
---

---

Welcome to a crucial topic in Rust: error handling. Unlike many other languages, Rust doesn't have exceptions. Instead, it uses a powerful type system to categorize errors and force you to handle them. This approach leads to more reliable, predictable code and prevents common bugs that can lead to unexpected program crashes.

---

### 1\. Unrecoverable Errors with `panic!`

Sometimes, a program can get into a state from which it's impossible to recover. This usually indicates a bug in your code. In these situations, **`panic!`** is the right tool. It immediately stops the program and unwinds the call stack, printing a message and a backtrace.

Use `panic!` for:

- **Logic Errors:** An index that should never be out of bounds, but is.
- **Failed Assumptions:** A value that you assumed would be `Some` but turned out to be `None`.

The `unwapped()` and `expect()` methods are also common ways to cause a panic. They are shortcuts for error handling that should only be used when you are absolutely certain an operation will succeed.

```rust
fn main() {
    let numbers = vec![1, 2, 3];
    // This will panic because index 10 is out of bounds.
    // The program stops here.
    let number = numbers[10];

    println!("{}", number);
}
```

In a production application, you should strive to avoid panics. They are for programmer errors, not for situations you can foresee and handle.

---

### 2\. Recoverable Errors with `Result<T, E>`

For situations where an error is a possibility you can predict and recover from, Rust uses the **`Result<T, E>`** enum. It represents an operation that can either succeed or fail.

`Result<T, E>` has two variants:

- **`Ok(T)`**: The operation was successful, and it returned a value of type `T`.
- **`Err(E)`**: The operation failed, and it returned an error of type `E`.

A classic example is a file operation, which can fail if the file doesn't exist or if you don't have permission to access it.

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let file_result = File::open("hello.txt");

    // We must handle both the Ok and Err cases using a `match` expression.
    let file = match file_result {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("Problem creating the file: {:?}", e),
            },
            other_error => panic!("Problem opening the file: {:?}", other_error),
        },
    };
    println!("File opened successfully!");
}
```

This approach forces you to consider every possible outcome, making your code more resilient.

---

### 3\. The `?` Operator for Error Propagation

Handling every `Result` with a `match` can get verbose. The **`?` operator** is a convenient shortcut for error handling that allows you to propagate an error up the call stack.

When you use `?` on a `Result`, one of two things happens:

- If the `Result` is `Ok(value)`, the `value` is extracted and the function continues.
- If the `Result` is `Err(error)`, the function immediately returns with that `error`.

For `?` to work, the function it's used in must return a `Result` type that is compatible with the error being propagated. Let's rewrite the file example to be much cleaner.

```rust
use std::fs::File;
use std::io::{self, Read};

// The function now returns a Result, allowing us to use `?`.
fn read_username_from_file() -> Result<String, io::Error> {
    let mut file = File::open("hello.txt")?; // Open the file, or return the error.
    let mut username = String::new();
    file.read_to_string(&mut username)?; // Read to a string, or return the error.
    Ok(username) // Return the result wrapped in Ok.
}

fn main() {
    match read_username_from_file() {
        Ok(username) => println!("Username: {}", username),
        Err(e) => println!("Error: {}", e),
    }
}
```

The `?` operator makes your code concise and clearly states that an error in one part of a function should be passed up to the caller.

---

### 4\. Optional Data with `Option<T>`

While `Result` is for errors, **`Option<T>`** is used to represent the absence of a value. It's a way of signaling that something might or might not exist.

`Option<T>` has two variants:

- **`Some(T)`**: A value of type `T` is present.
- **`None`**: There is no value.

This is often used in cases where `null` or `nil` would be used in other languages. `Option` prevents the "billion-dollar mistake" of null pointers by forcing you to handle the `None` case.

```rust
fn find_item_by_id(id: u32, items: &Vec<String>) -> Option<&String> {
    // This returns an Option<&String> because the item might not exist.
    items.get(id as usize)
}

fn main() {
    let grocery_list = vec!["milk".to_string(), "bread".to_string(), "eggs".to_string()];

    // We must handle both cases when we get a value.
    let item = find_item_by_id(1, &grocery_list);
    match item {
        Some(name) => println!("Found item: {}", name),
        None => println!("Item not found!"),
    }
}
```

You can also use the `?` operator on `Option` types, as long as the function's return type is also an `Option`.

---

### Summary

- Use **`panic!`** for unrecoverable situations that indicate a bug in your code.
- Use **`Result<T, E>`** for recoverable errors that can be handled gracefully, such as file I/O or network failures.
- Use the **`?` operator** to simplify propagating `Result` errors up the call stack.
- Use **`Option<T>`** to represent the possible absence of a value, preventing common null-related bugs.

Mastering these tools is essential for writing safe, reliable, and production-quality Rust applications.
