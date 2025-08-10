---
title: Pattern Matching
---

---

### Advanced Pattern Matching: The `match` Expression (10 min)

The `match` expression is one of Rust's most powerful control flow constructs. It allows you to compare a value against a series of patterns and then execute code based on which pattern matches. It's often a more robust and readable alternative to long `if-else if` chains.

- **Exhaustiveness:** A key feature of `match` is that it must be **exhaustive**. This means you have to cover _every possible value_ that the data could take. If you don't, Rust's compiler will give you an error, which helps prevent bugs\!

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

- **When to use `match` vs. `if`:**
  - Use `if` for simple true/false conditions or a few distinct branches.
  - Use `match` when you have many possible values or complex patterns to handle, especially when working with `enum`s (which we'll cover in Lesson 3) or `Result` types (which you saw in Lesson 1's I/O).

---
