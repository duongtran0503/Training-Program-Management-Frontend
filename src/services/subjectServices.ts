import axiosClient from '../config/axiosClient';
import { endpoint } from '../constans/endpoint';
import { localStorageName } from '../constans/localStorageName';
import { Course } from '../types/course';

interface CreateSubjectData {
    courseCode: string;
    courseName: string;
    credits: number;
    description: string;
    status: boolean;
}

interface UpdateSubjectData extends Partial<CreateSubjectData> {}

export const subjectServices = {
    getAllSubjects: () => {
        const token = localStorage.getItem(localStorageName.token);
        console.log('Calling getAllSubjects API with endpoint:', endpoint.subject.getAll);
        console.log('Current token:', token);
        console.log('Request headers:', {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        return axiosClient.get(endpoint.subject.getAll)
            .then(response => {
                console.log('API Response:', response);
                console.log('Response data:', response.data);
                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);
                return response;
            })
            .catch(error => {
                console.error('API Error:', error);
                console.error('Error details:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    headers: error.response?.headers,
                    config: {
                        url: error.config?.url,
                        method: error.config?.method,
                        headers: error.config?.headers,
                        baseURL: error.config?.baseURL
                    }
                });
                throw error;
            });
    },
    getSubjectById: (id: string) => {
        return axiosClient.get(`${endpoint.subject.getById}/${id}`);
    },
    createSubject: (data: CreateSubjectData) => {
        return axiosClient.post(endpoint.subject.create, data);
    },
    updateSubject: (id: string, data: UpdateSubjectData) => {
        return axiosClient.put(`${endpoint.subject.update}/${id}`, data);
    },
    deleteSubject: (id: string) => {
        return axiosClient.delete(`${endpoint.subject.delete}/${id}`);
    },
    searchSubjects: (searchTerm: string) => {
        return axiosClient.get(`${endpoint.subject.search}?searchTerm=${searchTerm}`);
    },
    getSyllabus: (subjectId: string) => {
        return axiosClient.get(`${endpoint.subject.getById}/${subjectId}/syllabus`);
    },
    addPrerequisites: (subjectId: string, prerequisiteIds: string[]) => {
        return axiosClient.post(`${endpoint.subject.prerequisites}/${subjectId}`, prerequisiteIds);
    },
    removePrerequisite: (subjectId: string, prerequisiteId: string) => {
        return axiosClient.delete(`${endpoint.subject.prerequisites}/${subjectId}/${prerequisiteId}`);
    }
}; 