import { IErrorResponse, ISuccessResponse } from './response';

export class ResponseFactory {
    static success<T>(uuid: string, description: string, data: T | null | undefined): ISuccessResponse<T> {
        return {
            uuid,
            timestamp: new Date().toISOString(),
            description,
            data: data ?? {},
        };
    }

    static error(uuid: string, error: string): IErrorResponse {
        return {
            uuid,
            timestamp: new Date().toISOString(),
            error,
        };
    }
}
