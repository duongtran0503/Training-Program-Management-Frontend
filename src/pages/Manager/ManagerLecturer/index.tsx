import { Box, Button } from '@mui/material';
import { styledSystem } from '../../../constans/styled';
import { TitleCustom } from '../../../components/custom/Title';
import { FormButtonCustom } from '../../../components/custom/Button/FormButtonCustom';
import AddIcon from '@mui/icons-material/Add';
import { FormInputCustom } from '../../../components/custom/Input/FormInputCustom';
import DataTable from '../../../components/Table';
import { GridColDef } from '@mui/x-data-grid';
import Cookies from 'js-cookie';
import { LecturerResponse } from '../../../schemas/API/lecturerResposne';
import { useEffect, useState } from 'react';
import ModalWrapper from '../../../components/Modal/ModalWrapper';
import FormAddLecturer from '../../../components/Modal/FormAddLecturer';
import FormEditLecturer from '../../../components/Modal/FormEditLecturer'; // Import the Edit form
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
    { field: 'id', headerName: 'ID', width: 70, hideable: true },
    { field: 'role', headerName: 'Role', width: 70, hideable: true },
    {
        field: 'avatar',
        headerName: 'Avatar',
        width: 100,
        renderCell: (params) => <img src={params.value} alt="Avatar" width="50" />
    },
    { field: 'name', headerName: 'Tên', width: 100 },
    { field: 'lecturerCode', headerName: 'Mã giảng viên', width: 100 },
    { field: 'gender', headerName: 'Giới tính', width: 70 },
    { field: 'status', headerName: 'Đang công tác', width: 70 },
    { field: 'dob', headerName: 'Ngày sinh', width: 100 },
    {
        field: 'startDateOfTeaching',
        headerName: 'Ngày bắt vào trường',
        width: 100,
    },
    { field: 'endDateOfTeaching', headerName: 'Ngày rời trường', width: 100 },
    { field: 'createAt', headerName: 'Ngày tạo', width: 100 },
    { field: 'updateAt', headerName: 'Ngày cập nhật', width: 100 },
];

type LecturerPayload = {
    id: string;
    name: string;
    lecturerCode: string;
    gender: string;
    titleAcademicRank: string;
    avatar: string;
    department: string;
    status: boolean;
    dob: string;
    startDateOfTeaching: string;
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
    const [selectedLecturer, setSelectedLecturer] = useState<LecturerPayload | null>(null);
    const [lecturers, setLecturers] = useState<LecturerResponse[]>([]);
    const [isOpenModalAddLecturer, setIsOpenModalAddLecturer] =
        useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<LecturerResponse[]>([]);
    const formattedDob = selectedLecturer?.dob ? formatDate(selectedLecturer.dob) : ''; 
    const formattedStartDateOfTeaching = selectedLecturer?.startDateOfTeaching 
            ? formatDate(selectedLecturer.startDateOfTeaching) 
            : '';
    const handleEdit = (lecturer: LecturerPayload) => {
        console.log("Data:", lecturer)
            setSelectedLecturer(lecturer);
            setIsOpenModalEditLecturer(true); // Open the modal
    };
    
    const handleDelete = (lecturer: LecturerPayload) => {
        if (selectedLecturer) {
            setSelectedLecturer(lecturer);
            handleSaveDelete();
        }
    };

    const fetchLecturers = async () => {
        try {
            setLoading(true);
    
            // Get the token from cookies
            const token = Cookies.get('authToken'); // Assuming 'authToken' is the cookie name where the token is stored
    
            // If token exists, set it in the Authorization header
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
            // Using the VITE_API_URL from .env
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/lecturer/get-all`,
                { headers }
            );
    
            if (response.data && response.data.data) {
                // Map the response data to fit the expected structure
                const mappedLecturers: LecturerResponse[] = response.data.data.map((lecturer: any) => ({
                    id: lecturer.id,
                    role: lecturer.role,
                    name: lecturer.name,
                    lecturerCode: lecturer.lecturerCode,
                    gender: lecturer.gender === 'nam' ? 'Male' : 'Female', // Mapping gender
                    titleAcademicRank: lecturer.titleAcademicRank,
                    avatar: lecturer.avatar,
                    department: lecturer.department,
                    status: lecturer.status,
                    dob: lecturer.dob,
                    startDateOfTeaching: lecturer.startDateOfTeaching,
                    endDateOfTeaching: lecturer.endDateOfTeaching,
                    createAt: lecturer.createAt,
                    updateAt: lecturer.updateAt
                }));
                setLecturers(mappedLecturers);
            }
        } catch (error) {
            console.error('Failed to fetch lecturers:', error);
        } finally {
            setLoading(false);
        }
    };

    const createLecturer = async (data: {
        name: string;
        lecturerCode: string;
        gender: string;
        titleAcademicRank: string;
        avatar: string;
        department: string;
        status: boolean;
        dob: string;
        startDateOfTeaching: string;
    }) => {
        try {
            const token = Cookies.get('authToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
            const response = await axiosClient.post(
                '/users/lecturer-account',
                data,
                { headers }
            );
    
            if (response.status === 201 || response.status === 200) {
                fetchLecturers(); // refresh list
                setIsOpenModalAddLecturer(false); // close modal
            }

            if (response.data) {
                fetchLecturers();
            }
        } catch (error) {
            console.error('Failed to create lecturer:', error);
        }
    };

    const editLecturer = async (id: string, data: {
        name: string;
        lecturerCode: string;
        gender: string;
        titleAcademicRank: string;
        avatar: string;
        department: string;
        status: boolean;
        dob: string;
        startDateOfTeaching: string;
    }) => {
        try {
            const token = Cookies.get('authToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
            // Perform the PUT request to update the lecturer
            const response = await axiosClient.put(
                `/users/lecturer/${id}`, // Use the lecturer's ID in the URL
                data,
                { headers }
            );
        
            if (response.status === 200) {
                fetchLecturers(); // Refresh the list of lecturers after successful update
                setIsOpenModalEditLecturer(false); // Close the edit modal
            }

            if (response.data) {
                fetchLecturers();
            }
        } catch (error) {
            console.error('Failed to edit lecturer:', error);
        }
    };

    const deleteLecturer = async (id: string) => {
        try {
            const token = Cookies.get('authToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
            // Perform the DELETE request to delete the lecturer by ID
            const response = await axiosClient.delete(
                `/users/lecturer/${id}`, // Use the lecturer's ID in the URL
                { headers }
            );
        
            if (response.status === 200) {
                fetchLecturers(); // Refresh the list of lecturers after successful delete
            }
            fetchLecturers(); // Refresh the list of lecturers after successful delete
        } catch (error) {
            console.error('Failed to delete lecturer:', error);
        }
    };

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
    
        if (!value.trim()) {
            // Optional: clear search results when input is empty
            setSearchResults([]);
            return;
        }
    
        try {
            const token = Cookies.get('authToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axiosClient.get(`/users/lecturer/search`, {
                params: { name: value },
                headers,
            });
    
            if (response.data.statusCode === 200) {
                setSearchResults(response.data.data); // Update with search result
            }

            if (response.data) {
                const mappedLecturers: LecturerResponse[] = response.data.map((lecturer: any) => ({
                    id: lecturer.id,
                    role: lecturer.role,
                    name: lecturer.name,
                    lecturerCode: lecturer.lecturerCode,
                    gender: lecturer.gender === 'nam' ? 'Male' : 'Female',
                    titleAcademicRank: lecturer.titleAcademicRank,
                    avatar: lecturer.avatar,
                    department: lecturer.department,
                    status: lecturer.status,
                    dob: lecturer.dob,
                    startDateOfTeaching: lecturer.startDateOfTeaching,
                    endDateOfTeaching: lecturer.endDateOfTeaching,
                    createAt: lecturer.createAt,
                    updateAt: lecturer.updateAt
                }));
                setSearchResults(mappedLecturers);
            }            
        } catch (error) {
            console.error('Search failed:', error);
        }
    };
    
    

    const handleSaveEdit = (updatedLecturer: LecturerPayload) => {
        if (selectedLecturer) {
            // Call the editLecturer function with the selected lecturer's ID and updated data
            editLecturer(selectedLecturer.id, updatedLecturer); // Assuming selectedLecturer contains the ID and updated data
        }
    };

    const handleSaveDelete = () => {
        if (selectedLecturer) {
            // Call the editLecturer function with the selected lecturer's ID and updated data
            deleteLecturer(selectedLecturer.id); // Assuming selectedLecturer contains the ID and updated data
        }
    };
    

    useEffect(() => {
        fetchLecturers();
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
                <TitleCustom>Quản lý giảng viên</TitleCustom>
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
                        <FormAddLecturer
                            handlClose={() => setIsOpenModalAddLecturer(false)}
                            onSubmit={createLecturer} // ✅ call API
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
            <DataTable<LecturerResponse>
                key={searchTerm}
                columns={columns}
                data={
                    (searchTerm.trim() ? searchResults : lecturers).filter(
                        (lecturer) => lecturer.status === true
                    )
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
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
            </Box>
            <ModalWrapper
                open={isOpenModalEditLecturer}
                handleClose={() => setIsOpenModalEditLecturer(false)}
            >
                {selectedLecturer && (
                    <FormEditLecturer
                        handlClose={() => setIsOpenModalEditLecturer(false)}
                        onSubmit={handleSaveEdit} // This will handle the form submission
                        lecturerData={{
                            ...selectedLecturer,
                            dob: formattedDob,
                            startDateOfTeaching: formattedStartDateOfTeaching
                        }}
                    />
                )}
            </ModalWrapper>
        </Box>
    );
}
