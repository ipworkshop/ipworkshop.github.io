# Introduction

## Prerequisites

:::note Ubuntu Virtual Machine
This workshop will not work on Windows systems.
You can use the Ubuntu VM we provide [here](https://drive.google.com/file/d/1WSUo29d9Z8bmcjurvkDUmoAgq1TqaW4H/view?usp=sharing) (only works on VirtualBox).
The username and password are both `ipwembedded`.
The VM has the port 3033 forwarded for SSH connection.
:::

If you did not attend the **Tock Workshop**, please follow the [Setup Tutorial](../tock_workshop/index.md).

## Getting Started

For this track we will be using the **Nucleo-F429ZI** boards. You will need to **change the branch** you are working on, but first make sure you commit your changes.

```shell
git add .
git commit -m "tock workshop progress"
```

Then, to fetch the branch and work on it, run:

```shell
git fetch
git checkout track/embedded
```

The board's main can be found in the `boards/nucleo_f429zi` subfolder. Try to flash the kernel to the board, using the board's `Makefile`. After you are done flashing, connect to the board using `tockloader listen`

```shell
[INFO   ] No device name specified. Using default name "tock".
[INFO   ] No serial port with device name "tock" found.
[INFO   ] Found 2 serial ports.
Multiple serial port options found. Which would you like to use?
[0]     /dev/cu.debug-console - n/a
[1]     /dev/cu.usbmodem1303 - STM32 STLink

Which option? [0] 1
[INFO   ] Using "/dev/cu.usbmodem1303 - STM32 STLink".
[INFO   ] Listening for serial output.

tock$
```

## Customize your kernel

After connecting to Tock's terminal, you can run `help` to see the supported commands. One of them is `reset` and by running it, you can see the default *"welcome"* message.

```shell
tock$ reset
Initialization complete. Entering main loop
tock$
```

Personalize your kernel, by changing the hostname and the welcome message.

## Print Counter Capsule

For this task, you will need to build a capsule that prints a custom message each time it receives a print command from an application, along with a message counter representing the number of commands received. Remember that you will need to implement the `SyscallDriver` trait.

### The simple way

Simplest method to do this is to add a `counter` field in the capsule's structure. One issue you will most likely encounter is that the `command` method required by the `SyscallDriver` trait has a immutable reference to `&self`, so you may need to wrap the counter in a wrapper that allows for inner mutability, such as `Cell`.

### The Tock way

One issue with the previous approach is that the counter would be shared between the applications. This could be an issue for mutually distrustful application. Fortunately, Tock has a mechanism in place for such situations, called `Grant`s, which are per-process memory regions allocated by the kernel in a process memory region for a capsule to store that process’s state.

![Grant](assets/grant.png)

To access this region, you can simply add a new `grant` field in the capsule structure.

```rust title="capsules/extra/src/print_counter.rs"
use kernel::grant::{AllowRoCount, AllowRwCount, Grant, UpcallCount};

// TODO: Define `App` structure. Make sure to satisfy trait constraints.
struct App;

struct PrintCounter {
    grant: Grant<
        App,
        UpcallCount<0>,     // Number of upcalls supported by the capsule
        AllowRoCount<0>,    // Number of Read-Only buffers supported
        AllowRwCount<0>,    // Number of Read-Write buffers supported
    >,
}
```

As before, we will need to define a component for this capsule, to initialize it.

```rust title="boards/components/src/print_counter.rs"
#[macro_export]
macro_rules! print_counter_component_static {
    ($(,)?) => {{
        kernel::static_buf!(capsules_extra::print_counter::PrintCounter)
    };};
}

pub struct PrintCounterComponent;

impl Component for PrintCounterComponent {
    type StaticInput = &'static mut MaybeUninit<capsules_extra::print_counter::PrintCounter>;

    type Output = &'static capsules_extra::print_counter::PrintCounter;

    fn finalize(self, static_memory: Self::StaticInput) -> Self::Output {
        todo!()
    }
}
```

Grants are a sensitive component of the operating system, so the creation and management operations are considered unsafe, and require
privileges to perform. Tock restricts these privileged operations through the use of capabilities, which are tokens implementing `unsafe` traits. Because capsules are forbidden from using unsafe code, these tokens cannot be forged.

Creating a grant is requires a reference to the board's kernel, and a driver number, so we will need to add these parts in the components.

```rust title="boards/components/src/print_counter.rs"
pub struct PrintCounterComponent {
    driver_num: usize,
    board_kernel: &'static kernel::Kernel,
}

impl PrintCounterComponent {
    pub fn new(driver_num: usize, board_kernel: &'static kernel::Kernel) -> Self {
        Self {
            driver_num,
            board_kernel,
        }
    }
}
```

The capability needed for grant creating is called `MemoryAllocationCapability`, and it can be found in the `kernel::capabilities` module. The `kernel` also exposes the `crate_capability!` macro for ease of use.

```rust title="boards/components/src/print_counter.rs"
impl Component for PrintCounterComponent {
    // ...

    fn finalize(self, static_memory: Self::StaticInput) -> Self::Output {
        let grant_cap = create_capability!(capabilities::MemoryAllocationCapability);
        let grant = self.board_kernel.create_grant(self.driver_num, &grant_cap);

        static_memory.write(capsules_extra::print_counter::PrintCounter::new(grant))
    }
}
```

:::note `new` constructor
You will also need to implement the `new` constructor for the `PrintCounter` capsule.
:::

Next, you must implement the `SyscallDriver` trait, where the command logic will be. For the `allocate_grant` method implementation, it is enough to use the `enter` method of the Grant which takes a closure with two parameters.

```rust
fn allocate_grant(&self, process_id: kernel::ProcessId) -> Result<(), kernel::process::Error> {
    self.grant.enter(process_id, |_, _| {})
}
```

For the command logic, you must also use the `enter` API. The first parameter of the closure will be a mutable reference to a `GrantData` wrapper over the previously defined `App`. The wrapper is transparent, meaning it permits accessing fields of the generic type.

The next step is configuring the capsule in the board's main file. Remember you need to add the capsule in the `NucleoF429ZI` structure, the `SyscallDriverLookup` and initialize the printer counter capsule.
