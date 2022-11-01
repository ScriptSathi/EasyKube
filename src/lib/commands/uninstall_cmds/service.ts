import { Arguments, Argv, showHelp } from 'yargs';

import { EasyKube } from '../../EasyKube';
import { YargsHelper } from '../../YargsHelper';

const yargsHelper = new YargsHelper();

exports.command = 'service [name]';
exports.desc = ': Install a specific service on the cluster';
exports.builder = (args: Argv) => {
    return args
        .example(yargsHelper.serviceExamples('uninstall service'))
        .positional('name', {
            choices: yargsHelper.servicesOptions,
            describe: `: Name of the service to install`,
            type: 'string',
        });
    };
exports.handler =
    async (_argv: Arguments<{name: string; debug: boolean}>) => {
        if (_argv.name !== '' && _argv.name !== undefined) {
            await new EasyKube(yargsHelper.serviceHook, _argv.debug).uninstall(_argv.name, false);
        } else {
            showHelp();
            process.exit(1);
        }
    };
