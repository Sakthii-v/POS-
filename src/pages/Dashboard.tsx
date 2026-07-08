import React from 'react';
import { Grid, Box } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import CoffeeIcon from '@mui/icons-material/Coffee';
import CakeIcon from '@mui/icons-material/Cake';
import InventoryIcon from '@mui/icons-material/Inventory';

import { StatCard } from '../components/dashboard/StatCard';
import { RecentOrdersTable } from '../components/dashboard/RecentOrdersTable';
import { QuickTerminal } from '../components/dashboard/QuickTerminal';
import { usePOS } from '../context/POSContext';

export const Dashboard: React.FC = () => {
  const {
    revenue,
    ordersCount,
    teaCount,
    coffeeCount,
    snacksCount,
    inventoryCount,
    orders,
  } = usePOS();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* 6 Dynamic Statistics Cards Grid */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Today's Revenue"
            value={`₹${revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            growth={revenue > 14820 ? `+${(((revenue - 14820) / 14820) * 100 + 14.2).toFixed(1)}%` : '+14.2%'}
            growthType="up"
            gradient="linear-gradient(135deg, #9E2A2B 0%, #C93B3C 100%)" // Spiced Crimson
            icon={<AttachMoneyIcon sx={{ color: '#FFFFFF' }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Total Orders"
            value={`${ordersCount} orders`}
            growth={ordersCount > 412 ? `+${(((ordersCount - 412) / 412) * 100 + 8.6).toFixed(1)}%` : '+8.6%'}
            growthType="up"
            gradient="linear-gradient(135deg, #782C22 0%, #9E2A2B 100%)" // Spiced Mahogany
            icon={<ShoppingBagIcon sx={{ color: '#FFFFFF' }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Tea Sold"
            value={`${teaCount} sips`}
            growth={teaCount > 284 ? `+${(((teaCount - 284) / 284) * 100 + 18.4).toFixed(1)}%` : '+18.4%'}
            growthType="up"
            gradient="linear-gradient(135deg, #E09F3E 0%, #F4D39D 100%)" // Spiced Honey Gold
            icon={<LocalCafeIcon sx={{ color: '#FFFFFF' }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Coffee Sold"
            value={`${coffeeCount} cups`}
            growth={coffeeCount > 96 ? `+${(((coffeeCount - 96) / 96) * 100 - 2.1).toFixed(1)}%` : '-2.1%'}
            growthType={coffeeCount >= 96 ? 'up' : 'down'}
            gradient="linear-gradient(135deg, #A94434 0%, #C85A48 100%)" // Rose Clay
            icon={<CoffeeIcon sx={{ color: '#FFFFFF' }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Snacks Sold"
            value={`${snacksCount} items`}
            growth={snacksCount > 142 ? `+${(((snacksCount - 142) / 142) * 100 + 11.5).toFixed(1)}%` : '+11.5%'}
            growthType="up"
            gradient="linear-gradient(135deg, #2D6A4F 0%, #40916C 100%)" // Cardamom Green
            icon={<CakeIcon sx={{ color: '#FFFFFF' }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Inventory Count"
            value={`${inventoryCount.toLocaleString()} items`}
            growth={inventoryCount < 1280 ? 'Stock Alert' : 'Stock OK'}
            growthType="up"
            gradient="linear-gradient(135deg, #6E4F51 0%, #7D5C58 100%)" // Rose Slate
            icon={<InventoryIcon sx={{ color: '#FFFFFF' }} />}
          />
        </Grid>
      </Grid>

      {/* POS Quick Terminal & Inventory manager in place of charts */}
      <QuickTerminal />

      {/* Dynamic Recent Orders Log Grid */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <RecentOrdersTable orders={orders} />
        </Grid>
      </Grid>
    </Box>
  );
};
