import React from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Fade,
  InputAdornment,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import KeyIcon from '@mui/icons-material/Key';
import { useLoginForm } from '../hooks/useLoginForm';
import { Captcha } from '../components/common/Captcha';

export const LoginPage: React.FC = () => {
  const {
    formData,
    formErrors,
    isSubmitLoading,
    customError,
    handleInputChange,
    handleFormSubmit,
    setGeneratedCaptcha,
    autofillDemo,
  } = useLoginForm();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 10% 20%, rgba(224, 159, 62, 0.06) 0%, rgba(255, 253, 249, 1) 90%)',
        position: 'relative',
        overflow: 'hidden',
        px: 2,
      }}
    >
      {/* Global CSS animation injections */}
      <style>{`
        @keyframes steam {
          0% { transform: translateY(0) scaleY(1); opacity: 0.2; }
          50% { transform: translateY(-5px) scaleY(1.2); opacity: 0.8; }
          100% { transform: translateY(-10px) scaleY(0.8); opacity: 0; }
        }
      `}</style>

      {/* Decorative Blur Blobs in Burgundy & Gold */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'rgba(158, 42, 43, 0.08)',
          filter: 'blur(80px)',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '15%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'rgba(224, 159, 62, 0.06)',
          filter: 'blur(90px)',
          zIndex: 1,
        }}
      />

      <Fade in timeout={800}>
        <Card
          sx={{
            width: '100%',
            maxWidth: '1024px',
            minHeight: '620px',
            display: 'flex',
            zIndex: 10,
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(224, 159, 62, 0.2)',
            boxShadow: '0px 24px 64px rgba(110, 27, 28, 0.05)',
          }}
        >
          <Grid container sx={{ flex: 1 }}>
            {/* Left Column: Brand Graphic Showcase (Hidden on Mobile) */}
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 5,
                background: 'linear-gradient(135deg, #9E2A2B 0%, #541314 100%)',
                color: '#FFFFFF',
                position: 'relative',
              }}
            >
              {/* Minimalist Watermark Shapes */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '-10%',
                  left: '-10%',
                  width: '250px',
                  height: '250px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.03)',
                }}
              />

              {/* Logo / Title */}
              <Box sx={{ zIndex: 2 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    color: '#FAF8F5',
                  }}
                >
                  <span style={{ color: '#E09F3E' }}>Chai</span>Track
                </Typography>
                <Typography variant="caption" sx={{ color: '#E09F3E', fontWeight: 700, letterSpacing: '0.15em', display: 'block', mt: 0.5 }}>
                  TRACK EVERY SIP • MANAGE EVERY SALE
                </Typography>
              </Box>

              {/* Central Premium Graphic Illustration */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  my: 'auto',
                  zIndex: 2,
                }}
              >
                {/* Decorative Visual Circle */}
                <Box
                  sx={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    border: '1px dashed rgba(255, 255, 255, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {/* Glowing Saucer Circle */}
                  <Box
                    sx={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(224,159,62,0.15) 0%, rgba(255,255,255,0.02) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* Stylized Tea Glass + Leaf Symbol */}
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Animated Steam Wave Paths */}
                      <Box sx={{ display: 'flex', gap: '8px', mb: '10px', height: '22px' }}>
                        {[1, 2, 3].map((i) => (
                          <Box
                            key={i}
                            sx={{
                              width: '3px',
                              height: '14px',
                              backgroundColor: '#E09F3E',
                              borderRadius: '2px',
                              animation: 'steam 2s infinite ease-in-out',
                              animationDelay: `${i * 0.4}s`,
                            }}
                          />
                        ))}
                      </Box>
                      
                      {/* Stylized Tea Glass */}
                      <Box
                        sx={{
                          width: '64px',
                          height: '76px',
                          border: '3px solid #FAF8F5',
                          borderRadius: '8px 8px 24px 24px',
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255, 255, 255, 0.08)',
                          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                          // Golden Leaf Inside
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            width: '24px',
                            height: '24px',
                            backgroundColor: '#E09F3E',
                            borderTopLeftRadius: '16px',
                            borderBottomRightRadius: '16px',
                            transform: 'rotate(-45deg)',
                            boxShadow: '0 4px 12px rgba(224, 159, 62, 0.4)',
                          }
                        }}
                      />
                      
                      {/* Gold Base/Saucer */}
                      <Box
                        sx={{
                          width: '84px',
                          height: '6px',
                          backgroundColor: '#E09F3E',
                          borderRadius: '3px',
                          mt: '8px',
                          boxShadow: '0 4px 10px rgba(224, 159, 62, 0.3)',
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Ring Accents */}
                  <Box
                    sx={{
                      position: 'absolute',
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  />
                </Box>

                <Typography variant="h5" sx={{ mt: 4, textAlign: 'center', fontWeight: 800, fontFamily: '"Outfit", sans-serif', letterSpacing: '0.02em' }}>
                  ChaiTrack POS
                </Typography>
                <Typography variant="body2" sx={{ mt: 1.5, textAlign: 'center', color: '#FAF8F5', maxWidth: '300px', fontWeight: 500, fontFamily: '"Outfit", sans-serif', opacity: 0.9 }}>
                  Track Every Sip, Manage Every Sale.
                </Typography>
              </Box>

              {/* Footer Credentials Info */}
              <Box sx={{ zIndex: 2 }}>
                <Typography variant="caption" sx={{ color: '#FAF8F5', fontFamily: '"Outfit", sans-serif', opacity: 0.7 }}>
                  Copyright © 2026 ChaiTrack. All Rights Reserved.
                </Typography>
              </Box>
            </Grid>

            {/* Right Column: Interactive Login controls */}
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: { xs: 4, sm: 6 },
              }}
            >
              {/* Responsive Header for Mobile view */}
              <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4, textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 900,
                    color: '#9E2A2B',
                    letterSpacing: '0.04em',
                  }}
                >
                  <span style={{ color: '#E09F3E' }}>Chai</span>Track
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontFamily: '"Outfit", sans-serif', letterSpacing: '0.05em' }}>
                  TRACK EVERY SIP • MANAGE EVERY SALE
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 900,
                    color: '#330F11',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5, fontFamily: '"Outfit", sans-serif' }}>
                  Sign in with credentials to access your ChaiTrack dashboard.
                </Typography>
              </Box>

              {/* Form Submission */}
              <form onSubmit={handleFormSubmit} noValidate>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  
                  {/* Display Errors */}
                  {customError && (
                    <Fade in>
                      <Alert severity="error" sx={{ borderRadius: '12px' }}>
                        {customError}
                      </Alert>
                    </Fade>
                  )}

                  {/* Email Input */}
                  <TextField
                    id="login-email"
                    name="email"
                    label="Email Address"
                    type="email"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    disabled={isSubmitLoading}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: formErrors.email ? '#C0392B' : '#E09F3E' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  {/* Password Input */}
                  <TextField
                    id="login-password"
                    name="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    disabled={isSubmitLoading}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: formErrors.password ? '#C0392B' : '#E09F3E' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  {/* Custom Captcha Panel */}
                  <Box sx={{ mt: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        fontWeight: 700,
                        color: '#6E4F51',
                        mb: 1,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        fontFamily: '"Outfit", sans-serif',
                      }}
                    >
                      Security Challenge
                    </Typography>
                    
                    <Captcha onCodeGenerated={setGeneratedCaptcha} />

                    <TextField
                      id="login-captcha-input"
                      name="captchaInput"
                      label="Enter Captcha Code"
                      type="text"
                      variant="outlined"
                      fullWidth
                      required
                      sx={{ mt: 1.5 }}
                      value={formData.captchaInput}
                      onChange={handleInputChange}
                      error={!!formErrors.captchaInput}
                      helperText={formErrors.captchaInput}
                      disabled={isSubmitLoading}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <ShieldIcon sx={{ color: formErrors.captchaInput ? '#C0392B' : '#E09F3E' }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={isSubmitLoading}
                    sx={{
                      height: '52px',
                      mt: 1.5,
                      position: 'relative',
                      fontSize: '1rem',
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 700,
                    }}
                  >
                    {isSubmitLoading ? (
                      <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />
                    ) : (
                      'Sign In to ChaiTrack'
                    )}
                  </Button>
                </Box>
              </form>

              {/* Developer Helper Panel */}
              <Box
                sx={{
                  mt: 4,
                  pt: 3,
                  borderTop: '1px dashed rgba(228, 222, 214, 0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography variant="caption" sx={{ color: '#9E2A2B', fontWeight: 600, mb: 1, fontFamily: '"Outfit", sans-serif' }}>
                  💡 Developer Quick Access
                </Typography>
                <Button
                  onClick={autofillDemo}
                  variant="outlined"
                  size="small"
                  startIcon={<KeyIcon />}
                  sx={{
                    color: '#9E2A2B',
                    borderColor: 'rgba(158, 42, 43, 0.4)',
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(158, 42, 43, 0.04)',
                      borderColor: '#9E2A2B',
                    },
                  }}
                >
                  Autofill Admin Credentials
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Fade>
    </Box>
  );
};
