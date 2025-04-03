export interface IAPiResponse<T> {
    statusCode: number;
    message: string | undefined;
    data: T | null | undefined;
}
