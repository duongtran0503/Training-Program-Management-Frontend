import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { styledSystem } from '../../../constans/styled';
import { TitleCustom } from '../../../components/custom/Title';
import { FormButtonCustom } from '../../../components/custom/Button/FormButtonCustom';
import AddIcon from '@mui/icons-material/Add';
import { FormInputCustom } from '../../../components/custom/Input/FormInputCustom';
import DataTable from '../../../components/Table';
import { GridColDef } from '@mui/x-data-grid';
import { teachingPlanResponse } from '../../../schemas/API/teachingPlanResponse';
import { useState, useEffect } from 'react';
import ModalWrapper from '../../../components/Modal/ModalWrapper';
import FormAddTeachingPlan from '../../../components/Modal/FormAddTeachingPlan';
import FormEditTeachingPlan from '../../../components/Modal/FormEditTeachingPlan';
import { teachingPlanService } from '../../../services/teachingPlanServices';
import { errorAPIRequest } from '../../../config/HandleAPIErrorRequst';

const columns: GridColDef<teachingPlanResponse>[] = [
    { field: 'id', headerName: 'ID', width: 70, hideable: true },
    { field: 'teachingPlanId', headerName: 'Mã kế hoạch', width: 150 },
    { field: 'academicYear', headerName: 'Năm học', width: 120 },
    { field: 'semester', headerName: 'Học kỳ', width: 100 },
    { field: 'trainingProgramId', headerName: 'Mã chương trình đào tạo', width: 200 },
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

export default function ManagerTeachingPlan() {
    const [isOpenModalAddTeachingPlan, setIsOpenModalAddTeachingPlan] = useState<boolean>(false);
    const [isOpenModalEditTeachingPlan, setIsOpenModalEditTeachingPlan] = useState<boolean>(false);
    const [selectedTeachingPlan, setSelectedTeachingPlan] = useState<teachingPlanResponse | null>(null);
    const [teachingPlans, setTeachingPlans] = useState<teachingPlanResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filteredTeachingPlans, setFilteredTeachingPlans] = useState<teachingPlanResponse[]>([]);

    useEffect(() => {
        fetchTeachingPlans();
    }, []);

    const fetchTeachingPlans = async () => {
        try {
            setLoading(true);
            const response = await teachingPlanService.getAllTeachingPlans();
            console.log('Teaching plans response:', response);
            if (response.statusCode === 200 && Array.isArray(response.data)) {
                console.log('Teaching plans data:', response.data);
                setTeachingPlans(response.data);
                setFilteredTeachingPlans(response.data.map(plan => ({
                    ...plan,
                    id: plan.teachingPlanId
                })));
            } else {
                console.error('Failed to fetch teaching plans:', response);
            }
        } catch (error) {
            console.error('Error fetching teaching plans:', error);
            errorAPIRequest.serverError({ error });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (value: teachingPlanResponse) => {
        setSelectedTeachingPlan(value);
        setIsOpenModalEditTeachingPlan(true);
    };

    const handleDelete = async (value: teachingPlanResponse) => {
        try {
            const response = await teachingPlanService.deleteTeachingPlan(value.teachingPlanId);
            if (response.statusCode === 200) {
                fetchTeachingPlans();
            }
        } catch (error) {
            console.error('Error deleting teaching plan:', error);
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
                <TitleCustom>Quản lý kế hoạch đào tạo</TitleCustom>
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
                        disabled
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
                        onClick={() => setIsOpenModalAddTeachingPlan(true)}
                    >
                        Thêm
                    </FormButtonCustom>
                    <ModalWrapper
                        open={isOpenModalAddTeachingPlan}
                        handleClose={() => setIsOpenModalAddTeachingPlan(false)}
                    >
                        <FormAddTeachingPlan
                            handlClose={() => setIsOpenModalAddTeachingPlan(false)}
                            onSuccess={() => {
                                setIsOpenModalAddTeachingPlan(false);
                                fetchTeachingPlans();
                            }}
                        />
                    </ModalWrapper>
                    <ModalWrapper
                        open={isOpenModalEditTeachingPlan}
                        handleClose={() => {
                            setIsOpenModalEditTeachingPlan(false);
                            setSelectedTeachingPlan(null);
                        }}
                    >
                        {selectedTeachingPlan && (
                            <FormEditTeachingPlan
                                handlClose={() => {
                                    setIsOpenModalEditTeachingPlan(false);
                                    setSelectedTeachingPlan(null);
                                }}
                                teachingPlan={selectedTeachingPlan}
                                onSuccess={() => {
                                    setIsOpenModalEditTeachingPlan(false);
                                    setSelectedTeachingPlan(null);
                                    fetchTeachingPlans();
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
                {filteredTeachingPlans.length === 0 && !loading && (
                    <Typography sx={{ textAlign: 'center', mt: 2 }}>
                        Không có kế hoạch đào tạo nào.
                    </Typography>
                )}
                <DataTable<teachingPlanResponse>
                    columns={columns}
                    data={filteredTeachingPlans}
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