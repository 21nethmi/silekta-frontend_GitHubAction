"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  searchCustomers,
  getCustomerById,
  getCustomerByName,
} from "@/lib/customers";
import { useOrders } from "@/context/OrdersContext";

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

function ActionMenu({
  order,
  onView,
  onMarkComplete,
  onCancel,
  onReturn,
}: {
  order: Order;
  onView: (o: Order) => void;
  onMarkComplete: (id: string) => void;
  onCancel: (id: string) => void;
  onReturn?: (id: string) => void;
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

            <button
              onClick={() => {
                setOpen(false);
                onReturn && onReturn(order.id);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
            >
              <span className="inline-flex items-center gap-2">
                Return items
              </span>
            </button>

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
  const {
    orders,
    setOrders,
    returns: returnsRecords,
    setReturns,
  } = useOrders();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const router = useRouter();

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
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

  const changeStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => {
      const updated = prev.map((o) => {
        if (o.id !== id) return o;
        const products = Array.isArray(o.products) ? o.products : [];
        const total =
          typeof o.total === "number"
            ? o.total
            : products.reduce(
                (s, p) => s + (p.qty || 0) * (p.unitPrice || 0),
                0
              );
        return { ...o, status, products, total };
      });
      if (selectedOrder && selectedOrder.id === id) {
        const newSel = updated.find((x) => x.id === id) ?? selectedOrder;
        setSelectedOrder(newSel);
      }
      return updated;
    });
  };

  // Create Order modal state and form (products-aware)
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<{
    customer: string;
    products: OrderItem[];
  }>({ customer: "", products: [] });
  // Customers state
  const [customerQuery, setCustomerQuery] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const customerRef = useRef<HTMLDivElement | null>(null);
  const [customerResults, setCustomerResults] = useState<
    { id: string; name: string; phone?: string; email?: string }[]
  >([]);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const searchTimer = useRef<number | null>(null);
  const [currentProduct, setCurrentProduct] = useState<OrderItem>({
    name: "",
    category: "paper",
    qty: 1,
    unitPrice: 0,
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    function handleDoc(e: MouseEvent) {
      if (
        customerRef.current &&
        !customerRef.current.contains(e.target as Node)
      )
        setShowCustomerDropdown(false);
    }
    document.addEventListener("mousedown", handleDoc);
    return () => document.removeEventListener("mousedown", handleDoc);
  }, []);

  useEffect(() => {
    if (searchTimer.current) {
      window.clearTimeout(searchTimer.current);
      searchTimer.current = null;
    }
    setCustomerLoading(true);
    searchTimer.current = window.setTimeout(() => {
      searchCustomers(customerQuery)
        .then((res) => {
          setCustomerResults(res);
          setHighlightedIndex(res.length ? 0 : -1);
        })
        .finally(() => setCustomerLoading(false));
    }, 220) as unknown as number;
    return () => {
      if (searchTimer.current) {
        window.clearTimeout(searchTimer.current);
        searchTimer.current = null;
      }
    };
  }, [customerQuery]);

  const generateOrderId = () => {
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
    const maybeIdMatch = createForm.customer
      .trim()
      .match(/^(CUST-[0-9]+)\s+—\s*(.*)$/);
    const newOrder: Order = {
      id: generateOrderId(),
      customerId: maybeIdMatch ? maybeIdMatch[1] : undefined,
      customerName: maybeIdMatch ? maybeIdMatch[2] : createForm.customer.trim(),
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
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order Management
              </h1>
              <p className="text-sm text-gray-700">
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
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsCreateOpen(true);
                  }}
                  className="px-4 py-2 bg-[#32ca56] text-white rounded-md hover:bg-[#28b44c]"
                >
                  Create Order
                </button>
                <Link
                  href="/orders/returns"
                  className="px-4 py-2 bg-[#e1d019] border border-gray-200 rounded-md text-sm text-white hover:bg-[#aac63a]"
                >
                  Returns
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="text-sm text-gray-700">Total Orders</div>
                <div className="text-2xl font-bold text-gray-900">
                  {totalOrders}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="text-sm text-gray-700">In Progress</div>
                <div className="text-2xl font-bold text-amber-600">
                  {inProgressCount}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="text-sm text-gray-700">Completed</div>
                <div className="text-2xl font-bold text-emerald-600">
                  {completedCount}
                </div>
              </div>
            </div>

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
                  className="px-4 py-2 rounded-lg text-black bg-gray-400 hover:bg-gray-300"
                >
                  Reset Filter
                </button>
              </div>
            </div>

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
                          <div className="font-medium">{o.customerName}</div>
                          {(() => {
                            const cById = o.customerId
                              ? getCustomerById(o.customerId)
                              : null;
                            const cByName = !cById
                              ? getCustomerByName(o.customerName)
                              : null;
                            const c = cById || cByName;
                            if (c)
                              return (
                                <div className="text-xs text-gray-700">
                                  {c.id} • {c.email}
                                </div>
                              );
                            return o.customerId ? (
                              <div className="text-xs text-gray-700">
                                {o.customerId}
                              </div>
                            ) : null;
                          })()}
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
                              onReturn={(id) =>
                                router.push(
                                  `/orders/returns?order=${encodeURIComponent(
                                    id
                                  )}`
                                )
                              }
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
                <div className="flex flex-col">
                  <div className="text-sm text-gray-700">Customer</div>
                  <div className="font-medium text-gray-700">
                    {selectedOrder.customerName}
                  </div>
                  {(() => {
                    const cById = selectedOrder.customerId
                      ? getCustomerById(selectedOrder.customerId)
                      : null;
                    const cByName = !cById
                      ? getCustomerByName(selectedOrder.customerName)
                      : null;
                    const c = cById || cByName;
                    if (c)
                      return (
                        <div className="text-xs text-gray-700">
                          {c.id} • {c.phone} • {c.email}
                        </div>
                      );
                    return selectedOrder.customerId ? (
                      <div className="text-xs text-gray-700">
                        {selectedOrder.customerId}
                      </div>
                    ) : null;
                  })()}
                </div>

                <div>
                  <div className="text-sm text-gray-700">Products</div>
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {selectedOrder.products.map((p, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                      >
                        <div>
                          <div className="font-medium text-black">{p.name}</div>
                          <div className="text-xs text-gray-700">
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

                <div className="mt-2">
                  <button
                    onClick={() => {}}
                    className="text-xs text-gray-500 underline"
                  >
                    Inspect order (in-memory)
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <ActionButton
                  label="Close"
                  variant="outline"
                  onClick={() => setIsDetailOpen(false)}
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
                  <div className="relative text-black" ref={customerRef}>
                    <input
                      type="text"
                      value={createForm.customer}
                      onChange={(e) => {
                        const v = e.target.value;
                        setCreateForm({ ...createForm, customer: v });
                        setCustomerQuery(v);
                        setShowCustomerDropdown(true);
                      }}
                      onFocus={() => setShowCustomerDropdown(true)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          setHighlightedIndex((i) =>
                            Math.min(
                              (customerResults.length || 1) - 1,
                              Math.max(0, i + 1)
                            )
                          );
                          return;
                        }
                        if (e.key === "ArrowUp") {
                          e.preventDefault();
                          setHighlightedIndex((i) => Math.max(0, i - 1));
                          return;
                        }
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const sel = customerResults[highlightedIndex];
                          if (sel) {
                            setCreateForm({
                              ...createForm,
                              customer: `${sel.id} — ${sel.name}`,
                            });
                            setCustomerQuery(`${sel.id} — ${sel.name}`);
                            setShowCustomerDropdown(false);
                          }
                        }
                        if (e.key === "Escape") {
                          setShowCustomerDropdown(false);
                        }
                      }}
                      placeholder="Type name or customer id..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />

                    {showCustomerDropdown && (
                      <div className="absolute z-40 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow max-h-52 overflow-auto">
                        {customerLoading ? (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            Searching...
                          </div>
                        ) : customerResults.length === 0 ? (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            No customers
                          </div>
                        ) : (
                          customerResults.map((c, idx) => (
                            <button
                              key={c.id}
                              onMouseEnter={() => setHighlightedIndex(idx)}
                              onClick={() => {
                                setCreateForm({
                                  ...createForm,
                                  customer: `${c.id} — ${c.name}`,
                                });
                                setCustomerQuery(`${c.id} — ${c.name}`);
                                setShowCustomerDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm ${
                                highlightedIndex === idx ? "bg-gray-100" : ""
                              }`}
                            >
                              <div className="font-medium">{c.name}</div>
                              <div className="text-xs text-gray-500">
                                {c.id} • {c.phone} • {c.email}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border rounded p-3 bg-white">
                  <div className="text-sm font-medium mb-2 text-gray-700">Add product</div>
                  <div className="grid grid-cols-1 gap-2 text-gray-600">
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
                      className="w-full px-3 py-2 border rounded-md text-gray-500"
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
                        className="px-3 py-2 bg-[#2bd962] text-white rounded-md"
                      >
                        Add Product
                      </button>
                    </div>
                  </div>
                  {createForm.products.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-700 mb-2">
                        Products in order
                      </div>
                      <div className="space-y-2">
                        {createForm.products.map((p, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                          >
                            <div>
                              <div className="font-medium text-black">{p.name}</div>
                              <div className="text-xs text-gray-500">
                                {p.category === "paper"
                                  ? "Paper-based"
                                  : "Printing"}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm text-gray-500">
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
                      <div className="mt-3 text-right font-semibold text-gray-600">
                        Total: Rs{" "}
                        {createForm.products
                          .reduce((s, p) => s + p.qty * p.unitPrice, 0)
                          .toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4">
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-300"
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
