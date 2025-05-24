import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { trainingService } from '../../../services/trainingServices';
import { errorAPIRequest } from '../../../config/HandleAPIErrorRequst';
import { FormButtonCustom } from '../../custom/Button/FormButtonCustom';
import { styledSystem } from '../../../constans/styled';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface Props {
    handlClose: () => void;
    onSuccess?: () => void;
}

export default function FormAddTrainingProgram({ handlClose, onSuccess }: Props) {
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
        status: true // Đảm bảo luôn là true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        if (name === 'totalCredits' || name === 'trainingDuration') {
            const numValue = Number(value);
            if (numValue <= 0) {
                setError(`${name === 'totalCredits' ? 'Tổng tín chỉ' : 'Thời gian đào tạo'} phải lớn hơn 0`);
                return;
            }
        }
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
            [name]: value
        }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const response = await trainingService.createTrainingProgram(formData);
            if (response.isSuccess) {
                toast.success('Thêm chương trình đào tạo thành công!');
                if (onSuccess) {
                    onSuccess();
                }
                handlClose();
            }
        } catch (error) {
            console.error('Error creating training program:', error);
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    setError('Mã chương trình đã tồn tại. Vui lòng chọn mã khác.');
                    toast.error('Mã chương trình đã tồn tại. Vui lòng chọn mã khác.');
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
                Thêm chương trình đào tạo mới
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
                            label="Mã chương trình"
                            name="trainingProgramId"
                            value={formData.trainingProgramId}
                            onChange={handleChange}
                            required
                            error={!!error && error.includes('trainingProgramId')}
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
                            error={!!error && error.includes('trainingProgramName')}
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
                            <InputLabel>Loại bằng</InputLabel>
                            <Select
                                name="degreeType"
                                value={formData.degreeType}
                                onChange={handleSelectChange}
                                label="Loại bằng"
                                required
                                error={!!error && error.includes('degreeType')}
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
                                <MenuItem value="Cử nhân">Cử nhân</MenuItem>
                                <MenuItem value="Tiến sĩ">Tiến sĩ</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <TextField
                            fullWidth
                            label="Cấp độ đào tạo"
                            name="educationLevel"
                            value={formData.educationLevel}
                            onChange={handleChange}
                            required
                            error={!!error && error.includes('educationLevel')}
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
                            error={!!error && error.includes('totalCredits')}
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
                            error={!!error && error.includes('trainingDuration')}
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
                            error={!!error && error.includes('trainingMode')}
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
                            error={!!error && error.includes('teachingLanguage')}
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
                            error={!!error && error.includes('managingFaculty')}
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
                            error={!!error && error.includes('website')}
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
                            error={!!error && error.includes('issuingDecision')}
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