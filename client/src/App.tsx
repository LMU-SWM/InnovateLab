import React, { useEffect } from "react";
import {
  BrowserRouter,
  Link as RouterLink,
  Route,
  Routes,
} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import NewBookingPage from "./pages/NewBookingPage";
import ManageBookingPage from "./pages/ManageBookingPage";
import AdminPage from "./pages/AdminPage";
import PublicEventsPage from "./pages/PublicEventsPage";
import Layout from "./layouts/BaseLayout";
import logoImage from "./images/image.png";
import "./App.css";

const handleScroll = () => {
  const appBar = document.getElementById("appBar");
  if (appBar) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 0) {
      appBar.style.backgroundColor = "#49be25";
    } else {
      appBar.style.backgroundColor = "#2596be";
    }
  }
};

function App() {
  const { isAuthenticated, logout } = useAuth0();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const navigateToIndexPage = () => {
    window.location.href = "http://localhost:3000/InnovateLab/home/index.html";
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Container maxWidth="xl" sx={{ p: "0px !important" }}>
      <BrowserRouter basename="/react-auth0">
        <AppBar position="fixed" id="appBar">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <img
                src="http://localhost:3000/InnovateLab/images/image.png"
                alt="Logo"
                style={{
                  marginRight: "2px",
                  display: "flex",
                  height: "50px", // Set the desired height
                  width: "auto", // Let the width adjust automatically
                }}
              />
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
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {!isAuthenticated && (
                    <MenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = "/manage-booking";
                      }}
                    >
                      <Typography textAlign="center">
                        <Button>Manage Booking</Button>
                      </Typography>
                    </MenuItem>
                  )}
                  {!isAuthenticated && (
                    <MenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = "/new-booking";
                      }}
                    >
                      <Typography textAlign="center">
                        <Button>My Calendar</Button>
                      </Typography>
                    </MenuItem>
                  )}
                  {!isAuthenticated && (
                    <MenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = "/new-booking";
                      }}
                    >
                      <Typography textAlign="center">
                        <Button>New Booking</Button>
                      </Typography>
                    </MenuItem>
                  )}

                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">
                      <Button component={RouterLink} to="/signIn">
                        Sign In
                      </Button>
                    </Typography>
                  </MenuItem>

                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">
                      <Button onClick={navigateToIndexPage}>Home</Button>
                    </Typography>
                  </MenuItem>
                  {isAuthenticated && (
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">
                        <Button component={RouterLink} to="/profile">
                          Profile
                        </Button>
                      </Typography>
                    </MenuItem>
                  )}
                  {isAuthenticated && (
                    <MenuItem
                      onClick={() => {
                        handleCloseNavMenu();
                        logout({
                          returnTo: window.location.origin + "/react-auth0",
                        });
                      }}
                    >
                      <Typography textAlign="center">
                        <Button>Sign Out</Button>
                      </Typography>
                    </MenuItem>
                  )}
                </Menu>
              </Box>
              <img
                src="http://localhost:3000/InnovateLab/images/image.png"
                alt="Logo"
                style={{
                  marginRight: "2px",
                  display: "none", // Change to 'flex' for md breakpoint
                }}
              />
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", md: "flex" },
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  onClick={navigateToIndexPage}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Home
                </Button>
                {!isAuthenticated && (
                <Button
                    component={RouterLink}
                    to="/signIn"
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    Sign In
                  </Button>
                )}
                {isAuthenticated && (
                  <Button
                    component={RouterLink}
                    to="/profile"
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    Profile
                  </Button>
                )}
                {isAuthenticated && (
                  <Button
                    component={RouterLink}
                    to="/new-booking"
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    New booking
                  </Button>
                )}
                {isAuthenticated && (
                  <Button
                    component={RouterLink}
                    to="/manage-booking"
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    Manage booking
                  </Button>
                )}
                {isAuthenticated && (
                  <Button
                    onClick={() => {
                      logout({
                        returnTo: window.location.origin + "/react-auth0",
                      });
                    }}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    Sign Out
                  </Button>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/new-booking" element={<NewBookingPage />} />
            <Route path="/manage-booking" element={<ManageBookingPage />} />
            <Route path="/adminPage" element={<AdminPage />} />
            <Route path="/publicEventsPage" element={<PublicEventsPage />} />
            <Route path="*" element={<SignIn />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
