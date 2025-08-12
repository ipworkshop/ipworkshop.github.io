# Functions and Callbacks in Slint

## Introduction
Functions in Slint allow you to **name, organize, and reuse** pieces of logic.  
They can be defined inside **components** or **elements within components** — but not globally, inside structs/enums, or nested within other functions.


## Declaring Functions
Functions are declared with the `function` keyword:

```slint
export component Example {
    function my-function(parameter: int) -> string {
        return "result";
    }
}
```
- **Parameters**: `(name: type)` format, passed by value.
- **Return type**: after `->`.
- If no explicit `return`, the last statement's value is returned.
- Use `pure` for side-effect-free functions.


## Calling Functions
Functions can be called:
- Without an element name (like a normal function call).
- With an element name (like a method).

```slint
import { Button } from "std-widgets.slint";

export component Example {
    property <string> my-property: my-function();
    property <int> my-other-property: my_button.my-other-function();

    pure function my-function() -> string {
        return "result";
    }

    Text {
        text: root.my-function();
    }

    my_button := Button {
        pure function my-other-function() -> int {
            return 42;
        }
    }
}
```


## Function Visibility
- **private** (default): accessible only within the component.
- **public**: accessible from other components via a target (child instance).
- **protected**: accessible only by components that inherit from it.

Example:
```slint
export component HasFunction {
    public pure function double(x: int) -> int {
        return x * 2;
    }
}

export component CallsFunction {
    property <int> test: my-friend.double(1);
    my-friend := HasFunction {}
}
```

Functions in **child elements** are not accessible externally, even if `public`.

Public functions in **exported components** can also be called from **backend code** (Rust, C++, JS).


## Functions vs Callbacks
**Similarities**:
- Callable blocks of code.
- Have parameters and return values.
- Can be `pure`.

**Differences**:
- **Callbacks** can be implemented from backend code.
- **Functions** must be fully implemented in Slint.
- Callback syntax differs and supports aliases with `<=>`.


## Declaring Callbacks
Callbacks are declared with the `callback` keyword.

Example:
```slint
export component Example inherits Rectangle {
    callback hello;

    area := TouchArea {
        clicked => {
            root.hello()
        }
    }
}
```

### With Parameters:
```slint
callback hello(int, string);
hello(aa, bb) => { /* handler code */ }
```

### With Return Value:
```slint
callback hello(int, int) -> int;
hello(aa, bb) => { aa + bb }
```

### With Named Arguments:
```slint
callback hello(foo: int, bar: string);
hello(aa, bb) => { /* code */ }
```


## Callback Aliases
You can alias callbacks using `<=>`:
```slint
callback clicked <=> area.clicked;
area := TouchArea {}
```

