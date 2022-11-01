export type helmUpgrade = {
    namespace: string;
    chartName: string;
    repoName: string;
    repoUrl: string;
    chartVersion?: string;
    setArgs?: string[];
    manifestDir?: string;
    dependencyUpdate?: boolean;
    createNs?: boolean;
    _wait?: boolean;
    timeout?: number;
};
