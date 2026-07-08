import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Sales', icon: <MonetizationOnIcon />, path: '/dashboard/sales' },
    { text: 'Daily Count', icon: <AssessmentIcon />, path: '/dashboard/daily-count' },
    { text: 'Inventory', icon: <InventoryIcon />, path: '/dashboard/inventory' },
  ];

  const bottomItems = [
    { text: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    if (onClose) onClose();
  };

  const renderListItems = (items: typeof menuItems) => {
    return items.map((item) => {
      const isActive = location.pathname === item.path;

      return (
        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderRadius: '10px',
              mx: 1,
              py: 1.25,
              position: 'relative',
              backgroundColor: isActive ? 'rgba(224, 159, 62, 0.15)' : 'transparent',
              borderLeft: isActive ? '4px solid #E09F3E' : '4px solid transparent',
              color: isActive ? '#FAF8F5' : '#C4A9AA',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                color: '#FFFFFF',
                '& .MuiListItemIcon-root': {
                  color: '#FAF8F5',
                },
              },
              transition: 'all 0.2s',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: '40px',
                color: isActive ? '#E09F3E' : '#947274',
                transition: 'color 0.2s',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.95rem',
                  }}
                >
                  {item.text}
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      );
    });
  };

  return (
    <Box
      sx={{
        width: 260,
        height: '100%',
        backgroundColor: '#330F11', // Dark Mahogany
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        py: 3,
        boxShadow: '4px 0px 24px rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* Brand Logo Header */}
      <Box sx={{ px: 3, mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 900,
            letterSpacing: '0.08em',
            color: '#FAF8F5',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <span style={{ color: '#E09F3E' }}>Chai</span>Track ☕
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontFamily: '"Outfit", sans-serif',
            color: '#E09F3E',
            fontWeight: 700,
            letterSpacing: '0.12em',
            fontSize: '0.65rem',
            display: 'block',
            mt: 0.5,
          }}
        >
          TEA SHOP POS
        </Typography>
      </Box>

      {/* Main Menu Items */}
      <Box sx={{ flexGrow: 1, px: 1 }}>
        <List>{renderListItems(menuItems)}</List>
      </Box>

      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', my: 2 }} />

      {/* Settings & Logout Bottom Items */}
      <Box sx={{ px: 1 }}>
        <List>
          {renderListItems(bottomItems)}
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: '10px',
                mx: 1,
                py: 1.25,
                color: '#C4A9AA',
                '&:hover': {
                  backgroundColor: 'rgba(192, 57, 43, 0.08)',
                  color: '#E74C3C',
                  '& .MuiListItemIcon-root': {
                    color: '#E74C3C',
                  },
                },
                transition: 'all 0.2s',
              }}
            >
              <ListItemIcon sx={{ minWidth: '40px', color: '#947274' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 500,
                      fontSize: '0.95rem',
                    }}
                  >
                    Logout
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};
