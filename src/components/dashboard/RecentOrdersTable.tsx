import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
} from '@mui/material';
import { type POSOrder } from '../../data/dashboardData';

interface RecentOrdersTableProps {
  orders: POSOrder[];
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders }) => {
  const getStatusChip = (status: POSOrder['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <Chip
            label="Completed"
            size="small"
            sx={{
              backgroundColor: 'rgba(39, 174, 96, 0.1)',
              color: '#27AE60',
              fontWeight: 600,
              fontFamily: '"Outfit", sans-serif',
              borderRadius: '8px',
            }}
          />
        );
      case 'Pending':
        return (
          <Chip
            label="Pending"
            size="small"
            sx={{
              backgroundColor: 'rgba(224, 159, 62, 0.1)',
              color: '#E09F3E',
              fontWeight: 600,
              fontFamily: '"Outfit", sans-serif',
              borderRadius: '8px',
            }}
          />
        );
      case 'Cancelled':
        return (
          <Chip
            label="Cancelled"
            size="small"
            sx={{
              backgroundColor: 'rgba(192, 57, 43, 0.1)',
              color: '#C0392B',
              fontWeight: 600,
              fontFamily: '"Outfit", sans-serif',
              borderRadius: '8px',
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 750,
            color: '#330F11',
          }}
        >
          Recent POS Orders
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ fontFamily: '"Outfit", sans-serif' }}
        >
          Real-time checkouts and queue ticket states
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: '16px',
          border: '1px solid rgba(224, 159, 62, 0.12)',
          overflow: 'hidden',
          boxShadow: '0px 8px 32px rgba(110, 27, 28, 0.03)',
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#FFFDF9' }}>
            <TableRow>
              {['Order ID', 'Customer Name', 'Product', 'Qty', 'Amount', 'Status'].map(
                (header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 700,
                      color: '#4E2E2B',
                      borderBottom: '1px solid rgba(224, 159, 62, 0.12)',
                    }}
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(224, 159, 62, 0.02)',
                  },
                }}
              >
                <TableCell
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 600,
                    color: '#330F11',
                    borderBottom: '1px solid rgba(224, 159, 62, 0.08)',
                  }}
                >
                  {order.id}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    color: '#6E4F51',
                    borderBottom: '1px solid rgba(224, 159, 62, 0.08)',
                  }}
                >
                  {order.customerName}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 500,
                    color: '#330F11',
                    borderBottom: '1px solid rgba(224, 159, 62, 0.08)',
                  }}
                >
                  {order.product}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    color: '#6E4F51',
                    borderBottom: '1px solid rgba(224, 159, 62, 0.08)',
                  }}
                >
                  {order.quantity}
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 600,
                    color: '#9E2A2B',
                    borderBottom: '1px solid rgba(224, 159, 62, 0.08)',
                  }}
                >
                  ₹{order.amount.toFixed(2)}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: '1px solid rgba(224, 159, 62, 0.08)',
                  }}
                >
                  {getStatusChip(order.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
