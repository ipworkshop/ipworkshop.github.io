---
title: Exercises
---

### 1. Guessing Game

You have to create a simple guessing game which utilizes the knowledge acquired so far.

Firstly, create a new project similar to the one in Lesson 1.

**Game Logic:**

1.  Generate a random secret number.
2.  Prompt the user to guess.
3.  Read the user's input.
4.  Compare the guess to the secret number.
5.  Tell the user if they guessed too high, too low, or correctly.
6.  Keep looping until the user guesses correctly.

### 2. Custom Error-Handling System

You will design a custom error-handling system to demonstrate your understanding of Rust's `Result`, `enum`, and trait implementation.

**Your Task:**

1.  Create a new project with a library module (`src/lib.rs`) and a main application file (`src/main.rs`).
2.  In the library module, define a public `enum` called **`MyErrorType`** with variants like `NotFound`, `UnexpectedError`, and `InvalidInput`.
3.  Define a public **`CustomError`** `struct` that contains both a `String` message and a `MyErrorType` variant.
4.  Implement the necessary traits (`std::fmt::Display` and `std::error::Error`) for your `CustomError` struct so it works with Rust's standard error handling.
5.  Create a public function named **`handle_error`** that accepts a message and an `error_type` and returns an `Err` variant of `Result<(), CustomError>`.
6.  In your `main.rs`, use the `handle_error` function to simulate different errors and demonstrate how to handle them gracefully using `Result` and the `?` operator.
