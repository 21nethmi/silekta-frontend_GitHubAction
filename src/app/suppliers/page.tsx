'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

interface Supplier {
  id: string;
  name: string;
  country: 'China' | 'India' | 'Sri Lanka';
  avgDelivery: string;
  rating: number;
}

interface Purchase {
  id: string;
  supplier: string;
  material: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  date: string;
  status: 'Delivered' | 'In Transit' | 'Processing' | 'Pending';
  category: 'printing' | 'production';
}

const SuppliersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Function to add delivered items to inventory (simulation)
  const addToInventory = (purchase: Purchase) => {
    // This would typically make an API call to add the item to inventory
    console.log(`Adding ${purchase.quantity} units of ${purchase.material} to inventory`);
    
    // Get the corresponding inventory item ID based on material name
    const getInventoryId = (materialName: string): string => {
      const idMap: { [key: string]: string } = {
        'Premium Paper Roll (A4)': 'P001',
        'Ink Cartridge - Black': 'P002',
        'Ink Cartridge - Color': 'P003',
        'Cardstock Paper (Heavy)': 'P004',
        'Kraft Paper (Brown)': 'PR001',
        'Wooden Cutlery Set': 'PR002',
        'Biodegradable Cups': 'PR003',
        'Paper Plates (White)': 'PR004'
      };
      return idMap[materialName] || 'Unknown';
    };

    const inventoryId = getInventoryId(purchase.material);
    
    // In a real application, this would update the inventory database
    // For now, we'll just log the action
    console.log(`Inventory Update: Item ${inventoryId} (${purchase.material}) stock increased by ${purchase.quantity} units`);
    console.log(`Supplier: ${purchase.supplier}, Unit Price: $${purchase.unitPrice}, Total Value: $${purchase.totalCost}`);
  };

  // State for modals
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showNewPurchase, setShowNewPurchase] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 'SUP-001',
      name: 'PaperCorp Ltd',
      country: 'China',
      avgDelivery: '7 Days',
      rating: 4.5
    },
    {
      id: 'SUP-002',
      name: 'PrintTech Solutions',
      country: 'India',
      avgDelivery: '5 Days',
      rating: 4.7
    },
    {
      id: 'SUP-003',
      name: 'EcoMaterials Inc',
      country: 'Sri Lanka',
      avgDelivery: '4 Days',
      rating: 4.9
    },
    {
      id: 'SUP-004',
      name: 'GreenWare Co',
      country: 'India',
      avgDelivery: '6 Days',
      rating: 4.6
    }
  ]);

  const [purchases, setPurchases] = useState<Purchase[]>([
    {
      id: 'PO-00834',
      supplier: 'PaperCorp Ltd',
      material: 'Premium Paper Roll (A4)',
      quantity: 50,
      unitPrice: 12.50,
      totalCost: 50 * 12.50,
      date: '2024-01-15',
      status: 'Delivered',
      category: 'printing'
    },
    {
      id: 'PO-00835',
      supplier: 'PrintTech Solutions',
      material: 'Ink Cartridge - Black',
      quantity: 20,
      unitPrice: 25.00,
      totalCost: 500.00,
      date: '2024-01-14',
      status: 'In Transit',
      category: 'printing'
    },
    {
      id: 'PO-00836',
      supplier: 'PrintTech Solutions',
      material: 'Ink Cartridge - Color',
      quantity: 15,
      unitPrice: 28.50,
      totalCost: 427.50,
      date: '2024-01-13',
      status: 'Processing',
      category: 'printing'
    },
    {
      id: 'PO-00837',
      supplier: 'PaperCorp Ltd',
      material: 'Cardstock Paper (Heavy)',
      quantity: 10,
      unitPrice: 18.75,
      totalCost: 187.50,
      date: '2024-01-12',
      status: 'Pending',
      category: 'printing'
    }
  ]);

  // Statistics
  const totalSuppliers = suppliers.length;
  const purchasesThisMonth = purchases.length;
  const avgDeliveryTime = '4.2 Days';
  const bestPerformingSupplier = 'Innovate Supplies';

  // Filter functions
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = countryFilter === 'All' || supplier.country === countryFilter;
    const matchesRating = ratingFilter === 'All' || 
      (ratingFilter === '4.5+' && supplier.rating >= 4.5) ||
      (ratingFilter === '4.0+' && supplier.rating >= 4.0);
    
    return matchesSearch && matchesCountry && matchesRating;
  });

  const filteredPurchases = purchases.filter(purchase => {
    return statusFilter === 'All' || purchase.status === statusFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Supplier & Purchase Management</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search supplier or purchase..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5351] focus:border-[#0B5351] transition-all duration-200"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
              <button 
                onClick={() => setShowAddSupplier(true)}
                className="bg-[#0B5351] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0B5351]/90 transition-colors flex items-center justify-center space-x-2"
              >
                <span>+</span>
                <span className="hidden sm:inline">Add Supplier</span>
                <span className="sm:hidden">Add</span>
              </button>
              <button 
                onClick={() => setShowNewPurchase(true)}
                className="bg-[#0B5351] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0B5351]/90 transition-colors flex items-center justify-center space-x-2"
              >
                <span>🛒</span>
                <span className="hidden sm:inline">New Purchase</span>
                <span className="sm:hidden">Purchase</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Suppliers</h3>
                <div className="text-[#0B5351]">👥</div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{totalSuppliers}</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#0B5351] h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Purchases This Month</h3>
                <div className="text-[#80DED9]">🛒</div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{purchasesThisMonth}</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#80DED9] h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Average Delivery Time</h3>
                <div className="text-[#DE8080]">🕒</div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{avgDeliveryTime}</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#DE8080] h-2 rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Best Performing Supplier</h3>
                <div className="text-[#0B5351]">⭐</div>
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1">{bestPerformingSupplier}</div>
              <div className="text-sm text-gray-600">Rating: 4.9/5.0</div>
            </div>
          </div>

          {/* Supplier Overview Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 sm:mb-8">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Supplier Overview</h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B7A78] focus:border-[#0B7A78]"
                  >
                    <option value="All">Country</option>
                    <option value="China">China</option>
                    <option value="India">India</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                  </select>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B7A78] focus:border-[#0B7A78]"
                  >
                    <option value="All">Rating</option>
                    <option value="4.5+">4.5+ Stars</option>
                    <option value="4.0+">4.0+ Stars</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B7A78] focus:border-[#0B7A78]"
                  >
                    <option value="All">Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <button className="bg-[#0B5351] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0B5351]/90 transition-colors">
                    📄 Export
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Supplier Name
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Delivery
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#0B5351]/10 text-[#0B5351]">
                          {supplier.id}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{supplier.country}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{supplier.avgDelivery}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          {renderStars(supplier.rating)}
                          <span className="text-sm text-gray-600 ml-2 hidden sm:inline">{supplier.rating}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          <button className="bg-[#0B5351] text-white px-3 py-1 rounded text-xs font-medium hover:bg-[#0B5351]/90 transition-colors text-center">
                            Edit
                          </button>
                          <button className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600 transition-colors text-center">
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

          {/* Recent Purchases Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Purchases</h2>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B7A78] focus:border-[#0B7A78]"
                >
                  <option value="All">All Status</option>
                  <option value="Delivered">Delivered</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Processing">Processing</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPurchases.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#0B5351]/10 text-[#0B5351]">
                          {purchase.id}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{purchase.supplier}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{purchase.material}</div>
                        <div className="text-xs text-gray-500 capitalize">{purchase.category}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{purchase.quantity.toLocaleString()}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${purchase.unitPrice.toFixed(2)}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">${purchase.totalCost.toLocaleString()}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{purchase.date}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded text-center justify-center ${getStatusColor(purchase.status)}`}>
                            {purchase.status}
                          </span>
                          {purchase.status !== 'Delivered' && (
                            <button
                              onClick={() => {
                                const updatedPurchases = purchases.map(p => 
                                  p.id === purchase.id ? { ...p, status: 'Delivered' as const } : p
                                );
                                setPurchases(updatedPurchases);
                                addToInventory(purchase);
                                
                                // Get inventory ID for display
                                const getInventoryId = (materialName: string): string => {
                                  const idMap: { [key: string]: string } = {
                                    'Premium Paper Roll (A4)': 'P001',
                                    'Ink Cartridge - Black': 'P002',
                                    'Ink Cartridge - Color': 'P003',
                                    'Cardstock Paper (Heavy)': 'P004',
                                    'Kraft Paper (Brown)': 'PR001',
                                    'Wooden Cutlery Set': 'PR002',
                                    'Biodegradable Cups': 'PR003',
                                    'Paper Plates (White)': 'PR004'
                                  };
                                  return idMap[materialName] || 'Unknown';
                                };
                                
                                const inventoryId = getInventoryId(purchase.material);
                                alert(`✅ Purchase Delivered!\n\n` +
                                      `Item: ${purchase.material}\n` +
                                      `Inventory ID: ${inventoryId}\n` +
                                      `Quantity Added: ${purchase.quantity} units\n` +
                                      `Supplier: ${purchase.supplier}\n` +
                                      `Total Value: $${purchase.totalCost.toFixed(2)}\n\n` +
                                      `The inventory stock has been updated automatically.`);
                              }}
                              className="text-xs bg-[#0B7A78] text-white px-2 py-1 rounded hover:bg-[#0B7A78]/90 transition-colors text-center"
                            >
                              Mark Delivered
                            </button>
                          )}
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

      {/* Add Supplier Modal */}
      {showAddSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Add New Supplier</h2>
              <button
                onClick={() => setShowAddSupplier(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const newSupplier: Supplier = {
                id: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
                name: formData.get('name') as string,
                country: formData.get('country') as 'China' | 'India' | 'Sri Lanka',
                avgDelivery: formData.get('avgDelivery') as string,
                rating: parseFloat(formData.get('rating') as string)
              };
              setSuppliers([...suppliers, newSupplier]);
              setShowAddSupplier(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B7A78] focus:border-[#0B7A78]"
                    placeholder="Enter supplier name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    name="country"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B7A78] focus:border-[#0B7A78]"
                  >
                    <option value="">Select Country</option>
                    <option value="China">China</option>
                    <option value="India">India</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Average Delivery Time
                  </label>
                  <input
                    name="avgDelivery"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B7A78] focus:border-[#0B7A78]"
                    placeholder="e.g., 5 Days"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating (1-5)
                  </label>
                  <input
                    name="rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B7A78] focus:border-[#0B7A78]"
                    placeholder="4.5"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddSupplier(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B7A78] text-white rounded-lg hover:bg-[#0B7A78]/90"
                >
                  Add Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Purchase Modal */}
      {showNewPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">New Purchase Order</h2>
              <button
                onClick={() => setShowNewPurchase(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const quantity = parseInt(formData.get('quantity') as string);
              const unitPrice = parseFloat(formData.get('unitPrice') as string);
              const material = formData.get('material') as string;
              
              // Auto-determine category based on material
              const printingMaterials = ['Premium Paper Roll (A4)', 'Ink Cartridge - Black', 'Ink Cartridge - Color', 'Cardstock Paper (Heavy)'];
              const category = printingMaterials.includes(material) ? 'printing' : 'production';
              
              const newPurchase: Purchase = {
                id: `PO-${String(purchases.length + 838).padStart(5, '0')}`,
                supplier: formData.get('supplier') as string,
                material,
                quantity,
                unitPrice,
                totalCost: quantity * unitPrice,
                date: new Date().toISOString().split('T')[0],
                status: 'Pending',
                category: category as 'printing' | 'production'
              };
              setPurchases([newPurchase, ...purchases]);
              setShowNewPurchase(false);
              
              // Auto-add to inventory notification
              alert(`Purchase order created successfully! Items will be added to inventory when delivered.\nCategory: ${category.charAt(0).toUpperCase() + category.slice(1)} Materials`);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier
                  </label>
                  <select
                    name="supplier"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8CBCB9] focus:border-[#8CBCB9]"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.name}>
                        {supplier.name} ({supplier.country})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material/Product
                  </label>
                  <select
                    name="material"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8CBCB9] focus:border-[#8CBCB9]"
                  >
                    <option value="">Select Material</option>
                    <optgroup label="Printing Materials">
                      <option value="Premium Paper Roll (A4)">Premium Paper Roll (A4)</option>
                      <option value="Ink Cartridge - Black">Ink Cartridge - Black</option>
                      <option value="Ink Cartridge - Color">Ink Cartridge - Color</option>
                      <option value="Cardstock Paper (Heavy)">Cardstock Paper (Heavy)</option>
                    </optgroup>
                    <optgroup label="Production Materials">
                      <option value="Kraft Paper (Brown)">Kraft Paper (Brown)</option>
                      <option value="Wooden Cutlery Set">Wooden Cutlery Set</option>
                      <option value="Biodegradable Cups">Biodegradable Cups</option>
                      <option value="Paper Plates (White)">Paper Plates (White)</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8CBCB9] focus:border-[#8CBCB9]"
                    placeholder="Enter quantity"
                    onChange={(e) => {
                      // Auto-calculate total cost
                      const form = e.target.form;
                      const unitPriceInput = form?.querySelector('input[name="unitPrice"]') as HTMLInputElement;
                      const quantity = parseInt(e.target.value) || 0;
                      const unitPrice = parseFloat(unitPriceInput?.value || '0') || 0;
                      const totalDisplay = form?.querySelector('#totalCost');
                      if (totalDisplay) {
                        totalDisplay.textContent = `Total: $${(unitPrice * quantity).toFixed(2)}`;
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Price ($)
                  </label>
                  <input
                    name="unitPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8CBCB9] focus:border-[#8CBCB9]"
                    placeholder="0.00"
                    onChange={(e) => {
                      // Auto-calculate total cost
                      const form = e.target.form;
                      const quantityInput = form?.querySelector('input[name="quantity"]') as HTMLInputElement;
                      const unitPrice = parseFloat(e.target.value) || 0;
                      const quantity = parseInt(quantityInput?.value || '0') || 0;
                      const totalDisplay = form?.querySelector('#totalCost');
                      if (totalDisplay) {
                        totalDisplay.textContent = `Total: $${(unitPrice * quantity).toFixed(2)}`;
                      }
                    }}
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    <div>Suggested prices:</div>
                    <div className="text-xs space-y-1 mt-1">
                      <div>• Premium Paper Roll (A4): $12.50</div>
                      <div>• Ink Cartridge - Black: $25.00</div>
                      <div>• Ink Cartridge - Color: $28.50</div>
                      <div>• Cardstock Paper (Heavy): $18.75</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div id="totalCost" className="text-lg font-semibold text-[#0B5351]">
                    Total: $0.00
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewPurchase(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B7A78] text-white rounded-lg hover:bg-[#0B7A78]/90"
                >
                  Create Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersPage;