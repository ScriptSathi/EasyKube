import { Arguments, Argv, showHelp } from 'yargs';

import { EasyKube } from '../../EasyKube';
import { YargsHelper } from '../../YargsHelper';

const yargsHelper = new YargsHelper();

exports.command = 'module [name]';
exports.desc = ': Install a module on the cluster';
exports.builder = (args: Argv) => {
    return args
        .example(yargsHelper.modulesExamples('install module'))
        .positional('name', {
            choices: yargsHelper.modulesOptions,
            describe: `: Name of the module to install`,
            type: 'string',
        });
    };
exports.handler =
    async (_argv: Arguments<{name: string; debug: boolean}>) => {
        if (_argv.name !== '' && _argv.name !== undefined) {
            await new EasyKube(yargsHelper.serviceHook, _argv.debug).install(_argv.name);
        } else {
            showHelp();
            process.exit(1);
        }
    };
