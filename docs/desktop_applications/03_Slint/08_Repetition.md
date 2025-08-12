# Repetition in Slint

## Introduction
The **for-in** syntax in Slint is used to create multiple instances of an element dynamically.

**Syntax:**
```slint
for name[index] in model : id := Element { ... }
```
- **name** → variable holding the model's value in each iteration.  
- **index** *(optional)* → index of the current element.  
- **id** *(optional)* → identifier for the element.  
- **model** → integer, array, or natively declared model.

---

## Supported Model Types
1. **Integer** → repeats the element that many times.  
2. **Array** → repeats the element for each array entry.  
3. **Native Model** → repeats for each item in a model declared in Slint or provided from native code.

The loop variable (`name`) is available within the repeated element as a pseudo-property.


## Examples

### Integer/Array Literal Model
```slint
export component Example inherits Window {
    preferred-width: 300px;
    preferred-height: 100px;

    for my-color[index] in [ #e11, #1a2, #23d ]: Rectangle {
        height: 100px;
        width: 60px;
        x: self.width * index;
        background: my-color;
    }
}
```

### Array of Structs as a Model
```slint
export component Example inherits Window {
    preferred-width: 50px;
    preferred-height: 50px;

    in property <[{foo: string, col: color}]> model: [
        {foo: "abc", col: #f00 },
        {foo: "def", col: #00f },
    ];

    VerticalLayout {
        for data in root.model: my-repeated-text := Text {
            color: data.col;
            text: data.foo;
        }
    }
}
```


## Arrays and Models in Slint
Arrays are declared by enclosing the element type in square brackets:
```slint
export component Example {
    in-out property<[int]> list-of-int: [1, 2, 3];
    in-out property<[{a: int, b: string}]> list-of-structs: [
        { a: 1, b: "hello" },
        { a: 2, b: "world" }
    ];
}
```

**Array literals** and **array properties** can both be used as models in `for` expressions.


## Array Operations
Arrays and models support:

### Length
```slint
list-of-int.length
```
Returns the number of items.

### Index Access
```slint
list-of-int[0] // first element
```
If the index is out of bounds, Slint returns a default-constructed value.

**Example:**
```slint
export component Example {
    in-out property<[int]> list-of-int: [1, 2, 3];

    out property<int> list-len: list-of-int.length;
    out property<int> first-int: list-of-int[0];
}
```
