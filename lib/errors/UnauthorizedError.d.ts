
declare namespace UnauthorizedError {
    export type ErrorCode = 'revoked_token' | 'invalid_token' | 'credentials_bad_scheme' | 'credentials_bad_format' | 'credentials_required';
}

export class UnauthorizedError {

    /** 401 */
    status: number;
    message: string;
    name: 'UnauthorizedError';
    code: UnauthorizedError.ErrorCode;
    inner: Error;

    constructor(code: UnauthorizedError.ErrorCode, error: { message: string });
}
