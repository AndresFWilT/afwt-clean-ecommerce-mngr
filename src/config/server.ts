import express, { Express } from 'express';
import actuator from 'express-actuator';
import morgan from 'morgan';
import path from 'path';

import { logger } from "./logger";
import {sendErrorResponse} from "../infrastructure/adapter/http/error-handler";
import env from './env';
import productRouter from "../adapter/route/product/product-route-configuration";
import userRouter from "../adapter/route/user/user-route-configuration";
import cartRouter from "../adapter/route/cart/cart-route-configuration";
import purchaseRouter from "../adapter/route/purchase/purchase-route-configuration";

export class ServerConfiguration {
    private readonly _app: Express;
    private readonly _apiBasePath: string;

    constructor() {
        this._app = express();
        this._apiBasePath = env.serverConfig.API_BASE_PATH;
        this.configure();
    }

    private configure(): void {
        this.setupRequestLogging();
        this.setupParsers();
        this.setupStaticFiles();
        this.setupCorsHeaders();
        this.setupRoutes();
    }

    private setupRequestLogging(): void {
        this._app.use(
            morgan('combined', {
                skip: (req) => req.path === '/management/health',
                stream: {
                    write: (message) => logger.info('N/A', message.trim()),
                },
            })
        );
    }

    private setupParsers(): void {
        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: false }));
    }

    private setupStaticFiles(): void {
        this._app.use(express.static(path.join(__dirname, '../static')));
    }

    private setupCorsHeaders(): void {
        const allowedOrigins = (env.serverConfig.ALLOWED_ORIGINS)
            .split(',')
            .map(origin => origin.trim());

        this._app.use((req, res, next) => {
            const origin = req.headers.origin;

            if (origin && allowedOrigins.includes(origin)) {
                res.setHeader('Access-Control-Allow-Origin', origin);
            }

            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-RqUID');
            res.setHeader('Access-Control-Allow-Credentials', 'true');

            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
                return;
            }

            next();
        });

    }

    private setupRoutes(): void {
        this._app.use(
            actuator({
                basePath: '/management',
            })
        );

        logger.info('N/A', 'api path: ' + this._apiBasePath);

        this._app.use(this._apiBasePath, userRouter);
        this._app.use(this._apiBasePath, productRouter);
        this._app.use(this._apiBasePath, cartRouter);
        this._app.use(this._apiBasePath, purchaseRouter);

        this._app.use(sendErrorResponse)
    }

    public get app(): Express {
        return this._app;
    }
}
