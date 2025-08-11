---
title: ConfigMaps and Secrets
description: ''
sidebar_position: 3
---

# [ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/) and [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)

### Goals
1. **Understand ConfigMaps and Secrets**:
    - Learn what ConfigMaps and Secrets are, and their roles in Kubernetes.
1. **Basic Examples**:
    - Provide basic examples of ConfigMaps and Secrets.
    - Show how to define ConfigMaps and Secrets using YAML.
1. **Usage in Pods**:
    - Demonstrate how to use ConfigMaps and Secrets to manage configuration and sensitive data within pods.
1. **Exercise**:
    - Hands-on activities to create and use ConfigMaps and Secrets in a Kubernetes cluster.

## Understanding ConfigMaps

**ConfigMaps** are Kubernetes objects used to store non-confidential data in key-value pairs. They can be used to configure application settings and pass configuration data into pods.

### Basic ConfigMap Example

Here is a basic example of a Kubernetes ConfigMap specification in YAML:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: example-configmap
data:
  config.json: |
    {
      "key1": "value1",
      "key2": "value2"
    }
```

Save this to a file named `configmap.yaml` and create the ConfigMap using:

```bash
> kubectl apply -f configmap.yaml
```

You can view all config maps and read their contents using:

```
> kubectl get configmaps
NAME                DATA   AGE
example-configmap   1      54s
kube-root-ca.crt    1      46m

> kubectl describe configmaps example-configmap
Name:         example-configmap
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
config.json:
----
{
  "key1": "value1",
  "key2": "value2"
}


BinaryData
====

Events:  <none>
```

### Using ConfigMaps in Pods

To use a ConfigMap in a pod, you can reference it in the pod specification. For example:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-pod
spec:
  containers:
  - name: app-container
    image: nginx:latest
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
  volumes:
  - name: config-volume
    configMap:
      name: example-configmap
```

In this example, the ConfigMap `example-configmap` is mounted as a volume in the pod at `/etc/config`.

After you `apply` the pod, you can see the config by `cat`-ing the file contents:

```bash
> kubectl exec -it configmap-pod -- cat /etc/config/config.json
```

## Understanding Secrets

**Secrets** are Kubernetes objects designed to hold sensitive data, such as passwords, OAuth tokens, and SSH keys. The data in Secrets is encoded as base64 strings.

### Basic Secret Example

Here is a basic example of a Kubernetes Secret specification in YAML:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: example-secret
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

The values for `username` and `password` are base64-encoded strings (`admin` and `1f2d1e2e67df`, respectively).

Save this to a file named `secret.yaml` and create the Secret:

```bash
> kubectl apply -f secret.yaml
```

### Using Secrets in Pods

To use a Secret in a pod, you can reference it similarly to a ConfigMap:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-pod
spec:
  containers:
  - name: app-container
    image: nginx:latest
    env:
    - name: USERNAME
      valueFrom:
        secretKeyRef:
          name: example-secret
          key: username
    - name: PASSWORD
      valueFrom:
        secretKeyRef:
          name: example-secret
          key: password
```

In this example, the Secret `example-secret` is used to set environment variables in the pod.

## Exercises

### Exercise 1: Creating and Using a ConfigMap (Easy)

**Objective**: Create a ConfigMap and use it to configure a pod.

**Task**:
- Create a ConfigMap with a configuration file.
- Use this ConfigMap in a pod.

**Instructions**:
1. Create a YAML file named `my-configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-configmap
data:
  app.properties: |
    setting1=value1
    setting2=value2
```

2. Apply the ConfigMap:

```bash
> kubectl apply -f my-configmap.yaml
```

3. Create a YAML file named `configmap-pod.yaml`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-pod
spec:
  containers:
  - name: app-container
    image: busybox
    command: ["sh", "-c", "cat /etc/config/app.properties && sleep 3600"]
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
  volumes:
  - name: config-volume
    configMap:
      name: my-configmap
```

4. Apply the pod configuration:

```bash
> kubectl apply -f configmap-pod.yaml
```

5. Verify the pod is running and inspect the logs to see the ConfigMap data:

```bash
> kubectl logs configmap-pod
```

---

### Exercise 2: Creating and Using a Secret (Medium)

**Objective**: Create a Secret and use it in a pod.

**Task**:
- Create a Secret containing sensitive information.
- Use this Secret in a pod to set environment variables.

**Instructions**:
1. Create a YAML file named `my-secret.yaml`:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-secret
data:
  api-key: c2VjcmV0YXBpa2V5
```

(The value `c2VjcmV0YXBpa2V5` is base64 for `secretapikey`.)

2. Apply the Secret:

```bash
> kubectl apply -f my-secret.yaml
```

3. Create a YAML file named `secret-pod.yaml`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-pod
spec:
  containers:
  - name: app-container
    image: busybox
    command: ["sh", "-c", "echo $API_KEY && sleep 3600"]
    env:
    - name: API_KEY
      valueFrom:
        secretKeyRef:
          name: my-secret
          key: api-key
```

4. Apply the pod configuration:

```bash
> kubectl apply -f secret-pod.yaml
```

5. Verify the pod is running and inspect the logs to see the API key:

```bash
> kubectl logs secret-pod
```

These exercises cover the basics of creating and using ConfigMaps and Secrets in Kubernetes, providing both practical examples and explanations.
