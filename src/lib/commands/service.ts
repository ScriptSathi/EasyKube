import { Arguments, Argv, showHelp } from 'yargs';

import { EasyKube } from './../EasyKube';
import { YargsHelper } from './../YargsHelper';

const yargsHelper = new YargsHelper();

exports.command = ['service [name]', 's'];
exports.description = 'Manage a specific service on the cluster';
exports.builder = (argv: Argv) => {
    const previousCmd = process.argv[2];
    return argv
        .example(yargsHelper.serviceExamples(`${previousCmd} service`))
        .positional('name', {
            choices: yargsHelper.servicesOptions,
            describe: `Name of the service to ${previousCmd}`,
            type: 'string',
        })
        .showHelpOnFail(true);
    };
exports.handler =
    async (args: Arguments<{name: string; debug: boolean}>) => {
        if (args.name !== '' && args.name !== undefined) {
            const easyKubeInstaller = new EasyKube(yargsHelper.serviceHook, args.debug);
            switch (yargsHelper.getNameFromAlias(process.argv[2])){
                case 'install':
                    await easyKubeInstaller.install(args.name, false);
                    break;
                case 'uninstall':
                    await easyKubeInstaller.uninstall(args.name, false);
                    break;
                case 'start':
                    await easyKubeInstaller.start(args.name);
                    break;
                case 'stop':
                    await easyKubeInstaller.stop(args.name);
                    break;
            }        
        } else {
            showHelp();
            process.exit(1);
        }
    };
