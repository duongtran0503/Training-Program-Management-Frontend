import { Box, Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, Switch, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { styledSystem } from '../../constans/styled';
import { courseService } from '../../services/courseServices';
import { Course } from '../../types/course';
import { toast } from 'react-toastify';

interface Props {
    handleClose: () => void;
    isEdit?: boolean;
    course?: Course | null;
}

export default function FormAddSubject({ handleClose, isEdit = false, course }: Props) {
    const [formData, setFormData] = useState({
        subjectCode: '',
        subjectName: '',
        credits: 0,
        theoryHours: 0,
        practiceHours: 0,
        internshipHours: 0,
        coefficient: 1.0,
        department: 'CNTT',
        semester: '',
        status: true,
        createAt: new Date().toISOString().slice(0, 10),
        updateAt: new Date().toISOString().slice(0, 10),
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEdit && course) {
            console.log('Course data:', course);
            // Parse description to get hours and department
            const description = course.description || '';
            console.log('Description:', description);
            const theoryMatch = description.match(/(\d+) tiết lý thuyết/);
            const practiceMatch = description.match(/(\d+) tiết thực hành/);
            const internshipMatch = description.match(/(\d+) tiết thực tập/);
            const departmentMatch = description.match(/Khoa\/Bộ môn: ([A-Z]+)/);
            
            console.log('Matches:', {
                theory: theoryMatch,
                practice: practiceMatch,
                internship: internshipMatch,
                department: departmentMatch
            });

            setFormData({
                subjectCode: course.courseCode,
                subjectName: course.courseName,
                credits: course.credits,
                theoryHours: theoryMatch ? parseInt(theoryMatch[1]) : 0,
                practiceHours: practiceMatch ? parseInt(practiceMatch[1]) : 0,
                internshipHours: internshipMatch ? parseInt(internshipMatch[1]) : 0,
                coefficient: 1.0,
                department: departmentMatch ? departmentMatch[1] : 'CNTT',
                semester: '',
                status: course.status,
                createAt: course.createdAt ? new Date(course.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
                updateAt: course.updatedAt ? new Date(course.updatedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
            });
        }
    }, [isEdit, course]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name as string]: value
        }));
        setError(null); // Clear error when user makes changes
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
        setError(null);

        try {
            const description = `${formData.theoryHours} tiết lý thuyết, ${formData.practiceHours} tiết thực hành, ${formData.internshipHours} tiết thực tập, Khoa/Bộ môn: ${formData.department}`;

            if (isEdit && course) {
                const updateData = {
                    courseName: formData.subjectName,
                    credits: formData.credits,
                    description: description,
                    status: formData.status
                };
                await courseService.updateCourse(course.courseCode, updateData);
                toast.success('Cập nhật học phần thành công!');
                handleClose();
            } else {
                const createData = {
                    courseCode: formData.subjectCode,
                    courseName: formData.subjectName,
                    credits: formData.credits,
                    description: description,
                    status: formData.status,
                    prerequisites: []
                };
                await courseService.createCourse(createData);
                toast.success('Thêm học phần thành công!');
                handleClose();
            }
        } catch (error: any) {
            console.error('Error saving course:', error);
            if (error.response?.status === 409) {
                setError('Mã học phần đã tồn tại. Vui lòng chọn mã khác.');
                toast.error('Mã học phần đã tồn tại. Vui lòng chọn mã khác.');
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
                toast.error(error.response.data.message);
            } else {
                setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
                toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
            }
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
                {isEdit ? 'Sửa Môn Học' : 'Thêm Môn Học Mới'}
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
                            disabled={isEdit}
                            error={!!error}
                            helperText={error}
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
                                value={formData.department || 'CNTT'}
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
                    </Box>
                </Box>

                {/* Status Section */}
                <Box sx={{
                    backgroundColor: '#f8f9fa',
                    p: 3,
                    borderRadius: '8px',
                    borderLeft: '4px solid',
                    borderColor: 'success.main'
                }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Trạng Thái
                    </Typography>

                    <FormControl fullWidth size="small" sx={{ backgroundColor: 'white' }}>
                        <InputLabel>Trạng Thái*</InputLabel>
                        <Select
                            label="Trạng Thái*"
                            name="status"
                            value={formData.status ? 'true' : 'false'}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                status: e.target.value === 'true',
                                updateAt: new Date().toISOString().slice(0, 10),
                            }))}
                            required
                        >
                            <MenuItem value="true">Hoạt động</MenuItem>
                            <MenuItem value="false">Không hoạt động</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isEdit ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
}