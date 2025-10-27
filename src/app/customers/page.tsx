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
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Header Section */}
          <div className="mb-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
              <p className="text-gray-600 mt-1">Manage your customer database</p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAddCustomer}
                className="bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-all duration-200 shadow-md flex items-center space-x-2"
              >
                <span>+</span>
                <span>Add New Customer</span>
              </button>
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customers.map((customer: Customer) => (
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

          {customers.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No customers found</h3>
              <p className="text-gray-500 mb-6">Start by adding your first customer</p>
              <button
                onClick={handleAddCustomer}
                className="bg-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors"
              >
                Add Customer
              </button>
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
  )
}

export default CustomersPage
