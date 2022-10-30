import { Actions } from './actions/Action';
import { Constants } from './Constants';
import { FileGenerator } from './utils/FileGenerator';
import { logger } from './utils/Logger';

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

    private actions: Actions;
    private kubeConfig: string;

    constructor(actions: Actions, kubeConfig: string) {
        this.actions = actions;
        this.kubeConfig = kubeConfig;
    }

    public async install(): Promise<void> {
        const fileGenerator = new FileGenerator(Constants.clusterName, Constants.generationFolderPath);
        await fileGenerator.generateYaml(this.config);

        logger.info('Create cluster');
        if (! await this.isClusterAlreadyExist()) {
            await this.actions.utils.spawnAndDisplay(
                `kind create cluster --image=kindest/node:v1.22.4 ` +
                `--name=${Constants.clusterName} ` +
                `--kubeconfig=${this.kubeConfig} ` +
                `--config=${fileGenerator.filePath}`,
                false,
            );
        }
        await this.createIngressController();
    }

    public async uninstall(): Promise<void> {
        logger.info('Delete cluster');
        this.actions.utils.execAndReturn(`kind delete clusters ` + 
            `--kubeconfig=${this.kubeConfig} ${Constants.clusterName}`);
    }

    public async isClusterAlreadyExist(): Promise<boolean> {
        let isRunning: string = '';
        try {
            const command = `docker inspect ${Constants.clusterName}-control-plane`;
            const inspectRes = JSON.parse(await this.actions.utils.execAndReturn(command));
            isRunning = inspectRes[0].State.Status;
        } catch (e) {
            if (!e.message.match(`No such object: ${Constants.clusterName}-control-plane`)) {
                throw e;
            }
        }
        return isRunning === 'running';
    }

    private async createIngressController(): Promise<void> {
        logger.info('Create Ingress Controller');
        await this.actions.kubectl.apply(
            'https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.0/deploy/static/provider/kind/deploy.yaml',
        );
        logger.info('Wait for Ingress Controller to start');
        await this.actions.kubectl.wait('ingress-nginx', 'app.kubernetes.io/component=controller', 120);
    }

    private get config(): IKubeCluster {
        const config = {
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
                    ],
                },
                {
                    role: 'worker',
                    extraMounts: [
                        {
                            hostPath: '/usr/share/zoneinfo',
                            containerPath: '/usr/share/zoneinfo',
                        },
                    ],
                },
            ],
        };

        // TODO DeadCode, need to be implem
        const mongoDBNeedToBeExposed = false;
        const mountCodeInTheCluster = false;
        if (mongoDBNeedToBeExposed){
            config.nodes[0].extraPortMappings?.push(this.extraPortMapping(0, 0));
        }
        if (mountCodeInTheCluster){
            config.nodes[0].extraMounts?.push(this.extraMounts());
        }

        return config;
    }

    private extraMounts(hostPath: string = ''): IextraMount {
        // TODO Do this
        return {
            hostPath,
            containerPath: '/directory-mount-on-workers',
        };
    }

    private extraPortMapping(hostPort: number, containerPort: number): IextraPortMapping {
        return {
            containerPort,
            hostPort,
            protocol: 'TCP',
        };
    }
}
