import { Argv } from 'yargs';

exports.command = 'uninstall <module|service>';
exports.description = 'Uninstall a module or a service from the cluster';
exports.builder = (args: Argv) => {
    return args
        .commandDir('uninstall_cmds')
        .demandCommand()
        .strict(true)
        .showHelpOnFail(true);
};

/* eslint-disable-next-line @typescript-eslint/no-empty-function */
exports.handler = () => {};
