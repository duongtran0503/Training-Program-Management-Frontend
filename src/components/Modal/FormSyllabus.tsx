import React from 'react';
import { Box, Button, TextField, Typography, Paper, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useState, useEffect } from 'react';
import { courseSyllabusService, CreateSyllabusRequest } from '../../services/courseSyllabusService';
import { toast } from 'react-toastify';
import { styledSystem } from '../../constans/styled';
import { Delete, Edit, Add, Close } from '@mui/icons-material';

interface Props {
    courseCode: string;
    syllabuses?: any[];
    handleClose: () => void;
    onSuccess: () => void;
    onDelete: (syllabusId: string) => void;
}

interface FormErrors {
    syllabusContent?: string;
    theory?: string;
    practice?: string;
    credit?: string;
    evaluationComponents?: {
        componentName?: string;
        ratio?: string;
    };
}

export default function FormSyllabus({ courseCode, syllabuses = [], handleClose, onSuccess, onDelete }: Props) {
    const [formData, setFormData] = useState<CreateSyllabusRequest>({
        syllabusContent: '',
        theory: 0,
        practice: 0,
        credit: 0,
        status: 1,
        evaluationComponents: {
            componentName: '',
            ratio: 0
        }
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedSyllabus, setSelectedSyllabus] = useState<any>(null);
    const [showForm, setShowForm] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [syllabusToDelete, setSyllabusToDelete] = useState<string | null>(null);

    // Validate form khi mở form
    useEffect(() => {
        if (showForm) {
            validateForm();
        }
    }, [showForm]);

    const validateForm = () => {
        const newErrors: FormErrors = {};
        
        if (!formData.syllabusContent?.trim()) {
            newErrors.syllabusContent = 'Nội dung đề cương không được để trống';
        }
        
        if (formData.theory === '' || formData.theory < 0) {
            newErrors.theory = 'Số tiết lý thuyết không được âm';
        }
        
        if (formData.practice === '' || formData.practice < 0) {
            newErrors.practice = 'Số tiết thực hành không được âm';
        }
        
        if (formData.credit === '' || formData.credit <= 0) {
            newErrors.credit = 'Số tín chỉ phải lớn hơn 0';
        }
        
        if (formData.evaluationComponents) {
            if (!formData.evaluationComponents.componentName?.trim()) {
                newErrors.componentName = 'Tên thành phần đánh giá không được để trống';
            }
            
            if (formData.evaluationComponents.ratio === '' || 
                formData.evaluationComponents.ratio < 0 || 
                formData.evaluationComponents.ratio > 100) {
                newErrors.ratio = 'Tỷ lệ đánh giá phải từ 0 đến 100';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateForm();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        if (name === 'componentName' || name === 'ratio') {
            setFormData(prev => ({
                ...prev,
                evaluationComponents: {
                    ...prev.evaluationComponents,
                    [name]: name === 'ratio' ? (value === '' ? '' : parseInt(value)) : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'syllabusContent' ? value : (value === '' ? '' : parseInt(value))
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log('=== FORM SUBMIT DEBUG ===');
        console.log('Form Data:', formData);
        
        // Đánh dấu tất cả các trường đã được chạm vào
        const allTouched = Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);
        
        if (!validateForm()) {
            console.log('Form validation failed');
            toast.error('Vui lòng kiểm tra lại thông tin');
            return;
        }
        
        try {
            // Tạo dữ liệu gửi đi
            const submitData: CreateSyllabusRequest = {
                syllabusContent: formData.syllabusContent,
                theory: formData.theory || 0,
                practice: formData.practice || 0,
                credit: formData.credit || 0,
                status: 1,
                evaluationComponents: {
                    componentName: formData.evaluationComponents?.componentName || '',
                    ratio: formData.evaluationComponents?.ratio || 0
                }
            };
            
            console.log('Submit Data:', submitData);
            
            if (isEditing && selectedSyllabus) {
                console.log('Updating syllabus:', selectedSyllabus.syllabusId);
                // Khi update giữ nguyên status từ form data
                submitData.status = formData.status;
                await courseSyllabusService.updateSyllabus(selectedSyllabus.syllabusId, submitData);
                toast.success('Cập nhật đề cương thành công');
            } else {
                console.log('Creating new syllabus for course:', courseCode);
                await courseSyllabusService.createSyllabus(courseCode, submitData);
                toast.success('Thêm đề cương thành công');
            }
            
            onSuccess();
            handleClose();
        } catch (error) {
            console.error('Error submitting syllabus:', error);
            toast.error('Có lỗi xảy ra khi thao tác với đề cương');
        }
    };

    const handleDeleteClick = (syllabusId: string) => {
        setSyllabusToDelete(syllabusId);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!syllabusToDelete) return;

        try {
            await courseSyllabusService.deleteSyllabus(syllabusToDelete);
            toast.success('Xóa đề cương thành công');
            onSuccess();
            setDeleteConfirmOpen(false);
            setSyllabusToDelete(null);
        } catch (error) {
            console.error('Error deleting syllabus:', error);
            toast.error('Có lỗi xảy ra khi xóa đề cương');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
        setSyllabusToDelete(null);
    };

    const handleEdit = (syllabus: any) => {
        setSelectedSyllabus(syllabus);
        setFormData({
            syllabusContent: syllabus.syllabusContent || '',
            theory: syllabus.theory || 0,
            practice: syllabus.practice || 0,
            credit: syllabus.credit || 0,
            status: syllabus.status || 1,
            evaluationComponents: syllabus.evaluationComponents ? {
                componentName: syllabus.evaluationComponents.componentName || '',
                ratio: syllabus.evaluationComponents.ratio || 0
            } : {
                componentName: '',
                ratio: 0
            }
        });
        setIsEditing(true);
        setShowForm(true);
    };

    const handleAddNew = () => {
        resetForm();
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            syllabusContent: '',
            theory: 0,
            practice: 0,
            credit: 0,
            status: 1,
            evaluationComponents: {
                componentName: '',
                ratio: 0
            }
        });
        setErrors({});
        setSelectedSyllabus(null);
        setIsEditing(false);
        setShowForm(false);
    };

    return (
        <Box
            sx={{
                width: { xs: '90%', sm: '800px' },
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
                position: 'relative'
            }}
        >
            <IconButton
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'text.secondary'
                }}
            >
                <Close />
            </IconButton>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    pb: 2,
                    mb: 1
                }}>
                    Quản lý đề cương học phần
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddNew}
                >
                    Thêm đề cương mới
                </Button>
            </Box>

            {!showForm && (
                <List>
                    {syllabuses.map((syllabus, index) => (
                        <React.Fragment key={syllabus.syllabusId}>
                            <ListItem>
                                <ListItemText
                                    primary={`Đề cương ${index + 1}`}
                                    secondary={
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Nội dung: {syllabus.syllabusContent}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Lý thuyết: {syllabus.theory} tiết
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Thực hành: {syllabus.practice} tiết
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Số tín chỉ: {syllabus.credit}
                                            </Typography>
                                            {syllabus.evaluationComponents && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Đánh giá: {syllabus.evaluationComponents.componentName} ({syllabus.evaluationComponents.ratio}%)
                                                </Typography>
                                            )}
                                        </Box>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        color="primary"
                                        onClick={() => handleEdit(syllabus)}
                                        title="Sửa"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        color="error"
                                        onClick={() => handleDeleteClick(syllabus.syllabusId)}
                                        title="Xóa"
                                    >
                                        <Delete />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            {index < syllabuses.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <TextField
                        fullWidth
                        label="Nội dung đề cương"
                        name="syllabusContent"
                        value={formData.syllabusContent}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        multiline
                        rows={4}
                        required
                        error={touched.syllabusContent && !!errors.syllabusContent}
                        helperText={touched.syllabusContent && errors.syllabusContent}
                    />
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Số tiết lý thuyết"
                            name="theory"
                            type="number"
                            value={formData.theory}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            inputProps={{ min: 0 }}
                            error={touched.theory && !!errors.theory}
                            helperText={touched.theory && errors.theory}
                        />
                        <TextField
                            fullWidth
                            label="Số tiết thực hành"
                            name="practice"
                            type="number"
                            value={formData.practice}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            inputProps={{ min: 0 }}
                            error={touched.practice && !!errors.practice}
                            helperText={touched.practice && errors.practice}
                        />
                        <TextField
                            fullWidth
                            label="Số tín chỉ"
                            name="credit"
                            type="number"
                            value={formData.credit}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            inputProps={{ min: 1 }}
                            error={touched.credit && !!errors.credit}
                            helperText={touched.credit && errors.credit}
                        />
                    </Box>

                    <Box sx={{ backgroundColor: '#f8f9fa', p: 3, borderRadius: '8px' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Thành phần đánh giá
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Tên thành phần"
                                name="componentName"
                                value={formData.evaluationComponents.componentName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                error={touched.componentName && !!errors.componentName}
                                helperText={touched.componentName && errors.componentName}
                            />
                            <TextField
                                fullWidth
                                label="Tỷ lệ (%)"
                                name="ratio"
                                type="number"
                                value={formData.evaluationComponents.ratio}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                inputProps={{ min: 0, max: 100 }}
                                error={touched.ratio && !!errors.ratio}
                                helperText={touched.ratio && errors.ratio}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={resetForm}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting || Object.keys(errors).length > 0}
                        >
                            {isEditing ? 'Cập nhật' : 'Thêm'}
                        </Button>
                    </Box>
                </form>
            )}

            <Dialog
                open={deleteConfirmOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa đề cương này không?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Hủy</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
} 