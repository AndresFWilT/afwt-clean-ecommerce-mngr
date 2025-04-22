import { Router, Response, NextFunction } from 'express';

import { ICartItem } from "../../../domain/dto/cart/cart-handling";
import { ICartHandler } from "../../../domain/port/cart/in/cart-handler";
import { ICustomRequest } from '../../../infrastructure/adapter/http/header';
import { IClaims } from '../../../domain/dto/user/auth-claim';
import { ResponseFactory } from '../../../infrastructure/adapter/http/response-factory';
import { CustomError } from '../../../infrastructure/exception/custom-error';
import { roleGuardMiddleware } from '../../middleware/role-guard';
import { validateRequestHeaders, validateRequestBody } from '../../middleware/validate-param';

export class CartController {
    private readonly router: Router = Router();

    constructor(
        private readonly cartHandler: ICartHandler
    ) {
        this.router.get(
            '',
            roleGuardMiddleware(['CUSTOMER']),
            validateRequestHeaders,
            async (req, res, next) => this.getCart(req as ICustomRequest, res, next).catch(next)
        );

        this.router.post(
            '/items',
            roleGuardMiddleware(['CUSTOMER']),
            validateRequestHeaders,
            validateRequestBody,
            async (req, res, next) => this.addItem(req as ICustomRequest, res, next).catch(next)
        );

        this.router.put(
            '/items/:productId',
            roleGuardMiddleware(['CUSTOMER']),
            validateRequestHeaders,
            validateRequestBody,
            async (req, res, next) => this.updateItem(req as ICustomRequest, res, next).catch(next)
        );

        this.router.delete(
            '/items/:productId',
            roleGuardMiddleware(['CUSTOMER']),
            validateRequestHeaders,
            async (req, res, next) => this.removeItem(req as ICustomRequest, res, next).catch(next)
        );

        this.router.delete(
            '',
            roleGuardMiddleware(['CUSTOMER']),
            validateRequestHeaders,
            async (req, res, next) => this.clearCart(req as ICustomRequest, res, next).catch(next)
        );
    }

    private async getCart(req: ICustomRequest, res: Response, next: NextFunction): Promise<void> {
        const UUID = req.headers['X-RqUID'] as string;
        try {
            const claims = req.auth as IClaims;
            if (!claims?.email) return next(new CustomError(UUID, 400, 'Email not found in jwt'));

            const cart = await this.cartHandler.getCartByEmail(claims.email);
            res.status(200).json(ResponseFactory.success(UUID, 'Cart fetched', cart));
        } catch (err: unknown) {
            const error = err as CustomError;
            next(new CustomError(UUID, error.status, error.message || 'Unexpected error'));
        }
    }

    private async addItem(req: ICustomRequest, res: Response, next: NextFunction): Promise<void> {
        const UUID = req.headers['X-RqUID'] as string;
        try {
            const claims = req.auth as IClaims;
            if (!claims?.email) return next(new CustomError(UUID, 400, 'Email not found in jwt'));

            const { productId, quantity } = req.body as ICartItem;
            const cart = await this.cartHandler.addItemToCartByEmail(claims.email, productId, quantity);
            res.status(200).json(ResponseFactory.success(UUID, 'Product added to cart', cart));
        } catch (err: unknown) {
            const error = err as CustomError;
            next(new CustomError(UUID, error.status, error.message || 'Unexpected error'));
        }
    }

    private async updateItem(req: ICustomRequest, res: Response, next: NextFunction): Promise<void> {
        const UUID = req.headers['X-RqUID'] as string;
        try {
            const claims = req.auth as IClaims;
            if (!claims?.email) return next(new CustomError(UUID, 400, 'Email not found in jwt'));

            const productId = parseInt(req.params.productId);
            const { quantity } = req.body as ICartItem;

            const cart = await this.cartHandler.updateItemQuantityByEmail(claims.email, productId, quantity);
            res.status(200).json(ResponseFactory.success(UUID, 'Product quantity updated', cart));
        } catch (err: unknown) {
            const error = err as CustomError;
            next(new CustomError(UUID, error.status, error.message || 'Unexpected error'));
        }
    }

    private async removeItem(req: ICustomRequest, res: Response, next: NextFunction): Promise<void> {
        const UUID = req.headers['X-RqUID'] as string;
        try {
            const claims = req.auth as IClaims;
            if (!claims?.email) return next(new CustomError(UUID, 400, 'Email not found in jwt'));

            const productId = parseInt(req.params.productId);
            const cart = await this.cartHandler.removeCartItemByEmail(claims.email, productId);
            res.status(200).json(ResponseFactory.success(UUID, 'Product removed from cart', cart));
        } catch (err: unknown) {
            const error = err as CustomError;
            next(new CustomError(UUID, error.status, error.message || 'Unexpected error'));
        }
    }

    private async clearCart(req: ICustomRequest, res: Response, next: NextFunction): Promise<void> {
        const UUID = req.headers['X-RqUID'] as string;
        try {
            const claims = req.auth as IClaims;
            if (!claims?.email) return next(new CustomError(UUID, 400, 'Email not found in jwt'));

            const cart = await this.cartHandler.clearCartByEmail(claims.email);
            res.status(200).json(ResponseFactory.success(UUID, 'Cart cleared', cart));
        } catch (err: unknown) {
            const error = err as CustomError;
            next(new CustomError(UUID, error.status, error.message || 'Unexpected error'));
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}
