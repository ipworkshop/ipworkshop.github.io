---
title: Service Spec
description: ""
unlisted: true
---

# [Service Spec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#servicespec-v1-core)

Here's the most important attributes:

1. ports - [`Array<ServicePort>`](./service-port.md)
1. selector - `Object`
    - Route service traffic to pods with label keys and values matching this selector
1. type - [`"ExternalName" | "ClusterIP" | "NodePort" | "LoadBalancer"` - `string`]
    - determines how the Service is exposed
    - defaults to `ClusterIP` - which allocates a cluster-internal IP address for load-balancing to endpoints
    - endpoints are determined by the selector
