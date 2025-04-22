import { Router, Response, NextFunction } from 'express';

import { IPurchaseHandler } from '../../../domain/port/purchase/in/purchase-handler';
import { ICustomRequest } from '../../../infrastructure/adapter/http/header';
import { IClaims } from '../../../domain/dto/user/auth-claim';
import { ResponseFactory } from '../../../infrastructure/adapter/http/response-factory';
import { CustomError } from '../../../infrastructure/exception/custom-error';
import { roleGuardMiddleware } from '../../middleware/role-guard';
import { validateRequestHeaders } from '../../middleware/validate-param';

export class PurchaseController {
    private readonly router: Router = Router();

    constructor(private readonly purchaseHandler: IPurchaseHandler) {
        this.router.post(
            '',
            roleGuardMiddleware(['CUSTOMER']),
            validateRequestHeaders,
            async (req, res, next) => this.placePurchase(req as ICustomRequest, res, next).catch(next)
        );

        this.router.get(
            '',
            roleGuardMiddleware(['CUSTOMER']),
            validateRequestHeaders,
            async (req, res, next) => this.getUserPurchases(req as ICustomRequest, res, next).catch(next)
        );

        this.router.get(
            '/:id',
            roleGuardMiddleware(['CUSTOMER']),
            validateRequestHeaders,
            async (req, res, next) => this.getPurchaseById(req as ICustomRequest, res, next).catch(next)
        );
    }

    private async placePurchase(req: ICustomRequest, res: Response, next: NextFunction): Promise<void> {
        const UUID = req.headers['X-RqUID'] as string;
        try {
            const claims = req.auth as IClaims;
            if (!claims?.email) return next(new CustomError(UUID, 400, 'Email not found in jwt'));

            const purchase = await this.purchaseHandler.placePurchase(claims.email);
            res.status(201).json(ResponseFactory.success(UUID, 'Purchase placed successfully', purchase));
        } catch (err: unknown) {
            const error = err as CustomError;
            next(new CustomError(UUID, error.status, error.message || 'Unexpected error'));
        }
    }

    private async getUserPurchases(req: ICustomRequest, res: Response, next: NextFunction): Promise<void> {
        const UUID = req.headers['X-RqUID'] as string;
        try {
            const claims = req.auth as IClaims;
            if (!claims?.email) return next(new CustomError(UUID, 400, 'Email not found in jwt'));

            const history = await this.purchaseHandler.getUserPurchaseHistory(claims.email);
            res.status(200).json(ResponseFactory.success(UUID, 'User purchase history fetched', history));
        } catch (err: unknown) {
            const error = err as CustomError;
            next(new CustomError(UUID, error.status, error.message || 'Unexpected error'));
        }
    }

    private async getPurchaseById(req: ICustomRequest, res: Response, next: NextFunction): Promise<void> {
        const UUID = req.headers['X-RqUID'] as string;
        try {
            const claims = req.auth as IClaims;
            if (!claims?.email) return next(new CustomError(UUID, 400, 'Email not found in jwt'));

            const purchaseId = parseInt(req.params.id);
            const purchase = await this.purchaseHandler.getPurchaseById(claims.email, purchaseId);
            res.status(200).json(ResponseFactory.success(UUID, 'Purchase fetched', purchase));
        } catch (err: unknown) {
            const error = err as CustomError;
            next(new CustomError(UUID, error.status, error.message || 'Unexpected error'));
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}
