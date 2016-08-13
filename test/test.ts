
import express = require('express');
import jwt = require('express-jwt');

const app = express();

interface User {
    username: string;
    admin: boolean;
}

app.get('/protected', jwt({ secret: 'shhhhhhared-secret' }), (req: express.Request & jwt.Authenticated<User>, res: express.Response) => {
    if (!req.user.admin) {
        throw Object.assign(new Error('Admin rights required'), { status: 401 });
    }
    res.sendStatus(200);
});

jwt({
    secret: 'shhhhhhared-secret',
    audience: 'http://myapi/protected',
    issuer: 'http://issuer'
});

jwt({ secret: new Buffer('shhhhhhared-secret', 'base64') });

app.use(jwt({ secret: 'shhhhhhared-secret' }).unless({ path: ['/token'] }));

let publicKey: Buffer;
jwt({ secret: publicKey });

interface Authenticated {
    auth: User;
}

app.use(jwt({ secret: publicKey, requestProperty: 'auth' }), (req: express.Request & Authenticated, res: express.Response) => {
    console.log(req.auth);
});

app.use(jwt({
    secret: 'hello world !',
    credentialsRequired: false,
    getToken: function fromHeaderOrQuerystring(req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}));

let data: any;
let utilities: any;

const secretCallback = (req: express.Request, payload: any, done: (err: any, token?: string) => void) => {
    const issuer = payload.iss;

    data.getTenantByIdentifier(issuer, (err: any, tenant: any) => {
        if (err) { return done(err); }
        if (!tenant) { return done(new Error('missing_secret')); }

        const secret = utilities.decrypt(tenant.secret);
        done(null, secret);
    });
};

app.use(jwt({ secret: secretCallback }));

const isRevokedCallback: jwt.IsRevokedCallback = (req: express.Request, payload: any, done: (err: any, revoked?: boolean) => void) => {
    const issuer = payload.iss;
    const tokenId = payload.jti;

    data.getRevokedToken(issuer, tokenId, (err: any, token?: string) => {
        if (err) { return done(err); }
        return done(null, !!token);
    });
};

app.get('/protected',
    jwt({
        secret: 'shhhhhhared-secret',
        isRevoked: isRevokedCallback
    }),
    (req: express.Request & jwt.Authenticated<User>, res: express.Response) => {
        if (!req.user.admin) {
            return res.sendStatus(401);
        }
        res.sendStatus(200);
    });

app.use(jwt({
    secret: 'hello world !',
    credentialsRequired: false
}));
