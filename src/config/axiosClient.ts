import axios from 'axios';
import { localStorageName } from '../constans/localStorageName';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem(localStorageName.token);
        console.log('Request interceptor - Token:', token);
        console.log('Request interceptor - Config:', {
            url: config.url,
            method: config.method,
            baseURL: config.baseURL,
            headers: config.headers
        });
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Request headers after adding token:', config.headers);
        }
        return config;
    },
    function (error) {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
    function (response) {
        console.log('Response interceptor - Success:', {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data
        });
        return response;
    },
    function (error) {
        console.error('Response interceptor - Error:', error);
        console.error('Error response:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers
        });
        if (error.response?.status === 401) {
            localStorage.removeItem(localStorageName.token);
            window.location.replace('/');
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
