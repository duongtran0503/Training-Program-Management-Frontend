import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useState, useEffect } from 'react';
import { lecturerService } from '../../../services/lecturerServices';
import { FormButtonCustom } from '../../custom/Button/FormButtonCustom';
import { styledSystem } from '../../../constans/styled';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { lecturerResponse } from '../../../schemas/API/lecturerResposne';

interface Props {
    handlClose: () => void;
    lecturer: lecturerResponse;
    onSuccess?: () => void;
}

export default function FormEditLecturer({ handlClose, lecturer, onSuccess }: Props) {
    const [formData, setFormData] = useState({
        lecturerCode: '',
        name: '',
        gender: 'Male',
        titleAcademicRank: '',
        status: true,
        dob: '',
        startDateOfTeaching: '',
        endDateOfTeaching: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (lecturer) {
            setFormData({
                lecturerCode: lecturer.lecturerCode || '',
                name: lecturer.name || '',
                gender: lecturer.gender || 'Male',
                titleAcademicRank: lecturer.titleAcademicRank || '',
                status: lecturer.status ?? true,
                dob: lecturer.dob ? new Date(lecturer.dob).toISOString().split('T')[0] : '',
                startDateOfTeaching: lecturer.startDateOfTeaching ? new Date(lecturer.startDateOfTeaching).toISOString().split('T')[0] : '',
                endDateOfTeaching: lecturer.endDateOfTeaching ? new Date(lecturer.endDateOfTeaching).toISOString().split('T')[0] : ''
            });
        }
    }, [lecturer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name as string]: value
        }));
        setError(null); // Clear error when user makes changes
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null); // Clear error when user makes changes
    };

    const validateDates = () => {
        const { dob, startDateOfTeaching, endDateOfTeaching } = formData;
        
        // Kiểm tra ngày sinh
        const dobDate = new Date(dob);
        const today = new Date();
        if (dobDate > today) {
            setError('Ngày sinh không thể lớn hơn ngày hiện tại');
            return false;
        }

        // Kiểm tra ngày bắt đầu giảng dạy
        const startDate = new Date(startDateOfTeaching);
        if (startDate < dobDate) {
            setError('Ngày bắt đầu giảng dạy không thể trước ngày sinh');
            return false;
        }

        // Kiểm tra ngày kết thúc giảng dạy nếu có
        if (endDateOfTeaching) {
            const endDate = new Date(endDateOfTeaching);
            if (endDate < startDate) {
                setError('Ngày kết thúc giảng dạy không thể trước ngày bắt đầu');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!validateDates()) {
                return;
            }

            setLoading(true);
            setError(null);
            const response = await lecturerService.updateLecturer(lecturer.id, formData);
            if (response.isSuccess) {
                toast.success('Cập nhật giảng viên thành công!');
                if (onSuccess) {
                    onSuccess();
                }
                handlClose();
            }
        } catch (error) {
            console.error('Error updating lecturer:', error);
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    setError('Mã giảng viên đã tồn tại. Vui lòng chọn mã khác.');
                    toast.error('Mã giảng viên đã tồn tại. Vui lòng chọn mã khác.');
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
                Chỉnh sửa thông tin giảng viên
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                    <Box>
                        <TextField
                            fullWidth
                            label="Mã giảng viên"
                            name="lecturerCode"
                            value={formData.lecturerCode}
                            onChange={handleChange}
                            required
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
                            label="Họ và tên"
                            name="name"
                            value={formData.name}
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
                            <InputLabel>Giới tính</InputLabel>
                            <Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleSelectChange}
                                label="Giới tính"
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
                                <MenuItem value="Male">Nam</MenuItem>
                                <MenuItem value="Female">Nữ</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <TextField
                            fullWidth
                            label="Học hàm/Học vị"
                            name="titleAcademicRank"
                            value={formData.titleAcademicRank}
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
                            <InputLabel>Đang công tác</InputLabel>
                            <Select
                                name="status"
                                value={formData.status ? 'true' : 'false'}
                                onChange={handleSelectChange}
                                label="Đang công tác"
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
                                <MenuItem value="true">Có</MenuItem>
                                <MenuItem value="false">Không</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <TextField
                            fullWidth
                            label="Ngày sinh"
                            name="dob"
                            type="date"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                max: new Date().toISOString().split('T')[0] // Không cho phép chọn ngày trong tương lai
                            }}
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
                            label="Ngày bắt đầu giảng dạy"
                            name="startDateOfTeaching"
                            type="date"
                            value={formData.startDateOfTeaching}
                            onChange={handleChange}
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                min: formData.dob // Không cho phép chọn ngày trước ngày sinh
                            }}
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
                            label="Ngày kết thúc giảng dạy"
                            name="endDateOfTeaching"
                            type="date"
                            value={formData.endDateOfTeaching}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                min: formData.startDateOfTeaching // Không cho phép chọn ngày trước ngày bắt đầu
                            }}
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
                        {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                    </FormButtonCustom>
                </Box>
            </form>
        </Box>
    );
} 