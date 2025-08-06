---
title: Reusability & Customization
sidebar_position: 8
---

---

# Lesson 8: Advanced Slint Features - Reusability & Customization

Welcome back\! So far, you've built interactive UIs and even connected them to external APIs. That's awesome\! But as your applications grow, you'll want to keep your UI code clean, organized, and easy to manage. That's where **UI components** and **custom styling** come in. In this module, we'll learn how to build reusable UI blocks and make them look exactly how you want. ✨

---

### 8.1 Understanding the Power of UI Components (5 min)

Think of UI components like LEGO bricks. Instead of building everything from scratch every time, you create smaller, self-contained, and specialized pieces that you can then snap together to build larger, more complex structures.

- A **UI Component** is a self-contained, independent, and reusable block of UI. It encapsulates its own layout, appearance, and sometimes its own internal behavior.
- Examples: A button, a text input field, a navigation bar, a user profile card, or even a complex chart can all be components.
- In Slint, everything is essentially a component, from the top-level `Window` to a simple `Text` element. When you define your own, you're just creating custom versions of these building blocks.

---

### 8.2 Benefits of Component Reusability in UI Development (5 min)

Why bother breaking your UI into components? It's a game-changer for development efficiency and quality\!

1.  **Consistency:** Using the same component across your app ensures a consistent look and feel. No more slightly different buttons on different screens\!
2.  **Maintainability:** If you need to change how a button looks or behaves, you only change it in one place (the component's definition), and all instances of that button update automatically. This saves a ton of time and reduces bugs.
3.  **Faster Development:** Once a component is built, you can reuse it anywhere. This speeds up the development process significantly, as you're not constantly rewriting the same UI patterns.
4.  **Easier Debugging:** If there's a bug in a specific UI element, you know exactly where to look – within that component's code.
5.  **Collaboration:** Teams can work on different components simultaneously, speeding up overall project delivery.

---

### 8.3 Crafting Your First Reusable Slint Component (20 min)

Let's create a custom button component that we can reuse throughout our application. It will have a custom background color and text color.

1.  **Open your `slint_countries_app` project (or create a new one).**
2.  **Open `ui.slint`.**

Now, define a new `component` named `CustomButton`. This component will `inherit` from `Rectangle` (to give it a background and dimensions) and will have properties for its text and colors.

```slint
// ui.slint (add this new component definition, perhaps above MainWindow)
import { Text, Rectangle, TouchArea } from "std-widgets.slint"; // Ensure TouchArea is imported

export component CustomButton inherits Rectangle {
    // Input properties for our custom button
    in property <string> text_content;
    in property <brush> button_background_color: #424242; // Default dark grey
    in property <brush> text_color: white; // Default white text

    // Output callback for when the button is clicked
    callback clicked();

    // The visual elements that make up our button
    Rectangle {
        // This rectangle forms the main background of the button
        width: 100%; // Fill the parent CustomButton's width
        height: 100%; // Fill the parent CustomButton's height
        background: button_background_color; // Use the input property for background
        border-radius: 8px; // Rounded corners
    }

    Text {
        // This text element displays the button's label
        text: text_content; // Use the input property for text
        color: text_color; // Use the input property for text color
        font-size: 18px;
        horizontal-alignment: center;
        vertical-alignment: center;
    }

    // A TouchArea makes the entire component clickable
    TouchArea {
        width: 100%;
        height: 100%;
        clicked => {
            root.clicked(); // When this TouchArea is clicked, emit our CustomButton's 'clicked' callback
        }
    }
}

// --- Now, use this CustomButton in your MainWindow (or a new test component) ---
// Example usage in MainWindow (replace an existing button or add a new one)
export component MainWindow inherits Window {
    // ... (existing properties and layout) ...

    VerticalBox {
        // ... (existing elements) ...

        // Using our new CustomButton!
        CustomButton {
            text_content: "Click Me!";
            button_background_color: #FF5722; // Orange
            text_color: white;
            width: 150px;
            height: 50px;
            clicked => {
                // This will be handled in Rust, just like other callbacks
                debug("Custom button clicked!");
            }
        }

        CustomButton {
            text_content: "Another Button";
            button_background_color: #607D8B; // Blue Grey
            text_color: white;
            width: 180px;
            height: 50px;
            clicked => {
                debug("Another custom button clicked!");
            }
        }

        // ... (rest of your MainWindow) ...
    }
}
```

**Explanation:**

- `export component CustomButton inherits Rectangle`: We define a new reusable component. It `inherits Rectangle` because we want it to behave like a rectangle (have `width`, `height`, `background`, etc.) and be a visual container.
- `in property <string> text_content;`: This declares an "input" property. When you use `CustomButton`, you'll set `text_content` like `CustomButton { text_content: "My Label"; }`.
- `button_background_color: #424242;`: We set default values for properties.
- `text: text_content;`: This is **data binding**\! The `Text` element's `text` property is bound to our component's `text_content` property.
- `callback clicked();`: This declares an "output" callback. The `TouchArea` inside the button will trigger `root.clicked();` which then triggers this component's `clicked` callback. You'll handle this in Rust using `my_button.on_clicked(|| { ... });`.

**Run `cargo run`** to see your custom buttons\!

---

### 8.4 Customizing UI Aesthetics: Creating Bespoke Styles (20 min)

Slint gives you powerful ways to control the look and feel of your UI. You can apply styles directly to elements, or define reusable styles and color palettes.

#### **Direct Styling:**

You've already done this\! Setting properties like `background: blue;` or `font-size: 24px;` directly on an element is the simplest form of styling.

#### **Using `brushes` for Reusable Colors/Gradients:**

Instead of hardcoding color values everywhere, you can define named `brushes` (which can be solid colors, gradients, or images) and reuse them.

```slint
// ui.slint (add this at the top, perhaps after imports)

// Define some reusable colors/brushes
global MyPalette {
    // Solid colors
    brush primary_color: #1976D2; // Deep Blue
    brush accent_color: #FFC107; // Amber
    brush text_dark: #212121; // Dark Grey
    brush text_light: white;

    // A simple linear gradient
    brush gradient_bg: linear-gradient(0deg, #42A5F5, #1976D2); // Light blue to deep blue
}

export component MainWindow inherits Window {
    // ...
    VerticalBox {
        background: MyPalette.gradient_bg; // Use the defined gradient brush
        // ...
        Text {
            text: "Welcome!";
            color: MyPalette.text_light; // Use the defined text color
            font-size: 30px;
        }

        CustomButton {
            text_content: "Styled Button";
            button_background_color: MyPalette.accent_color; // Use defined accent color
            text_color: MyPalette.text_dark;
            width: 200px; height: 50px;
            clicked => { debug("Styled button clicked!"); }
        }
    }
}
```

- `global MyPalette { ... }`: Defines a global scope where you can put reusable definitions.
- `brush primary_color: #1976D2;`: Declares a named brush.
- `background: MyPalette.gradient_bg;`: Accesses the brush using its global name.

#### **Widget Styles and Platform Adaptation:**

Slint widgets (`Button`, `LineEdit` etc.) automatically adapt to the native look and feel of the operating system (e.g., Fluent on Windows, Cupertino on macOS). You can also explicitly choose a style or override parts of it.

- **Default Behavior:** Slint tries to use a "native" style.
- **Overriding (via environment variable):** You can force a style (e.g., `SLINT_STYLE=material cargo run`) for testing.
- **Customizing within `ui.slint`:** You can override default styles for specific widgets or create your own custom styles.

**Example: Overriding a default button style:**

```slint
// ui.slint
import { Button } from "std-widgets.slint";

// You can create a component that just sets default styles for a standard widget
export component MyStyledButton inherits Button {
    background: #8BC34A; // Lime green background
    border-radius: 10px;
    color: white;
    font-size: 18px;
    height: 45px;
}

export component MainWindow inherits Window {
    // ...
    VerticalBox {
        // ...
        MyStyledButton {
            text: "Custom Look";
            clicked => { debug("Custom look button clicked!"); }
        }
        // ...
    }
}
```

This allows you to wrap standard widgets with your own default styles, promoting consistency.

---

### 8.5 Practical Application Exercise (40 min)

It's time to put your component and styling skills to the test\!

**Exercise: Create a "User Profile Card" component.**

This component will display a user's name, email, and a status (e.g., "Online" or "Offline"). It should be reusable and styled.

- **Requirements for `UserProfileCard` component:**

  - It should be an `export component` so you can use it in `MainWindow`.
  - It should take `in property` for:
    - `user_name` (string)
    - `user_email` (string)
    - `is_online` (boolean)
  - **Layout:** Use a `HorizontalBox` or `VerticalBox` to arrange the elements neatly.
  - **Styling:**
    - Give the entire card a background color and `border-radius`.
    - Style the `user_name` with a larger, bolder font.
    - Style the `user_email` with a smaller, lighter font.
    - Display the `is_online` status using a `Text` element.
    - **Conditional Styling:** If `is_online` is `true`, make the status text green. If `false`, make it red. (Hint: use `if` expressions in properties, e.g., `color: is_online ? green : red;`)
  - **Optional:** Add a placeholder `Image` element for a profile picture.

- **Usage in `MainWindow`:**

  - In your `MainWindow`, create at least two instances of your `UserProfileCard` component, passing different data to each to show its reusability.

**Example `ui.slint` structure (Don't copy-paste, build it\!):**

```slint
// ui.slint (for User Profile Card)
import { Text, Rectangle, VerticalBox, HorizontalBox, Image } from "std-widgets.slint";

// Define reusable colors (optional, but good practice)
global AppColors {
    brush card_bg: #F5F5F5; // Light grey
    brush online_color: #4CAF50; // Green
    brush offline_color: #F44336; // Red
    brush text_primary: #212121;
    brush text_secondary: #757575;
}

export component UserProfileCard inherits Rectangle {
    width: 300px;
    height: 120px;
    background: AppColors.card_bg;
    border-radius: 10px;
    padding: 15px;

    in property <string> user_name;
    in property <string> user_email;
    in property <bool> is_online;

    HorizontalBox {
        spacing: 10px;
        alignment: center;

        Image {
            source: "assets/profile_placeholder.png"; // Placeholder image
            width: 80px;
            height: 80px;
            border-radius: 40px; // Make it circular
        }

        VerticalBox {
            spacing: 5px;
            alignment: start; // Align text to the left

            Text {
                text: user_name;
                font-size: 20px;
                font-weight: 700;
                color: AppColors.text_primary;
            }

            Text {
                text: user_email;
                font-size: 14px;
                color: AppColors.text_secondary;
            }

            Text {
                text: is_online ? "Online" : "Offline"; // Conditional text
                font-size: 14px;
                font-weight: 500;
                color: is_online ? AppColors.online_color : AppColors.offline_color; // Conditional color
            }
        }
    }
}

export component MainWindow inherits Window {
    width: 700px;
    height: 400px;
    title: "Reusable Components Demo";

    VerticalBox {
        alignment: center;
        spacing: 20px;
        padding: 30px;

        Text {
            text: "Our Team";
            font-size: 40px;
            font-weight: 700;
            color: #4CAF50;
            horizontal-alignment: center;
        }

        UserProfileCard {
            user_name: "Alice Smith";
            user_email: "alice@example.com";
            is_online: true;
        }

        UserProfileCard {
            user_name: "Bob Johnson";
            user_email: "bob@example.com";
            is_online: false;
        }
    }
}
```

---

**End of Lesson 8.** You've now mastered the art of creating reusable UI components and applying custom styles in Slint\! This will significantly boost your productivity and help you build cleaner, more maintainable, and visually consistent desktop applications. Next, we'll dive into local data persistence\!
