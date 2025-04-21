export interface IBaseResponse {
    uuid: string;
    timestamp: string;
}

export interface ISuccessResponse<T> extends IBaseResponse {
    description: string;
    data: T;
}

export interface IErrorResponse extends IBaseResponse {
    error: string;
}
