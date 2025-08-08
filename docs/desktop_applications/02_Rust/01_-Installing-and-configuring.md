---
title: Installing and configuring
---

### Setting Up the Rust Development Environment

Alright, let's get your computer ready to write some Rust code\! The easiest and official way to install Rust is using `rustup`.

1.  **Open Your Terminal/Command Prompt:**

    - **Linux/macOS:** Open your regular terminal application.
    - **Windows:** Open PowerShell or Command Prompt. (If you're using VS Code, its integrated terminal works great\!)

2.  **Install `rustup`:**

    - **Linux/macOS:** Copy and paste this command into your terminal and press Enter. Follow the on-screen prompts (usually just pressing Enter for default options).
      ```bash
      curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
      ```
    - **Windows:**
      - Go to the official `rustup` download page: [https://rustup.rs/](https://rustup.rs/)
      - Download the appropriate installer for your system (e.g., `rustup-init.exe` for 64-bit Windows).
      - Run the installer and follow the instructions. Choose the default installation options.

3.  **Configure Your Shell (Important for Linux/macOS):**

    - After `rustup` finishes on Linux/macOS, it will often tell you to run a command to add Rust to your system's `PATH`. This is usually:
      ```bash
      source "$HOME/.cargo/env"
      ```
      - Run this command in your _current_ terminal session. To make it permanent, you might need to add it to your shell's configuration file (like `.bashrc`, `.zshrc`, or `.profile`).

4.  **Verify Installation:**

    - Close and reopen your terminal/command prompt (or run the `source` command).
    - Type these commands to check if Rust and Cargo (Rust's build tool, which comes with `rustup`) are installed correctly:
      ```bash
      rustc --version
      cargo --version
      ```
    - You should see version numbers printed for both `rustc` (the Rust compiler) and `cargo`. If you do, congratulations, Rust is installed\!

5.  **Install VS Code (Recommended IDE):**
    - If you don't have it already, download and install Visual Studio Code: [https://code.visualstudio.com/](https://code.visualstudio.com/)
6.  **Install the `Rust Analyzer` Extension:** This is crucial for a great Rust development experience in VS Code (code completion, error checking, formatting, etc.). Open VS Code, go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X), search for "Rust Analyzer", and install it.

7.  **Install the `Slint` Extension:** This is recommanded for a better development experience, featuring auto-complition, go-to definition, refactoring, syntax coloration, and a live preview and editing of Slint GUIs.
