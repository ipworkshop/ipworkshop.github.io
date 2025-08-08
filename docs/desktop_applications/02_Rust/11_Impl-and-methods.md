---
title: Impl and Methods
---

#### **Associated Functions (Methods) to `structs` using `impl`:**

You can define functions that belong to a `struct` using an `impl` (implementation) block. These are often called **methods** if their first parameter is `self` (a reference to the instance of the struct).

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

// Implement methods for the Rectangle struct
impl Rectangle {
    // A method that takes an immutable reference to self
    fn area(&self) -> u32 {
        self.width * self.height
    }

    // A method that takes a mutable reference to self
    fn scale(&mut self, factor: u32) {
        self.width *= factor;
        self.height *= factor;
    }

    // An associated function (not a method, doesn't take self)
    // Often used as constructors (like 'new' in other languages)
    fn square(size: u32) -> Rectangle {
        Rectangle {
            width: size,
            height: size,
        }
    }
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };
    println!("The area of the rectangle is {} square pixels.", rect1.area()); // Call method

    let mut rect2 = Rectangle { width: 10, height: 20 };
    rect2.scale(2); // Call mutable method
    println!("Scaled rectangle: width={}, height={}", rect2.width, rect2.height);

    let sq = Rectangle::square(25); // Call associated function using ::
    println!("Square area: {}", sq.area());
}
```
