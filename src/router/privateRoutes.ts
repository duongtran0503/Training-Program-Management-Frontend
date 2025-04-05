import { ComponentType } from 'react';
import HomePage from '../pages/Home';
import Primarylayout from '../components/layouts/PrimaryLayout';
import ManagerLecturer from '../pages/Manager/ManagerLecturer';
import ManagerDepartment from '../pages/Manager/ManagerDepartment';
import ManagerClass from '../pages/Manager/ManagerClass';
import ManagerSubject from '../pages/Manager/ManagerSubject';
import ManagerTraining from '../pages/Manager/ManagerTraining';

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
    {
        path: '/department',
        element: ManagerDepartment,
        layout: Primarylayout,
    },
    {
        path: '/class',
        element: ManagerClass,
        layout: Primarylayout,
    },
    {
        path: '/subject',
        element: ManagerSubject,
        layout: Primarylayout,
    },
    {
        path: '/training',
        element: ManagerTraining,
        layout: Primarylayout,
    },
];
