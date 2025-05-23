import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useState, useEffect } from 'react';
import { teachingPlanService } from '../../../services/teachingPlanServices';
import { trainingService } from '../../../services/trainingServices';
import { FormButtonCustom } from '../../custom/Button/FormButtonCustom';
import { styledSystem } from '../../../constans/styled';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { teachingPlanResponse } from '../../../schemas/API/teachingPlanResponse';
import { trainingProgramResponse } from '../../../schemas/API/trainingProgramResponse';

interface Props {
    handlClose: () => void;
    teachingPlan: teachingPlanResponse;
    onSuccess?: () => void;
}

export default function FormEditTeachingPlan({ handlClose, teachingPlan, onSuccess }: Props) {
    const [formData, setFormData] = useState({
        teachingPlanId: '',
        academicYear: 0,
        semester: 0,
        trainingProgramId: ''
    });
    const [trainingPrograms, setTrainingPrograms] = useState<trainingProgramResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrainingPrograms = async () => {
            try {
                const response = await trainingService.getAllTrainingPrograms();
                if (response.statusCode === 200 && Array.isArray(response.data)) {
                    setTrainingPrograms(response.data);
                }
            } catch (error) {
                console.error('Error fetching training programs:', error);
                            }
        };
        fetchTrainingPrograms();
    }, []);

    useEffect(() => {
        if (teachingPlan) {
            setFormData({
                teachingPlanId: teachingPlan.teachingPlanId || '',
                academicYear: teachingPlan.academicYear || 0,
                semester: teachingPlan.semester || 0,
                trainingProgramId: teachingPlan.trainingProgramId || ''
            });
        }
    }, [teachingPlan]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name as string]: name === 'academicYear' || name === 'semester' ? Number(value) : value
        }));
        setError(null);
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const response = await teachingPlanService.updateTeachingPlan(teachingPlan.teachingPlanId, formData);
            if (response.isSuccess) {
                toast.success('Cập nhật kế hoạch đào tạo thành công!');
                if (onSuccess) {
                    onSuccess();
                }
                handlClose();
            }
        } catch (error) {
            console.error('Error updating teaching plan:', error);
            if (error instanceof AxiosError) {
                if (error.response?.data?.message) {
                    setError(error.response.data.message);
                    toast.error(error.response.data.message);
                } else {
                    setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
                    toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
                }
            } else {
                setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
                toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ 
            p: 3, 
            width: '100%', 
            maxWidth: 800,
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: styledSystem.secondBoxShadow
        }}>
            <Typography 
                variant="h5" 
                sx={{ 
                    mb: 3, 
                    textAlign: 'center',
                    color: '#1976d2',
                    fontWeight: 'bold'
                }}
            >
                Chỉnh sửa kế hoạch đào tạo
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                    <Box>
                        <TextField
                            fullWidth
                            label="Mã kế hoạch"
                            name="teachingPlanId"
                            value={formData.teachingPlanId}
                            onChange={handleChange}
                            required
                            disabled
                            error={!!error}
                            helperText={error}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#1976d2',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#1976d2',
                                },
                            }}
                        />
                    </Box>
                    <Box>
                        <TextField
                            fullWidth
                            label="Năm học"
                            name="academicYear"
                            type="number"
                            value={formData.academicYear}
                            onChange={handleChange}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#1976d2',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#1976d2',
                                },
                            }}
                        />
                    </Box>
                    <Box>
                        <TextField
                            fullWidth
                            label="Học kỳ"
                            name="semester"
                            type="number"
                            value={formData.semester}
                            onChange={handleChange}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#1976d2',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#1976d2',
                                },
                            }}
                        />
                    </Box>
                    <Box>
                        <FormControl fullWidth>
                            <InputLabel>Chương trình đào tạo</InputLabel>
                            <Select
                                name="trainingProgramId"
                                value={formData.trainingProgramId}
                                onChange={handleSelectChange}
                                label="Chương trình đào tạo"
                                required
                                sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        '&:hover': {
                                            borderColor: '#1976d2',
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#1976d2',
                                    },
                                }}
                            >
                                {trainingPrograms.map(program => (
                                    <MenuItem key={program.trainingProgramId} value={program.trainingProgramId}>
                                        {program.trainingProgramName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Box sx={{ 
                    mt: 3, 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: 2 
                }}>
                    <Button
                        variant="outlined"
                        onClick={handlClose}
                        disabled={loading}
                        sx={{
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            '&:hover': {
                                borderColor: '#1976d2',
                                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                            },
                        }}
                    >
                        Hủy
                    </Button>
                    <FormButtonCustom
                        type="submit"
                        disabled={loading}
                        sx={{
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#1976d2',
                                opacity: 0.9,
                            },
                        }}
                    >
                        {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                    </FormButtonCustom>
                </Box>
            </form>
        </Box>
    );
}