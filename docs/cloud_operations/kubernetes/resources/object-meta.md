---
title: ObjectMeta
description: ''
unlisted: true
---
# [ObjectMeta](https://kubernetes.io/docs/reference/kubernetes-api/common-definitions/object-meta/)

The `ObjectMeta` object is used for metadata. It includes fields that provide context and identity for resources. Basically, it allows for identification of resources.

Some of the most important attributes of the `ObjectMeta` object are:

1. **name**:
  - type: `string`
  - description: the name of the object (unique within the namespace)

1. **namespace**:
  - type: `string`
  - description: the namespace in which the object resides

1. **labels**
  - type: `map<string, string>`
  - description: key-value pairs that can be used to organize and select objects - often used for grouping, searching and managing sets of objects (i.e pods, services, pvs belonging to a specific api version)

1. **annotations**:
  - type: `map<string, string>`
  - description: key-value pairs used to store arbitrary metadata - can be used to attach non-identifying metadata to objects (i.e description of what a Pod does, storing external IDs of a resource, storing configuration hints - but also [Ingress annotations](https://kubernetes.io/docs/concepts/services-networking/ingress/#the-ingress-resource))

1. **uid**:
  - type: `string`
  - description: unique identifier, set by Kubernetes (unique across the cluster)

1. **creationTimestamp**:
  - type: `string`
  - decsription: time at which the object was created, set by Kubernetes