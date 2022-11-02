import * as _ from 'lodash';

import { InstallerHook } from './hooks/InstallerHook';
import { logger } from './utils/Logger';

export class YargsHelper {

    public commandAliasesList = {
        install: ['i', 'in'],
        uninstall: ['rm', 'un'],
        start: ['up', 'u'],
        stop: ['down', 'd'],
    }

    public serviceHook: InstallerHook = new InstallerHook();

    public get servicesOptions(): string[] {
        return _.map(this.serviceHook.servicesList, (service) => {
            return service.serviceName;
        });
    }

    public get modulesOptions(): string[] {
        return ['all', 'cluster'].concat(_.map(this.serviceHook.modulesList, (service) => {
            return service.name;
        }));
    }

    public serviceExamples(cmd: string): ReadonlyArray<[string, string]> {
        const cmd_upper = cmd.charAt(0).toUpperCase() + cmd.slice(1);
        return _.map(this.serviceHook.servicesList, service => {
            return [
                `$0 ${cmd} ${service.serviceName}`,
                `${cmd_upper} ${service.serviceName}, ${service.commandExampleDoc}`,
            ];
        });
    }

    public modulesExamples(cmd: string): ReadonlyArray<[string, string]> {
        const cmd_upper = cmd.charAt(0).toUpperCase() + cmd.slice(1);
        return _.map(this.serviceHook.modulesList, module => {
            const servicesInModule = _.map(module.services, service => {
                return service.serviceName;
            }).join(', ');
            return [
                `$0 ${cmd} ${module.name}`,
                `${cmd_upper} the ${module.name} module which include the services: ${servicesInModule}`,
            ];
        });
    }

    public mainCommandsDetails(cmd: string){
        return [`${cmd} <module|service>`].concat(this.commandAliasesList[cmd]);
    }

    public getNameFromAlias(cmd: string): string {
        for (const key in this.commandAliasesList) {
            for (const alias of this.commandAliasesList[key]){
                if (cmd === alias) {
                    return key;
                }
            }
        }
        return '';
    }
}
