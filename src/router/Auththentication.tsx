import { useEffect, useState } from 'react';
import { localStorageName } from '../constans/localStorageName';
import { Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

// eslint-disable-next-line react-refresh/only-export-components
export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem(localStorageName.token);
    return !!token;
};

export default function Authentication({
    element: Component,
}: {
    element: React.ComponentType;
}) {
    const [isLogin, setIsLogin] = useState<boolean | null>(null);

    useEffect(() => {
        setIsLogin(isAuthenticated());
    }, []);

    if (isLogin === null) {
        return <Box>Loading ...</Box>;
    }

    if (!isLogin) {
        return <Navigate to="/" replace />;
    }

    return <Component />;
}
