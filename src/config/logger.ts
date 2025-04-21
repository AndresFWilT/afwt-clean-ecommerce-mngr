import winston from 'winston';

const baseLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `${level} - [${new Date(timestamp as string).toISOString()}]: ${message}`;
        })
    ),
    transports: [new winston.transports.Console()],
});

function logWithUUID(level: string, uuid: string, message: string) {
    baseLogger.log({
        level,
        message: `[UUID: ${uuid}] - ${message}`,
    });
}

export const logger = {
    info: (uuid: string, message: string) => logWithUUID('info', uuid, message),
    error: (uuid: string, message: string) => logWithUUID('error', uuid, message),
    warn: (uuid: string, message: string) => logWithUUID('warn', uuid, message),
    debug: (uuid: string, message: string) => logWithUUID('debug', uuid, message),
};
