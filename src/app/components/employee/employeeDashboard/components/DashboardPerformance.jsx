import React from 'react';
import { Clock } from 'lucide-react';

export default function DashboardPerformance({ reportData }) {
  if (!reportData?.averageResolutionTimeDays || reportData.averageResolutionTimeDays <= 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4 mt-2">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 px-1">
        <span className="w-1.5 h-6 bg-green-500 rounded-full inline-block"></span>
        ملخص الأداء
      </h2>
      <div className="p-6 md:p-8 bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-3xl flex items-center gap-4 hover:shadow-md hover:border-blue-100 transition-all duration-500 ease-out">
        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
           <Clock className="w-6 h-6" />
        </div>
        <div>
           <p className="text-sm text-gray-500 font-bold mb-1">متوسط وقت إنجاز المهام (Resolution Time)</p>
           <p className="text-lg font-bold text-gray-800"><span className="text-2xl text-green-600 font-black font-mono">{reportData.averageResolutionTimeDays.toFixed(1)}</span> أيام / مهمة</p>
        </div>
      </div>
    </div>
  );
}