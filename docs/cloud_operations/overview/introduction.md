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

1. First day: local setup, importance of containerization and orchestration, container basics,
    containers vs virtual machines
1. Docker + docker compose
1. Kubernetes
1. Deployment + NGINX

## What is this course about?

The goal of this course is to teach you about **containers** and **orchestration with Kubernetes**.
After this course, you will be able to deploy an application into production that can serve users
worldwide with minimal latency and headache for you, and the development team (which may include you
😎).

<div style={{textAlign: 'justify'}}>

In brief, containerization is packaging an application and its dependencies into a standardized
unit, known as a container. This container can then be easily moved between environments, ensuring
consistency and reliability across different systems.

We care about containerization because it allows developers to build, test, and deploy applications
more efficiently. By isolating applications within containers, we can avoid conflicts between
dependencies and ensure that the application runs consistently regardless of the underlying
infrastructure.

Orchestration is managing and coordinating multiple containers in a distributed environment. This
includes tasks such as scaling containers up or down, load balancing traffic between containers,
and ensuring high availability of the application. Kubernetes is a popular orchestration tool that
helps automate these tasks, making it easier to manage containerized applications at scale.

By the end of this course, you will have the skills and knowledge needed to deploy and manage
containerized applications in a production environment.

</div>

## Setup instruction for required tools

You need to install the following tools to solve the workshop:

1. Docker and Docker Compose (see the [manual](https://docs.docker.com/manuals/))
1. Kubectl (see the [manual](https://kubernetes.io/docs/tasks/tools/))
1. Minikube (see the
   [manual](https://minikube.sigs.k8s.io/docs/start/?arch=%2Flinux%2Fx86-64%2Fstable%2Fbinary+download))
1. WSL2 (if you have Windows) (follow the [install
   instructions](https://learn.microsoft.com/en-us/windows/wsl/install))