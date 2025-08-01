---
title: Building Static User Interfaces
sidebar_position: 4
---

---

# Lesson 4: Introduction to Slint - Building Static User Interfaces

Welcome to the exciting part where we start building actual graphical user interfaces\! You've now got a solid foundation in Rust. In this module, we'll introduce **Slint**, our chosen UI framework, and get your very first desktop application up and running. We'll focus on creating static UIs – meaning, they look good but don't do much yet\!

---

### 4.1 Introducing Slint: A Declarative UI Framework (5 min)

So, what exactly is Slint? 🤔

Slint is a **declarative UI toolkit** that helps you build native desktop applications. Think of it as a way to describe _what_ your user interface should look like, rather than telling the computer _how_ to draw every single pixel.

- **Declarative:** Instead of step-by-step instructions (e.g., "create a button, set its text, position it at X,Y"), you simply declare the desired state of your UI (e.g., "there's a button with this text, inside this box"). Slint handles the "how" for you. This is similar to how React works on the web\!
- **Cross-Platform:** Slint apps can run on Windows, macOS, Linux, and even embedded systems, all from the same codebase.
- **Native Performance:** Unlike web-based desktop frameworks (like Electron, which uses a web browser to render UI), Slint compiles your UI design directly to highly optimized machine code. This results in incredibly fast and responsive applications that feel truly native.
- **Language Agnostic (but we're using Rust\!):** While Slint has APIs for Rust, C++, and JavaScript, we'll be focusing on its excellent Rust integration, leveraging all the safety and performance benefits you've just learned.

---

### 4.2 Synergies: Why Slint is an Ideal Partner for Rust (5 min)

Rust and Slint are a fantastic combination for desktop app development, creating a powerful synergy:

1.  **Performance Meets UI:** Rust's blazing-fast execution speed ensures your UI is always smooth and responsive, even with complex operations. Slint's native rendering complements this perfectly.
2.  **Safety from Backend to Frontend:** Rust's memory safety and concurrency guarantees extend to your UI logic. You can build complex, multi-threaded applications with confidence, knowing that common bugs like data races are prevented at compile time.
3.  **Declarative Simplicity:** Slint's declarative `.slint` language makes UI design intuitive and easy to read, while Rust handles the robust backend logic. This separation of concerns helps keep your codebase clean.
4.  **Modern Development Experience:** With Cargo for Rust and Slint's live-preview tools (which we'll see later), the development workflow is efficient and enjoyable.

---

### 4.3 Setting Up Your First Slint Application (20 min)

Let's get a basic Slint project initialized and running\! 🚀

1.  **Create a New Cargo Project:**

    - Open your terminal and navigate to your development directory.
    - Create a new Rust project, just like before:
      ```bash
      cargo new my_slint_app
      ```
    - Navigate into the new project folder:
      ```bash
      cd my_slint_app
      ```

2.  **Add Slint as a Dependency:**

    - Open your `Cargo.toml` file in VS Code.
    - Under the `[dependencies]` section, add the `slint` crate. You'll also need `slint-build` as a build dependency, which is used by Cargo to compile your `.slint` files.
    - Your `Cargo.toml` should look something like this (versions might differ slightly, use the latest stable `1.x`):

      ```toml
      # Cargo.toml
      [package]
      name = "my_slint_app"
      version = "0.1.0"
      edition = "2021"

      [dependencies]
      slint = "1.x" # Use the latest stable version, e.g., "1.4"

      [build-dependencies]
      slint-build = "1.x" # Use the same version as slint
      ```

    - **Save `Cargo.toml`\!**

3.  **Create Your `.slint` UI File:**

    - In the root of your `my_slint_app` folder (the same level as `src` and `Cargo.toml`), create a new file named `ui.slint`.
    - This file will contain the declarative description of your UI.

4.  **Write Basic `.slint` UI Code:**

    - Open `ui.slint` and add this simple code:

      ```slint
      // ui.slint
      export component MainWindow inherits Window {
          // This defines our main window. 'export' makes it visible to Rust.
          // 'inherits Window' means it's a top-level window.
          width: 300px; // Set the initial width of the window
          height: 200px; // Set the initial height of the window

          // Add a simple Text element inside the window
          Text {
              text: "Hello, Slint!"; // The text content
              color: #2196F3; // A nice blue color
              font-size: 24px; // Font size
              horizontal-alignment: center; // Center horizontally
              vertical-alignment: center;   // Center vertically
          }
      }
      ```

    - **Save `ui.slint`\!**

5.  **Update `src/main.rs`:**

    - Open `src/main.rs` and replace its content with the following. This Rust code will load and run your Slint UI.

      ```rust
      // src/main.rs

      // This macro tells Slint to compile the 'ui.slint' file
      // and generate Rust code for the UI components defined within it.
      slint::include_modules!();

      fn main() {
          // Create an instance of our MainWindow component defined in ui.slint.
          // Slint generates a struct named 'MainWindow' for us.
          let main_window = MainWindow::new().unwrap();

          // Run the application's event loop. This displays the window
          // and keeps the application running until the window is closed.
          main_window.run().unwrap();
      }
      ```

    - **Save `src/main.rs`\!**

6.  **Run Your Slint Application:**

    - In your terminal (still in the `my_slint_app` folder), run:
      ```bash
      cargo run
      ```
    - You should see a new desktop window pop up with "Hello, Slint\!" displayed in blue\!

Congratulations\! You've just built and run your first graphical desktop application using Rust and Slint\! 🎉

---

### 4.4 Understanding the `.slint` Language and Basic UI Syntax (15 min)

The `.slint` file is where you define your UI's structure and appearance. It's a **declarative language** specifically designed for describing user interfaces, making it easy to read and understand at a glance.

- **Declarative Nature:** You state _what_ you want to see, not _how_ to draw it.
- **Components:** The basic building blocks are `component`s. Every UI element you define (like `MainWindow` in our example) is a component.
  - `export component MyComponent inherits BaseComponent { ... }`
    - `export`: Makes the component visible to your Rust code.
    - `inherits Window`: Means it's a top-level window. Other components might inherit `Rectangle` or `VerticalBox`.
- **Elements:** Inside components, you place UI elements. These can be built-in elements (like `Text`, `Rectangle`, `Button`) or other custom components you define.
  - `ElementName { property: value; another-property: another-value; }`
- **Properties:** Elements and components have properties that control their appearance and behavior.
  - `width: 300px;`
  - `color: #FF0000;`
  - `text: "Some text";`
  - Units like `px` (pixels) are common.
- **Nesting:** You nest elements inside curly braces `{}` to create parent-child relationships, forming the UI hierarchy. The child element is drawn _inside_ its parent.

**Example Snippet from `ui.slint`:**

```slint
// Defining a reusable component called MyButton
export component MyButton inherits Rectangle {
    // An 'in' property means data comes into this component from its parent
    in property <string> button_text;

    // Child elements that make up the button's visual
    Rectangle { // A background rectangle for the button
        background: blue;
        border-radius: 5px;
    }
    Text { // The text displayed on the button
        text: button_text; // This text is bound to the 'button_text' property
        color: white;
        horizontal-alignment: center;
        vertical-alignment: center;
    }
}
```

---

### 4.5 Core Slint UI Elements (20 min)

Slint provides a set of standard UI elements (often called "widgets") that you'll use to build your interfaces. These are typically imported from `std-widgets.slint`.

To use them, you usually add an `import` statement at the top of your `.slint` file:
`import { Button, LineEdit, VerticalBox } from "std-widgets.slint";`

Here are some of the most common ones:

- **`Window`**: The top-level container for your application. Every Slint application has at least one.
- **`Rectangle`**: A basic rectangular shape. Very versatile for backgrounds, borders, or as a base for custom components.
  - **Properties:** `width`, `height`, `background`, `border-radius`, `border-width`, `border-color`, `x`, `y` (for positioning).
- **`Text`**: Displays static or dynamic text.
  - **Properties:** `text`, `color`, `font-size`, `font-weight`, `horizontal-alignment`, `vertical-alignment`.
- **`Button`**: A clickable button.
  - **Properties:** `text`, `enabled` (boolean).
  - **Callbacks (events):** `clicked => { ... }` (we'll cover events in the next lesson).
- **`LineEdit`**: A single-line text input field.
  - **Properties:** `text`, `placeholder-text`, `read-only`.
- **`Image`**: Displays an image.
  - **Properties:** `source` (path to image file), `width`, `height`, `fill`.
- **`CheckBox`**: A toggleable checkbox.
  - **Properties:** `checked` (boolean), `text`.
- **`ComboBox`**: A dropdown selection list.
  - **Properties:** `model` (for list items), `current-value`.

**Example:** Let's create a simple login form using some of these elements, for now, we'll use basic `x` and `y` coordinates for positioning.

```slint
// ui.slint (add these imports if not already there)
import { Button, LineEdit, CheckBox, Text, Rectangle } from "std-widgets.slint";

export component MyStaticElements inherits Window {
    width: 400px; height: 300px;
    title: "Static Elements Demo";

    // A background rectangle for the window
    Rectangle {
        width: 100%; height: 100%;
        background: #ECEFF1; // Light grey background
    }

    Text {
        text: "User Login";
        font-size: 28px;
        font-weight: 600;
        color: #37474F;
        x: 20px; y: 20px; // Absolute positioning
    }

    LineEdit {
        placeholder-text: "Username";
        width: 200px; height: 30px;
        x: 20px; y: 70px;
    }

    LineEdit {
        placeholder-text: "Password";
        width: 200px; height: 30px;
        x: 20px; y: 110px;
        // input-type: password; // For password masking (more advanced)
    }

    CheckBox {
        text: "Remember me";
        x: 20px; y: 150px;
        checked: true; // Static for now
    }

    Button {
        text: "Login";
        x: 20px; y: 190px;
        width: 100px; height: 35px;
        background: #4CAF50; // Green button
        color: white;
    }
}
```

- **Note on Positioning:** For now, we're using `x` and `y` for absolute positioning. This is generally not ideal for responsive UIs. We'll fix this with layout managers next\!

---

### 4.6 Structuring Your UI: Essential Layout Managers (15 min)

Absolute positioning with `x` and `y` is rigid and doesn't adapt well to different screen sizes or content changes. Slint provides **layout managers** to arrange elements dynamically and responsively, making your UIs much more flexible.

- **`HorizontalBox`**: Arranges children side-by-side in a horizontal row.
  - **Properties:** `spacing` (space between children), `alignment` (vertical alignment of children within the box).
- **`VerticalBox`**: Arranges children one below another in a vertical column.
  - **Properties:** `spacing` (space between children), `alignment` (horizontal alignment of children within the box).
- **`GridBox`**: Arranges children in a grid (rows and columns), giving you precise control over placement.
  - **Properties:** `columns`, `rows`, `column-spacing`, `row-spacing`.
  - **Children properties:** `row`, `column`, `row-span`, `column-span`.

**Example: Rebuilding the Login Form with Layouts**

Let's refactor our previous login form to use a `VerticalBox` for a much cleaner and more adaptable layout.

```slint
// ui.slint (add these imports if not already there)
import { Button, LineEdit, CheckBox, Text, Rectangle, VerticalBox } from "std-widgets.slint";

export component MyLayoutsDemo inherits Window {
    width: 400px; height: 300px;
    title: "Layouts Demo";

    // Use a VerticalBox as the main container for vertical stacking
    VerticalBox {
        spacing: 15px; // Space between items in the box
        alignment: center; // Center children horizontally within the box
        padding: 20px; // Padding inside the box

        // Background for the entire window
        Rectangle {
            width: 100%; height: 100%; // Fill the parent VerticalBox
            background: #ECEFF1; // Light grey background
            // This rectangle is here just to show the background, it will be behind the content
            // You might remove it if the Window itself has a background property.
        }

        Text {
            text: "User Login";
            font-size: 28px;
            font-weight: 600;
            color: #37474F;
            horizontal-alignment: center; // Center text within its own space
        }

        LineEdit {
            placeholder-text: "Username";
            width: 250px; // Give it a fixed width for now
        }

        LineEdit {
            placeholder-text: "Password";
            width: 250px;
        }

        CheckBox {
            text: "Remember me";
            // Checkboxes align to the start by default in VerticalBox,
            // but 'alignment: center' on the parent VerticalBox will center it.
        }

        Button {
            text: "Login";
            width: 150px; // Give the button a fixed width
            height: 35px;
            background: #4CAF50;
            color: white;
        }
    }
}
```

- **Observation:** Notice how much cleaner the layout code is. You don't specify `x` or `y` anymore. The `VerticalBox` automatically positions the elements, making your UI much more maintainable and adaptable.

---

### 4.7 Developing Your First Static Desktop Application (10 min)

For this final part of the lesson, your task is to combine everything you've learned about Slint to create a simple, static desktop application. This will be your first complete Slint UI\!

**Exercise: Create a simple "About Us" window for an imaginary application.**

- **Requirements:**
  - A `Window` with a clear title (e.g., "About My Awesome App").
  - Use a **layout manager** (e.g., `VerticalBox`) for overall arrangement.
  - Include at least two `Text` elements: one for a main heading and another for a descriptive paragraph.
  - Add an `Image` element (you can use a placeholder image, but for simplicity, just define the `Image` element with a `width` and `height` and a dummy `source` path like `"assets/logo.png"`).
  - Include a `Button` (it won't do anything yet, but it should be visible).
  - Apply some basic styling (colors, font sizes, padding) to make it look visually appealing.

**Steps:**

1.  Open your `my_slint_app` project (or create a new one: `cargo new about_app`).
2.  Modify your `ui.slint` file to define your `AboutWindow` component.
3.  Modify `src/main.rs` to load and run your new `AboutWindow` component (if you created a new project).
4.  Run `cargo run` in your terminal to see your beautiful static application\!

**Example `ui.slint` structure (Don't copy-paste\! Build it yourself using the concepts\!):**

```slint
// ui.slint (for About Us app)
import { Button, Text, Image, VerticalBox } from "std-widgets.slint";

export component AboutWindow inherits Window {
    width: 500px;
    height: 400px;
    title: "About My Awesome App";

    VerticalBox {
        spacing: 10px;
        alignment: center; // Center content horizontally
        padding: 20px;

        Text {
            text: "My Awesome App";
            font-size: 36px;
            font-weight: 700;
            color: #3F51B5; // Indigo color
            horizontal-alignment: center;
        }

        Image {
            source: "assets/app_logo.png"; // Placeholder for an image file
            width: 100px;
            height: 100px;
        }

        Text {
            text: "Version 1.0.0\n\nDeveloped by Your Name/Team\n\nThis application is designed to help you organize your daily tasks and boost your productivity. We believe in simple, efficient, and beautiful software.";
            font-size: 16px;
            color: #424242;
            horizontal-alignment: center;
            wrap: word-wrap; // Allow text to wrap within its bounds
        }

        Button {
            text: "Close";
            width: 120px;
            height: 40px;
            background: #F44336; // Red button
            color: white;
        }
    }
}
```

(Remember to create an `assets` folder in your project root and put a placeholder image there, or just comment out the `Image` element if you don't have one ready.)

---

**End of Module 4.** You've successfully entered the world of GUI development with Slint\! You can now set up a project, define UI elements, arrange them with layouts, and create static desktop applications. Next, we'll make them interactive\!
