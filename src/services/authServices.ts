import axiosClient from '../config/axiosClient';
import { endpoint } from '../constans/endpoint';
import { IAPiResponse } from '../schemas/API/APIResponse';
import { loginRespone } from '../schemas/API/auth';
import { loginSchemaType } from '../schemas/auth/login';
import { localStorageName } from '../constans/localStorageName';

export const authServices = {
    async login(data: loginSchemaType): Promise<IAPiResponse<loginRespone>> {
        console.log('Gọi API đăng nhập với endpoint:', endpoint.auth.login);
        console.log('Data gửi đi:', data);
        const response = await axiosClient.post(endpoint.auth.login, data);
        console.log('Response từ server:', response);
        if (response.data.data?.token) {
            localStorage.setItem(localStorageName.token, response.data.data.token);
            console.log('Token đã được lưu:', response.data.data.token);
        }
        return response.data;
    },
    register: (data: any) => {
        return axiosClient.post(endpoint.auth.register, data);
    },
    logout: () => {
        return axiosClient.post(endpoint.auth.logout);
    }
};
