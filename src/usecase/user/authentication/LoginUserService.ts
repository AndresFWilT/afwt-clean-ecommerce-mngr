import bcrypt from 'bcrypt';

import { IAuthenticatorPort } from "../../../domain/port/user/authentication/authenticator";
import { IClaims } from "../../../domain/dto/user/auth-claim";
import { ILoginExecutor } from "../../../domain/port/user/authentication/login-executor";
import { ILoginUser } from "../../../domain/dto/user/login-user";
import { IUserFetcher } from "../../../domain/port/user/authentication/user-fetcher";
import { User } from "../../../domain/entity/user";

export class LoginUserService implements ILoginExecutor {
    constructor(
        private readonly userFetcher: IUserFetcher,
        private readonly authenticator: IAuthenticatorPort
    ) {}

    async execute(data: ILoginUser): Promise<string> {
        const user: User | null = await this.userFetcher.findByEmail(data.email);
        if (!user || !user.roles?.length || !user.email) {
            throw new Error('User not found or has no roles');
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const claims: IClaims = { email: user.email, roles: user.roles };
        return this.authenticator.generateToken(claims);
    }
}
