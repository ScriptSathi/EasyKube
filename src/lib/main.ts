#!/usr/bin/env node

import * as yargs from 'yargs';
import * as _ from 'lodash';

import { logger } from './utils/Logger';
import { YargsHelper } from './YargsHelper';
import { EasyKube } from './EasyKube';

function main(): void {

    const yargsHelper = new YargsHelper();
    let easyKubeInstaller: EasyKube;

    const argv = yargs
        .commandDir('commands')

        .command(['install <module|service>', '$1'],
            `Install a module or a service on the cluster`, 
            (args: yargs.Argv) => {
                return args
                    .commandDir('commands')
                    .demandCommand()
                    .strict(true)
                    .showHelpOnFail(true);
        })
        .command(['uninstall <module|service>', '$1'],
            `Uninstall a module or a service on the cluster`, 
            (args: yargs.Argv) => {
                return args
                    .commandDir('commands')
                    .demandCommand()
                    .strict(true)
                    .showHelpOnFail(true);
        })
        .command(['stop [name]', '$1'],
            `Allow you to stop a running microservice or full domain of microservices`,
            (args: yargs.Argv) => {
                return args
                    .example([
                        ['$0 stop rabbitmq', 'Stop rabbitmq'],
                        ['$0 stop --label=domaine test-service', 'Stop all running services matching test-service label'],
                    ])
                    .positional('name', {
                        describe: `The microservice name to stop`,
                        type: 'string',
                        nargs: 1,
                        demandOption: true,
                    })
                    .option('label', {
                        describe: `The microservice label name to stop
                        available arguments:
                        -  app (single application to stop)
                        -  domaine (the all group bound to the microservice)
                        Default value: "app"`,
                        type: 'string',
                        nargs: 1,
                        default: 'app',
                    });
            }, async (_argv: yargs.Arguments<{label: string; name: string}>) => {
                if (_argv.option !== '') {
                    // TODO
                } else {
                    logger.info(_argv.option);
                    yargs.showHelp();
                    process.exit(1);
                }
        })
        .command(['start [name]', '$1'],
            `Allow you to start a stopped microservice or full domain of microservices`,
            (args: yargs.Argv) => {
                return args
                    .example([
                        ['$0 start rabbitmq', 'Start rabbitmq'],
                        ['$0 start --label=domaine test-service', 'Start all stopped services matching test-service label'],
                    ])
                    .positional('name', {
                        describe: `The microservice name to start`,
                        type: 'string',
                        nargs: 1,
                        demandOption: true,
                    })
                    .option('label', {
                        describe: `The microservice label name to start
                        available arguments:
                        -  app (single application to stop)
                        -  domaine (the all group bound to the microservice)
                        Default value: "app"`,
                        type: 'string',
                        nargs: 1,
                        default: 'app',
                    });
            }, async (_argv: yargs.Arguments<{label: string; name: string}>) => {
                if (_argv.option !== '') {
                    // TODO
                } else {
                    logger.info(_argv.option);
                    yargs.showHelp();
                    process.exit(1);
                }
        })
        .command('destroy-cluster', 'Destroy the kubernetes cluster',
            _.noop, async () => {
                await easyKubeInstaller.deleteCluster();
        })
        .option('debug', {
            alias: 'd',
            describe: `Activate debug mode to display every executed commands`,
            type: 'boolean',
            default: false,
            })
        .check((_argv: yargs.Arguments<{debug: boolean}>) => {
            easyKubeInstaller = new EasyKube(yargsHelper.serviceHook, _argv.debug as boolean);
            return true;
        })
        .demandCommand()
        .strict(true)
        .showHelpOnFail(true)
        .usage('Usage: $0 <command>')
        .help('help')
        .completion('autocompletion', 
        'Generate the autocompletion script for bash/zsh. You need to put the generated code in your .bashrc/.zshrc and reload your shell')
        .argv;

    // /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
    // if (!(argv as any)._.length) {
    //     yargs.showHelp();
    //     process.exit(1);
    // }
}

(() => {
    try {
        main();
    } catch (e) {
        logger.error(e?.stack || e);
    }
})();
