import { HelmService } from './HelmService';
import { logger } from '../utils/Logger';

export class KubernetesDashboard extends HelmService {
    constructor() {
        super({
            serviceName: 'kubernetes-dashboard',
            namespace: 'kube-system',
            chartName: 'kubernetes-dashboard',
            version: '5.11.0',
            commandExampleDoc: 'a the kubernetes dashboard webui',
            set: [
                'ingress.enabled=true',
                `ingress.hosts[0]=dashboard.easykube.net`,
            ],
            ingressEndpoint: 'dashboard.easykub.net',
            helmRepositoryData: {
                repoName: 'kubernetes-dashboard',
                repoUrl: 'https://kubernetes.github.io/dashboard/',
            },
        });
    }

    public async install(): Promise<void> {
        await this.actions.helm.upgrade({ 
            namespace: this.namespace,
            repoName: this.helmRepositoryData.repoName,
            repoUrl: this.helmRepositoryData.repoUrl,
            chartName: this.chartName,
            version: this.version,
            setArgs: this.set,
        });
    }

    public async uninstall(): Promise<void> {
        logger.info('UNINSTALL');
        throw new Error('Method not implemented.');
    }
}
