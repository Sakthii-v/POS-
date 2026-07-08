import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface StatCardProps {
  title: string;
  value: string;
  growth: string;
  growthType: 'up' | 'down';
  gradient: string;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  growth,
  growthType,
  gradient,
  icon,
}) => {
  const isGrowthUp = growthType === 'up';

  return (
    <Card
      sx={{
        background: gradient,
        color: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0px 12px 28px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0px 18px 36px rgba(110, 27, 28, 0.12)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-15%',
          right: '-15%',
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.06)',
          pointerEvents: 'none',
        },
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 600,
              opacity: 0.85,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              p: 1,
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 800,
            mb: 1.5,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {isGrowthUp ? (
            <ArrowUpwardIcon sx={{ fontSize: '1rem', color: '#FAF8F5' }} />
          ) : (
            <ArrowDownwardIcon sx={{ fontSize: '1rem', color: '#FAF8F5' }} />
          )}
          <Typography
            variant="caption"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 600,
              color: '#FAF8F5',
            }}
          >
            {growth}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              opacity: 0.75,
              ml: 0.5,
            }}
          >
            since last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
