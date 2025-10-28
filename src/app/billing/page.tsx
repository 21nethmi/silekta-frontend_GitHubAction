'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { FileText, DollarSign, Clock, AlertTriangle } from 'lucide-react';

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
        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Clean Header Section */}
          <div className="mb-6">
            <div className="text-left mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-[#0B5351] mb-2">
                Billing & Invoice Management
              </h1>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl shadow-lg border-2 border-[#0B5351]/20 overflow-hidden mb-8 shadow-[#0B5351]/10">
            <div className="p-6 border-b border-gray-200">
              <div className="mb-4 p-3 border-b border-gray-300">
                <h2 className="text-2xl font-bold text-gray-900">
                  Financial Overview
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Invoices Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group text-center">
                  <div className="w-12 h-12 bg-[#0B5351] rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                    <FileText className="text-white w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
                </div>

                {/* Total Revenue Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-sm border border-green-200 hover:shadow-md transition-all duration-300 group text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-900 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                    <DollarSign className="text-white w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-green-700 mb-2">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-800">Rs {totalRevenue.toLocaleString()}</p>
                </div>

                {/* Pending Amount Card */}
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl shadow-sm border border-yellow-200 hover:shadow-md transition-all duration-300 group text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-800 to-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                    <Clock className="text-white w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-yellow-700 mb-2">Pending Amount</p>
                  <p className="text-2xl font-bold text-yellow-800">Rs {pendingAmount.toLocaleString()}</p>
                </div>

                {/* Overdue Card */}
                <div className="bg-gradient-to-br from-red-50 to-rose-100 p-6 rounded-xl shadow-sm border border-red-200 hover:shadow-md transition-all duration-300 group text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-900 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                    <AlertTriangle className="text-white w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-red-700 mb-2">Overdue</p>
                  <p className="text-2xl font-bold text-red-800">{overdueInvoices}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Manage Invoices */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl shadow-lg border-2 border-[#0B5351]/20 overflow-hidden mb-8 shadow-[#0B5351]/10">
            {/* Quick Actions Section */}
            <div className="p-6 border-b">
              <div className="mb-4 p-3 border-b border-gray-300">
                <h3 className="text-2xl font-bold text-gray-900">
                  Manage Invoices
                </h3>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  {/* Create Invoice Button */}
                  <button 
                    onClick={handleCreateInvoice}
                    className="group bg-gradient-to-r from-[#0B5351] to-[#0A4B47] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#0A4B47] hover:to-[#083936] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl active:shadow-md active:translate-y-0.5 flex items-center justify-center space-x-2 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-300 relative z-10">
                      <span className="text-lg font-bold">+</span>
                    </div>
                    <span className="relative z-10">Create New Invoice</span>
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
                      placeholder="Search invoices..."
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

                  {/* Status Filter */}
                  <div className="flex bg-gray-100 rounded-xl border border-gray-200 p-1 shadow-sm">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                        activeTab === 'all'
                          ? 'bg-gradient-to-r from-[#0B5351] to-[#0A4B47] text-white transform scale-105 shadow-lg'
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:text-[#0B5351] hover:shadow-md'
                      }`}
                    >
                      {activeTab === 'all' && <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>}
                      <span className="relative z-10">All</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('paid')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                        activeTab === 'paid'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white transform scale-105 shadow-lg'
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-green-100 hover:to-green-200 hover:text-green-700 hover:shadow-md'
                      }`}
                    >
                      {activeTab === 'paid' && <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>}
                      <span className="relative z-10">Paid</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('pending')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                        activeTab === 'pending'
                          ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white transform scale-105 shadow-lg'
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-yellow-100 hover:to-yellow-200 hover:text-yellow-700 hover:shadow-md'
                      }`}
                    >
                      {activeTab === 'pending' && <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>}
                      <span className="relative z-10">Pending</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('overdue')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                        activeTab === 'overdue'
                          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white transform scale-105 shadow-lg'
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-red-100 hover:to-red-200 hover:text-red-700 hover:shadow-md'
                      }`}
                    >
                      {activeTab === 'overdue' && <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>}
                      <span className="relative z-10">Overdue</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoices Table Section */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-sm border border-gray-200">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#0B5351] to-[#0A4B47] sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>Invoice #</span>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z"></path>
                        </svg>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>Customer</span>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredInvoices.map((invoice, index) => (
                    <tr key={invoice.id} className="group cursor-pointer hover:bg-gray-50 hover:shadow-md transition-all duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-1 h-8 bg-[#0B5351] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"></div>
                          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0B5351]/10 text-[#0B5351] border border-[#0B5351]/20 group-hover:scale-105 group-hover:bg-[#0B5351]/20 transition-all duration-300">
                            {invoice.invoiceNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#0B5351]/10 rounded-full flex items-center justify-center group-hover:bg-[#0B5351]/20 group-hover:scale-110 transition-all duration-300">
                            <span className="text-sm font-bold text-[#0B5351] group-hover:text-[#0A4B47] transition-colors duration-300">
                              {invoice.customerName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900 group-hover:text-[#0B5351] transition-colors duration-300">
                              {invoice.customerName}
                            </div>
                            <div className="text-xs text-gray-500 group-hover:text-gray-600">
                              {invoice.customerEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>{invoice.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <span>{invoice.dueDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-bold text-gray-900 group-hover:text-[#0B5351] transition-all duration-300 group-hover:scale-105">
                          Rs {invoice.totalAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border capitalize ${
                          invoice.paymentStatus === 'paid' 
                            ? 'bg-green-100 text-[#0B5351] border-green-300'
                            : invoice.paymentStatus === 'pending'
                            ? 'bg-yellow-100 text-[#0B5351] border-yellow-300'
                            : 'bg-red-100 text-[#0B5351] border-red-300'
                        } shadow-md`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            invoice.paymentStatus === 'paid' ? 'bg-green-500 animate-pulse' : 
                            invoice.paymentStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          {invoice.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center items-center space-x-3 min-h-[40px]">
                          <button 
                            onClick={() => handlePreviewInvoice(invoice)}
                            className="group bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold hover:from-emerald-700 hover:to-emerald-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl active:shadow-md active:translate-y-0.5 transform flex items-center space-x-2 relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <svg className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                            </svg>
                            <span className="relative z-10">Preview</span>
                          </button>
                          
                          {/* Fixed width container for the second button to maintain alignment */}
                          <div className="w-[110px] flex justify-center">
                            {(invoice.paymentStatus === 'pending' || invoice.paymentStatus === 'overdue') && (
                              <button 
                                onClick={() => updatePaymentStatus(invoice.id, 'paid')}
                                className="group bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold hover:from-emerald-700 hover:to-emerald-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl active:shadow-md active:translate-y-0.5 transform flex items-center space-x-2 relative overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <svg className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                <span className="relative z-10">Mark Paid</span>
                              </button>
                            )}
                          </div>
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

          {filteredInvoices.length === 0 && (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 py-20 text-center relative overflow-hidden shadow-sm">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B5351]/5 via-transparent to-[#8CBCB9]/5"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-700 mb-4">No invoices found</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                  {searchTerm 
                    ? (
                      <>
                        No invoices match <span className="font-semibold text-[#0B5351]">"{searchTerm}"</span> in <span className="font-semibold">{activeTab}</span> status
                      </>
                    )
                    : `No ${activeTab} invoices available yet. Create your first invoice to get started.`
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
                      onClick={handleCreateInvoice}
                      className="bg-gradient-to-r from-[#8CBCB9] to-[#0B5351] text-white px-8 py-3 rounded-xl font-bold hover:from-[#0B5351] hover:to-[#8CBCB9] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:shadow-md active:translate-y-0.5 flex items-center space-x-2 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center relative z-10">
                        <span className="text-sm font-bold">+</span>
                      </div>
                      <span className="relative z-10">Create Your First Invoice</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => setActiveTab('all')}
                    className="text-[#0B5351] font-semibold hover:text-[#8CBCB9] transition-colors duration-300 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                    </svg>
                    <span>View All Invoices</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-[#0B5351]">
                <h2 className="text-2xl font-bold text-gray-900">Create New Invoice</h2>
              </div>
            </div>
            
            <div className="p-6">
              {/* Customer Information */}
              <div className="mb-6">
                <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-[#0B5351]">
                  <h3 className="text-lg font-semibold text-gray-800">Customer Information</h3>
                </div>
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
                <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-[#0B5351] flex justify-between items-center">
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
                <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-[#0B5351]">
                  <h3 className="text-lg font-semibold text-gray-800">Notes (Optional)</h3>
                </div>
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
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-[#0B5351] flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Invoice Preview</h2>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              
              {/* Professional Invoice Layout */}
              <div className="bg-white border rounded-lg p-8" id="invoice-content">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-[#0B5351]">Silekta Holdings</h1>
                    <p className="text-gray-800">Paper Products & Printing Solutions</p>
                    <p className="text-sm text-gray-700 mt-2">
                      123 Industrial Road, Colombo 10<br/>
                      Phone: +94 11 234 5678<br/>
                      Email: info@silekta.lk
                    </p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h2>
                    <p className="text-sm text-gray-800">Invoice #: {selectedInvoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-800">Date: {selectedInvoice.date}</p>
                    <p className="text-sm text-gray-800">Due Date: {selectedInvoice.dueDate}</p>
                  </div>
                </div>

                {/* Bill To */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bill To:</h3>
                  <div className="text-gray-800">
                    <p className="font-medium">{selectedInvoice.customerName}</p>
                    <p>{selectedInvoice.customerEmail}</p>
                    <p className="whitespace-pre-line">{selectedInvoice.customerAddress}</p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <table className="w-full border-collapse border border-gray-400">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-400 px-4 py-2 text-left text-gray-900 font-semibold">Description</th>
                        <th className="border border-gray-400 px-4 py-2 text-right text-gray-900 font-semibold">Qty</th>
                        <th className="border border-gray-400 px-4 py-2 text-right text-gray-900 font-semibold">Unit Price</th>
                        <th className="border border-gray-400 px-4 py-2 text-right text-gray-900 font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item, index) => (
                        <tr key={index}>
                          <td className="border border-gray-400 px-4 py-2 text-gray-800">{item.name}</td>
                          <td className="border border-gray-400 px-4 py-2 text-right text-gray-800">{item.quantity}</td>
                          <td className="border border-gray-400 px-4 py-2 text-right text-gray-800">Rs {item.unitPrice.toFixed(2)}</td>
                          <td className="border border-gray-400 px-4 py-2 text-right text-gray-800">Rs {item.total.toFixed(2)}</td>
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
                <div className="text-center text-sm text-gray-700 border-t pt-6">
                  <p>Thank you for your business!</p>
                  <p>For any queries, please contact us at info@silekta.lk or +94 11 234 5678</p>
                </div>
              </div>
              
              {/* Action Buttons - Hidden in print */}
              <div className="flex space-x-3 mt-6 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-gradient-to-r from-[#0B5351] to-[#0A4B47] text-white px-4 py-3 rounded-lg font-medium hover:from-[#0A4B47] hover:to-[#083936] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:shadow-md active:translate-y-0.5 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Print Invoice</span>
                </button>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-3 rounded-lg font-medium hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:shadow-md active:translate-y-0.5 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Close</span>
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