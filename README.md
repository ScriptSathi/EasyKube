# EasyKube
Create a developpement Kubernetes cluster and automate some service deployment

## Prerequisite:

- Node (v14 or higher) and npm
- Install [Kind](https://kind.sigs.k8s.io/) binary 
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/) (version >= 1.21)
- [Helm](https://helm.sh/docs/intro/install/#from-script) (version > 3.7.1)

## Installation

## Build the project
You can try it out running `npm i && npm i -g .`

### Compiling the code

```
npm run compile
```

## Usage

### Display documentation

### If you have installed the CLI

```
easykube (-h)
```
### Without installing the CLI

```
node bin/index.js -h
```

### Install all components

```
easykube install all
```

## Install Prerequisite
### Install [Kind](https://kind.sigs.k8s.io/)

```bash
cd /tmp && \
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.11.1/kind-linux-amd64 && \
chmod +x ./kind && \
sudo ln -s ./kind /usr/local/bin/kind && \
cd -
```
### Install [Helm](https://helm.sh/docs/intro/install/#from-script) (version > 3.7.1)

```bash
curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```
## Interact with the cluster

To don't break your cluster if you're already connecting to one of it, kind is installed on another place. So you need to configure kubectl to interact with it by default
- Without disconnecting from you current cluster
```bash
alias keasy="kubectl --kubeconfig=$HOME/.kube/conf-files/kind-easykube"
# Usage: keasy get pod
```
- Soit en remplaçant le fichier de config pour une interaction permanente
```bash
alias kuse-easykube="cp -T ~/.kube/conf-files/kind-easykube ~/.kube/config"
# Usage: kuse-local && kubectl get pod
```
