---
title: Debug
position: 0
---

# Debug

This lab will teach you how to debug and run programs written in Rust and [embassy](https://embassy.dev) on the STM32 Nucleo-U545RE-Q board.

## Concepts

- How to debug a microcontroller's firmware
- How the binary of the firmware looks like and how to inspect it
- How to cross-compile Rust software
- How to use `probe-rs` for STM32 processors
- How to print messages from a microcontroller
- How to use the Visual Studio Code probe-rs extension

## Resources

1. **STMicroelectronics**, *[STM32U545 Datasheet](https://www.st.com/resource/en/datasheet/stm32u545ce.pdf)*
  - Chapter 4: *Boot modes*
  -  Chapter 5: *Global TrustZone controller*
  - Chapter 75: *Debug support*
2. **STMicroelectronics**, *[STM32U545 Reference Manual](https://www.st.com/resource/en/reference_manual/rm0456-stm32u5-series-armbased-32bit-mcus-stmicroelectronics.pdf)*
4. [probe-rs's documentation](https://probe.rs/docs/overview/about-probe-rs/)
6. [Embassy documentation](https://embassy.dev/book/dev/runtime.html)

## Software Prerequisites

Please make sure that you have these installed.
- [Rust](https://www.rust-lang.org/learn/get-started)
- Rust ARMv8-M target - `rustup target add thumbv8m.main-none-eabihf`
- [probe-rs](https://probe.rs)
- cargo binutils - `cargo install cargo-binutils`
- Rust LLVM Tools - `rustup component add llvm-tools`
- [Visual Studio Code](https://code.visualstudio.com)
  - [Debugger for probe-rs](https://marketplace.visualstudio.com/items?itemName=probe-rs.probe-rs-debugger)

  ## Debugger

Developing software (*firmware*[^firmware]) on devices is a little different from standard computer applications. The main difference
is that the software is developed and compiled on the computer and then 
uploaded and run on a separate device.

Each development board defines its own way of uploading software to it. Some boards, like the STM32s or Raspberry Pi Picos, provide a *simulated* USB drive
where users can copy a file, others, like the ESP32 boards, provide a WiFi Access Point and a web interface.

One method that all boards have in common is using the *debug interface*. Microcontrollers provide a special hardware interface
for debugging purposes. Using specialized hardware, developers can:
- stop the processor any time
- ask the processor to execute one instruction at a time
- read and write the processor's memory (RAM)
- read and write the processor's Flash (Storage)
- read the processor's registers
- access special debugging interfaces for sending log messages

These functions allow developers to upload programs and observe the program's behavior.

There are several debugging protocols available, the most common of them being JTAG and SWD. The RP2 processors use SWD.

:::warning
When placed in production, the **debug interface should be disabled**. Users of the production device should 
never be able to access such an interface and tamper with the device's program.

Each microcontroller offers a way in which the debug interface can be permanently disabled or restricted.
:::

## Cross-compiling

Cross-compiling is the process of building software on one system (the host) 
that is intended to run on a different system (the target). This is necessary 
when developing for embedded systems like the STM32 Nucleo-U545RE-Q because the 
target device has a different processor architecture than the development 
computer. Unlike normal compiling, where the compiled binary runs on the same 
system that builds it, cross-compiling generates machine code suitable for the 
target architecture. 

In Rust, this is handled by specifying a target triple. 
For example, when using `cargo build` for embedded development, Rust compiles 
the firmware for the microcontroller's architecture and flashes it to the 
device. 

For example, cross-compiling for the STM32 Nucleo-U545RE-Q requires the
`thumbv8m.main-none-eabihf` triple. It tells the compiler to build code
for:
- the **ARMv8-M Mainline** (`thumbv8m.main`) architecture
- that runs bare metal, **without an operating system** available (`none`)
- and uses the **Embedded Application Binary Interface** (`eabi`) **with hardware floating point** support

```sh
cargo build --target thumbv8m.main-none-eabihf
```

### Using a configuration file

Instead of providing the target triple in the command line every time, `cargo` offers the 
possibility of writing it in a configuration file called `.cargo/config.toml`.
 
```toml
[build]
target = "thumbv8m.main-none-eabihf"
```

This sets the default compilation target to `thumbv8m.main-none-eabihf`,
ensuring that `cargo` always builds the project for an *ARMv8-M Mainline*
microcontroller with hardware floating-point support.

With this setting, running `cargo build` or `cargo run` automatically
compiles for the specified target, making cross-compilation seamless.

## Binary format

To be able to properly run the code, both the STM32 Nucleo-U545RE-Q microcontrollers expect the binary to follow a specific format defined by their memory map and startup sequence. The compiler and linker, provided by Rust, must ensure that the generated binary places the required regions correctly and meets the device’s format requirements. Otherwise, the microcontroller will fail to start.


### Sections

The binary file is generated as a collection of sections. Each section has:
- size (in bytes)
- the address of the section in RAM when the firmware runs (`VMA`, *Virtual Memory Address*) 
- the address of the section when it is stored into flash (`LMA`, *Load Memory Address*)
- the type

#### Section types
| Type | Description |
|-|-|
| *TEXT* | Contains the binary code the the processor executes |
| *DATA* | Contains data used by the firmware, usually variables |
| *BSS* | Contains uninitialized or initialized with `0` data, usually uninitialized global variables and variables initialized to 0 |
| *DEBUG* | Contains debug information used by the debugger software. |

:::info
DEBUG type sections have no addresses (`0x00000000`), as they are never loaded to the device. These sections
are used by the debugging software to display meaningful information to developers. Among the information
store here we can find:
- source code to binary code mappings
- variable name mappings
- function name mappings
:::

The binary file for the STM32U545 is organized to ensure proper execution and booting, with specific sections for the developer’s code and variables. At the very beginning of flash memory lies the `.vector_table`, which contains the reset handler and interrupt vectors required by the Cortex‑M33 core. Immediately following this, the `.text` section holds the developer’s executable instructions that make up the application’s logic. This section is stored in flash memory and is executed directly from there when the system starts. It is the core of the firmware, containing the main program logic.

Following the `.text` section, the `.data` section contains initialized global and static variables. These variables are stored in flash memory but are copied into RAM during startup so that they can be modified at runtime. The developer’s predefined values for global variables are preserved here. In contrast, the `.bss` section holds uninitialized variables. These are allocated in RAM and automatically zeroed out during the boot process, ensuring they are ready for use by the application.

The `.rodata` section follows, storing read‑only data such as string literals and constant values. These are kept in flash memory, conserving RAM while still allowing the program to access them efficiently throughout execution.

### Linker Script

The compiler is responsible for generating the sections and the linker is responsible for 
putting the sections in the right place in the binary. Rust uses a linker script to
instruct the linker where to put the sections. The linker script is usually called
`memory.x` and is located in the firmware's root folder.

:::warning
The linker script is in the firmware's crate root folder, not in the `src` folder.
:::

```ld
MEMORY
{
  /* On-chip Flash memory */
  FLASH (rx) : ORIGIN = 0x08000000, LENGTH = 512K

  /* On-chip SRAM (SRAM1+SRAM2+SRAM3 combined) */
  RAM (rwx)  : ORIGIN = 0x20000000, LENGTH = 256K
}
```

### Build Script

To connect the linker script (`memory.x`) to the compiler, Rust uses the `build.rs` file
located in the root of the firmware's crate.

:::warning
The `build.rs` file is located in the root of the firmware's crate, not in the `src` folder.
:::

The `build.rs` file compiles before the firmware and is executed by the Rust compiler during
the compilation. The `build.rs` file writes to the *screen* compiler options that the compiler
later uses for the building of the firmware.

The `build.rs` file compiles before the firmware and is executed by the Rust compiler during
the compilation. The `build.rs` file writes to the *screen* compiler options that the compiler
later uses for the building of the firmware.

```rust
//! This build script copies the `memory.x` file from the crate root into
//! a directory where the linker can always find it at build time.
//! For many projects this is optional, as the linker always searches the
//! project root directory -- wherever `Cargo.toml` is. However, if you
//! are using a workspace or have a more complicated build setup, this
//! build script becomes required. Additionally, by requesting that
//! Cargo re-run the build script whenever `memory.x` is changed,
//! updating `memory.x` ensures a rebuild of the application with the
//! new memory settings.

use std::env;
use std::fs::File;
use std::io::Write;
use std::path::PathBuf;

fn main() {
    // Put `memory.x` in our output directory and ensure it's
    // on the linker search path.
    let out = &PathBuf::from(env::var_os("OUT_DIR").unwrap());
    File::create(out.join("memory.x"))
        .unwrap()
        .write_all(include_bytes!("memory.x"))
        .unwrap();
    println!("cargo:rustc-link-search={}", out.display());

    // By default, Cargo will re-run a build script whenever
    // any file in the project changes. By specifying `memory.x`
    // here, we ensure the build script is only re-run when
    // `memory.x` is changed.
    println!("cargo:rerun-if-changed=memory.x");

    println!("cargo:rustc-link-arg-bins=--nmagic");
    println!("cargo:rustc-link-arg-bins=-Tlink.x");
    // Required for `defmt`
    println!("cargo:rustc-link-arg-bins=-Tdefmt.x");
}
```

This example instructs the linker to use:
- the project's linker script - `memory.x`
- the `cortex-m-rt` linker script - `link.x`
- the `defmt`'s linker script - `defmt.x`

### Inspect binaries

When working in Rust for the STM32 Nucleo-U545RE-Q, tools such as `rust-objdump` can be used to inspect the compiled binary and analyze its memory layout. The output includes various sections that are crucial for embedded development.
  
  | Section         | Fixed Offset  | Description |
|----------------|--------------|-------------|
| *`.vector_table`* | `0x08000000` | Reset vector and interrupt table. The CPU fetches the initial stack pointer and reset handler from here after reset. |
| *`.text`* | `0x08000238` | Stores executable code, typically placed in flash memory. Optimizing this section can reduce flash usage and improve execution efficiency. |
| *`.rodata`* | `0x080112F0` | Contains read-only data, such as string literals and constants, stored in flash memory. Helps minimize RAM usage. |
| *`.data`* | `0x20000000` (load image at `0x08014780`) | Includes initialized variables that are stored in flash and copied to RAM during startup. Used for global and static variables requiring predefined values. |
| *`.bss`* | 	`0x20000050` | Represents uninitialized variables that are zeroed out in RAM before execution. Large `.bss` sections can impact RAM availability. |

## Empty firmware

An *empty firmware* is a piece of software running on a device that boots and puts 
the device in an endless loop. To boot, the firmware has to perform the following:
- do not depend on the standard library (`#![no_std]`)
- do not provide the standard `main` function called by the operating system (`#![no_main]`)
- provide the `.start_block` and `.end_block` sections (or `.bootloader` for the Pico 1);
- provide the `.interrupt_vector` section with pointers to interrupts;
- copy the DATA sections from Flash to the correct address in RAM;
- initialize the BSS section in RAM with 0 values
- jump to the `main` function and never return.

### The `.interrupt_vector` section

On STM32 devices, the interrupt vector table is provided by the `cortex-m-rt` crate. Importing this crate is enough to provide a valid vector table with reset, fault, and interrupt handlers.


```rust
#![no_std]
#![no_main]

// we use as _ to avoid a compiler warning
// saying that the crate is not used
use cortex_m_rt as _;
```


### The `main` function

In bare-metal Rust, there is no operating system to initialize memory or call `main`. The `cortex-m-rt` crate provides the `#[entry]` macro, which generates the startup code: it copies `.data` from FLASH to RAM, zeros `.bss`, sets up the stack, and then calls your entry function.

```rust
use cortex_m_rt::entry;

#[entry]
fn main() -> ! {
    // Your firmware starts here.
    loop {}
}

```

:::info
The important aspect is the usage of the `#[entry]` macro, 
while the name of the function does not need to be `main`.
:::

The `entry!` macro will rewrite the `main` function and add all the initialization code.

:::note
Different frameworks like `embassy-rs` will use different entry macros.
:::

## Flashing firmware

To run firmware on the STM32 Nucleo-U545RE-Q or Raspberry Pi Pico 2, the 
compiled program must be transferred to the device's flash (non-volatile) memory. This 
process is called *flashing*, and it ensures that the firmware remains on the 
device even after a power reset. 

A flashing tool is software that communicates 
with the device through a debug probe or other interfaces, such as USB or 
*UART*, to write the firmware to the correct memory location. Many flashing tools 
also verify the uploaded firmware to ensure data integrity and provide 
additional features like chip erasing or memory protection configuration.

When developing Rust firmware for the STM32 Nucleo-U545RE-Q or Raspberry Pi Pico 2, `probe-rs` is the 
preferred flashing tool to upload and debug code. 

After building the firmware using `cargo build`, an ELF file will be generated in
`target/thumbv8m.main-none-eabihf/debug/$app_name`. This file can be flashed to the
board using:

```sh
probe-rs run --chip STM32U545RETxQ target/thumbv8m.main-none-eabihf/debug/$app_name
```

:::info
Replace $app_name with the name of the firmware's crate, usually the name of the folder
where the firmware source resides.
:::

### Using `cargo run`

On a computer, running a Rust program with `cargo run` compiles the source 
code into an executable and immediately starts it. This command streamlines 
development by combining compilation and execution into a single step.

A similar process applies when using `cargo run` to develop firmware for the STM32 Nucleo-U545RE-Q or Raspberry 
Pi Pico 2. Instead of just compiling and running a program on the host computer, 
`cargo run` cross compiles the firmware and flashes it onto the target device in one 
step. Under the hood, it uses `probe-rs` to detect the connected debug probe 
and handle the flashing process automatically. This eliminates the need for 
separate flashing tools, making firmware development as seamless as running a 
Rust program on a computer.

To be able to use `cargo run` for flashing firmware, a runner has to be specified in the
`.cargo/config.toml` file. The following lines have to be added.

```toml
[target.'cfg(all(target_arch = "arm", target_os = "none"))']
runner = "probe-rs run --chip STM32U545RETxQ"
```
