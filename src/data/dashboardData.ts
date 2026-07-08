export interface MonthlyRevenue {
  name: string;
  revenue: number;
  orders: number;
}

export interface WeeklySales {
  day: string;
  sales: number;
}

export interface POSOrder {
  id: string;
  customerName: string;
  product: string;
  quantity: number;
  amount: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

export interface StatItem {
  title: string;
  value: string;
  growth: string;
  growthType: 'up' | 'down';
  gradient: string;
}

export const monthlyRevenueData: MonthlyRevenue[] = [
  { name: 'Jan', revenue: 4200, orders: 840 },
  { name: 'Feb', revenue: 4800, orders: 960 },
  { name: 'Mar', revenue: 5100, orders: 1020 },
  { name: 'Apr', revenue: 5800, orders: 1160 },
  { name: 'May', revenue: 6300, orders: 1260 },
  { name: 'Jun', revenue: 7100, orders: 1420 },
  { name: 'Jul', revenue: 7500, orders: 1500 },
  { name: 'Aug', revenue: 7200, orders: 1440 },
  { name: 'Sep', revenue: 6800, orders: 1360 },
  { name: 'Oct', revenue: 7900, orders: 1580 },
  { name: 'Nov', revenue: 8400, orders: 1680 },
  { name: 'Dec', revenue: 9500, orders: 1900 },
];

export const weeklySalesData: WeeklySales[] = [
  { day: 'Mon', sales: 120 },
  { day: 'Tue', sales: 145 },
  { day: 'Wed', sales: 130 },
  { day: 'Thu', sales: 165 },
  { day: 'Fri', sales: 210 },
  { day: 'Sat', sales: 245 },
  { day: 'Sun', sales: 195 },
];

export const recentOrders: POSOrder[] = [
  { id: '#CT-1084', customerName: 'Aarav Sharma', product: 'Cardamom Chai', quantity: 2, amount: 6.50, status: 'Completed' },
  { id: '#CT-1083', customerName: 'Neha Patel', product: 'Iced Matcha Latte', quantity: 1, amount: 4.80, status: 'Completed' },
  { id: '#CT-1082', customerName: 'Vikram Singh', product: 'Masala Chai + Honey Scone', quantity: 1, amount: 7.20, status: 'Pending' },
  { id: '#CT-1081', customerName: 'Priya Nair', product: 'Hibiscus Rooibos Tea', quantity: 3, amount: 11.40, status: 'Completed' },
  { id: '#CT-1080', customerName: 'Rajesh Kumar', product: 'Espresso Macchiato', quantity: 1, amount: 3.50, status: 'Cancelled' },
  { id: '#CT-1079', customerName: 'Ananya Rao', product: 'Ginger Lemon Herbal Tea', quantity: 2, amount: 7.60, status: 'Completed' },
  { id: '#CT-1078', customerName: 'Devendra Patel', product: 'Cinnamon Bun + Chai Latte', quantity: 2, amount: 10.50, status: 'Completed' },
];

export const dashboardStatsData = {
  todayRevenue: {
    title: "Today's Revenue",
    value: '$1,842.50',
    growth: '+14.2%',
    growthType: 'up' as const,
    gradient: 'linear-gradient(135deg, #9E2A2B 0%, #C93B3C 100%)', // Spiced Crimson
  },
  totalOrders: {
    title: 'Total Orders',
    value: '382 orders',
    growth: '+8.6%',
    growthType: 'up' as const,
    gradient: 'linear-gradient(135deg, #782C22 0%, #9E2A2B 100%)', // Spiced Mahogany
  },
  teaSold: {
    title: 'Tea Sold',
    value: '264 sips',
    growth: '+18.4%',
    growthType: 'up' as const,
    gradient: 'linear-gradient(135deg, #E09F3E 0%, #F4D39D 100%)', // Spiced Honey Gold
  },
  coffeeSold: {
    title: 'Coffee Sold',
    value: '84 cups',
    growth: '-2.1%',
    growthType: 'down' as const,
    gradient: 'linear-gradient(135deg, #A94434 0%, #C85A48 100%)', // Rose Clay
  },
  snacksSold: {
    title: 'Snacks Sold',
    value: '112 items',
    growth: '+11.5%',
    growthType: 'up' as const,
    gradient: 'linear-gradient(135deg, #2D6A4F 0%, #40916C 100%)', // Cardamom Green
  },
  inventoryCount: {
    title: 'Inventory Count',
    value: '1,240 items',
    growth: 'Stock OK',
    growthType: 'up' as const,
    gradient: 'linear-gradient(135deg, #6E4F51 0%, #7D5C58 100%)', // Rose Slate
  },
};
