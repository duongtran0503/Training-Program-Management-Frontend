import { ComponentType } from 'react';
import HomePage from '../pages/Home';
import Primarylayout from '../components/layouts/PrimaryLayout';
import ManagerLecturer from '../pages/Manager/ManagerLecturer';
import ManagerDepartment from '../pages/Manager/ManagerDepartment';
import ManagerStudent from '../pages/Manager/ManagerStudent';
import ManagerClass from '../pages/Manager/ManagerClass';
import ManagerSubject from '../pages/Manager/ManagerSubject';
import ManagerTraining from '../pages/Manager/ManagerTraining';
import TrainingPublish from '../pages/TrainingPublish';

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
        path: '/student',
        element: ManagerStudent,
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
    {
        path: '/training/publish',
        element: TrainingPublish,
        layout: Primarylayout,
    },
];
