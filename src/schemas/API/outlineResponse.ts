export interface OutlineResponse {
    syllabusId: string;
    syllabusContent: string;
    theory: number;
    practice: number;
    credit: number;
    status: boolean;
    evaluationComponents: {
        id: string;
        componentName: string;
        ratio: number;
    };
    courseResponse: {
        courseCode: string;
        courseName: string;
        description: string;
        status: boolean;
        prerequisites: {
            courseCode: string;
            courseName: string;
        }[];
    };
    createAt: string;
    updateAt: string;
}