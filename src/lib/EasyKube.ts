import * as _ from 'lodash';

import { Actions } from './actions/Action';
import { Context } from './Context';
import { HelmService } from './HelmService';
import { KubeCluster } from './KubeCluster';
import { logger } from './utils/Logger';

export class EasyKube extends Context {

    private services: HelmService[];
    private kubeCluster: KubeCluster;
    private actions: Actions;

    constructor(services: HelmService[], debugMode: boolean){
        super();
        this.setContext(debugMode);
        this.services = services;
        this.actions = new Actions(this.helmCommand, this.kubectlCommand, debugMode);
        this.kubeCluster = new KubeCluster(this.actions, this.kubeConfig);
    }

    public async install(option: string): Promise<void> {
        if (option === 'all'){
            await this.installCluster();
            await this.installAllServices();
        }
        else if (option === 'cluster') {
            await this.installCluster();
        }
        else if (await this.kubeCluster.isClusterAlreadyExist()){
            _.map(this.services, service => {
                if (option === service.serviceName){
                    service.install();
                }
            });
        } else {
            await this.installCluster();
            await this.install(option);
        }
    }

    public async uninstall(option: string): Promise<void> {
        if (await this.kubeCluster.isClusterAlreadyExist()){
            _.map(this.services, service => {
                if (option === service.serviceName){
                    service.uninstall();
                }
            });
        } else {
            logger.info('Cluster has not been created yet !');
        }
    }

    public async deleteCluster(): Promise<void> {
        await this.kubeCluster.uninstall();
    }

    private async installCluster(): Promise<void> {
        await this.kubeCluster.install();
    }

    private async installAllServices(): Promise<void> {
        _.map(this.services, service => {
            service.install();
        });
    }
}
