import * as assert from 'assert';

enum ErrorCodes {
    CLUSTER_ALREADY_EXISTS = 1000,
    DOCKER_REGISTRY_SECRET_ALREADY_EXISTS = 1001,
    LINKERD_ALREADY_EXISTS = 1002,
    UNKNOW_ERROR = 1010,
}

export class KubeUtilsError extends Error {
    public code: ErrorCodes;
    public errorCode: string;

    public static get CODES(): typeof ErrorCodes{
        return ErrorCodes;
    }

    constructor(code: number, message: string) {
        super(`${ErrorCodes[code]}(${code}) ${message}`);
        assert.ok(ErrorCodes[code]);
        this.code = code;
        this.errorCode = `${ErrorCodes[code]}(${code})`;
    }
}
