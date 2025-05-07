import { Box, Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { TitleCustom } from '../custom/Title';
import axiosClient from '../../../src/config/axiosClient';

type OutlinePayload = {
  syllabusId: string;
  syllabusContent: string;
  theory: number;
  practice: number;
  credit: number;
  evaluationComponents: {
    componentName: string;
    ratio: number;
  };
};

type Props = {
  handlClose: () => void;
  onSubmit: (data: OutlinePayload) => void;
  outlineData: OutlinePayload;
};

export default function FormEditOutline({ handlClose, onSubmit, outlineData }: Props) {
  const [form, setForm] = useState<OutlinePayload>(outlineData);

  useEffect(() => {
    setForm(outlineData);
  }, [outlineData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (['theory', 'practice', 'credit'].includes(name)) {
      setForm(prev => ({ ...prev, [name]: Number(value) }));
    } else if (['ratio', 'componentName'].includes(name)) {
      setForm(prev => ({
        ...prev,
        evaluationComponents: {
          ...prev.evaluationComponents,
          [name]: name === 'ratio' ? Number(value) : value,
        },
      }));
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
      sx={{ bgcolor: 'white', borderRadius: '1rem' }}
    >
      <TitleCustom>Cập nhật đề cương học phần</TitleCustom>

      <TextField
        label="Nội dung đề cương"
        name="syllabusContent"
        multiline
        rows={3}
        value={form.syllabusContent}
        onChange={handleChange}
      />
      <TextField
        label="Số tiết lý thuyết"
        name="theory"
        type="number"
        value={form.theory}
        onChange={handleChange}
      />
      <TextField
        label="Số tiết thực hành"
        name="practice"
        type="number"
        value={form.practice}
        onChange={handleChange}
      />
      <TextField
        label="Số tín chỉ"
        name="credit"
        type="number"
        value={form.credit}
        onChange={handleChange}
      />
      <TextField
        label="Thành phần đánh giá"
        name="componentName"
        value={form.evaluationComponents.componentName}
        onChange={handleChange}
      />
      <TextField
        label="Tỉ lệ (%)"
        name="ratio"
        type="number"
        value={form.evaluationComponents.ratio}
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