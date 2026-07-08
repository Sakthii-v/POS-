import React, { createContext, useContext, useState } from 'react';

export interface ProductItem {
  name: string;
  rate: number;
  category: 'Tea' | 'Coffee' | 'Snacks';
}

export interface InventoryItem {
  name: string;
  level: number; // percentage 0-100
  unit: string;
}

export interface POSOrder {
  id: string;
  customerName: string;
  product: string;
  quantity: number;
  amount: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
  paymentMethod: 'Cash' | 'UPI';
}

interface POSContextType {
  products: ProductItem[];
  inventory: InventoryItem[];
  orders: POSOrder[];
  revenue: number;
  ordersCount: number;
  teaCount: number;
  coffeeCount: number;
  snacksCount: number;
  inventoryCount: number;
  openingCash: number;
  cashSales: number;
  upiSales: number;
  placePOSOrderDirect: (
    name: string,
    rate: number,
    quantity: number,
    category: ProductItem['category'],
    customerName?: string,
    paymentMethod?: 'Cash' | 'UPI'
  ) => void;
  restockIngredient: (name: string) => void;
  addNewProduct: (name: string, rate: number, category: ProductItem['category']) => void;
  resetShiftSales: () => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial Products Catalog in Indian Rupees (₹)
  const [products, setProducts] = useState<ProductItem[]>([
    // Teas
    { name: 'ChaiTrack Special Tea', rate: 15, category: 'Tea' },
    { name: 'Ginger Tea', rate: 15, category: 'Tea' },
    { name: 'Lemon Tea', rate: 18, category: 'Tea' },
    { name: 'Iranian Tea', rate: 25, category: 'Tea' },
    // Coffees
    { name: 'Black Coffee', rate: 25, category: 'Coffee' },
    { name: 'Milk Coffee', rate: 35, category: 'Coffee' },
    { name: 'Cold Coffee', rate: 50, category: 'Coffee' },
    // Snacks
    { name: 'Samosa', rate: 15, category: 'Snacks' },
    { name: 'Vada', rate: 12, category: 'Snacks' },
    { name: 'Biscuit', rate: 5, category: 'Snacks' },
    { name: 'Puffs', rate: 20, category: 'Snacks' },
  ]);

  // 2. Raw Stock Levels
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { name: 'Assam Tea Leaves', level: 85, unit: '8.5 kg' },
    { name: 'Whole Milk', level: 60, unit: '3.0 gal' },
    { name: 'Cardamom Pods', level: 15, unit: '0.15 kg' },
    { name: 'Sugar Sacks', level: 90, unit: '9.0 kg' },
    { name: 'Paper Cups', level: 40, unit: '400 units' },
  ]);

  // 3. Orders Log (Pre-populated with mock orders translated to Indian Rupees ₹)
  const [orders, setOrders] = useState<POSOrder[]>([
    { id: '#CT-1084', customerName: 'Aarav Sharma', product: '2x ChaiTrack Special Tea', quantity: 2, amount: 30, status: 'Completed', paymentMethod: 'Cash' },
    { id: '#CT-1083', customerName: 'Neha Patel', product: '1x Iranian Tea', quantity: 1, amount: 25, status: 'Completed', paymentMethod: 'UPI' },
    { id: '#CT-1082', customerName: 'Vikram Singh', product: '1x Ginger Tea + Puffs', quantity: 2, amount: 35, status: 'Pending', paymentMethod: 'Cash' },
    { id: '#CT-1081', customerName: 'Priya Nair', product: '3x Lemon Tea', quantity: 3, amount: 54, status: 'Completed', paymentMethod: 'Cash' },
    { id: '#CT-1080', customerName: 'Rajesh Kumar', product: '1x Cold Coffee', quantity: 1, amount: 50, status: 'Cancelled', paymentMethod: 'UPI' },
    { id: '#CT-1079', customerName: 'Ananya Rao', product: '2x Ginger Tea', quantity: 2, amount: 30, status: 'Completed', paymentMethod: 'Cash' },
    { id: '#CT-1078', customerName: 'Devendra Patel', product: '2x Milk Coffee', quantity: 2, amount: 70, status: 'Completed', paymentMethod: 'UPI' },
  ]);

  // 4. Live Drawer Statistics
  const openingCash = 1000; // Constant change change change
  const [cashSales, setCashSales] = useState(1420);
  const [upiSales, setUpiSales] = useState(2580);

  // Core dynamic totals
  const [revenue, setRevenue] = useState(14820); // Base revenue in Rupees (Cash + UPI + baseline)
  const [ordersCount, setOrdersCount] = useState(412); // Base total orders count
  const [teaCount, setTeaCount] = useState(284);
  const [coffeeCount, setCoffeeCount] = useState(96);
  const [snacksCount, setSnacksCount] = useState(142);
  const [inventoryCount, setInventoryCount] = useState(1280);

  // Directly place an order and update all states
  const placePOSOrderDirect = (
    name: string,
    rate: number,
    quantity: number,
    category: ProductItem['category'],
    customerName?: string,
    paymentMethod: 'Cash' | 'UPI' = 'Cash'
  ) => {
    const saleAmount = rate * quantity;

    // A. Update metrics
    setRevenue((prev) => prev + saleAmount);
    setOrdersCount((prev) => prev + 1);
    setInventoryCount((prev) => Math.max(0, prev - quantity));

    if (paymentMethod === 'UPI') {
      setUpiSales((prev) => prev + saleAmount);
    } else {
      setCashSales((prev) => prev + saleAmount);
    }

    if (category === 'Tea') {
      setTeaCount((prev) => prev + quantity);
    } else if (category === 'Coffee') {
      setCoffeeCount((prev) => prev + quantity);
    } else if (category === 'Snacks') {
      setSnacksCount((prev) => prev + quantity);
    }

    // B. Prepend transaction log
    const ticketId = `#CT-${1078 + orders.length + 1}`;
    const newOrder: POSOrder = {
      id: ticketId,
      customerName: customerName || 'Quick POS Cashier',
      product: `${quantity}x ${name}`,
      quantity: quantity,
      amount: saleAmount,
      status: 'Completed',
      paymentMethod,
    };
    setOrders((prev) => [newOrder, ...prev]);

    // C. Deplete raw ingredients
    setInventory((prevInventory) => {
      return prevInventory.map((ingredient) => {
        let usage = 0;
        if (category === 'Tea') {
          if (ingredient.name === 'Assam Tea Leaves') usage = 2 * quantity;
          if (ingredient.name === 'Whole Milk') usage = 3 * quantity;
          if (ingredient.name === 'Cardamom Pods' && name.includes('Special')) usage = 6 * quantity;
        } else if (category === 'Coffee') {
          if (ingredient.name === 'Whole Milk' && name.includes('Milk')) usage = 5 * quantity;
          if (ingredient.name === 'Paper Cups') usage = 2 * quantity;
        } else {
          // Snacks
          if (ingredient.name === 'Paper Cups') usage = 1 * quantity;
        }

        // Paper cups are consumed for hot drinks
        if (category !== 'Snacks' && ingredient.name === 'Paper Cups') {
          usage += 1 * quantity;
        }

        const newLevel = Math.max(0, ingredient.level - usage);
        
        let newUnit = ingredient.unit;
        const matches = ingredient.unit.match(/^([\d.]+)\s*(.*)$/);
        if (matches) {
          const numericPart = parseFloat(matches[1]);
          const unitPart = matches[2];
          const nextNumeric = Math.max(0, numericPart - (numericPart * (usage / 100)));
          newUnit = `${nextNumeric.toFixed(2)} ${unitPart}`;
        }

        return {
          ...ingredient,
          level: newLevel,
          unit: newUnit,
        };
      });
    });
  };

  // Restock raw inventory items
  const restockIngredient = (name: string) => {
    setInventory((prev) =>
      prev.map((ingredient) => {
        if (ingredient.name === name) {
          let restoredUnit = ingredient.unit;
          if (name === 'Assam Tea Leaves') restoredUnit = '10.0 kg';
          else if (name === 'Whole Milk') restoredUnit = '5.0 gal';
          else if (name === 'Cardamom Pods') restoredUnit = '1.0 kg';
          else if (name === 'Sugar Sacks') restoredUnit = '10.0 kg';
          else if (name === 'Paper Cups') restoredUnit = '1000 units';

          return {
            ...ingredient,
            level: 100,
            unit: restoredUnit,
          };
        }
        return ingredient;
      })
    );

    // Boost the global raw count
    setInventoryCount((prev) => prev + 150);
  };

  // Register a new product item in the catalogue
  const addNewProduct = (name: string, rate: number, category: ProductItem['category']) => {
    const newItem: ProductItem = { name, rate, category };
    setProducts((prev) => [...prev, newItem]);
    
    // Add dynamic increment to global stock representation
    setInventoryCount((prev) => prev + 30);
  };

  // Reset shift counts when closing shift drawer
  const resetShiftSales = () => {
    setCashSales(0);
    setUpiSales(0);
    // clear dynamic orders placed in this specific shift session if wanted, or just keep history
  };

  return (
    <POSContext.Provider
      value={{
        products,
        inventory,
        orders,
        revenue,
        ordersCount,
        teaCount,
        coffeeCount,
        snacksCount,
        inventoryCount,
        openingCash,
        cashSales,
        upiSales,
        placePOSOrderDirect,
        restockIngredient,
        addNewProduct,
        resetShiftSales,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
