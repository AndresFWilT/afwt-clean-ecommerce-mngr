import { Router } from 'express';

import { AuthenticationController } from '../../controller/user/authentication/auth-controller';
import { JWTAuthenticatorAdapter } from "../../../infrastructure/adapter/jwt/authentication";
import { LoginUserService } from "../../../usecase/user/authentication/LoginUserService";
import { PrismaUserFetcher } from "../../../infrastructure/persistence/prisma/user/user-fetcher";
import { PrismaUserCreator } from '../../../infrastructure/persistence/prisma/user/user-creator';
import { SignUpUserService } from '../../../usecase/user/signup/SignUpUserService';
import { SignUpUserController } from '../../controller/user/signup/sign-up-controller';
import { validateRequestBody, validateRequestHeaders } from '../../middleware/validate-param';

const userRouter = Router();

const loginUserService = new LoginUserService(
    new PrismaUserFetcher(),
    new JWTAuthenticatorAdapter()
);

const authController = new AuthenticationController(loginUserService);

userRouter.use(
    [validateRequestHeaders, validateRequestBody],
    authController.getRouter()
);

const registerUserService = new SignUpUserService(new PrismaUserCreator());
const signUpController = new SignUpUserController(registerUserService);

userRouter.use(
    [validateRequestHeaders, validateRequestBody],
    signUpController.getRouter()
);

export default userRouter;
