---
id: kubernetes-overview
title: Kubernetes Overview
description: Introduction to Kubernetes
slug: /kubernetes/overview
sidebar_position: 1
---

# Kubernetes Overview

## What is Kubernetes?

Kubernetes is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications. Key points include:

- Developed originally by Google, now maintained by the Cloud Native Computing Foundation
- Designed to run distributed systems resiliently
- Provides features like service discovery, load balancing, storage orchestration, and self-healing
- Enables declarative configuration and automation

## Kubernetes Architecture

Kubernetes uses a master-worker architecture:

1. Master Node (Control Plane):
   - API Server: Central management point for the cluster (this is the frontend for the cluster)
   - Scheduler: Assigns work to nodes
   - Controller Manager: Regulates the state of the system
   - Cloud Controller Manager: Regulates the state of the system, in case we are using a cloud provider
   - etcd: Distributed key-value store for cluster data (mini database)

2. Worker Nodes:
   - Kubelet: Ensures containers are running in a pod
   - Container Runtime: Software for running containers (e.g., Docker)
   - Kube-proxy: Manages network rules on nodes

![cluster](/img/docs/kubernetes/1.svg)

## Other architectures

### Orchestrated architecture

![orchestrated-architecture](/img/docs/kubernetes/2.png)


## Key Kubernetes Concepts

1. Clusters:
   - A set of nodes that run containerized applications
   - Provides high availability and scalability (you can have replicas in different datacenters)

1. Nodes:
   - Physical or virtual machines in the Kubernetes cluster
   - Can be master nodes (part of the control plane) or worker nodes

1. Namespaces:
   - Virtual clusters within a physical cluster
   - Used for organizing resources and multi-tenancy

1. [Pods](./resources/pods.md):
   - Smallest deployable units in Kubernetes
   - Can contain one or more containers
   - Share network namespace and storage

1. [Replica Sets](./resources/replicasets.md):
   - Describe the desired state for a set of pods
   - Provide basic scaling and self-healing mechanisms

1. [Services](./resources/services.md):
   - An abstract way to expose applications running on pods
   - Provide a stable network endpoint

1. [Persistent Volumes (and Persistent Volume Claims)](./resources/persistent-volumes.md):
   - Abstraction for storage resources in the cluster

1. [ConfigMaps and Secrets](./resources/configmaps_and_secrets.md):
   - Manage configuration data and sensitive information

1. [Ingress](./resources/ingress.md):
   - Manage external access to services in a cluster