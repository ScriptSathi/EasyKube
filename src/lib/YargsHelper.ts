import * as _ from 'lodash';

import { ServicesHook } from './hooks/ServicesHook';

export class YargsHelper {

    public serviceHook: ServicesHook = new ServicesHook();

    public get servicesOptions(): string[] {
        return this.serviceHook.options;
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
}
