# Slint Reactivity

## Introduction
**Reactivity** is a core concept in Slint. It allows you to create complex, dynamic user interfaces with far less code.  
In Slint, UI elements automatically update when the properties they depend on change — without requiring manual refresh logic.

## Example: Mouse Tracking and Color Change
```slint
export component MyComponent {
    width: 400px; height: 400px;

    Rectangle {
        background: #151515;
    }

    ta := TouchArea {}

    myRect := Rectangle {
        x: ta.mouse-x;
        y: ta.mouse-y;
        width: 40px;
        height: 40px;
        background: ta.pressed ? orange : white;
    }

    Text {
        x: 5px; y: 5px;
        text: "x: " + myRect.x / 1px;
        color: white;
    }

    Text {
        x: 5px; y: 15px;
        text: "y: " + myRect.y / 1px;
        color: white;
    }
}
```

### How It Works
- The **rectangle follows the mouse** using `x: ta.mouse-x;` and `y: ta.mouse-y;`.
- **Color changes on click**: `background: ta.pressed ? orange : white;`.
- Text labels **automatically update** to show the rectangle's current position.

This works because:
1. The `TouchArea` exposes `mouse-x`, `mouse-y`, and `pressed` properties.  
2. When these properties change, all bound expressions are automatically re-evaluated.  
3. The UI updates only where dependencies have changed.


## Performance and Dependency Tracking
Slint evaluates bindings lazily:
- Dependencies are registered when a property is accessed during evaluation.
- When a property changes, only dependent expressions are re-evaluated.
- This ensures high performance, even for complex UIs.


## Property Expressions
Property bindings can be simple or complex:

```slint
// Tracks foo.x
x: foo.x;

// Conditional expression
x: foo.x > 100px ? 0px : 400px;

// Clamped value
x: clamp(foo.x, 0px, 400px);
```

You can also use **functions** for clarity:

```slint
export component MyComponent {
    width: 400px; height: 400px;

    pure function lengthToInt(n: length) -> int {
        return (n / 1px);
    }

    ta := TouchArea {}

    myRect := Rectangle {
        x: ta.mouse-x;
        y: ta.mouse-y;
        width: 40px;
        height: 40px;
        background: ta.pressed ? orange : white;
    }

    Text {
        x: 5px; y: 5px;
        text: "x: " + lengthToInt(myRect.x);
    }
    Text {
        x: 5px; y: 15px;
        text: "y: " + lengthToInt(myRect.y);
    }
}
```

## Purity in Bindings
For reactivity to work correctly, bindings must be **pure**:
- Evaluating a property should not change any other observable state.
- The Slint compiler enforces purity in binding expressions, pure functions, and pure callbacks.

Example:
```slint
export component Example {
    pure callback foo() -> int;
    public pure function bar(x: int) -> int {
        return x + foo();
    }
}
```

## Two-Way Bindings
Two-way bindings keep two properties in sync using `<=>`:

```slint
export component Example  {
    in property<brush> rect-color <=> r.background;
    in property rect-color2 <=> r.background;

    r:= Rectangle {
        width: parent.width;
        height: parent.height;
        background: blue;
    }
}
```
