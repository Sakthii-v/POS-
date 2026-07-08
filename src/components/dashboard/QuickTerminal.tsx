import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  TextField,
  MenuItem,
  LinearProgress,
  Paper,
  Alert,
  Snackbar,
  InputAdornment,
} from '@mui/material';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import CoffeeIcon from '@mui/icons-material/Coffee';
import CakeIcon from '@mui/icons-material/Cake';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { usePOS, type ProductItem, type InventoryItem } from '../../context/POSContext';

export const QuickTerminal: React.FC = () => {
  const {
    products,
    inventory: inventoryItems,
    placePOSOrderDirect: onSellItem,
    restockIngredient: onRestockItem,
    addNewProduct: onAddNewItem,
  } = usePOS();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  
  // New Product Form State
  const [newProductName, setNewProductName] = useState('');
  const [newProductRate, setNewProductRate] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<'Tea' | 'Coffee' | 'Snacks'>('Tea');
  
  // Feedback States
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'warning'>('success');
  const [showToast, setShowToast] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getQty = (itemName: string) => quantities[itemName] || 1;

  const updateQty = (itemName: string, delta: number) => {
    const current = getQty(itemName);
    const next = Math.max(1, current + delta);
    setQuantities({ ...quantities, [itemName]: next });
  };

  const handleSell = (product: ProductItem) => {
    const qty = getQty(product.name);
    onSellItem(product.name, product.rate, qty, product.category);
    
    setAlertSeverity('success');
    setAlertMessage(`Successfully ordered ${qty}x ${product.name}!`);
    setShowToast(true);
    
    // Reset qty
    setQuantities({ ...quantities, [product.name]: 1 });
  };

  const handleRestock = (item: InventoryItem) => {
    onRestockItem(item.name); // restock to 100% level
    setAlertSeverity('success');
    setAlertMessage(`Restocked ${item.name} inventory successfully!`);
    setShowToast(true);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) {
      setAlertSeverity('warning');
      setAlertMessage('Product name cannot be empty!');
      setShowToast(true);
      return;
    }

    const rateNum = parseFloat(newProductRate);
    if (isNaN(rateNum) || rateNum <= 0) {
      setAlertSeverity('warning');
      setAlertMessage('Please enter a valid price greater than ₹0.');
      setShowToast(true);
      return;
    }

    onAddNewItem(newProductName.trim(), rateNum, newProductCategory);
    
    setAlertSeverity('success');
    setAlertMessage(`New item "${newProductName}" added to the POS menu!`);
    setShowToast(true);

    // Clear form
    setNewProductName('');
    setNewProductRate('');
    setNewProductCategory('Tea');
  };

  const categories: (ProductItem['category'] | 'All')[] = ['All', 'Tea', 'Coffee', 'Snacks'];
  
  const filteredProducts = products.filter((p) => {
    const filter = categories[activeTab];
    if (filter === 'All') return true;
    return p.category === filter;
  });

  const getCategoryIcon = (category: ProductItem['category']) => {
    switch (category) {
      case 'Tea':
        return <LocalCafeIcon sx={{ color: '#E09F3E' }} />;
      case 'Coffee':
        return <CoffeeIcon sx={{ color: '#A94434' }} />;
      case 'Snacks':
        return <CakeIcon sx={{ color: '#2D6A4F' }} />;
    }
  };

  const getProgressColor = (level: number) => {
    if (level <= 20) return '#C0392B'; // Red
    if (level <= 50) return '#E09F3E'; // Yellow / Spiced Amber
    return '#27AE60'; // Green
  };

  return (
    <Grid container spacing={3}>
      {/* LEFT: POS Quick Cash Register (Grid 7) */}
      <Grid size={{ xs: 12, md: 7 }}>
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgba(224, 159, 62, 0.12)',
            borderRadius: '16px',
            boxShadow: '0px 8px 32px rgba(110, 27, 28, 0.03)',
          }}
        >
          <Box sx={{ p: 3, pb: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 750,
                color: '#330F11',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <ShoppingCartIcon sx={{ color: '#9E2A2B' }} />
              ChaiTrack POS Cash Register
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ fontFamily: '"Outfit", sans-serif' }}>
              Select items, adjust quantities, and instantly record checkout orders
            </Typography>

            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                mt: 2,
                borderBottom: '1px solid rgba(224, 159, 62, 0.08)',
                '& .MuiTab-root': {
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 650,
                  fontSize: '0.85rem',
                  minWidth: '70px',
                },
              }}
            >
              {categories.map((cat) => (
                <Tab key={cat} label={cat} />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ p: 3, flexGrow: 1, maxHeight: '420px', overflowY: 'auto' }}>
            <Grid container spacing={2}>
              {filteredProducts.map((product) => {
                const qty = getQty(product.name);
                return (
                  <Grid size={{ xs: 12, sm: 6 }} key={product.name}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        border: '1px solid rgba(224, 159, 62, 0.12)',
                        backgroundColor: '#FFFDF9',
                        '&:hover': {
                          borderColor: '#E09F3E',
                          boxShadow: '0px 12px 28px rgba(158, 42, 43, 0.08)',
                          transform: 'translateY(-4px)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: '8px',
                            backgroundColor: 'rgba(224, 159, 62, 0.08)',
                            display: 'flex',
                          }}
                        >
                          {getCategoryIcon(product.category)}
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontFamily: '"Outfit", sans-serif',
                              fontWeight: 700,
                              color: '#330F11',
                            }}
                          >
                            {product.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: '"Outfit", sans-serif',
                              fontWeight: 600,
                              color: '#E09F3E',
                            }}
                          >
                            ₹{product.rate.toFixed(2)} / unit
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 1,
                        }}
                      >
                        {/* Qty Counter */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid rgba(224, 159, 62, 0.2)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: '#FFFFFF',
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => updateQty(product.name, -1)}
                            sx={{
                              borderRadius: 0,
                              p: 0.5,
                              transition: 'all 0.2s',
                              '&:hover': {
                                backgroundColor: 'rgba(224, 159, 62, 0.12)',
                                transform: 'scale(1.15)',
                              }
                            }}
                          >
                            <RemoveIcon fontSize="small" sx={{ fontSize: '0.85rem' }} />
                          </IconButton>
                          <Typography
                            sx={{
                              px: 1.5,
                              fontFamily: '"Outfit", sans-serif',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              color: '#330F11',
                            }}
                          >
                            {qty}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateQty(product.name, 1)}
                            sx={{
                              borderRadius: 0,
                              p: 0.5,
                              transition: 'all 0.2s',
                              '&:hover': {
                                backgroundColor: 'rgba(224, 159, 62, 0.12)',
                                transform: 'scale(1.15)',
                              }
                            }}
                          >
                            <AddIcon fontSize="small" sx={{ fontSize: '0.85rem' }} />
                          </IconButton>
                        </Box>

                        <Button
                          variant="contained"
                          size="small"
                          className="btn-shine-hover"
                          onClick={() => handleSell(product)}
                          sx={{
                            borderRadius: '8px',
                            backgroundColor: '#9E2A2B',
                            color: '#FFFFFF',
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            '&:hover': {
                              backgroundColor: '#782C22',
                              transform: 'scale(1.05)',
                              boxShadow: '0px 4px 12px rgba(158, 42, 43, 0.25)',
                            },
                          }}
                        >
                          Sell (₹{(product.rate * qty).toFixed(2)})
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Card>
      </Grid>

      {/* RIGHT: Inventory Ledger & Product Creation (Grid 5) */}
      <Grid size={{ xs: 12, md: 5 }}>
        <Grid container spacing={3} sx={{ height: '100%' }}>
          {/* Add Product Form */}
          <Grid size={{ xs: 12 }}>
            <Card
              sx={{
                border: '1px solid rgba(224, 159, 62, 0.12)',
                borderRadius: '16px',
                boxShadow: '0px 8px 32px rgba(110, 27, 28, 0.03)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 750,
                    color: '#330F11',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <AddIcon sx={{ color: '#E09F3E', border: '1.5px solid #E09F3E', borderRadius: '50%', fontSize: '1rem' }} />
                  Create POS Menu Product
                </Typography>

                <form onSubmit={handleCreateProduct}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Product Name"
                        size="small"
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                        placeholder="e.g. Cardamom Chai, Lemon Tart"
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        fullWidth
                        label="Rate"
                        size="small"
                        type="number"
                        value={newProductRate}
                        onChange={(e) => setNewProductRate(e.target.value)}
                        placeholder="0.00"
                        slotProps={{
                          input: {
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                          },
                          htmlInput: {
                            step: '0.01',
                            min: '0.01',
                          }
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        fullWidth
                        select
                        label="Category"
                        size="small"
                        value={newProductCategory}
                        onChange={(e) => setNewProductCategory(e.target.value as any)}
                      >
                        <MenuItem value="Tea">Tea</MenuItem>
                        <MenuItem value="Coffee">Coffee</MenuItem>
                        <MenuItem value="Snacks">Snacks</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="btn-shine-hover"
                        sx={{
                          backgroundColor: '#E09F3E',
                          color: '#FFFFFF',
                          fontFamily: '"Outfit", sans-serif',
                          fontWeight: 750,
                          py: 1,
                          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          '&:hover': {
                            backgroundColor: '#C6872D',
                            transform: 'translateY(-2px)',
                            boxShadow: '0px 6px 16px rgba(224, 159, 62, 0.25)',
                          },
                        }}
                      >
                        Add Product to POS catalog
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Raw Ingredients Restocker */}
          <Grid size={{ xs: 12 }}>
            <Card
              sx={{
                border: '1px solid rgba(224, 159, 62, 0.12)',
                borderRadius: '16px',
                boxShadow: '0px 8px 32px rgba(110, 27, 28, 0.03)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 750,
                    color: '#330F11',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <InventoryIcon sx={{ color: '#E09F3E' }} />
                  Quick Inventory Restock
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ fontFamily: '"Outfit", sans-serif', display: 'block', mb: 2 }}
                >
                  Top up levels and automatically increase total raw store ingredients
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {inventoryItems.map((item) => (
                    <Box key={item.name}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 650,
                            color: '#4E2E2B',
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography
                            variant="caption"
                            className={item.level <= 20 ? 'stock-alert-pulse' : ''}
                            sx={{
                              fontFamily: '"Outfit", sans-serif',
                              fontWeight: 700,
                              color: getProgressColor(item.level),
                              backgroundColor: item.level <= 20 ? 'rgba(192, 57, 43, 0.1)' : 'transparent',
                              px: item.level <= 20 ? 0.75 : 0,
                              py: item.level <= 20 ? 0.25 : 0,
                              borderRadius: '4px',
                              transition: 'all 0.2s',
                            }}
                          >
                            {item.level}% ({item.unit})
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleRestock(item)}
                            disabled={item.level >= 95}
                            sx={{
                              py: 0.1,
                              px: 1,
                              fontSize: '0.65rem',
                              fontFamily: '"Outfit", sans-serif',
                              fontWeight: 700,
                              borderColor: 'rgba(224, 159, 62, 0.4)',
                              color: '#E09F3E',
                              transition: 'all 0.2s',
                              '&:hover': {
                                borderColor: '#E09F3E',
                                backgroundColor: 'rgba(224, 159, 62, 0.12)',
                                transform: 'scale(1.05)',
                              },
                              '&.Mui-disabled': {
                                color: 'rgba(0, 0, 0, 0.25)',
                                borderColor: 'rgba(0, 0, 0, 0.1)',
                              },
                            }}
                          >
                            {item.level >= 95 ? 'Full' : '+ Restock'}
                          </Button>
                        </Box>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={item.level}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(224, 159, 62, 0.08)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getProgressColor(item.level),
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Snackbar feedback notification */}
      <Snackbar
        open={showToast}
        autoHideDuration={3000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setShowToast(false)}
          severity={alertSeverity}
          sx={{
            width: '100%',
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
            borderRadius: '12px',
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};
