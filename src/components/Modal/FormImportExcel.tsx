import { Box, Button, Typography } from '@mui/material';
import { styledSystem } from '../../constans/styled';
import { useState } from 'react';
import { courseService } from '../../services/courseServices';

interface Props {
    handleClose: () => void;
    onSuccess: () => void;
}

export default function FormImportExcel({ handleClose, onSuccess }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            await courseService.importCourses(formData);
            onSuccess();
            handleClose();
        } catch (error) {
            console.error('Error importing courses:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                width: { xs: '90%', sm: '500px' },
                maxWidth: '100%',
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
                Import Danh Sách Học Phần
            </Typography>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Box sx={{
                    backgroundColor: '#f8f9fa',
                    p: 3,
                    borderRadius: '8px',
                    borderLeft: '4px solid',
                    borderColor: 'primary.main'
                }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Chọn File Excel
                    </Typography>

                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="excel-file-input"
                    />
                    <label htmlFor="excel-file-input">
                        <Button
                            variant="outlined"
                            component="span"
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            Chọn File
                        </Button>
                    </label>

                    {file && (
                        <Typography variant="body2" color="text.secondary">
                            Đã chọn: {file.name}
                        </Typography>
                    )}
                </Box>

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
                        disabled={isSubmitting || !file}
                    >
                        Import
                    </Button>
                </Box>
            </form>
        </Box>
    );
} 