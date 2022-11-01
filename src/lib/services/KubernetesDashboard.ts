import { HelmService } from './HelmService';
import { logger } from '../utils/Logger';

export class KubernetesDashboard extends HelmService {
    public constructor() {
        super({
            serviceName: 'kubernetes-dashboard',
            namespace: 'kube-system',
            chartName: 'kubernetes-dashboard',
            chartVersion: '5.11.0',
            commandExampleDoc: 'a the kubernetes dashboard webui',
            set: [
                'ingress.enabled=true',
                `ingress.hosts[0]=dashboard.easykube.net`,
            ],
            ingressEndpoint: 'dashboard.easykube.net',
            helmRepositoryData: {
                repoName: 'kubernetes-dashboard',
                repoUrl: 'https://kubernetes.github.io/dashboard/',
            },
        });
    }
}
