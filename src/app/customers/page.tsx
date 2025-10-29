"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import CustomerForm from "@/components/CustomerForm"
import { useCustomers } from "@/context/customer-context"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  status: "Active" | "Inactive"
  joinDate: string
}

const CustomersPage = () => {
  const router = useRouter()
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomers()
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; customerId: string | null }>({
    show: false,
    customerId: null,
  })
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCustomers = customers.filter((customer) =>
    Object.values(customer).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const handleAddCustomer = () => {
    setEditingCustomer(null)
    setShowForm(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setShowForm(true)
  }

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ show: true, customerId: id })
  }

  const handleConfirmDelete = () => {
    if (deleteConfirm.customerId) {
      deleteCustomer(deleteConfirm.customerId)
      setDeleteConfirm({ show: false, customerId: null })
    }
  }

  const handleCancelDelete = () => {
    setDeleteConfirm({ show: false, customerId: null })
  }

  const handleViewCustomer = (id: string) => {
    router.push(`/customers/${id}`)
  }

  const handleFormSubmit = (formData: Omit<Customer, "id">) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData)
    } else {
      addCustomer(formData)
    }
    setShowForm(false)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingCustomer(null)
  }

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
                Customer Management
              </h1>
              <p className="text-gray-600">Manage your customer database and relationships</p>
            </div>
          </div>

          {/* Customer Management Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl shadow-lg border-2 border-[#0B5351]/20 overflow-hidden mb-8 shadow-[#0B5351]/10">
            <div className="p-6 border-b">
              <div className="mb-4 p-3 border-b border-gray-300">
                <h3 className="text-2xl font-bold text-gray-900">
                  Manage Customers
                </h3>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  {/* Add Customer Button */}
                  <button 
                    onClick={handleAddCustomer}
                    className="group bg-gradient-to-r from-[#0B5351] to-[#0A4B47] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#0A4B47] hover:to-[#083936] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl active:shadow-md active:translate-y-0.5 flex items-center justify-center space-x-2 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-300 relative z-10">
                      <span className="text-lg font-bold">+</span>
                    </div>
                    <span className="relative z-10">Add New Customer</span>
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
                      placeholder="Search customers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0B5351] focus:border-[#0B5351] hover:shadow-md transition-all duration-300"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-300"
                      >
                        <div className="w-5 h-5 bg-gray-200 hover:bg-red-100 rounded-full flex items-center justify-center">
                          ✕
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Customers Table Section */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-sm border border-gray-200">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#0B5351] to-[#0A4B47] sticky top-0">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                          <div className="flex items-center space-x-1">
                            <span>Name</span>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Join Date</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCustomers.map((customer: Customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{customer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{customer.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            customer.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{customer.joinDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleViewCustomer(customer.id)}
                            className="bg-teal-400 text-white px-4 py-2 rounded text-xs font-medium hover:bg-teal-500 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEditCustomer(customer)}
                            className="bg-teal-500 text-white px-4 py-2 rounded text-xs font-medium hover:bg-teal-600 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(customer.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded text-xs font-medium hover:bg-red-600 transition-colors"
                          >
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

          {/* Update empty state to consider filtered results */}
          {filteredCustomers.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchQuery ? "No matching customers found" : "No customers found"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Start by adding your first customer"}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleAddCustomer}
                  className="bg-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors"
                >
                  Add Customer
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showForm && <CustomerForm customer={editingCustomer} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />}

      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Confirm Delete</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this customer? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
