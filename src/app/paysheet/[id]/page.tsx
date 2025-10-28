'use client';

import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';

const PaysheetPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const employee = {
    id,
    name: 'John Doe',
    phone: '123456789',
    email: 'one@gmail.com',
    basicSalary: 60000,
    otHours: 10,
    otRate: 500,
    total: 65000,
    date: '14 Oct 2025',
    paysheetNo: 'INV-298122'
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Navbar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-800">Employee Paysheet</h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <button
            onClick={() => router.back()}
            className="bg-[#0B5351] text-white px-4 py-2 rounded-md mb-6 hover:bg-[#0B5351]/90"
          >
            ← Back
          </button>

          <div className="bg-[#E9F8F8] p-10 rounded-lg shadow-md border mx-auto max-w-3xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Silekta Holding</h2>
              <p className="text-gray-900 text-sm">#555, 1st Street, Colombo, Sri Lanka</p>
            </div>

            <div className="flex justify-between text-sm mb-6">
              <div>
                <p className="font-semibold text-gray-800">{employee.name}</p>
                <p className="text-gray-900">Phone No: {employee.phone}</p>
                <p className="text-gray-900">Email: {employee.email}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-900">Date: {employee.date}</p>
                <p className="text-gray-900">Pay Sheet No: {employee.paysheetNo}</p>
              </div>
            </div>

            <table className="w-full text-sm border border-gray-200 mb-8">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">Description</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-600">Amount (Rs)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-t border-gray-200 text-gray-600">Basic Salary</td>
                  <td className="px-4 py-2 border-t border-gray-200 text-right text-gray-600">{employee.basicSalary.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-t border-gray-200 text-gray-600">O.T ({employee.otHours} hrs × Rs {employee.otRate})</td>
                  <td className="px-4 py-2 border-t border-gray-200 text-right text-gray-600">{(employee.otHours * employee.otRate).toLocaleString()}</td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-semibold border-t border-gray-200 text-gray-600">Total</td>
                  <td className="px-4 py-2 text-right font-semibold border-t border-gray-200 text-gray-600">{employee.total.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div className="text-right text-sm text-gray-900">
              <p>Authorized Signature: ______________________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaysheetPage;
