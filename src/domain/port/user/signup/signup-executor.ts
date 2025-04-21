import { ISignUpUser } from '../../../dto/user/signup-user';

export interface ISignUpExecutor {
    execute(data: ISignUpUser): Promise<void>;
}
