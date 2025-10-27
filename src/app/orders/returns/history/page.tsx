"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface ReturnItem {
  sku?: string;
  name: string;
  qty: number;
  unitPrice: number;
  refund: number;
  reason?: string;
}

interface ReturnRecord {
  id: string;
  orderId: string;
  items: ReturnItem[];
  totalRefund: number;
  createdAt: string;
}

export default function ReturnsHistoryPage() {
  const KEY = "silekta_returns";
  const [returns, setReturns] = useState<ReturnRecord[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setReturns(JSON.parse(raw) as ReturnRecord[]);
    } catch (e) {
      // ignore
    }
  }, []);

  const clearHistory = () => {
    if (!confirm("Clear all return history? This cannot be undone.")) return;
    localStorage.removeItem(KEY);
    setReturns([]);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Navbar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Returns History
              </h1>
              <p className="text-sm text-gray-700">Past processed returns</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/orders/returns"
                className="px-3 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Back to Returns
              </Link>
              <button
                onClick={clearHistory}
                className="px-3 py-2 bg-red-600 text-white rounded-md text-sm"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-[900px] mx-auto space-y-4">
            {returns.length === 0 && (
              <div className="bg-white p-6 rounded shadow text-center text-gray-700">
                No returns recorded yet.
              </div>
            )}

            {returns.map((r) => (
              <div key={r.id} className="bg-white p-4 rounded shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Return {r.id}</div>
                    <div className="text-sm text-gray-700">
                      Order {r.orderId} •{" "}
                      {new Date(r.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-700">Total Refund</div>
                    <div className="font-semibold">
                      Rs {r.totalRefund.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2">
                  {r.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <div>
                        <div className="font-medium">{it.name}</div>
                        <div className="text-xs text-gray-700">
                          {it.sku ?? ""} • Qty: {it.qty} • Rs{" "}
                          {it.unitPrice.toFixed(2)}
                        </div>
                        {it.reason && (
                          <div className="text-xs text-gray-700">
                            Reason: {it.reason}
                          </div>
                        )}
                      </div>
                      <div className="font-medium">
                        Rs {it.refund.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
