---
id: production
title: Configuration, Secrets and Real Deployments
description: Environment variables, secrets, and what a real-world deployment looks like
slug: /deployment/production
sidebar_position: 2
---

# Configuration, Secrets and Real Deployments

## One image, many environments

You have an image on a registry. The same image will now run in different places: on your laptop
while developing, on a test server, in production. Each place needs **different settings**:

- a different database address
- a different password
- debug logging on your laptop, quiet logging in production

The golden rule: **the image stays the same, the configuration changes.** If you rebuild your image
just to change a database address, you are doing it wrong.

The standard mechanism for this is one you already know: **environment variables**.

## Environment variables with Compose

You have already set environment variables in a compose file directly:

```yaml
services:
  api:
    image: adrianp121/my-api:1.0
    environment:
      DATABASE_HOST: postgres
      LOG_LEVEL: debug
```

But hardcoding values in the compose file has the same problem as hardcoding them in the image -
the file is committed to Git, and everyone gets the same values. Compose supports a better way:
**`.env` files**.

```yaml
# compose.yaml - committed to Git
services:
  api:
    image: adrianp121/my-api:1.0
    environment:
      DATABASE_HOST: ${DATABASE_HOST}
      DATABASE_PASSWORD: ${DATABASE_PASSWORD}
```

```bash
# .env - NOT committed to Git (add it to .gitignore!)
DATABASE_HOST=postgres
DATABASE_PASSWORD=hunter2
```

Docker Compose automatically reads a file called `.env` next to the compose file and substitutes
the `${...}` placeholders. Each environment (your laptop, the server) has its **own** `.env` file
with its own values, while the compose file itself is identical everywhere.

:::tip

Commit a `.env.example` file with the variable **names** but fake values, so your teammates know
what they need to fill in:

```bash
DATABASE_HOST=localhost
DATABASE_PASSWORD=changeme
```

:::

## Secrets: the don'ts

A **secret** is any value that would cause damage if it leaked: database passwords, API keys,
tokens, private certificates. The rules:

1. **Never** put secrets in a `Dockerfile` (`ENV DB_PASSWORD=...`) - they are baked into the image
   forever, and `docker image inspect` shows them to anyone who has the image.
2. **Never** commit secrets to Git - `git log` remembers everything, even after you delete the
   file. Bots scan public GitHub for leaked keys within **seconds** of a push.
3. Keep secrets in `.env` files (gitignored), or better, in a dedicated secrets mechanism - Docker
   Compose and Swarm have [secrets](https://docs.docker.com/compose/use-secrets/) support, which
   mounts them as in-memory files instead of environment variables.

:::warning

If you ever accidentally push a secret to a public repository, consider it **compromised** -
rotate it (change the password / revoke the key) immediately. Deleting the commit is not enough.

:::

## Keeping containers alive: restart policies

On a server, nobody is around to restart a crashed container at 3 AM. Docker can do it for you:

```yaml
services:
  api:
    image: adrianp121/my-api:1.0
    restart: unless-stopped
```

| Policy | Meaning |
|---|---|
| `no` | Never restart (default) |
| `on-failure` | Restart only if the container exits with an error |
| `always` | Always restart, even after a reboot of the Docker daemon |
| `unless-stopped` | Like `always`, unless you explicitly stopped it |

`unless-stopped` is the sane default for services that should "just keep running".

## What a real deployment looks like

Here is the anatomy of a typical small-scale, real-world deployment - no Kubernetes, no magic.
This setup powers a huge portion of the internet's small and medium applications:

```text
                        ┌─────────────────────────── VPS (cloud server) ──┐
                        │                                                 │
   Internet ──HTTPS──►  │  Reverse proxy          ┌────────────┐          │
   (users)      :443    │  (Caddy / NGINX / ...)──►  frontend  │          │
                        │        │                └────────────┘          │
                        │        │                ┌────────────┐          │
                        │        └────/api───────►│  backend   │          │
                        │                         └─────┬──────┘          │
                        │                         ┌─────▼──────┐          │
                        │                         │  database  │◄─ volume │
                        │                         └────────────┘          │
                        └─────────────────────────────────────────────────┘
```

The ingredients - all things you already know:

1. **A VPS** (Virtual Private Server) - a rented Linux machine in a datacenter, from a few euros
   per month (Hetzner, DigitalOcean, OVH...). You get an IP address and SSH access.
2. **Docker + Compose installed on it** - the same commands you use locally.
3. **Your compose file + `.env`** copied to the server, then `docker compose up -d`. Your images
   are pulled **from the registry** - this is why we pushed them.
4. **A reverse proxy** - the only container that exposes ports to the internet (80/443). It
   receives all incoming traffic and forwards each request to the right container over the
   internal Docker network. Popular choices: [NGINX](https://nginx.org/),
   [Caddy](https://caddyserver.com/), [Traefik](https://traefik.io/).
5. **HTTPS** - the reverse proxy also handles TLS certificates. Certificates are free via
   [Let's Encrypt](https://letsencrypt.org/); Caddy and Traefik obtain and renew them
   automatically.

Why a reverse proxy instead of exposing containers directly?

- **One entry point**: only ports 80/443 are open to the world; everything else stays on the
  private Docker network.
- **Routing**: `myapp.com` → frontend container, `myapp.com/api` → backend container - one server,
  many services.
- **HTTPS in one place**: your app containers don't need to know anything about certificates.

:::info

The instructors will demo a live deployment to a real VPS during the course - watch closely, and
ask questions. For the final project, running your stack with Compose on your laptop is enough; a
real deployment is bonus material.

:::

## Debugging on a server: logs

When something breaks on a machine with no screen attached, logs are your eyes:

```bash
docker compose logs            # logs from all services
docker compose logs backend    # logs from one service
docker compose logs -f backend # follow live (Ctrl+C to stop)
docker compose logs --tail 50  # last 50 lines
```

Get into the habit **now**: when a container "doesn't work", the first command you type is `logs`.

## Exercise: production-grade compose file

Take the multi-container stack you built in the Docker Compose chapter and upgrade it:

1. Move every configurable value (ports, passwords, database name) into a `.env` file, referenced
   with `${...}` from the compose file.
2. Create a `.env.example` and a `.gitignore` that excludes `.env`.
3. Add `restart: unless-stopped` to every service.
4. Replace any `build:` with `image:` entries pointing to images **you pushed to Docker Hub** in
   the previous chapter.
5. Prove it works: `docker compose down -v && docker compose up -d`, then check
   `docker compose logs`.
6. **Bonus**: add a [Caddy](https://hub.docker.com/_/caddy) container in front of your app that
   forwards requests to your frontend. Ask the instructors for a starter `Caddyfile`.
