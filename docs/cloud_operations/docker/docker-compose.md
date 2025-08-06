---
id: docker-compose
title: Docker Compose
description: Working with Docker compose
slug: /docker/compose
sidebar_position: 3
---

## Why Docker Compose?

As we have previously seen in the [Docker Basics](./docker-basics.md) tutorial, we can create and
run containers from the CLI. But this method gets increasingly tedious as soon as we try to create
multiple containers that need to interact with one another. Would it not be nice if we also had
some kind of universal format that could allow us to specify which containers we want, how they
communicate over the network or share data?

This is where Docker Compose comes into play. It allows a user to write a specification file for
an environment. That specification file is then run by using the `docker compose` command and
Docker takes care of creating all of the required resources.

## Installation

On Windows and MacOS, Docker Compose is part of the installation bundle for Docker Desktop. On,
Linux, you can check if you have Docker Compose installed by using the command:

```bash

cristian@cristianson:~$ docker compose version
Docker Compose version v2.24.5

```

If the command fails, you can follow [this guide](https://docs.docker.com/compose/install/) to
install Docker Compose.

## YAML file format

The file format we are going to use write Docker Compose files is called
[YAML](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html) (Yet Another
Markup Language). The format assumes the following concepts:

- each entry is of type `key:value`
- indentations in YAML are important as indented paragraphs are children of previous paragraphs
- list items are marked with `-`

## Docker Compose example file

```yaml

version: "3.8"
services:
    api:
        build: . # use a Dockerfile located in the current directory to build the image
        environment: # set some environment variables that will be available in the container at runtime
            NODE_ENV: development
            MY_ENV_VAR: my_custom_value
        ports:
            - "HOST_PORT:CONTAINER_PORT"
            - "5000:80" # bind the 5000 port on the host machine to the port 80 inside the container 
        networks:
            - my-network # the container will be assigned to this network and will be able to
                         # communicate only with containers which are part of the same network

    postgres:
        image: postgres:12 # use the official postgres image, version 12
        secrets: # the secret which is created at the bottom of the file is referenced here
            - my_ultra_secret_password
        environment:
            PGPASSWORD_FILE: /run/secrets/my_ultra_secret_password
        volumes:
            - my-volume:/var/lib/postgresql/data
            - ./init-script/init-db.sql:/docker-entrypoint-init.d/init-db.sql
        networks:
            - my-network

volumes:
    my-volume:

networks:
    my-network:

secrets:
    my_ultra_secret_password:
        file: './who-stores-passwords-in-plain-text.txt'

```

The inspiration for this Docker Compose file is from [here](https://mobylab.docs.crescdi.pub.ro/docs/softwareDevelopment/laboratory2/compose#exemplu-de-fi%C8%99ier-docker-compose).

Let's break it down line by line:

- `version`: the set of Docker Compose functionalities that will be used. This is the first line of
each compose file and is **mandatory**. Omitting this line will result in an error.

- `services`: the containers that will run after the configuration is loaded by the Compose agent.
Each service is basically a container. In the provided file, we have two services/containers, called
**api** and **postgres**
  - `build`: the directory where the Dockerfile used for creating the container image is located
  - `image`: the image used for running the container
  - `ports`: a list of `HOST_MACHINE_PORT: CONTAINER_PORT` entries
  - `volumes`: a list of `HOST_VOLUME: PATH_IN_CONTAINER` entries, where `HOST_VOLUME` can be either
a Docker managed volume or a bind mount
  - `networks`: a list of assigned networks for the container.
  - `secrets`: a list of secrets used inside the container
  - `environment`: object with multiple fields of type `ENV_VARIABLE_NAME: ENV_VARIABLE_VALUE`

:::warning

The `build` and `image` properties are mutually exclusive!

:::

### Volumes

Top level property (written of the same level as `services`). These are Docker managed objects, and
can have multiple properties, such as the storage driver that should be used or if the volume already
exists on the host machine. More information on volumes [here](https://docs.docker.com/compose/compose-file/07-volumes/).

```yaml

volumes:
  db-data:
    driver: foobar
    external: false

```

### Networks

Top level property (written of the same level as `services`). These are Docker managed objects, and
can have multiple properties, such as the driver that should be used of if the network already exists
on the host machine. More information on networks [here](https://docs.docker.com/compose/compose-file/06-networks/).

```yaml

networks:
  db-data:
    driver: bridge
    external: false

```

### Secrets

Top level property (written of the same level as `services`). These are Docker managed objects, and
can have multiple properties. These are a flavor of [Configs](https://docs.docker.com/compose/compose-file/08-configs/),
focusing on hiding sensitive data. More information on secrets [here](https://docs.docker.com/compose/compose-file/09-secrets/).

```yaml

secrets:
  server-certificate:
    file: ./server.cert

```

`server-certificate` secret is created as `<project_name>_server-certificate` when the application
is deployed, by registering content of the `server.cert` as a platform secret.

## List of Docker Compose commands

A list with all of the important Docker Compose commands is [here](https://docs.docker.com/compose/reference/).
The instructor will perform a demo to showcase the most important ones, but when you do not know
the meaning of a command, do `docker compose --help`.

```bash

docker compose up -d                       # services run in the background, detached from the terminal that initialized them
docker compose up --build                  # creates images before starting
docker compose start                       # starts the containers
docker compose pause                       # pauses the containers of a service (SIGPAUSE is sent)
docker compose unpause                     # unpauses the containers
docker compose ps                          # lists active containers
docker compose ls                          # lists all container stacks
docker compose -p my-project -f my-docker-compose.yml up # uses the specified Compose file instead of the default one and with a project name
docker compose down                        # stops the containers and deletes them, along with networks, volumes, and images created at up
docker compose rm                          # deletes all stopped containers (you can specify the name of the container to be deleted at the end)
docker compose rm -s -v                    # with -s it stops all containers and with -v it also deletes the attached anonymous volumes

```

## Exercise (final boss)

- Inspect the source code in [this repository](https://github.com/IPW-CloudOps/simple-node-app) and
create a Docker Compose manifest file for that application.
- Check that the required services are up and running.
- Do some requests to test the service.
- Delete the stack

:::tip

If you have solved the last exercise in the Docker Basics section, then you should already have the
Dockerfile created. Just reference it in the Docker Compose manifest!

:::

:::info

This task is intentionally written ambiguous in order to make you search the official documentation,
ask the course instructors questions and familiarize yourself with what a DevOps engineer has to do
on a day-to-day basis. So do not feel bad if, at first, the task seems hard. Do your best, solve it
at your own pace, collaborate with your colleagues, and, most importantly, have fun while learning
new things!

:::

:::note

This course borrows many things, as well as its structure from:

- [SCGC Pages UPB](https://scgc.pages.upb.ro/cloud-courses/docs/security/containers)
- [Mobylab Pages UPB](https://mobylab.docs.crescdi.pub.ro/docs/softwareDevelopment/laboratory1/)

This note is here then to give credits to the teams that created the above resources. For more
information on Docker and other things, feel free to check them out!

:::
