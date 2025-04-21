import { NextFunction, Response, Router } from 'express';

import { CustomError } from '../../../../infrastructure/exception/custom-error';
import { ICustomRequest, IRequest  } from '../../../../infrastructure/adapter/http/header';
import { ILoginExecutor } from '../../../../domain/port/user/authentication/login-executor';
import { ILoginUser } from '../../../../domain/dto/user/login-user';
import { ResponseFactory } from '../../../../infrastructure/adapter/http/response-factory';
import { validateUUID } from '../../../../util/validation/uuid';

export class AuthenticationController {
    private readonly router: Router = Router();

    constructor(private readonly loginService: ILoginExecutor) {
        this.router.post('/authentication/login', async (req: IRequest, res: Response, next: NextFunction) => {
            this.login(req, res, next).catch(next);
        });
    }

    private async login(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        const UUID: string = validateUUID(req as ICustomRequest);
        try {
            const body = req.body as ILoginUser;
            const token = await this.loginService.execute(body);

            const response = ResponseFactory.success(UUID, 'Login successful', { token });
            res.status(200).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            const response = ResponseFactory.error(UUID, err.message);
            next(new CustomError(UUID, 401, response.error));
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}
