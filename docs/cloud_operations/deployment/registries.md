---
id: registries
title: Registries and Docker Hub
description: Publishing and sharing your container images
slug: /deployment/registries
sidebar_position: 1
---

# Registries and Docker Hub

## Why do we need a registry?

So far, every image you have built lives only on **your** laptop. That's a problem:

- Your teammate can't run your container without rebuilding it from scratch.
- A server in the cloud can't run your container at all.
- If your laptop dies, your images die with it.

A **container registry** solves this: it is a server that stores and distributes container images -
think "GitHub, but for images". You **push** your image to the registry, and anyone (with
permission) can **pull** and run it, anywhere.

You have already used a registry without knowing it! Every time you did
`docker run ubuntu:24.04` and saw `Pulling from library/ubuntu`, Docker was pulling the image from
[Docker Hub](https://hub.docker.com/), the default public registry.

Other popular registries you will meet in the wild:

- **GitHub Container Registry (GHCR)** - images live next to your code on GitHub
- **GitLab Container Registry**
- Cloud provider registries: AWS ECR, Google Artifact Registry, Azure ACR
- Self-hosted private registries (companies often run their own)

## Image names, explained properly

Now that registries are in the picture, the full anatomy of an image name makes sense:

```text
registry.example.com/username/repository:tag
└──────┬───────────┘ └──┬───┘ └───┬────┘ └┬─┘
   registry host      owner    image name  version
```

- If you omit the registry host, Docker assumes **Docker Hub**.
- If you omit the tag, Docker assumes **`latest`**.
- Official images like `ubuntu` or `postgres` are shorthand for `library/ubuntu`,
  `library/postgres`.

So `docker run ubuntu:24.04` really means
`docker run docker.io/library/ubuntu:24.04`.

:::warning

`latest` is just a tag name, **not** a guarantee that you get the newest version - it is simply the
default tag that gets overwritten on push. In real projects, always use explicit version tags
(`myapp:1.2.0`), so you know exactly what is running where.

:::

## Pushing your first image

1. Log in with the Docker Hub account you created during setup:

   ```bash
   docker login
   ```

2. Your image must be named `<your-dockerhub-username>/<image-name>:<tag>`. You can either build it
   with that name directly, or rename an existing image with `docker tag`:

   ```bash
   docker tag my-container adrianp121/my-container:1.0
   ```

   :::info

   `docker tag` does not copy anything - it just adds another name pointing to the same image.
   Check with `docker image ls`: both names have the same **IMAGE ID**.

   :::

3. Push it:

   ```bash
   docker push adrianp121/my-container:1.0
   ```

4. Visit `https://hub.docker.com/r/<your-username>/<image-name>` - your image is now public. Anyone
   in the world can run it:

   ```bash
   docker run adrianp121/my-container:1.0
   ```

:::tip

Notice the `Pushed`/`Layer already exists` lines during a push. Docker pushes **layers**, not whole
images - if your base image layers already exist in the registry, only your changes are uploaded.
This is the image layering from the Dockerfile chapter paying off.

:::

## Exercise: swap containers with a colleague

1. Build an image that prints a message of your choice when run (you know how to do this since the
   Dockerfile chapter - `CMD` is your friend).
2. Tag it as `<your-username>/greeting:1.0` and push it to Docker Hub.
3. Ask the person next to you for their username, then pull and run **their** image:

   ```bash
   docker run <their-username>/greeting:1.0
   ```

4. Discuss: you just ran a program built on someone else's machine, with zero setup, no "install
   these dependencies first". That is the whole point of containers.

:::warning

Everything you push to a **public** repository is visible to the entire internet. Never bake
passwords, API keys or other secrets into an image - more on this in the next chapter.

:::
