---
id: orchestration
title: Why Orchestration?
description: The problems that appear when one machine is not enough
slug: /swarm/orchestration
sidebar_position: 1
---

# Why Orchestration?

## The 3 AM problem

Your app is deployed with Docker Compose on a VPS. Life is good. Then:

- Your app goes viral. One server can't handle the traffic anymore. You rent a second server -
  but Compose only manages containers on **one** machine. Who decides which containers run where?
- A container crashes at 3 AM. `restart: unless-stopped` handles that. But what if the **whole
  server** dies at 3 AM?
- You release version 2.0. You `docker compose down && docker compose up`, and your app is offline
  for 30 seconds. With real users, that's 30 seconds of lost sales and angry messages. Worse: 2.0
  has a bug - now you scramble to roll back by hand, at 3 AM, with users watching.

These are the problems of running containers **at scale**, and solving them by hand doesn't work -
humans need sleep. The tool category that solves them is called a **container orchestrator**.

## What an orchestrator does

An orchestrator is a program that manages containers **across a group of machines** (a
**cluster**). You tell it *what* you want; it figures out *how*, continuously:

| Job | Meaning |
|---|---|
| **Scheduling** | Decides which machine runs each container |
| **Self-healing** | Container dies? Machine dies? Replacements are started automatically |
| **Scaling** | "I want 10 copies of the backend" → it makes it so |
| **Load balancing** | Spreads incoming requests across all copies |
| **Rolling updates** | Upgrades containers a few at a time, so the app never goes fully down |
| **Cross-machine networking** | Containers on different machines talk as if on one network |

## Desired state: the key mental model

This is the one idea to take away from this chapter - everything else follows from it.

With `docker run`, you give Docker **commands** ("start this container"). An orchestrator works
differently: you declare a **desired state**, and the orchestrator runs a continuous loop
comparing it with reality:

```text
you: "I want 5 replicas of my-api:2.0 running"
                    │
                    ▼
       ┌─────────────────────────┐
       │  desired:  5 replicas   │
       │  actual:   ? replicas   │◄────── watches the cluster, forever
       └───────────┬─────────────┘
                   │ actual ≠ desired?
                   ▼
        start/stop containers until they match
```

A container crashes → actual becomes 4 → orchestrator starts one more. A machine disappears →
actual drops to 3 → two new containers get scheduled on the surviving machines. **You didn't do
anything.** You already saw a tiny version of this idea in `restart: unless-stopped`; an
orchestrator applies it to everything, cluster-wide.

## The orchestrators you will meet

- **[Docker Swarm](https://docs.docker.com/engine/swarm/)** - built into Docker itself. Zero extra
  installation, uses compose files you already know. Great for learning and for small-to-medium
  real deployments. **This is what we use hands-on, next chapter.**
- **[Kubernetes](https://kubernetes.io/)** (a.k.a. **K8s**) - the industry standard. Enormously
  powerful and enormously complex. Cloud providers sell it as a managed service (Google GKE, AWS
  EKS, Azure AKS). We take a guided concept tour of it in the
  [next section](../kubernetes/kubernetes-overview.md).
- **[HashiCorp Nomad](https://www.nomadproject.io/)** - a simpler alternative, respected but niche.
- **Managed container platforms** (AWS ECS/Fargate, Google Cloud Run, Fly.io, Railway...) - "give
  us an image, we run it"; orchestration exists but is hidden from you.

:::info

Honest engineering note: most small apps **never need an orchestrator** - one server with Compose,
a reverse proxy and backups takes you astonishingly far. Learn orchestration to understand how
large systems work and to have it in your toolbox - not because every project needs it. Choosing
*not* to use a tool is also an engineering decision.

:::
