---
title: "From Zero to Blinky: Setup & Sanity Check"
---

## Get started with the board

The FRDM-MCXN947 board comes pre-programmed with an LED blinky demo. This built-in example serves as a quick sanity check to confirm that the board is functioning correctly right out of the box.

#### Let’s walk through the setup process step by step.

### Step 1: Plug in the board

Connect a USB Type-C cable from connector J17 on the FRDM-MCXN947 board to your host computer or a USB power supply. This will power up the board and automatically run the pre-programmed demo application.

#### What to expect:
The onboard RGB LED should start blinking at a steady rhythm. This indicates that the board is functioning correctly and the demo firmware is running as expected.

![board](../assets/image.png)

### Step 2: Get needed tools

To access the tools required for this project, you’ll need to create an NXP account. You can use either your personal or student email address. 

Create your account by [visiting this page](https://www.nxp.com/mynxp/home).

#### Get MCUXpresso IDE

Download the latest version of the MCUXpresso IDE from the [NXP website](https://www.nxp.com/design/design-center/software/development-software/mcuxpresso-software-and-tools-/mcuxpresso-integrated-development-environment-ide:MCUXpresso-IDE?&tid=vanMCUXPRESSO/IDE).
Make sure to select the installer that matches your operating system (Windows, Linux, or macOS).

<div align="center">
![ide_download](../assets/image-1.png)
</div>

<div align="center">
![ide_download](../assets/image-2.png)
</div>

<div align="center">
![ide_download](../assets/image-3.png)
</div>

Now let's dive into the installation process. 

Continue clicking "Next" until you reach the install window.
<div align="center">
![alt text](../assets/image-6.png)
</div>

In this step, you may be prompted to install additional drivers during the installation process, allow these to be installed. 
<div align="center">
![alt text](../assets/image-5.png)
</div>

<div align="center">
![alt text](../assets/image-7.png)
</div>

Now launch the MCUXpresso IDE and install the SDK. On the IDE Welcome page, click “Download and Install SDKs”.

<div align="center">
![alt text](../assets/image-9.png)
</div>

Search for “mcxn947” and click “install”. 

<div align="center">
![alt text](../assets/image-10.png)
</div>

#### Get MCUXpresso Config Tools

Next you will get the  [MCUXpresso Config Tools](https://www.nxp.com/design/design-center/software/development-software/mcuxpresso-software-and-tools-/mcuxpresso-config-tools-pins-clocks-and-peripherals:MCUXpresso-Config-Tools?tab=Design_Tools_Tab&ticket=ST-4323-Qmwtn3ubbT9FY0GemUx-wSxRs6U-nxp), which is suite of utilities that simplifies the configuration of pins, peripherals, and clocks for your project.

<div align="center">
![alt text](../assets/image-11.png)
</div>

Get the correct installation for the machine you are using. 

<div align="center">
![alt text](../assets/image-12.png)
</div>

Accept the "License Agreement" and press "Next" until you get to the installation window.

<div align="center">
![alt text](../assets/image-13.png)
</div>

Congratulations! You have successfully tested the board and installed the needed tools!

### Step 3: Dive into the LED blinky demo

First let's create a Workspace Folder. Launch workspace where you want to locate it. Keep in mind that workspace switching restarts IDE.

<div align="center">
![alt text](../assets/image-15.png)
</div>

Close the Welcome page and select "Import SDK example(s)...". Select the correct MCXN947 board and press "Next".

<div align="center">
![alt text](../assets/image-16.png)
</div>

Now from the Import Wizard, drop down on the demo_apps section and select the "led_blinky" application. Then press "Finish" and wait for the project to open.

<div align="center">
![alt text](../assets/image-17.png)
</div>

You can see what the project window is split into.

<div align="center">
![alt text](../assets/image-18.png)
</div>

Let's take a look at the code. The top part of the code contains the includes files present in the project tree and visible in the Project Explorer tab.

<div align="center">
![alt text](../assets/image-19.png)
</div>

The next section is the SysTick_Handler function that toggles the red LED on the board. 

<div align="center">
![alt text](../assets/image-20.png)
</div>

This function will be periodically called to switch ON and OFF the LED. Ctrl + click on the GPIO_PortToggle function opens the declaration present in fsl_gpio.h header file. 


<div align="center">
![alt text](../assets/image-21.png)
</div>

The main function starts by calling the initialization function. 

<div align="center">
![alt text](../assets/image-22.png)
</div>

The initialization function can be found in the hardware_init.c file.
<div align="center">
![alt text](../assets/image-23.png)
</div>

This function enables a clock and initializes the board pinds. Then the BOARD_BootClockFRO12M() sets the clock frequency to 12 MHz. SysTick_Config(12000000UL) sets a counter with a value of 12.000.000 that makes the LED blink once per second. More on timers will be covered later.
Changing the counter value will increase/decrease the blinking frequency but note that it needs to be slow enough for the human eye to notice it.
LED_RED_INIT(LOGIC_LED_OFF) calls GPIO_PinWrite() that changes the output of the GPIO (in this case to the OFF state).

<div align="center">
![alt text](../assets/image-24.png)
</div>

Now let's divo into how to build and download the code on your board.

In order to build a project, have it selected and then either click on the "build icon" in the shortcuts provided above or by clicking "Build" in the Quickstart Panel.

<div align="center">
![alt text](../assets/image-25.png)
</div>

The project should finish the build without any errors or warnings in the console.

<div align="center">
![alt text](../assets/image-26.png)
</div>

For the download step, make sure your board is connected to the computer through the J17 'MCU-LINK' port.

<div align="center">
![alt text](../assets/image-28.png)
</div>

Download the application to your board by either cliking on the "debug" icon above or clicking "Debug" in the Quickstart Panel.

<div align="center">
![alt text](../assets/image-27.png)
</div>

In the next window, select the MCU-LINK CMSIS-DAP debug probe.

<div align="center">
![alt text](../assets/image-29.png)
</div>

To run the application, press the "run" icon. 

<div align="center">
![alt text](../assets/image-30.png)
</div>