export interface CourseResponse {
    courseCode: string;
    courseName: string;
    credits: number;
    description: string;
    status: boolean;
    prerequisites: string[];
}