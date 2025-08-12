# Properties in Slint

## Introduction
All elements in Slint have **properties**. Built-in elements come with standard properties such as `color` or dimensional properties like `width` and `height`.  
You can assign values directly or use expressions.

Example:
```slint
export component Example inherits Window {
    // Simple expression (ends with semicolon)
    width: 42px;
    // Code block (no semicolon)
    height: { 42px }
}
```

The **default value** of a property is the default value of its type:  
- `bool` → `false`  
- `int` → `0`  
- etc.


## Declaring Custom Properties
You can define extra properties by specifying the type, name, and optional default value:

```slint
export component Example {
    // Integer property named my-property
    property<int> my-property;

    // Integer property with a default value
    property<int> my-second-property: 42;
}
```

---

## Property Qualifiers
You can annotate properties with qualifiers that control how they can be accessed:

- **private** *(default)*: Accessible only within the component.  
- **in**: Input property — can be set by the user of the component, but not overwritten internally.  
- **out**: Output property — can only be set by the component, read-only for the user.  
- **in-out**: Readable and writable by both the component and the user.

Example:
```slint
export component Button {
    in property <string> text;     // Set by the user
    out property <bool> pressed;   // Read by the user
    in-out property <bool> checked; // Changed by both
    private property <bool> has-mouse; // Internal only
}
```

Properties declared at the top level that aren’t private are accessible externally when using the component as an element, or from business logic via language bindings.


## Change Callbacks
You can define a callback that is triggered when a property changes value.

```slint
import { LineEdit } from "std-widgets.slint";
export component Example inherits Window {
    VerticalLayout {
        LineEdit {
            // Triggered when text changes
            changed text => { t.text = self.text; }
        }
        t := Text {}
    }
}
```

### Notes on Change Callbacks:
- They are **not invoked immediately** — instead, they are queued and executed in the next event loop iteration.
- Invoked **only if** the property’s value actually changes.
- If multiple changes occur in one event loop cycle, the callback runs only once.
- If the value reverts before execution, the callback won’t be called.


## Warning: Avoid Loops in Change Callbacks
Creating a callback loop can cause undefined behavior.

Example of a potential loop:
```slint
export component Example {
    in-out property <int> foo;
    property <int> bar: foo + 1;
    changed bar => { foo += 1; } // Potential infinite loop
}
```

Slint will break such loops after a few iterations, which can prevent other callbacks from running.


## Best Practices
- **Prefer declarative bindings** over change callbacks when possible.
- Avoid:
```slint
changed bar => { foo = bar + 1; }
```
- Instead, use:
```slint
foo: bar + 1;
```

Declarative bindings:
- Automatically track dependencies.
- Are lazily evaluated.
- Maintain binding purity.
- Are easier to work with in graphical editors.

Excessive use of `changed` callbacks can lead to bugs, complexity, and performance issues.

