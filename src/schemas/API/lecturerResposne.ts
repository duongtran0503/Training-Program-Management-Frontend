export interface LecturerResponse {
    id: string;
    role: string;
    name: string;
    lecturerCode: string;
    gender: string;  // Changed to 'gender' instead of 'isMale'
    titleAcademicRank: string;
    avatar: string;
    department: string;
    status: boolean;
    dob: string;
    startDateOfTeaching: string;
    endDateOfTeaching: string | null;  // Adjusted for null value
    createAt: string;
    updateAt: string;
}