'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  notes?: string;
}

const BillingPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  // Form state for creating invoices
  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    notes: ''
  });

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { id: '1', name: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);

  // Sample invoice data - simulating real business data
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV001',
      invoiceNumber: 'SLK-2024-001',
      customerName: 'Keells Super',
      customerEmail: 'procurement@keells.lk',
      customerAddress: 'No. 148, Vauxhall Street, Colombo 02',
      date: '2024-01-15',
      dueDate: '2024-02-15',
      items: [
        { id: '1', name: 'Paper Plates (White) - Pack of 50', quantity: 100, unitPrice: 14.50, total: 1450.00 },
        { id: '2', name: 'Paper Cups - Medium', quantity: 200, unitPrice: 8.75, total: 1750.00 }
      ],
      subtotal: 3200.00,
      tax: 416.00,
      totalAmount: 3616.00,
      paymentStatus: 'paid'
    },
    {
      id: 'INV002',
      invoiceNumber: 'SLK-2024-002',
      customerName: 'Arpico Supercenter',
      customerEmail: 'orders@arpico.com',
      customerAddress: 'No. 65, York Street, Colombo 01',
      date: '2024-01-18',
      dueDate: '2024-02-18',
      items: [
        { id: '1', name: 'Wooden Cutlery Set', quantity: 75, unitPrice: 15.00, total: 1125.00 },
        { id: '2', name: 'Paper Bags - Large', quantity: 150, unitPrice: 12.25, total: 1837.50 }
      ],
      subtotal: 2962.50,
      tax: 385.13,
      totalAmount: 3347.63,
      paymentStatus: 'pending'
    },
    {
      id: 'INV003',
      invoiceNumber: 'SLK-2024-003',
      customerName: 'Cargills Food City',
      customerEmail: 'purchasing@cargillsceylon.com',
      customerAddress: 'No. 40, York Street, Colombo 01',
      date: '2024-01-10',
      dueDate: '2024-01-25',
      items: [
        { id: '1', name: 'Kraft Paper Bags - Medium', quantity: 300, unitPrice: 8.25, total: 2475.00 }
      ],
      subtotal: 2475.00,
      tax: 321.75,
      totalAmount: 2796.75,
      paymentStatus: 'overdue'
    },
    {
      id: 'INV004',
      invoiceNumber: 'SLK-2024-004',
      customerName: 'Wijesiri Distributors',
      customerEmail: 'admin@wijesiri.lk',
      customerAddress: 'No. 123, Galle Road, Mount Lavinia',
      date: '2024-01-20',
      dueDate: '2024-02-20',
      items: [
        { id: '1', name: 'Paper Plates - Lunch Box Size', quantity: 500, unitPrice: 6.50, total: 3250.00 },
        { id: '2', name: 'Biodegradable Cups', quantity: 200, unitPrice: 22.50, total: 4500.00 }
      ],
      subtotal: 7750.00,
      tax: 1007.50,
      totalAmount: 8757.50,
      paymentStatus: 'pending'
    }
  ]);

  // Filter invoices based on active tab and search term
  const filteredInvoices = invoices.filter(invoice => {
    const matchesTab = activeTab === 'all' || invoice.paymentStatus === activeTab;
    const matchesSearch = invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Calculate invoice statistics
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.paymentStatus === 'paid').length;
  const pendingInvoices = invoices.filter(inv => inv.paymentStatus === 'pending').length;
  const overdueInvoices = invoices.filter(inv => inv.paymentStatus === 'overdue').length;
  const totalRevenue = invoices
    .filter(inv => inv.paymentStatus === 'paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
  const pendingAmount = invoices
    .filter(inv => inv.paymentStatus === 'pending' || inv.paymentStatus === 'overdue')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const handleCreateInvoice = () => {
    setCustomerInfo({ customerName: '', customerEmail: '', customerAddress: '', notes: '' });
    setInvoiceItems([{ id: '1', name: '', quantity: 1, unitPrice: 0, total: 0 }]);
    setIsCreateModalOpen(true);
  };

  const handlePreviewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPreviewModalOpen(true);
  };

  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  const updateInvoiceItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceItems(items => items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const removeInvoiceItem = (id: string) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(items => items.filter(item => item.id !== id));
    }
  };

  const calculateTotals = () => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.13; // 13% VAT
    const totalAmount = subtotal + tax;
    return { subtotal, tax, totalAmount };
  };

  const handleSaveInvoice = () => {
    const { subtotal, tax, totalAmount } = calculateTotals();
    const newInvoice: Invoice = {
      id: `INV${String(invoices.length + 1).padStart(3, '0')}`,
      invoiceNumber: `SLK-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      customerName: customerInfo.customerName,
      customerEmail: customerInfo.customerEmail,
      customerAddress: customerInfo.customerAddress,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      items: invoiceItems.filter(item => item.name.trim() !== ''),
      subtotal,
      tax,
      totalAmount,
      paymentStatus: 'pending',
      notes: customerInfo.notes
    };

    setInvoices([newInvoice, ...invoices]);
    setIsCreateModalOpen(false);
  };

  const updatePaymentStatus = (invoiceId: string, newStatus: 'paid' | 'pending' | 'overdue') => {
    setInvoices(invoices.map(invoice =>
      invoice.id === invoiceId ? { ...invoice, paymentStatus: newStatus } : invoice
    ));
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTabButtonColor = (tabName: string) => {
    if (activeTab === tabName) {
      return 'bg-white text-[#0B5351] shadow-sm';
    }
    return 'text-gray-600 hover:text-gray-900 hover:bg-gray-50';
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Invoice Management</h1>
            <p className="text-gray-600">Manage invoices, track payments, and streamline billing processes</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
                </div>
                <div className="w-12 h-12 bg-[#0B5351]/10 rounded-lg flex items-center justify-center">
                  <span className="text-[#0B5351] text-xl">📄</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">Rs {totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xl">💰</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                  <p className="text-2xl font-bold text-yellow-600">Rs {pendingAmount.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">⏰</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{overdueInvoices}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 text-xl">⚠️</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center mb-6">
            <button 
              onClick={handleCreateInvoice}
              className="bg-[#8CBCB9] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#8CBCB9]/90 transition-all duration-200 shadow-md flex items-center space-x-2"
            >
              <span className="text-xl">+</span>
              <span>Create New Invoice</span>
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col items-center space-y-4 mb-6">
            {/* Search Bar */}
            <div className="w-full max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by customer name or invoice number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5351] focus:border-[#0B5351] transition-all duration-200 shadow-sm placeholder-gray-600"
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

            {/* Status Filter */}
            <div className="bg-gray-100 rounded-lg p-1 flex shadow-sm">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${getTabButtonColor('all')}`}
              >
                All Invoices
              </button>
              <button
                onClick={() => setActiveTab('paid')}
                className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${getTabButtonColor('paid')}`}
              >
                Paid ({paidInvoices})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${getTabButtonColor('pending')}`}
              >
                Pending ({pendingInvoices})
              </button>
              <button
                onClick={() => setActiveTab('overdue')}
                className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${getTabButtonColor('overdue')}`}
              >
                Overdue ({overdueInvoices})
              </button>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-white border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Invoices 
                <span className="ml-2 text-sm text-gray-500">({filteredInvoices.length} invoices)</span>
              </h3>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Invoice #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#0B5351]/10 text-[#0B5351]">
                          {invoice.invoiceNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invoice.customerName}</div>
                        <div className="text-xs text-gray-500">{invoice.customerEmail}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {invoice.date}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {invoice.dueDate}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-semibold">Rs {invoice.totalAmount.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadgeColor(invoice.paymentStatus)}`}>
                          {invoice.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          <button 
                            onClick={() => handlePreviewInvoice(invoice)}
                            className="bg-[#0B5351] text-white px-3 py-1 rounded text-xs font-medium hover:bg-[#0B5351]/90 transition-colors"
                          >
                            Preview
                          </button>
                          {invoice.paymentStatus === 'pending' && (
                            <button 
                              onClick={() => updatePaymentStatus(invoice.id, 'paid')}
                              className="bg-green-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-600 transition-colors"
                            >
                              Mark Paid
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

          {filteredInvoices.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No invoices found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? `No invoices match "${searchTerm}" in ${activeTab} status`
                  : `No ${activeTab} invoices available`
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

      {/* Create Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Invoice</h2>
              
              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                    <input
                      type="text"
                      value={customerInfo.customerName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, customerName: e.target.value })}
                      className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5351] focus:border-transparent"
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email</label>
                    <input
                      type="email"
                      value={customerInfo.customerEmail}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, customerEmail: e.target.value })}
                      className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5351] focus:border-transparent"
                      placeholder="Enter customer email"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Address</label>
                    <textarea
                      value={customerInfo.customerAddress}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, customerAddress: e.target.value })}
                      className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5351] focus:border-transparent"
                      rows={2}
                      placeholder="Enter customer address"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Invoice Items</h3>
                  <button
                    onClick={addInvoiceItem}
                    className="bg-[#8CBCB9] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#8CBCB9]/90 transition-colors"
                  >
                    Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {invoiceItems.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-5">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateInvoiceItem(item.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-[#0B5351] focus:border-transparent"
                          placeholder="Enter item name"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateInvoiceItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-[#0B5351] focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateInvoiceItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-[#0B5351] focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                        <input
                          type="text"
                          value={`Rs ${item.total.toFixed(2)}`}
                          readOnly
                          className="w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded"
                        />
                      </div>
                      <div className="col-span-1">
                        <button
                          onClick={() => removeInvoiceItem(item.id)}
                          className="w-full bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600 transition-colors"
                          disabled={invoiceItems.length === 1}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice Summary */}
              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Subtotal:</span>
                    <span>Rs {calculateTotals().subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Tax (13%):</span>
                    <span>Rs {calculateTotals().tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                    <span>Total Amount:</span>
                    <span>Rs {calculateTotals().totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                  className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5351] focus:border-transparent"
                  rows={3}
                  placeholder="Add any additional notes..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveInvoice}
                  className="flex-1 bg-[#8CBCB9] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#8CBCB9]/90 transition-colors"
                  disabled={!customerInfo.customerName || invoiceItems.every(item => !item.name.trim())}
                >
                  Create Invoice
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {isPreviewModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Invoice Preview</h2>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              
              {/* Professional Invoice Layout */}
              <div className="bg-white border rounded-lg p-8" id="invoice-content">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-[#0B5351]">Silekta Holdings</h1>
                    <p className="text-gray-600">Paper Products & Printing Solutions</p>
                    <p className="text-sm text-gray-500 mt-2">
                      123 Industrial Road, Colombo 10<br/>
                      Phone: +94 11 234 5678<br/>
                      Email: info@silekta.lk
                    </p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h2>
                    <p className="text-sm text-gray-600">Invoice #: {selectedInvoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-600">Date: {selectedInvoice.date}</p>
                    <p className="text-sm text-gray-600">Due Date: {selectedInvoice.dueDate}</p>
                  </div>
                </div>

                {/* Bill To */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bill To:</h3>
                  <div className="text-gray-600">
                    <p className="font-medium">{selectedInvoice.customerName}</p>
                    <p>{selectedInvoice.customerEmail}</p>
                    <p className="whitespace-pre-line">{selectedInvoice.customerAddress}</p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">Qty</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{item.quantity}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">Rs {item.unitPrice.toFixed(2)}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">Rs {item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-64">
                    <div className="flex justify-between py-2 border-b">
                      <span>Subtotal:</span>
                      <span>Rs {selectedInvoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Tax (13%):</span>
                      <span>Rs {selectedInvoice.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold text-lg">
                      <span>Total:</span>
                      <span>Rs {selectedInvoice.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="mb-6">
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">Payment Status:</span>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full capitalize ${getStatusBadgeColor(selectedInvoice.paymentStatus)}`}>
                      {selectedInvoice.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {selectedInvoice.notes && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Notes:</h4>
                    <p className="text-gray-600 whitespace-pre-line">{selectedInvoice.notes}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 border-t pt-6">
                  <p>Thank you for your business!</p>
                  <p>For any queries, please contact us at info@silekta.lk or +94 11 234 5678</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-[#0B5351] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#0B5351]/90 transition-colors"
                >
                  Print Invoice
                </button>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPage;