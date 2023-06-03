import React from 'react';
import { Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

interface ToolbarComponentProps {
  isAuthenticated: boolean;
  handleOpenNavMenu: () => void;
  handleCloseNavMenu: () => void;
  logout: (options?: any) => void;
}

const ToolbarComponent: React.FC<ToolbarComponentProps> = ({
  isAuthenticated,
  handleOpenNavMenu,
  handleCloseNavMenu,
  logout,
}) => {
  return (
    <Toolbar disableGutters>
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
      >
        React Auth0
      </Typography>
      <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        {/* Rest of the menu code */}
      </Box>
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
      >
        React Auth0
      </Typography>
      <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
        <Button
          onClick={(e) => {
            e.preventDefault();
            window.location.href = "http://localhost:4040/";
          }}
          sx={{ my: 2, color: "white", display: "block" }}
        >
          Booking Application
        </Button>

      </Box>
    </Toolbar>
  );
};

export default ToolbarComponent;
