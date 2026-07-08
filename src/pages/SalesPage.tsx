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
  InputAdornment,
  Snackbar,
  Alert,
  Fade,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import CoffeeIcon from '@mui/icons-material/Coffee';
import CakeIcon from '@mui/icons-material/Cake';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

import { MainLayout } from '../layouts/MainLayout';
import { usePOS, type ProductItem } from '../context/POSContext';

export const SalesPage: React.FC = () => {
  const { products, placePOSOrderDirect } = usePOS();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Tea' | 'Coffee' | 'Snacks'>('All');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [paymentMethods, setPaymentMethods] = useState<{ [key: string]: 'Cash' | 'UPI' }>({});
  
  // Feedback states
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const getQty = (itemName: string) => quantities[itemName] || 1;

  const updateQty = (itemName: string, delta: number) => {
    const current = getQty(itemName);
    const next = Math.max(1, current + delta);
    setQuantities({ ...quantities, [itemName]: next });
  };

  const getPaymentMethod = (itemName: string) => paymentMethods[itemName] || 'Cash';

  const togglePaymentMethod = (itemName: string, method: 'Cash' | 'UPI') => {
    setPaymentMethods({ ...paymentMethods, [itemName]: method });
  };

  const handlePlaceOrder = (product: ProductItem) => {
    const qty = getQty(product.name);
    const method = getPaymentMethod(product.name);
    const totalCost = product.rate * qty;
    
    // Process sale dynamically
    placePOSOrderDirect(product.name, product.rate, qty, product.category, 'POS Register Table', method);
    
    // Set feedback toast
    setSuccessMessage(`Order Placed (${method}): ${qty}x ${product.name} (Total: ₹${totalCost})`);
    setShowSuccess(true);

    // Reset quantity and payment method
    setQuantities({ ...quantities, [product.name]: 1 });
    setPaymentMethods({ ...paymentMethods, [product.name]: 'Cash' });
  };

  // Filter Catalog
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryTheme = (category: ProductItem['category']) => {
    switch (category) {
      case 'Tea':
        return {
          icon: <LocalCafeIcon sx={{ color: '#E09F3E', fontSize: '2rem' }} />,
          bg: '#FFFDF9',
          hoverBorder: '#E09F3E',
          shadow: 'rgba(224, 159, 62, 0.15)',
          badgeBg: 'rgba(224, 159, 62, 0.08)',
          accentText: '#E09F3E',
          btnBg: '#E09F3E',
          btnHover: '#C6872D',
        };
      case 'Coffee':
        return {
          icon: <CoffeeIcon sx={{ color: '#A94434', fontSize: '2rem' }} />,
          bg: '#FDFBFA',
          hoverBorder: '#A94434',
          shadow: 'rgba(169, 68, 52, 0.15)',
          badgeBg: 'rgba(169, 68, 52, 0.08)',
          accentText: '#A94434',
          btnBg: '#A94434',
          btnHover: '#8E3426',
        };
      case 'Snacks':
        return {
          icon: <CakeIcon sx={{ color: '#2D6A4F', fontSize: '2rem' }} />,
          bg: '#FAFCFA',
          hoverBorder: '#2D6A4F',
          shadow: 'rgba(45, 106, 79, 0.15)',
          badgeBg: 'rgba(45, 106, 79, 0.08)',
          accentText: '#2D6A4F',
          btnBg: '#2D6A4F',
          btnHover: '#1B4332',
        };
    }
  };

  const getCategoryColor = (cat: typeof selectedCategory) => {
    switch (cat) {
      case 'All': return '#9E2A2B'; // Spiced Crimson
      case 'Tea': return '#E09F3E'; // Spiced Saffron
      case 'Coffee': return '#A94434'; // Roasted Cacao
      case 'Snacks': return '#2D6A4F'; // Cardamom green
    }
  };

  return (
    <MainLayout>
      <Fade in timeout={500}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Branded Section Header */}
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
              <ShoppingBagIcon sx={{ color: '#9E2A2B', fontSize: '2rem' }} />
              ChaiTrack POS Billing Catalog
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontFamily: '"Outfit", sans-serif' }}>
              Tap products, adjust quantities, and instantly record store sales logs in Indian Rupees (₹)
            </Typography>
          </Box>

          {/* Filtering and Search Controls Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid rgba(224, 159, 62, 0.12)',
              backgroundColor: '#FFFFFF',
              boxShadow: '0px 8px 32px rgba(110, 27, 28, 0.03)',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', md: 'center' },
              gap: 3,
            }}
          >
            {/* Category Pills Filters */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {(['All', 'Tea', 'Coffee', 'Snacks'] as const).map((cat) => {
                const isActive = selectedCategory === cat;
                const catColor = getCategoryColor(cat);
                return (
                  <Button
                    key={cat}
                    variant={isActive ? 'contained' : 'outlined'}
                    onClick={() => setSelectedCategory(cat)}
                    sx={{
                      borderRadius: '24px',
                      px: 3,
                      py: 0.75,
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      borderColor: isActive ? 'transparent' : 'rgba(224, 159, 62, 0.25)',
                      color: isActive ? '#FFFFFF' : '#6E5D57',
                      backgroundColor: isActive ? catColor : 'transparent',
                      boxShadow: isActive ? `0px 4px 14px ${catColor}33` : 'none',
                      '&:hover': {
                        backgroundColor: isActive ? catColor : 'rgba(224, 159, 62, 0.05)',
                        borderColor: isActive ? 'transparent' : '#E09F3E',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    {cat}
                  </Button>
                );
              })}
            </Box>

            {/* Search Input Bar */}
            <TextField
              placeholder="Search by product name..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: { xs: '100%', md: '320px' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  backgroundColor: '#FFFDF9',
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#E09F3E' }} />
                    </InputAdornment>
                  ),
                }
              }}
            />
          </Paper>

          {/* Product Catalog Display Grid */}
          <Grid container spacing={3}>
            {filteredProducts.map((product) => {
              const qty = getQty(product.name);
              const theme = getCategoryTheme(product.category);
              
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.name}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderRadius: '16px',
                      border: '1.5px solid rgba(224, 159, 62, 0.12)',
                      backgroundColor: theme.bg,
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: theme.hoverBorder,
                        boxShadow: `0px 16px 36px ${theme.shadow}`,
                        transform: 'translateY(-6px)',
                        '& .category-badge': {
                          backgroundColor: theme.hoverBorder,
                          color: '#FFFFFF',
                        },
                      },
                    }}
                  >
                    {/* Category Badge top-right */}
                    <Box
                      className="category-badge"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        px: 1.5,
                        py: 0.25,
                        borderRadius: '12px',
                        backgroundColor: theme.badgeBg,
                        color: theme.accentText,
                        fontFamily: '"Outfit", sans-serif',
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        transition: 'all 0.2s',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {product.category.toUpperCase()}
                    </Box>

                    {/* Card Body */}
                    <Box sx={{ p: 3, pt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      {/* Product Visual Icon Shape */}
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '50%',
                          backgroundColor: theme.badgeBg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          transition: 'all 0.3s',
                          border: `1px solid ${theme.hoverBorder}1F`,
                        }}
                      >
                        {theme.icon}
                      </Box>

                      {/* Product Details */}
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontFamily: '"Outfit", sans-serif',
                          fontWeight: 800,
                          color: '#330F11',
                          mb: 0.5,
                          fontSize: '1.05rem',
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: '"Outfit", sans-serif',
                          fontWeight: 900,
                          color: theme.accentText,
                          mb: 2.5,
                        }}
                      >
                        ₹{product.rate}
                      </Typography>

                      <Divider sx={{ width: '100%', borderStyle: 'dashed', mb: 2, opacity: 0.5 }} />

                      {/* Qty Counters */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid rgba(224, 159, 62, 0.2)',
                          borderRadius: '24px',
                          overflow: 'hidden',
                          backgroundColor: '#FFFFFF',
                          mb: 2,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => updateQty(product.name, -1)}
                          sx={{
                            p: 0.75,
                            transition: 'all 0.2s',
                            '&:hover': {
                              backgroundColor: 'rgba(224, 159, 62, 0.12)',
                              transform: 'scale(1.1)',
                            }
                          }}
                        >
                          <RemoveIcon fontSize="small" sx={{ fontSize: '0.8rem' }} />
                        </IconButton>
                        <Typography
                          sx={{
                            px: 2,
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 850,
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
                            p: 0.75,
                            transition: 'all 0.2s',
                            '&:hover': {
                              backgroundColor: 'rgba(224, 159, 62, 0.12)',
                              transform: 'scale(1.1)',
                            }
                          }}
                        >
                          <AddIcon fontSize="small" sx={{ fontSize: '0.8rem' }} />
                        </IconButton>
                      </Box>

                      {/* Payment Method Selector */}
                      <Box
                        sx={{
                          display: 'flex',
                          backgroundColor: '#F7F4F3',
                          borderRadius: '20px',
                          p: 0.5,
                          mb: 1,
                          width: '100%',
                          border: '1px solid rgba(224, 159, 62, 0.08)',
                        }}
                      >
                        <Box
                          onClick={() => togglePaymentMethod(product.name, 'Cash')}
                          sx={{
                            flex: 1,
                            textAlign: 'center',
                            py: 0.75,
                            borderRadius: '16px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 750,
                            backgroundColor: getPaymentMethod(product.name) === 'Cash' ? '#FFFFFF' : 'transparent',
                            color: getPaymentMethod(product.name) === 'Cash' ? theme.accentText : '#6E5D57',
                            boxShadow: getPaymentMethod(product.name) === 'Cash' ? '0px 2px 8px rgba(0,0,0,0.06)' : 'none',
                            transition: 'all 0.2s',
                          }}
                        >
                          💵 Cash
                        </Box>
                        <Box
                          onClick={() => togglePaymentMethod(product.name, 'UPI')}
                          sx={{
                            flex: 1,
                            textAlign: 'center',
                            py: 0.75,
                            borderRadius: '16px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 750,
                            backgroundColor: getPaymentMethod(product.name) === 'UPI' ? '#FFFFFF' : 'transparent',
                            color: getPaymentMethod(product.name) === 'UPI' ? theme.accentText : '#6E5D57',
                            boxShadow: getPaymentMethod(product.name) === 'UPI' ? '0px 2px 8px rgba(0,0,0,0.06)' : 'none',
                            transition: 'all 0.2s',
                          }}
                        >
                          📱 UPI
                        </Box>
                      </Box>
                    </Box>

                    {/* Bottom Checkout Button */}
                    <Box sx={{ px: 3, pb: 3 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        className="btn-shine-hover"
                        onClick={() => handlePlaceOrder(product)}
                        sx={{
                          borderRadius: '12px',
                          backgroundColor: theme.btnBg,
                          color: '#FFFFFF',
                          fontFamily: '"Outfit", sans-serif',
                          fontWeight: 750,
                          fontSize: '0.85rem',
                          py: 1.1,
                          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          '&:hover': {
                            backgroundColor: theme.btnHover,
                            transform: 'translateY(-1px)',
                            boxShadow: `0px 6px 16px ${theme.shadow}`,
                          },
                        }}
                      >
                        Place Order (₹{product.rate * qty})
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              );
            })}

            {filteredProducts.length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Box sx={{ py: 8, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', color: '#6E5D57', fontWeight: 650 }}>
                    No products found matching your search.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Fade>

      {/* Place Order Success notification toast */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{
            width: '100%',
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 650,
            borderRadius: '12px',
            backgroundColor: '#27AE60',
            color: '#FFFFFF',
            '& .MuiAlert-icon': {
              color: '#FFFFFF',
            },
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};
