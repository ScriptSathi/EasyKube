import { spawn, SpawnOptions, exec } from 'child_process';
import * as _ from 'lodash';

import { logger } from '../utils/Logger';
import { KubeUtilsError } from './KubeUtilsError';
import { helmUpgrade, TspawnOptions } from '../types/KubeUtilsTypes';

export class KubeUtils {

    public static async staticExecAndReturn(cmd: string, debug: boolean, cwd?: string): Promise<string> {
        debug && logger.info(`Executed command: \n${cmd}`);
        const stdout = await this.exec(cmd, cwd);
        return _.trimEnd(stdout);
    }
    public static async exec(cmd: string, cwd: string = process.cwd()): Promise<string> {
        const maxBuffer = 256 * 1024 * 1024;
        const encoding = 'utf8';

        return new Promise((resolve, reject) => {
            let code: string | number;

            const proc = exec(cmd, {
                maxBuffer,
                cwd,
                encoding,
            }, (error: Error, stdout: string, stderr: string) => {
                if (error) {
                    if (proc.killed) {
                        reject(new Error(code + cmd + 'process killed; ' + stderr));
                    } else {
                        reject(new Error(code +  cmd + stderr));
                    }
                } else {
                    resolve(stdout);
                }
            });

            proc.on('exit', (_code: number) => {
                code = _code;
            });
        });
    }

    private static spawn(stringCommand: string, { stdio, debug }: TspawnOptions): Promise<string> {
        return new Promise((resolve, reject) => {
            let { output, cmd }: { output: string; cmd: string[] } = { output: '', cmd: stringCommand.split(' ') };

            cmd = cmd.filter(n => n);
            const args: string[] = cmd.splice(1);

            const options: SpawnOptions = {};
            stdio ? options.stdio = [0, 1, 'pipe'] : options.stdio = [0, 1, 2];

            const proc = spawn(cmd[0], args, options);
            debug && logger.info(`Executed command: ${stringCommand}`);

            proc.stderr && proc.stderr.on('data', (data: Buffer) => {
                output = output + data.toString();
                reject(KubeUtils.checkStderr(data.toString()));
            });

            proc.on('close', (code: number) => {
                if (code !== 0) {
                    reject(new Error(`Command '${cmd}' failed with code ${code}`));
                }
                resolve(output);
            });
        });
    }

    public static checkStderr(stderr: string): KubeUtilsError {
        if (stderr.match(/already exist for a cluster/)) {
            return new KubeUtilsError(KubeUtilsError.CODES.CLUSTER_ALREADY_EXISTS, 'Cluster already exists');
        } else if (stderr.match(/failed to create secret secrets/)) {
            return new KubeUtilsError(KubeUtilsError.CODES.DOCKER_REGISTRY_SECRET_ALREADY_EXISTS, 'Docker Registry secret already exists');
        } else if (stderr.match(/namespaces "linkerd" already exists/)) {
            return new KubeUtilsError(KubeUtilsError.CODES.LINKERD_ALREADY_EXISTS, 'Linkerd already exists');
        } else {
            return new KubeUtilsError(KubeUtilsError.CODES.UNKNOW_ERROR, 'An unexpected error occurred\n' + stderr);
        }
    }

    public debugMode: boolean = false;
    public helmCommand: string;
    public kubectlCommand: string;

    constructor(helmCommand: string, kubectlCommand: string, debugMode: boolean){
        this.debugMode = debugMode;
        this.kubectlCommand = kubectlCommand;
        this.helmCommand = helmCommand;
    }

    public async spawnAndDisplay(cmd: string, stdio?: boolean): Promise<void> {
        const spawnOptions: TspawnOptions = {
            stdio,
            debug: this.debugMode,
        };
        await KubeUtils.spawn(cmd, spawnOptions);
    }

    public async execAndReturn(cmd: string, cwd?: string): Promise<string> {
        this.debugMode && logger.info(`Executed command: ${cmd}`);
        const stdout = await KubeUtils.exec(cmd, cwd);
        return _.trimEnd(stdout);
    }

    public async execAndDisplay(cmd: string, cwd?: string): Promise<void> {
        const stdout = await this.execAndReturn(cmd, cwd);
        logger.info(stdout);
    }

    public async helmUpgrade({ 
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
            this.execAndReturn(`${this.helmCommand} dependency update`, manifestDir);
        }
        try {
            await this.execAndDisplay(`${this.helmCommand} upgrade -i ${chartName} ${chart} ` +
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
                await this.helmUpgrade({ namespace, repoName, chartName, manifestDir, version, dependencyUpdate, args, createNs, _wait,  timeout }) ;
            }
        }
    }

    public async helmUninstall(chartName: string, namespace: string): Promise<void> {
        await this.execAndDisplay(`${this.helmCommand} uninstall -n ${namespace} ${chartName}`);
    }

    public async kubectlWait(namespace: string, selector: string, timeout: number = 90): Promise<void> {
        await this.execAndReturn(`${this.kubectlCommand} wait --namespace ${namespace} \
         --for=condition=ready pod \
         --selector=${selector} --timeout=${timeout}s`);
    }

    private async helmInstallRepository(repoName: string, url?: string): Promise<void>{
        async function installRepoAndUpdate(utils: KubeUtils, _repoName: string, _url: string): Promise<void> {
            await utils.execAndDisplay(`${utils.helmCommand} repo add ${_repoName} ${_url}`);
            await utils.execAndDisplay(`${utils.helmCommand} repo update ${_repoName}`);
        }
        if (url){
            this.execAndReturn(`${this.helmCommand} repo add ${repoName} ${url}`);
            installRepoAndUpdate(this, repoName, url);
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
            await installRepoAndUpdate(this, repoName, _url);
        }
    }
}
