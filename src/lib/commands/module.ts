import { Arguments, Argv, showHelp } from 'yargs';

import { EasyKube } from '../EasyKube';
import { YargsHelper } from '../YargsHelper';

const yargsHelper = new YargsHelper();

exports.command = 'module [name]';
exports.desc = ': Install a module on the cluster';
exports.builder = (argv: Argv) => {
    return argv
        .example(yargsHelper.modulesExamples('install module'))
        .positional('name', {
            choices: yargsHelper.modulesOptions,
            describe: `: Name of the module to install`,
            type: 'string',
        });
    };
exports.handler =
    async (argv: Arguments<{name: string; debug: boolean}>) => {
        if (argv.name !== '' && argv.name !== undefined) {
            const easyKubeInstaller = new EasyKube(yargsHelper.serviceHook, argv.debug);
            switch(argv._[0]){
                case "install":
                    await easyKubeInstaller.install(argv.name);
                    break;
                case "uninstall":
                    await easyKubeInstaller.uninstall(argv.name)
                    break;
                case "service":
                    throw new Error('Not implemented');
                    // await easyKubeInstaller.install(argv.name);
                    break;
                case "module":
                    throw new Error('Not implemented');
                    // await easyKubeInstaller.install(argv.name);
                    break;
            }
        } else {
            showHelp();
            process.exit(1);
        }
    };
