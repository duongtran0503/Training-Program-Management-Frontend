import { Box, Button } from '@mui/material';
import { styledSystem } from '../../../constans/styled';
import { TitleCustom } from '../../../components/custom/Title';
import { FormButtonCustom } from '../../../components/custom/Button/FormButtonCustom';
import AddIcon from '@mui/icons-material/Add';
import { FormInputCustom } from '../../../components/custom/Input/FormInputCustom';
import DataTable from '../../../components/Table';
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import Cookies from 'js-cookie';
import { CourseResponse } from '../../../schemas/API/courseResponse';
import { OutlineResponse } from '../../../schemas/API/outlineResponse';
import { useEffect, useState } from 'react';
import ModalWrapper from '../../../components/Modal/ModalWrapper';
import FormAddCourse from '../../../components/Modal/FormAddSubject';
import FormAddOutline from '../../../components/Modal/FormAddOutline'; // Import the Edit form
import FormEditCourse from '../../../components/Modal/FormEditSubject'; // Import the Edit form
import FormEditOutline from '../../../components/Modal/FormEditOutline'; // Import the Edit form
import axios from 'axios';
import axiosClient from '../../../../src/config/axiosClient';

// const rows: lecturerResponse[] = [
//     {
//         id: '123123',
//         role: 'lecturer',
//         avatar: 'sdf',
//         name: 'nguyen van a',
//         lecturerCode: '123123',
//         isMale: true,
//         status: true,
//         dob: '2000-10-10',
//         startDateOfTeaching: '2000-10-10',
//         endDateOfTeaching: '2000-10-10',
//         createAt: '2000-10-10',
//         updateAt: '2000-10-10',
//     },
// ];

type Props<T> = {
    columns: GridColDef[];
    data: T[];
    loading?: boolean; // ✅ Add this line
    paginationModel?: { page: number; pageSize: number };
    initialState?: any;
    handleEdit: (value: T) => void;
    handleDelete: (value: T) => void;
};

const columnsOutline: GridColDef[] = [
    { field: 'syllabusId', headerName: 'Mã đề cương', width: 120 },
    { field: 'syllabusContent', headerName: 'Nội dung đề cương', width: 250 },
    { field: 'practice', headerName: 'Số tiết thực hành', width: 120 },
    { field: 'theory', headerName: 'Tỉ lệ(%)', width: 120 },
    {
        field: 'status',
        headerName: 'Trạng thái',
        width: 100,
        renderCell: (params) =>
            params.value ? 'Hoạt động' : 'Ngừng'
    }
];
  
  
  
  


type CoursePayload = {
    courseCode: string;
    courseName: string;
    credits: number;
    description: string;
    status: boolean;
    prerequisites: string[];
};

type OutlinePayload = {
    courseCode: string;
    courseName: string;
    description: string;
    credits: number;
    syllabusContent: string;
    theory: number;
    practice: number;
    credit: number;
    evaluationComponents: {
      componentName: string;
      ratio: number;
    };
    status?: boolean;  // Optional property for status
    prerequisites?: string[];  // Optional property for prerequisites
};
  

type SyllabusPayload = {
    syllabusId: string;
    syllabusContent: string;
    theory: number;
    practice: number;
    credit: number;
    evaluationComponents: {
      componentName: string;
      ratio: number;
    };
  };

const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function ManagerLecturer() {
    const [loading, setLoading] = useState<boolean>(false); // ✅ Move the hook inside the component body
    const [isOpenModalEditLecturer, setIsOpenModalEditLecturer] = useState(false);
    const [isOpenModalEditOutline, setIsOpenModalEditOutline] = useState(false);
    const [selectedCourse, setSelectedLecturer] = useState<CoursePayload | null>(null);
    const [selectedOutline, setSelectedOutline] = useState<SyllabusPayload | null>(null);
    const [courses, setCourses] = useState<CourseResponse[]>([]);
    const [outlines, setOutlines] = useState<OutlineResponse[]>([]);
    const [isOpenModalAddLecturer, setIsOpenModalAddLecturer] =
        useState<boolean>(false);
    const [isOpenModalAddOutline, setIsOpenModalAddOutline] = useState(false);
    const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchOutlineTerm, setSearchOutlineTerm] = useState('');
    const [searchResults, setSearchResults] = useState<CourseResponse[]>([]);
    const [searchOutlineResults, setSearchOutlineResults] = useState<OutlineResponse[]>([]);
    const handleEdit = (lecturer: CoursePayload) => {
        console.log("Data:", lecturer)
            setSelectedLecturer(lecturer);
            setIsOpenModalEditLecturer(true); // Open the modal
    };

    const columns: GridColDef[] = [
        { field: 'courseCode', headerName: 'Mã môn học', width: 120 },
        { field: 'courseName', headerName: 'Tên môn học', width: 200 },
        { field: 'description', headerName: 'Mô tả', width: 250 },
        {
            field: 'prerequisites',
            headerName: 'Học phần tiên quyết',
            width: 200,
            renderCell: (params) =>
                params.value && params.value.length
                    ? params.value.map((p: any) => p.courseName).join(', ')
                    : 'Không có'
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 100,
            renderCell: (params) =>
                params.value ? 'Hoạt động' : 'Ngừng'
        },
        {
            field: 'action', // New column for the plus button
            headerName: '',
            width: 100,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenAddOutline(params.row)} // Pass courseCode to the modal
                >
                    +
                </Button>
            ),
        },
    ];

    const handleOpenAddOutline = (lecturer: CoursePayload) => {
        setSelectedLecturer(lecturer);  // Set the selected courseCode
        setIsOpenModalAddOutline(true);  // Open the modal
    };

    const handleCreateOutline = async (outlineData: OutlinePayload) => {
        if (selectedCourse) {
            await createOutline(selectedCourse.courseCode, outlineData);  // Call createOutline with selected courseCode
        }
        setIsOpenModalAddOutline(false);  // Close modal after submission
    };

    const createOutline = async (courseCode: string, outlineData: OutlinePayload) => {
        try {
          const token = Cookies.get('authToken');
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
          const response = await axiosClient.post(`/courses/course-syllabus/${courseCode}`, outlineData, { headers });
      
          if (response.status === 201 || response.status === 200) {
            // You can handle any post-creation actions here, like updating the course list.
            console.log('Outline created successfully');
          }

          if (response.data) {
            fetchOutline();
          }
        } catch (error) {
          console.error('Failed to create outline:', error);
        }
      };

    const handleOutlineEdit = (outline: SyllabusPayload) => {
        console.log("Data:", outline)
        setSelectedOutline(outline);
        setIsOpenModalEditOutline(true); // Open the modal
    };
    
    const handleDelete = (id: string) => {
        // Assuming id is the course ID
        if (selectedCourse) {
            // You might want to set selectedCourse to null or handle deletion based on the course ID
            // Then perform your delete logic here
            handleSaveDelete(); // Assuming this function uses the id to delete the course
        }
    };
    
    const handleOutlineDelete = (id: string) => {
        // Assuming id is the course ID
        if (selectedCourse) {
            // You might want to set selectedCourse to null or handle deletion based on the course ID
            // Then perform your delete logic here
            handleSaveOutlineDelete(); // Assuming this function uses the id to delete the course
        }
    };

    const fetchCourses = async () => {
        try {
            setLoading(true);
    
            const token = Cookies.get('authToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/courses`,
                { headers }
            );
    
            if (response.data && response.data.data) {
                // Map the response data to fit your Course type
                const mappedCourses: CourseResponse[] = response.data.data.map((course: any) => ({
                    courseCode: course.courseCode,
                    courseName: course.courseName,
                    description: course.description,
                    status: course.status,
                    prerequisites: course.prerequisites || [], // Optional chaining to avoid undefined
                }));
    
                setCourses(mappedCourses);
            }
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOutline = async (): Promise<OutlineResponse[] | undefined> => {
        try {
            const token = Cookies.get('authToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/courses/course-syllabus`,
                { headers }
            );
    
            // Check if response data exists and is an array
            if (response.data?.data && Array.isArray(response.data.data)) {
                const outlines: OutlineResponse[] = response.data.data.map((item: any) => ({
                    syllabusId: item.syllabusId,
                    syllabusContent: item.syllabusContent,
                    theory: item.theory,
                    practice: item.practice,
                    credit: item.credit,
                    status: item.status,
                    evaluationComponents: {
                        id: item.evaluationComponents?.id || '',
                        componentName: item.evaluationComponents?.componentName || '',
                        ratio: item.evaluationComponents?.ratio || 0
                    },
                    courseResponse: {
                        courseCode: item.courseResponse?.courseCode || '',
                        courseName: item.courseResponse?.courseName || '',
                        description: item.courseResponse?.description || '',
                        status: item.courseResponse?.status || false,
                        prerequisites: Array.isArray(item.courseResponse?.prerequisites)
                            ? item.courseResponse.prerequisites
                            : []
                    },
                    createAt: item.createAt,
                    updateAt: item.updateAt
                }));
    
                setOutlines(outlines);
                return outlines; // Ensure a return value
            }
    
            // Return undefined if data is not valid or response is not as expected
            return undefined;
    
        } catch (error) {
            console.error('Failed to fetch outlines:', error);
            return undefined; // Return undefined in case of error
        }
    };
    
    
    

    const createCourse = async (data: {
        courseCode: string;
        courseName: string;
        credits: number;
        description: string;
        status: boolean;
        prerequisites: string[];
    }) => {
        try {
            const token = Cookies.get('authToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
            const response = await axiosClient.post('/courses', data, { headers });
    
            if (response.status === 201 || response.status === 200) {
                fetchCourses(); // Refresh list after creation
                setIsOpenModalAddLecturer(false); // Close modal
            }

            if (response.data) {
                fetchCourses(); // Refresh list after creation
                setIsOpenModalAddLecturer(false); // Close modal
            }
        } catch (error) {
            console.error('Failed to create course:', error);
        }
    };
    

    const editCourse = async (
        courseCode: string,
        data: {
            courseName: string;
            credits: number;
            description: string;
            status: boolean;
            prerequisites: string[];
        }
    ) => {
        try {
            const token = Cookies.get('authToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
            const response = await axiosClient.put(
                `/courses/${courseCode}`, // PUT endpoint using courseCode
                data,
                { headers }
            );
    
            if (response.status === 200) {
                fetchCourses(); // Refresh the course list
                setIsOpenModalEditLecturer(false); // Close edit modal
            }
    
            if (response.data) {
                fetchCourses();
            }
        } catch (error) {
            console.error('Failed to edit course:', error);
        }
    };

    const editOutline = async (courseCode: string, syllabusData: SyllabusPayload) => {
        try {
          const token = Cookies.get('authToken');
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
          const response = await axiosClient.put(
            `/courses/course-syllabus/${courseCode}`,
            syllabusData,
            { headers }
          );
      
          if (response.status === 200) {
            fetchCourses(); // or fetchOutlines(), depending on your structure
            setIsOpenModalEditLecturer(false); // or setIsOpenModalEditOutline
          }
        } catch (error) {
          console.error('Failed to edit syllabus/outline:', error);
        }
      };

    const deleteCourse = async (id: string) => {
        try {
            const token = Cookies.get('authToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
            // Perform the DELETE request to delete the lecturer by ID
            const response = await axiosClient.delete(
                `/courses/${id}`, // Use the lecturer's ID in the URL
                { headers }
            );
        
            if (response.status === 200) {
                fetchCourses(); // Refresh the list of lecturers after successful delete
            }
            fetchCourses(); // Refresh the list of lecturers after successful delete
        } catch (error) {
            console.error('Failed to delete lecturer:', error);
        }
    };

    const deleteOutline = async (id: string) => {
        try {
            const token = Cookies.get('authToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
            // Perform the DELETE request to delete the lecturer by ID
            const response = await axiosClient.delete(
                `/courses/course-syllabus/${id}`, // Use the lecturer's ID in the URL
                { headers }
            );
        
            if (response.status === 200) {
                fetchOutline(); // Refresh the list of lecturers after successful delete
            }
            fetchOutline(); // Refresh the list of lecturers after successful delete
        } catch (error) {
            console.error('Failed to delete lecturer:', error);
        }
    };

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
    
        if (!value.trim()) {
            setSearchResults([]);
            return;
        }
    
        try {
            const token = Cookies.get('authToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axiosClient.get(`/courses/search`, {
                params: { name: value },
                headers,
            });
    
            if (response.data) {
                const mappedCourses: CourseResponse[] = response.data.map((course: any) => ({
                    id: course.id,
                    courseCode: course.courseCode,
                    courseName: course.courseName,
                    credits: course.credits,
                    description: course.description,
                    status: course.status,
                    prerequisites: course.prerequisites || [],
                    createAt: course.createAt,
                    updateAt: course.updateAt,
                }));
                setSearchResults(mappedCourses);
            }
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const handleOutlineSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchOutlineTerm(value);
    
        if (!value.trim()) {
            setSearchResults([]);
            return;
        }
    
        try {
            const token = Cookies.get('authToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axiosClient.get(`/courses/course-syllabus/search`, {
                params: { name: value },
                headers,
            });
    
            if (response.data?.data) {
                const outlines: OutlineResponse[] = response.data.map((item: any) => ({
                    syllabusId: item.syllabusId,
                    syllabusContent: item.syllabusContent,
                    theory: item.theory,
                    practice: item.practice,
                    credit: item.credit,
                    status: item.status,
                    evaluationComponents: {
                        id: item.evaluationComponents?.id || '',
                        componentName: item.evaluationComponents?.componentName || '',
                        ratio: item.evaluationComponents?.ratio || 0
                    },
                    courseResponse: {
                        courseCode: item.courseResponse?.courseCode || '',
                        courseName: item.courseResponse?.courseName || '',
                        description: item.courseResponse?.description || '',
                        status: item.courseResponse?.status || false,
                        prerequisites: Array.isArray(item.courseResponse?.prerequisites)
                            ? item.courseResponse.prerequisites
                            : []
                    },
                    createAt: item.createAt,
                    updateAt: item.updateAt
                }));
    
                setOutlines(outlines);
                return outlines; // Ensure a return value
            }
        } catch (error) {
            console.error('Search failed:', error);
        }
    };
    
    
    

    const handleSaveEdit = (updatedCourse: CoursePayload) => {
        if (selectedCourse) {
            // Call editCourse with the selected courseCode and updated data
            editCourse(selectedCourse.courseCode, updatedCourse);
        }
    };

    const handleOutlineSaveEdit = (updatedSyllabus: SyllabusPayload) => {
        if (selectedCourse) {
          editOutline(selectedCourse.courseCode, updatedSyllabus);
        }
      };

    const handleSaveDelete = () => {
        if (selectedCourse) {
            // Call the editLecturer function with the selected lecturer's ID and updated data
            deleteCourse(selectedCourse.courseCode); // Assuming selectedLecturer contains the ID and updated data
        }
    };

    const handleSaveOutlineDelete = () => {
        if (selectedOutline) {
            // Call the editLecturer function with the selected lecturer's ID and updated data
            deleteOutline(selectedOutline.syllabusId); // Assuming selectedLecturer contains the ID and updated data
        }
    };
    

    useEffect(() => {
        fetchCourses();
        fetchOutline();
    }, []);

    return (
        <Box
            sx={{
                padding: '10px',
                borderRadius: '10px',
                boxShadow: styledSystem.secondBoxShadow,
                minHeight: '700px',
            }}
        >
            <Box>
                <TitleCustom>Quản lý Khoá Học</TitleCustom>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '10px',
                }}
            >
                <Box 
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '10px',
                }}>
                <FormInputCustom
                    sx={{ width: '300px' }}
                    placeholder="Nhập tên môn học bạn muốn tìm"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <FormInputCustom
                    sx={{ width: '300px' }}
                    placeholder="Nhập tên đề cương bạn muốn tìm"
                    value={searchOutlineTerm}
                    onChange={handleOutlineSearchChange}
                />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        columnGap: '10px',
                    }}
                >
                    <FormButtonCustom
                        sx={{
                            width: '100px',
                            height: '35px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        startIcon={<AddIcon />}
                        onClick={() => setIsOpenModalAddLecturer(true)}
                    >
                        Thêm
                    </FormButtonCustom>
                    <ModalWrapper
                        open={isOpenModalAddLecturer}
                        handleClose={() => setIsOpenModalAddLecturer(false)}
                    >
                        <FormAddCourse
                            handlClose={() => setIsOpenModalAddLecturer(false)}
                            onSubmit={createCourse} // ✅ call API
                        />
                    </ModalWrapper>
                    <Button
                        sx={{
                            border: '1px solid gray',
                            fontSize: '12px',
                            borderRadius: '10px',
                        }}
                    >
                        Export file excel
                    </Button>
                </Box>
            </Box>
            <Box sx={{ marginTop: '10px' }}>
            <DataTable<CoursePayload>
                key={searchTerm}
                columns={columns}
                data={searchTerm.trim()
                    ? searchResults.filter((course) => course.status === true) // Filter by status if searching
                    : courses.filter((course) => course.status === true) // Filter by status if not searching
                }
                loading={loading}
                paginationModel={{ page: 0, pageSize: 5 }}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id: false,
                            role: false,
                        },
                    },
                }}
                getRowId={(row) => row.courseCode}  // Set `courseCode` as the unique identifier for each row
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
            </Box>
            <ModalWrapper
                open={isOpenModalAddOutline}
                handleClose={() => setIsOpenModalAddOutline(false)}
            >
                {selectedCourse && (
                    <FormAddOutline
                        handlClose={() => setIsOpenModalAddOutline(false)}
                        courseData={selectedCourse}  // Pass course data to the form
                        onSubmit={handleCreateOutline}  // Submit handler to create the outline
                    />
                )}
            </ModalWrapper>
            <Box sx={{ marginTop: '40px' }}>
                <TitleCustom>Quản lý Đề Cương</TitleCustom>
            </Box>
            <Box sx={{ marginTop: '10px' }}>
            <DataTable<OutlineResponse>
                key={searchOutlineTerm}
                columns={columnsOutline}
                data={searchOutlineTerm.trim() ? searchOutlineResults.filter((outlines) => outlines.status === true) : outlines}
                loading={loading}
                paginationModel={{ page: 0, pageSize: 5 }}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id: false,
                            role: false,
                        },
                    },
                }}
                getRowId={(row) => row.syllabusId}
                handleEdit={handleOutlineEdit}
                handleDelete={handleOutlineDelete}
            />
            </Box>
            <ModalWrapper
                open={isOpenModalEditLecturer}
                handleClose={() => setIsOpenModalEditLecturer(false)}
            >
                {selectedCourse && (
                    <FormEditCourse
                        handlClose={() => setIsOpenModalEditLecturer(false)}
                        onSubmit={handleSaveEdit}
                        courseData={selectedCourse} // Correct prop name
                    />
                )}
            </ModalWrapper>
            <ModalWrapper
                open={isOpenModalEditOutline}
                handleClose={() => setIsOpenModalEditOutline(false)}
            >
                {selectedOutline && (
                    <FormEditOutline
                        handlClose={() => setIsOpenModalEditOutline(false)}
                        onSubmit={handleOutlineSaveEdit}
                        outlineData={selectedOutline} // Correct prop name
                    />
                )}
            </ModalWrapper>
        </Box>
    );
}
