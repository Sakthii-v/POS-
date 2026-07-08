import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Chip,
  Fade,
  Snackbar,
  Alert,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import CoffeeIcon from '@mui/icons-material/Coffee';
import CakeIcon from '@mui/icons-material/Cake';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';

import { MainLayout } from '../layouts/MainLayout';
import { usePOS, type ProductItem } from '../context/POSContext';

export const InventoryPage: React.FC = () => {
  const {
    products,
    inventory: inventoryItems,
    restockIngredient,
    addNewProduct,
  } = usePOS();

  // Tab State: 0 = Ingredients, 1 = Catalogue list
  const [activeTab, setActiveTab] = useState(0);

  // Form Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductRate, setNewProductRate] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<'Tea' | 'Coffee' | 'Snacks'>('Tea');

  // Search & Category states for Products
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Tea' | 'Coffee' | 'Snacks'>('All');

  // Toast feedback state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'warning'>('success');

  const triggerToast = (msg: string, severity: 'success' | 'warning' = 'success') => {
    setToastMessage(msg);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  // Handlers
  const handleRestock = (name: string) => {
    restockIngredient(name);
    triggerToast(`Restocked ${name} successfully to 100%!`, 'success');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) {
      triggerToast('Product name cannot be empty!', 'warning');
      return;
    }
    const rateNum = parseFloat(newProductRate);
    if (isNaN(rateNum) || rateNum <= 0) {
      triggerToast('Please enter a valid price greater than ₹0.', 'warning');
      return;
    }
    addNewProduct(newProductName.trim(), rateNum, newProductCategory);
    triggerToast(`New product "${newProductName.trim()}" added to menu catalog!`, 'success');
    
    // Reset Form & Close
    setNewProductName('');
    setNewProductRate('');
    setNewProductCategory('Tea');
    setDialogOpen(false);
  };

  // Helpers
  const getLevelColor = (level: number) => {
    if (level <= 20) return '#C0392B'; // Red for Alert
    if (level <= 50) return '#E09F3E'; // Amber for Warning
    return '#2D6A4F'; // Green for Normal
  };

  const getCategoryIcon = (category: ProductItem['category']) => {
    switch (category) {
      case 'Tea':
        return <LocalCafeIcon sx={{ color: '#E09F3E', fontSize: '1.15rem' }} />;
      case 'Coffee':
        return <CoffeeIcon sx={{ color: '#A94434', fontSize: '1.15rem' }} />;
      case 'Snacks':
        return <CakeIcon sx={{ color: '#2D6A4F', fontSize: '1.15rem' }} />;
    }
  };

  const getCategoryTheme = (category: ProductItem['category']) => {
    switch (category) {
      case 'Tea':
        return { bg: 'rgba(224, 159, 62, 0.08)', text: '#E09F3E' };
      case 'Coffee':
        return { bg: 'rgba(169, 68, 52, 0.08)', text: '#A94434' };
      case 'Snacks':
        return { bg: 'rgba(45, 106, 79, 0.08)', text: '#2D6A4F' };
    }
  };

  // Filter products by search text and category pill
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <Fade in timeout={500}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                <InventoryIcon sx={{ color: '#9E2A2B', fontSize: '2rem' }} />
                ChaiTrack Inventory Management
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontFamily: '"Outfit", sans-serif' }}>
                Track raw materials ledger levels, restock ingredients, and manage menu items for the POS billing register
              </Typography>
            </Box>
          </Box>

          {/* Main Card with Tabs */}
          <Card
            sx={{
              borderRadius: '16px',
              border: '1px solid rgba(224, 159, 62, 0.12)',
              boxShadow: '0px 8px 32px rgba(110, 27, 28, 0.03)',
            }}
          >
            {/* Tabs Header */}
            <Box sx={{ borderBottom: 1, borderColor: 'rgba(0, 0, 0, 0.08)', px: 3, pt: 1 }}>
              <Tabs
                value={activeTab}
                onChange={(_e, val) => setActiveTab(val)}
                textColor="primary"
                indicatorColor="primary"
                sx={{
                  '& .MuiTab-root': {
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    py: 2,
                  },
                }}
              >
                <Tab label="Raw Ingredients Ledger" />
                <Tab label="POS Products Catalogue" />
              </Tabs>
            </Box>

            {/* TAB CONTENT 0: Raw Ingredients Ledger */}
            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: 'rgba(224, 159, 62, 0.03)' }}>
                      <TableRow>
                        <TableCell sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#330F11' }}>Ingredient Name</TableCell>
                        <TableCell sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#330F11', width: '40%' }}>Stock Capacity Level</TableCell>
                        <TableCell sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#330F11' }}>Stock Volume</TableCell>
                        <TableCell sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#330F11' }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#330F11' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inventoryItems.map((item) => (
                        <TableRow key={item.name} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 650, color: '#4E2E2B' }}>
                            {item.name}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <LinearProgress
                                variant="determinate"
                                value={item.level}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  flexGrow: 1,
                                  backgroundColor: 'rgba(0,0,0,0.04)',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: getLevelColor(item.level),
                                    borderRadius: 4,
                                  },
                                }}
                              />
                              <Typography variant="body2" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: getLevelColor(item.level), minWidth: '35px' }}>
                                {item.level}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: 'text.secondary' }}>
                            {item.unit}
                          </TableCell>
                          <TableCell>
                            {item.level <= 20 ? (
                              <Chip
                                label="LOW STOCK"
                                size="small"
                                className="stock-alert-pulse"
                                sx={{
                                  backgroundColor: 'rgba(192, 57, 43, 0.1)',
                                  color: '#C0392B',
                                  fontWeight: 800,
                                  fontFamily: '"Outfit", sans-serif',
                                  fontSize: '0.7rem',
                                }}
                              />
                            ) : item.level <= 50 ? (
                              <Chip
                                label="MODERATE"
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(224, 159, 62, 0.1)',
                                  color: '#E09F3E',
                                  fontWeight: 800,
                                  fontFamily: '"Outfit", sans-serif',
                                  fontSize: '0.7rem',
                                }}
                              />
                            ) : (
                              <Chip
                                label="SUFFICIENT"
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(45, 106, 79, 0.1)',
                                  color: '#2D6A4F',
                                  fontWeight: 800,
                                  fontFamily: '"Outfit", sans-serif',
                                  fontSize: '0.7rem',
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleRestock(item.name)}
                              disabled={item.level >= 95}
                              startIcon={<RefreshIcon />}
                              sx={{
                                fontFamily: '"Outfit", sans-serif',
                                fontWeight: 700,
                                textTransform: 'none',
                                borderColor: 'rgba(224, 159, 62, 0.4)',
                                color: '#E09F3E',
                                '&:hover': {
                                  borderColor: '#E09F3E',
                                  backgroundColor: 'rgba(224, 159, 62, 0.08)',
                                },
                              }}
                            >
                              Restock Item
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* TAB CONTENT 1: Products Catalogue */}
            {activeTab === 1 && (
              <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Search, Filter Pills & Add Button Panel */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                  {/* Category Filter Pills */}
                  <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', width: { xs: '100%', sm: 'auto' }, pb: { xs: 1, sm: 0 } }}>
                    {(['All', 'Tea', 'Coffee', 'Snacks'] as const).map((cat) => (
                      <Button
                        key={cat}
                        size="small"
                        onClick={() => setSelectedCategory(cat)}
                        sx={{
                          borderRadius: '20px',
                          px: 2.5,
                          py: 0.6,
                          fontFamily: '"Outfit", sans-serif',
                          fontWeight: 700,
                          backgroundColor: selectedCategory === cat ? '#E09F3E' : 'rgba(0,0,0,0.03)',
                          color: selectedCategory === cat ? '#FFFFFF' : '#4E2E2B',
                          '&:hover': {
                            backgroundColor: selectedCategory === cat ? '#C6872D' : 'rgba(0,0,0,0.06)',
                          },
                        }}
                      >
                        {cat}
                      </Button>
                    ))}
                  </Box>

                  {/* Search Bar & Create Button */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', sm: 'auto' }, justifyContent: 'flex-end' }}>
                    <TextField
                      placeholder="Search menu catalog..."
                      size="small"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      sx={{
                        width: { xs: '100%', sm: '240px' },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '20px',
                        },
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setDialogOpen(true)}
                      sx={{
                        borderRadius: '8px',
                        backgroundColor: '#E09F3E',
                        fontFamily: '"Outfit", sans-serif',
                        fontWeight: 700,
                        px: 2.5,
                        whiteSpace: 'nowrap',
                        '&:hover': {
                          backgroundColor: '#C6872D',
                        },
                      }}
                    >
                      Register Product
                    </Button>
                  </Box>
                </Box>

                {/* Full Width Catalogue Table */}
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: 'rgba(158, 42, 43, 0.03)' }}>
                      <TableRow>
                        <TableCell sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#330F11' }}>Product Name</TableCell>
                        <TableCell sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#330F11' }}>Menu Category</TableCell>
                        <TableCell align="right" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#330F11' }}>Sales Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                            <Typography color="textSecondary" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 500 }}>
                              No items match your search filters.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProducts.map((p) => {
                          const theme = getCategoryTheme(p.category);
                          return (
                            <TableRow key={p.name} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#330F11', fontSize: '0.95rem' }}>
                                {p.name}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  icon={getCategoryIcon(p.category)}
                                  label={p.category}
                                  size="small"
                                  sx={{
                                    backgroundColor: theme.bg,
                                    color: theme.text,
                                    fontWeight: 700,
                                    fontFamily: '"Outfit", sans-serif',
                                    '& .MuiChip-icon': { color: theme.text },
                                  }}
                                />
                              </TableCell>
                              <TableCell align="right" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#9E2A2B', fontSize: '1.05rem' }}>
                                ₹{p.rate.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Card>
        </Box>
      </Fade>

      {/* DIALOG: Register Menu Product Modal */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        slotProps={{
          paper: {
            sx: { borderRadius: '16px', width: '420px', maxWidth: '100%' }
          }
        }}
      >
        <form onSubmit={handleCreateProduct}>
          <DialogTitle sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: '#330F11' }}>
            Register New Catalogue Product
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              label="Product Name"
              fullWidth
              required
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="e.g. Cardamom Bun, Rose Oolong"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Sales Price"
                fullWidth
                required
                type="number"
                value={newProductRate}
                onChange={(e) => setNewProductRate(e.target.value)}
                placeholder="0"
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  },
                  htmlInput: {
                    min: '1',
                    step: '1',
                  }
                }}
              />
              <TextField
                select
                label="Category"
                fullWidth
                value={newProductCategory}
                onChange={(e) => setNewProductCategory(e.target.value as any)}
              >
                <MenuItem value="Tea">Tea ☕</MenuItem>
                <MenuItem value="Coffee">Coffee ☕</MenuItem>
                <MenuItem value="Snacks">Snacks 🍰</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 650, color: 'text.secondary' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: '8px',
                backgroundColor: '#E09F3E',
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 750,
                px: 3,
                '&:hover': { backgroundColor: '#C6872D' },
              }}
            >
              Add Product
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar feedback */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          sx={{
            width: '100%',
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 650,
            borderRadius: '12px',
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};
