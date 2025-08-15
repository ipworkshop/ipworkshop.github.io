---
title: Services
description: ''
sidebar_position: 4
---
# [Services](https://kubernetes.io/docs/concepts/services-networking/service/)

## Goals
1. **Understand Kubernetes Services**:
    - Learn what a Service is and its role in the Kubernetes architecture.
1. **Basic Example(s)**:
    - Provide (a) basic example(s) of Services.
    - Show how to define a Service using YAML.
1. **Service Spec Explanation**:
    - Explain the components of the Service specification using the example(s) above.
1. **Service Types**:
    - Describe different types of Services and their use cases (ClusterIP, NodePort, LoadBalancer, ExternalName).
1. **Exercise**:
    - Hands-on activity to create a simple Service.

## Understanding Kubernetes Services

A **Service** in Kubernetes is an abstraction that defines a logical set of pods and a policy by which to access them. Services enable networking and connectivity between different parts of a Kubernetes application or with external services.

## Basic Service Example


### 1. ClusterIP Service
Here is a basic example of a Kubernetes Service specification in YAML:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP
```

This Service provides a stable IP and DNS name to access the set of `nginx` pods.

Save this to a file `service.yaml` and create the resource using `kubectl apply -f service.yaml`:

```bash
> kubectl apply -f service.yaml
service/nginx-service created
```

### NodePort Service

First we create the server Pod `service-simple-pod.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx-container
    image: nginx:latest
    ports:
    - containerPort: 80
```

We then create the corresponding service for the pod `service-simple.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-nodeport
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
    nodePort: 30001
  type: NodePort
```

We proceed to create both:

```bash
> kubectl apply -f service-simple-pod.yaml 
> kubectl apply -f service-simple.yaml
```

We then find the Node's IP:

```bash
> minikube ip
```

And then we try to curl from the terminal:

```bash
> curl http://$(minikube ip):30001
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

## Service Spec Explanation

1. apiVersion: v1 (hardcoded)
1. kind: Service (type of the resource)
1. metadata: [ObjectMeta](./object-meta.md)
1. spec: [ServiceSpec](./service/service-spec.md)
1. status: [ServiceStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#loadbalancerstatus-v1-core)

## Service Types

- **ClusterIP**: Exposes the Service on a cluster-internal IP. This is the default type.
- **NodePort**: Exposes the Service on each Node's IP at a static port. (We'll be using this for examples)
- **LoadBalancer**: Exposes the Service externally using a cloud provider's load balancer.
- **ExternalName**: Maps a Service to an external DNS name.

## Exercises

### Exercise 1: Expose an Application Internally Using a ClusterIP Service

**Objective**: Deploy an application and expose it within the cluster using a ClusterIP Service.

**Task**:
- Deploy a pod running a simple HTTP server (e.g., `nginx` or `httpd`).
- Create a ClusterIP Service to expose this HTTP server within the Kubernetes cluster.
- Verify that the service is accessible from other pods in the cluster.

:::tip

You can deploy a Pod running a simple linux image (`ubuntu:22.04`). Shelling into it was shown previously on the [`Pods`](./pods.md) page, do you remember how to do it without looking at it?

:::