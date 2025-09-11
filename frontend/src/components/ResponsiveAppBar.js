import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Avatar,
  Typography,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SecurityIcon from '@mui/icons-material/Security';
import { Link, useNavigate } from 'react-router-dom';

function ResponsiveAppBar({ isLoggedIn, handleLogout }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle drawer open state
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // Navigation items - add all tabs here
  const navItems = [
    { label: 'Home', path: '/home' },
    { label: 'Notifications', path: '/notifications' },
    { label: 'Report', path: '/report' },
    { label: 'My Incidents', path: '/my-incidents' },
    { label: 'Emergency Contacts', path: '/emergency-contacts' },
    { label: 'Safety Resources', path: '/resources' },
    { label: 'Profile', path: '/profile' },
  ];

  // Drawer list content
  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.label} onClick={() => navigate(item.path)}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <Divider />
        <ListItem button onClick={handleLogout}>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          width: '100vw',
          left: 0,
          background: 'rgba(255,255,255,0.35)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          borderBottom: '1px solid rgba(255,255,255,0.18)',
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          {/* Left side: Logo */}
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              mr: 2,
              width: 44,
              height: 44,
              boxShadow: '0 2px 12px #6a82fb55',
            }}
          >
            <SecurityIcon fontSize="large" />
          </Avatar>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to={isLoggedIn ? '/home' : '/'}
            sx={{
              flexGrow: 1,
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '1.3rem',
              letterSpacing: '0.08em',
              textDecoration: 'none',
            }}
          >
            Vigilant
          </Typography>

          {/* Desktop nav buttons */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {!isLoggedIn ? (
              <>
                <Button component={Link} to="/register" color="primary">
                  Register
                </Button>
                <Button component={Link} to="/login" color="secondary">
                  Login
                </Button>
              </>
            ) : (
              <>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    component={Link}
                    to={item.path}
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {item.label}
                  </Button>
                ))}
                {/* Logout button */}
                <Button
                  color="secondary"
                  sx={{
                    fontWeight: 700,
                    borderRadius: 20,
                    background: 'linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%)',
                    color: '#fff',
                    px: 3,
                    boxShadow: '0 2px 16px #fc5c7d33',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
                    },
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </Box>

          {/* Mobile hamburger menu */}
          {isLoggedIn && (
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="end"
              onClick={toggleDrawer(true)}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </>
  );
}

export default ResponsiveAppBar;
