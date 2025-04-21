import { ILoginUser } from "../../../dto/user/login-user";

export interface ILoginExecutor {
    execute(data: ILoginUser): Promise<string>;
}
