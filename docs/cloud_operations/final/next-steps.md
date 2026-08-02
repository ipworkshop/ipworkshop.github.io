---
id: next-steps
title: Next Steps
description: Further learning resources and advanced topics
slug: /final/next-steps
sidebar_position: 2
---

# Next Steps

The course is over, but you're at the start of the path, not the end. Here is the map.

## Solidify what you learned

- [Docker's official docs](https://docs.docker.com/get-started/) - genuinely good; re-do the
  get-started track from memory
- [Play with Docker](https://labs.play-with-docker.com/) - free in-browser Docker playground
- Containerize something **you** already built - a school project, a bot, anything. The second
  Dockerfile you write teaches more than the first ten you copy.
- Redo the final project solo, from an empty folder, without looking at the old one. Painful and
  extremely effective.

## Go deeper on containers

- **Multi-stage builds & image slimming** - get your image under 100 MB, then under 50
- **Healthchecks and graceful shutdown** - what happens to in-flight requests when a container
  stops?
- **Docker networking internals** - what *is* a bridge? Follow a packet from your browser to a
  container
- **Security** - run as non-root, scan images (`docker scout`), read about container escapes
- **How containers actually work** - namespaces and cgroups; try
  [building a container from scratch in ~100 lines of code](https://github.com/p8952/bocker)

## The DevOps road

The skills around containers that make a career:

- **Git, properly** - branching, rebasing, pull-request workflows (you have the basics from the
  mini-workshops)
- **CI/CD** - [GitHub Actions](https://docs.github.com/en/actions): build → test → push image →
  deploy, automatically on every push
- **A real deployment** - rent the cheapest VPS you can find, deploy your project with Compose +
  Caddy + HTTPS, keep it alive for a month. You will learn more from this than from any tutorial.
- **Monitoring** - Grafana + Prometheus; you can't fix what you can't see
- **Infrastructure as Code** - Terraform / OpenTofu, Ansible
- **Kubernetes** - when you're ready, follow the ladder in the
  [Kubernetes chapter](../kubernetes/kubernetes-overview.md)
- The [DevOps roadmap](https://roadmap.sh/devops) - the whole landscape on one (intimidating,
  don't panic) page

## Stay in touch

Questions after camp? The IPW community doesn't close when the camp does - ask in the camp
Discord/group, or write to the instructors directly. We like getting "look what I deployed"
messages. 🚀
