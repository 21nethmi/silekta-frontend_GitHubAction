'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Package, AlertTriangle, FileText } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  supplierName: string;
  unitPrice: number;
  category: 'printing' | 'production';
  lastUpdated: string;
}

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState<'printing' | 'production'>('printing');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    stock: 0,
    supplierName: '',
    unitPrice: 0,
    category: 'printing' as 'printing' | 'production',
  });

  // Dummy data for inventory items - converted to state
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([
    // Printing materials
    {
      id: 'P001',
      name: 'Premium Paper Roll (A4)',
      stock: 45,
      supplierName: 'PaperCorp Ltd',
      unitPrice: 12.50,
      category: 'printing',
      lastUpdated: '2024-01-15'
    },
    {
      id: 'P002',
      name: 'Ink Cartridge - Black',
      stock: 8,
      supplierName: 'PrintTech Solutions',
      unitPrice: 25.00,
      category: 'printing',
      lastUpdated: '2024-01-14'
    },
    {
      id: 'P003',
      name: 'Ink Cartridge - Color',
      stock: 15,
      supplierName: 'PrintTech Solutions',
      unitPrice: 28.50,
      category: 'printing',
      lastUpdated: '2024-01-13'
    },
    {
      id: 'P004',
      name: 'Cardstock Paper (Heavy)',
      stock: 3,
      supplierName: 'PaperCorp Ltd',
      unitPrice: 18.75,
      category: 'printing',
      lastUpdated: '2024-01-12'
    },
    // Production materials
    {
      id: 'PR001',
      name: 'Kraft Paper (Brown)',
      stock: 120,
      supplierName: 'EcoMaterials Inc',
      unitPrice: 8.25,
      category: 'production',
      lastUpdated: '2024-01-15'
    },
    {
      id: 'PR002',
      name: 'Wooden Cutlery Set',
      stock: 25,
      supplierName: 'GreenWare Co',
      unitPrice: 15.00,
      category: 'production',
      lastUpdated: '2024-01-14'
    },
    {
      id: 'PR003',
      name: 'Biodegradable Cups',
      stock: 12,
      supplierName: 'EcoMaterials Inc',
      unitPrice: 22.50,
      category: 'production',
      lastUpdated: '2024-01-13'
    },
    {
      id: 'PR004',
      name: 'Paper Plates (White)',
      stock: 5,
      supplierName: 'Tableware Solutions',
      unitPrice: 14.00,
      category: 'production',
      lastUpdated: '2024-01-12'
    }
  ]);

  const filteredData = inventoryData.filter(item => {
    const matchesCategory = item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddClick = () => {
    setFormData({ 
      name: '', 
      stock: 0, 
      supplierName: '', 
      unitPrice: 0,
      category: activeTab 
    });
    setIsAddModalOpen(true);
  };

  const handleEditClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      stock: item.stock,
      supplierName: item.supplierName,
      unitPrice: item.unitPrice,
      category: item.category,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleSave = () => {
    if (isAddModalOpen) {
      // Adding new item
      const newItem: InventoryItem = {
        id: `${formData.category === 'printing' ? 'P' : 'PR'}${String(inventoryData.length + 1).padStart(3, '0')}`,
        name: formData.name,
        stock: formData.stock,
        supplierName: formData.supplierName,
        unitPrice: formData.unitPrice,
        category: formData.category,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setInventoryData([...inventoryData, newItem]);
    } else if (isEditModalOpen && selectedItem) {
      // Editing existing item
      const updatedData = inventoryData.map(item =>
        item.id === selectedItem.id
          ? {
              ...item,
              name: formData.name,
              stock: formData.stock,
              supplierName: formData.supplierName,
              unitPrice: formData.unitPrice,
              lastUpdated: new Date().toISOString().split('T')[0]
            }
          : item
      );
      setInventoryData(updatedData);
    }
    
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setFormData({ name: '', stock: 0, supplierName: '', unitPrice: 0, category: 'printing' });
  };

  const handleDeleteConfirm = () => {
    if (selectedItem) {
      const updatedData = inventoryData.filter(item => item.id !== selectedItem.id);
      setInventoryData(updatedData);
    }
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const lowStockItems = inventoryData.filter(item => item.stock < 10);
  const recentlyRefilledItems = inventoryData.filter(item => 
    new Date(item.lastUpdated) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Clean Header Section */}
          <div className="mb-6">
            <div className="text-left mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-[#0B5351] mb-2">
                Inventory Management
              </h1>
              <p className="text-gray-600">Manage your raw materials and production supplies</p>
            </div>
          </div>

          {/* Inventory Overview Cards */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl shadow-lg border-2 border-[#0B5351]/20 overflow-hidden mb-8 shadow-[#0B5351]/10">
            <div className="p-6 border-b border-gray-200">
              <div className="mb-4 p-3 border-b border-gray-300">
                <h2 className="text-2xl font-bold text-gray-900">
                  Inventory Overview
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Low Stock Alert Card */}
                <div className="bg-linear-to-br from-red-50 to-rose-100 p-6 rounded-xl shadow-sm border border-red-200 hover:shadow-md transition-all duration-300 group text-center">
                  <div className="w-12 h-12 bg-linear-to-r from-red-500 to-rose-900 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                    <AlertTriangle className="text-white w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-red-700 mb-2">Low Stock Alerts</p>
                  <p className="text-2xl font-bold text-red-800">{lowStockItems.length}</p>
                  <p className="text-xs text-red-600 mt-1">items need attention</p>
                </div>

                {/* Recently Updated Card */}
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-all duration-300 group text-center">
                  <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-indigo-900 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                    <Package className="text-white w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-blue-700 mb-2">Recently Updated</p>
                  <p className="text-2xl font-bold text-blue-800">{recentlyRefilledItems.length}</p>
                  <p className="text-xs text-blue-600 mt-1">items this week</p>
                </div>

                {/* Total Items Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group text-center">
                  <div className="w-12 h-12 bg-linear-to-r from-[#0B5351] to-[#083936] rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                    <FileText className="text-white w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{inventoryData.length}</p>
                  <p className="text-xs text-gray-500 mt-1">in inventory</p>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Management Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl shadow-lg border-2 border-[#0B5351]/20 overflow-hidden mb-8 shadow-[#0B5351]/10">
            <div className="p-6 border-b">
              <div className="mb-4 p-3 border-b border-gray-300">
                <h3 className="text-2xl font-bold text-gray-900">
                  Manage Inventory
                </h3>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  {/* Create Item Button */}
                  <button 
                    onClick={handleAddClick}
                    className="group bg-gradient-to-r from-[#0B5351] to-[#0A4B47] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#0A4B47] hover:to-[#083936] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl active:shadow-md active:translate-y-0.5 flex items-center justify-center space-x-2 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-300 relative z-10">
                      <span className="text-lg font-bold">+</span>
                    </div>
                    <span className="relative z-10">Add New Item</span>
                  </button>

                  {/* Search Bar */}
                  <div className="relative flex-1 sm:w-64">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#0B5351] transition-colors duration-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search inventory..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0B5351] focus:border-[#0B5351] hover:shadow-md transition-all duration-300"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-300"
                      >
                        <div className="w-5 h-5 bg-gray-200 hover:bg-red-100 rounded-full flex items-center justify-center">
                          ✕
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div className="flex bg-gray-100 rounded-xl border border-gray-200 p-1 shadow-sm">
                    <button
                      onClick={() => setActiveTab('printing')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                        activeTab === 'printing'
                          ? 'bg-gradient-to-r from-[#0B5351] to-[#0A4B47] text-white transform scale-105 shadow-lg'
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:text-[#0B5351] hover:shadow-md'
                      }`}
                    >
                      {activeTab === 'printing' && <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>}
                      <span className="relative z-10">Printing</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('production')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                        activeTab === 'production'
                          ? 'bg-gradient-to-r from-[#0B5351] to-[#0A4B47] text-white transform scale-105 shadow-lg'
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:text-[#0B5351] hover:shadow-md'
                      }`}
                    >
                      {activeTab === 'production' && <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>}
                      <span className="relative z-10">Production</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Table Section */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-sm border border-gray-200">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#0B5351] to-[#0A4B47] sticky top-0">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                          <div className="flex items-center space-x-1">
                            <span>ID</span>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z"></path>
                            </svg>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                          <div className="flex items-center space-x-1">
                            <span>Item Name</span>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Supplier</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Unit Price</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredData.map((item, index) => (
                        <tr key={item.id} className="group cursor-pointer hover:bg-gray-50 hover:shadow-md transition-all duration-300"
                          style={{ animationDelay: `${index * 50}ms` }}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-1 h-8 bg-[#0B5351] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"></div>
                              <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0B5351]/10 text-[#0B5351] border border-[#0B5351]/20 group-hover:scale-105 group-hover:bg-[#0B5351]/20 transition-all duration-300">
                                {item.id}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-[#0B5351]/10 rounded-full flex items-center justify-center group-hover:bg-[#0B5351]/20 group-hover:scale-110 transition-all duration-300">
                                <span className="text-sm font-bold text-[#0B5351] group-hover:text-[#0A4B47] transition-colors duration-300">
                                  {item.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-bold text-gray-900 group-hover:text-[#0B5351] transition-colors duration-300">
                                  {item.name}
                                </div>
                                <div className="text-xs text-gray-500 group-hover:text-gray-600">
                                  Updated: {item.lastUpdated}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border capitalize ${
                              item.stock < 10 
                                ? 'bg-red-100 text-[#0B5351] border-red-300'
                                : item.stock < 25
                                ? 'bg-yellow-100 text-[#0B5351] border-yellow-300'
                                : 'bg-green-100 text-[#0B5351] border-green-300'
                            } shadow-md`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                item.stock < 10 ? 'bg-red-500 animate-pulse' : 
                                item.stock < 25 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}></div>
                              {item.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span>{item.supplierName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-lg font-bold text-gray-900 group-hover:text-[#0B5351] transition-all duration-300 group-hover:scale-105">
                              Rs {item.unitPrice.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center items-center space-x-3 min-h-[40px]">
                              <button 
                                onClick={() => handleEditClick(item)}
                                className="group bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold hover:from-emerald-700 hover:to-emerald-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl active:shadow-md active:translate-y-0.5 transform flex items-center space-x-2 relative overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <svg className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                                </svg>
                                <span className="relative z-10">Edit</span>
                              </button>
                              
                              <button 
                                onClick={() => handleDeleteClick(item)}
                                className="group bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold hover:from-red-700 hover:to-red-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl active:shadow-md active:translate-y-0.5 transform flex items-center space-x-2 relative overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <svg className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                                </svg>
                                <span className="relative z-10">Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {filteredData.length === 0 && (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 py-20 text-center relative overflow-hidden shadow-sm">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B5351]/5 via-transparent to-[#8CBCB9]/5"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 21h6M15 21v-7m-6 7v-7"></path>
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-700 mb-4">No inventory items found</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                  {searchTerm 
                    ? (
                      <>
                        No items match <span className="font-semibold text-[#0B5351]">"{searchTerm}"</span> in <span className="font-semibold">{activeTab}</span> materials
                      </>
                    )
                    : `No ${activeTab} materials available yet. Add your first item to get started.`
                  }
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  {searchTerm ? (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="bg-gradient-to-r from-[#0B5351] to-[#8CBCB9] text-white px-8 py-3 rounded-xl font-bold hover:from-[#8CBCB9] hover:to-[#0B5351] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:shadow-md active:translate-y-0.5 flex items-center space-x-2 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      <span className="relative z-10">Clear Search</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleAddClick}
                      className="bg-gradient-to-r from-[#8CBCB9] to-[#0B5351] text-white px-8 py-3 rounded-xl font-bold hover:from-[#0B5351] hover:to-[#8CBCB9] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:shadow-md active:translate-y-0.5 flex items-center space-x-2 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center relative z-10">
                        <span className="text-sm font-bold">+</span>
                      </div>
                      <span className="relative z-10">Add Your First Item</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => setActiveTab(activeTab === 'printing' ? 'production' : 'printing')}
                    className="text-[#0B5351] font-semibold hover:text-[#8CBCB9] transition-colors duration-300 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                    </svg>
                    <span>Switch to {activeTab === 'printing' ? 'Production' : 'Printing'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-[#0B5351]">
                <h2 className="text-2xl font-bold text-gray-900">{isAddModalOpen ? 'Add New Item' : 'Edit Item'}</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5351] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5351] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Name</label>
                <input
                  type="text"
                  value={formData.supplierName}
                  onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                  className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5351] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5351] focus:border-transparent"
                />
              </div>
              
              {isAddModalOpen && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as 'printing' | 'production' })}
                    className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5351] focus:border-transparent"
                  >
                    <option value="printing">Printing</option>
                    <option value="production">Production</option>
                  </select>
                </div>
              )}
            </div>
            
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-[#8CBCB9] to-[#0B5351] text-white px-4 py-3 rounded-lg font-medium hover:from-[#0B5351] hover:to-[#8CBCB9] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:shadow-md active:translate-y-0.5 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Save Item</span>
                </button>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    setFormData({ name: '', stock: 0, supplierName: '', unitPrice: 0, category: 'printing' });
                  }}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-3 rounded-lg font-medium hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:shadow-md active:translate-y-0.5 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-rose-50 rounded-t-xl">
              <div className="p-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg border-l-4 border-red-500">
                <h2 className="text-2xl font-bold text-gray-900">Confirm Deletion</h2>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-[#0B5351]">{selectedItem?.name}</span>? This action cannot be undone and will permanently remove this item from your inventory.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:shadow-md active:translate-y-0.5 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Delete Item</span>
                </button>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedItem(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-3 rounded-lg font-medium hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:shadow-md active:translate-y-0.5 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
