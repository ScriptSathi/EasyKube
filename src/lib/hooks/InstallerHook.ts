import * as _ from 'lodash';

import { THelmService, HelmService } from '../services/HelmService';
import { KubernetesDashboard } from '../services/KubernetesDashboard';
import { MetricsServer } from '../services/MetricsServer';
import { TUnbuildmodules } from '../types/InstallerHooksTypes';

type Tmodule = {
    name: string;
    services: HelmService[];
};

type TmodulesList = Tmodule[];

export class InstallerHook {

    private static get UnbuildServicesList(): THelmService[] {
        return [
            MetricsServer,
            KubernetesDashboard,
        ];
    }

    private static get UnbuildModulesList(): TUnbuildmodules[] {
        return [
            {
                name: 'metrics',
                services: [
                    'metrics-server',
                    'kubernetes-dashboard',
                ],
            },
        ];
    }

    public servicesList: HelmService[];
    public modulesList: TmodulesList;

    constructor() {
        this.servicesList = this.buildServicesList();
        this.modulesList = this.buildModuleList();
    }

    private buildServicesList(): HelmService[] {
        return _.map(InstallerHook.UnbuildServicesList, (service) => {
            return new service();
        });
    }

    private buildModuleList(): TmodulesList {
        const modulesList: TmodulesList = []; 
        for (const module of InstallerHook.UnbuildModulesList) {
            const _module: Tmodule = {
                name: module.name,
                services: [],
            };
            for (const service of this.servicesList) {
                _.map(module.services, serviceName => {
                    if (service.serviceName === serviceName){
                        _module.services.push(service);
                    }
                });
            }
            modulesList.push(_module);
        }
        return modulesList;
    }
}
