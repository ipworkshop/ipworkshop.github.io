---
title: Embassy
position: 1
---

# Introduction

[Embassy](https://github.com/embassy-rs/embassy) is a modern, `async` embedded framework for Rust. It provides efficient, non-blocking abstractions for microcontrollers.

First, clone the `embassy-rs` repository.

```shell
git clone git@github.com:embassy-rs/embassy.git
cd embassy
```

## Environment setup

For those of you working in Visual Studio Code, the Embassy project has support for `rust-analyzer`. In order to properly set it up, make sure you correctly open the project's root folder (`embassy`), and modify the workspace settings according to the example bellow.

```json title=".vscode/settings.json"
{
  // ...

  // Uncomment the target of your chip.

  // highlight-start
  //"rust-analyzer.cargo.target": "thumbv6m-none-eabi",
  "rust-analyzer.cargo.target": "thumbv7m-none-eabi",
  //highlight-end
  // "rust-analyzer.cargo.target": "thumbv7em-none-eabi",
  //"rust-analyzer.cargo.target": "thumbv7em-none-eabihf",
  //"rust-analyzer.cargo.target": "thumbv8m.main-none-eabihf",
  "rust-analyzer.cargo.features": [
    // Comment these features
    // highlight-start
    // "stm32f446re",
    // "time-driver-any",
    // "unstable-pac",
    // "exti",
    // "rt",
    // highlight-end
  ],
  "rust-analyzer.linkedProjects": [
    // highlight-next-line
    "examples/stm32f4/Cargo.toml",
    // To work on the examples, comment the line above and all of the cargo.features lines,
    // then uncomment ONE line below to select the chip you want to work on.
    // This makes rust-analyzer work on the example crate and all its dependencies.
    // "examples/mspm0c1104/Cargo.toml",
    // "examples/mspm0g3507/Cargo.toml",
    // ...
  ],
}

```

## Blink an LED

Fortunately, Embassy provides a variety of examples implemented for a multitude of hardware platforms, our **STM32F429ZI** included. Examples for our board can be found in the `examples/stm32f4` crate. Multiple examples can be found in the `src` folder, organized as separate *binaries*. To flash one of the examples, simply run:

```shell
cd examples/stm32f4
cargo run --bin <EXAMPLE>
```

Go ahead and run the `blinky` example. You should get an output similar to this.

```shell
cargo run --bin blinky
    Compiling proc-macro2 v1.0.97
    Compiling unicode-ident v1.0.18
    ...
    Compiling embassy-net v0.7.0 (/Users/danut/Work/eurotock/ipw-repos/embassy/embassy-net)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 12.33s
     Running `probe-rs run --chip STM32F429ZITx target/thumbv7em-none-eabi/debug/blinky`
      Erasing ✔ 100% [####################] 128.00 KiB @  44.41 KiB/s (took 3s)
  Programming ✔ 100% [####################]  81.00 KiB @  31.50 KiB/s (took 3s)                         Finished in 5.46s
0.000000 [TRACE] BDCR ok: 00008200 (embassy_stm32 src/rcc/bd.rs:221)
0.000000 [DEBUG] flash: latency=0 (embassy_stm32 src/rcc/f247.rs:264)
0.000000 [DEBUG] rcc: Clocks { hclk1: MaybeHertz(16000000), hclk2: MaybeHertz(16000000), hclk3: MaybeHertz(16000000), hse: MaybeHertz(0), lse: MaybeHertz(0), lsi: MaybeHertz(0), pclk1: MaybeHertz(16000000), pclk1_tim: MaybeHertz(16000000), pclk2: MaybeHertz(16000000), pclk2_tim: MaybeHertz(16000000), pll1_q: MaybeHertz(0), plli2s1_p: MaybeHertz(0), plli2s1_q: MaybeHertz(0), plli2s1_r: MaybeHertz(0), pllsai1_q: MaybeHertz(0), rtc: MaybeHertz(32000), sys: MaybeHertz(16000000) } (embassy_stm32 src/rcc/mod.rs:71)
0.000152 [INFO ] Hello World! (blinky src/bin/blinky.rs:13)
0.000915 [INFO ] high (blinky src/bin/blinky.rs:18)
0.302062 [INFO ] low (blinky src/bin/blinky.rs:22)
```

### 3-bit Counter

For this task, you will have to implement a 3-bit counter, using the 3 on-board LEDs and the `USER` button on board.

You will need to create a new binary in the `src/bin` folder you can name `counter-3bit.rs`, starting from the `blinky.rs` example.

```rust title="src/bin/counter-3bit.rs.rs"
#![no_std]
#![no_main]

use defmt::*;
use embassy_executor::Spawner;
use embassy_stm32::gpio::{Level, Output, Speed};
use embassy_time::Timer;
use {defmt_rtt as _, panic_probe as _};

#[embassy_executor::main]
async fn main(_spawner: Spawner) {
    let p = embassy_stm32::init(Default::default());
    info!("Hello World!");

    let mut led = Output::new(p.PB7, Level::High, Speed::Low);

    loop {
        info!("high");
        led.set_high();
        Timer::after_millis(300).await;

        info!("low");
        led.set_low();
        Timer::after_millis(300).await;
    }
}
```

The first step is figuring out the pins the other two LEDs are connected to. To do so, you can consult the board's [User Manual](https://www.st.com/resource/en/user_manual/um1974-stm32-nucleo144-boards-mb1137-stmicroelectronics.pdf).

```rust title="src/bin/counter-3bit.rs.rs"
#[embassy_executor::main]
async fn main(_spawner: Spawner) {
    let p = embassy_stm32::init(Default::default());
    info!("Hello World!");

    let mut led0 = todo!("Replace me");
    let mut led1 = Output::new(p.PB7, Level::High, Speed::Low);
    let mut led2 = todo!("Replace me");

    loop {
        // ...
    }
}
```

Next, you will have to instantiate the button. We will want to use one of the external interrupt lines, in order to use the asynchronous methods for the user button.

```rust
let button = ExtiInput::new(p.PC13, p.EXTI13, Pull::Down);
```

Make sure to fix all the import errors.

Now, inside the main `loop`. Await for the button to be pressed in order to update the *"3-bit display"*.

```rust title="src/bin/counter-3bit.rs.rs"
let mut counter = 0;
loop {
    button.wait_for_high().await;
    counter = (counter + 1) % 7;

    // Depending on the value of each of the three bits,
    // set the LEDs high or low
}
```

### Improved `BinaryCounter`

With everything in place, here comes the question of extending the functionalities. We would like for this display mechanism to be painlessly extensible to work with any number of LEDs. The quick and painless answer to this problem is generics. We must define a generic `BinaryCounter`.

```rust title="src/bin/binary-counter.rs"
struct BinaryCounter<'a, const N: usize> {
    inner_counter: usize,
    leds: [Output<'a>; N],
}

impl<'a, const N: usize> BinaryCounter<'a, N> {
    fn new(leds: [Output<'a>; N]) -> Self {
        Self {
            inner_counter: 0,
            leds,
        }
    }
}
```

Next, we will define the API for interacting with our display. We will have two methods, `increment` which will increase the inner counter's value by one unit and `display`, which will update the LEDs state.

```rust title="src/bin/binary-counter.rs"
impl<'a, const N: usize> BinaryCounter<'a, N> {
    fn new(leds: [Output<'a>; N]) -> Self {
        Self {
            inner_counter: 0,
            leds,
        }
    }

    /// This function increases the inner counter
    fn increment(&mut self) {
        core::todo!()
    }

    /// This function updates the state of the LEDs
    /// according to the `inner_counter` value
    fn display(&mut self) {
        core::todo!()
    }
}
```

With the interface in place, we can write the `main` function.

```rust title="src/bin/binary-counter.rs"
#[embassy_executor::main]
async fn main(_spawner: Spawner) {
    let p = embassy_stm32::init(Default::default());
    info!("Binary Demo!");

    // TODO: `Output` definition

    let mut bc = BinaryCounter::new([led0, led1, led2]);

    let mut button = ExtiInput::new(p.PC13, p.EXTI13, Pull::Down);

    loop {
        bc.display();
        button.wait_for_high().await;
        bc.increment();
    }
}
```
