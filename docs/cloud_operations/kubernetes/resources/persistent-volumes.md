---
title: Persistent Volumes
description: ''
sidebar_position: 7
---

# [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)

## Goals

1. **Understand Kubernetes Persistent Volumes**:
    - Learn what a Persistent Volume (PV) is and its role in Kubernetes storage architecture.
1. **Basic Example(s)**:
    - Provide (a) basic example(s) of Persistent Volume and Persistent Volume Claim (PVC) resources.
    - Show how to define a PV and PVC using YAML.
1. **Persistent Volume Spec Explanation**:
    - Explain the components of the Persistent Volume specification using the example(s) above.
1. **Persistent Volume Claims**:
    - Describe the relationship between Persistent Volumes and Persistent Volume Claims.
1. **Exercise**:
    - Hands-on activity to create and use a Persistent Volume.

## Understanding Kubernetes Persistent Volumes

A **Persistent Volume** (PV) in Kubernetes is a piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned using Storage Classes. PVs are independent of the lifecycle of a pod and provide a way to persist data beyond the lifespan of individual pods.

## Basic Persistent Volume Example

### Simple Persistent Volume and Persistent Volume Claim

Here is a basic example of a Kubernetes Persistent Volume and Persistent Volume Claim in YAML:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: example-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: manual
  hostPath:
    path: /mnt/data
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: example-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: manual
```

This example defines a 1Gi PV using a hostPath and a PVC requesting 1Gi of storage.

Save this to a file `pv-pvc.yaml` and create the resources using:

```sh
> kubectl apply -f pv-pvc.yaml
persistentvolume/example-pv created
persistentvolumeclaim/example-pvc created
```

## Persistent Volume Spec Explanation

1. **apiVersion**: v1 (API group and version)
1. **kind**: PersistentVolume (type of the resource)
1. **metadata**: [ObjectMeta](./object-meta.md)
1. **spec**: [PersistentVolumeSpec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#persistentvolumespec-v1-core)
1. **status**: [PersistentVolumeStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#persistentvolumestatus-v1-core)

## Persistent Volume Claims

- A **Persistent Volume Claim (PVC)** is a request for storage by a user. It is similar to a pod in that pods consume node resources, and PVCs consume PV resources. 
- PVCs can request specific size and access modes (e.g., ReadWriteOnce, ReadOnlyMany).

## Exercises

### Exercise 1: Create a Simple Persistent Volume

**Objective**: Deploy an application that uses a Persistent Volume for storage.

**Task**:
- Define a Persistent Volume with a suitable storage capacity.
- Create a Persistent Volume Claim to request storage.
- Deploy a pod that uses the PVC for persistent storage.
- Verify that the pod can write and read data from the Persistent Volume.

:::tip

Make sure your cluster has a storage provider configured. For local testing, using a hostPath as shown in the example above is a simple way to simulate PV functionality.

:::
