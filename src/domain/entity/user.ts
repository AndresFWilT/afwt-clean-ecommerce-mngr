export interface IUser {
    id: string;
    email: string;
    password: string;
    name: string;
    roles: string[];
}

export class User {
    constructor(private readonly data: IUser) {}

    get id(): string {
        return this.data.id;
    }

    get email() {
        return this.data.email;
    }

    get password() {
        return this.data.password;
    }

    get name() {
        return this.data.name;
    }

    get roles() {
        return this.data.roles;
    }
}
