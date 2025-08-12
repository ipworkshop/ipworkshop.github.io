# Expressions in Slint

## Introduction
Expressions allow you to **declare relationships** and **connect properties** in your user interface.  
When properties used in an expression change, the expression is **automatically re-evaluated** and the property is updated.

Example:
```slint
export component Example {
    // Declare a property of type int
    in-out property<int> my-property;

    // Bind width to the property
    width: root.my-property * 20px;
}
```
When `my-property` changes, the `width` changes automatically.


## Arithmetic Operators
Arithmetic in expressions works like most programming languages, using `*`, `+`, `-`, `/`.

```slint
export component Example {
    in-out property<int> p: 1 * 2 + 3 * 4; // same as (1 * 2) + (3 * 4)
}
```


## String Concatenation
Concatenate strings using `+`.


## Logical and Comparison Operators
- Logical: `&&` (and), `||` (or)  
- Comparison: `==`, `!=`, `>`, `<`, `>=`, `<=`


## Accessing Properties of Elements
Use `elementName.propertyName` syntax.

```slint
export component Example {
    foo := Rectangle {
        x: 42px;
    }
    x: foo.x;
}
```


## Ternary Operator
Slint supports the ternary operator `condition ? value1 : value2`.

Example:
```slint
export component Example inherits Window {
    preferred-width: 100px;
    preferred-height: 100px;

    Rectangle {
        touch := TouchArea {}
        background: touch.pressed ? #111 : #eee;
        border-width: 5px;
        border-color: !touch.enabled ? #888
            : touch.pressed ? #aaa
            : #555;
    }
}
```


## Statements in Expressions
### Assignment
```slint
clicked => { some-property = 42; }
```

### Self-assignment
```slint
clicked => { some-property += 42; }
```

### Calling a Callback
```slint
clicked => { root.some-callback(); }
```

### Conditional Statements
```slint
clicked => {
    if (condition) {
        foo = 42;
    } else if (other-condition) {
        bar = 28;
    } else {
        foo = 4;
    }
}
```

### Empty Expression
```slint
clicked => { }
// or
clicked => { ; }
```
