import * as packpath from 'packpath';
import * as os from 'os';

import { Constants } from './Constants';

abstract class AbstractContext {
    public kubeProject: {path: string}; // TODO Reimplemente this
    public kubectlCommand: string;
    public helmCommand: string;
    public debugMode: boolean;
    public kubeConfig: string;
    public pathToVaultCredsFiles: string;
}

abstract class AbstractEnvContext extends AbstractContext {
    public abstract setContext(debug: boolean): void;
}

export class Context extends AbstractEnvContext {
    public setContext(debugMode: boolean): void {
        this.kubeConfig = `${os.homedir()}/.kube/conf-files/kind-${Constants.clusterName}`;
        this.kubectlCommand = `kubectl --kubeconfig=${this.kubeConfig} --context=kind-${Constants.clusterName}`;
        this.helmCommand = `helm --kubeconfig=${this.kubeConfig} --kube-context=kind-${Constants.clusterName}`;
        this.kubeProject = { path: packpath.self() }; // TODO here
        this.debugMode = debugMode;
    }
}
