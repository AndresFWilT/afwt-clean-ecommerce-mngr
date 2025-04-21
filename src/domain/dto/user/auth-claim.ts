export interface IClaims {
    email: string;
    roles: string[];
    [key: string]: string | number | boolean | string[];
}
