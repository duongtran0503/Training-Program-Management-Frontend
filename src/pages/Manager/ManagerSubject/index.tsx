import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styledSystem } from '../../../constans/styled';
import { TitleCustom } from '../../../components/custom/Title';
import { FormButtonCustom } from '../../../components/custom/Button/FormButtonCustom';
import AddIcon from '@mui/icons-material/Add';
import { FormInputCustom } from '../../../components/custom/Input/FormInputCustom';
import { Course } from '../../../types/course';
import { useState, useEffect } from 'react';
import ModalWrapper from '../../../components/Modal/ModalWrapper';
import FormAddSubject from '../../../components/Modal/FormAddSubject';
import FormSyllabus from '../../../components/Modal/FormSyllabus';
import FormPrerequisites from '../../../components/Modal/FormPrerequisites';
import { subjectServices } from '../../../services/subjectServices';
import { courseSyllabusService } from '../../../services/courseSyllabusService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Edit, Delete, Description, Visibility } from '@mui/icons-material';
import { AxiosError } from 'axios';

interface Syllabus {
    id: string;
    courseResponse: {
        courseCode: string;
    };
    status: number;
}

export default function ManagerSubject() {
    const [isOpenModalAddSubject, setIsOpenModalAddSubject] = useState(false);
    const [isOpenModalEditSubject, setIsOpenModalEditSubject] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [isOpenModalSyllabus, setIsOpenModalSyllabus] = useState(false);
    const [selectedSyllabuses, setSelectedSyllabuses] = useState<Syllabus[]>([]);
    const [isOpenModalPrerequisites, setIsOpenModalPrerequisites] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredCourses(courses);
        } else {
            const filtered = courses.filter(course => 
                course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCourses(filtered);
        }
    }, [searchTerm, courses]);

    const fetchCourses = async () => {
        try {
            const response = await subjectServices.getAllSubjects();
            if (response.data.success && Array.isArray(response.data.data)) {
                setCourses(response.data.data);
                if (response.data.data.length === 0) {
                    toast.info('Chưa có học phần nào');
                }
            } else {
                console.error('Invalid response format:', response);
                toast.error('Không thể lấy danh sách học phần');
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                    navigate('/');
                } else {
                    toast.error('Có lỗi xảy ra khi lấy danh sách học phần');
                }
            }
        }
    };

    const handleEdit = (course: Course) => {
        setSelectedCourse(course);
        setIsOpenModalEditSubject(true);
    };

    const handleDelete = async (course: Course) => {
        try {
            await subjectServices.deleteSubject(course.courseCode);
            toast.success('Xóa học phần thành công!');
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
            toast.error('Có lỗi xảy ra khi xóa học phần');
        }
    };

    const handleSyllabusClick = async (course: Course) => {
        setSelectedCourse(course);
        try {
            const response = await courseSyllabusService.getAllSyllabuses();
            if (response.success) {
                const courseSyllabuses = response.data.filter(syllabus => 
                    syllabus.courseResponse.courseCode === course.courseCode && syllabus.status === 1
                );
                setSelectedSyllabuses(courseSyllabuses as any);
                setIsOpenModalSyllabus(true);
            }
        } catch (error) {
            console.error('Error fetching syllabuses:', error);
            toast.error('Có lỗi xảy ra khi lấy danh sách đề cương');
        }
    };

    const handlePrerequisitesClick = (course: Course) => {
        setSelectedCourse(course);
        setIsOpenModalPrerequisites(true);
    };

    const handleDeleteSyllabus = async (syllabusId: string) => {
        try {
            await courseSyllabusService.deleteSyllabus(syllabusId);
            toast.success('Xóa đề cương thành công!');
            const response = await courseSyllabusService.getAllSyllabuses();
            if (response.success) {
                const courseSyllabuses = response.data.filter(syllabus => 
                    syllabus.courseResponse.courseCode === selectedCourse?.courseCode && syllabus.status === 1
                );
                setSelectedSyllabuses(courseSyllabuses as any);
            }
        } catch (error) {
            console.error('Error deleting syllabus:', error);
            toast.error('Có lỗi xảy ra khi xóa đề cương');
        }
    };

    const handleRemovePrerequisite = async (courseCode: string, prerequisiteCode: string) => {
        try {
            await subjectServices.removePrerequisite(courseCode, prerequisiteCode);
            toast.success('Xóa học phần bắt buộc thành công!');
            fetchCourses();
        } catch (error) {
            console.error('Error removing prerequisite:', error);
            toast.error('Có lỗi xảy ra khi xóa học phần bắt buộc');
        }
    };

    return (
        <Box
            sx={{
                padding: '10px',
                borderRadius: '10px',
                boxShadow: styledSystem.secondBoxShadow,
                minHeight: '700px',
            }}
        >
            <Box>
                <TitleCustom>Quản lý học phần</TitleCustom>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '10px',
                }}
            >
                <Box>
                    <FormInputCustom
                        sx={{ width: '300px' }}
                        placeholder='search...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        columnGap: '10px',
                    }}
                >
                    <FormButtonCustom
                        sx={{
                            width: '100px',
                            height: '35px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        startIcon={<AddIcon />}
                        onClick={() => setIsOpenModalAddSubject(true)}
                    >
                        Thêm
                    </FormButtonCustom>
                </Box>
            </Box>
            <Box sx={{ marginTop: '10px' }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã học phần</TableCell>
                                <TableCell>Tên học phần</TableCell>
                                <TableCell>Số tín chỉ</TableCell>
                                <TableCell>Mô tả</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCourses.map((course) => (
                                <TableRow key={course.courseCode}>
                                    <TableCell>{course.courseCode}</TableCell>
                                    <TableCell>{course.courseName}</TableCell>
                                    <TableCell>{course.credits}</TableCell>
                                    <TableCell>{course.description}</TableCell>
                                    <TableCell>{course.status ? 'Hoạt động' : 'Không hoạt động'}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEdit(course)}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(course)}
                                            >
                                                <Delete />
                                            </IconButton>
                                            <IconButton
                                                color="info"
                                                onClick={() => handleSyllabusClick(course)}
                                                title="Quản lý đề cương"
                                            >
                                                <Description />
                                            </IconButton>
                                            <IconButton
                                                color="secondary"
                                                onClick={() => handlePrerequisitesClick(course)}
                                                title={course.prerequisites && course.prerequisites.length > 0 ? 'Xem học phần bắt buộc' : 'Thêm học phần bắt buộc'}
                                            >
                                                <Visibility />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <ModalWrapper
                open={isOpenModalAddSubject}
                handleClose={() => setIsOpenModalAddSubject(false)}
            >
                <FormAddSubject 
                    handleClose={() => {
                        setIsOpenModalAddSubject(false);
                        fetchCourses();
                    }} 
                />
            </ModalWrapper>

            <ModalWrapper
                open={isOpenModalEditSubject}
                handleClose={() => {
                    setIsOpenModalEditSubject(false);
                    setSelectedCourse(null);
                }}
            >
                <FormAddSubject 
                    isEdit={true}
                    course={selectedCourse}
                    handleClose={() => {
                        setIsOpenModalEditSubject(false);
                        setSelectedCourse(null);
                        fetchCourses();
                    }} 
                />
            </ModalWrapper>

            <ModalWrapper
                open={isOpenModalSyllabus}
                handleClose={() => {
                    setIsOpenModalSyllabus(false);
                    setSelectedCourse(null);
                    setSelectedSyllabuses([]);
                }}
            >
                <FormSyllabus
                    handleClose={() => {
                        setIsOpenModalSyllabus(false);
                        setSelectedCourse(null);
                        setSelectedSyllabuses([]);
                    }}
                    courseCode={selectedCourse?.courseCode || ''}
                    syllabuses={selectedSyllabuses}
                    onSuccess={() => {
                        setIsOpenModalSyllabus(false);
                        setSelectedCourse(null);
                        setSelectedSyllabuses([]);
                        fetchCourses();
                    }}
                    onDelete={handleDeleteSyllabus}
                />
            </ModalWrapper>

            <ModalWrapper
                open={isOpenModalPrerequisites}
                handleClose={() => {
                    setIsOpenModalPrerequisites(false);
                    setSelectedCourse(null);
                }}
            >
                <FormPrerequisites
                    course={selectedCourse}
                    handleClose={() => {
                        setIsOpenModalPrerequisites(false);
                        setSelectedCourse(null);
                    }}
                    onRemovePrerequisite={handleRemovePrerequisite}
                    onSuccess={() => {
                        fetchCourses();
                    }}
                />
            </ModalWrapper>
        </Box>
    );
}
