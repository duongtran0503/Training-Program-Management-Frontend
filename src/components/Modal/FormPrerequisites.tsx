import React from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, Paper, Chip, Stack, IconButton, Divider, List, ListItem, ListItemText } from '@mui/material';
import { useState, useEffect } from 'react';
import { subjectServices } from '../../services/subjectServices';
import { Course } from '../../types/course';
import { toast } from 'react-toastify';
import { styledSystem } from '../../constans/styled';
import { Delete } from '@mui/icons-material';

interface Props {
    course: Course | null;
    handleClose: () => void;
    onRemovePrerequisite: (courseCode: string, prerequisiteCode: string) => Promise<void>;
}

export default function FormPrerequisites({ course, handleClose, onRemovePrerequisite }: Props) {
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
    const [selectedPrerequisites, setSelectedPrerequisites] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPrerequisites, setCurrentPrerequisites] = useState<Course[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await subjectServices.getAllSubjects();
                if (response.data.success) {
                    // Lọc bỏ học phần hiện tại và các học phần đã là tiên quyết
                    const filteredCourses = response.data.data.filter(
                        (c: Course) => c.courseCode !== course?.courseCode && 
                        !course?.prerequisites?.some(p => p.courseCode === c.courseCode)
                    );
                    setAvailableCourses(filteredCourses);
                    if (course?.prerequisites) {
                        setCurrentPrerequisites(course.prerequisites);
                    }
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
                toast.error('Không thể lấy danh sách học phần');
            }
        };

        if (course) {
            fetchCourses();
        }
    }, [course]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!course) return;

        setIsSubmitting(true);
        try {
            await subjectServices.addPrerequisites(course.courseCode, selectedPrerequisites);
            toast.success('Thêm học phần bắt buộc thành công');
            handleClose();
        } catch (error) {
            console.error('Error adding prerequisites:', error);
            toast.error('Có lỗi xảy ra khi thêm học phần bắt buộc');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (prerequisiteCode: string) => {
        setSelectedPrerequisites(prev => prev.filter(code => code !== prerequisiteCode));
    };

    const handleRemoveCurrentPrerequisite = async (prerequisiteCode: string) => {
        if (!course) return;
        try {
            await onRemovePrerequisite(course.courseCode, prerequisiteCode);
            setCurrentPrerequisites(prev => prev.filter(p => p.courseCode !== prerequisiteCode));
        } catch (error) {
            console.error('Error removing prerequisite:', error);
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
                {currentPrerequisites.length > 0 ? 'Học phần bắt buộc' : 'Thêm học phần bắt buộc'} cho {course?.courseName}
            </Typography>

            {currentPrerequisites.length > 0 && (
                <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Học phần bắt buộc hiện tại:
                    </Typography>
                    <List>
                        {currentPrerequisites.map((prerequisite, index) => (
                            <React.Fragment key={prerequisite.courseCode}>
                                <ListItem
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => handleRemoveCurrentPrerequisite(prerequisite.courseCode)}
                                            disabled={isSubmitting}
                                        >
                                            <Delete />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={prerequisite.courseName}
                                        secondary={`Mã học phần: ${prerequisite.courseCode}`}
                                    />
                                </ListItem>
                                {index < currentPrerequisites.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <FormControl fullWidth>
                    <InputLabel>Chọn học phần bắt buộc</InputLabel>
                    <Select
                        multiple
                        value={selectedPrerequisites}
                        onChange={(e) => setSelectedPrerequisites(e.target.value as string[])}
                        renderValue={(selected) => (
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {selected.map((value) => {
                                    const course = availableCourses.find(c => c.courseCode === value);
                                    return (
                                        <Chip
                                            key={value}
                                            label={`${course?.courseName} (${course?.courseCode})`}
                                            onDelete={() => handleDelete(value)}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    );
                                })}
                            </Stack>
                        )}
                        sx={{ backgroundColor: 'white' }}
                    >
                        {availableCourses.map((course) => (
                            <MenuItem key={course.courseCode} value={course.courseCode}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="body1">{course.courseName}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Mã học phần: {course.courseCode}
                                    </Typography>
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {selectedPrerequisites.length > 0 && (
                    <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Học phần sẽ thêm:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {selectedPrerequisites.map((code) => {
                                const course = availableCourses.find(c => c.courseCode === code);
                                return (
                                    <Chip
                                        key={code}
                                        label={`${course?.courseName} (${course?.courseCode})`}
                                        onDelete={() => handleDelete(code)}
                                        color="primary"
                                    />
                                );
                            })}
                        </Stack>
                    </Paper>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Đóng
                    </Button>
                    {selectedPrerequisites.length > 0 && (
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                        >
                            Thêm
                        </Button>
                    )}
                </Box>
            </form>
        </Box>
    );
} 