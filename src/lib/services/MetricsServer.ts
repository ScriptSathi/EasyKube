import { HelmService } from '../HelmService';
import { logger } from '../utils/Logger';

export class MetricsServer extends HelmService {
    constructor() {
        super({
            serviceName: 'metrics-server',
            namespace: 'kube-system',
            chartName: 'metrics-server',
            createNs: false,
            repoName: 'metrics-server',
            version: '3.7.0',
            commandExampleDoc: 'a metric server to view cluster ressources',
            set: [
                'args[0]="--kubelet-insecure-tls=true"',
                'args[1]="--kubelet-preferred-address-types=InternalIP"',
            ],
            helmRepositoryData: {
                repoName: 'metrics-server',
                repoUrl: 'https://kubernetes-sigs.github.io/metrics-server/',
            },
        });
    }

    public async install(): Promise<void> {
        await this.actions.helm.upgrade({ 
            namespace: this.namespace,
            repoName: this.repoName,
            repoUrl: this.helmRepositoryData.repoUrl,
            chartName: this.chartName,
            version: this.version,
            setArgs: this.set,
        })
    }

    public async uninstall(): Promise<void> {
        logger.info('UNINSTALL');
        throw new Error('Method not implemented.');
    }
}
