import * as got from 'got';

import { logger } from '../utils/Logger';

export class KubePolling {
    public static async waitServiceRunning(url: string, serviceName: string): Promise<void> {
        logger.info(`- Requesting service ${serviceName} : ${url}`);

        while (! await this.isServiceRunning(url)) {
            logger.info('- still trying to connect to', serviceName);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        logger.info('started ', serviceName);
    }

    public static async isServiceRunning(url: string): Promise<boolean> {
        try {
            const response = await got.default(url);
            return response.statusCode === 200;
        } catch (e) {
            return false;
        }
    }
}
