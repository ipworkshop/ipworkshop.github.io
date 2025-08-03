---
title: Container
unlisted: true
description: ''
---

# [Container](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)

- name: `string` - required
- image: `string`
- imagePullPolicy: `"Always" | "Never" | "IfNotPresent"`; Default: `"Always"` if :latest tag is specified, or "IfNotPresent" otherwise. (Can't be updated)
- command: `Array<string>` (entrypoint)
- args: `Array<string>` (entrypoint)
- workingDir: `string` (entrypoint)
- ports: `Array`
    - containerPort: `int32` - required (port to expose on the Pod's IP address)
    - hostIP: `string` (host IP to bind the external port to)
    - hostPort: `int32` (port to expose on the host - most containers don't need this)
    - name: `string`
    - protocol: `"UDP" | "TCP" | "SCTP"`; Default: `"TCP"`
- env: `Array`
    - name: `string` - required
    - value: `string`
    - valueFrom:
        - configMapKeyRef:
            - key: `string` - required
            - name: `string`
            - optional: `boolean`
        - fieldRef:
            - fieldPath: `metadata.name | metadata.namespace | metadata.labels['\<KEY>'] | metadata.annotations['\<KEY>'] | spec.nodeName | spec.serviceAccountName | status.hostIP | status.podIP | status.podIPs` - required - `string`
            - apiVersion: `string` - Default: `"v1"`
- envFrom: `Array`
    - configMapRef:
        - name: `string`
        - optional: `boolean`
    - prefix: `string`
- volumeMounts: `Array`
    - mountPath: `string` - required
    - name: `string` - required
    - mountPropagation: `string`
    - readOnly: `boolean`
    - subPath: `string`
- resources: `Array`
    - claims: `Array`
        - name: `string` - required
    - limits: `map<string, `[`Quantity`](https://kubernetes.io/docs/reference/kubernetes-api/common-definitions/quantity/#Quantity)`>`
    - requests: `map<string, `[`Quantity`](https://kubernetes.io/docs/reference/kubernetes-api/common-definitions/quantity/#Quantity)`>`
- livenessProbe: [`Probe`](./probe.md)
- readinessProbe: [`Probe`](./probe.md)