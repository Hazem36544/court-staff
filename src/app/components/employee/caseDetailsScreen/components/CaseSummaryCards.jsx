import React from 'react';
import { FileText, Clock } from 'lucide-react';
import { Card } from '../../../ui/card';

export default function CaseSummaryCards({ caseInfo }) {
  return (
    <>
      <Card className="p-6 md:p-8 bg-[#1e3a8a]/5 border-blue-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-[2rem] relative overflow-hidden flex flex-col gap-4 text-right">
        <div className="absolute top-0 right-0 w-1.5 h-full bg-[#1e3a8a]"></div>
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm uppercase tracking-widest text-[#1e3a8a] flex items-center gap-2">
            <FileText className="w-5 h-5" /> قرار المحكمة
          </h3>
        </div>
        <p className="text-sm md:text-base text-gray-800 leading-relaxed font-bold whitespace-pre-wrap px-2">
          {caseInfo?.decisionSummary || 'لم يتم تسجيل ملخص قرار رسمي لهذه القضية بعد.'}
        </p>
      </Card>

      {caseInfo?.status === 'Closed' && (
        <Card className="p-5 md:p-6 bg-red-50/50 border-red-100 shadow-sm rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-start gap-4 text-right">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-red-500"></div>
          <div className="min-w-[200px] shrink-0">
            <h3 className="font-black text-sm uppercase tracking-widest text-red-600 mb-1">ملاحظات الإغلاق</h3>
            {caseInfo?.closedAt && (
              <p className="text-xs text-red-500 font-bold flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" /> {new Date(caseInfo.closedAt).toLocaleDateString('ar-EG')}
              </p>
            )}
          </div>
          <p className="text-sm md:text-base text-gray-800 leading-relaxed font-bold flex-1 whitespace-pre-wrap px-2">
            {caseInfo?.closureNotes || 'تم إغلاق القضية دون تسجيل ملاحظات إغلاق محددة.'}
          </p>
        </Card>
      )}
    </>
  );
}