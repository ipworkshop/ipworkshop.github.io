---
id: swarm-cluster
title: "The Classroom Cluster"
description: Building one big Swarm out of everyone's laptops
slug: /swarm/cluster
sidebar_position: 3
---

# The Classroom Cluster 🐝

Everything so far ran on a "cluster" of one laptop. Time to fix that: we are going to join
**everyone's laptops into one big Swarm** and watch containers land on machines across the room.

:::info

This is a guided, all-together activity - the instructors drive, you follow. Networking between
laptops on shared Wi-Fi can be moody; if the full-room cluster fails, we fall back to clusters of
3–4 laptops per table. The concepts are identical.

:::

## How joining works

One machine (an instructor's) plays **manager**. It runs `docker swarm init` and gets back a
**join token** - a secret that lets other machines enter the cluster:

```bash
instructor@manager:~$ docker swarm init
Swarm initialized: current node (dxn1...) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-49nj...-8vxv... 172.16.4.20:2377
```

Everyone else runs that join command (the instructor will share it):

```bash
you@laptop:~$ docker swarm join --token SWMTKN-1-49nj...-8vxv... 172.16.4.20:2377
This node joined a swarm as a worker.
```

That's it - your laptop is now cluster hardware. 🎉 On the manager, the roster grows:

```bash
instructor@manager:~$ docker node ls
ID            HOSTNAME          STATUS   AVAILABILITY  MANAGER STATUS
dxn1zf6l61 *  manager           Ready    Active        Leader
7dyv2kppkg    laptop-ana        Ready    Active
b2qs9xj0e1    laptop-mihai      Ready    Active
x83k1pomz4    laptop-ioana      Ready    Active
...
```

:::warning

If you are on Windows/macOS, Docker runs inside a VM, and joining an external cluster requires the
right ports to be reachable: **2377/tcp** (cluster management), **7946/tcp+udp** (node
communication), **4789/udp** (overlay network traffic). Firewalls and client isolation on the
Wi-Fi access point are the usual killers - this is exactly the kind of messy real-world networking
that DevOps people fight daily. If your laptop refuses to join, pair up with a neighbor and watch
on theirs; we'll debug the stubborn ones at the end.

:::

## Seeing the cluster: the visualizer

The instructor deploys [a small web app](https://github.com/dockersamples/docker-swarm-visualizer)
that draws every node and every container in the cluster, live:

```bash
instructor@manager:~$ docker service create \
    --name viz \
    --publish 8081:8080 \
    --constraint node.role==manager \
    --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock \
    dockersamples/visualizer
```

Open `http://<manager-ip>:8081` on your own laptop - you should see the whole room as boxes, your
laptop among them.

(`--constraint node.role==manager` is a **placement constraint** - it pins the container to
specific nodes. The visualizer needs the manager's Docker socket, so it must run there.)

## The moment of truth

The instructor creates a service... and cranks it up:

```bash
instructor@manager:~$ docker service create --name hello -p 8082:80 nginx:1.27
instructor@manager:~$ docker service scale hello=30
```

Watch the visualizer: 30 nginx containers **rain across the room's laptops**. The Swarm scheduler
spreads them over the nodes; your machine is probably running a few right now - check!

```bash
you@laptop:~$ docker ps
CONTAINER ID   IMAGE        COMMAND                  STATUS         NAMES
f00d15c0ffee   nginx:1.27   "/docker-entrypoint.…"   Up 2 minutes   hello.17.xk2...
```

Now open `http://<manager-ip>:8082`. The routing mesh means **every** node answers on port 8082 -
try `http://<your-neighbors-ip>:8082` too. Requests get load-balanced to some replica somewhere in
the room.

## Chaos engineering, camp edition

The fun part - let's hurt the cluster and watch it heal:

1. **A volunteer closes their laptop lid.** Watch the visualizer: their node goes down, and within
   seconds every container it was running reappears on other laptops. Desired state: 30. Reality:
   restored.
2. **Graceful exit** - before leaving a cluster politely, a node should be **drained** so its work
   moves away first:

   ```bash
   instructor@manager:~$ docker node update --availability drain laptop-ana
   ```

   Containers migrate off; only then does Ana disconnect. This is exactly how real servers are
   taken down for maintenance without downtime.
3. **Scale to absurdity.** `docker service scale hello=100`. Where do they land? Check which
   laptops get the most - the scheduler balances by load.

## Leaving the swarm

When we're done, everyone runs:

```bash
you@laptop:~$ docker swarm leave
```

and the instructor tears down the rest. Your Docker returns to normal single-machine mode.

## What you just saw

One command to join a machine. Automatic spreading, healing, load-balancing across a room of
mismatched laptops on camp Wi-Fi. Now imagine the same thing with datacenter servers instead of
laptops - that is production container orchestration. And the next section shows how the industry
standard, **Kubernetes**, does the very same job with a bigger toolbox.
