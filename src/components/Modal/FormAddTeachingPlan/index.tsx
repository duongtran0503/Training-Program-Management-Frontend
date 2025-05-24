import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useState, useEffect } from 'react';
import { teachingPlanService } from '../../../services/teachingPlanServices';
import { trainingService } from '../../../services/trainingServices';
import { errorAPIRequest } from '../../../config/HandleAPIErrorRequst';
import { FormButtonCustom } from '../../custom/Button/FormButtonCustom';
import { styledSystem } from '../../../constans/styled';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { trainingProgramResponse } from '../../../schemas/API/trainingProgramResponse';

interface Props {
    handlClose: () => void;
    onSuccess?: () => void;
}

export default function FormAddTeachingPlan({ handlClose, onSuccess }: Props) {
    const [formData, setFormData] = useState({
        teachingPlanId: '',
        academicYear: 0,
        semester: 0,
        trainingProgramId: ''
    });
    const [trainingPrograms, setTrainingPrograms] = useState<trainingProgramResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Tạo danh sách năm học từ 2000 đến 2025
    const years = Array.from({ length: 2025 - 2000 + 1 }, (_, index) => 2000 + index);

    useEffect(() => {
        const fetchTrainingPrograms = async () => {
            try {
                const response = await trainingService.getAllTrainingPrograms();
                if (response.statusCode === 200 && Array.isArray(response.data)) {
                    setTrainingPrograms(response.data);
                }
            } catch (error) {
                console.error('Error fetching training programs:', error);
                errorAPIRequest.serverError({ error });
            }
        };
        fetchTrainingPrograms();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        if (name === 'semester') {
            const numValue = Number(value);
            if (numValue <= 0) {
                setError('Học kỳ phải lớn hơn 0');
                return;
            }
        }
        setFormData(prev => ({
            ...prev,
            [name as string]: name === 'semester' || name === 'academicYear' ? Number(value) : value
        }));
        setError(null);
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'academicYear' ? Number(value) : value
        }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const response = await teachingPlanService.createTeachingPlan(formData);
            if (response.isSuccess) {
                toast.success('Thêm kế hoạch đào tạo thành công!');
                if (onSuccess) {
                    onSuccess();
                }
                handlClose();
            }
        } catch (error) {
            console.error('Error creating teaching plan:', error);
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    setError('Mã kế hoạch đã tồn tại. Vui lòng chọn mã khác.');
                    toast.error('Mã kế hoạch đã tồn tại. Vui lòng chọn mã khác.');
                } else if (error.response?.data?.message) {
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
                Thêm kế hoạch đào tạo mới
            </Typography>
            {error && (
                <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                    {error}
                </Typography>
            )}
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
                            error={!!error && error.includes('teachingPlanId')}
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
                            <InputLabel>Năm học</InputLabel>
                            <Select
                                name="academicYear"
                                value={formData.academicYear.toString()}
                                onChange={handleSelectChange}
                                label="Năm học"
                                required
                                error={!!error && error.includes('academicYear')}
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
                                {years.map(year => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                            error={!!error && error.includes('semester')}
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
                                error={!!error && error.includes('trainingProgramId')}
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
                        {loading ? 'Đang thêm...' : 'Thêm mới'}
                    </FormButtonCustom>
                </Box>
            </form>
        </Box>
    );
}