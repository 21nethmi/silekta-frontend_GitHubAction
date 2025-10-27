"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  status: "Active" | "Inactive"
  joinDate: string
}

interface CustomerContextType {
  customers: Customer[]
  addCustomer: (customer: Omit<Customer, "id">) => Customer
  updateCustomer: (id: string, customer: Omit<Customer, "id">) => void
  deleteCustomer: (id: string) => void
  getCustomer: (id: string) => Customer | undefined
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "C001",
      name: "Keells",
      email: "keellscustomercare.jms@keells.com",
      phone: "+94 11 234 5678",
      status: "Active",
      joinDate: "2023-01-15",
    },
    {
      id: "C002",
      name: "Arpico",
      email: "arpicosuper@gmail.com.com",
      phone: "+94 11 234 5679",
      status: "Active",
      joinDate: "2024-05-26",
    },
    {
      id: "C003",
      name: "Daraz",
      email: "cs@daraz.lk",
      phone: "+94 11 757 5600",
      status: "Inactive",
      joinDate: "2024-09-13",
    },
    {
      id: "C004",
      name: "Cargills",
      email: "cargillsonline@gmail.com",
      phone: "+94 11 233 8704",
      status: "Active",
      joinDate: "2023-12-12",
    },
    {
      id: "C005",
      name: "Wijesiri",
      email: "sdwijesiri@gmail.com",
      phone: "+94 77 234 5682",
      status: "Active",
      joinDate: "2020-03-11",
    },
    {
      id: "C006",
      name: "Thusara",
      email: "thusarafdo@gmail.com",
      phone: "+94 75 225 9621",
      status: "Active",
      joinDate: "2019-11-08",
    },
  ])

  const addCustomer = (customerData: Omit<Customer, "id">) => {
    const newCustomer: Customer = {
      id: `C${String(customers.length + 1).padStart(3, "0")}`,
      ...customerData,
    }
    setCustomers([...customers, newCustomer])
    return newCustomer
  }

  const updateCustomer = (id: string, customerData: Omit<Customer, "id">) => {
    setCustomers(customers.map((c) => (c.id === id ? { ...c, ...customerData } : c)))
  }

  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter((c) => c.id !== id))
  }

  const getCustomer = (id: string) => {
    return customers.find((c) => c.id === id)
  }

  return (
    <CustomerContext.Provider value={{ customers, addCustomer, updateCustomer, deleteCustomer, getCustomer }}>
      {children}
    </CustomerContext.Provider>
  )
}

export const useCustomers = () => {
  const context = useContext(CustomerContext)
  if (!context) {
    throw new Error("useCustomers must be used within a CustomerProvider")
  }
  return context
}
