import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  TextField, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton,
  Typography,
  Paper
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  Search as SearchIcon,
  Visibility as VisibilityIcon 
} from '@mui/icons-material';
import { createCourseSyllabus, getAllCourseSyllabuses, updateCourseSyllabus, deleteCourseSyllabus } from '../../api/api';
import { useNavigate } from 'react-router-dom';

interface CourseSyllabus {
  syllabusId: string;
  syllabusContent: string;
  theory: number;
  practice: number;
  credit: number;
  status: number;
  evaluationComponents: {
    id: string;
    componentName: string;
    ratio: number;
  };
  courseResponse: {
    courseCode: string;
    courseName: string;
    credits: number;
    description: string;
    status: number;
  };
  createAt: string;
  updateAt: string;
}

const CourseSyllabus: React.FC = () => {
  const [syllabuses, setSyllabuses] = useState<CourseSyllabus[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedSyllabus, setSelectedSyllabus] = useState<CourseSyllabus | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSyllabuses();
  }, []);

  const fetchSyllabuses = async () => {
    try {
      setLoading(true);
      const response = await getAllCourseSyllabuses();
      setSyllabuses(response.data);
    } catch (error) {
      console.error('Failed to fetch syllabuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleAdd = () => {
    setEditingId(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record: CourseSyllabus) => {
    setEditingId(record.syllabusId);
    setSelectedSyllabus(record);
    setIsModalVisible(true);
  };

  const handleViewDetails = (record: CourseSyllabus) => {
    setSelectedSyllabus(record);
    setIsDetailModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCourseSyllabus(id);
      fetchSyllabuses();
    } catch (error) {
      console.error('Failed to delete syllabus:', error);
    }
  };

  const handleModalOk = async () => {
    try {
      if (editingId) {
        await updateCourseSyllabus(editingId, selectedSyllabus!);
      } else {
        await createCourseSyllabus(selectedSyllabus!);
      }
      setIsModalVisible(false);
      fetchSyllabuses();
    } catch (error) {
      console.error('Failed to save syllabus:', error);
    }
  };

  const columns = [
    {
      title: 'Syllabus ID',
      field: 'syllabusId',
    },
    {
      title: 'Content',
      field: 'syllabusContent',
    },
    {
      title: 'Theory',
      field: 'theory',
    },
    {
      title: 'Practice',
      field: 'practice',
    },
    {
      title: 'Credit',
      field: 'credit',
    },
    {
      title: 'Status',
      field: 'status',
      render: (rowData: CourseSyllabus) => rowData.status === 1 ? 'Active' : 'Inactive'
    },
    {
      title: 'Actions',
      field: 'actions',
      render: (rowData: CourseSyllabus) => (
        <Box>
          <IconButton 
            color="primary" 
            onClick={() => handleViewDetails(rowData)}
            title="View"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton 
            color="primary" 
            onClick={() => handleEdit(rowData)}
            title="Edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            color="error" 
            onClick={() => handleDelete(rowData.syllabusId)}
            title="Delete"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const filteredSyllabuses = syllabuses.filter(syllabus => {
    const matchesSearch = syllabus.syllabusContent.toLowerCase().includes(searchText.toLowerCase());
    const isActive = syllabus.status === 1;
    return matchesSearch && isActive;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Search by content"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          size="small"
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Syllabus
        </Button>
      </Box>

      <Paper>
        <Table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.field}>{column.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSyllabuses.map((syllabus) => (
              <tr key={syllabus.syllabusId}>
                {columns.map((column) => (
                  <td key={column.field}>
                    {column.render ? column.render(syllabus) : syllabus[column.field as keyof CourseSyllabus]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Paper>

      <Dialog open={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <DialogTitle>{editingId ? 'Edit Syllabus' : 'Add Syllabus'}</DialogTitle>
        <DialogContent>
          {/* Form fields will go here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
          <Button onClick={handleModalOk} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={isDetailModalVisible} 
        onClose={() => setIsDetailModalVisible(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Syllabus Details</DialogTitle>
        <DialogContent>
          {selectedSyllabus && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="div">Syllabus ID</Typography>
                <Typography component="div">{selectedSyllabus.syllabusId}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="div">Content</Typography>
                <Typography component="div">{selectedSyllabus.syllabusContent}</Typography>
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <Box>
                  <Typography variant="h6" component="div">Theory</Typography>
                  <Typography component="div">{selectedSyllabus.theory}</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" component="div">Practice</Typography>
                  <Typography component="div">{selectedSyllabus.practice}</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" component="div">Credit</Typography>
                  <Typography component="div">{selectedSyllabus.credit}</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" component="div">Status</Typography>
                  <Typography component="div">{selectedSyllabus.status === 1 ? 'Active' : 'Inactive'}</Typography>
                </Box>
              </Box>

              {selectedSyllabus.evaluationComponents && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" component="div">Evaluation Components</Typography>
                  <Typography component="div">Component Name: {selectedSyllabus.evaluationComponents.componentName}</Typography>
                  <Typography component="div">Ratio: {selectedSyllabus.evaluationComponents.ratio}%</Typography>
                </Box>
              )}

              {selectedSyllabus.courseResponse && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" component="div">Course</Typography>
                  <Typography component="div">Course Code: {selectedSyllabus.courseResponse.courseCode}</Typography>
                  <Typography component="div">Course Name: {selectedSyllabus.courseResponse.courseName}</Typography>
                  <Typography component="div">Credits: {selectedSyllabus.courseResponse.credits}</Typography>
                  <Typography component="div">Description: {selectedSyllabus.courseResponse.description}</Typography>
                </Box>
              )}

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="div">Created At</Typography>
                <Typography component="div">{new Date(selectedSyllabus.createAt).toLocaleString()}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="div">Updated At</Typography>
                <Typography component="div">{new Date(selectedSyllabus.updateAt).toLocaleString()}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDetailModalVisible(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseSyllabus; 