# The `.slint` File

## Introduction
In Slint, you define user interfaces in the **Slint language** and save them in files with the `.slint` extension.

Each `.slint` file defines **one or more components**. Components declare a tree of elements and can be reused to build your own set of UI controls. You can use each declared component by its name in other components.


## Example: Components and Elements
```slint
component MyButton inherits Text {
    color: black;
    // ...
}

export component MyApp inherits Window {
    preferred-width: 200px;
    preferred-height: 100px;
    Rectangle {
        width: 200px;
        height: 100px;
        background: green;
    }
    MyButton {
        x: 0; y: 0;
        text: "hello";
    }
    MyButton {
        y: 0;
        x: 50px;
        text: "world";
    }
}
```

- `MyButton` and `MyApp` are components.  
- `Window` and `Rectangle` are **built-in elements**.  
- Components can **reuse** other components.


## Naming Elements
You can assign names to elements using `:=`:

```slint
export component MyApp inherits Window {
    preferred-width: 200px;
    preferred-height: 100px;

    hello := MyButton {
        x: 0; y: 0;
        text: "hello";
    }
    world := MyButton {
        y: 0;
        text: "world";
        x: 50px;
    }
}
```

### Reserved Names
- `root` → outermost element of a component.  
- `self` → current element.  
- `parent` → parent element.


## Comments
- **Single-line**: `// comment`
- **Multi-line**: `/* ... */`

```slint
// Single line comment
/*
   Multi-line comment
*/
```

---

## Elements and Components
- **Elements** → basic building blocks (e.g., `Text`, `Rectangle`).  
- **Components** → can be built from multiple elements.  
- Declared as: `ElementName { ... }`

Valid:
```slint
Text {}
Text {
}
```

Invalid:
```slint
Text {};
```


## The Root Element
The root element in a `.slint` file must be a **component**.

```slint
component MyApp {
    Text {
        text: "Hello World";
        font-size: 24px;
    }
}
```

## Properties
Set with `property-name: value;`.

### Identifiers
- Letters, numbers, `_`, or `-`.
- Cannot start with number or `-`.
- `_` and `-` are considered equivalent (`foo_bar` = `foo-bar`).


## Conditional Elements
Use `if` to create elements conditionally.

```slint
export component Example inherits Window {
    preferred-width: 50px;
    preferred-height: 50px;
    if area.pressed : foo := Rectangle { background: blue; }
    if !area.pressed : Rectangle { background: red; }
    area := TouchArea {}
}
```

## Modules (Import/Export)
By default, components are **private**. Use `export` to make them available in other files.

```slint
component ButtonHelper inherits Rectangle { }
component Button inherits Rectangle {
    ButtonHelper { }
}
export { Button }
```

Rename on export:
```slint
component Button inherits Rectangle { }
export { Button as ColorButton }
```

Export directly:
```slint
export component Button inherits Rectangle { }
```

Import from other files:
```slint
import { Button } from "./button.slint";
```

Rename on import:
```slint
import { Button as CoolButton } from "../theme/button.slint";
```

## Module Syntax
### Import
```slint
import { MyButton } from "module.slint";
import { MyButton, MySwitch } from "module.slint";
import { MyButton as OtherButton } from "module.slint";
```

### Export
```slint
export component MyButton inherits Rectangle { }
component MySwitch inherits Rectangle { }
export { MySwitch }
export { MySwitch as Alias1, MyButton as Alias2 }
export * from "other_module.slint";
```
