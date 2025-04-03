import { ComponentType } from 'react';
import HomePage from '../pages/Home';
import Primarylayout from '../components/layouts/PrimaryLayout';
import ManagerLecturer from '../pages/Manager/ManagerLecturer';

export const privateRouters: {
    path: string;
    element: ComponentType;
    layout?: ComponentType;
}[] = [
    {
        path: '/home',
        element: HomePage,
        layout: Primarylayout,
    },
    {
        path: '/statics',
        element: HomePage,
        layout: Primarylayout,
    },
    {
        path: '/lecturer',
        element: ManagerLecturer,
        layout: Primarylayout,
    },
];
