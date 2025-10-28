'use client';

import { useState } from 'react';
import ReportForm, { ReportType, ReportConfig } from '@/components/ReportForm';
import ReportView from '@/components/ReportView';
import Navbar from '@/components/Navbar';

const ReportsPage = () => {
  const [showReport, setShowReport] = useState(false);
  const [reportConfig, setReportConfig] = useState<ReportConfig | null>(null);

  const handleGenerateReport = (config: ReportConfig) => {
    setReportConfig(config);
    setShowReport(true);
  };

  const handleBackToForm = () => {
    setShowReport(false);
    setReportConfig(null);
  };

  return (
    <div className="flex h-screen bg-gray-0 overflow-hidden">
      <Navbar />
     <div className="flex-1 flex flex-col overflow-auto">
    {/* Header bar - matching your other pages */}
   
    
    <div className="min-h-screen bg-white p-5">
      {!showReport ? (
        <ReportForm onGenerate={handleGenerateReport} />
      ) : (
        <ReportView config={reportConfig!} onBack={handleBackToForm} />
      )}
    </div>
    </div>
    </div>
  );
};

export default ReportsPage;