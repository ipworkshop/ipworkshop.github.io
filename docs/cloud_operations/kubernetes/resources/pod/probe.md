---
title: Probe
description: ''
unlisted: true
---

# [Probe](ttps://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/#Probe)

Probes are used to describe health checks to be performed against a container to determine whether it is alive or ready to receive traffic.

- exec:
    - command: `Array<string>`
- httpGet:
    - port: `integer | string` - required
    - host: `string` - defaults to Pod IP
    - path: `string`
    - scheme: `string` - defaults to 'HTTP'
- initialDelaySeconds: `int32`
