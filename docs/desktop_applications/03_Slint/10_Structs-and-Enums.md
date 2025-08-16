# Structs and Enums in Slint

## Structs
Use the `struct` keyword to define named data structures.

Example:
```slint
export struct Player {
    name: string,
    score: int,
}

export component Example {
    in-out property<Player> player: { name: "Foo", score: 100 };
}
```
- Default values: all fields are set to their type’s default value.


## Anonymous Structures
You can declare anonymous structs inline using:
```slint
{ field1: type1, field2: type2 }
```
Initialize them with:
```slint
{ field1: value1, field2: value2 }
```

Example:
```slint
export component Example {
    in-out property<{name: string, score: int}> player: { name: "Foo", score: 100 };
    in-out property<{a: int, }> foo: { a: 3 };
}
```
- Trailing commas are allowed in type declarations and initializers.


## Enums
Use the `enum` keyword to define enumerations.

Example:
```slint
export enum CardSuit { clubs, diamonds, hearts, spade }

export component Example {
    in-out property<CardSuit> card: spade;
    out property<bool> is-clubs: card == CardSuit.clubs;
}
```
- Enum values are accessed as `EnumName.value` (e.g., `CardSuit.spade`).
- The enum name can be omitted if:
  - The property is of that enum type.
  - The return value of a callback is of that enum type.
- Default value of an enum type is always its **first** value.

