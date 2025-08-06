---
title: Service Port
description: ""
unlisted: true
---

# [Service Port](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#serviceport-v1-core)

Here's the most important attributes:

1. name - `string`
    - The name of this port within the service, must be a `DNS_LABEL`. All ports within a `ServiceSpec` must have unique names. 
    - Optional if only one `ServicePort` is defined.

1. nodePort - `integer`
    - The port on each node on which this service is exposed when `type` is `NodePort` or `LoadBalancer`. Usually assigned by the system. 
    - If specified, the value must be in-range and not in use, otherwise the operation will fail. 
    - If not specified, a port will be allocated if required. 
    - This field is cleared when updating a Service to no longer need it (e.g., changing `type` from `NodePort` to `ClusterIP`).

1. port - `integer`
    - The port that will be exposed by this service.

1. targetPort - `integer | string`
    - The port number or name to access on the pods targeted by the service. Number must be in the range 1 to 65535. 
    - Name must be an `IANA_SVC_NAME`. If specified as a string, it will be looked up as a named port in the target Pod's container ports.
    - If not specified, the value of the `port` field is used.
    - This field is ignored for services with `clusterIP=None`, and should be omitted or set equal to the `port` field.