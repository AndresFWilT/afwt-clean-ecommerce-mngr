import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import env from '../../config/env';

export function roleGuardMiddleware(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Missing or invalid Authorization header' });
            }

            const token = authHeader.split(' ')[1];
            const publicKey = env.authConfig.JWT_PUBLIC_KEY;
            const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as { roles: string[] };

            const userRoles = decoded.roles;
            const hasAccess = userRoles.some(role => allowedRoles.includes(role));

            if (!hasAccess) {
                return res.status(403).json({ message: 'Forbidden: insufficient role' });
            }

            (req as any).user = decoded;

            return next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
}
