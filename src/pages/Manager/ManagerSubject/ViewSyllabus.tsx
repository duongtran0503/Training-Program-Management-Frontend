import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Button,
} from '@mui/material';
import { styledSystem } from '../../../constans/styled';
import { useParams } from 'react-router-dom';
import { subjectServices } from '../../../services/subjectServices';

interface Syllabus {
    id: number;
    subjectCode: string;
    subjectName: string;
    credits: number;
    theoryCredits: number;
    practicalCredits: number;
    description: string;
    objectives: string;
    prerequisites: string;
    materials: string;
    assessment: string;
}

const ViewSyllabus = () => {
    const { subjectId } = useParams();
    const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSyllabus = async () => {
            try {
                if (subjectId) {
                    const response = await subjectServices.getSyllabus(subjectId);
                    setSyllabus(response.data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy đề cương:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSyllabus();
    }, [subjectId]);

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Đang tải...</Typography>
            </Box>
        );
    }

    if (!syllabus) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Không tìm thấy đề cương học phần</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" sx={{ mb: 3 }}>
                    Đề Cương Học Phần
                </Typography>

                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', width: '200px' }}>
                                    Mã học phần
                                </TableCell>
                                <TableCell>{syllabus.subjectCode}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    Tên học phần
                                </TableCell>
                                <TableCell>{syllabus.subjectName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    Số tín chỉ
                                </TableCell>
                                <TableCell>{syllabus.credits}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    Số tín chỉ lý thuyết
                                </TableCell>
                                <TableCell>{syllabus.theoryCredits}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    Số tín chỉ thực hành
                                </TableCell>
                                <TableCell>{syllabus.practicalCredits}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Mô tả học phần
                </Typography>
                <Typography>{syllabus.description}</Typography>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Mục tiêu học phần
                </Typography>
                <Typography>{syllabus.objectives}</Typography>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Điều kiện tiên quyết
                </Typography>
                <Typography>{syllabus.prerequisites}</Typography>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Tài liệu học tập
                </Typography>
                <Typography>{syllabus.materials}</Typography>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Đánh giá
                </Typography>
                <Typography>{syllabus.assessment}</Typography>
            </Paper>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => window.history.back()}
                >
                    Quay lại
                </Button>
            </Box>
        </Box>
    );
};

export default ViewSyllabus; 