import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppBar, Tabs, Tab, Toolbar, Typography, Box } from '@mui/material';

const ScrollableTabs = () => {
  const { id } = useParams();  // Get project ID from the URL
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState(() => {
    // Initialize tab state based on the current path
    const path = window.location.pathname;
    if (path.includes('/distributions')) return 1;
    if (path.includes('/data-analysis')) return 2;
    if (path.includes('/results')) return 3;
    if (path.includes('/reports')) return 4;
    return 0; // Default to Survey
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    switch (newValue) {
      case 0:
        navigate(`/survey-builder/${id}`);
        break;
      case 1:
        navigate(`/survey-builder/${id}/distributions`);
        break;
      case 2:
        navigate(`/survey-builder/${id}/data-analysis`);
        break;
      case 3:
        navigate(`/survey-builder/${id}/results`);
        break;
      case 4:
        navigate(`/survey-builder/${id}/reports`);
        break;
      default:
        navigate(`/survey-builder/${id}`);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" noWrap>
            Project ID: {id}
          </Typography>
        </Toolbar>
      </AppBar> */}
      <AppBar position="static" color="default">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Survey" />
          <Tab label="Distributions" />
          <Tab label="Data and Analysis" />
          <Tab label="Results" />
          <Tab label="Reports" />
        </Tabs>
      </AppBar>
    </Box>
  );
};

export default ScrollableTabs;
