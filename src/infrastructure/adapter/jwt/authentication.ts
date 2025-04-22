import fs from 'fs';
import jwt, {SignOptions} from 'jsonwebtoken';

import { IAuthenticatorPort } from '../../../domain/port/user/authentication/out/authenticator';
import { IClaims } from '../../../domain/dto/user/auth-claim';
import env from '../../../config/env';

export class JWTAuthenticatorAdapter implements IAuthenticatorPort {
    private readonly privateKey = fs.readFileSync(env.authConfig.JWT_PRIVATE_KEY);
    private readonly publicKey = fs.readFileSync(env.authConfig.JWT_PUBLIC_KEY);
    private readonly expiresIn: SignOptions['expiresIn'] = env.authConfig.JWT_EXPIRES_IN || '1h';

    generateToken(claims: IClaims): string {
        const options: SignOptions = {
            algorithm: 'RS256',
            expiresIn: this.expiresIn,
        };

        return jwt.sign(claims, this.privateKey, options);
    }

    verifyToken(token: string): IClaims {
        return jwt.verify(token, this.publicKey, { algorithms: ['RS256'] }) as IClaims;
    }
}
