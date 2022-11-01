import { HelmService } from './HelmService';

export class MetricsServer extends HelmService {
    constructor() {
        super({
            serviceName: 'metrics-server',
            namespace: 'kube-system',
            chartName: 'metrics-server',
            chartVersion: '3.7.0',
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
}
