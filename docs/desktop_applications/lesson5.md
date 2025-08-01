---
title: State, Events, and Dynamic UIs
sidebar_position: 5
---

---

# Lesson 5: Slint Interactivity - State, Events, and Dynamic UIs

Welcome to the heart of UI development\! Static applications are cool, but truly useful apps need to react to user input and display changing information. In this module, we'll make our Slint applications come alive by diving into **state management**, **data binding**, and **event handling**.

---

### 5.1 State Management and Data Binding (30 min)

In UI development, "state" refers to any data that can change over time and affect what the user sees. "Data binding" is the magic that connects your UI elements directly to this state, so when the state changes, the UI automatically updates.

Slint's approach to reactivity is very powerful: when a property's value changes, any UI element or other property that depends on it automatically updates. You don't have to manually tell the UI to redraw\!

#### **Defining Properties in `.slint`:**

You declare properties within your components using the `property` keyword. These properties are where you store your component's state.

- **`in property <type> name;`**: An "in" property means data flows _into_ this component from its parent. It's usually read-only within the component.
- **`out property <type> name;`**: An "out" property means data flows _out_ of this component to its parent. It's usually set by the component and read by the parent.
- **`in-out property <type> name;`**: An "in-out" property means data can flow both ways. It can be set by the parent and modified by the component itself. This is great for two-way binding.

**Example: A Simple Counter**

Let's create a counter that displays a number.

```slint
// ui.slint
export component CounterApp inherits Window {
    width: 200px;
    height: 150px;
    title: "Simple Counter";

    // 1. Define an 'in-out' property for our counter's value
    in-out property <int> counter: 0; // Initial value is 0

    VerticalBox {
        alignment: center;
        spacing: 10px;

        Text {
            // 2. Bind the text property directly to our 'counter' property
            // When 'counter' changes, this text will automatically update!
            text: "Count: " + counter;
            font-size: 30px;
            color: #4CAF50;
        }

        Button {
            text: "Increase";
            width: 100px;
            height: 40px;
            background: #2196F3;
            color: white;
            // We'll add the 'clicked' event logic in the next section!
        }
    }
}
```

#### **Binding UI to Data:**

You saw this in the counter example: `text: "Count: " + counter;`. This is a **binding expression**. Any time the `counter` property changes, Slint automatically re-evaluates this expression and updates the `Text` element. It's reactive\!

#### **Updating Data from Rust (and Bidirectional Binding):**

To make the counter actually _do_ something, we need our Rust code to modify the `counter` property.

1.  **Accessing Properties:** Slint generates methods on your component's Rust struct to get and set properties. For an `in-out` property named `my_property`, you'll typically have `get_my_property()` and `set_my_property(value)`.
2.  **Bidirectional Binding (`<=>`):** For input elements like `LineEdit`, you often want the UI to update the data, and the data to update the UI. Slint's `property <=> other_property;` syntax handles this.

**Example: Connecting Rust to the Counter**

Let's modify `src/main.rs` to control the counter.

```rust
// src/main.rs
slint::include_modules!();

fn main() {
    let app = CounterApp::new().unwrap();

    // Get a handle to the UI. This is a clone of the UI handle
    // which allows us to move it into closures (like event handlers)
    // without violating Rust's ownership rules.
    let ui_handle = app.as_weak();

    // Set an initial value for the counter from Rust
    app.set_counter(0);

    // We'll add the button's event handler here in the next section!
    // For now, imagine a timer or another event causing this:
    // app.set_counter(app.get_counter() + 1); // This would update the UI

    app.run().unwrap();
}
```

---

### 5.2 Handling User Interactions: Events and Callbacks (30 min)

Our UI needs to respond when the user clicks a button, types in a text box, or performs other actions. Slint uses **callbacks** for this.

#### **Defining Callbacks in `.slint`:**

You define callbacks within your components using the `callback` keyword. These declare that a component _can_ trigger a specific action.

- `callback my_action();` (no arguments)
- `callback value_changed(int new_value);` (with arguments)

#### **Implementing Callback Logic in Rust:**

In your Rust code, you connect a Rust function (a closure) to a Slint callback using the `on_callback_name()` method.

**Example: Making the Counter Button Work**

Let's make our "Increase" button actually increase the counter.

```slint
// ui.slint (updated for button click)
export component CounterApp inherits Window {
    width: 200px;
    height: 150px;
    title: "Simple Counter";

    in-out property <int> counter: 0;

    // Define a callback that the UI can trigger
    callback request_increase(); // This callback will be called when the button is clicked

    VerticalBox {
        alignment: center;
        spacing: 10px;

        Text {
            text: "Count: " + counter;
            font-size: 30px;
            color: #4CAF50;
        }

        Button {
            text: "Increase";
            width: 100px;
            height: 40px;
            background: #2196F3;
            color: white;
            // When this button is clicked, trigger our 'request_increase' callback
            clicked => { root.request_increase(); }
        }
    }
}
```

Now, update `src/main.rs` to handle the `request_increase` callback:

```rust
// src/main.rs
slint::include_modules!();

fn main() {
    let app = CounterApp::new().unwrap();

    // Get a weak handle to the UI. This is crucial for event handlers
    // to avoid creating reference cycles (which can cause memory leaks)
    // and to allow the UI to be dropped when the app closes.
    let ui_handle = app.as_weak();

    app.set_counter(0); // Set initial counter value

    // Connect our Rust logic to the Slint callback
    app.on_request_increase(move || { // 'move' captures variables by value into the closure
        // We need to unwrap the weak handle to get a strong handle back.
        // If the UI has been dropped (e.g., window closed), ui_handle.upgrade() will return None.
        if let Some(ui) = ui_handle.upgrade() {
            // Get the current counter value, increment it, and set it back.
            ui.set_counter(ui.get_counter() + 1);
        }
    });

    app.run().unwrap();
}
```

#### **Error Handling in Callbacks:**

In real applications, your callback logic might involve operations that can fail (like file I/O or network requests). You should handle these `Result` types gracefully.

- You can use `match` or `if let Ok`/`if let Err` within your callback closures.
- For simplicity in basic examples, you might use `.unwrap()` or `.expect()`, but remember their limitations (they panic on `Err`).

**Example (Conceptual):**

```rust
// Inside an app.on_some_action(move || { ... }) callback
if let Some(ui) = ui_handle.upgrade() {
    let result = some_function_that_might_fail(); // Returns a Result<T, E>
    match result {
        Ok(data) => {
            ui.set_some_property(data);
        },
        Err(e) => {
            // Display an error message in the UI or log it
            eprintln!("An error occurred: {:?}", e);
            ui.set_status_message(format!("Error: {}", e).into());
        }
    }
}
```

---

### 5.3 Practical Application: Developing an Interactive Calculator Application (30 min)

Now, let's combine everything you've learned to build a fully interactive, basic calculator application\! This will be a great way to solidify your understanding of properties, data binding, and events.

**Calculator Features:**

1.  **Display:** Shows the current input/result.
2.  **Number Buttons:** 0-9.
3.  **Operation Buttons:** +, -, \*, /, = (equals).
4.  **Clear Button:** C.

**Steps to Build:**

1.  **Create a new Cargo project:** `cargo new slint_calculator`

2.  **Add Slint dependency:** Update `Cargo.toml` with `slint = "1.x"` and `slint-build = "1.x"` as before.

3.  **Design the UI in `ui.slint`:**

    - Use a `VerticalBox` as the main container.
    - Use a `LineEdit` for the display (read-only).
    - Use `GridBox` for the calculator buttons (numbers and operations).
    - Place buttons for 0-9, +, -, \*, /, =, C.
    - Give your `LineEdit` a property (e.g., `in-out property <string> display_text;`) and bind its `text` property to it.
    - For each button, define a `callback` (e.g., `callback digit_pressed(string digit);`, `callback operation_pressed(string op);`, `callback clear_pressed();`, `callback equals_pressed();`).
    - Inside each button's `clicked => { ... }` handler, call the appropriate `root.callback_name(...)`.

4.  **Implement the Logic in `src/main.rs`:**

    - Load your `ui.slint` using `slint::include_modules!()`.
    - Create an instance of your main calculator component.
    - Maintain internal state in Rust (e.g., `current_number: String`, `first_operand: f64`, `operator: Option<char>`).
    - Implement the `on_digit_pressed`, `on_operation_pressed`, `on_clear_pressed`, `on_equals_pressed` callbacks.
    - In these callbacks, update the internal state and then update the Slint UI's `display_text` property using `ui.set_display_text(...)`.
    - **Hint:** For `parse()` operations on numbers, remember to handle the `Result` type (e.g., with `match` or `.unwrap_or_default()` for simplicity in a calculator).

**Example `ui.slint` structure for the calculator (build it, don't just copy\!):**

```slint
// ui.slint (for Calculator)
import { Button, LineEdit, VerticalBox, GridBox } from "std-widgets.slint";

export component CalculatorApp inherits Window {
    width: 300px;
    height: 400px;
    title: "Rust Slint Calculator";

    in-out property <string> display_text: "0"; // The text shown on the calculator screen

    // Callbacks for different button types
    callback digit_pressed(string digit);
    callback operation_pressed(string op);
    callback clear_pressed();
    callback equals_pressed();

    VerticalBox {
        alignment: center;
        spacing: 5px;
        padding: 10px;

        LineEdit {
            read-only: true; // Users can't type directly
            text: display_text; // Bind to our display property
            font-size: 36px;
            horizontal-alignment: right;
            height: 60px;
            background: #CFD8DC; // Light grey for display
            border-radius: 5px;
            padding-right: 10px;
        }

        // Grid for calculator buttons
        GridBox {
            columns: 4;
            rows: 4;
            spacing: 5px;

            // Row 1
            Button { text: "7"; clicked => { root.digit_pressed("7"); } }
            Button { text: "8"; clicked => { root.digit_pressed("8"); } }
            Button { text: "9"; clicked => { root.digit_pressed("9"); } }
            Button { text: "/"; clicked => { root.operation_pressed("/"); } background: #FF9800; color: white; } // Orange for operations

            // Row 2
            Button { text: "4"; clicked => { root.digit_pressed("4"); } }
            Button { text: "5"; clicked => { root.digit_pressed("5"); } }
            Button { text: "6"; clicked => { root.digit_pressed("6"); } }
            Button { text: "*"; clicked => { root.operation_pressed("*"); } background: #FF9800; color: white; }

            // Row 3
            Button { text: "1"; clicked => { root.digit_pressed("1"); } }
            Button { text: "2"; clicked => { root.digit_pressed("2"); } }
            Button { text: "3"; clicked => { root.digit_pressed("3"); } }
            Button { text: "-"; clicked => { root.operation_pressed("-"); } background: #FF9800; color: white; }

            // Row 4
            Button { text: "C"; clicked => { root.clear_pressed(); } background: #F44336; color: white; } // Red for clear
            Button { text: "0"; clicked => { root.digit_pressed("0"); } }
            Button { text: "="; clicked => { root.equals_pressed(); } background: #4CAF50; color: white; } // Green for equals
            Button { text: "+"; clicked => { root.operation_pressed("+"); } background: #FF9800; color: white; }
        }
    }
}
```

This project will challenge you to think about UI state, how to update it from Rust, and how to trigger Rust code from UI events. Good luck\!

---

**End of Module 5.** You've now unlocked the power of interactive UIs with Slint\! You can manage state, bind data, and handle user events, culminating in a functional calculator application. Next up, we'll make your apps communicate with the outside world using HTTP APIs\!
