import { IncomingHttpHeaders } from 'http';
import { Request } from 'express';

import { IHeadersDTORequest } from "../../../domain/dto/request-header";
import {IClaims} from "../../../domain/dto/user/auth-claim";

export type IHeadersCustom = IncomingHttpHeaders & IHeadersDTORequest;

export interface ICustomRequest<T = object> extends Request {
    auth: IClaims;
    body: T;
    headers: IHeadersCustom;
}
export type IRequest = ICustomRequest | Request;

export type IParamType = 'body' | 'headers';
