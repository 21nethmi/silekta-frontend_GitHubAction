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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Navbar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Clean Header Section */}
          <div className="mb-6">
            <div className="text-left mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-[#0B5351] mb-2">
                Employee Management
              </h1>
              <p className="text-gray-600">Manage your team and workforce</p>
            </div>
          </div>

          {/* Employee Management Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl shadow-lg border-2 border-[#0B5351]/20 overflow-hidden mb-8 shadow-[#0B5351]/10">
            <div className="p-6 border-b">
              <div className="mb-4 p-3 border-b border-gray-300">
                <h3 className="text-2xl font-bold text-gray-900">
                  Manage Employees
                </h3>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowForm(true)}
                  className="group bg-gradient-to-r from-[#0B5351] to-[#0A4B47] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#0A4B47] hover:to-[#083936] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl active:shadow-md active:translate-y-0.5 flex items-center justify-center space-x-2 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Plus className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Add Employee</span>
                </button>
              </div>
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
    </div>
    </div>
  );
}