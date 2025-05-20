import axiosClient from '../config/axiosClient';
import { ApiResponse } from '../types/apiResponse';

export interface CourseSyllabus {
    syllabusId: string;
    syllabusContent: string;
    theory: number;
    practice: number;
    credit: number;
    status: number;
    evaluationComponents?: {
        id: string;
        componentName: string;
        ratio: number;
    };
    courseResponse: {
        courseCode: string;
        courseName: string;
        description: string;
        status: boolean;
        prerequisites: Array<{
            courseCode: string;
            courseName: string;
        }>;
    };
    createAt: string;
    updateAt: string;
}

export interface CreateSyllabusRequest {
    syllabusContent: string;
    theory: number;
    practice: number;
    credit: number;
    status: number;
    evaluationComponents?: {
        componentName: string;
        ratio: number;
    };
}

export const courseSyllabusService = {
    checkCourseExists: async (courseCode: string): Promise<boolean> => {
        try {
            const response = await axiosClient.get(`/courses/${courseCode}`);
            return response.status === 200;
        } catch (error) {
            return false;
        }
    },

    createSyllabus: async (courseCode: string, data: CreateSyllabusRequest): Promise<ApiResponse<CourseSyllabus>> => {
        const requestBody = {
            syllabusContent: data.syllabusContent,
            theory: data.theory,
            practice: data.practice,
            credit: data.credit,
            status: 1,
            evaluationComponents: data.evaluationComponents
        };
        
        console.log('=== CREATE SYLLABUS DEBUG ===');
        console.log('Course Code:', courseCode);
        console.log('Original Data:', data);
        console.log('Request Body:', requestBody);
        
        const response = await axiosClient.post(`/courses/course-syllabus/${courseCode}`, requestBody);
        
        console.log('Response:', response.data);
        console.log('===========================');
        
        return response.data;
    },

    getAllSyllabuses: async (): Promise<ApiResponse<CourseSyllabus[]>> => {
        console.log('=== GET ALL SYLLABUSES DEBUG ===');
        const response = await axiosClient.get('/courses/course-syllabus');
        console.log('Response Data:', JSON.stringify(response.data, null, 2));
        console.log('=============================');
        return response.data;
    },

    getSyllabusById: async (syllabusId: string): Promise<ApiResponse<CourseSyllabus>> => {
        const response = await axiosClient.get(`/courses/course-syllabus/${syllabusId}`);
        return response.data;
    },

    updateSyllabus: async (syllabusId: string, data: CreateSyllabusRequest): Promise<ApiResponse<CourseSyllabus>> => {
        const requestBody = {
            syllabusContent: data.syllabusContent,
            theory: data.theory,
            practice: data.practice,
            credit: data.credit,
            status: data.status,
            evaluationComponents: data.evaluationComponents
        };
        
        console.log('=== UPDATE SYLLABUS DEBUG ===');
        console.log('Syllabus ID:', syllabusId);
        console.log('Original Data:', data);
        console.log('Request Body:', requestBody);
        
        const response = await axiosClient.put(`/courses/course-syllabus/${syllabusId}`, requestBody);
        
        console.log('Response:', response.data);
        console.log('===========================');
        
        return response.data;
    },

    deleteSyllabus: async (syllabusId: string): Promise<ApiResponse<void>> => {
        try {
            const response = await axiosClient.delete(`/courses/course-syllabus/${syllabusId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting syllabus:', error);
            throw error;
        }
    },

    searchSyllabuses: async (name: string): Promise<ApiResponse<CourseSyllabus[]>> => {
        const response = await axiosClient.get(`/courses/course-syllabus/search?name=${encodeURIComponent(name)}`);
        return response.data;
    }
}; 