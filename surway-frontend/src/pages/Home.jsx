import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Modal, TextField, MenuItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

const surveyOptions = [
  { value: 'blank', label: 'Create a blank survey project' },
  { value: 'import_qsf', label: 'Import a QSF file' },
  { value: 'copy_existing', label: 'Copy a survey from an existing project' },
  { value: 'use_library', label: 'Use a survey from your library' },
];

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'new', label: 'New' },
  { value: 'closed', label: 'Closed' },
];

const theme = createTheme({
  palette: {
    primary: {
      main: '#a1dac8', // Custom primary color
    },
  },
});

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [openModal, setOpenModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', folder: '', surveyType: '' });

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await axios.get('https://surway-backend.onrender.com/api/projects');
      setProjects(response.data);
    };
    fetchProjects();
  }, []);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleCreateProject = async () => {
    const newProjectObj = {
      name: newProject.name || 'Untitled Project',
      status: 'New',
      responses: [],
      lastModified: new Date().toISOString().split('T')[0],
      creationDate: new Date().toISOString().split('T')[0],
    };
    const response = await axios.post('https://surway-backend.onrender.com/api/projects', newProjectObj);
    setProjects([...projects, response.data]);
    handleCloseModal();
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesFilter = filter === 'all' || project.status.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`https://surway-backend.onrender.com/api/projects/${id}`);
        setProjects((prevProjects) => prevProjects.filter((project) => project._id !== id));
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography variant="h4">My Projects</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Search Projects"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            />
            <TextField
              select
              label="Status"
              variant="outlined"
              size="small"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                minWidth: '100px',
              }}
            >
              {filterOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" color="primary" onClick={handleOpenModal}>
              Create Project
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 2fr 2fr 1fr auto', // Adjusted column widths
            gap: 1,
            p: 1,
            bgcolor: 'primary.main',
            color: 'white',
            minHeight: '50px',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Project Name</Typography>
          <Typography sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Status</Typography>
          <Typography sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Responses</Typography>
          <Typography sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Last Modified</Typography>
          <Typography sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Creation Date</Typography>
          <Typography sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Actions</Typography>
          <Typography sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}></Typography>
        </Box>

        {filteredProjects.map((project) => (
          <Box
            key={project.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 2fr 2fr 1fr auto',
              gap: 1,
              alignItems: 'center',
              bgcolor: 'grey.200',
              p: 1,
              minHeight: '50px',
            }}
          >
            <Typography sx={{ textAlign: 'center' }}>{project.name}</Typography>
            <Typography sx={{ textAlign: 'center' }}>{project.status}</Typography>
            <Typography sx={{ textAlign: 'center' }}>{project.responses.length}</Typography>
            <Typography sx={{ textAlign: 'center' }}>{project.lastModified}</Typography>
            <Typography sx={{ textAlign: 'center' }}>{project.creationDate}</Typography>

            <Button
              component={Link}
              to={`/survey-builder/${project._id}`}
              state={{ projectName: project.name }}
              variant="contained"
              color="primary"
              sx={{
                height: '30px',
                px: 2,
                fontSize: '0.85rem',
                textAlign: 'center',
              }}
            >
              Open Project
            </Button>
            <IconButton
              sx={{
                bgcolor: '#a1dac8',
                color: 'white',
                '&:hover': {
                  bgcolor: '#8ccab3',
                },
              }}
              onClick={() => handleDeleteProject(project._id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 400 },
              bgcolor: 'background.paper',
              p: { xs: 2, sm: 4 },
              boxShadow: 24,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Create New Project
            </Typography>

            <Typography variant="body1" gutterBottom>
              Project Name
            </Typography>
            <TextField
              placeholder="Untitled Project"
              fullWidth
              sx={{ mb: 2 }}
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              InputProps={{
                style: { backgroundColor: 'lightgray', color: 'black' },
              }}
            />

            <Typography variant="body1" gutterBottom>
              How do you want to start the survey?
            </Typography>
            <TextField
              select
              fullWidth
              sx={{ mb: 2 }}
              value={newProject.surveyType}
              onChange={(e) => setNewProject({ ...newProject, surveyType: e.target.value })}
              InputProps={{
                style: { backgroundColor: 'lightgray', color: 'black' },
              }}
            >
              {surveyOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <Button variant="contained" color="primary" fullWidth onClick={handleCreateProject}>
              Create
            </Button>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default Home;
