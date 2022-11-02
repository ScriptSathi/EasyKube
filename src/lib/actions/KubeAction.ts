import { Constants } from '../Constants';
import { CommandUtils } from '../utils/CommandUtils';

export class KubeAction {

    public debugMode: boolean = false;
    public kubectlCommand: string;
    public utils: CommandUtils;

    constructor(utils: CommandUtils){
        this.debugMode = utils.debugMode;
        this.kubectlCommand = utils.kubectlCommand;
        this.utils = utils;
    }

    public async wait(namespace: string, selector: string, timeout: number = 90): Promise<void> {
        await this.utils.execAndReturn(`${this.kubectlCommand} wait --namespace ${namespace} ` +
        `--for=condition=ready pod ` +
        `--selector=${selector} --timeout=${timeout}s`);
    }

    public async apply(filePath: string) : Promise<void> {
        await this.utils.spawnAndDisplay(`${this.kubectlCommand} apply -f=${filePath}`);
    }

    public async stop(namespace: string, serviceName: string, labelName: string, labelValue: string) : Promise<void> {
        const depType = await this.getDeploymentType(namespace, serviceName);
        await this.utils.spawnAndDisplay(`${this.kubectlCommand} scale ${depType} --namespace ${namespace} ` +
            `-l=${Constants.clusterName}_${labelName}=${labelValue} --replicas=0`);
    }

    public async start(namespace: string, serviceName: string, labelName: string, labelValue: string) : Promise<void> {
        const depType = await this.getDeploymentType(namespace, serviceName);
        await this.utils.spawnAndDisplay(`${this.kubectlCommand} scale ${depType} --namespace ${namespace} ` +
            `-l=${Constants.clusterName}_${labelName}=${labelValue} --replicas=1`);
    }

    public async addEasyKubeLabels(namespace: string, serviceName: string, moduleName: string = ''): Promise<void> {
        const depType = await this.getDeploymentType(namespace, serviceName);
        await this.utils.execAndReturn(`${this.kubectlCommand} label ${depType} ` +
            `--namespace ${namespace} ${serviceName} ${Constants.clusterName}_service=${serviceName}`);
        if (moduleName !== ''){
            await this.utils.execAndReturn(`${this.kubectlCommand} label ${depType} `+
            `--namespace ${namespace} ${serviceName} ${Constants.clusterName}_module=${moduleName}`);
        }
    }

    private async getDeploymentType(namespace: string, serviceName: string): Promise<string> {
        for (const depType of ['deployments', 'statefulsets', 'daemonsets']){
            try {
                await this.utils.execAndReturn(`${this.kubectlCommand} get ${depType} --namespace ${namespace} ` +
                `--no-headers=true --output=name ${serviceName}`);
                return depType;
            } catch (e){
                if (! e.message.match(`"${serviceName}" not found`)) {
                    throw e;
                }
            }
        }
        return '';
    }
}
