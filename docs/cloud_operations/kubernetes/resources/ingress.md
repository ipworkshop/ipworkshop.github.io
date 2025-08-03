---
title: Ingress
description: ''
sidebar_position: 5
---
# [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)

## Goals
1. **Understand Kubernetes Ingress**:
    - Learn what an Ingress is and its role in the Kubernetes architecture.
1. **Basic Example(s)**:
    - Provide (a) basic example(s) of Ingress resources.
    - Show how to define an Ingress using YAML.
1. **Ingress Spec Explanation**:
    - Explain the components of the Ingress specification using the example(s) above.
1. **Ingress Controllers**:
    - Describe different Ingress controllers and their use cases.
1. **Exercise**:
    - Hands-on activity to create a simple Ingress.

## Understanding Kubernetes Ingress

An **Ingress** in Kubernetes is an API object that manages external access to the services in a cluster, typically HTTP. Ingress can provide load balancing, SSL termination, and name-based virtual hosting.

## Basic Ingress Example

### Simple Ingress

Here is a basic example of a Kubernetes Ingress specification in YAML:

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: example-ingress
spec:
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: example-service
            port:
              number: 80
```

This Ingress routes traffic to the `example-service` service when accessing `example.com`.

Save this to a file `ingress.yaml` and create the resource using `kubectl apply -f ingress.yaml`:

```
> kubectl apply -f ingress.yaml
ingress.networking.k8s.io/example-ingress created
```

## Ingress Spec Explanation

1. apiVersion: networking.k8s.io/v1 (API group and version)
1. kind: Ingress (type of the resource)
1. metadata: [ObjectMeta](./object-meta.md)
1. spec: [IngressSpec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#ingressspec-v1-networking-k8s-io)
1. status: [IngressStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#ingressstatus-v1-networking-k8s-io)

## Ingress Controllers

- **Nginx Ingress Controller**: A popular choice that uses Nginx as the backend for managing Ingress resources. (Easiest to set up)
- **Traefik**: A dynamic and modern HTTP reverse proxy and load balancer.
- **Contour**: An open-source ingress controller for Kubernetes that provides advanced routing features.
- **Istio**: A service mesh that provides a powerful way to manage ingress and other traffic within a Kubernetes cluster.

## Exercises

### Exercise 1: Create a Simple Ingress

**Objective**: Deploy an application and expose it externally using an Ingress resource.

**Task**:
- Deploy a pod running a simple HTTP server (e.g., `nginx` or `httpd`).
- Create a Service to expose this HTTP server.
- Define an Ingress resource to route external traffic to the service.
- Verify that the service is accessible via the Ingress.

:::tip

Make sure your cluster has an Ingress controller installed. If using Minikube, you can enable the Nginx Ingress controller using:

```
minikube addons enable ingress
```

:::