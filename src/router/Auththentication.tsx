import { useEffect, useState } from 'react';
import { localStorageName } from '../constans/localStorageName';
import { Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

// eslint-disable-next-line react-refresh/only-export-components
export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem(localStorageName.token);
    if (token) {
        return true;
    }
    return true;
};
export default function Authentication({
    element: Component,
}: {
    element: React.ComponentType;
}) {
    const [isLogin, setIsLogin] = useState<boolean | null>(false);
    useEffect(() => {
        if (isAuthenticated()) {
            setIsLogin(true);
        } else {
            setIsLogin(null);
        }
    }, []);
    if (isLogin === false) {
        return <Box>Loading ...</Box>;
    }
    if (isLogin === null) {
        return <Navigate to={'/'} replace />;
    }
    return <Component />;
}
