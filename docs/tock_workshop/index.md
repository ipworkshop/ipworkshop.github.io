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

The simplest installation method involves using the `cargo` packet manager:

```shell
cargo install probe-rs-tools --locked
```

If you are using Linux, you will also need to add this [udev](https://probe.rs/files/69-probe-rs.rules) file in `/etc/udev/rules.d`. Then, run:

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

## Tock OS

TODO: add overview
