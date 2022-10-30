# EasyKube
Create a developpement Kubernetes cluster and automate some service deployment

## Prerequisite:

- Install [Kind](https://kind.sigs.k8s.io/)
- kubectl (version >= 1.21)
- Helm (version > 3.7.1)

For now the new code is only on developpement branch.
You can tryit out running `npm i && npm i -g .`

## Usage

### Display documentation

```
easykube (-h)
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
### Install Helm

```bash
curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```
## Interact with the cluster

To don't break your cluster if you're already connecting to one of it, kind is installed on another place. So you need to configure kubectl to interact with it by default
- Without disconnecting from you current cluster
```bash
alias keasy="kubectl --kubeconfig=$HOME/.kube/conf-files/kind-easykube"
# Usage: klocal get pod
```
- Soit en remplaçant le fichier de config pour une interaction permanente
```bash
alias k-use-easykube="cp -T ~/.kube/conf-files/kind-easykube ~/.kube/config"
# Usage: k-use-local && kubectl get pod
```
