import React from 'react';
import { Calendar, MessageSquare, AlertTriangle } from 'lucide-react';

export function PerformanceAverages({ reportData, userRole, userData }) {
  if (!reportData) return null;
  const data = reportData;
  const role = userRole || userData.role;

  // إذا لم يكن هناك أي متوسطات لعرضها، لا نعرض القسم من الأساس
  if (!(data.averageResolutionTimeDays > 0 || data.averageComplaintResolutionTimeDays > 0 || data.averageAlertResolutionTimeDays > 0)) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 px-1 mt-4 mb-2">
          <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block"></span>
          مؤشرات الكفاءة
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* متوسط وقت إنجاز المهام العام */}
        {(data.averageResolutionTimeDays !== undefined && data.averageResolutionTimeDays > 0) && (
          <div className="bg-blue-50/80 border border-blue-100 p-6 rounded-[1.5rem] shadow-sm flex items-center gap-5">
             <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shrink-0 shadow-sm border border-blue-100/50">
                <Calendar className="w-7 h-7" />
             </div>
             <div>
                <p className="text-sm text-gray-600 font-bold mb-1">متوسط وقت إنجاز المهام الكلي</p>
                <p className="text-xl font-bold text-blue-900"><span className="text-3xl font-black font-mono text-blue-600 mr-1">{data.averageResolutionTimeDays.toFixed(1)}</span> أيام / مهمة</p>
             </div>
          </div>
        )}

        {/* متوسطات خاصة بمراقب الالتزام */}
        {role === 'ComplianceMonitor' && (
          <>
            {data.averageComplaintResolutionTimeDays > 0 && (
              <div className="bg-orange-50/80 border border-orange-100 p-6 rounded-[1.5rem] shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-600 shrink-0 shadow-sm border border-orange-100/50">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-bold mb-1">متوسط وقت حل الشكاوى</p>
                  <p className="text-xl font-bold text-orange-900"><span className="text-3xl font-black font-mono text-orange-600 mr-1">{data.averageComplaintResolutionTimeDays.toFixed(1)}</span> أيام / شكوى</p>
                </div>
              </div>
            )}
            
            {data.averageAlertResolutionTimeDays > 0 && (
              <div className="bg-red-50/80 border border-red-100 p-6 rounded-[1.5rem] shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-red-600 shrink-0 shadow-sm border border-red-100/50">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-bold mb-1">متوسط وقت معالجة المخالفات</p>
                  <p className="text-xl font-bold text-red-900"><span className="text-3xl font-black font-mono text-red-600 mr-1">{data.averageAlertResolutionTimeDays.toFixed(1)}</span> أيام / مخالفة</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}