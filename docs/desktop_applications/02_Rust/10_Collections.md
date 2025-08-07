---
title: Collections
---

---

### An Introduction to Rust's Standard Collections

Rust's standard library provides a rich set of data structures for managing data, all designed with the language's core principles of performance and safety in mind. These collections are generic, meaning they can hold any type of data, and they're highly optimized.

---

### `Vec<T>`: The Growable Array

The `Vec<T>` is a dynamic, growable array, a lot like `std::vector` in C++. It's one of the most widely used collections in Rust. It stores values on the heap, so its size can change at runtime.

#### Key Features:

- **Contiguous Storage:** Elements are stored next to each other in memory, making access very fast.

- **Heap-allocated:** The data is stored on the heap, and the `Vec` itself is a small pointer on the stack, which points to the data.

- **Growable:** You can add and remove elements. `push()` will handle reallocation if needed.

#### Example:

```
// Create a new, empty Vec that will hold i32 values.
let mut numbers: Vec<i32> = Vec::new();

// Add elements to the Vec.
numbers.push(10);
numbers.push(20);
numbers.push(30);

// You can also create a Vec with initial values using a macro.
let mut other_numbers = vec![1, 2, 3];

// Accessing elements by index. This will panic if the index is out of bounds.
let third = numbers[2];
println!("The third element is: {}", third);

// A safer way to get an element is with the `.get()` method, which returns an Option.
match numbers.get(10) {
    Some(value) => println!("The value at index 10 is: {}", value),
    None => println!("Index 10 is out of bounds."),
}



```

---

### `String` & `&str`: The Text Types

Working with text in Rust involves two main types, which can be a point of confusion for beginners.

- **`String`**: This is a heap-allocated, growable, and mutable UTF-8 encoded string. It's the equivalent of `std::string` in C++. You use it when you need to own the data and potentially modify it.

- **`&str` (string slice)**: This is an immutable view or "slice" into a `String` or a string literal. It's a pointer to the data and its length. You can think of it like `const char*` in C++, but safer and aware of its length. `&str` is often used for function arguments.

#### Example:

```
// A mutable, heap-allocated String.
let mut s1 = String::from("hello");

// A string slice, which is a view into the string literal.
let s2: &str = "world";

// You can push characters or strings onto a String.
s1.push_str(", ");
s1.push_str(s2);
s1.push('!');

println!("{}", s1); // Prints "hello, world!"

// String slices can be created from Strings.
let slice = &s1[0..5]; // This creates a slice "hello".
println!("A slice: {}", slice);

// Note that you cannot use an index to access a character directly,
// as a single character might take up more than one byte in UTF-8.



```

---

### `HashMap<K, V>`: The Key-Value Store

`HashMap<K, V>` is a collection that stores data as key-value pairs, similar to `std::unordered_map` in C++. It provides an efficient way to look up a value based on its key.

#### Key Features:

- **Key-Value Pairs:** Stores data in a `(key, value)` format.

- **Efficient Lookups:** Provides average $O(1)$ time complexity for insertion and retrieval.

- **Hashing:** The key type `K` must implement the `Hash` trait so the `HashMap` can determine where to store the data. It also needs to implement the `Eq` trait for comparison.

#### Example:

```
use std::collections::HashMap;

// Create a new HashMap. The compiler will infer the types.
let mut scores = HashMap::new();

// Insert key-value pairs.
scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);

// Get a value from the HashMap. This returns an Option<&V>.
let team_name = String::from("Blue");
let score = scores.get(&team_name);

match score {
    Some(value) => println!("The blue team's score is: {}", value),
    None => println!("No score found for that team."),
}

// Iterate over the HashMap's key-value pairs.
for (key, value) in &scores {
    println!("{}: {}", key, value);
}



```

---

### Other Useful Collections

Beyond the core collections, Rust's standard library offers several others for more specific use cases. Here's a brief mention of them with links to their official documentation for further exploration.

- **`HashSet<T>`**: A collection of unique values, similar to `std::unordered_set` in C++. It offers fast, average $O(1)$ time complexity for insertion, deletion, and checking for the presence of an item.

  - [Official `HashSet` Docs](https://doc.rust-lang.org/std/collections/struct.HashSet.html)

- **`BTreeMap<K, V>`**: A map that stores key-value pairs in a sorted order, comparable to `std::map` in C++. It has a logarithmic $O(\\log n)$ time complexity for operations but guarantees a consistent, sorted iteration order.

  - [Official `BTreeMap` Docs](<https://www.google.com/search?q=%5Bhttps://www.google.com/search%3Fq%3D%255Bhttps://www.google.com/search%253Fq%253D%25255Bhttps://doc.rust-lang.org/std/collections/struct.BTreeMap.html%25255D%255D%5D(https://www.google.com/search%3Fq%3D%255Bhttps://www.google.com/search%253Fq%253D%25255Bhttps://doc.rust-lang.org/std/collections/struct.BTreeMap.html%25255D%255D)(%5Bhttps://www.google.com/search%253Fq%253D%25255Bhttps://doc.rust-lang.org/std/collections/struct.BTreeMap.html%25255D%5D(https://www.google.com/search%253Fq%253D%25255Bhttps://doc.rust-lang.org/std/collections/struct.BTreeMap.html%25255D))(%255B%5Bhttps://doc.rust-lang.org/std/collections/struct.BTreeMap.html%255D%5D(https://doc.rust-lang.org/std/collections/struct.BTreeMap.html%255D)(%5Bhttps://doc.rust-lang.org/std/collections/struct.BTreeMap.html%5D(https://doc.rust-lang.org/std/collections/struct.BTreeMap.html)))>)

- **`BTreeSet<T>`**: A collection of unique, sorted values, similar to `std::set` in C++. It also provides logarithmic $O(\\log n)$ time complexity and guarantees sorted iteration.

  - [Official `BTreeSet` Docs](https://doc.rust-lang.org/std/collections/struct.BTreeMap.html)

- **`VecDeque<T>`**: A double-ended queue, which is a growable array optimized for efficient pushes and pops from both the front and the back.

  - [Official `VecDeque` Docs](https://doc.rust-lang.org/std/collections/struct.VecDeque.html)

- **`LinkedList<T>`**: A classic doubly-linked list. While a `VecDeque` is often a better choice, a `LinkedList` can be more efficient for frequent insertions and deletions at arbitrary positions.

  - [Official `LinkedList` Docs](https://doc.rust-lang.org/std/collections/struct.LinkedList.html)
