#!/usr/bin/env ts-node

import * as yargs from 'yargs';
import * as _ from 'lodash';

import { logger } from './utils/Logger';
import { YargsHelper } from './YargsHelper';
import { EasyKube } from './EasyKube';

function main(): void {

    const yargsHelper = new YargsHelper();
    let easyKubeInstaller: EasyKube;

    const argv = yargs
        .command(yargsHelper.mainCommandsDetails('install'),
            `Install a module or a service on the cluster`, 
            (args: yargs.Argv) => {
                return args
                    .commandDir('commands')
                    .demandCommand()
                    .strict(true)
                    .showHelpOnFail(true);
        })
        .command(yargsHelper.mainCommandsDetails('uninstall'),
            `Uninstall a module or a service on the cluster`, 
            (args: yargs.Argv) => {
                return args
                    .commandDir('commands')
                    .demandCommand()
                    .strict(true)
                    .showHelpOnFail(true);
        })
        .command(yargsHelper.mainCommandsDetails('stop'),
            `Allow you to stop a running microservice or full domain of microservices`,
            (args: yargs.Argv) => {
                return args
                    .commandDir('commands')
                    .demandCommand()
                    .strict(true)
                    .showHelpOnFail(true);
        })
        .command(yargsHelper.mainCommandsDetails('start'),
            `Allow you to start a stopped microservice or full domain of microservices`,
            (args: yargs.Argv) => {
                return args
                    .commandDir('commands')
                    .demandCommand()
                    .strict(true)
                    .showHelpOnFail(true);
        })
        .command(['destroy-cluster', 'del', 'destroy'], 'Destroy the kubernetes cluster',
            _.noop, () => {
                easyKubeInstaller.deleteCluster();
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
    
    if (!(argv as yargs.Arguments)._.length) {
        yargs.showHelp();
        process.exit(1);
    }
}

(() => {
    try {
        main();
    } catch (e) {
        logger.error(e?.stack || e);
    }
})();
