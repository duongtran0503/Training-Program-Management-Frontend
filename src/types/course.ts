export interface Course {
    id: string;
    courseCode: string;
    courseName: string;
    credits: number;
    description: string;
    status: boolean;
    prerequisites: Course[];
    createdAt: string;
    updatedAt: string;
} 