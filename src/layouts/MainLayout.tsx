import React from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 260;

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FFFDF9' }}>
      {/* AppBar Header */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid rgba(224, 159, 62, 0.12)',
          color: '#330F11',
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
          {/* Menu Toggle for Mobile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Box>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 800,
                  color: '#330F11',
                  fontSize: { xs: '1.05rem', sm: '1.25rem' },
                }}
              >
                Welcome Back, {user?.name || 'Admin'} ☕
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  color: '#6E4F51',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {getFormattedDate()}
              </Typography>
            </Box>
          </Box>

          {/* User Profile Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 700,
                  color: '#330F11',
                  lineHeight: 1.2,
                }}
              >
                {user?.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  color: '#E09F3E',
                  fontWeight: 600,
                }}
              >
                {user?.role ? user.role.toUpperCase() : 'MANAGER'}
              </Typography>
            </Box>
            <Avatar
              alt={user?.name}
              src=""
              sx={{
                width: 40,
                height: 40,
                backgroundColor: '#9E2A2B',
                color: '#FFFFFF',
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 700,
                boxShadow: '0 4px 10px rgba(158, 42, 43, 0.25)',
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Mobile Viewport Sidebar Drawer */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                borderRight: 'none',
              },
            }}
          >
            <Sidebar onClose={handleDrawerToggle} />
          </Drawer>
        ) : (
          /* Desktop Viewport Sidebar Drawer */
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                borderRight: 'none',
              },
            }}
            open
          >
            <Sidebar />
          </Drawer>
        )}
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, sm: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          overflowX: 'hidden',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
