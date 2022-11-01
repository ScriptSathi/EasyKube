import { CommandUtils } from '../utils/CommandUtils';
import { HelmAction } from './HelmAction';
import { KubeAction } from './KubeAction';

export class Actions {

    public debugMode: boolean;
    public helm: HelmAction;
    public kubectl: KubeAction;
    public utils: CommandUtils;

    constructor(helmCommand: string, kubectlCommand: string, debugMode: boolean){
        this.debugMode = debugMode;
        this.utils = new CommandUtils(helmCommand, kubectlCommand, debugMode);
        this.kubectl = new KubeAction(this.utils);
        this.helm = new HelmAction(this.utils);
    }
}
