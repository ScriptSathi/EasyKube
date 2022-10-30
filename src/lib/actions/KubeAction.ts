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
}
