import express, { Express } from 'express';
import actuator from 'express-actuator';
import morgan from 'morgan';
import path from 'path';

import { logger } from "./logger";
import env from './env';
import userRouter from "../adapter/route/user/user-route-configuration";
import {sendErrorResponse} from "../infrastructure/adapter/http/error-handler";

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
        this._app.use((_, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
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

        this._app.use(sendErrorResponse)
    }

    public get app(): Express {
        return this._app;
    }
}
