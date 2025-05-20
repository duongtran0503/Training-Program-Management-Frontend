import { Box, Button, CircularProgress } from '@mui/material';
import { styledSystem } from '../../../constans/styled';
import { TitleCustom } from '../../../components/custom/Title';
import { FormButtonCustom } from '../../../components/custom/Button/FormButtonCustom';
import AddIcon from '@mui/icons-material/Add';
import { FormInputCustom } from '../../../components/custom/Input/FormInputCustom';
import DataTable from '../../../components/Table';
import { GridColDef } from '@mui/x-data-grid';
import { lecturerResponse } from '../../../schemas/API/lecturerResposne';
import { useState, useEffect } from 'react';
import ModalWrapper from '../../../components/Modal/ModalWrapper';
import FormAddLecturer from '../../../components/Modal/FormAddLecturer/index';
import FormEditLecturer from '../../../components/Modal/FormEditLecturer/index';
import { lecturerService } from '../../../services/lecturerServices';
import { errorAPIRequest } from '../../../config/HandleAPIErrorRequst';

const columns: GridColDef<lecturerResponse>[] = [
    { field: 'id', headerName: 'ID', width: 70, hideable: true },
    { field: 'role', headerName: 'role', width: 70, hideable: true },
    {
        field: 'avatar',
        headerName: 'avatar',
        width: 100,
        renderCell: (params) => (
            <img 
                src={params?.row?.avatar || '/default-avatar.png'} 
                alt="avatar" 
                style={{ width: 40, height: 40, borderRadius: '50%' }}
            />
        )
    },
    { field: 'name', headerName: 'Tên', width: 150 },
    { field: 'lecturerCode', headerName: 'Mã giảng viên', width: 120 },
    { 
        field: 'gender', 
        headerName: 'Giới tính', 
        width: 100,
        renderCell: (params) => {
            if (!params?.row) return '';
            return params.row.gender === 'Male' ? 'Nam' : 'Nữ';
        }
    },
    { field: 'titleAcademicRank', headerName: 'Học hàm/Học vị', width: 150 },
    { 
        field: 'status', 
        headerName: 'Đang công tác', 
        width: 120,
        renderCell: (params) => {
            if (!params?.row) return '';
            return params.row.status ? 'Có' : 'Không';
        }
    },
    { 
        field: 'dob', 
        headerName: 'Ngày sinh', 
        width: 120,
        renderCell: (params) => {
            if (!params?.row?.dob) return '';
            try {
                return new Date(params.row.dob).toLocaleDateString('vi-VN');
            } catch (error) {
                console.error('Error formatting date:', error);
                return params.row.dob;
            }
        }
    },
    {
        field: 'startDateOfTeaching',
        headerName: 'Ngày bắt vào trường',
        width: 150,
        renderCell: (params) => {
            if (!params?.row?.startDateOfTeaching) return '';
            try {
                return new Date(params.row.startDateOfTeaching).toLocaleDateString('vi-VN');
            } catch (error) {
                console.error('Error formatting date:', error);
                return params.row.startDateOfTeaching;
            }
        }
    },
    { 
        field: 'endDateOfTeaching', 
        headerName: 'Ngày rời trường', 
        width: 150,
        renderCell: (params) => {
            if (!params?.row?.endDateOfTeaching) return 'Chưa có';
            try {
                return new Date(params.row.endDateOfTeaching).toLocaleDateString('vi-VN');
            } catch (error) {
                console.error('Error formatting date:', error);
                return params.row.endDateOfTeaching;
            }
        }
    },
    { 
        field: 'createdAt', 
        headerName: 'Ngày tạo', 
        width: 120,
        renderCell: (params) => {
            if (!params?.row?.createdAt) return '';
            try {
                return new Date(params.row.createdAt).toLocaleDateString('vi-VN');
            } catch (error) {
                console.error('Error formatting date:', error);
                return params.row.createdAt;
            }
        }
    },
    { 
        field: 'updatedAt', 
        headerName: 'Ngày cập nhật', 
        width: 120,
        renderCell: (params) => {
            if (!params?.row?.updatedAt) return '';
            try {
                return new Date(params.row.updatedAt).toLocaleDateString('vi-VN');
            } catch (error) {
                console.error('Error formatting date:', error);
                return params.row.updatedAt;
            }
        }
    },
];

export default function ManagerLecturer() {
    const [isOpenModalAddLecturer, setIsOpenModalAddLecturer] = useState<boolean>(false);
    const [isOpenModalEditLecturer, setIsOpenModalEditLecturer] = useState<boolean>(false);
    const [selectedLecturer, setSelectedLecturer] = useState<lecturerResponse | null>(null);
    const [lecturers, setLecturers] = useState<lecturerResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredLecturers, setFilteredLecturers] = useState<lecturerResponse[]>([]);

    useEffect(() => {
        fetchLecturers();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredLecturers(lecturers);
        } else {
            const filtered = lecturers.filter(lecturer => 
                lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lecturer.lecturerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lecturer.titleAcademicRank?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredLecturers(filtered);
        }
    }, [searchTerm, lecturers]);

    const fetchLecturers = async () => {
        try {
            setLoading(true);
            const response = await lecturerService.getAllLecturers();
            console.log('API Response:', response);
            if (response.isSuccess && response.data) {
                console.log('Lecturers data:', response.data);
                console.log('Lecturers data type:', typeof response.data);
                console.log('Lecturers data length:', response.data.length);
                console.log('First lecturer:', response.data[0]);
                if (Array.isArray(response.data)) {
                    setLecturers(response.data);
                } else {
                    console.error('Response data is not an array:', response.data);
                }
            }
        } catch (error) {
            console.error('Error fetching lecturers:', error);
            errorAPIRequest.serverError({ error });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (value: lecturerResponse) => {
        console.log('Edit lecturer:', value);
        setSelectedLecturer(value);
        setIsOpenModalEditLecturer(true);
    };

    const handleDelete = async (value: lecturerResponse) => {
        console.log('Delete lecturer:', value);
        try {
            const response = await lecturerService.deleteLecturer(value.id);
            if (response.isSuccess) {
                // Refresh danh sách sau khi xóa
                fetchLecturers();
            }
        } catch (error) {
            console.error('Error deleting lecturer:', error);
            errorAPIRequest.serverError({ error });
        }
    };

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
                        placeholder='search...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                            onSuccess={() => {
                                setIsOpenModalAddLecturer(false);
                                fetchLecturers();
                            }}
                        />
                    </ModalWrapper>
                    <ModalWrapper
                        open={isOpenModalEditLecturer}
                        handleClose={() => {
                            setIsOpenModalEditLecturer(false);
                            setSelectedLecturer(null);
                        }}
                    >
                        {selectedLecturer && (
                            <FormEditLecturer
                                handlClose={() => {
                                    setIsOpenModalEditLecturer(false);
                                    setSelectedLecturer(null);
                                }}
                                lecturer={selectedLecturer}
                                onSuccess={() => {
                                    setIsOpenModalEditLecturer(false);
                                    setSelectedLecturer(null);
                                    fetchLecturers();
                                }}
                            />
                        )}
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
            <Box sx={{ marginTop: '10px', position: 'relative' }}>
                {loading && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}
                <DataTable<lecturerResponse>
                    columns={columns}
                    data={filteredLecturers}
                    paginationModel={{ page: 0, pageSize: 5 }}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
            </Box>
        </Box>
    );
}
