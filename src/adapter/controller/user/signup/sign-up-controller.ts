import { NextFunction, Response, Router } from 'express';

import { CustomError } from '../../../../infrastructure/exception/custom-error';
import { ISignUpExecutor } from '../../../../domain/port/user/signup/signup-executor';
import { ISignUpUser } from '../../../../domain/dto/user/signup-user';
import { IRequest, ICustomRequest } from '../../../../infrastructure/adapter/http/header';
import { ResponseFactory } from '../../../../infrastructure/adapter/http/response-factory';
import { validateUUID } from '../../../../util/validation/uuid';

export class SignUpUserController {
    private readonly router: Router = Router();

    constructor(private readonly signUpService: ISignUpExecutor) {
        this.router.post('/users/sign-up', async (req: IRequest, res: Response, next: NextFunction) => {
            this.signUp(req, res, next).catch(next);
        });
    }

    private async signUp(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        const UUID: string = validateUUID(req as ICustomRequest);
        try {
            const body = req.body as ISignUpUser;
            await this.signUpService.execute(body);

            const response = ResponseFactory.success(UUID, 'User registered successfully', {});
            res.status(201).json(response);
        } catch (error: unknown) {
            const err = error as Error;
            const response = ResponseFactory.error(UUID, err.message);
            next(new CustomError(UUID, 500, response.error));
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}
