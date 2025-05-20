import axiosClient from '../config/axiosClient';
import { ApiResponse } from '../types/apiResponse';
import { lecturerResponse } from '../schemas/API/lecturerResposne';
import { localStorageName } from '../constans/localStorageName';

export const lecturerService = {
    getAllLecturers: async (): Promise<ApiResponse<lecturerResponse[]>> => {
        const token = localStorage.getItem(localStorageName.token);
        console.log('Token khi gọi API:', token);
        
        try {
            const response = await axiosClient.get('/users/lecturer/get-all');
            console.log('Response từ API:', response);
            console.log('Response data:', response.data);
            console.log('Response data.data:', response.data.data);
            // Trả về dữ liệu giảng viên trực tiếp
            return {
                data: response.data.data,
                statusCode: response.data.statusCode,
                isSuccess: response.data.success,
                message: response.data.message
            };
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
            throw error;
        }
    },

    getLecturerById: async (id: string): Promise<ApiResponse<lecturerResponse>> => {
        const response = await axiosClient.get(`/users/lecturer/${id}`);
        return {
            data: response.data.data,
            statusCode: response.data.statusCode,
            isSuccess: response.data.success,
            message: response.data.message
        };
    },

    createLecturer: async (data: any): Promise<ApiResponse<lecturerResponse>> => {
        const response = await axiosClient.post('/users/lecturer', data);
        return {
            data: response.data.data,
            statusCode: response.data.statusCode,
            isSuccess: response.data.success,
            message: response.data.message
        };
    },

    updateLecturer: async (id: string, data: any): Promise<ApiResponse<lecturerResponse>> => {
        const response = await axiosClient.put(`/users/lecturer/${id}`, data);
        return {
            data: response.data.data,
            statusCode: response.data.statusCode,
            isSuccess: response.data.success,
            message: response.data.message
        };
    },

    deleteLecturer: async (id: string): Promise<ApiResponse<void>> => {
        const response = await axiosClient.delete(`/users/lecturer/${id}`);
        return {
            data: response.data.data,
            statusCode: response.data.statusCode,
            isSuccess: response.data.success,
            message: response.data.message
        };
    },

    searchLecturers: async (name: string): Promise<ApiResponse<lecturerResponse[]>> => {
        const response = await axiosClient.get(`/users/lecturer/search?name=${name}`);
        return {
            data: response.data.data,
            statusCode: response.data.statusCode,
            isSuccess: response.data.success,
            message: response.data.message
        };
    }
}; 