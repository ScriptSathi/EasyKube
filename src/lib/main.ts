#!/usr/bin/env node

import * as yargs from 'yargs';
import * as _ from 'lodash';

import { logger } from './utils/Logger';
import { YargsHelper } from './YargsHelper';
import { EasyKube } from './EasyKube';

async function main(): Promise<void> {

    const yargsHelper = new YargsHelper();
    let easyKubeInstaller: EasyKube;

    const argv = await yargs
        .command('install [option]', 'Allow you to install microservices',
            async (args: yargs.Argv) => {
                return args
                    .example(yargsHelper.moduleExamples('install'))
                    .positional('option', {
                        choices: yargsHelper.moduleOptions,
                        describe: `Run easykube with specific option`,
                        type: 'string',
                    });
            }, async (_argv: yargs.Arguments) => {
                if (_argv.option !== '' && _argv.option !== undefined) {
                    await easyKubeInstaller.install(_argv.option as string);
                } else {
                    logger.info(_argv.option);
                    yargs.showHelp();
                    process.exit(1);
                }
            })
        .command('uninstall [option]', 'Allow you to uninstall a microservice',
            async (args: yargs.Argv) => {
                return args
                    .example(yargsHelper.serviceExamples('uninstall'))
                    .positional('option', {
                        choices: yargsHelper.servicesOptions,
                        describe: `Run easykube with specific option`,
                        type: 'string',
                    });
            }, async (_argv: yargs.Arguments) => {
                if (_argv.option !== '') {
                    // TODO
                } else {
                    logger.info(_argv.option);
                    yargs.showHelp();
                    process.exit(1);
                }
            })
        .command(['stop [name]', '$1'],
            `Allow you to stop a running microservice or full domain of microservices`,
            async (args: yargs.Argv) => {
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
            async (args: yargs.Argv) => {
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
        .strict(true)
        .showHelpOnFail(true)
        .usage('Usage: $0 <command>')
        .help('help')
        .locale('en')
        .argv;

    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
    if (!(argv as any)._.length) {
        yargs.showHelp();
        process.exit(1);
    }
}

(async () => {
    try {
        await main();
    } catch (e) {
        logger.error(e?.stack || e);
    }
})();
