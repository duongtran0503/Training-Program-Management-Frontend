import { Box, Button } from '@mui/material';
import { styledSystem } from '../../../constans/styled';
import { TitleCustom } from '../../../components/custom/Title';
import { FormButtonCustom } from '../../../components/custom/Button/FormButtonCustom';
import AddIcon from '@mui/icons-material/Add';
import { FormInputCustom } from '../../../components/custom/Input/FormInputCustom';
import DataTable from '../../../components/Table';
import { GridColDef } from '@mui/x-data-grid';
import Cookies from 'js-cookie';
import { CourseResponse } from '../../../schemas/API/courseResponse';
import { useEffect, useState } from 'react';
import ModalWrapper from '../../../components/Modal/ModalWrapper';
import FormAddCourse from '../../../components/Modal/FormAddSubject';
import FormEditCourse from '../../../components/Modal/FormEditSubject'; // Import the Edit form
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
    const [selectedCourse, setSelectedLecturer] = useState<CoursePayload | null>(null);
    const [courses, setCourses] = useState<CourseResponse[]>([]);
    const [isOpenModalAddLecturer, setIsOpenModalAddLecturer] =
        useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<CourseResponse[]>([]);
    const handleEdit = (lecturer: CoursePayload) => {
        console.log("Data:", lecturer)
            setSelectedLecturer(lecturer);
            setIsOpenModalEditLecturer(true); // Open the modal
    };
    
    const handleDelete = (id: string) => {
        // Assuming id is the course ID
        if (selectedCourse) {
            // You might want to set selectedCourse to null or handle deletion based on the course ID
            // Then perform your delete logic here
            handleSaveDelete(); // Assuming this function uses the id to delete the course
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
    
    
    

    const handleSaveEdit = (updatedCourse: CoursePayload) => {
        if (selectedCourse) {
            // Call editCourse with the selected courseCode and updated data
            editCourse(selectedCourse.courseCode, updatedCourse);
        }
    };

    const handleSaveDelete = () => {
        if (selectedCourse) {
            // Call the editLecturer function with the selected lecturer's ID and updated data
            deleteCourse(selectedCourse.courseCode); // Assuming selectedLecturer contains the ID and updated data
        }
    };
    

    useEffect(() => {
        fetchCourses();
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
                <Box>
                <FormInputCustom
                    sx={{ width: '300px' }}
                    placeholder="search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
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
        </Box>
    );
}
