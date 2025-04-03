import { ComponentType } from 'react';
import Defaultlayout from '../components/layouts/DefaultLayout';
import LoginPage from '../pages/auth/Login';

export const publicRouters: {
    path: string;
    element: ComponentType;
    layout?: ComponentType;
}[] = [
    {
        path: '/',
        element: LoginPage,
        layout: Defaultlayout,
    },
];
