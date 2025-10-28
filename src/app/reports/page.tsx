'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReportForm, { ReportType, ReportConfig } from '@/components/ReportForm';
import ReportView from '@/components/ReportView';
import Navbar from '@/components/Navbar';
import { getCurrentUser, isAdmin } from '@/lib/mockAuth';

const ReportsPage = () => {
  const router = useRouter();
  const [showReport, setShowReport] = useState(false);
  const [reportConfig, setReportConfig] = useState<ReportConfig | null>(null);

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