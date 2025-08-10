---
title: Async and Await
---

### Asynchronous Programming with `async` and `await`

Asynchronous programming is a way for your program to perform tasks without waiting for a blocking operation (like a slow network request or reading a large file) to finish. Instead of blocking, your program can start another task while it waits, maximizing efficiency. In Rust, this is achieved using the **`async`** and **`await`** keywords, which work together with an asynchronous runtime to manage these non-blocking operations.

---

### The `async` Keyword: Creating a `Future`

When you mark a function with the `async` keyword, you're telling the compiler that this function contains an asynchronous operation. Critically, an `async` function does not run its code immediately when called. Instead, it returns a special type called a **`Future`**.

Think of a `Future` as a "promise" or a "recipe" for an upcoming value. It's an inert object that describes what work needs to be done. The work described in the `async` function won't start until this `Future` is actively executed by a runtime.

```rust
async fn my_async_task() -> String {
    // This code will only run when the Future is awaited.
    "Task finished".to_string()
}

fn main() {
    // Calling the async function returns a Future, but nothing runs.
    let future = my_async_task();

    // The program would end here without executing my_async_task().
}
```

This example shows that just calling `my_async_task()` by itself does nothing. The `Future` is created and immediately dropped because it's never told to run.

---

### The `await` Keyword and the Runtime

The **`await`** keyword is the key to running a `Future`. It tells the program to "execute this `Future` and give me its value when it's ready." When an `await` call is made, the current task pauses, yielding control to an asynchronous runtime. The runtime then looks for other tasks to run that are ready to make progress.

For this system to work, your application needs an **asynchronous runtime**. This is the scheduler that manages all the `Future`s, decides when they should run, and wakes them up when a blocking operation (like a network request) completes. **Tokio** is the most popular runtime for Rust.

To use Tokio, you must first add it to your `Cargo.toml`:

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
```

Then, you can use the `#[tokio::main]` macro to set up the runtime and make your `main` function an async entry point.

```rust
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    println!("Start of program.");

    // The program pauses here for 2 seconds without blocking the thread.
    sleep(Duration::from_secs(2)).await;

    println!("End of program after waiting.");
}
```

---

### Concurrency with `await`: `join!` and `select!`

The real power of `async` and `await` is the ability to run multiple tasks concurrently. By starting several `Future`s and then awaiting them, your program's runtime will manage them all efficiently. The **`tokio::join!`** macro is perfect for this, as it waits for all given `Future`s to complete.

```rust
use tokio::time::{sleep, Duration};
use tokio::join;

async fn fetch_user_data() -> String {
    sleep(Duration::from_secs(3)).await;
    println!("User data fetched after 3s.");
    "User".to_string()
}

async fn fetch_product_data() -> String {
    sleep(Duration::from_secs(1)).await;
    println!("Product data fetched after 1s.");
    "Product".to_string()
}

#[tokio::main]
async fn main() {
    println!("Fetching data concurrently...");

    // These two futures are started at the same time and run together.
    let (user_data, product_data) = join!(fetch_user_data(), fetch_product_data());

    println!("Total execution time is ~3s, not 4s.");
    println!("Result 1: {}", user_data);
    println!("Result 2: {}", product_data);
}
```

In this example, the total execution time is approximately 3 seconds (the duration of the longest task), not the sum of both tasks, because they run concurrently. The `join!` macro waits for both futures to complete before moving on. The `tokio::select!` macro is similar, but it completes as soon as one of the futures finishes.

---

### The "No Await" Pitfall: Dropping a `Future`

As mentioned earlier, simply calling an `async` function and not using `await` means the `Future` is never executed. It's created and immediately dropped at the end of the line.

```rust
use tokio::time::{sleep, Duration};

async fn my_task() {
    sleep(Duration::from_secs(1)).await;
    println!("This line will never be printed.");
}

#[tokio::main]
async fn main() {
    println!("Starting program.");

    // We call the async function, but we don't await its Future.
    // The Future is created but immediately dropped.
    my_task();

    println!("Finished program.");
    // The program ends immediately, and 'my_task' never runs.
}
```

This is a common mistake for newcomers to async Rust. You must always `await` a `Future` or pass it to a runtime scheduler (e.g., with a function like `tokio::spawn`) for its code to execute.
