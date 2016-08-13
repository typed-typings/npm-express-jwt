
import express = require('express');
import unless = require('express-unless');

/**
 * The JWT authentication middleware authenticates callers using a JWT. If the token is valid, req.user will be set with
 * the JSON object decoded to be used by later middleware for authorization and access control.
 */
declare function jwt(options: jwt.Options): unless.RestrictableRequestHandler;

declare namespace jwt {

    /**
     * If you are developing an application in which the secret used to sign tokens is not static, you can provide a
     * callback function as the secret parameter.
     */
    export interface SecretCallback {
        /**
         * @param req The express request object.
         * @param payload An object with the JWT claims.
         * @param done A function with signature function(err, secret) to be invoked when the secret is retrieved.
         */
        (req: express.Request, payload: any, done: (err: any, secret?: string | Buffer) => void): void;
    }

    /**
     * It is possible that some tokens will need to be revoked so they cannot be used any longer. You can provide a
     * function as the isRevoked option.
     */
    export interface IsRevokedCallback {
        /**
         * @param req The express request object.
         * @param payload An object with the JWT claims.
         * @param done  A function with signature function(err, revoked) to be invoked once the check to see if the
         *   token is revoked or not is complete. revoked should be true if the JWT is revoked, false otherwise.
         */
        (req: express.Request, payload: any, done: (err: any, revoked?: boolean) => void): void;
    }

    export interface GetTokenCallback {
        (req: express.Request): string;
    }

    export interface Options {

        /**
         * If you are using a base64 URL-encoded secret, pass a Buffer with base64 encoding as the secret instead of a string.
         *
         * If you are developing an application in which the secret used to sign tokens is not static, you can provide a
         * callback function as the secret parameter.
         */
        secret: string | Buffer | SecretCallback;

        /**
         * JWT audience claim
         */
        audience?: string;

        /**
         * JWT issuer claim
         */
        issuer?: string;

        /**
         * By default, the decoded token is attached to req.user but can be configured with the requestProperty option.
         * You can use an intersection type between the Authenticated interface and the Express Request interface to
         * type your Request parameter, if you use the default `user`. Write your own interface if you set your own
         * `requestProperty`.
         */
        requestProperty?: string;

        /**
         * Alias for `requestProperty`
         */
        userProperty?: string;

        /**
         * @deprecated Use unless instead
         */
        skip?: string[];


        credentialsRequired?: boolean;

        /**
         * It is possible that some tokens will need to be revoked so they cannot be used any longer. You can provide a
         * function as the isRevoked option. The signature of the function is function(req, payload, done):
         */
        isRevoked?: IsRevokedCallback;

        /**
         * A custom function for extracting the token from a request can be specified with the getToken option. This is
         * useful if you need to pass the token through a query parameter or a cookie. You can throw an error in this
         * function and it will be handled by express-jwt.
         */
        getToken?: GetTokenCallback;
    }

    /**
     * You can use this interface to type your `req` parameter in your route handlers by building an intersection with
     * the express Request interface: `req: express.Request & jwt.Authenticated`
     */
    export interface Authenticated<T> {
        user: T;
    }
}

export = jwt;
