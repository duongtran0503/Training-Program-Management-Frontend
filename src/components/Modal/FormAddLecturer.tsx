import { Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { styledSystem } from '../../constans/styled';

type LecturerPayload = {
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

type Props = {
    handlClose: () => void;
}

interface User {
    id: string;
    username: string;
    email: string;
}

export default function FormAddLecturer({ handlClose }: Props) {
    const [formData, setFormData] = useState({
        lecturerCode: '',
        name: '',
        boMon: '',
        khoa: '',
        trinhDo: '',
        chuyenMon: '',
        userId: '',
        status: true,
        createAt: new Date().toISOString().slice(0, 10),
        updateAt: new Date().toISOString().slice(0, 10),
    });

    const [availableUsers, setAvailableUsers] = useState<User[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetch('/api/users/available')
            .then((res) => res.json())
            .then((data) => setAvailableUsers(data));
    }, []);

    // Handle regular input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
            updateAt: new Date().toISOString().slice(0, 10),
        }));
    };

    // Handle Select changes (specific for MUI Select)
    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name as string]: value,
            updateAt: new Date().toISOString().slice(0, 10),
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked,
            updateAt: new Date().toISOString().slice(0, 10),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/giangvien', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Thêm giảng viên thành công!');
                handlClose();
            } else {
                throw new Error('Failed to add lecturer');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi thêm giảng viên');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={2}
            p={3}
            width="600px"
            boxShadow={3}
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
                Thêm Giảng Viên Mới
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
                            label="Mã Giảng Viên"
                            name="lecturerCode"
                            value={formData.lecturerCode}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            size="small"
                            variant="outlined"
                            sx={{ backgroundColor: 'white' }}
                        />

                        <TextField
                            label="Họ và Tên"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            size="small"
                            variant="outlined"
                            sx={{ backgroundColor: 'white' }}
                        />

                        <TextField
                            label="Bộ Môn"
                            name="boMon"
                            value={formData.boMon}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{ backgroundColor: 'white' }}
                        />

                        <TextField
                            label="Khoa"
                            name="khoa"
                            value={formData.khoa}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{ backgroundColor: 'white' }}
                        />
                    </Box>
                </Box>

                {/* Expertise Section */}
                <Box sx={{
                    backgroundColor: '#f8f9fa',
                    p: 3,
                    borderRadius: '8px',
                    borderLeft: '4px solid',
                    borderColor: 'secondary.main'
                }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Thông Tin Chuyên Môn
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <FormControl fullWidth size="small" sx={{ backgroundColor: 'white' }}>
                            <InputLabel>Trình Độ</InputLabel>
                            <Select
                                label="Trình Độ"
                                name="trinhDo"
                                value={formData.trinhDo}
                                onChange={handleSelectChange}
                            >
                                <MenuItem value=""><em>Chọn trình độ</em></MenuItem>
                                <MenuItem value="Thạc sĩ">Thạc sĩ</MenuItem>
                                <MenuItem value="Tiến sĩ">Tiến sĩ</MenuItem>
                                <MenuItem value="Phó giáo sư">Phó giáo sư</MenuItem>
                                <MenuItem value="Giáo sư">Giáo sư</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Chuyên Môn"
                            name="chuyenMon"
                            value={formData.chuyenMon}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{ backgroundColor: 'white' }}
                        />
                    </Box>
                </Box>

                {/* Account Section */}
                <Box sx={{
                    backgroundColor: '#f8f9fa',
                    p: 3,
                    borderRadius: '8px',
                    borderLeft: '4px solid',
                    borderColor: 'info.main'
                }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Tài Khoản Liên Kết
                    </Typography>

                    <FormControl fullWidth size="small" sx={{ backgroundColor: 'white', mb: 2 }}>
                        <InputLabel>Tài Khoản Hệ Thống</InputLabel>
                        <Select
                            label="Tài Khoản Hệ Thống"
                            name="userId"
                            value={formData.userId}
                            onChange={handleSelectChange}
                            required
                        >
                            <MenuItem value="" disabled>
                                <em>-- Chọn tài khoản --</em>
                            </MenuItem>
                            {availableUsers.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.username} ({user.email})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.status}
                                onChange={handleCheckboxChange}
                                name="status"
                                color="primary"
                            />
                        }
                        label="Đang công tác"
                        sx={{ color: 'text.primary' }}
                    />
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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
                        onClick={handlClose}
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