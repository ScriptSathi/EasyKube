import * as _ from 'lodash';

import { helmUpgrade } from '../types/HelmActionTypes';
import { CommandUtils } from '../utils/CommandUtils';

export class HelmAction {

    public debugMode: boolean = false;
    public helmCommand: string;
    public utils: CommandUtils;

    constructor(utils: CommandUtils){
        this.debugMode = utils.debugMode;
        this.helmCommand = utils.helmCommand;
        this.utils = utils;
    }

    public async upgrade({ 
        namespace,
        repoName,
        repoUrl,
        chartName,
        manifestDir,
        chartVersion,
        dependencyUpdate,
        setArgs = [],
        createNs  = false,
        _wait = false, 
        timeout = 90, 
    }: helmUpgrade): Promise<void> {
        function buildSetArgs(setArgsArr: string[]): string {
            let _setArgs = '';
            _.forEach(setArgsArr, arg => {
                _setArgs += `--set=${arg} `;
            });
            return _setArgs;
        }
        const waitCmd = _wait ? `--timeout=${timeout}s --wait` : '';
        const createNsCmd = createNs ? '--create-namespace ' : '';
        const chart = manifestDir ? manifestDir : `${repoName}/${chartName}`;
        const chartVersionCmd = chartVersion ? `--version=${chartVersion} ` : '';

        if (dependencyUpdate){
            this.utils.execAndReturn(`${this.helmCommand} dependency update`, manifestDir);
        }
        try {
            await this.utils.execAndDisplay(`${this.helmCommand} upgrade -i ${chartName} ${chart} ` +
                `--namespace=${namespace} ` +
                `${createNsCmd}` +
                `${chartVersionCmd}`+
                `${buildSetArgs(setArgs)} ` +
                `${waitCmd}`,
            );
        }
        catch (e){
            if (e.message.match(`repo ${repoName} not found`)){
                await this.helmInstallRepository(repoName, repoUrl);
                await this.upgrade(
                    { namespace, repoName, repoUrl, chartName, manifestDir, chartVersion, dependencyUpdate, setArgs, createNs, _wait,  timeout },
                );
            }
        }
    }

    public async install(options: helmUpgrade) {
        this.upgrade(options);
    }

    public async uninstall(chartName: string, namespace: string): Promise<void> {
        await this.utils.execAndDisplay(`${this.helmCommand} uninstall -n ${namespace} ${chartName}`);
    }

    private async helmInstallRepository(repoName: string, url: string): Promise<void>{
        await this.utils.execAndDisplay(`${this.utils.helmCommand} repo add ${repoName} ${url}`);
        await this.utils.execAndDisplay(`${this.utils.helmCommand} repo update ${repoName}`);
    }
}
