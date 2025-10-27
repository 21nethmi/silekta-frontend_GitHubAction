"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";

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
  customer: string;
  products: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO datetime
}

type ButtonVariant = "primary" | "success" | "danger" | "outline";
function IconEye(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={props.className}
      width="16"
      height="16"
    >
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCheck(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={props.className}
      width="16"
      height="16"
    >
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function IconX(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={props.className}
      width="16"
      height="16"
    >
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function ActionButton({
  label,
  variant = "primary",
  onClick,
  icon,
  title,
}: {
  label: string;
  variant?: ButtonVariant;
  onClick?: () => void;
  icon?: "eye" | "check" | "x";
  title?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md shadow-sm transition transform hover:-translate-y-0.5";
  let variantClasses = "";
  switch (variant) {
    case "success":
      variantClasses = "bg-emerald-600 text-white hover:bg-emerald-700";
      break;
    case "danger":
      variantClasses = "bg-red-600 text-white hover:bg-red-700";
      break;
    case "outline":
      variantClasses =
        "bg-white border border-[#0B5351] text-[#0B5351] hover:bg-[#0B5351]/5";
      break;
    default:
      variantClasses =
        "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50";
  }

  return (
    <button
      title={title}
      onClick={onClick}
      className={`${base} ${variantClasses}`}
    >
      {icon === "eye" && <IconEye className="text-current" />}
      {icon === "check" && <IconCheck className="text-current" />}
      {icon === "x" && <IconX className="text-current" />}
      <span>{label}</span>
    </button>
  );
}

function IconDots(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={props.className}
      width="16"
      height="16"
    >
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

function ActionMenu({
  order,
  onView,
  onMarkComplete,
  onCancel,
}: {
  order: Order;
  onView: (o: Order) => void;
  onMarkComplete: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleDoc);
    return () => document.removeEventListener("mousedown", handleDoc);
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="true"
        aria-expanded={open}
        className="inline-flex items-center justify-center p-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50 shadow-sm"
        title="Actions"
      >
        <IconDots className="text-gray-600" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1 flex flex-col">
            <button
              onClick={() => {
                setOpen(false);
                onView(order);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
            >
              <span className="inline-flex items-center gap-2">
                {" "}
                <IconEye className="text-gray-600" /> View
              </span>
            </button>

            {order.status !== "Completed" && order.status !== "Cancelled" && (
              <button
                onClick={() => {
                  setOpen(false);
                  onMarkComplete(order.id);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
              >
                <span className="inline-flex items-center gap-2">
                  {" "}
                  <IconCheck className="text-green-600" /> Mark Complete
                </span>
              </button>
            )}

            {order.status !== "Cancelled" && (
              <button
                onClick={() => {
                  setOpen(false);
                  onCancel(order.id);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
              >
                <span className="inline-flex items-center gap-2">
                  {" "}
                  <IconX className="text-red-600" /> Cancel
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const OrdersPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-1001",
      customer: "Amal Perera",
      products: [
        {
          sku: "P001",
          name: "Premium Paper A4",
          category: "paper",
          qty: 2,
          unitPrice: 300,
        },
        {
          sku: "PR001",
          name: "Kraft Paper",
          category: "printing",
          qty: 1,
          unitPrice: 850,
        },
      ],
      total: 1450.0,
      status: "In Progress",
      createdAt: "2025-10-20T09:15:00",
    },
    {
      id: "ORD-1002",
      customer: "Nimal Fernando",
      products: [
        {
          sku: "P002",
          name: "Ink Cartridge - Black",
          category: "printing",
          qty: 1,
          unitPrice: 750,
        },
      ],
      total: 750.0,
      status: "In Progress",
      createdAt: "2025-10-18T14:30:00",
    },
    {
      id: "ORD-1003",
      customer: "Samanthi Jayasuriya",
      products: [
        {
          sku: "P003",
          name: "Ink Cartridge - Color",
          category: "printing",
          qty: 3,
          unitPrice: 800,
        },
        {
          sku: "P004",
          name: "Cardstock Paper",
          category: "paper",
          qty: 2,
          unitPrice: 400,
        },
      ],
      total: 4200.0,
      status: "Completed",
      createdAt: "2025-10-15T11:05:00",
    },
    {
      id: "ORD-1004",
      customer: "Kamal Silva",
      products: [
        {
          sku: "PR004",
          name: "Paper Plates",
          category: "printing",
          qty: 2,
          unitPrice: 450,
        },
      ],
      total: 900.0,
      status: "Cancelled",
      createdAt: "2025-10-12T08:20:00",
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const totalOrders = orders.length;
  const inProgressCount = orders.filter(
    (o) => o.status === "In Progress"
  ).length;
  const completedCount = orders.filter((o) => o.status === "Completed").length;
  const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;

  const changeStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  // Create Order modal state and form (products-aware)
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<{
    customer: string;
    products: OrderItem[];
  }>({ customer: "", products: [] });
  const [currentProduct, setCurrentProduct] = useState<OrderItem>({
    name: "",
    category: "paper",
    qty: 1,
    unitPrice: 0,
  });
  const [formError, setFormError] = useState<string | null>(null);

  const openCreate = () => {
    setCreateForm({ customer: "", products: [] });
    setCurrentProduct({ name: "", category: "paper", qty: 1, unitPrice: 0 });
    setFormError(null);
    setIsCreateOpen(true);
  };

  const generateOrderId = () => {
    // Find max numeric suffix and increment
    const nums = orders
      .map((o) => {
        const m = o.id.match(/ORD-(\d+)/);
        return m ? parseInt(m[1], 10) : 0;
      })
      .filter(Boolean);
    const max = nums.length ? Math.max(...nums) : 1000;
    return `ORD-${String(max + 1).padStart(4, "0")}`;
  };

  const handleAddCurrentProduct = () => {
    setFormError(null);
    if (!currentProduct.name.trim()) {
      setFormError("Product name is required");
      return;
    }
    if (!currentProduct.qty || currentProduct.qty < 1) {
      setFormError("Qty must be at least 1");
      return;
    }
    if (!currentProduct.unitPrice || currentProduct.unitPrice <= 0) {
      setFormError("Unit price must be > 0");
      return;
    }
    setCreateForm((prev) => ({
      ...prev,
      products: [...prev.products, currentProduct],
    }));
    setCurrentProduct({ name: "", category: "paper", qty: 1, unitPrice: 0 });
  };

  const handleCreateSave = () => {
    setFormError(null);
    if (!createForm.customer.trim()) {
      setFormError("Customer name is required");
      return;
    }
    if (!createForm.products.length) {
      setFormError("Add at least one product");
      return;
    }

    const total = createForm.products.reduce(
      (s, p) => s + p.qty * p.unitPrice,
      0
    );

    const newOrder: Order = {
      id: generateOrderId(),
      customer: createForm.customer.trim(),
      products: createForm.products,
      total,
      status: "In Progress",
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setIsCreateOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Navbar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order Management
              </h1>
              <p className="text-sm text-gray-600">
                Manage customer orders and fulfilment
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700">
                <div className="text-xs">Total Orders</div>
                <div className="text-lg font-bold text-gray-900">
                  {totalOrders}
                </div>
              </div>

              <div className="hidden sm:block">
                <button
                  onClick={openCreate}
                  className="px-4 py-2 bg-[#8CBCB9] text-white rounded-md"
                >
                  Create Order
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto">
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="text-sm text-gray-500">Total Orders</div>
                <div className="text-2xl font-bold text-gray-900">
                  {totalOrders}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="text-sm text-gray-500">In Progress</div>
                <div className="text-2xl font-bold text-amber-600">
                  {inProgressCount}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="text-sm text-gray-500">Completed</div>
                <div className="text-2xl font-bold text-emerald-600">
                  {completedCount}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search by order id or customer..."
                  className="px-4 py-2 border text-gray-700 border-gray-300 rounded-lg w-full sm:w-72 focus:ring-2 focus:ring-[#0B5351]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
                >
                  <option value="All">All Statuses</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  Reset
                </button>
                <ActionButton
                  label="Create Order"
                  variant="primary"
                  onClick={() => {
                    /* placeholder */
                  }}
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-white border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Orders{" "}
                  <span className="ml-2 text-sm text-gray-500">
                    ({filtered.length})
                  </span>
                </h3>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Items
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {filtered.map((o) => (
                      <tr
                        key={o.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-[#0B5351]">
                          {o.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-800">
                          {o.customer}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-800">
                          {o.products.reduce((s, p) => s + p.qty, 0)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-800">
                          Rs {o.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                          {o.createdAt}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <span
                            className={`inline-flex px-3 py-1 text-sm font-semibold rounded ${
                              o.status === "In Progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : o.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <ActionMenu
                              order={o}
                              onView={(ord) => openDetails(ord)}
                              onMarkComplete={(id) =>
                                changeStatus(id, "Completed")
                              }
                              onCancel={(id) => changeStatus(id, "Cancelled")}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Details Modal */}
        {isDetailOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
              <div className="flex items-start justify-between">
                <h3 className="text-2xl font-semibold text-gray-700">
                  Order {selectedOrder.id}
                </h3>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600">Customer</div>
                  <div className="font-medium text-gray-700">
                    {selectedOrder.customer}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Products</div>
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {selectedOrder.products.map((p, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                      >
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-gray-500">
                            {p.category === "paper"
                              ? "Paper-based"
                              : "Printing"}{" "}
                            • {p.sku ?? ""}
                          </div>
                        </div>
                        <div className="text-sm text-gray-700">
                          {p.qty} × Rs {p.unitPrice.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="font-medium text-gray-700">
                    Rs {selectedOrder.total.toFixed(2)}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600">Date</div>
                  <div className="font-medium text-gray-700">
                    {selectedOrder.createdAt}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600">Status</div>
                  <div className="font-medium text-gray-700">
                    {selectedOrder.status}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <ActionButton
                  label="Close"
                  variant="outline"
                  onClick={() => setIsDetailOpen(false)}
                  icon={undefined}
                />
                {selectedOrder.status !== "Completed" &&
                  selectedOrder.status !== "Cancelled" && (
                    <ActionButton
                      label="Mark Complete"
                      icon="check"
                      variant="success"
                      onClick={() => {
                        changeStatus(selectedOrder.id, "Completed");
                        setIsDetailOpen(false);
                      }}
                    />
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Create Order Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Create New Order
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Customer
                  </label>
                  <input
                    type="text"
                    value={createForm.customer}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, customer: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* Product add block */}
                <div className="border rounded p-3 bg-white">
                  <div className="text-sm font-medium mb-2">Add product</div>
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      placeholder="Product name"
                      type="text"
                      value={currentProduct.name}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    <div className="flex gap-2">
                      <select
                        value={currentProduct.category}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            category: e.target.value as "paper" | "printing",
                          })
                        }
                        className="px-3 py-2 border rounded-md"
                      >
                        <option value="paper">Paper-based</option>
                        <option value="printing">Printing</option>
                      </select>
                      <input
                        type="number"
                        min={1}
                        value={currentProduct.qty}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            qty: Number(e.target.value),
                          })
                        }
                        className="w-24 px-3 py-2 border rounded-md"
                      />
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={currentProduct.unitPrice}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            unitPrice: Number(e.target.value),
                          })
                        }
                        className="w-32 px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={handleAddCurrentProduct}
                        className="px-3 py-2 bg-[#8CBCB9] text-white rounded-md"
                      >
                        Add Product
                      </button>
                    </div>
                  </div>
                  {/* Added products list */}
                  {createForm.products.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-600 mb-2">
                        Products in order
                      </div>
                      <div className="space-y-2">
                        {createForm.products.map((p, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                          >
                            <div>
                              <div className="font-medium">{p.name}</div>
                              <div className="text-xs text-gray-500">
                                {p.category === "paper"
                                  ? "Paper-based"
                                  : "Printing"}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm">
                                {p.qty} × Rs {p.unitPrice.toFixed(2)}
                              </div>
                              <button
                                onClick={() =>
                                  setCreateForm((prev) => ({
                                    ...prev,
                                    products: prev.products.filter(
                                      (_, idx) => idx !== i
                                    ),
                                  }))
                                }
                                className="px-2 py-1 rounded bg-red-500 text-white"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-right font-semibold">
                        Total: Rs{" "}
                        {createForm.products
                          .reduce((s, p) => s + p.qty * p.unitPrice, 0)
                          .toFixed(2)}
                      </div>
                    </div>
                  )}
                  {formError && (
                    <div className="text-sm text-red-600 mt-2">{formError}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4">
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSave}
                  className="px-4 py-2 rounded-md bg-[#0B5351] text-white hover:bg-[#0B5351]/90"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
