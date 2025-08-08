---
title: Control Flow and Functions
---

We'll learn how to make decisions based on conditions, repeat actions, and organize our code into reusable blocks. By the end, we'll even build a game\!

---

### 1. Conditional Execution: `if` Statements

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

- **Conditions Must Be `bool`:** In Rust, the condition inside an `if` statement _must_ evaluate to a **boolean** (`true` or `false`). You can't just use a number like in some other languages.
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

- **Important:** All branches of an `if` expression **must return the same type**. If one branch returns an integer and another returns a string, Rust won't compile because it can't determine the final type of the variable.

---

### 2. Iterative Control Structures

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

- **Iterating over a Range:**

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

- **Iterating over an Array/Vector:**

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

---

### 3. Defining and Utilizing Functions

Functions are blocks of code that perform a specific task and can be reused.

#### **Basic Function Syntax:**

- Functions are declared using the `fn` keyword.
- Parameters are type-annotated.
- The return type is specified after an arrow `->`.
- The last expression in a function (without a semicolon) is implicitly returned. You can also use the `return` keyword explicitly.

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

Well, you have all the required knowladge to solve the first exercise. It is time to practice!
