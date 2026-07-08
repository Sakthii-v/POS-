import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { weeklySalesData } from '../../data/dashboardData';

export const WeeklySalesChart: React.FC = () => {
  return (
    <Card
      sx={{
        borderRadius: '16px',
        border: '1px solid rgba(224, 159, 62, 0.12)',
        boxShadow: '0px 8px 32px rgba(110, 27, 28, 0.03)',
        height: '380px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 750,
              color: '#330F11',
            }}
          >
            Weekly Sales Volume
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ fontFamily: '"Outfit", sans-serif' }}
          >
            Total orders completed by day of week
          </Typography>
        </Box>

        <Box sx={{ width: '100%', flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklySalesData}
              margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
            >
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E09F3E" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#E09F3E" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1EFEA" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6E4F51', fontSize: 12, fontFamily: '"Outfit", sans-serif' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6E4F51', fontSize: 12, fontFamily: '"Outfit", sans-serif' }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(224, 159, 62, 0.05)' }}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid rgba(224, 159, 62, 0.2)',
                  boxShadow: '0px 8px 24px rgba(110, 27, 28, 0.08)',
                  fontFamily: '"Outfit", sans-serif',
                }}
                formatter={(value: any) => [value, 'Sales']}
              />
              <Bar
                dataKey="sales"
                fill="url(#barGrad)"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
