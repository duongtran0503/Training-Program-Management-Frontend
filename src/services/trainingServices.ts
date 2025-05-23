import axiosClient from '../config/axiosClient';
import { ApiResponse } from '../types/apiResponse';
import { trainingProgramResponse } from '../schemas/API/trainingProgramResponse';
import { localStorageName } from '../constans/localStorageName';

export const trainingService = {
    getAllTrainingPrograms: async (): Promise<ApiResponse<trainingProgramResponse[]>> => {
        const token = localStorage.getItem(localStorageName.token);
        try {
            const response = await axiosClient.get('/training-programs');
            return {
                data: response.data.data,
                statusCode: response.data.statusCode,
                isSuccess: response.data.isSuccess ?? response.data.success ?? false, // Kiểm tra cả isSuccess và success
                message: response.data.message
            };
        } catch (error) {
            throw error;
        }
    },

    getTrainingProgramById: async (id: string): Promise<ApiResponse<trainingProgramResponse>> => {
        const response = await axiosClient.get(`/training-programs/${id}`);
        return {
            data: response.data.data,
            statusCode: response.data.statusCode,
            isSuccess: response.data.isSuccess ?? response.data.success ?? false,
            message: response.data.message
        };
    },

    createTrainingProgram: async (data: any): Promise<ApiResponse<trainingProgramResponse>> => {
        const response = await axiosClient.post('/training-programs', data);
        return {
            data: response.data.data,
            statusCode: response.data.statusCode,
            isSuccess: response.data.isSuccess ?? response.data.success ?? false,
            message: response.data.message
        };
    },

    updateTrainingProgram: async (id: string, data: any): Promise<ApiResponse<trainingProgramResponse>> => {
        const response = await axiosClient.put(`/training-programs/${id}`, data);
        return {
            data: response.data.data,
            statusCode: response.data.statusCode,
            isSuccess: response.data.isSuccess ?? response.data.success ?? false,
            message: response.data.message
        };
    },

    deleteTrainingProgram: async (id: string): Promise<ApiResponse<void>> => {
        const response = await axiosClient.delete(`/training-programs/${id}`);
        return {
            data: response.data.data,
            statusCode: response.data.statusCode,
            isSuccess: response.data.isSuccess ?? response.data.success ?? false,
            message: response.data.message
        };
    },

    searchTrainingPrograms: async (name: string): Promise<ApiResponse<trainingProgramResponse[]>> => {
        const response = await axiosClient.get(`/training-programs/search?name=${name}`);
        return {
            data: response.data.data,
            statusCode: response.data.statusCode,
            isSuccess: response.data.isSuccess ?? response.data.success ?? false,
            message: response.data.message
        };
    }
};