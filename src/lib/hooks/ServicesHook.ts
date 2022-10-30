import * as _ from 'lodash';

import { THelmService, HelmService } from '../HelmService';
import { MetricsServer } from '../services/MetricsServer';

export class ServicesHook {

    private static get helmServicesList(): THelmService[] {
        return [
            MetricsServer,
        ];
    }

    public servicesList: HelmService[];

    constructor() {
        this.servicesList = this.buildServicesList();
    }

    private buildServicesList(): HelmService[] {
        return _.map(ServicesHook.helmServicesList, (service) => {
            return new service();
        });
    }

    public get options(): string[] {
        return ['all', 'cluster'].concat(_.map(this.servicesList, (service) => {
            return service.serviceName;
        }));
    }
}
