import { HelmService } from '../HelmService';
import { logger } from '../utils/Logger';

export class MetricsServer extends HelmService {
    constructor() {
        super({
            serviceName: '',
            namespace: '',
            chartName: '',
            createNs: true,
            repoName: '',
            version: '',
            set: [''],
            helmRepositoryData: {
                repoName: '',
                repoUrl: '',
            },
        });
    }

    public install(): void {
        logger.info('INSTALL');
        throw new Error('Method not implemented.');
    }
    public uninstall(): void {
        logger.info('UNINSTALL');
        throw new Error('Method not implemented.');
    }
}
