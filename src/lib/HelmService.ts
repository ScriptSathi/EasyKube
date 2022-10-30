import * as _ from 'lodash';

import { helmRepositoryData } from './types/HelmServiceTypes';

export class HelmServiceRaw {
    public serviceName: string;
    public namespace: string;
    public chartName: string;
    public createNs: boolean;
    public repoName: string;
    public version: string;
    public set: [string];
    public helmRepositoryData: helmRepositoryData;
}

export abstract class HelmService extends HelmServiceRaw {
    constructor(helmData: HelmServiceRaw) {
        super();
        _.assign(this, helmData);
    }

    public abstract install(): void;
    public abstract uninstall(): void;
}
