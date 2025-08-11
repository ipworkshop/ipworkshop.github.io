--- 
title: Pods
description: ''
sidebar_position: 1
---
# [Pods](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/)

## Goals
1. **Understand Kubernetes Pods**:
    - Learn what a pod is and its role in the Kubernetes architecture.
1. **Basic Example(s)**:
    - Provide (a) basic example(s) of Pods.
    - Show how to define a Pod using YAML.
1. **Pod Spec Explanation**:
    - Visit the Pod specification while following the example(s) above.
1. **Direct Pod Access**:
    - Describe how to create a direct network tunnel to a Pod for testing and/or debugging purposes.
1. **Exercise**:
    - Hands-on activity to create a simple Pod (using only the spec).

## Understanding Kubernetes Pods:

A **Pod** is the smallest, most basic deployable object in Kubernetes. It represents a single instance of a running process in your cluster. A pod encapsulates one or more containers, storage resources, a unique network IP, and options that govern how the containers should run.

## Basic Pod Example

Here is a basic example of a Kubernetes pod specification in YAML:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
  - name: nginx-container
    image: nginx:1.21
    ports:
    - containerPort: 80
```

Save this to a file `pod.yaml` and create the resource using `kubectl apply -f pod.yaml`:

```bash
> kubectl apply -f pod.yaml
pod/nginx-pod created
```

Next, let's take a look at the pods running in our cluster and see if we can find the newly created Pod using `kubectl get pods`:

```bash
> kubectl get pods
NAME                              READY   STATUS    RESTARTS        AGE
nginx-pod                         1/1     Running   0               72s
```

Let's explain this a little:
1. `NAME`: As we can see on the left side we have the name of the Pod we've just created (remember the `metadata.name`?)
1. `READY`: To the right of it, we have the `READY` section: `1/1` means that `1` out of `1` Pods of this type are ready to serve traffic. But do we really need this? Well, yes, the maximum number of Pods, for any name, is `1`, but what if our Pod is not ready? We should know that when retrieving Pods, so we can know that the reason we are having trouble with our app is cause the Pod is literally not in a `Running` state. Usually, we won't launch just 1 Pod of this type, we'll be using a Set resource to help us deploy multiple and manage them, but then the `metadata.name` provided will be the prefix for the final name of the pod (i.e `nginx-pod-134af`)
1. `STATUS`: Next, we have the `STATUS` section, which lets us know what status our Pod is in [(`"Pending" | "Running" | "Succeeded" | "Failed" | "Unknown"`)](./pod/pod-status.md)
1. `RESTARTS`: `RESTARTS` show us how many times has the Pod restarted since it has been created, along with how much time has it passed since the last restart (if there has been any)
1. `AGE`: lastly, the `AGE`, which shows us how old the Pod is

After creating the resource, we should also take a look at the state it is in, we can do this by making use of the `kubectl describe pods/nginx-pod`:

```bash
> kubectl describe pods/nginx-pod
Name:             nginx-pod
Namespace:        default
Priority:         0
Service Account:  default
Node:             minikube/192.168.49.2
Start Time:       Mon, 05 Aug 2024 12:07:28 +0300
Labels:           <none>
Annotations:      <none>
Status:           Running
IP:               10.244.0.45
IPs:
  IP:  10.244.0.45
Containers:
  nginx-container:
    Container ID:   docker://7b219a363f96823719c9f68f0e0e5106007808c6d4b840d1521ab1383606e99b
    Image:          nginx:1.21
    Image ID:       docker-pullable://nginx@sha256:2bcabc23b45489fb0885d69a06ba1d648aeda973fae7bb981bafbb884165e514
    Port:           80/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Mon, 05 Aug 2024 12:07:39 +0300
    Ready:          True
    Restart Count:  0
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-kwl7s (ro)
Conditions:
  Type                        Status
  PodReadyToStartContainers   True
  Initialized                 True
  Ready                       True
  ContainersReady             True
  PodScheduled                True
Volumes:
  kube-api-access-kwl7s:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    ConfigMapOptional:       <nil>
    DownwardAPI:             true
QoS Class:                   BestEffort
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  25m   default-scheduler  Successfully assigned default/nginx-pod to minikube
  Normal  Pulling    25m   kubelet            Pulling image "nginx:1.21"
  Normal  Pulled     25m   kubelet            Successfully pulled image "nginx:1.21" in 9.687s (9.687s including waiting). Image size: 141526528 bytes.
  Normal  Created    25m   kubelet            Created container nginx-container
  Normal  Started    25m   kubelet            Started container nginx-container
```

A lot of information, I know, but bare with me, we can digest most of it, but we don't even need to.
The `describe` function, though, lets us see exactly why stuff went wrong, went it did, well that's what it's mostly used for, or making sure nothing did, in fact, went wrong, so we can go in search of the real culprit that is giving us headaches.

What is of most interest are the next things:
- containers' ports
- containers' ready state
- conditions
- events

If we know these things, we can see pretty quick (at least for our use cases) if the Pod is set up properly. While most of the data is pretty self explanatory, emphasis should be put on the `Events` section, which gives us a detailed trace of each step that happened. If a problem did happen, you'd be pretty sure it is found here.

## Explanation of the [Pod Spec](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/):

1. apiVersion: v1 (hardcoded)
1. kind: Pod (type of resource)
1. metadata: [ObjectMeta](./object-meta.md)
1. spec: [PodSpec](./pod/pod-spec.md)
1. status: [PodStatus](./pod/pod-status.md)

## Direct Pod Access

Great, we've deployed our first resource, a Pod! But what can we do with it? Can we access it? Well, usually, you'd want to put it behind a Service (so that it can be accessed from a hostname), that would also be behind an Ingress (so that outside traffic can enter the cluster).

Since we haven't done any of those, we'll create a direct tunnel to the Pod:

```bash
> kubectl port-forward nginx-pod 8000:80
Forwarding from 127.0.0.1:8000 -> 80
Forwarding from [::1]:8000 -> 80
```

With this simple command (don't close the terminal!!!), our machine's port `8000` is made so it proxies traffic to the port `80` of our container

:::warn

If you are using WSL2, the things aren't that simple. WSL2 has a different network interface than Windows, which means you need to start your browser from WSL2 (usually install it in WSL2 again, cause it's basically another operating system) or forward traffic from Windows to WSL2.

:::

Now to test it and make sure it works, we can do a simple `curl http://localhost:8000` command in the terminal:

```bash
> curl http://localhost:8000
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

And just like that we got to have our first Pod, create a tunnel to it and see that it works!


## Exercises:

1. Write a YAML file named `multi-container-pod.yaml` that defines a Pod having 2 containers: a container named `nginx-container`, but on port `3000`, that is the same as the one provided in the example, and another container named `busybox-container` that uses the `busybox` image and that provides it the next command: `/bin/sh -c echo BusyBox Hello! && sleep 3600'
    
    :::tip

    It is usually recommended to split commands into multiple parts as follows: first being the exectuable run (in our case `/bin/sh`) and aftewards each argument by itself (`-c`, `echo BusyBox Hello! && sleep 3600`).

    So in the end it looks like: `['/bin/sh', '-c', 'echo BusyBox Hello! && sleep 3600']` when you pass it to the container

    :::

    Create the resource using `kubectl apply`, create a tunnel to send a request and make sure it works when you request the webpage, and also check the logs of the Pod using the `kubectl logs` command

1. Write a YAML file named `resource-limited-pod.yaml` to define a pod with one container, `resource-limited-container`, using the `busybox` image, the `['/bin/sh', '-c', 'while true; do echo Hello Kubernetes!; sleep 5; done']` command and with the next resources:
    - Resource requests:
        - CPU: `100m`
        - Memory: `64Mi`
    - Resource limits:
        - CPU: `200m`
        - Memory: `128Mi`

    Create the Pod and monitor its usage using the `kubectl top` command

    Try running a resource-intensive command `yes > /dev/null` and observe the behavior of the Pod under resource limits

    :::tip

    When using minikube, make sure you enable the `metrics-server`: `> minikube addons enable metrics-server`

    :::

    :::tip

    To run commands inside Pods, you can make use of the `kubectl exec` command as follows:

    ```bash
    > kubectl exec -it __POD_NAME__ -- /bin/sh -c "echo Hello"
    ```

    :::