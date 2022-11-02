import { Arguments, Argv, showHelp } from 'yargs';

import { EasyKube } from '../EasyKube';
import { YargsHelper } from '../YargsHelper';

const yargsHelper = new YargsHelper();

exports.command = 'module [name]';
exports.desc = 'Manage a module on the cluster';
exports.builder = (argv: Argv) => {
    const previousCmd = (argv.argv as Arguments)._[0];
    return argv
        .example(yargsHelper.modulesExamples(`${previousCmd} module`))
        .positional('name', {
            choices: yargsHelper.modulesOptions,
            describe: `Name of the module to ${previousCmd}`,
            type: 'string',
        });
    };
exports.handler =
    async (args: Arguments<{name: string; debug: boolean}>) => {
        if (args.name !== '' && args.name !== undefined) {
            const easyKubeInstaller = new EasyKube(yargsHelper.serviceHook, args.debug);
            switch (args._[0]){
            case 'install':
                await easyKubeInstaller.install(args.name);
                break;
            case 'uninstall':
                await easyKubeInstaller.uninstall(args.name);
                break;
            case 'service':
                throw new Error('Not implemented');
                break;
            case 'module':
                throw new Error('Not implemented');
                break;
            }
        } else {
            showHelp();
            process.exit(1);
        }
    };
