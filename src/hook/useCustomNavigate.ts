import { useNavigate } from 'react-router-dom';

export default function useCustomNavigate() {
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_DOMAIN_VALUE;

    const customNavigate = (path: string) => {
        if (path.startsWith('/')) {
            // Chuyển hướng đến ExternalRedirect component
            navigate(`/external?to=${encodeURIComponent(baseUrl + path)}`);
        } else {
            // Chuyển hướng trong ứng dụng
            navigate(path);
        }
    };

    return customNavigate;
}
