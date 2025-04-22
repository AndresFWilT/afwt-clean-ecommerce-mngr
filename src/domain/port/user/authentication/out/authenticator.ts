import { IClaims } from "../../../../dto/user/auth-claim";

export interface IAuthenticatorPort {
    generateToken(claims: IClaims): string;
    verifyToken(token: string): IClaims;
}
