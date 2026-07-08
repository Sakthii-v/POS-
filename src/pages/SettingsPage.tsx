import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  Fade,
  Select,
  MenuItem,
  InputAdornment,
  Divider,
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import TuneIcon from '@mui/icons-material/Tune';
import SecurityIcon from '@mui/icons-material/Security';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

import { MainLayout } from '../layouts/MainLayout';

export const SettingsPage: React.FC = () => {
  // 1. Store Credentials State (persisted via localStorage)
  const [storeName, setStoreName] = useState(() => localStorage.getItem('ct_storeName') || 'ChaiTrack Cafe');
  const [storePhone, setStorePhone] = useState(() => localStorage.getItem('ct_storePhone') || '+91 98765 43210');
  const [storeAddress, setStoreAddress] = useState(() => localStorage.getItem('ct_storeAddress') || 'Plot 12, Saffron Heights, Bengaluru, KA, India');

  // 2. Register & Printer Configuration State
  const [defaultPayment, setDefaultPayment] = useState(() => localStorage.getItem('ct_defaultPayment') || 'Cash');
  const [autoPrint, setAutoPrint] = useState(() => localStorage.getItem('ct_autoPrint') !== 'false');
  const [soundEffects, setSoundEffects] = useState(() => localStorage.getItem('ct_soundEffects') !== 'false');
  const [requirePrompt, setRequirePrompt] = useState(() => localStorage.getItem('ct_requirePrompt') === 'true');

  // 3. Cashier profile
  const [cashierName, setCashierName] = useState(() => localStorage.getItem('ct_cashierName') || 'Quick POS Cashier');
  const [passcode, setPasscode] = useState(() => localStorage.getItem('ct_passcode') || '1088');

  // Toast Alerts State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'info'>('success');

  // Save Config Action
  const handleSaveSettings = () => {
    localStorage.setItem('ct_storeName', storeName);
    localStorage.setItem('ct_storePhone', storePhone);
    localStorage.setItem('ct_storeAddress', storeAddress);
    localStorage.setItem('ct_defaultPayment', defaultPayment);
    localStorage.setItem('ct_autoPrint', String(autoPrint));
    localStorage.setItem('ct_soundEffects', String(soundEffects));
    localStorage.setItem('ct_requirePrompt', String(requirePrompt));
    localStorage.setItem('ct_cashierName', cashierName);
    localStorage.setItem('ct_passcode', passcode);

    setToastMessage('System configurations saved successfully!');
    setToastSeverity('success');
    setShowToast(true);
  };

  // Reset to Defaults
  const handleResetSettings = () => {
    setStoreName('ChaiTrack Cafe');
    setStorePhone('+91 98765 43210');
    setStoreAddress('Plot 12, Saffron Heights, Bengaluru, KA, India');
    setDefaultPayment('Cash');
    setAutoPrint(true);
    setSoundEffects(true);
    setRequirePrompt(false);
    setCashierName('Quick POS Cashier');
    setPasscode('1088');

    setToastMessage('Configurations reset to factory defaults.');
    setToastSeverity('info');
    setShowToast(true);
  };

  return (
    <MainLayout>
      <Fade in timeout={500}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Header section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 900,
                color: '#330F11',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <SettingsSuggestIcon sx={{ color: '#9E2A2B', fontSize: '2.2rem' }} />
              ChaiTrack System Configuration
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontFamily: '"Outfit", sans-serif' }}>
              Customize register rules, manage active cashier profile, and update store credentials.
            </Typography>
          </Box>

          {/* Grid Layout of Configurations */}
          <Grid container spacing={4}>
            
            {/* Card 1: Store Credentials */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: '16px',
                  border: '1.5px solid rgba(224, 159, 62, 0.12)',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0px 8px 32px rgba(110, 27, 28, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <StoreIcon sx={{ color: '#E09F3E', fontSize: '1.75rem' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#330F11' }}>
                      Store Information
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ fontFamily: '"Outfit", sans-serif' }}>
                      Configures details for drawer summaries and receipt headers
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ borderStyle: 'dashed', opacity: 0.6 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    label="Cafe Store Name"
                    fullWidth
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#FFFDF9' },
                      '& .MuiInputLabel-root': { fontFamily: '"Outfit", sans-serif' },
                    }}
                  />
                  <TextField
                    label="Contact Hotline"
                    fullWidth
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: '#E09F3E', fontSize: '1.2rem' }} />
                          </InputAdornment>
                        ),
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#FFFDF9' },
                      '& .MuiInputLabel-root': { fontFamily: '"Outfit", sans-serif' },
                    }}
                  />
                  <TextField
                    label="Store Address Location"
                    fullWidth
                    multiline
                    rows={2}
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                            <HomeIcon sx={{ color: '#E09F3E', fontSize: '1.2rem' }} />
                          </InputAdornment>
                        ),
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#FFFDF9' },
                      '& .MuiInputLabel-root': { fontFamily: '"Outfit", sans-serif' },
                    }}
                  />
                </Box>
              </Card>
            </Grid>

            {/* Card 2: Cashier & Security Profile */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: '16px',
                  border: '1.5px solid rgba(224, 159, 62, 0.12)',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0px 8px 32px rgba(110, 27, 28, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <SecurityIcon sx={{ color: '#9E2A2B', fontSize: '1.75rem' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#330F11' }}>
                      Cashier & Security Settings
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ fontFamily: '"Outfit", sans-serif' }}>
                      Set identity parameters and register security keys
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ borderStyle: 'dashed', opacity: 0.6 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    label="Active Teller Name"
                    fullWidth
                    value={cashierName}
                    onChange={(e) => setCashierName(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon sx={{ color: '#9E2A2B', fontSize: '1.2rem' }} />
                          </InputAdornment>
                        ),
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#FFFDF9' },
                      '& .MuiInputLabel-root': { fontFamily: '"Outfit", sans-serif' },
                    }}
                  />
                  <TextField
                    label="Register Passcode"
                    type="password"
                    fullWidth
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#FFFDF9' },
                      '& .MuiInputLabel-root': { fontFamily: '"Outfit", sans-serif' },
                    }}
                  />

                  {/* Non-editable system configurations details */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      backgroundColor: 'rgba(224, 159, 62, 0.06)',
                      border: '1px solid rgba(224, 159, 62, 0.15)',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#330F11', mb: 0.5 }}>
                      System Status Roles
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontFamily: '"Outfit", sans-serif', color: '#6E5D57' }}>
                      <span>Active Role:</span>
                      <span style={{ fontWeight: 700, color: '#2D6A4F' }}>STORE MANAGER</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontFamily: '"Outfit", sans-serif', color: '#6E5D57', marginTop: '4px' }}>
                      <span>Database Engine:</span>
                      <span style={{ fontWeight: 700 }}>LocalSession IndexedDB</span>
                    </div>
                  </Box>
                </Box>
              </Card>
            </Grid>

            {/* Card 3: Register Rules */}
            <Grid size={{ xs: 12 }}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  border: '1.5px solid rgba(224, 159, 62, 0.12)',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0px 8px 32px rgba(110, 27, 28, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <TuneIcon sx={{ color: '#2D6A4F', fontSize: '1.75rem' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#330F11' }}>
                      Register & Print Rules
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ fontFamily: '"Outfit", sans-serif' }}>
                      Toggle POS terminal checkout defaults and interface notifications
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ borderStyle: 'dashed', opacity: 0.6 }} />

                <Grid container spacing={3}>
                  
                  {/* Select Payment Mode */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontSize: '0.85rem', fontWeight: 750, color: '#6E5D57' }}>
                        Default Billing Payment Type:
                      </Typography>
                      <Select
                        value={defaultPayment}
                        onChange={(e) => setDefaultPayment(e.target.value)}
                        size="small"
                        sx={{
                          borderRadius: '10px',
                          backgroundColor: '#FFFDF9',
                          fontFamily: '"Outfit", sans-serif',
                        }}
                      >
                        <MenuItem value="Cash" sx={{ fontFamily: '"Outfit", sans-serif' }}>💵 Cash Payment Mode</MenuItem>
                        <MenuItem value="UPI" sx={{ fontFamily: '"Outfit", sans-serif' }}>📱 UPI Payment Mode</MenuItem>
                      </Select>
                    </Box>
                  </Grid>

                  {/* Switch Rules Grid */}
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Grid container spacing={2}>
                      
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={autoPrint}
                              onChange={(e) => setAutoPrint(e.target.checked)}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#2D6A4F' },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2D6A4F' },
                              }}
                            />
                          }
                          label={
                            <Box sx={{ ml: 0.5 }}>
                              <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#330F11' }}>
                                Automatic Receipt Print
                              </Typography>
                              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', fontFamily: '"Outfit", sans-serif' }}>
                                Print ticket immediately upon order checkouts
                              </Typography>
                            </Box>
                          }
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={soundEffects}
                              onChange={(e) => setSoundEffects(e.target.checked)}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#2D6A4F' },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2D6A4F' },
                              }}
                            />
                          }
                          label={
                            <Box sx={{ ml: 0.5 }}>
                              <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#330F11' }}>
                                Play Alert Sounds
                              </Typography>
                              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', fontFamily: '"Outfit", sans-serif' }}>
                                Hear audio ticks when modifying cart quantity values
                              </Typography>
                            </Box>
                          }
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={requirePrompt}
                              onChange={(e) => setRequirePrompt(e.target.checked)}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#2D6A4F' },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2D6A4F' },
                              }}
                            />
                          }
                          label={
                            <Box sx={{ ml: 0.5 }}>
                              <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#330F11' }}>
                                Confirm Order Dialog
                              </Typography>
                              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', fontFamily: '"Outfit", sans-serif' }}>
                                Require double validation before posting sale
                              </Typography>
                            </Box>
                          }
                        />
                      </Grid>

                    </Grid>
                  </Grid>

                </Grid>
              </Card>
            </Grid>

          </Grid>

          {/* Action Row Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
            <Button
              variant="outlined"
              onClick={handleResetSettings}
              sx={{
                borderRadius: '10px',
                borderColor: '#E5DEDC',
                color: '#6E5D57',
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 700,
                px: 4,
                py: 1.25,
                '&:hover': {
                  borderColor: '#6E5D57',
                  backgroundColor: 'rgba(110, 93, 87, 0.05)',
                },
              }}
            >
              Reset Defaults
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveSettings}
              sx={{
                borderRadius: '10px',
                backgroundColor: '#9E2A2B',
                color: '#FFFFFF',
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 750,
                px: 5,
                py: 1.25,
                boxShadow: '0px 6px 16px rgba(158, 42, 43, 0.2)',
                '&:hover': {
                  backgroundColor: '#7A1C1D',
                  boxShadow: '0px 8px 20px rgba(158, 42, 43, 0.3)',
                },
              }}
            >
              Save Configurations 💾
            </Button>
          </Box>
        </Box>
      </Fade>

      {/* Configurations Alert success notifications */}
      <Snackbar
        open={showToast}
        autoHideDuration={4000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setShowToast(false)}
          severity={toastSeverity}
          sx={{
            width: '100%',
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 650,
            borderRadius: '12px',
            backgroundColor: toastSeverity === 'success' ? '#2D6A4F' : '#2980B9',
            color: '#FFFFFF',
            '& .MuiAlert-icon': {
              color: '#FFFFFF',
            },
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};
