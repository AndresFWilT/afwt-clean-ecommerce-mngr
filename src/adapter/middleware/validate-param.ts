import { NextFunction, Response } from 'express';

import { ICustomRequest, IParamType, IRequest } from "../../infrastructure/adapter/http/header";
import { IHeadersDTORequest } from "../../domain/dto/request-header";
import { CustomError } from "../../infrastructure/exception/custom-error";
import { validateUUID } from "../../util/validation/uuid";

type ParamProvider = (req: ICustomRequest) => string[];

const validateParams =
    (paramProvider: ParamProvider, paramType: IParamType) =>
        async (req: IRequest, _res: Response, next: NextFunction) => {
            const UUID = validateUUID(req as ICustomRequest);
            const params = paramProvider(req as ICustomRequest);

            const isParamValid = (param: string): boolean => {
                return !(param === null || param === undefined);
            };

            if (params.some((param) => !isParamValid(param))) {
                return next(new CustomError(`UUID: ${UUID}, 400, ${paramType}: parameters is not valid)`));
            }

            next();
        };

export const validateRequestBody = validateParams((req) =>
        Object.values(req.body),
    'body'
);
export const validateRequestHeaders = validateParams((req) =>
        Object.values(req.headers as IHeadersDTORequest),
    'headers'
);
