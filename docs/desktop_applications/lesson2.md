---
title: Control Flow & Functions
sidebar_position: 2
---

-----

# Lesson 2: Rust Fundamentals - Control Flow & Functions

 We'll learn how to make decisions based on conditions, repeat actions, and organize our code into reusable blocks. By the end, we'll even build a game\!

-----

### 2.1 Conditional Execution: `if` Statements (15 min)

Just like in other programming languages, `if` statements in Rust let your program execute different code blocks based on whether a condition is true or false.

#### **Basic `if`, `else if`, `else`:**

You'll find this structure very familiar:

```rust
fn main() {
    let number = 7;

    if number < 5 { // If this condition is true
        println!("Condition was true: number is less than 5");
    } else if number == 5 { // Otherwise, if this condition is true
        println!("Condition was true: number is exactly 5");
    } else { // If none of the above conditions are true
        println!("Condition was false: number is greater than 5");
    }
}
```

  * **Conditions Must Be `bool`:** In Rust, the condition inside an `if` statement *must* evaluate to a **boolean** (`true` or `false`). You can't just use a number like in some other languages.
    ```rust
    // This would be an ERROR: `if number` is not allowed in Rust
    // if number {
    //     println!("Number was something!");
    // }
    ```

#### **`if` as an Expression:**

A cool feature in Rust is that `if` statements are **expressions**, meaning they can return a value. This is super handy for assigning values conditionally.

```rust
fn main() {
    let condition = true;
    let number = if condition { // 'if' expression returns a value
        5 // This value is returned if 'condition' is true
    } else {
        6 // This value is returned if 'condition' is false
    }; // Note the semicolon here, as it's a statement assigning a value

    println!("The value of number is: {}", number); // Output: The value of number is: 5

    let message = if number > 5 {
        "Number is greater than 5"
    } else {
        "Number is 5 or less"
    }; // Both branches must return the SAME TYPE!

    println!("Message: {}", message);
}
```

  * **Important:** All branches of an `if` expression **must return the same type**. If one branch returns an integer and another returns a string, Rust won't compile because it can't determine the final type of the variable.

-----

### 2.2 Advanced Pattern Matching: The `match` Expression (10 min)

The `match` expression is one of Rust's most powerful control flow constructs. It allows you to compare a value against a series of patterns and then execute code based on which pattern matches. It's often a more robust and readable alternative to long `if-else if` chains.

  * **Exhaustiveness:** A key feature of `match` is that it must be **exhaustive**. This means you have to cover *every possible value* that the data could take. If you don't, Rust's compiler will give you an error, which helps prevent bugs\!

Let's look at a simple example with numbers:

```rust
fn main() {
    let number = 3;

    match number { // Match the 'number' against these patterns
        1 => println!("One!"), // If number is 1, do this
        2 => println!("Two!"), // If number is 2, do this
        3 | 4 => println!("Three or Four!"), // If number is 3 OR 4, do this (multiple patterns)
        5..=10 => println!("Between 5 and 10, inclusive!"), // If number is in this range
        _ => println!("Something else!"), // The underscore '_' is a catch-all pattern (like 'default' in switch)
    }

    let result = match number { // 'match' can also be an expression, returning a value
        1 => "It's one",
        _ => "It's not one", // All branches must return the same type!
    };
    println!("Result: {}", result);
}
```

  * **When to use `match` vs. `if`:**
      * Use `if` for simple true/false conditions or a few distinct branches.
      * Use `match` when you have many possible values or complex patterns to handle, especially when working with `enum`s (which we'll cover in Lesson 3) or `Result` types (which you saw in Lesson 1's I/O).

-----

### 2.3 Iterative Control Structures (30 min)

Repeating actions is a fundamental part of programming. Rust provides several ways to create loops.

#### **`loop` (Infinite Loop with `break`):**

The `loop` keyword creates an infinite loop. You'll typically use `break` to exit it based on a condition, and `continue` to skip to the next iteration.

```rust
fn main() {
    let mut counter = 0;

    let result = loop { // 'loop' can also return a value!
        counter += 1;
        println!("Loop count: {}", counter);

        if counter == 10 {
            break counter * 2; // Break the loop and return this value
        }
    }; // Semicolon here, as it's an expression

    println!("Loop finished. Result: {}", result); // Output: Loop finished. Result: 20
}
```

#### **`while` Loop:**

A `while` loop executes a block of code repeatedly as long as a specified condition remains true.

```rust
fn main() {
    let mut number = 3;

    while number != 0 {
        println!("{}!", number);
        number -= 1; // Decrement number
    }
    println!("LIFTOFF!!!");
}
```

#### **`for` Loop (Iterating over Collections):**

The `for` loop is the most common loop in Rust. It's used to iterate over elements in a collection (like arrays, vectors, or ranges). This is often safer and more concise than `while` loops for iterating.

  * **Iterating over a Range:**

    ```rust
    fn main() {
        // Iterate from 1 up to (but not including) 5
        for number in 1..5 {
            println!("Number in range: {}", number);
        }
        // Iterate from 1 up to AND including 5
        for number in 1..=5 {
            println!("Number in range (inclusive): {}", number);
        }
    }
    ```

  * **Iterating over an Array/Vector:**

    ```rust
    fn main() {
        let a = [10, 20, 30, 40, 50];

        for element in a.iter() { // .iter() creates an iterator over the elements
            println!("The value is: {}", element);
        }

        // You can also iterate with an index if needed (less common in idiomatic Rust)
        for (index, element) in a.iter().enumerate() {
            println!("Element at index {}: {}", index, element);
        }
    }
    ```

-----

### 2.4 Defining and Utilizing Functions (15 min)

Functions are blocks of code that perform a specific task and can be reused.

#### **Basic Function Syntax:**

  * Functions are declared using the `fn` keyword.
  * Parameters are type-annotated.
  * The return type is specified after an arrow `->`.
  * The last expression in a function (without a semicolon) is implicitly returned. You can also use the `return` keyword explicitly.

<!-- end list -->

```rust
// A function that doesn't take parameters and doesn't return a value
fn greet() {
    println!("Hello from the greet function!");
}

// A function that takes parameters and returns a value
fn add_numbers(x: i32, y: i32) -> i32 { // Takes two i32s, returns an i32
    x + y // This is an expression, implicitly returned
}

// A function with an explicit return
fn subtract_numbers(a: i32, b: i32) -> i32 {
    return a - b; // Explicit return
}

fn main() {
    greet(); // Call the greet function

    let sum = add_numbers(5, 7); // Call add_numbers and store the result
    println!("The sum is: {}", sum); // Output: The sum is: 12

    let difference = subtract_numbers(10, 3);
    println!("The difference is: {}", difference); // Output: The difference is: 7
}
```

-----

### 2.5 Practical Application: Developing a Console-Based Guessing Game (20 min)

Let's put everything we've learned so far into practice by building a simple "Guess the Number" game in the console\!

**Game Logic:**

1.  Generate a random secret number.
2.  Prompt the user to guess.
3.  Read the user's input.
4.  Compare the guess to the secret number.
5.  Tell the user if they guessed too high, too low, or correctly.
6.  Keep looping until the user guesses correctly.

**New Concepts/Tools:**

  * **`rand` crate:** We'll need a library to generate random numbers. Add `rand = "0.8.5"` (or a recent version) to your `Cargo.toml` under `[dependencies]`.
  * **`use rand::Rng;`:** To bring the random number generator trait into scope.
  * **`parse()` method:** To convert the user's input string to a number. This also returns a `Result`, so we'll handle it.

**Steps to Build:**

1.  **Create a new Cargo project:** `cargo new guessing_game`
2.  **Add `rand` dependency:** Open `Cargo.toml` and add `rand = "0.8.5"` under `[dependencies]`.
3.  **Open `src/main.rs`** and replace its content with the following:

<!-- end list -->

```rust
// src/main.rs
use std::io; // For input/output operations
use rand::Rng; // For generating random numbers
use std::cmp::Ordering; // For comparing numbers (used with match)

fn main() {
    println!("Guess the number!");

    // Generate a random number between 1 and 100 (inclusive)
    // thread_rng() gives us a random number generator local to the current thread.
    // gen_range(1..=100) generates a number in the specified range.
    let secret_number = rand::thread_rng().gen_range(1..=100);

    // For debugging, you can uncomment this line:
    // println!("The secret number is: {}", secret_number);

    loop { // Start an infinite loop for the game
        println!("Please input your guess:");

        let mut guess = String::new(); // Create a mutable string to store user input

        // Read the user's guess from the console
        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read line"); // Handle potential errors

        // Convert the guess from String to a number (u32).
        // .trim() removes any whitespace (like the newline character)
        // .parse() attempts to convert the string to a number. It returns a Result.
        // We use a 'match' expression to handle the Result:
        // - If Ok, we get the number.
        // - If Err, it means the input wasn't a valid number, so we print an error
        //   and 'continue' to the next loop iteration (ask for guess again).
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num, // If parsing was successful, use the number
            Err(_) => {     // If parsing failed (e.g., user typed text)
                println!("Please type a number!");
                continue;   // Skip to the next iteration of the loop
            }
        };

        println!("You guessed: {}", guess);

        // Compare the guess to the secret number using 'match' and 'Ordering' enum
        // Ordering is an enum with variants Less, Greater, and Equal.
        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),    // If guess is less than secret
            Ordering::Greater => println!("Too big!"),   // If guess is greater than secret
            Ordering::Equal => {                         // If guess is equal to secret
                println!("You win!");
                break; // Exit the loop (and the game)
            }
        }
    }
}
```

**Run your game:**
In your terminal, navigate into the `guessing_game` folder and run:
`cargo run`

Now, play the game\! Try typing text instead of numbers to see the error handling.

-----

**End of Lesson 2.** You've now mastered Rust's core control flow, functions, and even built a complete interactive game\! This is a huge step in your Rust journey. Next, we'll tackle Rust's most unique and powerful concept: Ownership.