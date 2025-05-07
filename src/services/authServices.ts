import axiosClient from '../config/axiosClient';
import { endpoints } from '../constans/endpoint';
import { IAPiResponse } from '../schemas/API/APIResponse';  // Ensure this includes statusCode, message, etc.
import { loginRespone } from '../schemas/API/auth';
import { loginSchemaType } from '../schemas/auth/login';
import Cookies from 'js-cookie'; // Import the js-cookie library

export const authServices = {
    async login(data: loginSchemaType): Promise<IAPiResponse<loginRespone>> {
        try {
            // Make the API request to login
            const response: IAPiResponse<loginRespone> = await axiosClient.post(endpoints.login, data);

            // After successful login, store the token in a cookie
            if (response.data && response.data.token) {
                // Set the token to the cookie, with a 1-day expiry
                Cookies.set('authToken', response.data.token, { expires: 1 });
            }

            return response; // Ensure the return matches IAPiResponse
        } catch (error) {
            console.error('Login failed:', error);
            throw error; // Propagate the error for handling in the component
        }
    },
};