import * as _ from 'lodash';

import { helmRepositoryData } from './types/HelmServiceTypes';

interface IHelmServiceValues {
    serviceName: string;
    namespace: string;
    chartName: string;
    createNs: boolean;
    repoName: string;
    version: string;
    commandExampleDoc: string;
    set: [string];
    helmRepositoryData: helmRepositoryData;
}

class HelmServiceRaw implements IHelmServiceValues{
    public serviceName: string;
    public namespace: string;
    public chartName: string;
    public createNs: boolean = false;
    public repoName: string;
    public version: string;
    public commandExampleDoc: string;
    public set: [string];
    public helmRepositoryData: helmRepositoryData;
}

export class HelmService extends HelmServiceRaw {

    constructor(helmData: IHelmServiceValues) {
        super();
        _.assign(this, helmData);
    }

    /* eslint-disable-next-line  @typescript-eslint/no-empty-function */
    public install(): void {}
    /* eslint-disable-next-line  @typescript-eslint/no-empty-function */
    public uninstall(): void {}
}

export type THelmService = new () => HelmService;
