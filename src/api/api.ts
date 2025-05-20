// CourseSyllabus interfaces
export interface CourseSyllabus {
  syllabusId: string;
  syllabusContent: string;
  theory: number;
  practice: number;
  credit: number;
  status: number;
  evaluationComponents: {
    id: string;
    componentName: string;
    ratio: number;
  };
  courseResponse: {
    courseCode: string;
    courseName: string;
    credits: number;
    description: string;
    status: number;
  };
  createAt: string;
  updateAt: string;
}

export interface CreateCourseSyllabusRequest {
  syllabusContent: string;
  theory: number;
  practice: number;
  credit: number;
  status: number;
  evaluationComponents: {
    componentName: string;
    ratio: number;
  };
}

export interface UpdateCourseSyllabusRequest {
  syllabusContent?: string;
  theory?: number;
  practice?: number;
  credit?: number;
  status?: number;
  evaluationComponents?: {
    componentName: string;
    ratio: number;
  };
}

// CourseSyllabus API calls
export const createCourseSyllabus = async (data: CreateCourseSyllabusRequest) => {
  return await axios.post(`${API_URL}/courses/course-syllabus`, data);
};

export const getAllCourseSyllabuses = async () => {
  return await axios.get(`${API_URL}/courses/course-syllabus`);
};

export const getCourseSyllabusById = async (id: string) => {
  return await axios.get(`${API_URL}/courses/course-syllabus/${id}`);
};

export const updateCourseSyllabus = async (id: string, data: UpdateCourseSyllabusRequest) => {
  return await axios.put(`${API_URL}/courses/course-syllabus/${id}`, data);
};

export const deleteCourseSyllabus = async (id: string) => {
  return await axios.delete(`${API_URL}/courses/course-syllabus/${id}`);
}; 