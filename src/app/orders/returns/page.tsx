"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getCustomerById, getCustomerByName } from "@/lib/customers";

type OrderStatus = "In Progress" | "Completed" | "Cancelled";

interface OrderItem {
  sku?: string;
  name: string;
  category: "paper" | "printing";
  qty: number;
  unitPrice: number;
}

interface Order {
  id: string;
  customerId?: string;
  customerName: string;
  products: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

interface ReturnItem {
  sku?: string;
  name: string;
  qty: number;
  unitPrice: number;
  refund: number;
  reason?: string;
}

export default function ReturnsPage() {
  const STORAGE_KEY = "silekta_orders";
  const RETURNS_KEY = "silekta_returns";

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [returnQtys, setReturnQtys] = useState<Record<number, number>>({});
  const [reasons, setReasons] = useState<Record<number, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as any[];
        const migrated: Order[] = parsed.map((o) => {
          if (!o) return o as Order;
          if (o.customerName || o.customerId) return o as Order;
          const custStr = o.customer as string | undefined;
          let customerId: string | undefined = undefined;
          let customerName = custStr ?? "";
          if (custStr) {
            const m = custStr.match(/^(CUST-[0-9]+)\s+—\s*(.*)$/);
            if (m) {
              customerId = m[1];
              customerName = m[2] ?? customerName;
            }
          }
          return { ...o, customerId, customerName } as Order;
        });
        setOrders(migrated);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Persist migrated shape immediately so other pages see stable customerId/customerName
  useEffect(() => {
    try {
      if (orders && orders.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      }
    } catch (e) {
      // ignore
    }
  }, [orders]);

  const searchParams = useSearchParams();

  useEffect(() => {
    const orderFromQuery = searchParams?.get("order") ?? "";
    if (orderFromQuery && orders.find((o) => o.id === orderFromQuery)) {
      setSelectedOrderId(orderFromQuery);
    }
  }, [orders, searchParams]);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) ?? null;

  const handleQtyChange = (idx: number, v: number) => {
    setReturnQtys((s) => ({ ...s, [idx]: v }));
  };

  const handleReasonChange = (idx: number, v: string) => {
    setReasons((s) => ({ ...s, [idx]: v }));
  };

  const computeRefund = () => {
    if (!selectedOrder) return 0;
    return selectedOrder.products.reduce((sum, p, idx) => {
      const q = Math.max(0, Math.min(p.qty, returnQtys[idx] || 0));
      return sum + q * p.unitPrice;
    }, 0);
  };

  const processReturn = () => {
    setMessage(null);
    if (!selectedOrder) {
      setMessage("Select an order first");
      return;
    }

    const itemsToReturn: ReturnItem[] = [];
    selectedOrder.products.forEach((p, idx) => {
      const q = Math.max(0, Math.min(p.qty, returnQtys[idx] || 0));
      if (q > 0) {
        itemsToReturn.push({
          sku: p.sku,
          name: p.name,
          qty: q,
          unitPrice: p.unitPrice,
          refund: q * p.unitPrice,
          reason: reasons[idx] || undefined,
        });
      }
    });

    if (!itemsToReturn.length) {
      setMessage("Enter at least one return quantity > 0");
      return;
    }

    // Update orders array
    const updatedOrders = orders.map((o) => {
      if (o.id !== selectedOrder.id) return o;
      const updatedProducts = o.products
        .map((p, idx) => {
          const q = Math.max(0, Math.min(p.qty, returnQtys[idx] || 0));
          return { ...p, qty: p.qty - q };
        })
        .filter((p) => p.qty > 0);
      const newTotal = updatedProducts.reduce(
        (s, p) => s + p.qty * p.unitPrice,
        0
      );
      return { ...o, products: updatedProducts, total: newTotal };
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
    } catch (e) {
      // ignore
    }

    // Save return record
    try {
      const raw = localStorage.getItem(RETURNS_KEY);
      const prev = raw ? (JSON.parse(raw) as any[]) : [];
      const ret = {
        id: `RET-${Date.now()}`,
        orderId: selectedOrder.id,
        items: itemsToReturn,
        totalRefund: itemsToReturn.reduce((s, it) => s + it.refund, 0),
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(RETURNS_KEY, JSON.stringify([ret, ...prev]));
    } catch (e) {
      // ignore
    }

    setReturnQtys({});
    setReasons({});
    setMessage("Return recorded successfully");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Navbar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Returns</h1>
              <p className="text-sm text-gray-700">
                Register returned items and update orders
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/orders"
                className="px-3 py-2 bg-[#297772] text-white rounded-md text-sm hover:bg-[#78b7a9]"
              >
                Back to Orders
              </Link>
              <Link
                href="/orders/returns/history"
                className="px-3 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                History
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-[900px] mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-4">
                <label className="text-sm text-gray-700">Select Order</label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border rounded-md text-gray-400"
                >
                  <option value="">-- choose order --</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id} — {o.customerName} (
                      {o.products.reduce((s, p) => s + p.qty, 0)} items)
                    </option>
                  ))}
                </select>
              </div>

              {selectedOrder ? (
                <div>
                  {(() => {
                    // show customer info by id if available, otherwise try name-based lookup
                    const cById = selectedOrder.customerId
                      ? getCustomerById(selectedOrder.customerId)
                      : null;
                    const cByName = !cById
                      ? getCustomerByName(selectedOrder.customerName)
                      : null;
                    const c = cById || cByName;
                    if (c) {
                      return (
                        <div className="mb-3">
                          <div className="font-medium text-gray-500">{c.name}</div>
                          <div className="text-xs text-gray-700">
                            {c.phone} • {c.email}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  <div className="text-sm text-gray-700 mb-2">
                    Products in order
                  </div>
                  <div className="space-y-2">
                    {selectedOrder.products.map((p, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-700">{p.name}</div>
                          <div className="text-xs text-gray-700">
                            {p.sku ?? ""} •{" "}
                            {p.category === "paper"
                              ? "Paper-based"
                              : "Printing"}
                          </div>
                        </div>
                        <div className="w-48 text-right">
                          <div className="text-sm text-gray-700">
                            Ordered: {p.qty}
                          </div>
                          <div className="flex items-center gap-2 mt-2 justify-end">
                            <input
                              type="number"
                              min={0}
                              max={p.qty}
                              value={returnQtys[idx] ?? 0}
                              onChange={(e) =>
                                handleQtyChange(idx, Number(e.target.value))
                              }
                              className="w-20 px-2 py-1 border rounded-md text-gray-600"
                            />
                          </div>
                          <input
                            placeholder="Reason (optional)"
                            value={reasons[idx] ?? ""}
                            onChange={(e) =>
                              handleReasonChange(idx, e.target.value)
                            }
                            className="mt-2 w-full px-2 py-1 border rounded-md text-gray-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">Refund amount</div>
                    <div className="text-lg font-semibold text-black">
                      Rs {computeRefund().toFixed(2)}
                    </div>
                  </div>

                  {message && (
                    <div className="mt-3 text-sm text-emerald-600">
                      {message}
                    </div>
                  )}

                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setSelectedOrderId("");
                        setReturnQtys({});
                        setReasons({});
                        setMessage(null);
                      }}
                      className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                    >
                      Reset
                    </button>
                    <button
                      onClick={processReturn}
                      className="px-4 py-2 rounded-md bg-[#0B5351] text-white hover:bg-[#0B5351]/90"
                    >
                      Process Return
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Select an order to begin
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
