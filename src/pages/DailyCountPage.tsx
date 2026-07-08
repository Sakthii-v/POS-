import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Divider,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LockIcon from '@mui/icons-material/Lock';
import NotesIcon from '@mui/icons-material/Notes';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { MainLayout } from '../layouts/MainLayout';
import { usePOS } from '../context/POSContext';

export const DailyCountPage: React.FC = () => {
  const { openingCash, cashSales, upiSales, resetShiftSales } = usePOS();

  // Denomination Counts
  const [denominations, setDenominations] = useState<{ [key: number]: number }>({
    500: 0,
    200: 0,
    100: 0,
    50: 0,
    20: 0,
    10: 0,
    5: 0,
  });

  // Checklist items
  const [checklist, setChecklist] = useState({
    cashCounted: false,
    upiSettled: false,
    countersCleaned: false,
    tipsRecorded: false,
    safeDropDone: false,
  });

  // Shift notes
  const [notes, setNotes] = useState('');

  // UI state
  const [showReceipt, setShowReceipt] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Derived calculations
  const totalCountedCash = Object.entries(denominations).reduce(
    (sum, [denom, count]) => sum + Number(denom) * count,
    0
  );

  const expectedCash = openingCash + cashSales;
  const cashVariance = totalCountedCash - expectedCash;
  const totalShiftSales = cashSales + upiSales;

  // Toggle checks
  const handleCheckChange = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Adjust individual denomination count
  const adjustCount = (denom: number, delta: number) => {
    setDenominations((prev) => ({
      ...prev,
      [denom]: Math.max(0, prev[denom] + delta),
    }));
  };

  // Direct manual type-in handler
  const handleCountChange = (denom: number, valStr: string) => {
    const cleanVal = valStr.replace(/[^0-9]/g, '');
    const num = cleanVal === '' ? 0 : parseInt(cleanVal, 10);
    setDenominations((prev) => ({
      ...prev,
      [denom]: num,
    }));
  };

  // Colors based on Indian currency note standards
  const getDenomColor = (denom: number) => {
    switch (denom) {
      case 500: return { bg: '#8A7A71', text: '#FFFFFF' }; // Stone grey
      case 200: return { bg: '#E67E22', text: '#FFFFFF' }; // Bright orange
      case 100: return { bg: '#8E44AD', text: '#FFFFFF' }; // Light lavender/purple
      case 50: return { bg: '#16A085', text: '#FFFFFF' };  // Cyan
      case 20: return { bg: '#D4AC0D', text: '#330F11' };  // Yellow-green
      case 10: return { bg: '#A04000', text: '#FFFFFF' };  // Chocolate brown
      case 5: return { bg: '#2D6A4F', text: '#FFFFFF' };   // Coin green
      default: return { bg: '#9E2A2B', text: '#FFFFFF' };
    }
  };

  // Is closure button enabled
  const isChecklistComplete = Object.values(checklist).every((item) => item === true);

  // Trigger modal receipt display
  const handleOpenReceipt = () => {
    setShowReceipt(true);
  };

  // Reset shift sales & clear local counters
  const handleCloseShiftConfirm = () => {
    resetShiftSales();
    setDenominations({
      500: 0,
      200: 0,
      100: 0,
      50: 0,
      20: 0,
      10: 0,
      5: 0,
    });
    setChecklist({
      cashCounted: false,
      upiSettled: false,
      countersCleaned: false,
      tipsRecorded: false,
      safeDropDone: false,
    });
    setNotes('');
    setShowReceipt(false);
    setSuccessMessage('Shift closed successfully. All POS ledgers have been reconciled and reset.');
    setShowSuccessToast(true);
  };

  // Get current system time formatted
  const getCurrentDateTime = () => {
    return new Date().toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <MainLayout>
      <Fade in timeout={500}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Header */}
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
              <AssessmentIcon sx={{ color: '#9E2A2B', fontSize: '2rem' }} />
              ChaiTrack Shift Drawer Count & Closure
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontFamily: '"Outfit", sans-serif' }}>
              Verify shift payments log, recount physical drawer coins/notes, and close the session.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Left Column: Denomination Reconciler Widget */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  border: '1.5px solid rgba(224, 159, 62, 0.12)',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0px 8px 32px rgba(110, 27, 28, 0.03)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 800,
                    color: '#330F11',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  💵 Cash Denomination Reconciler
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {Object.keys(denominations)
                    .map(Number)
                    .sort((a, b) => b - a)
                    .map((denom) => {
                      const count = denominations[denom];
                      const colors = getDenomColor(denom);
                      const rowTotal = denom * count;

                      return (
                        <Box
                          key={denom}
                          sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'stretch', sm: 'center' },
                            justifyContent: 'space-between',
                            p: 2,
                            borderRadius: '12px',
                            backgroundColor: '#FFFDF9',
                            border: '1px solid rgba(224, 159, 62, 0.08)',
                            gap: { xs: 2, sm: 0 },
                          }}
                        >
                          {/* Note Label Avatar */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: '120px' }}>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 56,
                                height: 32,
                                backgroundColor: colors.bg,
                                color: colors.text,
                                fontFamily: '"Outfit", sans-serif',
                                fontWeight: 900,
                                fontSize: '0.85rem',
                                border: '1px solid rgba(0, 0, 0, 0.08)',
                              }}
                            >
                              ₹{denom}
                            </Avatar>
                            <Typography
                              sx={{
                                fontFamily: '"Outfit", sans-serif',
                                fontWeight: 700,
                                color: '#6E5D57',
                              }}
                            >
                              {denom >= 10 ? 'Note' : 'Coin'}
                            </Typography>
                          </Box>

                          {/* Count Adjuster Controls */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1px solid rgba(224, 159, 62, 0.15)',
                              borderRadius: '24px',
                              backgroundColor: '#FFFFFF',
                              px: 0.5,
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => adjustCount(denom, -1)}
                              sx={{
                                p: 0.5,
                                color: '#9E2A2B',
                                '&:hover': { backgroundColor: 'rgba(158, 42, 43, 0.05)' },
                              }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <TextField
                              variant="standard"
                              value={count === 0 ? '' : count}
                              onChange={(e) => handleCountChange(denom, e.target.value)}
                              placeholder="0"
                              slotProps={{
                                htmlInput: {
                                  style: {
                                    textAlign: 'center',
                                    fontWeight: 800,
                                    fontFamily: '"Outfit", sans-serif',
                                    color: '#330F11',
                                    width: '48px',
                                  },
                                }
                              }}
                              sx={{
                                '& .MuiInput-underline:before': { borderBottom: 'none' },
                                '& .MuiInput-underline:after': { borderBottom: 'none' },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => adjustCount(denom, 1)}
                              sx={{
                                p: 0.5,
                                color: '#2D6A4F',
                                '&:hover': { backgroundColor: 'rgba(45, 106, 79, 0.05)' },
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>

                          {/* Calculated Row Sum */}
                          <Box sx={{ minWidth: '150px', textAlign: { xs: 'left', sm: 'right' } }}>
                            <Typography
                              sx={{
                                fontFamily: '"Outfit", sans-serif',
                                fontWeight: 800,
                                color: rowTotal > 0 ? '#330F11' : '#A49A96',
                                fontSize: '0.95rem',
                              }}
                            >
                              ₹{rowTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ fontFamily: '"Outfit", sans-serif' }}>
                              {denom} × {count}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                </Box>
              </Card>
            </Grid>

            {/* Right Column: Ledger Summary, Checklist & closure button */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                
                {/* 1. Shift Ledger Summary Pane */}
                <Card
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1.5px solid rgba(224, 159, 62, 0.12)',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0px 8px 32px rgba(110, 27, 28, 0.03)',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 800,
                      color: '#330F11',
                      mb: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    📊 Live Shift Ledger Report
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    
                    {/* Opening cash */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: '#6E5D57', fontSize: '0.9rem' }}>
                        Opening Drawer Cash:
                      </Typography>
                      <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#330F11' }}>
                        ₹{openingCash.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </Typography>
                    </Box>

                    {/* Shift Cash Sales */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: '#6E5D57', fontSize: '0.9rem' }}>
                        Expected Shift Cash Sales:
                      </Typography>
                      <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#330F11' }}>
                        +₹{cashSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </Typography>
                    </Box>

                    <Divider sx={{ borderStyle: 'dashed', opacity: 0.6 }} />

                    {/* Expected Total cash in drawer */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: '#330F11', fontWeight: 700, fontSize: '0.9rem' }}>
                        Expected Cash in Drawer:
                      </Typography>
                      <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#330F11' }}>
                        ₹{expectedCash.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </Typography>
                    </Box>

                    {/* Counted Cash */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1.5,
                        backgroundColor: '#FFFDF9',
                        borderRadius: '8px',
                        border: '1px solid rgba(224, 159, 62, 0.1)',
                      }}
                    >
                      <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: '#E09F3E', fontWeight: 800, fontSize: '0.9rem' }}>
                        Total Counted Cash:
                      </Typography>
                      <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, color: '#E09F3E', fontSize: '1.1rem' }}>
                        ₹{totalCountedCash.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </Typography>
                    </Box>

                    {/* Cash Variance Box */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1.5,
                        borderRadius: '8px',
                        backgroundColor: cashVariance === 0 
                          ? 'rgba(46, 204, 113, 0.1)' 
                          : cashVariance > 0 
                            ? 'rgba(241, 196, 15, 0.1)' 
                            : 'rgba(231, 76, 60, 0.1)',
                        border: `1.5px solid ${
                          cashVariance === 0 
                            ? '#2ECC71' 
                            : cashVariance > 0 
                              ? '#F1C40F' 
                              : '#E74C3C'
                        }`,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: '"Outfit", sans-serif',
                          fontWeight: 750,
                          color: cashVariance === 0 
                            ? '#27AE60' 
                            : cashVariance > 0 
                              ? '#D4AC0D' 
                              : '#C0392B',
                          fontSize: '0.9rem'
                        }}
                      >
                        Drawer Variance:
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '"Outfit", sans-serif',
                          fontWeight: 900,
                          color: cashVariance === 0 
                            ? '#27AE60' 
                            : cashVariance > 0 
                              ? '#D4AC0D' 
                              : '#C0392B',
                          fontSize: '1.05rem'
                        }}
                      >
                        {cashVariance > 0 ? '+' : ''}
                        ₹{cashVariance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    {/* Expected UPI Sales */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: '#6E5D57', fontSize: '0.9rem' }}>
                        Expected UPI Sales (Banked):
                      </Typography>
                      <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#2980B9' }}>
                        ₹{upiSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </Typography>
                    </Box>

                    {/* Total Combined Sales (Cash + UPI) */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontFamily: '"Outfit", sans-serif', color: '#6E5D57', fontSize: '0.9rem' }}>
                        Total Shift Checkout Sales:
                      </Typography>
                      <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#330F11' }}>
                        ₹{totalShiftSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </Typography>
                    </Box>

                  </Box>
                </Card>

                {/* 2. Shift Checklist Section */}
                <Card
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1.5px solid rgba(224, 159, 62, 0.12)',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0px 8px 32px rgba(110, 27, 28, 0.03)',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 800,
                      color: '#330F11',
                      mb: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <LockIcon sx={{ color: '#E09F3E' }} />
                    Shift Close Requirements
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checklist.cashCounted}
                          onChange={() => handleCheckChange('cashCounted')}
                          sx={{ color: '#E09F3E', '&.Mui-checked': { color: '#E09F3E' } }}
                        />
                      }
                      label={
                        <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontSize: '0.9rem', color: '#330F11', fontWeight: 600 }}>
                          Physical cash counted and double-checked 💵
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checklist.upiSettled}
                          onChange={() => handleCheckChange('upiSettled')}
                          sx={{ color: '#E09F3E', '&.Mui-checked': { color: '#E09F3E' } }}
                        />
                      }
                      label={
                        <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontSize: '0.9rem', color: '#330F11', fontWeight: 600 }}>
                          UPI card terminal batches closed and verified 📱
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checklist.countersCleaned}
                          onChange={() => handleCheckChange('countersCleaned')}
                          sx={{ color: '#E09F3E', '&.Mui-checked': { color: '#E09F3E' } }}
                        />
                      }
                      label={
                        <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontSize: '0.9rem', color: '#330F11', fontWeight: 600 }}>
                          Counter and coffee machines cleaned & backflushed ☕
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checklist.tipsRecorded}
                          onChange={() => handleCheckChange('tipsRecorded')}
                          sx={{ color: '#E09F3E', '&.Mui-checked': { color: '#E09F3E' } }}
                        />
                      }
                      label={
                        <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontSize: '0.9rem', color: '#330F11', fontWeight: 600 }}>
                          Shift gratuity tips logged in staff books 📝
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checklist.safeDropDone}
                          onChange={() => handleCheckChange('safeDropDone')}
                          sx={{ color: '#E09F3E', '&.Mui-checked': { color: '#E09F3E' } }}
                        />
                      }
                      label={
                        <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontSize: '0.9rem', color: '#330F11', fontWeight: 600 }}>
                          Safe cash drops logged and dropped in back-office 🔒
                        </Typography>
                      }
                    />
                  </Box>
                </Card>

                {/* 3. Notes Card */}
                <Card
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1.5px solid rgba(224, 159, 62, 0.12)',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0px 8px 32px rgba(110, 27, 28, 0.03)',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 800,
                      color: '#330F11',
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <NotesIcon sx={{ color: '#9E2A2B' }} />
                    Shift closure notes
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Enter any variance explanations, inventory shortages, or shift incidents..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    sx={{
                      backgroundColor: '#FFFDF9',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        fontFamily: '"Outfit", sans-serif',
                        fontSize: '0.9rem',
                      },
                    }}
                  />
                </Card>

                {/* Action Trigger Button */}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleOpenReceipt}
                  disabled={!isChecklistComplete}
                  sx={{
                    borderRadius: '12px',
                    backgroundColor: '#9E2A2B',
                    color: '#FFFFFF',
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 750,
                    fontSize: '1rem',
                    py: 1.5,
                    boxShadow: '0px 8px 24px rgba(158, 42, 43, 0.25)',
                    '&:hover': {
                      backgroundColor: '#7A1C1D',
                      boxShadow: '0px 12px 28px rgba(158, 42, 43, 0.35)',
                    },
                    '&:disabled': {
                      backgroundColor: '#E5DEDC',
                      color: '#A49A96',
                    },
                  }}
                >
                  {isChecklistComplete
                    ? 'End Shift & Close Drawer 🔐'
                    : 'Check All Close Requirements to Lock Shift'}
                </Button>

              </Box>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      {/* Closure Summary Thermal Receipt Dialog */}
      <Dialog
        open={showReceipt}
        onClose={() => setShowReceipt(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              backgroundColor: '#F5F5F5',
              overflow: 'hidden',
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 800,
            color: '#330F11',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            py: 2,
          }}
        >
          <ReceiptLongIcon sx={{ color: '#E09F3E' }} />
          Shift Closure Receipt
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {/* Thermal Paper Look-alike Container */}
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
            <Paper
              elevation={2}
              sx={{
                width: '100%',
                p: 3,
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '0.85rem',
                color: '#111111',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                position: 'relative',
                border: '1px solid #E0E0E0',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  backgroundImage: 'radial-gradient(circle, transparent 30%, #F5F5F5 35%)',
                  backgroundSize: '8px 8px',
                  backgroundRepeat: 'repeat-x',
                },
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 2, mt: 1 }}>
                <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '1.2rem', color: '#330F11' }}>
                  ChaiTrack Cafe
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>
                  Shift Reconciliation Audit
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>DATE/TIME:</span>
                  <span>{getCurrentDateTime()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>CASHIER:</span>
                  <span>Quick POS Cashier</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>REGISTER:</span>
                  <span>Main Terminal 01</span>
                </div>
              </Box>

              <Box sx={{ mb: 2 }}>
                <div>================================</div>
                <div style={{ fontWeight: 'bold', textAlign: 'center' }}>CASH RECONCILIATION</div>
                <div>================================</div>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Opening Cash:</span>
                  <span>₹{openingCash.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Cash Sales:</span>
                  <span>₹{cashSales.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>Expected Cash:</span>
                  <span>₹{expectedCash.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>Actual Counted:</span>
                  <span>₹{totalCountedCash.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: cashVariance >= 0 ? '#27AE60' : '#C0392B' }}>
                  <span>Cash Variance:</span>
                  <span>{cashVariance >= 0 ? '+' : ''}₹{cashVariance.toFixed(2)}</span>
                </div>
              </Box>

              <Box sx={{ mb: 2 }}>
                <div>================================</div>
                <div style={{ fontWeight: 'bold', textAlign: 'center' }}>NON-CASH RECONCILIATION</div>
                <div>================================</div>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Expected UPI:</span>
                  <span>₹{upiSales.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>Total Shift Sales:</span>
                  <span>₹{totalShiftSales.toFixed(2)}</span>
                </div>
              </Box>

              {notes.trim() && (
                <Box sx={{ mb: 2 }}>
                  <div>--------------------------------</div>
                  <div style={{ fontWeight: 'bold' }}>CASHIER NOTES:</div>
                  <div style={{ wordBreak: 'break-all', marginTop: '4px' }}>{notes}</div>
                </Box>
              )}

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <div>--------------------------------</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>SHIFT CLOSED SECURELY</div>
                <div>--------------------------------</div>
              </Box>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, backgroundColor: '#FFFFFF', gap: 1, borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
          <Button
            onClick={() => setShowReceipt(false)}
            variant="outlined"
            sx={{
              flex: 1,
              borderRadius: '10px',
              borderColor: '#E5DEDC',
              color: '#6E5D57',
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              '&:hover': {
                borderColor: '#6E5D57',
                backgroundColor: 'rgba(110, 93, 87, 0.05)',
              },
            }}
          >
            Go Back
          </Button>
          <Button
            onClick={handleCloseShiftConfirm}
            variant="contained"
            sx={{
              flex: 1.5,
              borderRadius: '10px',
              backgroundColor: '#2D6A4F',
              color: '#FFFFFF',
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 750,
              boxShadow: '0px 4px 14px rgba(45, 106, 79, 0.2)',
              '&:hover': {
                backgroundColor: '#1E4634',
                boxShadow: '0px 6px 18px rgba(45, 106, 79, 0.3)',
              },
            }}
          >
            Confirm & Close Shift
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset success notification toast */}
      <Snackbar
        open={showSuccessToast}
        autoHideDuration={4000}
        onClose={() => setShowSuccessToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setShowSuccessToast(false)}
          severity="success"
          icon={<CheckCircleIcon sx={{ color: '#FFFFFF' }} />}
          sx={{
            width: '100%',
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 650,
            borderRadius: '12px',
            backgroundColor: '#2D6A4F',
            color: '#FFFFFF',
            boxShadow: '0px 8px 32px rgba(45, 106, 79, 0.25)',
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};
