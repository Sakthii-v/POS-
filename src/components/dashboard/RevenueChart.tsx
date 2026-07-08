import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { monthlyRevenueData } from '../../data/dashboardData';

export const RevenueChart: React.FC = () => {
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
            Revenue Analytics
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ fontFamily: '"Outfit", sans-serif' }}
          >
            Monthly sales revenue trend for current fiscal year
          </Typography>
        </Box>

        <Box sx={{ width: '100%', flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyRevenueData}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#9E2A2B" />
                  <stop offset="100%" stopColor="#E09F3E" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1EFEA" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6E4F51', fontSize: 12, fontFamily: '"Outfit", sans-serif' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6E4F51', fontSize: 12, fontFamily: '"Outfit", sans-serif' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid rgba(224, 159, 62, 0.2)',
                  boxShadow: '0px 8px 24px rgba(110, 27, 28, 0.08)',
                  fontFamily: '"Outfit", sans-serif',
                }}
                formatter={(value: any) => [`$${value}`, 'Revenue']}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="url(#lineGrad)"
                strokeWidth={3}
                dot={{ fill: '#9E2A2B', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#E09F3E', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
