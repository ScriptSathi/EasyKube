import { HelmService } from '../HelmService';
import { logger } from '../utils/Logger';

export class MetricsServer extends HelmService {
    constructor() {
        super({
            serviceName: 'metrics-server',
            namespace: 'kube-system',
            chartName: 'metrics-server',
            createNs: true,
            repoName: '',
            version: '',
            commandExampleDoc: 'a metric server to view cluster ressources',
            set: [''],
            helmRepositoryData: {
                repoName: '',
                repoUrl: '',
            },
        });
    }

    public install(): void {
        logger.info('from Metrics Server');
        throw new Error('Method not implemented.');
    }
    public uninstall(): void {
        logger.info('UNINSTALL');
        throw new Error('Method not implemented.');
    }
}
