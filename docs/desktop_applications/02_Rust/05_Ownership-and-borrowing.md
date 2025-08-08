---
title: Ownership, Borrowing, and Slices in Rust
---

In this lesson, we’ll take a closer look at three of Rust’s most important concepts: **ownership**, **borrowing**, and **slices**.  
These are the foundations of Rust’s **memory safety**, allowing it to manage memory **without a garbage collector** and to **prevent data races at compile time**.


### 1. Ownership

Ownership is **Rust’s memory management system**. Instead of a garbage collector, Rust tracks **who owns each piece of data** and **frees it automatically** when no longer needed.

Key ideas:
- No garbage collector.  
- Strict rules, checked during compilation.  
- Violating them causes compilation errors.

**Stack** and **Heap** memory:

- **Stack**:
  - Stores data in **Last-In, First-Out (LIFO)** order.
  - Extremely fast because the memory location is always at the “top of the stack.”
  - Requires values to have a **known, fixed size** at compile time.
  - Automatically freed when the variable goes out of scope.

- **Heap**:
  - Stores **dynamically sized or growable data** (like `String` or `Vec`).
  - Memory must be **requested at runtime** from the allocator.
  - Access is **slower** because you must **follow a pointer** from the stack to the heap.
  - Memory must eventually be freed, which is where **ownership rules** come in.

Rust’s **ownership system** exists to **safely manage heap memory**, automatically cleaning up resources and preventing data races.

### **The 3 Ownership Rules**

1. **Each value in Rust has a single owner** (a variable that “owns” the value).  
2. **When the owner goes out of scope, the value is dropped** (memory freed).  
3. **Ownership can be moved, but not copied by default** (unless the type is `Copy` or you explicitly `clone`).


#### **Example:**

```rust
fn main() {
    let s1 = String::from("hello"); // s1 owns the string
    let s2 = s1; // ownership moves to s2

    // println!("{}", s1); // ERROR: s1 no longer owns the value
    println!("{}", s2); // Works
}
```

- After `s2 = s1`, **s1 is invalidated** to prevent **double free** errors.  
- When `main` ends, `s2` is dropped, and Rust frees the memory automatically.

---

### **Copy vs Clone**

Rust **treats data differently** depending on **where it lives**:  

- **Stack-only data (simple types)** → **Copied automatically**  
- **Heap-allocated data (complex types)** → **Moved by default**


#### **1. Copy Types (Stack-Only)**

- Examples: integers (`i32`), booleans (`bool`), characters (`char`), and tuples of `Copy` types.
- These types are **small and fixed-size**, so Rust **copies them cheaply** instead of moving them.

```rust
fn main() {
    let x = 5;     // i32 is a Copy type
    let y = x;     // A new copy of 5 is created on the stack

    println!("x = {}, y = {}", x, y); // Both valid
}
```

Stack values are **duplicated instantly**, so `x` still owns its 5 and `y` has its own 5.


#### **2. Move Semantics (Heap Data)**

- Types like `String`, `Vec<T>`, or any custom type **holding heap memory** are **moved by default**.
- Assigning them **transfers ownership** instead of copying the underlying heap memory (which could be expensive).

```rust
fn main() {
    let s1 = String::from("hello"); // s1 owns the heap data
    let s2 = s1;                    // s1 is MOVED into s2

    // println!("{}", s1); // ERROR: s1 is no longer valid
    println!("{}", s2);   // Only s2 can be used now
}
```

**Why move instead of copy?**  
- Copying large heap data automatically could be **slow**.  
- Move avoids extra work while still keeping memory safe.


#### **3. Clone (Deep Copy)**

- If you **want a real copy of the heap data**, call `.clone()`.

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone(); // Copies heap data as well

    println!("s1 = {}, s2 = {}", s1, s2); // Both valid
}
```

- **Move**: only the pointer and metadata are copied; old owner is invalid. (Cheap)  
- **Clone**: heap data is copied too; both owners are valid. (More expensive)


Think of **ownership like house keys**:

- **Copy** - Making a **duplicate key** for a small box (cheap and simple).  
- **Move** - Handing your **only key** to someone else (you can’t access it anymore).  
- **Clone** - **Building a whole new house** with its own key (expensive).  

---

### 2. Borrowing and References

If we want to **use a value in multiple places** without transferring ownership.  
Rust solves this with **borrowing**, which allows **references** to a value.

- A **reference** is like a **pointer** that guarantees memory safety.
- Borrowing allows **access without taking ownership**, so the original variable stays valid.
- **No runtime overhead**: the compiler ensures safety rules.


### **Immutable References (`&T`)**

An immutable reference lets you **read data without taking ownership**:

```rust
fn main() {
    let s = String::from("hello");

    let len = calculate_length(&s); // Borrow immutably
    println!("The length of '{}' is {}.", s, len); // s is still valid
}

fn calculate_length(s: &String) -> usize {
    s.len() // Can read, cannot modify
}
```

- `&s` is a **reference** (borrow).  
- The original variable **keeps ownership**.  
- You **cannot modify** through an immutable reference.


### **Mutable References (`&mut T`)**

If we want to **modify** a value without transferring ownership, we use **mutable references**:

```rust
fn main() {
    let mut s = String::from("hello");

    change(&mut s); // Borrow mutably
    println!("{}", s); // Output: hello, world
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

- Only **one mutable reference** is allowed at a time.  
- This prevents **data races**, ensuring **safe concurrent access**.


### **Borrowing Rules**

1. **You can have either:**  
   - Any number of **immutable references**  
   - **OR** one **mutable reference**  
2. **References must always be valid** (no dangling pointers).  

These rules ensure Rust can **guarantee memory safety** at compile time.

---

## 3. Slices

A **slice** is a **reference to part of a collection**.  
Slices let you **work with sub-sections of data without copying**.


### **String Slices (`&str`)**

```rust
fn main() {
    let s = String::from("hello world");

    let hello = &s[0..5]; // Slice of "hello"
    let world = &s[6..11]; // Slice of "world"

    println!("{} {}", hello, world);
}
```

- `&s[start..end]` creates a slice from `start` (inclusive) to `end` (exclusive).  
- `&s[..]` creates a slice of the **entire string**.

---

### **Slices in Functions**

Slices are commonly used to **avoid copying data** when processing collections:

```rust
fn first_word(s: &str) -> &str { // Accepts &String or string literal
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[..i]; // Slice until first space
        }
    }

    &s[..] // If no space, return entire string
}

fn main() {
    let s = String::from("hello world");
    let word = first_word(&s);
    println!("First word: {}", word);
}
```

- `&str` is already a **string slice**.  
- Returning a slice is **efficient** and avoids extra allocations.

---

### **Array Slices**

Slices also work with arrays:

```rust
fn main() {
    let arr = [1, 2, 3, 4, 5]; 
    let slice = &arr[1..4]; // Elements 2, 3, 4

    for val in slice {
        println!("{}", val);
    }
}
```

- Array slices are `&[T]`.  
- They **borrow part of the array** without copying it.

---

### Exercises
// to be added later