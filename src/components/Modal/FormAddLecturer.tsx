import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';

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
    onSubmit: (data: LecturerPayload) => void;
};

export default function FormAddLecturer({ handlClose, onSubmit }: Props) {
    const [form, setForm] = useState<LecturerPayload>({
        name: '',
        lecturerCode: '',
        gender: '',
        titleAcademicRank: '',
        avatar: '',
        department: '',
        status: true,
        dob: '',
        startDateOfTeaching: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
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
            <Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  pr: 1, // Optional: adds padding so scrollbar doesn't overlap
                }}
            >
            <TextField label="Tên" name="name" value={form.name} onChange={handleChange} />
            <TextField label="Mã GV" name="lecturerCode" value={form.lecturerCode} onChange={handleChange} />
            <TextField label="Giới tính" name="gender" value={form.gender} onChange={handleChange} />
            <TextField label="Học hàm" name="titleAcademicRank" value={form.titleAcademicRank} onChange={handleChange} />
            <TextField label="Avatar URL" name="avatar" value={form.avatar} onChange={handleChange} />
            <TextField label="Khoa" name="department" value={form.department} onChange={handleChange} />
            <TextField label="Ngày sinh" name="dob" type="date" InputLabelProps={{ shrink: true }} value={form.dob} onChange={handleChange} />
            <TextField label="Ngày bắt đầu dạy" name="startDateOfTeaching" type="date" InputLabelProps={{ shrink: true }} value={form.startDateOfTeaching} onChange={handleChange} />
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