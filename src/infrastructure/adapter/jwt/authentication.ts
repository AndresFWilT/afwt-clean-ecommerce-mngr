import fs from 'fs';
import jwt from 'jsonwebtoken';

import { IAuthenticatorPort } from '../../../domain/port/user/authentication/authenticator';
import { IClaims } from '../../../domain/dto/user/auth-claim';
import env from '../../../config/env';

export class JWTAuthenticatorAdapter implements IAuthenticatorPort {
    private readonly privateKey = fs.readFileSync(env.authConfig.JWT_PRIVATE_KEY);
    private readonly publicKey = fs.readFileSync(env.authConfig.JWT_PUBLIC_KEY);
    private readonly expiresIn = env.authConfig.JWT_EXPIRES_IN || '1h';

    generateToken(claims: IClaims): string {
        return jwt.sign(claims, this.privateKey, {
            algorithm: 'RS256',
            expiresIn: this.expiresIn,
        });
    }

    verifyToken(token: string): IClaims {
        return jwt.verify(token, this.publicKey, { algorithms: ['RS256'] }) as IClaims;
    }
}
