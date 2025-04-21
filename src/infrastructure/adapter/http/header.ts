import { IncomingHttpHeaders } from 'http';
import { Request } from 'express';

import { IHeadersDTORequest } from "../../../domain/dto/request-header";

export type IHeadersCustom = IncomingHttpHeaders & IHeadersDTORequest;

export interface ICustomRequest<T = object> extends Request {
    body: T;
    headers: IHeadersCustom;
}
export type IRequest = ICustomRequest | Request;

export type IParamType = 'body' | 'headers';
