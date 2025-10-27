export interface InventoryItem {
  id: string;
  product: string;
  category: string;
  quantity: number;
  unitPrice: number;
  location: string;
  lastUpdated: string;
}

export interface OrderItem {
  orderId: string;
  customer: string;
  product: string;
  quantity: number;
  totalAmount: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
  orderDate: string;
}

export interface PurchaseItem {
  purchaseId: string;
  supplier: string;
  product: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  purchaseDate: string;
  deliveryDate: string;
}

export interface SaleItem {
  saleId: string;
  customer: string;
  product: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  profit: number;
  saleDate: string;
}

export type ReportDataItem = InventoryItem | OrderItem | PurchaseItem | SaleItem;

export interface ColumnDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[];
}

export const sampleData = {
  inventory: [
    {
      id: 'INV001',
      product: 'Paper Cups 12oz (White)',
      category: 'Disposable Cups',
      quantity: 2500,
      unitPrice: 0.15,
      location: 'Warehouse A',
      lastUpdated: '2025-10-20',
    },
    {
      id: 'INV002',
      product: 'Paper Plates 9" (Round)',
      category: 'Disposable Plates',
      quantity: 1800,
      unitPrice: 0.25,
      location: 'Warehouse B',
      lastUpdated: '2025-10-22',
    },
    {
      id: 'INV003',
      product: 'Cardboard Boxes (Medium)',
      category: 'Packaging',
      quantity: 450,
      unitPrice: 2.50,
      location: 'Warehouse A',
      lastUpdated: '2025-10-25',
    },
    {
      id: 'INV004',
      product: 'Wooden Cutlery Set',
      category: 'Disposable Utensils',
      quantity: 3200,
      unitPrice: 0.35,
      location: 'Warehouse C',
      lastUpdated: '2025-10-18',
    },
    {
      id: 'INV005',
      product: 'Paper Napkins (White)',
      category: 'Disposables',
      quantity: 5000,
      unitPrice: 0.05,
      location: 'Warehouse A',
      lastUpdated: '2025-10-23',
    },
    {
      id: 'INV006',
      product: 'Coffee Cups with Lids 16oz',
      category: 'Disposable Cups',
      quantity: 1200,
      unitPrice: 0.45,
      location: 'Warehouse B',
      lastUpdated: '2025-10-21',
    },
    {
      id: 'INV007',
      product: 'Paper Bowls 12oz',
      category: 'Disposable Plates',
      quantity: 980,
      unitPrice: 0.30,
      location: 'Warehouse C',
      lastUpdated: '2025-10-19',
    },
    {
      id: 'INV008',
      product: 'Kraft Paper Bags (Small)',
      category: 'Packaging',
      quantity: 1500,
      unitPrice: 0.20,
      location: 'Warehouse A',
      lastUpdated: '2025-10-24',
    },
  ] as InventoryItem[],
  orders: [
    {
      orderId: 'ORD2025001',
      customer: 'Green Cafe Chain',
      product: 'Paper Cups 12oz (White)',
      quantity: 500,
      totalAmount: 75.00,
      status: 'Completed',
      orderDate: '2025-10-15',
    },
    {
      orderId: 'ORD2025002',
      customer: 'Party Supplies Plus',
      product: 'Paper Plates 9" (Round)',
      quantity: 300,
      totalAmount: 75.00,
      status: 'Pending',
      orderDate: '2025-10-18',
    },
    {
      orderId: 'ORD2025003',
      customer: 'Fast Food Express',
      product: 'Wooden Cutlery Set',
      quantity: 800,
      totalAmount: 280.00,
      status: 'Completed',
      orderDate: '2025-10-20',
    },
    {
      orderId: 'ORD2025004',
      customer: 'Eco Restaurant Group',
      product: 'Coffee Cups with Lids 16oz',
      quantity: 400,
      totalAmount: 180.00,
      status: 'Pending',
      orderDate: '2025-10-22',
    },
    {
      orderId: 'ORD2025005',
      customer: 'Bakery Delights',
      product: 'Kraft Paper Bags (Small)',
      quantity: 250,
      totalAmount: 50.00,
      status: 'Cancelled',
      orderDate: '2025-10-24',
    },
    {
      orderId: 'ORD2025006',
      customer: 'Catering Solutions Ltd',
      product: 'Paper Napkins (White)',
      quantity: 1000,
      totalAmount: 50.00,
      status: 'Completed',
      orderDate: '2025-10-23',
    },
  ] as OrderItem[],
  purchases: [
    {
      purchaseId: 'PUR2025001',
      supplier: 'Paper Products Wholesale',
      product: 'Paper Cups 12oz (White)',
      quantity: 3000,
      unitCost: 0.10,
      totalCost: 300.00,
      purchaseDate: '2025-10-10',
      deliveryDate: '2025-10-15',
    },
    {
      purchaseId: 'PUR2025002',
      supplier: 'Eco Supplies Inc',
      product: 'Wooden Cutlery Set',
      quantity: 5000,
      unitCost: 0.25,
      totalCost: 1250.00,
      purchaseDate: '2025-10-12',
      deliveryDate: '2025-10-18',
    },
    {
      purchaseId: 'PUR2025003',
      supplier: 'Packaging Solutions Co',
      product: 'Cardboard Boxes (Medium)',
      quantity: 600,
      unitCost: 1.80,
      totalCost: 1080.00,
      purchaseDate: '2025-10-16',
      deliveryDate: '2025-10-20',
    },
    {
      purchaseId: 'PUR2025004',
      supplier: 'Disposable Tableware Ltd',
      product: 'Paper Plates 9" (Round)',
      quantity: 2500,
      unitCost: 0.18,
      totalCost: 450.00,
      purchaseDate: '2025-10-14',
      deliveryDate: '2025-10-19',
    },
    {
      purchaseId: 'PUR2025005',
      supplier: 'Coffee Shop Supplies',
      product: 'Coffee Cups with Lids 16oz',
      quantity: 1500,
      unitCost: 0.35,
      totalCost: 525.00,
      purchaseDate: '2025-10-17',
      deliveryDate: '2025-10-22',
    },
    {
      purchaseId: 'PUR2025006',
      supplier: 'Green Paper Manufacturing',
      product: 'Paper Napkins (White)',
      quantity: 10000,
      unitCost: 0.03,
      totalCost: 300.00,
      purchaseDate: '2025-10-15',
      deliveryDate: '2025-10-21',
    },
  ] as PurchaseItem[],
  sales: [
    {
      saleId: 'SAL2025001',
      customer: 'Green Cafe Chain',
      product: 'Paper Cups 12oz (White)',
      quantity: 500,
      unitPrice: 0.15,
      totalAmount: 75.00,
      profit: 25.00,
      saleDate: '2025-10-16',
    },
    {
      saleId: 'SAL2025002',
      customer: 'Party Supplies Plus',
      product: 'Paper Plates 9" (Round)',
      quantity: 300,
      unitPrice: 0.25,
      totalAmount: 75.00,
      profit: 21.00,
      saleDate: '2025-10-19',
    },
    {
      saleId: 'SAL2025003',
      customer: 'Fast Food Express',
      product: 'Wooden Cutlery Set',
      quantity: 800,
      unitPrice: 0.35,
      totalAmount: 280.00,
      profit: 80.00,
      saleDate: '2025-10-21',
    },
    {
      saleId: 'SAL2025004',
      customer: 'Eco Restaurant Group',
      product: 'Coffee Cups with Lids 16oz',
      quantity: 400,
      unitPrice: 0.45,
      totalAmount: 180.00,
      profit: 40.00,
      saleDate: '2025-10-23',
    },
    {
      saleId: 'SAL2025005',
      customer: 'Catering Solutions Ltd',
      product: 'Paper Napkins (White)',
      quantity: 1000,
      unitPrice: 0.05,
      totalAmount: 50.00,
      profit: 20.00,
      saleDate: '2025-10-25',
    },
    {
      saleId: 'SAL2025006',
      customer: 'Urban Food Trucks',
      product: 'Paper Bowls 12oz',
      quantity: 350,
      unitPrice: 0.30,
      totalAmount: 105.00,
      profit: 28.00,
      saleDate: '2025-10-24',
    },
  ] as SaleItem[],
};

export const columnConfig: Record<string, ColumnDefinition[]> = {
  inventory: [
    { key: 'id', label: 'ID', type: 'text' },
    { key: 'product', label: 'Product', type: 'text' },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: ['Disposable Cups', 'Disposable Plates', 'Disposable Utensils', 'Packaging', 'Disposables'],
    },
    { key: 'quantity', label: 'Quantity', type: 'number' },
    { key: 'unitPrice', label: 'Unit Price', type: 'number' },
    {
      key: 'location',
      label: 'Location',
      type: 'select',
      options: ['Warehouse A', 'Warehouse B', 'Warehouse C'],
    },
    { key: 'lastUpdated', label: 'Last Updated', type: 'date' },
  ],
  orders: [
    { key: 'orderId', label: 'Order ID', type: 'text' },
    { key: 'customer', label: 'Customer', type: 'text' },
    { key: 'product', label: 'Product', type: 'text' },
    { key: 'quantity', label: 'Quantity', type: 'number' },
    { key: 'totalAmount', label: 'Total Amount', type: 'number' },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: ['Completed', 'Pending', 'Cancelled'],
    },
    { key: 'orderDate', label: 'Order Date', type: 'date' },
  ],
  purchases: [
    { key: 'purchaseId', label: 'Purchase ID', type: 'text' },
    { key: 'supplier', label: 'Supplier', type: 'text' },
    { key: 'product', label: 'Product', type: 'text' },
    { key: 'quantity', label: 'Quantity', type: 'number' },
    { key: 'unitCost', label: 'Unit Cost', type: 'number' },
    { key: 'totalCost', label: 'Total Cost', type: 'number' },
    { key: 'purchaseDate', label: 'Purchase Date', type: 'date' },
    { key: 'deliveryDate', label: 'Delivery Date', type: 'date' },
  ],
  sales: [
    { key: 'saleId', label: 'Sale ID', type: 'text' },
    { key: 'customer', label: 'Customer', type: 'text' },
    { key: 'product', label: 'Product', type: 'text' },
    { key: 'quantity', label: 'Quantity', type: 'number' },
    { key: 'unitPrice', label: 'Unit Price', type: 'number' },
    { key: 'totalAmount', label: 'Total Amount', type: 'number' },
    { key: 'profit', label: 'Profit', type: 'number' },
    { key: 'saleDate', label: 'Sale Date', type: 'date' },
  ],
};