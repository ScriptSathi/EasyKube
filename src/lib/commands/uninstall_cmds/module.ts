import { Arguments, Argv, showHelp } from 'yargs';

import { EasyKube } from '../../EasyKube';
import { YargsHelper } from '../../YargsHelper';

const yargsHelper = new YargsHelper();

exports.command = 'module [name]';
exports.desc = ': Uninstall a module on the cluster';
exports.builder = (args: Argv) => {
    return args
        .example(yargsHelper.modulesExamples('uninstall module'))
        .positional('name', {
            choices: yargsHelper.modulesOptions,
            describe: `: Name of the module to uninstall`,
            type: 'string',
        });
    };
exports.handler =
    async (_argv: Arguments<{name: string; debug: boolean}>) => {
        if (_argv.name !== '' && _argv.name !== undefined) {
            await new EasyKube(yargsHelper.serviceHook, _argv.debug).uninstall(_argv.name);
        } else {
            showHelp();
            process.exit(1);
        }
    };
