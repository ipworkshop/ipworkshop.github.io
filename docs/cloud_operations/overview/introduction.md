---
id: overview-introduction
title: Introduction
description: General Overview of the Course
slug: /overview/introduction
sidebar_position: 1
---

# Introduction

## Course Overview

### Course tutors

- Paris Cristian-Tănase (Cristi)
- Popescu Adrian (Adi)
- Cosma George (George)

### Course structure

1. **Day 1 (Mon)** - Why containers? Containers vs virtual machines, local setup, running your
   first containers
1. **Day 2 (Tue)** - The container lifecycle, building your own images with a `Dockerfile`
1. **Day 3 (Wed)** - Container networking, persisting data with volumes, multi-container apps
   with Docker Compose
1. **Day 4 (Fri)** - Shipping your app: registries, configuration and secrets, real-world
   deployments, and orchestration with Docker Swarm
1. **Day 5 (Sat)** - A concept tour of Kubernetes, and the kickoff of your **final project**
1. **Project days (Mon–Tue)** - You and your team build and ship your own containerized app,
   presented at the Projects Display

Alongside the course slots there are **workshop slots** (Wednesday and Saturday evening) where you
solve the hands-on exercises with us in the room. During the mini-workshop slots (Intro to Git,
GitHub) you can choose: attend those, or catch up on the course exercises - both are good choices,
and Git/GitHub skills will directly help you on the final project.

## What is this course about?

The goal of this course is to teach you about **containers**: how to build them, how to connect
them, and how to ship an application into the world with them. By the end of the course, you will
take an application from "it works on my machine" to a reproducible, multi-container setup that you
can deploy, scale and update - and you will understand what tools like **Docker Swarm** and
**Kubernetes** do, and why the industry uses them.

<div style={{textAlign: 'justify'}}>

In brief, containerization is packaging an application and its dependencies into a standardized
unit, known as a container. This container can then be easily moved between environments, ensuring
consistency and reliability across different systems.

We care about containerization because it allows developers to build, test, and deploy applications
more efficiently. By isolating applications within containers, we can avoid conflicts between
dependencies and ensure that the application runs consistently regardless of the underlying
infrastructure.

Orchestration is managing and coordinating multiple containers, possibly across multiple machines.
This includes tasks such as scaling containers up or down, load balancing traffic between
containers, and ensuring high availability of the application. In this course you will get hands-on
experience with Docker's built-in orchestrator, **Swarm**, and a guided tour of **Kubernetes**, the
industry-standard orchestration platform.

By the end of this course, you will have the skills and knowledge needed to containerize an
application and run it anywhere - your laptop, a friend's laptop, or a server in the cloud.

</div>

## Setup instructions for required tools

You need the following to take part in the course:

1. **Docker** - on Windows and macOS install
   [Docker Desktop](https://docs.docker.com/desktop/); on Linux install
   [Docker Engine](https://docs.docker.com/engine/install/). Docker Compose is included in both.
1. **WSL2** (Windows only) - Docker Desktop needs it. Follow the
   [install instructions](https://learn.microsoft.com/en-us/windows/wsl/install).
1. **A code editor** - [VS Code](https://code.visualstudio.com/) recommended.
1. **A free [Docker Hub](https://hub.docker.com/) account** - we will use it to publish images.
   Verify your email address, and run `docker login` once Docker is installed.
1. **A [GitHub](https://github.com/) account** - needed for the final project (and for the Git and
   GitHub mini-workshops).
1. **Pre-pull the course images** - once Docker works, download the images we will use during the
   week, so a slow camp connection doesn't hold you back mid-exercise:

   ```bash
   docker pull ubuntu:24.04
   docker pull alpine
   docker pull nginx:1.27
   docker pull nginx:1.29
   docker pull node:22-alpine
   docker pull mariadb:11
   docker pull python:3.13-alpine
   ```

   :::note

   Docker Hub is not the only registry in town. If it is slow or complains about rate limits
   (`toomanyrequests`), the same official images are mirrored on other public registries - pull
   from there and retag:

   ```bash
   # AWS public mirror of the Docker official images:
   docker pull public.ecr.aws/docker/library/ubuntu:24.04
   docker tag public.ecr.aws/docker/library/ubuntu:24.04 ubuntu:24.04

   # Google's mirror of popular images:
   docker pull mirror.gcr.io/library/ubuntu:24.04
   docker tag mirror.gcr.io/library/ubuntu:24.04 ubuntu:24.04
   ```

   After the `docker tag`, the image behaves exactly as if it came from Docker Hub - more on why
   in the [Registries chapter](../deployment/registries.md).

   :::

:::tip

Install everything **on day one** - setup problems are normal (especially WSL2 and BIOS
virtualization settings on Windows) and we have dedicated time on Monday to fix them together.
Don't struggle alone: ask!

:::
