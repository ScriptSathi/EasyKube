import * as _ from 'lodash';

import { Actions } from './actions/Action';
import { helmRepositoryData } from './types/HelmServiceTypes';

interface IHelmServiceValues {
    serviceName: string;
    namespace: string;
    chartName: string;
    repoName: string;
    version: string;
    set: string[];
    helmRepositoryData: helmRepositoryData;
    commandExampleDoc?: string;
    createNs?: boolean;
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
    public actions: Actions;
}

export class HelmService extends HelmServiceRaw {

    constructor(helmData: IHelmServiceValues) {
        super();
        _.assign(this, helmData);
    }

    /* eslint-disable-next-line  @typescript-eslint/no-empty-function */
    public async install(): Promise<void> {}
    /* eslint-disable-next-line  @typescript-eslint/no-empty-function */
    public async uninstall(): Promise<void> {}
}

export type THelmService = new () => HelmService;
