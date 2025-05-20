import { Box, Button, Typography, Paper, Divider } from '@mui/material';

interface Props {
    syllabus: any;
    handleClose: () => void;
}

export default function ViewSyllabus({ syllabus, handleClose }: Props) {
    if (!syllabus) {
        return (
            <Box sx={{ p: 3, width: '600px' }}>
                <Typography variant="h6" gutterBottom>
                    Không tìm thấy đề cương
                </Typography>
                <Button variant="contained" onClick={handleClose}>
                    Đóng
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, width: '600px' }}>
            <Typography variant="h6" gutterBottom>
                Đề cương học phần: {syllabus.courseResponse?.courseName}
            </Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Nội dung đề cương:
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {syllabus.syllabusContent}
                </Typography>
            </Paper>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Thông tin chi tiết:
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Typography>
                        <strong>Số tiết lý thuyết:</strong> {syllabus.theory}
                    </Typography>
                    <Typography>
                        <strong>Số tiết thực hành:</strong> {syllabus.practice}
                    </Typography>
                    <Typography>
                        <strong>Số tín chỉ:</strong> {syllabus.credit}
                    </Typography>
                </Box>
            </Paper>

            {syllabus.evaluationComponents && (
                <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Thành phần đánh giá:
                    </Typography>
                    <Typography>
                        <strong>{syllabus.evaluationComponents.componentName}:</strong>{' '}
                        {syllabus.evaluationComponents.ratio}%
                    </Typography>
                </Paper>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleClose}>
                    Đóng
                </Button>
            </Box>
        </Box>
    );
} 