import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from "fs";

import env from '../../config/env';
import { ICustomRequest } from "../../infrastructure/adapter/http/header";
import { ResponseFactory } from "../../infrastructure/adapter/http/response-factory";
import { validateUUID } from "../../util/validation/uuid";

const publicKey = fs.readFileSync(env.authConfig.JWT_PUBLIC_KEY);

export function roleGuardMiddleware(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const authHeader = req.headers.authorization;


            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({ message: 'Missing or invalid Authorization header' });
                return;
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as { roles: string[] };

            const userRoles = decoded.roles;
            const hasAccess = userRoles.some(role => allowedRoles.includes(role));

            if (!hasAccess) {
                res.status(403).json({ message: 'Forbidden: insufficient role' });
                return;
            }

            (req as any).user = decoded;
            next();
        } catch (error: unknown) {
            const err = error as Error;
            const result = ResponseFactory.error(validateUUID(req as ICustomRequest), 'error trying to validate role' + err.message);
            res.status(401).json(result);
        }
    };
}

