export const endpoint = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
    },
    subject: {
        getAll: '/courses',
        getById: '/courses',
        create: '/courses',
        update: '/courses',
        delete: '/courses',
        search: '/courses/search',
        prerequisites: '/courses/prerequisites',
        syllabus: '/courses/course-syllabus',
    },
    teachingPlan: {
        getAll: '/teaching-plans',
        getById: '/teaching-plans',
        create: '/teaching-plans',
        update: '/teaching-plans',
        delete: '/teaching-plans',
    },
};