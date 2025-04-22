import { Router } from 'express';

import { AuthenticationController } from '../../controller/user/authentication/auth-controller';
import { JWTAuthenticatorAdapter } from "../../../infrastructure/adapter/jwt/authentication";
import { UserLogin } from "../../../usecase/user/authentication/user-login";
import { PrismaUserFetcher } from "../../../infrastructure/persistence/prisma/user/user-fetcher";
import { PrismaUserCreator } from '../../../infrastructure/persistence/prisma/user/user-creator';
import { UserSignUp } from '../../../usecase/user/signup/user-sign-up';
import { SignUpUserController } from '../../controller/user/signup/sign-up-controller';
import { validateRequestBody, validateRequestHeaders } from '../../middleware/validate-param';

const userRouter = Router();

const loginUserService = new UserLogin(
    new PrismaUserFetcher(),
    new JWTAuthenticatorAdapter()
);

const authController = new AuthenticationController(loginUserService);

userRouter.use(
    [validateRequestHeaders, validateRequestBody],
    authController.getRouter()
);

const registerUserService = new UserSignUp(new PrismaUserCreator());
const signUpController = new SignUpUserController(registerUserService);

userRouter.use(
    [validateRequestHeaders, validateRequestBody],
    signUpController.getRouter()
);

export default userRouter;
