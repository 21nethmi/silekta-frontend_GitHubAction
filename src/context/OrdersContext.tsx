"use client";

import React, { createContext, useContext, useState } from "react";

export type OrderStatus = "In Progress" | "Completed" | "Cancelled";

export interface OrderItem {
  sku?: string;
  name: string;
  category: "paper" | "printing";
  qty: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerId?: string;
  customerName: string;
  products: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface ReturnItem {
  sku?: string;
  name: string;
  qty: number;
  unitPrice: number;
  refund: number;
  reason?: string;
}

export interface ReturnRecord {
  id: string;
  orderId: string;
  items: ReturnItem[];
  totalRefund: number;
  createdAt: string;
}

const seededOrders: Order[] = [
  {
    id: "ORD-1001",
    customerId: "CUST-1001",
    customerName: "Amal Perera",
    products: [
      { sku: "P001", name: "Premium Paper A4", category: "paper", qty: 2, unitPrice: 300 },
      { sku: "PR001", name: "Kraft Paper", category: "printing", qty: 1, unitPrice: 850 },
    ],
    total: 1450.0,
    status: "In Progress",
    createdAt: "2025-10-20T09:15:00",
  },
  {
    id: "ORD-1002",
    customerId: "CUST-1002",
    customerName: "Nimal Fernando",
    products: [
      { sku: "P002", name: "Ink Cartridge - Black", category: "printing", qty: 1, unitPrice: 750 },
    ],
    total: 750.0,
    status: "In Progress",
    createdAt: "2025-10-18T14:30:00",
  },
  {
    id: "ORD-1003",
    customerId: "CUST-1003",
    customerName: "Samanthi Jayasuriya",
    products: [
      { sku: "P003", name: "Ink Cartridge - Color", category: "printing", qty: 3, unitPrice: 800 },
      { sku: "P004", name: "Cardstock Paper", category: "paper", qty: 2, unitPrice: 400 },
    ],
    total: 4200.0,
    status: "Completed",
    createdAt: "2025-10-15T11:05:00",
  },
  {
    id: "ORD-1004",
    customerId: "CUST-1004",
    customerName: "Kamal Silva",
    products: [
      { sku: "PR004", name: "Paper Plates", category: "printing", qty: 2, unitPrice: 450 },
    ],
    total: 900.0,
    status: "Cancelled",
    createdAt: "2025-10-12T08:20:00",
  },
];

type ContextShape = {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  returns: ReturnRecord[];
  setReturns: React.Dispatch<React.SetStateAction<ReturnRecord[]>>;
};

const OrdersContext = createContext<ContextShape | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => seededOrders);
  const [returns, setReturns] = useState<ReturnRecord[]>([]);

  return (
    <OrdersContext.Provider value={{ orders, setOrders, returns, setReturns }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}

export default OrdersProvider;
