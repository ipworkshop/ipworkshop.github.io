---
title: PodStatus
description: ''
unlisted: true
---

# [PodStatus](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodStatus)

The PodStatus represents the information about the status that a Pod is in. Status may TRAIL the actual state of a system, especially if the node that hosts the pod cannot contact the control plane.

Here, we remind the most important:

- phase:
    - type: `string` - `"Pending" | "Running" | "Succeeded" | "Failed" | "Unknown"`
    - description: summary of the pod lifecycle phase:
        - `Pending`: pod has been accepted by kubernetes, but one or more containers have not been started
        - `Running`: pod has been placed on a node, all containers have been created and at least one container is running, starting or restarting
        - `Succeeded`: all containers in the pod have been terminated successfully and will not be restarted 
        :::info

        While our main focus is on applications (well, containers and pods) that run indefinitely, there can be pods that run once

        :::
        - `Failed`: all containers in a pod have terminated, and at least one container terminated in a failure
        :::warning

        The `Failed` status appears, most of the time, when a pod has been restarted too frequently and has failed too frequently, as well

        :::
        - `Unknown`: the state of the pod could not be obtained. This usually happens because there is trouble communicated with the node where the pod should be running

- conditions:
    - type: [`Array<PodCondition>`](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.27/)
    - description: list of current observed conditions of the pod:
        - `Initialized`: all init containers have started successfully
        - `Ready`: the pod is able to serve requests and all containers are ready
        - `ContainersReady`: all containers in the pod are ready
        - `PodScheduled`: the pod has been scheduled to a node

- hostIP:
    - type: `string`
    - description: the IP address of the node where the pod is running

- podIP:
    - type: `string`
    - description: the IP address assigned to the pod

- startTime:
    - type: `string (timestamp)`
    - description: the time when the pod was acknowledged by the Kubernetes system

- containerStatuses:
    - type: [`Array<ContainerStatus>`](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.27/)
    - description: detailed information about the status of each container in the pod, including:
        - `name`: the name of the container
        - `state`: the current state of the container (`waiting`, `running`, or `terminated`)
        - `lastState`: details about the last terminated state of the container, if applicable
        - `ready`: a boolean indicating if the container is ready to serve requests
        - `restartCount`: the number of times the container has been restarted

- message:
    - type: `string`
    - description: a human-readable message indicating details about why the pod is in its current condition

- reason:
    - type: `string`
    - description: a brief CamelCase message indicating why the pod is in its current state
