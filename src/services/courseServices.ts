import axiosClient from '../config/axiosClient';
import { ApiResponse } from '../types/apiResponse';
import { Course } from '../types/course';

export const courseService = {
    createCourse: async (data: {
        courseCode: string;
        courseName: string;
        credits: number;
        description: string;
        status: boolean;
        prerequisites: string[];
    }): Promise<ApiResponse<Course>> => {
        const response = await axiosClient.post('/courses', data);
        return response.data;
    },

    getAllCourses: async (): Promise<ApiResponse<Course[]>> => {
        const response = await axiosClient.get('/courses');
        return response.data;
    },

    getCourseByCode: async (courseCode: string): Promise<ApiResponse<Course>> => {
        const response = await axiosClient.get(`/courses/${courseCode}`);
        return response.data;
    },

    updateCourse: async (courseCode: string, data: {
        courseName?: string;
        credits?: number;
        description?: string;
        status?: boolean;
        prerequisites?: string[];
    }): Promise<ApiResponse<Course>> => {
        const response = await axiosClient.put(`/courses/${courseCode}`, data);
        return response.data;
    },

    deleteCourse: async (courseCode: string): Promise<ApiResponse<void>> => {
        const response = await axiosClient.delete(`/courses/${courseCode}`);
        return response.data;
    },

    searchCourses: async (name: string): Promise<ApiResponse<Course[]>> => {
        const response = await axiosClient.get(`/courses/search?name=${name}`);
        return response.data;
    },

    importCourses: async (formData: FormData): Promise<ApiResponse<void>> => {
        const response = await axiosClient.post('/courses/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}; 