export type helmUpgrade = {
    namespace: string;
    chartName: string;
    repoName?: string;
    version?: string;
    args?: string[];
    manifestDir?: string;
    dependencyUpdate?: boolean;
    createNs?: boolean;
    _wait?: boolean;
    timeout?: number;
};

export type TspawnOptions = {
    stdio?: boolean;
    debug?: boolean;
};
