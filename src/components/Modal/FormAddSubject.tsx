import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { TitleCustom } from '../custom/Title';

type CoursePayload = {
    courseCode: string;
    courseName: string;
    credits: number;
    description: string;
    status: boolean;
    prerequisites: string[]; // list of course codes
};

type Props = {
    handlClose: () => void;
    onSubmit: (data: CoursePayload) => void;
};

export default function FormAddCourse({ handlClose, onSubmit }: Props) {
    const [form, setForm] = useState<CoursePayload>({
        courseCode: '',
        courseName: '',
        credits: 0,
        description: '',
        status: true,
        prerequisites: [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'credits' ? parseInt(value) : value,
        }));
    };

    const handlePrerequisitesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const codes = e.target.value.split(',').map(code => code.trim());
        setForm(prev => ({ ...prev, prerequisites: codes }));
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
            <Box>
                <TitleCustom>Thêm học phần</TitleCustom>
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    pr: 1,
                }}
            >
                <TextField label="Mã môn học" name="courseCode" value={form.courseCode} onChange={handleChange} />
                <TextField label="Tên môn học" name="courseName" value={form.courseName} onChange={handleChange} />
                <TextField label="Số tín chỉ" name="credits" type="number" value={form.credits} onChange={handleChange} />
                <TextField label="Mô tả" name="description" value={form.description} multiline rows={3} onChange={handleChange} />
                <TextField
                    label="Môn học tiên quyết (mã), cách nhau bởi dấu phẩy"
                    name="prerequisites"
                    value={form.prerequisites.join(', ')}
                    onChange={handlePrerequisitesChange}
                />
            </Box>

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