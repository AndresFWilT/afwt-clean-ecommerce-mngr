import { Router, Response, NextFunction } from 'express';

import { CustomError } from '../../../infrastructure/exception/custom-error';
import { ICustomRequest, IRequest } from '../../../infrastructure/adapter/http/header';
import { IProductCreator } from '../../../domain/port/product/in/product-creator';
import { IProductReader } from '../../../domain/port/product/in/product-reader';
import { IProductModifier } from '../../../domain/port/product/in/product-modifier';
import { IProductRemover } from "../../../domain/port/product/in/product-remover";
import { ResponseFactory } from '../../../infrastructure/adapter/http/response-factory';
import { roleGuardMiddleware } from '../../middleware/role-guard';
import { validateRequestBody, validateRequestHeaders } from "../../middleware/validate-param";
import { validateUUID } from '../../../util/validation/uuid';

export class ProductController {
    private readonly router: Router = Router();

    constructor(
        private readonly creator: IProductCreator,
        private readonly reader: IProductReader,
        private readonly updater: IProductModifier,
        private readonly deleter: IProductRemover
    ) {
        this.router.post(
            '',
            roleGuardMiddleware(['ADMIN']),
            validateRequestHeaders,
            validateRequestBody,
            async (req, res, next) => {
                this.create(req, res, next).catch(next);
            });

        this.router.get(
            '',
            validateRequestHeaders,
            async (req, res, next) => {
                this.getAll(req, res, next).catch(next);
            });

        this.router.get(
            '/:id',
            validateRequestHeaders,
            async (req, res, next) => {
                this.getById(req, res, next).catch(next);
            });

        this.router.put(
            '/:id',
            roleGuardMiddleware(['ADMIN']),
            validateRequestHeaders,
            validateRequestBody,
            async (req, res, next) => {
                this.update(req, res, next).catch(next);
            });

        this.router.delete(
            '/:id',
            roleGuardMiddleware(['ADMIN']),
            validateRequestHeaders,
            async (req, res, next) => {
                this.delete(req, res, next).catch(next);
            });
    }

    private async create(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        const UUID = validateUUID(req as ICustomRequest);
        try {
            await this.creator.create(req.body);
            const response = ResponseFactory.success(UUID, 'Product created', {});
            res.status(201).json(response);
        } catch (err: any) {
            next(new CustomError(UUID, 400, err.message));
        }
    }

    private async getAll(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        const UUID = validateUUID(req as ICustomRequest);
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const products = await this.reader.getAll(page, limit);
            const response = ResponseFactory.success(UUID, 'Products fetched', products);
            res.status(200).json(response);
        } catch (err: any) {
            next(new CustomError(UUID, 400, err.message));
        }
    }

    private async getById(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        const UUID = validateUUID(req as ICustomRequest);
        try {
            if (req.params.id === null) {
                next(new CustomError(UUID, 400, 'invalid id'));
            }
            const id = parseInt(req.params.id);
            const product = await this.reader.getById(id);
            const response = ResponseFactory.success(UUID, 'Product fetched', product);
            res.status(200).json(response);
        } catch (err: any) {
            next(new CustomError(UUID, 404, err.message));
        }
    }

    private async update(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        const UUID = validateUUID(req as ICustomRequest);
        try {
            const id = parseInt(req.params.id);
            await this.updater.modify(id, req.body);
            const response = ResponseFactory.success(UUID, 'Product updated', {});
            res.status(200).json(response);
        } catch (err: any) {
            next(new CustomError(UUID, 400, err.message));
        }
    }

    private async delete(req: IRequest, res: Response, next: NextFunction): Promise<void> {
        const UUID = validateUUID(req as ICustomRequest);
        try {
            const id = parseInt(req.params.id);
            await this.deleter.execute(id);
            const response = ResponseFactory.success(UUID, 'Product deleted', {});
            res.status(200).json(response);
        } catch (err: any) {
            next(new CustomError(UUID, 400, err.message));
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}
