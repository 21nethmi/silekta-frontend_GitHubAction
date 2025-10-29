"use client";

import { useState, useEffect, useRef } from "react";
import { sampleData, columnConfig, ReportDataItem } from "@/lib/reportData";
import ReportFilters from "./ReportFilters";
import { useReactToPrint } from "react-to-print";

export type ReportType = "inventory" | "orders" | "purchases" | "sales";

export interface ReportConfig {
  reportType: ReportType;
  startDate: string;
  endDate: string;
}

interface ReportViewProps {
  config: ReportConfig;
  onBack: () => void;
}

const ReportView = ({ config, onBack }: ReportViewProps) => {
  const [data, setData] = useState<ReportDataItem[]>([]);
  const [filteredData, setFilteredData] = useState<ReportDataItem[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const reportRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const reportData = sampleData[config.reportType];
    setData(reportData);
    setFilteredData(reportData);
  }, [config.reportType]);

  useEffect(() => {
    applyFilters();
  }, [filters, data]);

  const applyFilters = () => {
    const columns = columnConfig[config.reportType];
    const filtered = data.filter((row: any) => {
      return columns.every((column) => {
        const filterValue = filters[column.key];
        if (!filterValue) return true;

        const cellValue = row[column.key];

        if (column.type === "text") {
          return cellValue.toLowerCase().includes(filterValue.toLowerCase());
        } else if (column.type === "number") {
          return cellValue.toString().includes(filterValue);
        } else if (column.type === "select") {
          return cellValue === filterValue;
        } else if (column.type === "date") {
          return cellValue === filterValue;
        }

        return true;
      });
    });

    setFilteredData(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatValue = (value: any, columnKey: string) => {
    if (
      typeof value === "number" &&
      (columnKey.includes("Price") ||
        columnKey.includes("Amount") ||
        columnKey.includes("Cost") ||
        columnKey.includes("profit"))
    ) {
      return `$${value.toFixed(2)}`;
    }
    return value;
  };

  const handlePrint = useReactToPrint({
    content: () => {
      if (!reportRef.current) {
        console.warn("Report ref is null");
        return null;
      }
      return reportRef.current;
    },
    documentTitle: `${config.reportType}_report_${
      new Date().toISOString().split("T")[0]
    }`,
  } as any);

  const columns = columnConfig[config.reportType];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#0B5351] text-white px-8 py-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            {config.reportType.charAt(0).toUpperCase() +
              config.reportType.slice(1)}{" "}
            Report
          </h1>
          <p className="text-white/90 text-sm">
            Generated on {formatDate(new Date().toISOString().split("T")[0])}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Form
          </button>

          <div ref={reportRef}>
            {/* Report Info Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-[#0B5351]">
                  {config.reportType.charAt(0).toUpperCase() +
                    config.reportType.slice(1)}{" "}
                  Report
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {formatDate(config.startDate)} - {formatDate(config.endDate)}
                </p>
              </div>
              {mounted && (
                <button
                  onClick={handlePrint}
                  className="px-6 py-3 bg-[#8CBCB9] text-white rounded-lg font-semibold hover:bg-[#0B5351] transition-colors inline-flex items-center gap-2 print:hidden"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download PDF
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="print:hidden">
              <ReportFilters
                columns={columns}
                filters={filters}
                onFilterChange={setFilters}
              />
            </div>

            {/* Table */}
            <div className="rounded-lg shadow-md max-h-[500px] overflow-y-auto overflow-x-auto">
              <table className="w-full border-collapse bg-white">
                <thead className="bg-[#0B5351] text-white">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((row: any, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="px-4 py-3 text-sm text-gray-900"
                        >
                          {column.key === "status" ? (
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                row[column.key] === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : row[column.key] === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {row[column.key]}
                            </span>
                          ) : column.type === "date" ? (
                            formatDate(row[column.key])
                          ) : (
                            formatValue(row[column.key], column.key)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No data found matching the selected filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
