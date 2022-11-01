import { spawn, SpawnOptions, exec } from 'child_process';
import * as _ from 'lodash';

import { logger } from '../utils/Logger';
import { CommandUtilsError } from './CommandUtilsError';
import { TspawnOptions } from '../types/CommandUtilsTypes';

export class CommandUtils {

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
                reject(CommandUtils.checkStderr(data.toString()));
            });

            proc.on('close', (code: number) => {
                if (code !== 0) {
                    reject(new Error(`Command '${cmd}' failed with code ${code}`));
                }
                resolve(output);
            });
        });
    }

    public static checkStderr(stderr: string): CommandUtilsError {
        if (stderr.match(/already exist for a cluster/)) {
            return new CommandUtilsError(CommandUtilsError.CODES.CLUSTER_ALREADY_EXISTS, 'Cluster already exists');
        } else if (stderr.match(/failed to create secret secrets/)) {
            return new CommandUtilsError(CommandUtilsError.CODES.DOCKER_REGISTRY_SECRET_ALREADY_EXISTS, 'Docker Registry secret already exists');
        } else if (stderr.match(/namespaces "linkerd" already exists/)) {
            return new CommandUtilsError(CommandUtilsError.CODES.LINKERD_ALREADY_EXISTS, 'Linkerd already exists');
        } else {
            return new CommandUtilsError(CommandUtilsError.CODES.UNKNOW_ERROR, 'An unexpected error occurred\n' + stderr);
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
        await CommandUtils.spawn(cmd, spawnOptions);
    }

    public async execAndReturn(cmd: string, cwd?: string): Promise<string> {
        this.debugMode && logger.info(`Executed command: ${cmd}`);
        const stdout = await CommandUtils.exec(cmd, cwd);
        return _.trimEnd(stdout);
    }

    public async execAndDisplay(cmd: string, cwd?: string): Promise<void> {
        const stdout = await this.execAndReturn(cmd, cwd);
        logger.info(stdout);
    }
}
