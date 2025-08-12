# Introduction to Slint

## What is Slint?
Slint is a **declarative UI language** designed to make building modern, efficient, and portable user interfaces simple and intuitive.  
It allows you to describe *what* your UI should look like and *how* it should behave, without dealing with low-level implementation details.

Slint is designed to work seamlessly with languages like **Rust**, **C++**, and **JavaScript**, keeping your **business logic** separate from the UI code.


## Core Concepts

### Elements and Properties
Slint uses **elements** (such as `Text`, `Rectangle`, `Button`) followed by curly braces `{}` to define UI components.  
Inside the braces, you set **properties** that describe the appearance or behavior of that element.

Example:
```slint
Text {
    text: "Hello World!";
    font-size: 24px;
    color: #0044ff;
}
```

### Nesting Elements
Elements can be placed inside one another to build hierarchical UIs.

Example:
```slint
Rectangle {
    width: 150px;
    height: 60px;
    background: white;
    border-radius: 10px;

    Text {
        text: "Hello World!";
        font-size: 24px;
        color: black;
    }
}
```

### Reactivity
Slint has **built-in reactivity**: when a property changes, all dependent UI elements automatically update.

Example with a counter:
```slint
property <int> counter: 0;

Rectangle {
    width: 150px;
    height: 60px;
    background: white;
    border-radius: 10px;

    Text {
        text: "Count: " + counter;
        font-size: 24px;
        color: black;
    }

    TouchArea {
        clicked => {
            counter += 1;
        }
    }
}
```


## Why Slint?

- **Pure declarative language** built for UI from the ground up.  
- **Easy to read and write** for both developers and designers.  
- **Portable** works on desktop, embedded systems, and web.  
- **Clear separation** of UI and business logic.  
- **Reactivity** makes dynamic UIs effortless.

Compared to traditional UI approaches (like HTML/JavaScript or XML-based layouts), Slint is more concise, readable, and easier to maintain.
