// import React, { useState } from 'react';
// import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Switch, Divider, Box } from '@mui/material';
// import { Menu as MenuIcon, Home as HomeIcon, AccountCircle as AccountIcon, ExitToApp as LogoutIcon, Brightness4 as BrightnessIcon } from '@mui/icons-material';
// import { Link } from 'react-router-dom';

// const Navbar = ({ toggleDarkMode, isDarkMode, projectName }) => {
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   // Function to toggle the drawer
//   const toggleDrawer = (open) => (event) => {
//     if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
//       return;
//     }
//     setDrawerOpen(open);
//   };

//   // Drawer content
//   const drawerItems = (
//     <div
//       role="presentation"
//       onClick={toggleDrawer(false)}
//       onKeyDown={toggleDrawer(false)}
//     >
//       <List>
//         {/* My Projects */}
//         <ListItem button component={Link} to="/">
//           <ListItemIcon><HomeIcon /></ListItemIcon>
//           <ListItemText primary="My Projects" />
//         </ListItem>

//         {/* My Account */}
//         <ListItem button>
//           <ListItemIcon><AccountIcon /></ListItemIcon>
//           <ListItemText primary="My Account" />
//         </ListItem>

//         {/* Logout */}
//         <ListItem button>
//           <ListItemIcon><LogoutIcon /></ListItemIcon>
//           <ListItemText primary="Logout" />
//         </ListItem>

//         <Divider />

//         {/* Switch Mode */}
//         <ListItem>
//           <ListItemIcon><BrightnessIcon /></ListItemIcon>
//           <ListItemText primary="Switch Mode" />
//           <Switch
//             checked={isDarkMode}
//             onChange={toggleDarkMode}
//             inputProps={{ 'aria-label': 'dark mode switch' }}
//           />
//         </ListItem>
//       </List>
//     </div>
//   );

//   return (
//     <>
//       {/* Navbar AppBar */}
//       <AppBar position="static">
//         <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
//           {/* Logo and Menu */}
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             {/* Logo Image */}
//             <Box
//               component="img"
//               src="/assets/gne-logo.png"  // Replace with the correct path to your logo
//               alt="Logo"
//               sx={{
//                 height: 50, // Adjust the height of the logo as needed
//                 width: 'auto',
//                 borderRadius: '40%', // Maintain aspect ratio
//                 marginRight: 4 // Space between logo and menu icon
//               }}
//             />
//             {/* Menu Icon */}
//             <IconButton
//               edge="start"
//               color="inherit"
//               aria-label="menu"
//               onClick={toggleDrawer(true)}
//             >
//               <MenuIcon />
//             </IconButton>
//           </Box>

          
//           {/* Show Project Name if it exists */}
//           {projectName && (
//             <Typography variant="h6" component="div">
//               {projectName}
//             </Typography>
//           )}

//           {/* Title */}
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//             SURWAY-GNDEC
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       {/* Drawer */}
//       <Drawer
//         anchor="left"
//         open={drawerOpen}
//         onClose={toggleDrawer(false)}
//       >
//         {drawerItems}
//       </Drawer>
//     </>
//   );
// };

// export default Navbar;



import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Switch, Divider, Box } from '@mui/material';
import { Menu as MenuIcon, Home as HomeIcon, AccountCircle as AccountIcon, ExitToApp as LogoutIcon, Brightness4 as BrightnessIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleDarkMode, isDarkMode, projectName }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Function to toggle the drawer
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Drawer content
  const drawerItems = (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {/* My Projects */}
        <ListItem button component={Link} to="/home">
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="My Projects" />
        </ListItem>

        {/* My Account */}
        <ListItem button>
          <ListItemIcon><AccountIcon /></ListItemIcon>
          <ListItemText primary="My Account" />
        </ListItem>

        {/* Logout */}
        <ListItem button>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>

        <Divider />

        {/* Switch Mode */}
        <ListItem>
          <ListItemIcon><BrightnessIcon /></ListItemIcon>
          <ListItemText primary="Switch Mode" />
          <Switch
            checked={isDarkMode}
            onChange={toggleDarkMode}
            inputProps={{ 'aria-label': 'dark mode switch' }}
          />
        </ListItem>
      </List>
    </div>
  );

  return (
    <>
      {/* Navbar AppBar */}
      <AppBar position="static" sx={{ backgroundColor: '#800000' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo and Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Logo Image */}
            <Box
              component="img"
              src="/assets/gne-logo-1.png"  // Replace with the correct path to your logo
              alt="Logo"
              sx={{
                height: 50, // Adjust the height of the logo as needed
                width: 'auto',
                borderRadius: '40%', // Maintain aspect ratio
                marginRight: 4 // Space between logo and menu icon
              }}
            />
            {/* Menu Icon */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Show Project Name if it exists */}
          {projectName && (
            <Typography variant="h6" component="div">
              {projectName}
            </Typography>
          )}

          {/* Title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SURWAY-GNDEC
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerItems}
      </Drawer>
    </>
  );
};

export default Navbar;
