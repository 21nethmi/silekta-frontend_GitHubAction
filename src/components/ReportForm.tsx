'use client';

import { useState, useEffect } from 'react';

export type ReportType = 'inventory' | 'orders' | 'purchases' | 'sales';

export interface ReportConfig {
  reportType: ReportType;
  startDate: string;
  endDate: string;
}

interface ReportFormProps {
  onGenerate: (config: ReportConfig) => void;
}

const ReportForm = ({ onGenerate }: ReportFormProps) => {
  const [reportType, setReportType] = useState<ReportType | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateRangeEnabled, setDateRangeEnabled] = useState(true);

  // Set default dates (last 30 days)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
  }, []); 

  const handleClear = () => {
    setReportType('');
    setStartDate('');
    setEndDate('');
  };

  const handleGenerate = () => {
    if (!reportType) {
      alert('Please select a report type');
      return;
    }

    if (!startDate || !endDate) {
      alert('Please select start and end dates');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date must be before end date');
      return;
    }

    onGenerate({
      reportType: reportType as ReportType,
      startDate,
      endDate,
    });
  };

  return (
    
    <div className="flex items-center justify-center min-h-screen p-5">
      <div className="bg-white rounded-xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header */}
        <div className="bg-[#0B5351] text-white px-8 py-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Generate Report</h1>
          <p className="text-white/90 text-sm">
            Select report type and date range to generate your custom report
          </p>
        </div>

        {/* Form Content */}
        <div className="p-10">
          {/* Report Type */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType | '')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#0B5351] focus:ring-4 focus:ring-[#0B5351]/10 transition-all"
            >
              <option value="">Select</option>
              <option value="inventory">Inventory</option>
              <option value="orders">Orders</option>
              <option value="purchases">Purchases</option>
              <option value="sales">Sales</option>
            </select>
          </div>

          {/* Date Range Toggle */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">
              Report by Date Range
            </label>
            <button
              onClick={() => setDateRangeEnabled(!dateRangeEnabled)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                dateRangeEnabled ? 'bg-[#0B5351]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                  dateRangeEnabled ? 'transform translate-x-7' : ''
                }`}
              />
            </button>
          </div>

          {/* Date Range */}
          {dateRangeEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#0B5351] focus:ring-4 focus:ring-[#0B5351]/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-[#0B5351] focus:ring-4 focus:ring-[#0B5351]/10 transition-all"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleClear}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleGenerate}
              className="flex-1 px-6 py-3 bg-[#0B5351] text-white rounded-lg font-semibold hover:bg-[#0B5351]/90 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;