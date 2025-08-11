---
title: StatefulSets
description: ''
sidebar_position: 8
---

# [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)

## Goals

1. **Understand Kubernetes StatefulSets**:
    - Learn what a StatefulSet is and its role in Kubernetes for managing stateful applications.
1. **Basic Example(s)**:
    - Provide (a) basic example(s) of StatefulSet resources.
    - Show how to define a StatefulSet using YAML.
1. **StatefulSet Spec Explanation**:
    - Explain the components of the StatefulSet specification using the example(s) above.
1. **StatefulSets vs. ReplicaSets**:
    - Describe the advantages and differences between StatefulSets and ReplicaSets.
1. **Exercise**:
    - Hands-on activity to create a simple StatefulSet.

## Understanding Kubernetes StatefulSets

A **StatefulSet** in Kubernetes is a controller that manages the deployment and scaling of a set of Pods, and provides guarantees about the ordering and uniqueness of these Pods. StatefulSets are useful for applications that require stable network identifiers, stable storage, and ordered deployment and scaling.

## Basic StatefulSet Example

### Simple StatefulSet

Here is a basic example of a Kubernetes StatefulSet specification in YAML:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: example-statefulset
spec:
  serviceName: "example"
  replicas: 3
  selector:
    matchLabels:
      app: example
  template:
    metadata:
      labels:
        app: example
    spec:
      containers:
      - name: example-container
        image: nginx
        ports:
        - containerPort: 80
  volumeClaimTemplates:
  - metadata:
      name: example-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 1Gi
```

This StatefulSet deploys three replicas of an nginx container, each with a unique identity and associated persistent storage.

Save this to a file `statefulset.yaml` and create the resource using:

```sh
> kubectl apply -f statefulset.yaml
statefulset.apps/example-statefulset created
```

## StatefulSet Spec Explanation

1. **apiVersion**: apps/v1 (API group and version)
1. **kind**: StatefulSet (type of the resource)
1. **metadata**: [ObjectMeta](./object-meta.md)
1. **spec**: [StatefulSetSpec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#statefulsetspec-v1-apps)
1. **status**: [StatefulSetStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#statefulsetstatus-v1-apps)

## StatefulSets vs. ReplicaSets

- **StatefulSets**:
  - Provide stable, unique network identifiers for Pods.
  - Ensure that Pods are started and stopped in a specific order.
  - Support stable storage using PersistentVolumeClaims.
  - Ideal for stateful applications requiring consistent identities and storage.

- **ReplicaSets**:
  - Focus on maintaining a stable set of replicas for a given Pod specification.
  - Do not provide stable network identities or persistent storage.
  - Suitable for stateless applications where Pods can be replaced or rescheduled without losing data.

## Exercises

### Exercise 1: Create a Simple StatefulSet

**Objective**: Deploy an application using a StatefulSet with persistent storage.

**Task**:
- Define a StatefulSet with a suitable number of replicas and a container image.
- Create a Service to manage network access to the StatefulSet.
- Use volumeClaimTemplates to request persistent storage for each Pod.
- Verify that each Pod has a unique network identity and persistent storage.

:::tip

StatefulSets require a Headless Service to manage network identities. Ensure you define the `serviceName` in your StatefulSet spec and create a corresponding Headless Service.

:::
