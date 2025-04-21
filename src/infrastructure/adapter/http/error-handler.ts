import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

import { IErrorResponse } from './response';
import { logger } from '../../../config/logger';
import { ResponseFactory } from './response-factory';

export function sendErrorResponse(
    error: Error & { status?: number; errors?: unknown[]; UUID?: string },
    _request: Request,
    response: Response,
    _next: NextFunction,
): void {
    const status = error.status ?? 500;
    const requestUUID = error.UUID ?? uuid();

    const responseBody: IErrorResponse = ResponseFactory.error(requestUUID, error.message);

    logger.error(requestUUID, `API Exception - ${error.message} [Status: ${status}]`);
    logger.debug(requestUUID, `Full Error Response: ${JSON.stringify(responseBody)}`);

    response.status(status).json(responseBody);
}
