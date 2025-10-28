'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { getCurrentUser, isAdmin } from '@/lib/mockAuth';
import { Plus } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  status: 'Active' | 'Inactive';
}

export default function EmployeePage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: 'John Doe', status: 'Active' },
  ]);
  const [newEmployee, setNewEmployee] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [showForm, setShowForm] = useState(false);

  // Protect route - only admins can access
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
    } else if (!isAdmin()) {
      router.push('/home');
    }
  }, [router]);

  // Don't render if not admin
  if (!isAdmin()) {
    return null;
  }

  const addEmployee = () => {
    if (!newEmployee.trim()) return;

    const newEntry: Employee = {
      id: employees.length + 1,
      name: newEmployee,
      status,
    };

    setEmployees([...employees, newEntry]);
    setNewEmployee('');
    setShowForm(false);
  };

  const handleViewPaysheet = (employee: Employee) => {
    router.push(`/paysheet/${employee.id}`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Employee</h1>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#0B5351] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0B5351]/90 transition"
          >
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        </div>

        {/* Employee List */}
        <div className="p-6">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 border-t">
                  <td className="px-6 py-3 text-sm text-gray-700">{emp.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        emp.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => handleViewPaysheet(emp)}
                      className="bg-[#0B5351] text-white px-3 py-1 rounded-md text-sm hover:bg-[#0B5351]/90 mr-2"
                    >
                      Paysheet
                    </button>
                    <button className="bg-[#0B5351] text-white px-3 py-1 rounded-md text-sm hover:bg-[#0B5351]/90">
                      Actions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Employee Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Employee</h2>

              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">Employee Name</label>
                <input
                  type="text"
                  value={newEmployee}
                  onChange={(e) => setNewEmployee(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B5351]"
                  placeholder="Enter employee name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B5351]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={addEmployee}
                  className="px-4 py-2 rounded-md bg-[#0B5351] text-white hover:bg-[#0B5351]/90"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
