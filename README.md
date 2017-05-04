# Typed express-jwt

[![Greenkeeper badge](https://badges.greenkeeper.io/types/npm-express-jwt.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/types/npm-express-jwt.svg?branch=master)](https://travis-ci.org/types/npm-express-jwt)

Typescript Typings for [express-jwt](https://github.com/auth0/express-jwt).

## Installation
```sh
typings install --save express-jwt
```

## Usage

```ts
import express = require('express');
import jwt = require('express-jwt');

const app = express();

interface User {
    username: string;
    admin: boolean;
}

app.get('/protected', jwt({ secret: 'shhhhhhared-secret' }), (req: express.Request & jwt.Authenticated<User>, res: express.Response) {
    if (!req.user.admin) {
        throw Object.assign(new Error('Admin rights required'), { status: 401 });
    }
    res.sendStatus(200);
});

```


## Contributing
You can run them the tests with `npm run build` and `npm run test`.

--------------------------------

_Based on typings by [Wonshik Kim](https://github.com/wokim/)_
