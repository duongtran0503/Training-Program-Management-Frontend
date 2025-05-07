import { Box, Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

type CoursePayload = {
    courseCode: string;
    courseName: string;
    credits: number;
    description: string;
    status: boolean;
    prerequisites: string[];
};

type Props = {
    handlClose: () => void;
    onSubmit: (data: CoursePayload) => void;
    courseData: CoursePayload;
};

export default function FormEditCourse({ handlClose, onSubmit, courseData }: Props) {
    if (!courseData) return null;
    const [form, setForm] = useState<CoursePayload>(courseData);


    useEffect(() => {
        setForm(courseData);
    }, [courseData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'credits') {
            setForm(prev => ({ ...prev, credits: Number(value) }));
        } else if (name === 'prerequisites') {
            setForm(prev => ({ ...prev, prerequisites: value.split(',').map(item => item.trim()) }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = () => {
        onSubmit(form);
        handlClose();
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
                bgcolor: 'white',
                borderRadius: '1rem',
            }}
        >
            <TextField label="Mã môn học" name="courseCode" value={form.courseCode} onChange={handleChange} disabled />
            <TextField label="Tên môn học" name="courseName" value={form.courseName ?? ''} onChange={handleChange} />
            <TextField label="Số tín chỉ" name="credits" type="number" value={form.credits} onChange={handleChange} />
            <TextField label="Mô tả" name="description" multiline rows={3} value={form.description} onChange={handleChange} />
            <TextField
                label="Học phần tiên quyết (mã học phần, cách nhau bởi dấu phẩy)"
                name="prerequisites"
                value={form.prerequisites.join(', ')}
                onChange={handleChange}
            />

            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                <Button onClick={handlClose} variant="outlined" color="secondary">
                    Đóng
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Lưu
                </Button>
            </Box>
        </Box>
    );
}