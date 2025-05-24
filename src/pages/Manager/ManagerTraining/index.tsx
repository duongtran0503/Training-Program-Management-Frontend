import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { styledSystem } from '../../../constans/styled';
import { TitleCustom } from '../../../components/custom/Title';
import { FormButtonCustom } from '../../../components/custom/Button/FormButtonCustom';
import AddIcon from '@mui/icons-material/Add';
import { FormInputCustom } from '../../../components/custom/Input/FormInputCustom';
import DataTable from '../../../components/Table';
import { GridColDef } from '@mui/x-data-grid';
import { trainingProgramResponse } from '../../../schemas/API/trainingProgramResponse';
import { useState, useEffect } from 'react';
import ModalWrapper from '../../../components/Modal/ModalWrapper';
import FormAddTrainingProgram from '../../../components/Modal/FormAddTrainingProgram/index';
import FormEditTrainingProgram from '../../../components/Modal/FormEditTrainingProgram/index';
import { trainingService } from '../../../services/trainingServices';
import { errorAPIRequest } from '../../../config/HandleAPIErrorRequst';

const columns: GridColDef<trainingProgramResponse>[] = [
    { field: 'id', headerName: 'ID', width: 70, hideable: true },
    { field: 'trainingProgramName', headerName: 'Tên chương trình', width: 200 },
    { field: 'degreeType', headerName: 'Loại bằng', width: 150 },
    { field: 'educationLevel', headerName: 'Cấp độ đào tạo', width: 150 },
    { field: 'totalCredits', headerName: 'Tổng tín chỉ', width: 120 },
    { field: 'trainingDuration', headerName: 'Thời gian đào tạo', width: 150 },
    { field: 'teachingLanguage', headerName: 'Ngôn ngữ giảng dạy', width: 150 },
    { 
        field: 'status', 
        headerName: 'Trạng thái', 
        width: 120,
        renderCell: (params) => {
            if (!params?.row) return '';
            return params.row.status ? 'Hoạt động' : 'Không hoạt động';
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

export default function ManagerTraining() {
    const [isOpenModalAddTrainingProgram, setIsOpenModalAddTrainingProgram] = useState<boolean>(false);
    const [isOpenModalEditTrainingProgram, setIsOpenModalEditTrainingProgram] = useState<boolean>(false);
    const [selectedTrainingProgram, setSelectedTrainingProgram] = useState<trainingProgramResponse | null>(null);
    const [trainingPrograms, setTrainingPrograms] = useState<trainingProgramResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredTrainingPrograms, setFilteredTrainingPrograms] = useState<trainingProgramResponse[]>([]);

    useEffect(() => {
        fetchTrainingPrograms();
    }, []);

    useEffect(() => {
        const fetchFilteredPrograms = async () => {
            if (searchTerm.trim() === '') {
                setFilteredTrainingPrograms(trainingPrograms.map(program => ({
                    ...program,
                    id: program.trainingProgramId // Thêm id dựa trên trainingProgramId
                })));
            } else {
                try {
                    const response = await trainingService.searchTrainingPrograms(searchTerm);
                    console.log('Search training programs response:', response);
                    if (response.statusCode === 200 && Array.isArray(response.data)) {
                        setFilteredTrainingPrograms(response.data.map(program => ({
                            ...program,
                            id: program.trainingProgramId // Thêm id dựa trên trainingProgramId
                        })));
                    } else {
                        console.error('Failed to search training programs:', response);
                    }
                } catch (error) {
                    console.error('Error searching training programs:', error);
                    errorAPIRequest.serverError({ error });
                }
            }
        };
        fetchFilteredPrograms();
    }, [searchTerm, trainingPrograms]);

    const fetchTrainingPrograms = async () => {
        try {
            setLoading(true);
            const response = await trainingService.getAllTrainingPrograms();
            console.log('Training programs response:', response);
            if (response.statusCode === 200 && Array.isArray(response.data)) {
                console.log('Training programs data:', response.data);
                setTrainingPrograms(response.data);
                setFilteredTrainingPrograms(response.data.map(program => ({
                    ...program,
                    id: program.trainingProgramId // Thêm id dựa trên trainingProgramId
                })));
            } else {
                console.error('Failed to fetch training programs:', response);
            }
        } catch (error) {
            console.error('Error fetching training programs:', error);
            errorAPIRequest.serverError({ error });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (value: trainingProgramResponse) => {
        setSelectedTrainingProgram(value);
        setIsOpenModalEditTrainingProgram(true);
    };

    const handleDelete = async (value: trainingProgramResponse) => {
        try {
            const response = await trainingService.deleteTrainingProgram(value.trainingProgramId);
            if (response.statusCode === 200) {
                fetchTrainingPrograms();
            }
        } catch (error) {
            console.error('Error deleting training program:', error);
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
                <TitleCustom>Quản lý chương trình đào tạo</TitleCustom>
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
                        placeholder='Tìm kiếm...'
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
                        onClick={() => setIsOpenModalAddTrainingProgram(true)}
                    >
                        Thêm
                    </FormButtonCustom>
                    <ModalWrapper
                        open={isOpenModalAddTrainingProgram}
                        handleClose={() => setIsOpenModalAddTrainingProgram(false)}
                    >
                        <FormAddTrainingProgram
                            handlClose={() => setIsOpenModalAddTrainingProgram(false)}
                            onSuccess={() => {
                                setIsOpenModalAddTrainingProgram(false);
                                fetchTrainingPrograms();
                            }}
                        />
                    </ModalWrapper>
                    <ModalWrapper
                        open={isOpenModalEditTrainingProgram}
                        handleClose={() => {
                            setIsOpenModalEditTrainingProgram(false);
                            setSelectedTrainingProgram(null);
                        }}
                    >
                        {selectedTrainingProgram && (
                            <FormEditTrainingProgram
                                handlClose={() => {
                                    setIsOpenModalEditTrainingProgram(false);
                                    setSelectedTrainingProgram(null);
                                }}
                                trainingProgram={selectedTrainingProgram}
                                onSuccess={() => {
                                    setIsOpenModalEditTrainingProgram(false);
                                    setSelectedTrainingProgram(null);
                                    fetchTrainingPrograms();
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
                {filteredTrainingPrograms.length === 0 && !loading && (
                    <Typography sx={{ textAlign: 'center', mt: 2 }}>
                        Không có chương trình đào tạo nào.
                    </Typography>
                )}
                <DataTable<trainingProgramResponse>
                    columns={columns}
                    data={filteredTrainingPrograms}
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