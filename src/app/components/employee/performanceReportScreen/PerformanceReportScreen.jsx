import React from 'react';
import { Loader2 } from 'lucide-react';

// استيراد المكونات الفرعية
import { PerformanceHeader } from './components/PerformanceHeader';
import { PerformanceCards } from './components/PerformanceCards';
import { PerformanceAverages } from './components/PerformanceAverages';

// استيراد اللوجيك (Custom Hook)
import { usePerformanceReport } from './components/usePerformanceReport';

export function PerformanceReportScreen({ onBack, userRole }) {
  const { state, helpers } = usePerformanceReport(userRole);

  if (state.loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[80vh] font-sans" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-[#1e3a8a] mb-4" />
        <span className="text-[#1e3a8a] font-bold text-lg">جاري استخراج تقرير الأداء...</span>
      </div>
    );
  }

  return (
    <div className="w-full font-sans" dir="rtl">
      <div className={`transition-all duration-500 ease-out transform ${state.isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-6 md:gap-8 pb-10 px-4 md:px-0">

          <PerformanceHeader 
            onBack={onBack} 
            userData={state.userData} 
            userRole={userRole} 
            getRoleTitle={helpers.getRoleTitle} 
          />

          <PerformanceCards 
            reportData={state.reportData} 
            userRole={userRole} 
            userData={state.userData} 
          />

          <PerformanceAverages 
            reportData={state.reportData} 
            userRole={userRole} 
            userData={state.userData} 
          />

        </div>
      </div>
    </div>
  );
}