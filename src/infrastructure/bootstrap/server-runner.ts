import http from 'http';

import { logger} from "../../config/logger";
import { ServerConfiguration } from '../../config/server';
import env from '../../config/env';

export class ServerRunner {
    private readonly server: http.Server;
    private readonly port: number | string;

    constructor(private readonly config: ServerConfiguration) {
        this.port = this.normalizePort(env.serverConfig.PORT);
        this.config.app.set('port', this.port);
        this.server = http.createServer(this.config.app);
    }

    public run(): void {
        const uuid: string = 'BOOTSTRAP';
        this.server.listen(this.port);
        this.server.on('error', this.onError.bind(this));
        this.server.on('listening', this.onListening.bind(this, uuid));
        logger.info(uuid, `Server started on port: ${this.port}`);
    }

    private normalizePort(val: string): string | number {
        const nPort = parseInt(val, 10);
        if (isNaN(nPort)) return val;
        if (nPort >= 0) return nPort;
        return 3000;
    }

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') throw error;
        const uuid: string = 'BOOTSTRAP';
        const bind = typeof this.port === 'string'
            ? `Pipe ${this.port}`
            : `Port ${this.port}`;

        switch (error.code) {
            case 'EACCES':
                logger.error(uuid, `${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                logger.error(uuid, `${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    private onListening(uuid: string): void {
        const addr = this.server.address();
        const bind = typeof addr === 'string'
            ? `pipe ${addr}`
            : `port ${(addr as any)?.port}`;
        logger.warn(uuid, `Listening on: ${bind}`);
    }
}
