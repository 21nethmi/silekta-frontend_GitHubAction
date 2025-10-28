'use client';

import { ColumnDefinition } from '@/lib/reportData';

interface ReportFiltersProps {
  columns: ColumnDefinition[];
  filters: Record<string, string>;
  onFilterChange: (filters: Record<string, string>) => void;
}

const ReportFilters = ({ columns, filters, onFilterChange }: ReportFiltersProps) => {
  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-bold text-[#0B5351] mb-4">Filter Data</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div key={column.key} className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">
              {column.label}
            </label>
            {column.type === 'select' ? (
              <select
                value={filters[column.key] || ''}
                onChange={(e) => handleFilterChange(column.key, e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#0B5351] focus:ring-2 focus:ring-[#0B5351]/20"
              >
                <option value="">All</option>
                {column.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={column.type}
                value={filters[column.key] || ''}
                onChange={(e) => handleFilterChange(column.key, e.target.value)}
                placeholder={`Filter by ${column.label}`}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#0B5351] focus:ring-2 focus:ring-[#0B5351]/20"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportFilters;