---
title: Local Storage & File System
sidebar_position: 9
---

---

# Lesson 9: Data Persistence - Local Storage & File System

So far, our apps lose all their data when you close them. This isn't very practical for things like user settings, saved progress, or stored notes. Today, we'll learn how to make your Rust desktop applications **remember** data, even after they've been closed and reopened. This is called **data persistence**. 💾

---

### 9.1 The Necessity of Persistent Data in Desktop Applications (5 min)

Imagine your favorite word processor. What if every time you closed it, your document disappeared? Or your game, where your progress vanished? That would be incredibly frustrating\!

- **User Experience:** Users expect applications to remember their preferences, last-opened files, login status, and any data they've created.
- **Application State:** Many applications need to store internal data that defines their current state or configuration.
- **Offline Capability:** Desktop applications often need to work without an internet connection, requiring local storage of data.
- **Data Integrity:** Ensuring that data is saved reliably and can be retrieved later.

Without data persistence, your applications are essentially stateless, starting fresh every time they run.

---

### 9.2 Overview of Local Data Persistence Strategies (5 min)

When we talk about storing data locally on a user's computer, there are several common approaches, each with its own pros and cons:

1.  **Configuration Files (e.g., INI, TOML, YAML, JSON):**

    - **Concept:** Store simple settings or small amounts of structured data in plain text files.
    - **Pros:** Easy to read/edit manually, simple to implement for basic needs.
    - **Cons:** Not suitable for large amounts of data, complex queries, or concurrent access.

2.  **Plain Text Files / Custom Formats:**

    - **Concept:** Save raw data directly to files in a format you define.
    - **Pros:** Full control over format.
    - **Cons:** Requires manual parsing, error-prone, no built-in querying.

3.  **Embedded Databases (e.g., SQLite, RocksDB):**

    - **Concept:** A full-fledged database system that runs directly within your application process, storing data in a single file.
    - **Pros:** Robust, supports complex queries (SQL), handles large amounts of data, ensures data integrity, can manage concurrent access (within limits).
    - **Cons:** More complex setup than plain files, adds a dependency to your application.

4.  **Platform-Specific Storage:**

    - **Concept:** Using OS-provided mechanisms (e.g., Windows Registry, macOS `UserDefaults`).
    - **Pros:** Integrates well with the OS.
    - **Cons:** Not cross-platform, often limited in data types or size.

For this module, we'll focus on **Direct File System Interactions** for simpler needs and then dive into **Embedded Databases** (specifically SQLite) for more robust and structured data persistence, as it's a very common and powerful solution for desktop apps.

---

### 9.3 Direct File System Interactions (20 min)

Rust's standard library provides robust tools for interacting with the file system. You can read from and write to files directly. This is great for configuration files, log files, or small, unstructured data.

#### **Reading from a File:**

To read a file, you'll typically use `std::fs::File::open()` to get a `File` handle, then `std::io::Read` methods (like `read_to_string()`). Remember, file operations return `Result` because they can fail\!

```rust
use std::fs; // For file system operations
use std::io::{self, Read, Write}; // For I/O traits

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let file_path = "data/config.txt"; // Relative path to a file

    // Create a 'data' directory if it doesn't exist
    fs::create_dir_all("data")?;

    // Write some initial content to the file if it doesn't exist
    if !std::path::Path::new(file_path).exists() {
        let mut file = fs::File::create(file_path)?;
        file.write_all(b"app_version=1.0\nusername=default_user")?;
        println!("Created initial config file: {}", file_path);
    }

    println!("\n--- Reading from {} ---", file_path);
    let mut file = fs::File::open(file_path)?; // Open the file. Returns Result<File, Error>
    let mut contents = String::new();
    file.read_to_string(&mut contents)?; // Read contents into a String. Returns Result<usize, Error>

    println!("File contents:\n{}", contents);

    Ok(())
}
```

- **`std::fs`:** The module for file system operations.
- **`File::open()`:** Tries to open a file. Returns `Ok(File)` or `Err(io::Error)`.
- **`read_to_string()`:** Reads the entire file into a `String`.
- **`create_dir_all()`:** Creates a directory and any necessary parent directories.
- **`write_all()`:** Writes bytes to a file.

#### **Writing to a File:**

To write to a file, you'll use `std::fs::File::create()` (which creates a new file or truncates an existing one) or `std::fs::OpenOptions` for more control (e.g., appending). Then use `std::io::Write` methods.

```rust
use std::fs;
use std::io::{self, Write};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let file_path = "data/log.txt";

    println!("\n--- Writing to {} ---", file_path);

    // Create a file (or overwrite if it exists)
    let mut file = fs::File::create(file_path)?;
    file.write_all(b"Application started.\n")?;
    println!("Wrote 'Application started.'");

    // Open in append mode to add more content without overwriting
    let mut file = fs::OpenOptions::new()
        .append(true) // Open for appending
        .open(file_path)?; // Open the file

    file.write_all(b"User logged in.\n")?;
    println!("Appended 'User logged in.'");

    Ok(())
}
```

- **`File::create()`:** Creates a new file. If a file with the same name already exists, it will be truncated (emptied) or overwritten.
- **`OpenOptions::new().append(true).open()`:** This is how you open a file specifically to _append_ data to its end, without deleting existing content.

#### **Working with Paths:**

The `std::path` module helps you work with file paths in a cross-platform way.

```rust
use std::path::Path;

fn main() {
    let path = Path::new("data/config.txt");

    println!("Path exists: {}", path.exists());
    println!("File name: {:?}", path.file_name());
    println!("Parent directory: {:?}", path.parent());
    println!("Is absolute: {}", path.is_absolute());
}
```

**Considerations for File I/O in Slint Apps:**

- **Blocking:** `std::fs` operations are **synchronous (blocking)**. For simple config files on app startup/shutdown, this is usually fine. But for large files or frequent operations that might freeze your UI, you'd want to perform these in an `async` task using `tokio::fs` (which provides async versions of file operations).
- **Error Handling:** Always handle `Result` types for file operations.
- **Application Data Directories:** For real apps, you'd typically save user-specific data in OS-specific application data directories (e.g., `~/.config/my_app` on Linux, `~/Library/Application Support/my_app` on macOS, `%APPDATA%\my_app` on Windows). Crates like `dirs` can help find these paths.

---

### 9.4 Achieving Robust Local Data Persistence: Integrating an Embedded Database (60 min)

For structured data, large datasets, or when you need to perform queries, an **embedded database** is the way to go. **SQLite** is the most popular choice for desktop applications because it's a self-contained, serverless, zero-configuration, transactional SQL database engine. It stores the entire database in a single file on disk.

We'll use the `rusqlite` crate, which is the official SQLite binding for Rust.

#### **Setting Up `rusqlite`:**

1.  **Create a new Cargo project:** `cargo new slint_db_app`
2.  **Update `Cargo.toml`:** Add `slint`, `slint-build`, and `rusqlite`.

    ```toml
    # Cargo.toml
    [package]
    name = "slint_db_app"
    version = "0.1.0"
    edition = "2021"

    [dependencies]
    slint = "1.x"
    rusqlite = { version = "0.31", features = ["bundled"] } # "bundled" includes SQLite library, no system install needed

    [build-dependencies]
    slint-build = "1.x"
    ```

    - `features = ["bundled"]` for `rusqlite` is very convenient as it includes the SQLite C library with your app, so users don't need to have SQLite installed on their system.

#### **Core SQLite Operations with `rusqlite`:**

Let's create a simple Slint app that manages a list of "tasks" stored in an SQLite database.

**1. Database Connection and Table Creation:**

```rust
// src/main.rs (initial setup for DB)
use rusqlite::{Connection, Result}; // Import Connection and Result from rusqlite

fn setup_database() -> Result<Connection> {
    // Open a connection to a SQLite database file.
    // If the file doesn't exist, it will be created.
    let conn = Connection::open("tasks.db")?;

    // Create the 'tasks' table if it doesn't already exist.
    // This SQL statement defines the table schema.
    conn.execute(
        "CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            completed INTEGER NOT NULL DEFAULT 0
        )",
        [], // No parameters for this query
    )?;

    Ok(conn) // Return the database connection
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let conn = setup_database()?; // Call our setup function

    println!("Database 'tasks.db' opened and table 'tasks' ensured.");

    // You can now use 'conn' for further database operations.
    // For now, we'll just keep the app running briefly.
    // In a real Slint app, you'd pass this connection or a reference to it
    // to your UI logic.

    // A dummy loop to keep the console app alive for demonstration
    // In a Slint app, ui.run() would keep it alive.
    loop {
        std::thread::sleep(std::time::Duration::from_secs(1));
    }
    // conn will automatically close when it goes out of scope (program ends)
}
```

- **`Connection::open("tasks.db")`:** Connects to the database file.
- **`conn.execute()`:** Used for SQL commands that don't return rows (like `CREATE TABLE`, `INSERT`, `UPDATE`, `DELETE`). The `[]` is for query parameters.

**2. Inserting Data:**

```rust
// src/main.rs (add this function)
fn add_task(conn: &Connection, description: &str) -> Result<()> {
    conn.execute(
        "INSERT INTO tasks (description) VALUES (?1)", // ?1 is a placeholder for the first parameter
        [description], // Pass the description as a slice of references
    )?;
    println!("Task added: '{}'", description);
    Ok(())
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let conn = setup_database()?;

    add_task(&conn, "Learn Rust Ownership")?;
    add_task(&conn, "Build Slint App")?;
    add_task(&conn, "Integrate SQLite")?;

    // ... rest of main ...
}
```

- **`?1`:** A positional parameter placeholder. `rusqlite` also supports named parameters (`:name`).
- **`[description]`:** Parameters are passed as a slice.

**3. Querying (Reading) Data:**

To read data, you use `conn.prepare()` to create a `Statement`, then `query_map()` or `query_and_then()` to iterate over rows. You'll often map rows to Rust `struct`s.

```rust
// src/main.rs (add this struct and function)
#[derive(Debug, Clone)] // Add Clone for Slint model later
struct Task {
    id: i32,
    description: String,
    completed: bool,
}

fn get_all_tasks(conn: &Connection) -> Result<Vec<Task>> {
    let mut stmt = conn.prepare("SELECT id, description, completed FROM tasks")?;
    let task_iter = stmt.query_map([], |row| {
        // This closure is called for each row
        Ok(Task {
            id: row.get(0)?, // Get value from column 0
            description: row.get(1)?, // Get value from column 1
            completed: row.get(2)?, // Get value from column 2
        })
    })?;

    let tasks: Result<Vec<Task>> = task_iter.collect(); // Collect all results into a Vec
    tasks
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let conn = setup_database()?;
    add_task(&conn, "Learn Rust Ownership")?;
    add_task(&conn, "Build Slint App")?;
    add_task(&conn, "Integrate SQLite")?;

    println!("\n--- All Tasks ---");
    let tasks = get_all_tasks(&conn)?;
    for task in tasks {
        println!("{:?}", task);
    }

    // ... rest of main ...
}
```

- **`conn.prepare()`:** Creates a prepared statement, which is more efficient for repeated queries and prevents SQL injection.
- **`query_map()`:** Executes the query and maps each row to a Rust type using the provided closure.
- **`row.get(index)?`:** Retrieves a value from a column by its zero-based index.

**4. Updating Data:**

```rust
// src/main.rs (add this function)
fn mark_task_completed(conn: &Connection, task_id: i32) -> Result<()> {
    conn.execute(
        "UPDATE tasks SET completed = ?1 WHERE id = ?2",
        [1, task_id], // 1 for true, task_id for the WHERE clause
    )?;
    println!("Task {} marked as completed.", task_id);
    Ok(())
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let conn = setup_database()?;
    add_task(&conn, "Learn Rust Ownership")?;
    add_task(&conn, "Build Slint App")?;

    mark_task_completed(&conn, 1)?; // Mark the first task as completed

    println!("\n--- Tasks after update ---");
    let tasks = get_all_tasks(&conn)?;
    for task in tasks {
        println!("{:?}", task);
    }

    // ... rest of main ...
}
```

**5. Deleting Data:**

```rust
// src/main.rs (add this function)
fn delete_task(conn: &Connection, task_id: i32) -> Result<()> {
    conn.execute(
        "DELETE FROM tasks WHERE id = ?1",
        [task_id],
    )?;
    println!("Task {} deleted.", task_id);
    Ok(())
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let conn = setup_database()?;
    add_task(&conn, "Learn Rust Ownership")?;
    add_task(&conn, "Build Slint App")?;

    delete_task(&conn, 2)?; // Delete the task with ID 2

    println!("\n--- Tasks after deletion ---");
    let tasks = get_all_tasks(&conn)?;
    for task in tasks {
        println!("{:?}", task);
    }

    // ... rest of main ...
}
```

#### **Integrating with Slint (Conceptual):**

In a Slint application, you would:

1.  **Initialize the database connection** (`setup_database()`) once, typically at the start of `main()`.
2.  **Pass the `Connection` (or a shared reference to it, e.g., `Rc<RefCell<Connection>>` for mutable access across threads/closures, or `Arc<Mutex<Connection>>` for multi-threaded async access) to your Slint UI's callbacks.**
3.  **In your Slint UI (`ui.slint`):**
    - Define a `ListView` to display tasks.
    - Define `in-out property <[TaskListItem]> tasks_model;`
    - Add buttons for "Add Task," "Mark Completed," "Delete Task."
    - Define callbacks (e.g., `callback add_task(string description);`).
4.  **In your Rust `main.rs`:**
    - Implement the callbacks (`on_add_task`, `on_mark_completed`, `on_delete_task`).
    - Inside these callbacks, call your `rusqlite` functions (`add_task`, `mark_task_completed`, `delete_task`).
    - **Crucially:** After any database modification, you'll need to **re-fetch the tasks** (`get_all_tasks()`) and **update the `tasks_model` property** in your Slint UI to reflect the changes.
    - **Async Considerations:** Database operations can be blocking. For a responsive UI, you would typically run these `rusqlite` calls inside a `tokio::task::spawn_blocking` block if your main application is `async`, or manage them in a separate thread.

**Example `slint::VecModel` for `Task` struct:**

```rust
// Add this to your ui.slint
component TaskListItem {
    in property <string> description;
    in property <bool> completed;
    in property <int> id; // Keep ID for updates/deletes
    // Add callbacks for mark/delete buttons if you put them on each item
}

export component MainWindow inherits Window {
    // ...
    in property <[TaskListItem]> tasks_model: [];
    // ...
    ListView {
        model: tasks_model;
        delegate: TaskListItem {
            description: root.description;
            completed: root.completed;
            id: root.id;
            // ...
        }
    }
}
```

---

**End of Lesson 9.** You've now gained essential skills for data persistence in desktop applications\! You can interact directly with the file system for simple data and, more importantly, integrate a robust embedded database like SQLite to manage structured data efficiently. This is a massive step towards building powerful, stateful applications. Next, we'll cover best practices and deployment\!
