import * as _ from 'lodash';

import { logger } from '../utils/Logger';
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
        chartName,
        manifestDir,
        version,
        dependencyUpdate,
        args = [],
        createNs  = false,
        _wait = false, 
        timeout = 90, 
    }: helmUpgrade): Promise<void> {
        function buildArgs(argsArr: string[]): string {
            let _args = '';
            _.forEach(argsArr, arg => {
                _args += `--set=${arg} `;
            });
            return _args;
        }
        const waitCmd = _wait ? `--timeout=${timeout}s --wait` : '';
        const createNsCmd = createNs ? '--create-namespace ' : '';
        const chart = manifestDir ? manifestDir : `${repoName}/${chartName}`;
        const versionCmd = version ? `--version=${version} ` : '';

        if (dependencyUpdate){
            this.utils.execAndReturn(`${this.helmCommand} dependency update`, manifestDir);
        }
        try {
            await this.utils.execAndDisplay(`${this.helmCommand} upgrade -i ${chartName} ${chart} ` +
                `--namespace=${namespace} ` +
                `${createNsCmd}` +
                `${versionCmd}`+
                `${buildArgs(args)} ` +
                `${waitCmd}`,
            );
        }
        catch (e){
            if (!e.message.match(/coalesce.go:199:/g) && repoName){
                await this.helmInstallRepository(repoName);
                await this.upgrade({ namespace, repoName, chartName, manifestDir, version, dependencyUpdate, args, createNs, _wait,  timeout }) ;
            }
        }
    }

    public async install(options: helmUpgrade) {
        this.upgrade(options);
    }

    public async uninstall(chartName: string, namespace: string): Promise<void> {
        await this.utils.execAndDisplay(`${this.helmCommand} uninstall -n ${namespace} ${chartName}`);
    }

    private async helmInstallRepository(repoName: string, url?: string): Promise<void>{
        async function installRepoAndUpdate(utils: CommandUtils, _repoName: string, _url: string): Promise<void> {
            await utils.execAndDisplay(`${utils.helmCommand} repo add ${_repoName} ${_url}`);
            await utils.execAndDisplay(`${utils.helmCommand} repo update ${_repoName}`);
        }
        if (url){
            this.utils.execAndReturn(`${this.helmCommand} repo add ${repoName} ${url}`);
            installRepoAndUpdate(this.utils, repoName, url);
        }
        else {
            let _url: string = '';
            switch (repoName) {
            case 'jetstack':
                _url = 'https://charts.jetstack.io';
                break;
            case 'bitnami':
                _url = 'https://charts.bitnami.com/bitnami';
                break;
            case 'metrics-server':
                _url = 'https://kubernetes-sigs.github.io/metrics-server/';
                break;
            default:
                _url = 'http://localhost';
                logger.info(`Fail to install repository ${repoName}`);
                break;
            }
            await installRepoAndUpdate(this.utils, repoName, _url);
        }
    }
}
