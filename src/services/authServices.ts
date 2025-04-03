import axiosClient from '../config/axiosClient';
import { endpoints } from '../constans/endpoint';
import { IAPiResponse } from '../schemas/API/APIResponse';
import { loginRespone } from '../schemas/API/auth';
import { loginSchemaType } from '../schemas/auth/login';

export const authServices = {
    async login(data: loginSchemaType): Promise<IAPiResponse<loginRespone>> {
        return await axiosClient.post(endpoints.login, data);
    },
};
