import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { styledSystem } from '../../constans/styled';

interface Props {
    handleClose: () => void;
}

export default function FormAddSubject({ handleClose }: Props) {
    const [formData, setFormData] = useState({
        subjectCode: '',
        subjectName: '',
        credits: 0,
        theoryHours: 0,
        practiceHours: 0,
        internshipHours: 0,
        coefficient: 1.0,
        department: '',
        semester: '',
        status: true,
        createAt: new Date().toISOString().slice(0, 10),
        updateAt: new Date().toISOString().slice(0, 10),
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
            updateAt: new Date().toISOString().slice(0, 10),
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            updateAt: new Date().toISOString().slice(0, 10),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Form submitted:', formData);
            handleClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                width: { xs: '90%', sm: '600px' },
                maxWidth: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '24px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: styledSystem.primaryBoxShadow,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
            }}
        >
            <Typography variant="h5" sx={{
                fontWeight: 600,
                color: 'primary.main',
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 2,
                mb: 1
            }}>
                Thêm Môn Học Mới
            </Typography>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Basic Information Section */}
                <Box sx={{
                    backgroundColor: '#f8f9fa',
                    p: 3,
                    borderRadius: '8px',
                    borderLeft: '4px solid',
                    borderColor: 'primary.main'
                }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Thông Tin Cơ Bản
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <TextField
                            label="Mã Học Phần*"
                            name="subjectCode"
                            value={formData.subjectCode}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            size="small"
                            variant="outlined"
                            sx={{ backgroundColor: 'white' }}
                        />

                        <TextField
                            label="Tên Môn Học*"
                            name="subjectName"
                            value={formData.subjectName}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            size="small"
                            variant="outlined"
                            sx={{ backgroundColor: 'white' }}
                        />

                        <TextField
                            label="Số Tín Chỉ*"
                            name="credits"
                            type="number"
                            value={formData.credits}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            size="small"
                            variant="outlined"
                            inputProps={{ min: 0, step: 0.5 }}
                            sx={{ backgroundColor: 'white' }}
                        />

                        <FormControl fullWidth size="small" sx={{ backgroundColor: 'white' }}>
                            <InputLabel>Khoa/Bộ Môn*</InputLabel>
                            <Select
                                label="Khoa/Bộ Môn*"
                                name="department"
                                value={formData.department}
                                onChange={handleSelectChange}
                                required
                            >
                                <MenuItem value="CNTT">Công nghệ Thông tin</MenuItem>
                                <MenuItem value="DTVT">Điện tử Viễn thông</MenuItem>
                                <MenuItem value="QTKD">Quản trị Kinh doanh</MenuItem>
                                <MenuItem value="NN">Ngôn ngữ</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {/* Hours Information Section */}
                <Box sx={{
                    backgroundColor: '#f8f9fa',
                    p: 3,
                    borderRadius: '8px',
                    borderLeft: '4px solid',
                    borderColor: 'secondary.main'
                }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Thông Tin Giờ Học
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <TextField
                            label="Số Tiết Lý Thuyết"
                            name="theoryHours"
                            type="number"
                            value={formData.theoryHours}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                            variant="outlined"
                            inputProps={{ min: 0 }}
                            sx={{ backgroundColor: 'white' }}
                        />

                        <TextField
                            label="Số Tiết Thực Hành"
                            name="practiceHours"
                            type="number"
                            value={formData.practiceHours}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                            variant="outlined"
                            inputProps={{ min: 0 }}
                            sx={{ backgroundColor: 'white' }}
                        />

                        <TextField
                            label="Số Tiết Thực Tập"
                            name="internshipHours"
                            type="number"
                            value={formData.internshipHours}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                            variant="outlined"
                            inputProps={{ min: 0 }}
                            sx={{ backgroundColor: 'white' }}
                        />

                        <TextField
                            label="Hệ Số"
                            name="coefficient"
                            type="number"
                            value={formData.coefficient}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                            variant="outlined"
                            inputProps={{ min: 0.1, step: 0.1, max: 2.0 }}
                            sx={{ backgroundColor: 'white' }}
                        />
                    </Box>
                </Box>

                {/* Semester Information */}
                <Box sx={{
                    backgroundColor: '#f8f9fa',
                    p: 3,
                    borderRadius: '8px',
                    borderLeft: '4px solid',
                    borderColor: 'info.main'
                }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Thông Tin Học Kỳ
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <FormControl fullWidth size="small" sx={{ backgroundColor: 'white' }}>
                            <InputLabel>Học Kỳ*</InputLabel>
                            <Select
                                label="Học Kỳ*"
                                name="semester"
                                value={formData.semester}
                                onChange={handleSelectChange}
                                required
                            >
                                <MenuItem value="HK1">Học kỳ 1</MenuItem>
                                <MenuItem value="HK2">Học kỳ 2</MenuItem>
                                <MenuItem value="HK3">Học kỳ hè</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {/* System Information */}
                <Box sx={{
                    backgroundColor: '#f8f9fa',
                    p: 3,
                    borderRadius: '8px',
                    borderLeft: '4px solid',
                    borderColor: 'grey.500'
                }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Thông Tin Hệ Thống
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <TextField
                            label="Ngày Tạo"
                            name="createAt"
                            value={formData.createAt}
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            disabled
                            size="small"
                            sx={{ backgroundColor: '#f0f0f0' }}
                        />

                        <TextField
                            label="Ngày Cập Nhật"
                            name="updateAt"
                            value={formData.updateAt}
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            disabled
                            size="small"
                            sx={{ backgroundColor: '#f0f0f0' }}
                        />
                    </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        sx={{
                            minWidth: '100px',
                            color: 'text.secondary',
                            borderColor: 'grey.400',
                            '&:hover': {
                                borderColor: 'grey.600',
                            }
                        }}
                    >
                        Hủy Bỏ
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={isSubmitting}
                        sx={{
                            minWidth: '100px',
                            backgroundColor: 'primary.main',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            },
                            '&:disabled': {
                                backgroundColor: 'action.disabledBackground',
                                color: 'action.disabled'
                            }
                        }}
                    >
                        {isSubmitting ? 'Đang Lưu...' : 'Lưu Thông Tin'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
}