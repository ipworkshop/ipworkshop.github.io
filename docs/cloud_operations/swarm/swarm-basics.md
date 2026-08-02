---
id: swarm-basics
title: Docker Swarm Basics
description: Services, replicas, scaling and rolling updates - hands-on
slug: /swarm/basics
sidebar_position: 2
---

# Docker Swarm Basics

The best part about Swarm: **you already have it installed.** Swarm mode is built into the Docker
engine you have been using all week. No new tools, no new config format - compose files work.

## Turning on swarm mode

```bash
adi@ipw:~$ docker swarm init
Swarm initialized: current node (dxn1zf6l61qsb1josjja83ngz) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-49nj1cmql0jkz5s954yi3oex3nedyz0fb0xx14ie39trti4wxv-8vxv8rssmk743ojnwacrr2e7c 192.168.99.121:2377
```

Your laptop is now a **cluster of one machine**. Everything below works exactly the same on a
cluster of fifty. Two node roles exist:

- **Managers** - hold the cluster state, make scheduling decisions (your machine is now one)
- **Workers** - just run containers

```bash
adi@ipw:~$ docker node ls
ID                            HOSTNAME   STATUS    AVAILABILITY   MANAGER STATUS
dxn1zf6l61qsb1josjja83ngz *   ipw        Ready     Active         Leader
```

## Services: containers with desired state

In swarm mode you don't run containers directly - you create **services**. A service is the
desired-state wrapper around a container: image + how many copies (**replicas**) + how to update
them. Swarm then creates the actual containers (called **tasks**) to satisfy it.

```bash
adi@ipw:~$ docker service create --name web --replicas 3 -p 8080:80 nginx:1.27
k0v34mzo1z5oxbmwd0p2wc0fl
overall progress: 3 out of 3 tasks
1/3: running   [==================================================>]
2/3: running   [==================================================>]
3/3: running   [==================================================>]
verify: Service k0v34mzo1z5o converged
```

```bash
adi@ipw:~$ docker service ls
ID             NAME      MODE         REPLICAS   IMAGE        PORTS
k0v34mzo1z5o   web       replicated   3/3        nginx:1.27   *:8080->80/tcp

adi@ipw:~$ docker service ps web
ID             NAME      IMAGE        NODE      DESIRED STATE   CURRENT STATE
uz1zmgmv9tw3   web.1     nginx:1.27   ipw       Running         Running 40 seconds ago
np8z2hjc2fs9   web.2     nginx:1.27   ipw       Running         Running 40 seconds ago
sk3nx6cmavve   web.3     nginx:1.27   ipw       Running         Running 40 seconds ago
```

Three nginx replicas, all reachable through port 8080 - Swarm load-balances requests between them
automatically (this is called the **routing mesh**: every node in the cluster answers on the
published port and forwards to some replica, wherever it runs).

## Watch self-healing happen

Time to see the desired-state loop from the previous chapter in action. Kill a task on purpose:

```bash
adi@ipw:~$ docker ps --filter name=web -q | head -1
9f3c2a81b4de
adi@ipw:~$ docker rm -f 9f3c2a81b4de
9f3c2a81b4de
adi@ipw:~$ docker service ps web
ID             NAME        IMAGE        NODE   DESIRED STATE   CURRENT STATE
uz1zmgmv9tw3   web.1       nginx:1.27   ipw    Running         Running 3 minutes ago
1x0v8yomsncd   web.2       nginx:1.27   ipw    Running         Running 5 seconds ago
np8z2hjc2fs9    \_ web.2   nginx:1.27   ipw    Shutdown        Failed 9 seconds ago
sk3nx6cmavve   web.3       nginx:1.27   ipw    Running         Running 3 minutes ago
```

You destroyed `web.2`; Swarm noticed within seconds (actual: 2 ≠ desired: 3) and started a
replacement. The `\_` line is the service's history showing the failed task. Nobody woke up at
3 AM.

## Scaling

One command:

```bash
adi@ipw:~$ docker service scale web=10
web scaled to 10
overall progress: 10 out of 10 tasks
verify: Service web converged
```

Scale down works the same: `docker service scale web=2`. Compare with what "add 7 more copies"
would mean with plain `docker run` - names, ports, load balancing, all manual.

## Rolling updates

The zero-downtime release. Tell Swarm to move the service to a new image version, replacing tasks
**a few at a time**:

```bash
adi@ipw:~$ docker service update \
    --image nginx:1.29 \
    --update-parallelism 2 \
    --update-delay 5s \
    web
web
overall progress: 10 out of 10 tasks
verify: Service web converged
```

Watch `docker service ps web` in a second terminal while this runs: tasks are shut down and
replaced in pairs (`--update-parallelism 2`), with a 5-second pause between pairs. At every moment,
most replicas are still serving the old version - users never see downtime.

Bad release? One command back:

```bash
adi@ipw:~$ docker service rollback web
```

## Stacks: compose files on a cluster

Creating services one `docker service create` at a time is the same pain as `docker run` was -
and you already know the fix: a compose file. In swarm mode it's called a **stack**:

```yaml
# stack.yaml
services:
  web:
    image: nginx:1.27
    ports:
      - "8080:80"
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 5s
```

The only new part is the `deploy:` key - replicas and update behavior, per service. Deploy it:

```bash
adi@ipw:~$ docker stack deploy -c stack.yaml mystack
Creating network mystack_default
Creating service mystack_web
adi@ipw:~$ docker stack services mystack
ID             NAME          MODE         REPLICAS   IMAGE        PORTS
l2h1o8nqxq7v   mystack_web   replicated   3/3        nginx:1.27   *:8080->80/tcp
```

Same file format, same mental model - but now with desired state, and (next page) across many
machines.

:::warning

In a stack, images must come from a **registry** - `build:` is ignored by `docker stack deploy`,
because every node in the cluster needs to be able to pull the image. Build, push to Docker Hub,
then reference `image: yourname/yourapp:1.0`. This is exactly why registries exist.

:::

## Cleaning up

```bash
adi@ipw:~$ docker stack rm mystack
adi@ipw:~$ docker service rm web
adi@ipw:~$ docker swarm leave --force   # only if you want to exit swarm mode entirely
```

## Exercise 1: break it, watch it heal

1. Create a service named `ipw-api` with 4 replicas of an image of your choice (something
   long-running - `nginx` works).
2. In a second terminal, run `watch docker service ps ipw-api` (or re-run the command manually).
3. Find the actual containers with `docker ps` and force-remove two of them at once. How long
   until desired state is restored?
4. Scale the service to 8, then to 1.
5. Perform a rolling update to a different image version with parallelism 1 and a 10s delay -
   watch the replacement order. Then roll back.

## Exercise 2: stack-ify your app

Take your compose project from the previous chapters (images already pushed to Docker Hub) and
deploy it as a stack:

1. Add a `deploy:` section: 3 replicas for the stateless services (frontend/backend), **1** for
   the database.
2. `docker stack deploy -c stack.yaml myapp` and verify with `docker stack services myapp`.
3. Kill a backend container. Does your app keep responding while it heals?
4. Discuss with an instructor: why did we keep the database at 1 replica? What would go wrong at
   3? (Hint: three separate containers writing to three separate volumes are three separate
   databases...)
