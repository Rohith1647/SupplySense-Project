import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface StockItem {
  id: string;
  companyId: string;
  companyName: string;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  locationTag: string;
  category: string;
  bomParent: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  updatedAt: string;
}

export const INITIAL_INVENTORY: StockItem[] = [
  // Apex Microelectronics (c1)
  {
    id: 's1',
    companyId: 'c1',
    companyName: 'Apex Microelectronics',
    name: '32-Bit Microcontrollers (MCU-550)',
    sku: 'MCU-APX-8840',
    quantity: 45000,
    unit: 'Units',
    locationTag: 'Shenzhen',
    category: 'Semiconductors',
    bomParent: 'Smart Autonomous Gateway',
    criticality: 'critical',
    updatedAt: new Date().toISOString()
  },
  {
    id: 's2',
    companyId: 'c1',
    companyName: 'Apex Microelectronics',
    name: 'High-Density Lithium Battery Cells (21700)',
    sku: 'BAT-APX-9901',
    quantity: 12000,
    unit: 'Units',
    locationTag: 'Taiwan Strait',
    category: 'Energy Storage',
    bomParent: 'EV Battery Management Unit',
    criticality: 'high',
    updatedAt: new Date().toISOString()
  },
  {
    id: 's3',
    companyId: 'c1',
    companyName: 'Apex Microelectronics',
    name: 'Optoelectronic Sensors',
    sku: 'SNS-APX-3310',
    quantity: 28000,
    unit: 'Units',
    locationTag: 'Tokyo',
    category: 'Sensors',
    bomParent: 'Industrial Robotics Arm',
    criticality: 'medium',
    updatedAt: new Date().toISOString()
  },

  // GlobalTech Logistics (c2)
  {
    id: 's4',
    companyId: 'c2',
    companyName: 'GlobalTech Logistics',
    name: 'Standard 40ft High-Cube Freight Containers',
    sku: 'CNT-GTL-40HC',
    quantity: 850,
    unit: 'Containers',
    locationTag: 'Rotterdam',
    category: 'Shipping Assets',
    bomParent: 'Intermodal Freight Service',
    criticality: 'critical',
    updatedAt: new Date().toISOString()
  },
  {
    id: 's5',
    companyId: 'c2',
    companyName: 'GlobalTech Logistics',
    name: 'Cold-Chain Refrigerated Containers (Reefer)',
    sku: 'CNT-GTL-RF20',
    quantity: 320,
    unit: 'Containers',
    locationTag: 'Hamburg',
    category: 'Cold Chain',
    bomParent: 'Perishable Express Route',
    criticality: 'high',
    updatedAt: new Date().toISOString()
  },

  // Acme Supply Systems (c3)
  {
    id: 's6',
    companyId: 'c3',
    companyName: 'Acme Supply Systems',
    name: 'Precision Automotive Gearboxes',
    sku: 'GRB-ACM-700',
    quantity: 3500,
    unit: 'Units',
    locationTag: 'Stuttgart',
    category: 'Automotive',
    bomParent: 'Electric Powertrain Axle',
    criticality: 'high',
    updatedAt: new Date().toISOString()
  },
  {
    id: 's7',
    companyId: 'c3',
    companyName: 'Acme Supply Systems',
    name: 'Silica Wafer Substrates (300mm)',
    sku: 'WFR-ACM-300',
    quantity: 18000,
    unit: 'Units',
    locationTag: 'Taiwan Strait',
    category: 'Raw Wafer',
    bomParent: '32-Bit Microcontrollers (MCU-550)',
    criticality: 'critical',
    updatedAt: new Date().toISOString()
  },

  // Nexus Pharma Global (c4)
  {
    id: 's8',
    companyId: 'c4',
    companyName: 'Nexus Pharma Global',
    name: 'Cryogenic Vaccine Vials',
    sku: 'PHR-NEX-001',
    quantity: 95000,
    unit: 'Units',
    locationTag: 'Basel',
    category: 'Medical',
    bomParent: 'Biopharma Cold Distribution',
    criticality: 'high',
    updatedAt: new Date().toISOString()
  },

  // Titan Heavy Machinery (c5)
  {
    id: 's9',
    companyId: 'c5',
    companyName: 'Titan Heavy Machinery',
    name: 'Hydraulic Cylinder Assemblies',
    sku: 'HYD-TTN-442',
    quantity: 1400,
    unit: 'Units',
    locationTag: 'Los Angeles',
    category: 'Hydraulics',
    bomParent: 'Heavy Excavator Chassis',
    criticality: 'medium',
    updatedAt: new Date().toISOString()
  }
];

interface InventoryContextType {
  inventory: StockItem[];
  companyInventory: StockItem[];
  addStockItem: (item: Omit<StockItem, 'id' | 'companyId' | 'companyName' | 'updatedAt'>) => void;
  updateStockItem: (id: string, item: Partial<StockItem>) => void;
  deleteStockItem: (id: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentCompany } = useAuth();
  
  const [inventory, setInventory] = useState<StockItem[]>(() => {
    const saved = localStorage.getItem('supplysense_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  useEffect(() => {
    localStorage.setItem('supplysense_inventory', JSON.stringify(inventory));
  }, [inventory]);

  const companyInventory = inventory.filter(item => item.companyId === currentCompany.id);

  const addStockItem = (itemData: Omit<StockItem, 'id' | 'companyId' | 'companyName' | 'updatedAt'>) => {
    const newItem: StockItem = {
      ...itemData,
      id: `stock_${Date.now()}`,
      companyId: currentCompany.id,
      companyName: currentCompany.name,
      updatedAt: new Date().toISOString()
    };
    setInventory(prev => [newItem, ...prev]);
  };

  const updateStockItem = (id: string, updatedFields: Partial<StockItem>) => {
    setInventory(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updatedFields, updatedAt: new Date().toISOString() } : item))
    );
  };

  const deleteStockItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        companyInventory,
        addStockItem,
        updateStockItem,
        deleteStockItem
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
