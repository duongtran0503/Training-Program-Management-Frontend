import { ComponentType } from 'react';
import HomePage from '../pages/Home';
import Primarylayout from '../components/layouts/PrimaryLayout';
import ManagerClass from '../pages/Manager/ManagerClass';
import ManagerDepartment from '../pages/Manager/ManagerDepartment';
import ManagerLecturer from '../pages/Manager/ManagerLecturer';
import ManagerSubject from '../pages/Manager/ManagerSubject';
import ManagerTraining from '../pages/Manager/ManagerTraining';
import ManagerSyllabus from '../pages/Manager/ManagerSyllabus';
import ViewSyllabus from '../pages/Manager/ManagerSubject/ViewSyllabus';

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
        path: '/manager/class',
        element: ManagerClass,
        layout: Primarylayout,
    },
    {
        path: '/manager/department',
        element: ManagerDepartment,
        layout: Primarylayout,
    },
    {
        path: '/manager/lecturer',
        element: ManagerLecturer,
        layout: Primarylayout,
    },
    {
        path: '/lecturer',
        element: ManagerLecturer,
        layout: Primarylayout,
    },
    {
        path: '/manager/subject',
        element: ManagerSubject,
        layout: Primarylayout,
    },
    {
        path: '/manager/training',
        element: ManagerTraining,
        layout: Primarylayout,
    },
    {
        path: '/manager/syllabus',
        element: ManagerSyllabus,
        layout: Primarylayout,
    },
    {
        path: '/manager/subject/:subjectId/syllabus',
        element: ViewSyllabus,
        layout: Primarylayout,
    },
];
