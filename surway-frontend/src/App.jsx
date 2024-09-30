import React, { useState } from 'react';
import { Outlet, useParams,useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';

const App = () => {
  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const projectName = location.state?.projectName || '';

  // Function to toggle dark/light mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Create a theme based on the dark mode state
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Navbar */}
      <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} projectName={projectName} />

      {/* Page Content */}
      <Outlet />
    </ThemeProvider>
  );
};

export default App;
