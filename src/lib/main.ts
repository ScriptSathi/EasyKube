#!/usr/bin/env node

import * as yargs from 'yargs';
import * as _ from 'lodash';
import { parse, stringify } from 'yaml';

import { logger } from './utils/Logger';
import { MetricsServer } from './services/MetricsServer';
import { KubeCluster } from './KubeCluster';
import { FileGenerator } from './utils/FileGenerator';

async function main(): Promise<void> {

    const argv = await yargs
        .command('install [option]', 'Allow you to install microservices',
            async (args: yargs.Argv) => {
                return args
                    .example([
                        ['$0 install all', 'Install cluster, vendors and other services'],
                        ['$0 install cluster', 'Install the cluster'],
                        ['$0 install vendors', 'Install all vendors (keycloak, mongodb, rabbitmq, ...)'],
                    ])
                    .positional('option', {
                        choices: ['all', 'cluster', 'vendors'],
                        describe: `Run kube-acceis with specific option`,
                        type: 'string',
                    });
            }, async (_argv: yargs.Arguments) => {
                if (_argv.option !== '') {
                    // TODO
                    const values = new KubeCluster().config;
                    console.log(new FileGenerator('', '/tmp/test/toto.yaml').generateYaml(values));
                } else {
                    logger.info(_argv.option);
                    yargs.showHelp();
                    process.exit(1);
                }
            })
        .command('uninstall [option]', 'Allow you to uninstall a microservice',
            async (args: yargs.Argv) => {
                return args
                    .example([
                        ['$0 uninstall all', 'Uninstall cluster, vendors and other services'],
                        ['$0 uninstall vendors', 'Uninstall all vendors (keycloak, mongodb, rabbitmq, ...)'],
                    ])
                    .positional('option', {
                        choices: ['all', 'vendors'],
                        describe: `Run kube-acceis with specific option`,
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
        .command(['restart [name]', '$1'],
            `Allow you to restart a microservice or full domain of microservices`,
            async (args: yargs.Argv) => {
                return args
                    .example([
                        ['$0 restart rabbitmq', 'Restart rabbitmq'],
                        ['$0 restart --label=domaine acceis', 'Restart all services matching acceis label'],
                    ])
                    .positional('name', {
                        describe: `The microservice name to restart`,
                        type: 'string',
                        nargs: 1,
                        demandOption: true,
                    })
                    .option('label', {
                        describe: `The microservice label name to restart
                        available arguments:
                        -  app (single application to restart)
                        -  domaine (the all group bound to the microservice)
                        Default value: "app"`,
                        type: 'string',
                        nargs: 1,
                        default: 'app',
                    });
            }, (_argv: yargs.Arguments<{label: string; name: string}>) => {
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
                        ['$0 stop --label=domaine acceis', 'Stop all running services matching acceis label'],
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
                        ['$0 start --label=domaine acceis', 'Start all stopped services matching acceis label'],
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
            _.noop, () => {
                // kindController.uninstall();
            })
        .command('purge-data', 'Remove all the data from the cluster',
            _.noop, () => {
                // vendorsController.purgeData();
            })
        .option('debug', {
            alias: 'd',
            describe: `Activate debug mode to display every executed commands`,
            type: 'boolean',
            default: false,
        })
        .option('context', {
            describe: `Wich environment to execute commands on`,
            choices: ['local'],
            type: 'string',
            default: 'local',
        })
        .check((_argv: yargs.Arguments<{debug: boolean; context: string}>) => {

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
