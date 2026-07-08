import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/system';

const steamAnimation = keyframes`
  0% { transform: translateY(0) scaleX(1); opacity: 0.2; }
  50% { transform: translateY(-8px) scaleX(1.2); opacity: 0.8; }
  100% { transform: translateY(-16px) scaleX(0.8); opacity: 0; }
`;

const pulseCup = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const SteamLine = styled(Box)(({ delay }: { delay: string }) => ({
  width: '3px',
  height: '15px',
  backgroundColor: '#72987B',
  borderRadius: '50%',
  margin: '0 3px',
  animation: `${steamAnimation} 1.8s infinite ease-in-out`,
  animationDelay: delay,
}));

export const PageLoader: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#FAF8F5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      {/* Tea Cup Animation Wrapper */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 3,
        }}
      >
        {/* Steam */}
        <Box sx={{ display: 'flex', justifyContent: 'center', height: '20px', mb: 0.5 }}>
          <SteamLine delay="0s" />
          <SteamLine delay="0.4s" />
          <SteamLine delay="0.8s" />
        </Box>

        {/* Cup Graphic */}
        <Box
          sx={{
            width: '60px',
            height: '45px',
            backgroundColor: '#4A6B53',
            borderBottomLeftRadius: '25px',
            borderBottomRightRadius: '25px',
            position: 'relative',
            animation: `${pulseCup} 2s infinite ease-in-out`,
            // Cup Handle
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '8px',
              right: '-14px',
              width: '15px',
              height: '22px',
              border: '4px solid #4A6B53',
              borderTopRightRadius: '12px',
              borderBottomRightRadius: '12px',
              borderLeft: 'none',
            },
          }}
        />

        {/* Saucer */}
        <Box
          sx={{
            width: '80px',
            height: '5px',
            backgroundColor: '#8C6239',
            borderRadius: '10px',
            mt: '6px',
          }}
        />
      </Box>

      {/* Brand Text */}
      <Typography
        variant="h6"
        sx={{
          color: '#2A332C',
          fontWeight: 600,
          fontFamily: '"Outfit", sans-serif',
          letterSpacing: '0.05em',
        }}
      >
        TEA SHOP POS
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: '#72987B',
          letterSpacing: '0.1em',
          mt: 0.5,
          textTransform: 'uppercase',
          fontWeight: 500,
        }}
      >
        Brewing Your Workspace...
      </Typography>
    </Box>
  );
};
