# Positioning and Layouts in Slint

## Introduction
All visual elements in Slint are placed in a **window**.  
- `x` and `y` → coordinates **relative** to their parent.  
- `width` and `height` → element size.  

Slint calculates **absolute position** by adding parent positions recursively up to the top-level element.


## Placement Methods
You can position elements in two ways:
1. **Explicitly** — set `x`, `y`, `width`, and `height` directly.  
2. **Automatically** — use **layout elements**.

Explicit placement is ideal for static UIs; layouts are better for scalable and complex UIs.


## Explicit Placement Example
```slint
export component Example inherits Window {
    width: 200px;
    height: 200px;
    Rectangle {
        x: 100px;
        y: 70px;
        width: parent.width - self.x;
        height: parent.height - self.y;
        background: blue;
        Rectangle {
            x: 10px;
            y: 5px;
            width: 50px;
            height: 30px;
            background: green;
        }
    }
}
```

### Units
- `px` → logical pixels (scales with device pixel ratio).  
- `phx` → physical pixels.  
- `%` → percentage of parent’s size.

**Defaults:**
- `x` and `y` center elements by default.
- `width`/`height` vary:  
  - Content elements (Text, Image, etc.) → size to content.  
  - Elements without content (Rectangle, TouchArea) → fill parent.


## Preferred Size
- Set with `preferred-width` / `preferred-height`.  
- Defaults depend on children unless explicitly set.  
- `100%` → match parent size.

Example:
```slint
export component MyComponent {
    preferred-width: 100%;
    preferred-height: 100%;
}
```


## Automatic Placement with Layouts
Slint layout elements:
- `VerticalLayout`
- `HorizontalLayout`
- `GridLayout`

Constraints:
- **Size**: `min-width`, `min-height`, `max-width`, `max-height`, `preferred-width`, `preferred-height`.  
- **Stretch**: `horizontal-stretch`, `vertical-stretch` (default `0` = no stretch).

**Common layout properties:**
- `spacing` → space between children.
- `padding` → space inside layout borders (can be per-side).


## Vertical and Horizontal Layout Examples
**Stretch by default:**
```slint
export component Example inherits Window {
    width: 200px;
    height: 200px;
    HorizontalLayout {
        Rectangle { background: blue; min-width: 20px; }
        Rectangle { background: yellow; min-width: 30px; }
    }
}
```

**Alignment:**
```slint
HorizontalLayout {
    alignment: start;
    Rectangle { background: blue; min-width: 20px; }
    Rectangle { background: yellow; min-width: 30px; }
}
```

**Nested Layouts:**
```slint
HorizontalLayout {
    Rectangle { background: green; width: 10px; }
    VerticalLayout {
        padding: 0px;
        Rectangle { background: blue; height: 7px; }
        Rectangle {
            border-color: red; border-width: 2px;
            HorizontalLayout {
                Rectangle { border-color: blue; border-width: 2px; }
                Rectangle { border-color: green; border-width: 2px; }
            }
        }
    }
}
```


## Relative Lengths
Use percentages:
```slint
width: parent.width * 50%;
height: parent.height * 50%;
```
Shorthand:
```slint
width: 50%;
height: 50%;
```

---

## Alignment Options
`alignment` values:
- `stretch` (default)
- `start`
- `end`
- `center`
- `space-between`
- `space-around`

---

## Stretch Algorithm
1. Elements sized to **min size**.  
2. Extra space shared by **stretch factor**.  
3. Does not exceed **max size**.


## Looping in Layouts
Layouts can use `for` or `if` to dynamically insert elements:
```slint
HorizontalLayout {
    Rectangle { background: green; }
    for t in [ "Hello", "World" ] : Text { text: t; }
}
```


## GridLayout
Arrange elements in a grid.

With `Row`:
```slint
GridLayout {
    Row {
        Rectangle { background: red; }
        Rectangle { background: blue; }
    }
}
```

With `row` / `col`:
```slint
GridLayout {
    Rectangle { background: red; }
    Rectangle { background: blue; col: 1; }
}
```


## Container Components with `@children`
Control where child elements go:
```slint
component BoxWithLabel inherits GridLayout {
    Row { Text { text: "label text here"; } }
    Row { @children }
}
```

