export interface ApiResponse<T> {
    data: T;
    statusCode: number;
    isSuccess: boolean;
    message: string;
    success?: boolean;
} 