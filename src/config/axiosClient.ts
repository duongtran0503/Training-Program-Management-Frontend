import axios from 'axios';
const api_url: string = import.meta.env.VITE_API_URL as string;
const axiosClient = axios.create({
    baseURL: api_url,
    headers: {
        'Content-Type': 'application/json',
    },
});
axiosClient.interceptors.request.use(
    (request) => {
        return request;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error('error from axios:', error);
        if (error.response) {
            const statusCode = error.response.status;

            if (statusCode === 404 || statusCode === 500) {
                return Promise.reject({
                    message: 'Page not found or Server Error',
                    statusCode: statusCode,
                    data: null,
                });
            } else {
                const message = error.response.data?.message || 'ERROR';
                return Promise.resolve({
                    message: message,
                    statusCode: statusCode,
                    data: error.response.data,
                });
            }
        } else {
            return Promise.reject({
                message: 'ERROR FROM SERVER',
            });
        }
    }
);
export default axiosClient;
