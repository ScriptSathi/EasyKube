import * as _ from 'lodash';

import { Actions } from '../actions/Action';
import { helmRepositoryData } from '../types/HelmServiceTypes';

interface IHelmServiceValues {
    serviceName: string;
    namespace: string;
    chartName: string;
    chartVersion: string;
    set: string[];
    helmRepositoryData: helmRepositoryData;
    ingressEndpoint?: string;
    commandExampleDoc?: string;
    createNs?: boolean;
}

class HelmServiceRaw implements IHelmServiceValues{
    public serviceName: string;
    public namespace: string;
    public chartName: string;
    public chartVersion: string;
    public commandExampleDoc: string;
    public set: [string];
    public helmRepositoryData: helmRepositoryData;
    public actions: Actions;
    public createNs: boolean = false;
    public ingressEndpoint: string = '';
}

export class HelmService extends HelmServiceRaw {

    public  constructor(helmData: IHelmServiceValues) {
        super();
        _.assign(this, helmData);
    }

    public async install(): Promise<void> {
        await this.actions.helm.upgrade({ 
            namespace: this.namespace,
            repoName: this.helmRepositoryData.repoName,
            repoUrl: this.helmRepositoryData.repoUrl,
            chartName: this.chartName,
            chartVersion: this.chartVersion,
            setArgs: this.set,
        });
    }

    public async uninstall(): Promise<void> {
        this.actions.helm.uninstall(this.chartName, this.namespace);
    }
}

export type THelmService = new () => HelmService;
