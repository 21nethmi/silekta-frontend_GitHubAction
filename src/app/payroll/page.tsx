'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAdmin } from '@/lib/mockAuth';

interface Employee {
  id: string;
  name: string;
  basicSalary: number;
  otHours: number;
  total: number;
}

const PayrollPage = () => {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 'EMP001', name: 'John Doe', basicSalary: 60000, otHours: 10, total: 65000 },
    { id: 'EMP002', name: 'Jane Smith', basicSalary: 55000, otHours: 5, total: 57500 },
    { id: 'EMP003', name: 'Alex Perera', basicSalary: 50000, otHours: 8, total: 54000 },
  ]);

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

  const handleViewPaysheet = (employee: Employee) => {
    router.push(`/paysheet/${employee.id}`);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Navbar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Payroll Calculation</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Employee Payroll</h2>
            <p className="text-gray-600">View employee salary details and generate paysheets</p>
          </div>

          {/* Payroll Table */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-white border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Payroll List</h3>
              <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-300">
                ▼ Printing
              </button>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Basic Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">O.T Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{emp.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{emp.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Rs {emp.basicSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{emp.otHours}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-semibold">Rs {emp.total.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewPaysheet(emp)}
                        className="bg-[#0B5351] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#0B5351]/90 transition"
                      >
                        View Paysheet
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollPage;
