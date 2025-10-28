"use client";

import React, { useState, ChangeEvent } from "react";
import Navbar from "@/components/Navbar";

interface ProductionItem {
  id: string;
  productName: string;
  quantity: number;
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
  expectedFinishDate?: string;
  lastUpdated: string;
  materials?: {
    id: string;
    name: string;
    usedQty: number;
    requiredQty?: number;
    unit?: string;
  }[];
}


const ProductionPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ProductionItem["status"]>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<ProductionItem | null>(null);

  const [form, setForm] = useState({
    productName: "",
    quantity: 0,
    status: "pending" as ProductionItem["status"],
    dueDate: "",
    expectedFinishDate: "",
    materials: [] as { id: string; name: string; requiredQty?: number; usedQty?: number; unit?: string }[],
  });

  const [items, setItems] = useState<ProductionItem[]>([
    {
      id: "PRD-001",
      productName: "Custom Packaging Box",
      quantity: 200,
      status: "in-progress",
      dueDate: "2025-11-02",
      expectedFinishDate: "2025-11-05",
      lastUpdated: "2025-10-20",
      materials: [
        { id: "PR001", name: "Kraft Paper (Brown)", usedQty: 200, requiredQty: 200, unit: "sheets" },
        { id: "PR004", name: "Paper Plates (White)", usedQty: 50, requiredQty: 100, unit: "pcs" },
      ],
    },
    {
      id: "PRD-002",
      productName: "Printed Labels Batch A",
      quantity: 5000,
      status: "pending",
      dueDate: "2025-11-10",
      expectedFinishDate: "2025-11-12",
      lastUpdated: "2025-10-18",
      materials: [
        { id: "P002", name: "Ink Cartridge - Black", usedQty: 2, requiredQty: 4, unit: "pcs" },
        { id: "P003", name: "Ink Cartridge - Color", usedQty: 2, requiredQty: 4, unit: "pcs" },
      ],
    },
    {
      id: "PRD-003",
      productName: "Eco Cutlery Set",
      quantity: 1000,
      status: "completed",
      dueDate: "2025-10-15",
      expectedFinishDate: "2025-10-15",
      lastUpdated: "2025-10-15",
      materials: [
        { id: "PR002", name: "Wooden Cutlery Set", usedQty: 1000, requiredQty: 1000, unit: "sets" },
      ],
    },
  ]);

  const [materialsModal, setMaterialsModal] = useState<ProductionItem["materials"] | null>(null);
  const [materialsView, setMaterialsView] = useState<'all' | 'needed' | 'sufficient'>('all');
  const [materialsParentExpected, setMaterialsParentExpected] = useState<string | null>(null);

  const filtered = items.filter((it) => {
    const s = searchTerm.trim().toLowerCase();
    const matchesSearch = !s || it.productName.toLowerCase().includes(s) || it.id.toLowerCase().includes(s);
    const matchesStatus = statusFilter === "all" ? true : it.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getUsedTotal = (materials?: ProductionItem["materials"]) =>
    (materials || []).reduce((sum, m) => sum + (m.usedQty || 0), 0);

  const getNeededTotal = (materials?: ProductionItem["materials"]) =>
    (materials || []).reduce((sum, m) => sum + Math.max((m.requiredQty || 0) - (m.usedQty || 0), 0), 0);

  const openAdd = () => {
    setForm({ productName: "", quantity: 0, status: "pending", dueDate: "", expectedFinishDate: "", materials: [] });
    setIsAddOpen(true);
  };

  const openEdit = (it: ProductionItem) => {
    setSelected(it);
    setForm({
      productName: it.productName,
      quantity: it.quantity,
      status: it.status,
      dueDate: it.dueDate,
      expectedFinishDate: it.expectedFinishDate ?? "",
      materials: (it.materials || []).map((m) => ({ id: m.id, name: m.name, requiredQty: m.requiredQty ?? 0, usedQty: m.usedQty ?? 0, unit: m.unit })),
    });
    setIsEditOpen(true);
  };

  const openDelete = (it: ProductionItem) => {
    setSelected(it);
    setIsDeleteOpen(true);
  };

  const save = () => {
    if (isAddOpen) {
      const newItem: ProductionItem = {
        id: `PRD-${String(items.length + 1).padStart(3, "0")}`,
        productName: form.productName,
        quantity: form.quantity,
        status: form.status,
        dueDate: form.dueDate,
        expectedFinishDate: form.expectedFinishDate,
        materials: (form as any).materials?.map((m: any) => ({ id: m.id || '', name: m.name || '', usedQty: Number(m.usedQty || 0), requiredQty: Number(m.requiredQty || 0), unit: m.unit })) ?? [],
        lastUpdated: new Date().toISOString().split("T")[0],
      };
      setItems((prev) => [newItem, ...prev]);
    } else if (isEditOpen && selected) {
      setItems((prev) => prev.map((p) =>
        p.id === selected.id
          ? {
              ...p,
              ...form,
              materials: (form as any).materials?.map((m: any) => ({ id: m.id || '', name: m.name || '', usedQty: Number(m.usedQty || 0), requiredQty: Number(m.requiredQty || 0), unit: m.unit })) ?? p.materials ?? [],
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : p
      ));
    }
    setIsAddOpen(false);
    setIsEditOpen(false);
    setSelected(null);
  };

  const confirmDelete = () => {
    if (selected) setItems((prev) => prev.filter((p) => p.id !== selected.id));
    setIsDeleteOpen(false);
    setSelected(null);
  };

  const isSaveDisabled = !form.productName || form.quantity <= 0 || !form.dueDate;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Navbar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div />
          </div>
        </div>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Production Management</h1>
            <p className="text-gray-600 max-w-xl mx-auto">Track production orders, statuses and deadlines — streamlined view for your team.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="w-full md:max-w-2xl">
              <div className="relative">
                <input
                  value={searchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  placeholder="Search product or ID..."
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-[#0B5351]/10 transition"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as "all" | ProductionItem["status"])}
                className="px-3 py-2 rounded-md border bg-white shadow-sm"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <button
                onClick={openAdd}
                className="bg-gradient-to-br from-[#0B8B80] to-[#0B5351] text-white px-5 py-2 rounded-lg font-semibold shadow-lg hover:scale-[1.03] transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#0B5351]/20"
              >
                + New Order
              </button>
            </div>
          </div>

          <section className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-white">
              <h3 className="text-lg font-semibold text-gray-800">Production Orders <span className="ml-2 text-sm text-gray-500">({filtered.length})</span></h3>
            </div>

            <div className="overflow-x-auto max-h-[520px]">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Expected Finish</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Materials</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-100">
                  {filtered.map((it) => (
                    <tr key={it.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-4 whitespace-nowrap"><span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#0B5351]/10 text-[#0B5351]">{it.id}</span></td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{it.productName}</div>
                        <div className="text-xs text-gray-500">Updated {it.lastUpdated}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap"><span className="text-sm font-semibold">{it.quantity}</span></td>
                      <td className="px-4 py-4 whitespace-nowrap"><div className="text-sm text-gray-700">{it.dueDate}</div></td>
                      <td className="px-4 py-4 whitespace-nowrap"><div className="text-sm text-gray-700">{it.expectedFinishDate ?? '-'}</div></td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{getUsedTotal(it.materials)} used • {getNeededTotal(it.materials)} needed</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                          it.status === "pending" ? "bg-yellow-100 text-yellow-800" : it.status === "in-progress" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                        }`}>{it.status}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { setMaterialsModal(it.materials ?? []); setMaterialsView('all'); setMaterialsParentExpected(it.expectedFinishDate ?? null); }} className="bg-white text-[#0B5351] border border-[#0B5351] px-3 py-1 rounded-md hover:bg-[#0B5351] hover:text-white transition transform hover:scale-105 shadow-sm">Materials</button>
                          <button onClick={() => openEdit(it)} className="bg-white text-[#0B5351] border border-[#0B5351] px-3 py-1 rounded-md hover:bg-[#0B5351] hover:text-white transition transform hover:scale-105 shadow-sm">Edit</button>
                          <button onClick={() => openDelete(it)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition transform hover:scale-105 shadow-sm">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Materials Modal */}
          {materialsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Materials</h3>
                    <div className="text-sm text-gray-500">{materialsModal.length} items • {getUsedTotal(materialsModal)} used • {getNeededTotal(materialsModal)} needed • Expected finish: {materialsParentExpected ?? '-'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setMaterialsModal(null); setMaterialsParentExpected(null); }} aria-label="Close" className="text-gray-400 hover:text-gray-600 focus:outline-none">✕</button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <button onClick={() => setMaterialsView('all')} className={`px-3 py-1 rounded ${materialsView==='all' ? 'bg-[#0B5351] text-white' : 'bg-gray-100 text-gray-700'}`}>All</button>
                  <button onClick={() => setMaterialsView('needed')} className={`px-3 py-1 rounded ${materialsView==='needed' ? 'bg-[#DE8080] text-white' : 'bg-gray-100 text-gray-700'}`}>Needed</button>
                  <button onClick={() => setMaterialsView('sufficient')} className={`px-3 py-1 rounded ${materialsView==='sufficient' ? 'bg-[#80DED9] text-white' : 'bg-gray-100 text-gray-700'}`}>Sufficient</button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 max-h-72 overflow-y-auto">
                  {materialsModal.filter((m) => {
                    const needed = Math.max((m.requiredQty ?? 0) - m.usedQty, 0);
                    if (materialsView === 'needed') return needed > 0;
                    if (materialsView === 'sufficient') return needed === 0;
                    return true;
                  }).map((m) => {
                    const needed = Math.max((m.requiredQty ?? 0) - m.usedQty, 0);
                    const pct = m.requiredQty ? Math.min(100, Math.round((m.usedQty / m.requiredQty) * 100)) : 100;
                    return (
                      <div key={m.id} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{m.name}</div>
                                <div className="text-xs text-gray-500">{m.id}</div>
                              </div>
                              <div className={`text-sm font-semibold ${needed>0 ? 'text-red-600' : 'text-green-600'}`}>{needed>0 ? 'Shortfall' : 'OK'}</div>
                            </div>

                            <div className="mt-3">
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div style={{ width: `${pct}%` }} className={`h-2 ${pct < 50 ? 'bg-red-400' : pct < 100 ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                              </div>
                              <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                                <div>Used: <span className="font-semibold text-gray-900">{m.usedQty} {m.unit ?? ''}</span></div>
                                <div>Required: <span className="font-semibold">{m.requiredQty ?? 0}</span></div>
                                <div>Expected Finish: <span className="font-semibold">{materialsParentExpected ?? '-'}</span></div>
                                <div className={`font-semibold ${needed>0 ? 'text-red-600' : 'text-green-600'}`}>Needed: {needed}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 text-right">
                  <button onClick={() => { setMaterialsModal(null); setMaterialsParentExpected(null); }} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Close</button>
                </div>
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-6">Try adjusting filters or create a new production order.</p>
              <button onClick={openAdd} className="bg-gradient-to-br from-[#0B8B80] to-[#0B5351] text-white px-5 py-2 rounded-lg font-semibold shadow-lg hover:scale-[1.03] transform transition-all duration-200">Create Order</button>
            </div>
          )}

          {/* Add / Edit Modal */}
          {(isAddOpen || isEditOpen) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{isAddOpen ? "New Production Order" : "Edit Production Order"}</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input value={form.productName} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, productName: e.target.value }))} className="w-full px-4 py-2 border rounded-md" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                      <input type="number" value={form.quantity} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, quantity: parseInt(e.target.value || "0") }))} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                      <input type="date" value={form.dueDate} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, dueDate: e.target.value }))} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Finish Date</label>
                    <input type="date" value={form.expectedFinishDate} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, expectedFinishDate: e.target.value }))} className="w-full px-4 py-2 border rounded-md" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Materials (needed)</label>
                    <div className="bg-gray-50 border border-gray-100 rounded-md p-3">
                      <div className="grid grid-cols-12 gap-2 text-xs text-gray-600 font-medium mb-2">
                        <div className="col-span-2">ID</div>
                        <div className="col-span-6">Name</div>
                        <div className="col-span-2 text-right">Required</div>
                        <div className="col-span-1">Unit</div>
                        <div className="col-span-1"></div>
                      </div>

                      <div className="space-y-2">
                        {(form as any).materials?.length ? (form as any).materials.map((m: any, idx: number) => (
                          <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                            <input aria-label={`material-id-${idx}`} value={m.id} onChange={(e) => {
                              const v = e.target.value;
                              setForm((f) => {
                                const materials = (f as any).materials ? [...(f as any).materials] : [];
                                materials[idx] = { ...materials[idx], id: v };
                                return { ...f, materials };
                              });
                            }} placeholder="ID" className="col-span-2 px-3 py-2 border rounded-md bg-white" />

                            <input aria-label={`material-name-${idx}`} value={m.name} onChange={(e) => {
                              const v = e.target.value;
                              setForm((f) => {
                                const materials = (f as any).materials ? [...(f as any).materials] : [];
                                materials[idx] = { ...materials[idx], name: v };
                                return { ...f, materials };
                              });
                            }} placeholder="Name" className="col-span-6 px-3 py-2 border rounded-md bg-white" />

                            <input aria-label={`material-required-${idx}`} value={m.requiredQty} type="number" onChange={(e) => {
                              const v = parseInt(e.target.value || "0");
                              setForm((f) => {
                                const materials = (f as any).materials ? [...(f as any).materials] : [];
                                materials[idx] = { ...materials[idx], requiredQty: v };
                                return { ...f, materials };
                              });
                            }} placeholder="Required" className="col-span-2 px-3 py-2 border rounded-md bg-white text-right" />

                            <input aria-label={`material-unit-${idx}`} value={m.unit} onChange={(e) => {
                              const v = e.target.value;
                              setForm((f) => {
                                const materials = (f as any).materials ? [...(f as any).materials] : [];
                                materials[idx] = { ...materials[idx], unit: v };
                                return { ...f, materials };
                              });
                            }} placeholder="Unit" className="col-span-1 px-2 py-2 border rounded-md bg-white" />

                            <button type="button" onClick={() => setForm((f) => ({ ...f, materials: (f as any).materials.filter((_: any, i: number) => i !== idx) }))} className="col-span-1 px-2 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200">✕</button>
                          </div>
                        )) : (
                          <div className="text-sm text-gray-500">No materials added yet.</div>
                        )}

                        <div>
                          <button type="button" onClick={() => setForm((f) => ({ ...f, materials: ([...((f as any).materials || []), { id: '', name: '', requiredQty: 0, usedQty: 0, unit: '' }]) }))} className="px-3 py-2 bg-[#8CBCB9] text-white rounded-md hover:bg-[#79b3a4]">+ Add material</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select value={form.status} onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm((f) => ({ ...f, status: e.target.value as ProductionItem["status"] }))} className="w-full px-4 py-2 border rounded-md">
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                  <div className="flex gap-3 mt-6">
                  <button onClick={save} disabled={isSaveDisabled} className={`${isSaveDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-br from-[#0B8B80] to-[#0B5351]'} flex-1 text-white px-4 py-2 rounded-lg font-semibold shadow`}>Save</button>
                  <button onClick={() => { setIsAddOpen(false); setIsEditOpen(false); setSelected(null); }} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {isDeleteOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm Delete</h2>
                <p className="text-gray-600 mb-6">Are you sure you want to delete <span className="font-semibold">{selected?.productName}</span>?</p>

                <div className="flex gap-3">
                  <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg">Delete</button>
                  <button onClick={() => { setIsDeleteOpen(false); setSelected(null); }} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductionPage;
