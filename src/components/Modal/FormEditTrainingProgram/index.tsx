import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useState, useEffect } from 'react';
import { trainingService } from '../../../services/trainingServices';
import { FormButtonCustom } from '../../custom/Button/FormButtonCustom';
import { styledSystem } from '../../../constans/styled';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { trainingProgramResponse } from '../../../schemas/API/trainingProgramResponse';

interface Props {
    handlClose: () => void;
    trainingProgram: trainingProgramResponse;
    onSuccess?: () => void;
}

export default function FormEditTrainingProgram({ handlClose, trainingProgram, onSuccess }: Props) {
    const [formData, setFormData] = useState({
        trainingProgramId: '',
        trainingProgramName: '',
        degreeType: '',
        educationLevel: '',
        totalCredits: 0,
        trainingDuration: 0,
        trainingMode: '',
        teachingLanguage: '',
        managingFaculty: '',
        website: '',
        issuingDecision: '',
        status: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (trainingProgram) {
            setFormData({
                trainingProgramId: trainingProgram.id || '',
                trainingProgramName: trainingProgram.trainingProgramName || '',
                degreeType: trainingProgram.degreeType || '',
                educationLevel: trainingProgram.educationLevel || '',
                totalCredits: trainingProgram.totalCredits || 0,
                trainingDuration: trainingProgram.trainingDuration || 0,
                trainingMode: trainingProgram.trainingMode || '',
                teachingLanguage: trainingProgram.teachingLanguage || '',
                managingFaculty: trainingProgram.managingFaculty || '',
                website: trainingProgram.website || '',
                issuingDecision: trainingProgram.issuingDecision || '',
                status: trainingProgram.status ?? true
            });
        }
    }, [trainingProgram]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name as string]: name === 'totalCredits' || name === 'trainingDuration' ? Number(value) : value
        }));
        setError(null);
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value === 'true' ? true : false
        }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const response = await trainingService.updateTrainingProgram(trainingProgram.id, formData);
            if (response.isSuccess) {
                toast.success('Cập nhật chương trình đào tạo thành công!');
                if (onSuccess) {
                    onSuccess();
                }
                handlClose();
            }
        } catch (error) {
            console.error('Error updating training program:', error);
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
                Chỉnh sửa chương trình đào tạo
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                    <Box>
                        <TextField
                            fullWidth
                            label="Mã chương trình"
                            name="trainingProgramId"
                            value={formData.trainingProgramId}
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
                            label="Tên chương trình"
                            name="trainingProgramName"
                            value={formData.trainingProgramName}
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
                            label="Loại bằng"
                            name="degreeType"
                            value={formData.degreeType}
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
                            label="Cấp độ đào tạo"
                            name="educationLevel"
                            value={formData.educationLevel}
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
                            label="Tổng tín chỉ"
                            name="totalCredits"
                            type="number"
                            value={formData.totalCredits}
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
                            label="Thời gian đào tạo (năm)"
                            name="trainingDuration"
                            type="number"
                            value={formData.trainingDuration}
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
                            label="Hình thức đào tạo"
                            name="trainingMode"
                            value={formData.trainingMode}
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
                            label="Ngôn ngữ giảng dạy"
                            name="teachingLanguage"
                            value={formData.teachingLanguage}
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
                            label="Khoa quản lý"
                            name="managingFaculty"
                            value={formData.managingFaculty}
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
                            label="Website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
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
                            label="Quyết định ban hành"
                            name="issuingDecision"
                            value={formData.issuingDecision}
                            onChange={handleChange}
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
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                name="status"
                                value={formData.status ? 'true' : 'false'}
                                onChange={handleSelectChange}
                                label="Trạng thái"
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
                                <MenuItem value="true">Hoạt động</MenuItem>
                                <MenuItem value="false">Không hoạt động</MenuItem>
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