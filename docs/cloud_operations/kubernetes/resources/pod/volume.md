---
title: Volume
description: ''
unlisted: true
---

# [Volume](https://kubernetes.io/docs/reference/kubernetes-api/common-definitions/object-meta/)

Volume represents a named volume in a pod that may be accessed by any container in the Pod.

- name: `string` - required
- persistentVolumeClaim:
    - claimName: `string` - required
    - readOnly: `boolean`
- configMap:
    - name: `string`
- secret:
    - secretName: `string`