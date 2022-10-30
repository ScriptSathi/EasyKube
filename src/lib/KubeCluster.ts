interface IextraMount {
    hostPath: string;
    containerPath: string;
}

interface IextraPortMapping {
    containerPort: number;
    hostPort: number;
    protocol: string;
}
interface IKubeCluster {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    [key: string]: any;
}

export class KubeCluster {
    public get config(): IKubeCluster {
        return {
            kind: 'Cluster',
            apiVersion: 'kind.x-k8s.io/v1alpha4',
            networking: { 
                apiServerAddress: '127.0.0.1', 
                apiServerPort: 6443, 
            },
            nodes: [
                {
                    role: 'control-plane',
                    kubeadmConfigPatches: [
                        'kind: InitConfiguration\n' +
                            'nodeRegistration:\n' +
                            '  kubeletExtraArgs:\n' +
                            '    node-labels: "ingress-ready=true"',
                    ],
                    extraPortMappings: [
                        { 
                            containerPort: 80,
                            hostPort: 80,
                            protocol: 'TCP',
                        },
                        {
                            containerPort: 443,
                            hostPort: 443,
                            protocol: 'TCP',
                        },
                        this.extraPortMapping(0, 0),
                    ],
                },
                {
                    role: 'worker',
                    extraMounts: [
                        {
                            hostPath: '/usr/share/zoneinfo',
                            containerPath: '/usr/share/zoneinfo',
                        },
                        this.extraMounts(),
                    ],
                },
            ],
        };
    }

    private extraMounts(hostPath: string = ''): IextraMount | {} {
        // TODO Do this
        const mountCodeInTheCluster = false;
        if (mountCodeInTheCluster){
            return {
                hostPath,
                containerPath: '/directory-mount-on-workers',
            };
        }
        return {};
    }

    private extraPortMapping(hostPort: number, containerPort: number): IextraPortMapping | {} {
        const mongoDBNeedToBeExposed = false;
        if (mongoDBNeedToBeExposed) {
            return {
                containerPort,
                hostPort,
                protocol: 'TCP',
            };
        }
        return {};
    }
}
