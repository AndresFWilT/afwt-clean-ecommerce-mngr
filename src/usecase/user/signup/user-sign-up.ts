import bcrypt from 'bcrypt';

import { ISignUpExecutor } from '../../../domain/port/user/signup/in/signup-executor';
import { ISignUpUser } from '../../../domain/dto/user/signup-user';
import { ICustomerCreator } from "../../../domain/port/user/signup/out/user-creator";

export class UserSignUp implements ISignUpExecutor {
    constructor(private readonly persistence: ICustomerCreator) {}

    async execute(data: ISignUpUser): Promise<void> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        await this.persistence.create({
            ...data,
            password: hashedPassword,
        });
    }
}
