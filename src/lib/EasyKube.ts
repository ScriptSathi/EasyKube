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
                    this.installAllServices();
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
            if (isAModule){
                this.moduleUninstall(option);
            } else {
                this.serviceUninstall(option);
            }
        } else {
            logger.info('The cluster does not exists !');
        }
    }

    public async stop(option: string, isAModule: boolean = true){
        if (await this.kubeCluster.isClusterAlreadyExist()){
            if (isAModule){
                this.moduleStop(option);
            } else {
                this.serviceStop(option);
            }
        } else {
            logger.info('The cluster does not exists !');
        }
    }

    public async start(option: string, isAModule: boolean = true){
        if (await this.kubeCluster.isClusterAlreadyExist()){
            if (isAModule){
                this.moduleStart(option);
            } else {
                this.serviceStart(option);
            }
        } else {
            logger.info('The cluster does not exists !');
        }
    }

    public async deleteCluster(): Promise<void> {
        await this.kubeCluster.uninstall();
    }

    private moduleInstall(option: string): void {
        _.map(this.installerHook.modulesList, module => {
            if (option === module.name){
                _.map(module.services, async service => {
                    await service.install(this.actions);
                    this.actions.kubectl.addEasyKubeLabels(service.namespace, service.serviceName, module.name);
                });
            }
        });
    }

    private moduleUninstall(option: string): void {
        for (const module of this.installerHook.modulesList){
            if (module.name === option){
                _.map(module.services, async service => {
                    await service.uninstall(this.actions);
                });
            }
            logger.info(`The module ${option} has been uninstalled`);
        }
    }

    private moduleStop(option: string): void {
        for (const module of this.installerHook.modulesList){
            if (module.name === option){
                _.map(module.services, async service => {
                    await this.actions.kubectl.stop(service.namespace, service.serviceName, 'module', option);
                });
            }
            logger.info(`The module ${option} has been stopped`);
        }
    }

    private moduleStart(option: string): void {
        for (const module of this.installerHook.modulesList){
            if (module.name === option){
                _.map(module.services, async service => {
                    await this.actions.kubectl.start(service.namespace, service.serviceName, 'module', option);
                });
            }
            logger.info(`The module ${option} has been started`);
        }
    }

    private serviceUninstall(option: string): void {
        _.map(this.installerHook.servicesList, async service => {
            if (option === service.serviceName){
                await service.uninstall(this.actions);
            }
        });
        logger.info(`The service ${option} has been uninstalled`);
    }

    private serviceInstall(option: string): void {
        _.map(this.installerHook.servicesList, async service => {
            if (option === service.serviceName){
                await service.install(this.actions);
                this.actions.kubectl.addEasyKubeLabels(service.namespace, service.serviceName);
            }
        });
    }

    private serviceStop(option: string): void {
        _.map(this.installerHook.servicesList, async service => {
            if (option === service.serviceName){
                await this.actions.kubectl.stop(service.namespace, service.serviceName, 'service', option);
            }
        });
        logger.info(`The service ${option} has been stopped`);
    }

    private serviceStart(option: string): void {
        _.map(this.installerHook.servicesList, async service => {
            if (option === service.serviceName){
                await this.actions.kubectl.start(service.namespace, service.serviceName, 'service', option);
            }
        });
        logger.info(`The service ${option} has been started`);
    }

    private async installCluster(): Promise<void> {
        await this.kubeCluster.install();
    }

    private installAllServices(): void {
        _.map(this.installerHook.servicesList, async service => {
            await service.install(this.actions);
        });
    }
}
