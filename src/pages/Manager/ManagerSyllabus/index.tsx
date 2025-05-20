import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useEffect, useState } from 'react';
import { styledSystem } from '../../../constans/styled';
import { courseSyllabusService, CourseSyllabus } from '../../../services/courseSyllabusService';
import { toast } from 'react-toastify';
import { Add, Delete, Edit, Search } from '@mui/icons-material';
import ModalWrapper from '../../../components/Modal/ModalWrapper';
import FormSyllabus from '../../../components/Modal/FormSyllabus';

export default function ManagerSyllabus() {
    const [syllabuses, setSyllabuses] = useState<CourseSyllabus[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);
    const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
    const [selectedSyllabus, setSelectedSyllabus] = useState<CourseSyllabus | null>(null);
    const [selectedCourseCode, setSelectedCourseCode] = useState('');
    const [isOpenCourseCodeDialog, setIsOpenCourseCodeDialog] = useState(false);
    const [courseCodeInput, setCourseCodeInput] = useState('');

    const fetchSyllabuses = async () => {
        try {
            const response = await courseSyllabusService.getAllSyllabuses();
            if (response.success) {
                setSyllabuses(response.data);
            }
        } catch (error) {
            console.error('Error fetching syllabuses:', error);
            toast.error('Có lỗi xảy ra khi tải danh sách đề cương');
        }
    };

    useEffect(() => {
        fetchSyllabuses();
    }, []);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchSyllabuses();
            return;
        }

        try {
            const response = await courseSyllabusService.searchSyllabuses(searchTerm);
            if (response.success) {
                setSyllabuses(response.data);
            }
        } catch (error) {
            console.error('Error searching syllabuses:', error);
            toast.error('Có lỗi xảy ra khi tìm kiếm đề cương');
        }
    };

    const handleDelete = async (syllabusId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa đề cương này?')) {
            try {
                const response = await courseSyllabusService.deleteSyllabus(syllabusId);
                if (response.success) {
                    toast.success('Xóa đề cương thành công!');
                    fetchSyllabuses();
                }
            } catch (error) {
                console.error('Error deleting syllabus:', error);
                toast.error('Có lỗi xảy ra khi xóa đề cương');
            }
        }
    };

    const handleEdit = (syllabus: CourseSyllabus) => {
        setSelectedSyllabus(syllabus);
        setSelectedCourseCode(syllabus.courseResponse.courseCode);
        setIsOpenModalEdit(true);
    };

    const handleAddClick = () => {
        setIsOpenCourseCodeDialog(true);
    };

    const handleCourseCodeSubmit = () => {
        if (!courseCodeInput.trim()) {
            toast.error('Vui lòng nhập mã học phần');
            return;
        }
        setSelectedCourseCode(courseCodeInput);
        setIsOpenCourseCodeDialog(false);
        setIsOpenModalAdd(true);
        setCourseCodeInput('');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Quản Lý Đề Cương Học Phần
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddClick}
                >
                    Thêm Đề Cương
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    placeholder="Tìm kiếm theo tên học phần..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1 }}
                    size="small"
                />
                <Button
                    variant="contained"
                    startIcon={<Search />}
                    onClick={handleSearch}
                >
                    Tìm kiếm
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: styledSystem.primaryBoxShadow }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã Học Phần</TableCell>
                            <TableCell>Tên Học Phần</TableCell>
                            <TableCell>Số Tiết LT</TableCell>
                            <TableCell>Số Tiết TH</TableCell>
                            <TableCell>Số TC</TableCell>
                            <TableCell>Thành Phần Đánh Giá</TableCell>
                            <TableCell>Thao Tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {syllabuses.map((syllabus) => (
                            <TableRow key={syllabus.syllabusId}>
                                <TableCell>{syllabus.courseResponse.courseCode}</TableCell>
                                <TableCell>{syllabus.courseResponse.courseName}</TableCell>
                                <TableCell>{syllabus.theory}</TableCell>
                                <TableCell>{syllabus.practice}</TableCell>
                                <TableCell>{syllabus.credit}</TableCell>
                                <TableCell>
                                    {syllabus.evaluationComponents ? (
                                        `${syllabus.evaluationComponents.componentName} (${syllabus.evaluationComponents.ratio}%)`
                                    ) : (
                                        'Chưa có'
                                    )}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEdit(syllabus)}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(syllabus.syllabusId)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isOpenCourseCodeDialog} onClose={() => setIsOpenCourseCodeDialog(false)}>
                <DialogTitle>Nhập Mã Học Phần</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Mã Học Phần"
                        type="text"
                        fullWidth
                        value={courseCodeInput}
                        onChange={(e) => setCourseCodeInput(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsOpenCourseCodeDialog(false)}>Hủy</Button>
                    <Button onClick={handleCourseCodeSubmit} variant="contained">Tiếp tục</Button>
                </DialogActions>
            </Dialog>

            <ModalWrapper
                isOpen={isOpenModalAdd}
                onClose={() => setIsOpenModalAdd(false)}
            >
                <FormSyllabus
                    handleClose={() => setIsOpenModalAdd(false)}
                    courseCode={selectedCourseCode}
                    onSuccess={fetchSyllabuses}
                />
            </ModalWrapper>

            <ModalWrapper
                isOpen={isOpenModalEdit}
                onClose={() => setIsOpenModalEdit(false)}
            >
                <FormSyllabus
                    handleClose={() => setIsOpenModalEdit(false)}
                    isEdit
                    syllabus={selectedSyllabus}
                    courseCode={selectedCourseCode}
                    onSuccess={fetchSyllabuses}
                />
            </ModalWrapper>
        </Box>
    );
} 