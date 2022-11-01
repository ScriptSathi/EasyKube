import { Argv } from 'yargs';

exports.command = 'install <module|service>';
exports.description = 'Install a module or a service on the cluster';
exports.builder = (args: Argv) => {
    return args
        .commandDir('install_cmds')
        .demandCommand()
        .strict(true)
        .showHelpOnFail(true);
};

/* eslint-disable-next-line @typescript-eslint/no-empty-function */
exports.handler = () => {};
