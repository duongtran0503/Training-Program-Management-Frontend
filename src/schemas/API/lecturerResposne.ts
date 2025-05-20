export interface lecturerResponse {
    id: string;
    avatar: string;
    role: string;
    name: string;
    lecturerCode: string;
    gender: string;
    titleAcademicRank: string;
    status: boolean;
    dob: string;
    startDateOfTeaching: string;
    endDateOfTeaching: string | null;
    createdAt: string;
    updatedAt: string;
}
