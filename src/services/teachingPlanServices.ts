import axiosClient from '../config/axiosClient';
import { ApiResponse } from '../types/apiResponse';
import { teachingPlanResponse } from '../schemas/API/teachingPlanResponse';
import { localStorageName } from '../constans/localStorageName';

export const teachingPlanService = {
    getAllTeachingPlans: async (): Promise<ApiResponse<teachingPlanResponse[]>> => {
        const token = localStorage.getItem(localStorageName.token);
        try {
            const response = await axiosClient.get('/teaching-plans');
            return {
                data: response.data.data,
                statusCode: response.data.statusCode,
                isSuccess: response.data.isSuccess ?? response.data.success ?? false,
                message: response.data.message
            };
        } catch (error) {
            throw error;
        }
    },

    getTeachingPlanById: async (id: string): Promise<ApiResponse<teachingPlanResponse>> => {
        const response = await axiosClient.get(`/teaching-plans/${id}`);
        return {
            data: response.data.data,
            statusCode: response.data.statusCode,
            isSuccess: response.data.isSuccess ?? response.data.success ?? false,
            message: response.data.message
        };
    },

    createTeachingPlan: async (data: any): Promise<ApiResponse<teachingPlanResponse>> => {
        const response = await axiosClient.post('/teaching-plans', data);
        return {
            data: response.data.data,
            statusCode: response.data.statusCode,
            isSuccess: response.data.isSuccess ?? response.data.success ?? false,
            message: response.data.message
        };
    },

    updateTeachingPlan: async (id: string, data: any): Promise<ApiResponse<teachingPlanResponse>> => {
        const response = await axiosClient.put(`/teaching-plans/${id}`, data);
        return {
            data: response.data.data,
            statusCode: response.data.statusCode,
            isSuccess: response.data.isSuccess ?? response.data.success ?? false,
            message: response.data.message
        };
    },

    deleteTeachingPlan: async (id: string): Promise<ApiResponse<void>> => {
        const response = await axiosClient.delete(`/teaching-plans/${id}`);
        return {
            data: response.data.data,
            statusCode: response.data.statusCode,
            isSuccess: response.data.isSuccess ?? response.data.success ?? false,
            message: response.data.message
        };
    },
};