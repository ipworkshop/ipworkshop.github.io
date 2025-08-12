# Globals in Slint

## Introduction
**Globals** are singletons that hold properties or callbacks accessible throughout the entire project.  
Declare them using:
```slint
global Name {
    /* properties or callbacks */
}
```

Access global properties or callbacks via:
```
Name.property
Name.callback()
```


## Example: Global Color Palette
```slint
global Palette  {
    in-out property<color> primary: blue;
    in-out property<color> secondary: green;
}

export component Example inherits Rectangle {
    background: Palette.primary;
    border-color: Palette.secondary;
    border-width: 2px;
}
```


## Exporting Globals
- Use `export global` to make a global available to other `.slint` files.
- To make a global visible to **native code** (Rust, C++, NodeJS, Python), re-export it from the file that exports your main application component.

Example:
```slint
export global Logic  {
    in-out property <int> the-value;
    pure callback magic-operation(int) -> int;
}

// Main application component
export component App inherits Window {
    // ...
}
```


## Rust Example: Accessing a Global
```rust
slint::slint!{
export global Logic {
    in-out property <int> the-value;
    pure callback magic-operation(int) -> int;
}

export component App inherits Window {
    // ...
}
}

fn main() {
    let app = App::new();
    app.global::<Logic>().on_magic_operation(|value| {
        eprintln!("magic operation input: {}", value);
        value * 2
    });
    app.global::<Logic>().set_the_value(42);
    // ...
}
```


## Re-Exposing Globals in Components
You can re-expose properties or callbacks from a global using **two-way bindings** (`<=>`).

```slint
global Logic  {
    in-out property <int> the-value;
    pure callback magic-operation(int) -> int;
}

component SomeComponent inherits Text {
    text: "The magic value is:" + Logic.magic-operation(42);
}

export component MainWindow inherits Window {
    in-out property the-value <=> Logic.the-value;
    pure callback magic-operation <=> Logic.magic-operation;

    SomeComponent {}
}
```

This allows **native code** to access or modify global values through your component.
