import { toast } from 'react-toastify';

export const errorAPIRequest = {
    serverError({
        message = 'Lỗi hệ thống vui lòng thử lại sau!',
        error,
    }: {
        message?: string;
        error: unknown;
    }) {
        console.log(error);
        toast.error(message);
    },
};
