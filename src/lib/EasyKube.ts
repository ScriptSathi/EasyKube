import * as _ from 'lodash';

import { Actions } from './actions/Action';
import { Context } from './Context';
import { InstallerHook } from './hooks/InstallerHook';
import { KubeCluster } from './KubeCluster';
import { logger } from './utils/Logger';

export class EasyKube extends Context {

    private installerHook: InstallerHook;
    private kubeCluster: KubeCluster;
    private actions: Actions;

    constructor(installerHook: InstallerHook, debugMode: boolean){
        super();
        this.setContext(debugMode);
        this.installerHook = installerHook;
        this.actions = new Actions(this.helmCommand, this.kubectlCommand, debugMode);
        this.kubeCluster = new KubeCluster(this.actions, this.kubeConfig);
    }

    public async install(option: string, isAModule: boolean = true): Promise<void> {
        if (await this.kubeCluster.isClusterAlreadyExist()){
            if (isAModule){
                if (option === 'all'){
                    await this.installCluster();
                    await this.installAllServices();
                }
                else if (option === 'cluster') {
                    await this.installCluster();
                } else {
                    this.moduleInstall(option);
                }
            } else {
                this.serviceInstall(option);
            }
        } else {
            await this.installCluster();
            await this.install(option);
        }
    }

    public async uninstall(option: string, isAModule: boolean = true): Promise<void> {
        if (await this.kubeCluster.isClusterAlreadyExist()){
            _.map(this.installerHook.servicesList, async service => {
                if (option === service.serviceName){
                    service.actions = this.actions;
                    await service.uninstall();
                }
            });
        } else {
            logger.info('Cluster has not been created yet !');
        }
    }

    public async deleteCluster(): Promise<void> {
        await this.kubeCluster.uninstall();
    }

    private async moduleInstall(option: string): Promise<void> {
        _.map(this.installerHook.modulesList, async module => {
            if (option === module.name){
                _.map(module.services, async service => {
                    service.actions = this.actions;
                    await service.install();
                });
            }
        });
    }

    private async serviceInstall(option: string): Promise<void> {
        _.map(this.installerHook.servicesList, async service => {
            if (option === service.serviceName){
                service.actions = this.actions;
                await service.install();
            }
        });
    }

    private async installCluster(): Promise<void> {
        await this.kubeCluster.install();
    }

    private async installAllServices(): Promise<void> {
        _.map(this.installerHook.servicesList, async service => {
            service.actions = this.actions;
            await service.install();
        });
    }
}
