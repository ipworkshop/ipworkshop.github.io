---
id: kubernetes-setup
title: Kubernetes Setup
description: Setting up a local Kubernetes environment
slug: /kubernetes/setup
sidebar_position: 2
---

# Kubernetes Setup

## Installing Minikube

   https://minikube.sigs.k8s.io/docs/start

## Installing kubectl

   https://kubernetes.io/docs/tasks/tools/

   Don't forget autocompletion!

## Setting up a Local Kubernetes Cluster

1. Start Minikube:

    ```shell
    > minikube start
    ```

    :::warning

    If you have `VirtualBox` or `VMWare`(?), minikube defaults to using them over docker. This might be fine on your machine, but for some this operation will fail due to some configuration issues inside the BIOS. The simple solution is to tell minikube to use `docker` as the driver.

    ```shell
    > minikube start --driver=docker
    ```

    :::

2. Verify the cluster status:

    ```shell
    > minikube status
    > kubectl cluster-info
    ```

3. Enable necessary addons:

    ```shell
    > minikube addons enable ingress
    > minikube addons enable dashboard
    ```

4. Access the Kubernetes dashboard:
    
    ```shell
    > minikube dashboard
    ```

5. Deploy a sample application:

    ```shell
    > kubectl create deployment hello-minikube --image=k8s.gcr.io/echoserver:1.10
    > kubectl expose deployment hello-minikube --type=NodePort --port=8080
    ```

6. Access the deployed application:

    ```shell
    > minikube service hello-minikube
    ```

    A browser should have launched showing you some information about the sample application. Optionally, you can play with the app using `curl`:

    ```shell
    > curl 127.0.0.1:<YOUR PORT HERE> -d "edit me"
    ```

7. Clean up:

    ```shell
    > kubectl delete service hello-minikube
    > kubectl delete deployment hello-minikube
    ```

8. Stop the Minikube cluster:

    ```shell
    > minikube stop
    ```