import { Arguments, Argv, showHelp } from 'yargs';

import { EasyKube } from '../EasyKube';
import { YargsHelper } from '../YargsHelper';

const yargsHelper = new YargsHelper();

exports.command = ['module [name]', '$2'];
exports.describe = 'Manage a module on the cluster';
exports.builder = (argv: Argv) => {
    const previousCmd = process.argv[2];
    return argv
        .example(yargsHelper.modulesExamples(`${previousCmd} module`))
        .positional('name', {
            choices: yargsHelper.modulesOptions,
            describe: `Name of the module to ${previousCmd}`,
            type: 'string',
        })
        .showHelpOnFail(true);
    };
exports.handler =
    (args: Arguments<{name: string; debug: boolean}>) => {
        if (args.name !== '' && args.name !== undefined) {
            const easyKubeInstaller = new EasyKube(yargsHelper.serviceHook, args.debug);
            switch (args._[0]){
            case 'install':
                easyKubeInstaller.install(args.name);
                break;
            case 'uninstall':
                easyKubeInstaller.uninstall(args.name);
                break;
            case 'start':
                easyKubeInstaller.start(args.name);
                break;
            case 'stop':
                easyKubeInstaller.stop(args.name);
                break;
            }        
        } else {
            showHelp();
            process.exit(1);
        }
    };
