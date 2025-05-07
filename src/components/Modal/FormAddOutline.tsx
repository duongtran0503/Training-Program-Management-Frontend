import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { TitleCustom } from '../custom/Title';

type OutlinePayload = {
  courseCode: string;
  courseName: string;
  description: string;
  credits: number;
  syllabusContent: string;
  theory: number;
  practice: number;
  credit: number;
  evaluationComponents: {
    componentName: string;
    ratio: number;
  };
};

type CoursePayload = {
  courseCode: string;
  courseName: string;
  description: string;
  credits: number;
};

type Props = {
  courseData: CoursePayload;  // Pass the course data to the form
  handlClose: () => void;
  onSubmit: (data: OutlinePayload) => void;
};

export default function FormAddOutline({ courseData, onSubmit, handlClose }: Props) {
  const [form, setForm] = useState<OutlinePayload>({
    courseCode: courseData.courseCode,  // Use courseCode from passed props
    courseName: courseData.courseName,  // Use courseName from passed props
    description: courseData.description,  // Use description from passed props
    credits: courseData.credits,  // Use credits from passed props
    syllabusContent: '',
    theory: 0,
    practice: 0,
    credit: 0,
    evaluationComponents: {
      componentName: '',
      ratio: 0
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (['theory', 'practice', 'credit'].includes(name)) {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else if (['ratio', 'componentName'].includes(name)) {
      setForm((prev) => ({
        ...prev,
        evaluationComponents: {
          ...prev.evaluationComponents,
          [name]: name === 'ratio' ? Number(value) : value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    onSubmit(form);  // Call onSubmit with form data
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
        <TitleCustom>Thêm đề cương học phần</TitleCustom>
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