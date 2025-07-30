# Introduction

## Prerequisites

### Rust Toolchain

You will need to install the Rust toolchain. To do so, you can follow the instructions on the [Getting started](https://www.rust-lang.org/learn/get-started) page of the Rust Language website.

:::info Windows Install Tips
If you are using Windows, you may be prompted to install [Visual Studio C++ Build tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/). If so, follow the instructions from the previous link.

Even if Visual Studio is already on your machine, rustup will not verify if the required components are present. If you experience issues with the `rustup` installation on Windows, please follow [these instructions](https://rust-lang.github.io/rustup/installation/windows-msvc.html) to manually add the missing components.
:::

To verify that the installation, open a terminal and run `rustup --version`. If everything went well, you should see an output similar to this:

```shell
rustup 1.28.1 (f9edccde0 2025-03-05)
info: This is the version for the rustup toolchain manager, not the rustc compiler.
info: The currently active `rustc` version is `rustc 1.86.0 (05f9846f8 2025-03-31)`
```

### `probe-rs` install

This tool is an embedded debugging and target interaction toolkit. It enables its user to program and debug microcontrollers via a debug probe.

The simplest installation method involves using the `cargo` packet manager, but first you have to install the prerequisites:

* On Debian-based Linux, use the following command:

```shell
sudo apt install -y pkg-config libudev-dev cmake git
```

* On Mac OS and Windows, no additional setup is needed.

After that, use `cargo` to install `probe-rs`:

```shell
cargo install probe-rs-tools --locked
```

If you are using Linux, you will also need to add this [udev](https://probe.rs/files/69-probe-rs.rules) file in `/etc/udev/rules.d`. Then, run as root:

```shell
udevadm control --reload # to ensure the new rules are used.
udevadm trigger # to ensure the new rules are applied to already added devices.
```

### `arm-none-eabi` toolchain

You will need to install the ARM toolchain in order to compile applications written in C. You can find the pre-built binary archives on the ARM [Downloads Page](https://developer.arm.com/downloads/-/gnu-rm). Alternatively, if you are on Linux, you can install it by running the following command in terminal:

```shell
sudo apt install gcc-arm-none-eabi
```

### `tockloader`

The `tockloader` tool is a useful and versatile tool for managing and installing applications on Tock. In order to install it, you will need to have Python installed. You can download the latest version of on the [official website](https://www.python.org/downloads/). You will also need to install `pipx`, following the [installation guide](https://pipx.pypa.io/stable/installation/). Then you can install it by running:

```shell
pipx install tockloader
pipx ensurepath
```

## CY8CPROTO-062-4343W board

TODO: add board description and features

## Tock

Tock is an open-source embedded operating system for microcontrollers written in Rust. The operating system is designed to isolate components so untrusted third-party applications can run in a protected environment. Tock supports multiple platforms, such as RISC-V, Cortex-M or X86.

### Architecture

Tock uses a microkernel architecture: complex drivers and services are often implemented as untrusted processes, which other processes, such as applications, can invoke through inter-process communication (IPC).
Tock supports running multiple, independent applications written in any compiled language.

![Tock stack](https://book.tockos.org/imgs/tock-stack.png)

The above Figure shows Tock's architecture. Code falls into one of three categories: the **core kernel**, **capsules**, and **processes**.

The core kernel and capsules are both written in Rust. Rust is a type-safe systems language; other documents discuss the language and its implications to kernel design in greater detail, but the key idea is that Rust code can't use memory differently than intended (e.g., overflow buffers, forge pointers, or have pointers to dead stack frames). Because these restrictions prevent many things that an OS kernel has to do (such as access a peripheral that exists at a memory address specified in a datasheet), the very small core kernel is allowed to break them by using *"unsafe"* Rust code. Capsules, however, cannot use unsafe features. This means that the core kernel code is very small and carefully written, while new capsules added to the kernel are safe code and so do not have to be trusted.

Processes can be written in any language. The kernel protects itself and other processes from bad process code by using a hardware memory protection unit (MPU). If a process tries to access memory it's not allowed to, this triggers an exception. The kernel handles this exception and kills the process.

The kernel provides four major system calls:

* `command`: makes a call from the process into the kernel
* `subscribe`: registers a callback in the process for an upcall from the kernel
* `allow`: gives kernel access to memory in the process
* `yield`: suspends process until after a callback is invoked

Every system call except yield is non-blocking. Commands that might take a long time (such as sending a message over a UART) return immediately and issue a callback when they complete. The yield system call blocks the process until a callback is invoked; userland code typically implements blocking functions by invoking a command and then using yield to wait until the callback completes.

The command, subscribe, and allow system calls all take a driver ID as their first parameter. This indicates which driver in the kernel that system call is intended for. Drivers are capsules that implement the system call.

## Hands-on Workshop

### Flashing the kernel

Initially, you will need to clone the Tock [repository](https://example.com). The configuration for the various boards supported can be found in the `boards` directory. To compile the kernel, you can use the `cargo flash` utility.

```shell
cd boards/cy8cproto_62_4343_w
cargo flash
```

Alternatively, you can use the `make flash` while inside the board's directory.

If you did everything correctly, you should be able to use the `tockloader listen` command to interact with the kernel. When prompted to select a serial port, pick the one that ends with `KitProg3 CMSIS-DAP`.

```shell
tockloader listen
[INFO   ] No device name specified. Using default name "tock".
[INFO   ] No serial port with device name "tock" found.
[INFO   ] Found 2 serial ports.
Multiple serial port options found. Which would you like to use?
[0]     /dev/cu.debug-console - n/a
[1]     /dev/cu.usbmodem1103 - KitProg3 CMSIS-DAP

Which option? [0] 1
[INFO   ] Using "/dev/cu.usbmodem1103 - KitProg3 CMSIS-DAP".
[INFO   ] Listening for serial output

$tock
```

### Compiling an application

For this task, you will have to clone the [`libtock-c`](https://example.com) repository first. Navigate to the `examples/blink` folder and take a look at the C application structure found in `main.c`. To compile the application, simply run `make`. This command will built the example applications for all target architectures supported by the library. Apps are compiled into TBFs (Tock Binary Format), and can be found in the `build/<arch>` sub-directories. Tock also generates an archive of the same app, compiled for multiple architectures, for ease of use and portability, called a TAB(Tock Application Bundle) which can be loaded using the `tockloader` utility.

### Flashing the application

Unfortunately, the board is not currently supported by the `tockloader` project, so we will have to resort to bundling the kernel and application in a single binary and flashing it. The board you are using is a dual-core, with Tock running on the **CortexM0+** core, so the correct TBF can be found at `examples/blink/build/cortex-m0/cortex-m0.tbf`. You will need to specify the path to the compiled application in the board's `Makefile`.

```Makefile
APP=../../libtock-c/examples/sensors/build/cortex-m0/cortex-m0.tbf
```

Then, run the `make program` command in terminal. It will use the `arm-none-eabi-objcopy` to merge the two binaries, and load it on the board. After the binary is flashed, you should see the on board LED blinking, and you should be able to see `blink` in the apps list, using `tockloader listen`.

```sh
tockloader listen
[INFO   ] No device name specified. Using default name "tock".
[INFO   ] No serial port with device name "tock" found.
[INFO   ] Found 2 serial ports.
Multiple serial port options found. Which would you like to use?
[0]     /dev/cu.debug-console - n/a
[1]     /dev/cu.usbmodem1103 - KitProg3 CMSIS-DAP

Which option? [0] 1
[INFO   ] Using "/dev/cu.usbmodem1103 - KitProg3 CMSIS-DAP".
[INFO   ] Listening for serial output

$tock list
 PID    ShortID    Name                Quanta  Syscalls  Restarts  Grants  State
 0      Unique     blink                    0        84         0   1/ 8   Yielded
```

### Building a capsule

A capsule is a kernel component acting as a device driver, or system service capsule. Capsules sit between the low-level drivers of the core kernel and use the HIL traits to interact with them, and the userspace applications, which utilizes its `SyscallDriver` interface. For this task, we will build a `MockCapsule`, that will print a debug message on application command.

The first step is to define the `MockCapsule` driver, and implement the `SyscallDriver`. You can create a new module in the `capsules/extra` crate named `mock.rs`. We also will need to chose an unused driver number to use (`0x9000A` will work).

```Rust title="capsule/extra/mock.rs"
use kernel::{
    syscall::{CommandReturn, SyscallDriver},
    ErrorCode,
};

const DRIVER_NUM: usize = 0x9000A;

struct MockCapsule;

impl SyscallDriver for MockCapsule {
    fn command(
        &self,
        command_num: usize,
        _: usize,
        _: usize,
        _process_id: kernel::ProcessId,
    ) -> kernel::syscall::CommandReturn {
        match command_num {
            _ => CommandReturn::failure(ErrorCode::NOSUPPORT),
        }
    }

    fn allocate_grant(&self, _process_id: kernel::ProcessId) -> Result<(), kernel::process::Error> {
        // No-op implementation
        Ok(())
    }
}
```

:::note Module definition
Do not forget to add `pub mod mock;` in `capsules/extra/src/lib.rs`.
:::

The next step is to implement the handling of specific commands. The convention is that the first command (`0`) to be an *"exists"* command, that is usually used to check wether a driver is present or not in the board configuration, and it should simply return a `CommandReturn::success()`.

We also need to add our print command, on command number `1`. For serial debug printing, the kernel exposes two macros, `kernel::debug!` and `kernel::debug_verbose!`. Try to use both of them and spot the difference.

With our capsule implementation done, we need to add it to the board's configuration. We need to add a field for the capsule in the board's `Cy8cproto0624343w` structure.

```rust title="boards/cy8cproto_62_4343_w/main.rs"
/// Supported drivers by the platform
pub struct Cy8cproto0624343w {
    // ... Previous lines removed for simplicity
    systick: cortexm0p::systick::SysTick,
    // highlight-next-line
    mock_capsule: &'static capsules_extra::mock::MockCapsule,
}

impl SyscallDriverLookup for Cy8cproto0624343w {
    fn with_driver<F, R>(&self, driver_num: usize, f: F) -> R
    where
        F: FnOnce(Option<&dyn kernel::syscall::SyscallDriver>) -> R,
    {
        match driver_num {
            // ...
            capsules_core::gpio::DRIVER_NUM => f(Some(self.gpio)),
            // highlight-next-line
            capsules_extra::mock::DRIVER_NUM => f(Some(self.mock_capsule)),
            _ => f(None),
        }
    }
}

// ...

pub unsafe fn main() {
    // ...

    let cy8cproto0624343w = Cy8cproto0624343w {
        // ...
        gpio,
        // Currently, the CPU runs at 8MHz, that being the frequency of the IMO.
        systick: cortexm0p::systick::SysTick::new_with_calibration(8_000_000),
        // highlight-next-line
        mock_capsule: &capsules_extra::mock::MockCapsule,
    };

    // ...
}
```

### Writing an application

To test the capsule we just created, we will need an application. This app will check if the driver is present in the kernel configuration, then it will issue a *"print"* command to the driver every second.

The simplest way to do this is to create a new entry in the `examples` directory, then import the `Makefile` from the `blink` example. We will also need to create an API for issuing commands to the capsule. This is usually done in a separate `.c` file, and further exposed in a header file to be used by application developers, but for the task at hand, defining them in `main.c` will work.

```c title="examples/ws-mock-test/main.c"
#include <libtock/tock.h>

#define MOCK_DRIVER_NUM 0x9000A
#define MOCK_EXIST 0x0
#define MOCK_PRINT 0x1

int check_mock_driver_exists(void);
int mock_print(void);

int check_mock_driver_exists(void) {
  syscall_return_t ret = command(MOCK_DRIVER_NUM, MOCK_EXIST, 0, 0);
  return tock_command_return_novalue_to_returncode(ret);
}

int mock_print(void) {
  syscall_return_t ret = command(MOCK_DRIVER_NUM, MOCK_PRINT, 0, 0);
  return tock_command_return_novalue_to_returncode(ret);
}

int main(void) {
}
```

:::note `tock.h` API
The `syscall_return_t` type is the representation of the `CommandReturn` type seen in kernel. Tock supports returning either a success or error response to system calls, along with a payload of up to two `u32`s in size. The developer must be aware of the return type used by a respective command of a driver to correctly decode the response message. In our case, both commands used return no payload so the `tock_command_return_novalue_to_returncode`.
:::

Now, we need to complete the implementation of the main function.

```c title="example/ws-mock-test/main.c"
#include <libtock/tock.h>

#include <libtock-sync/services/alarm.h>

// Headers for `printf`
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

// ... 

int main(void) {
  printf("Mock capsule test\n");

  int err = check_mock_driver_exists();
  if (err < 0) {
    printf("Mock capsule missing");
    return err;
  }

  while (true) {
    mock_print();
    // This delay uses an underlying alarm in the kernel.
    libtocksync_alarm_delay_ms(1000);
  }
}
```
