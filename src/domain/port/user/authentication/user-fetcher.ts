import {User} from "../../../entity/user";

export interface IUserFetcher {
    findByEmail(email: string): Promise<User | null>;
}
