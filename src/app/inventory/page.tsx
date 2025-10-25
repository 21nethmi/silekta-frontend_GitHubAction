'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

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

  // Dummy data for inventory items
  const inventoryData: InventoryItem[] = [
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
  ];

  const filteredData = inventoryData.filter(item => {
    const matchesCategory = item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const lowStockItems = inventoryData.filter(item => item.stock < 10);
  const recentlyRefilledItems = inventoryData.filter(item => 
    new Date(item.lastUpdated) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Centered Header Section */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
            <p className="text-gray-600">Manage your raw materials and production supplies</p>
          </div>

          {/* Centered Alert Buttons and Create Button */}
          <div className="flex flex-col items-center space-y-3 mb-6">
            {/* Alert Buttons Row */}
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setSearchTerm('')}
                className="bg-[#DE8080] text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-[#DE8080]/90 transition-all duration-200 shadow-md"
              >
                <div className="text-left">
                  <div className="font-semibold">Low Stock Alerts</div>
                  <div className="text-xs opacity-90">{lowStockItems.length} items need attention</div>
                </div>
              </button>
              
              <button 
                onClick={() => setSearchTerm('')}
                className="bg-[#80DED9] text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-[#80DED9]/90 transition-all duration-200 shadow-md"
              >
                <div className="text-left">
                  <div className="font-semibold">Recently Refilled</div>
                  <div className="text-xs opacity-90">{recentlyRefilledItems.length} items updated</div>
                </div>
              </button>
            </div>

            {/* Create Button */}
            <button className="bg-[#8CBCB9] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#8CBCB9]/90 transition-all duration-200 shadow-md">
              Add New Inventory Item
            </button>
          </div>

          {/* Centered Search and Filter Section */}
          <div className="flex flex-col items-center space-y-4 mb-6">
            {/* Search Bar */}
            <div className="w-full max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5351] focus:border-[#0B5351] transition-all duration-200 shadow-sm placeholder-gray-600"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-gray-100 rounded-lg p-1 flex shadow-sm">
              <button
                onClick={() => setActiveTab('printing')}
                className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'printing'
                    ? 'bg-white text-[#0B5351] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Printing Materials
              </button>
              <button
                onClick={() => setActiveTab('production')}
                className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'production'
                    ? 'bg-white text-[#0B5351] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Production Materials
              </button>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-white border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {activeTab === 'printing' ? 'Printing Materials' : 'Production Materials'} 
                <span className="ml-2 text-sm text-gray-500">({filteredData.length} items)</span>
              </h3>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200 bg-white">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#0B5351]/10 text-[#0B5351]">
                          {item.id}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.lastUpdated}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                          item.stock < 10 
                            ? 'bg-red-100 text-red-800' 
                            : item.stock < 25 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.supplierName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-semibold">${item.unitPrice.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          <button className="bg-[#0B5351] text-white px-3 py-1 rounded text-xs font-medium hover:bg-[#0B5351]/90 transition-colors">
                            Edit
                          </button>
                          <button className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600 transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? `No items match "${searchTerm}" in ${activeTab} materials`
                  : `No ${activeTab} materials available`
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-[#0B5351] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0B5351]/90 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
