import React from 'react';
import { Briefcase, FileText, Calendar } from 'lucide-react';
import { Card } from '../../../ui/card';
import { Badge } from '../../../ui/badge';

export default function CasesSection({ cases }) {
  if (cases.length === 0) return null;

  return (
    <Card className="p-6 md:p-8 bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-[2rem] text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-xl flex items-center gap-2 text-gray-800">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
               <Briefcase className="w-5 h-5 text-indigo-600" />
            </div>
            سجل القضايا الخاصة بالعائلة
            <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-none mr-2 font-mono">{cases.length}</Badge>
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {cases.map((courtCase, idx) => (
          <div key={courtCase.id || idx} className="group p-5 bg-white border border-gray-200 rounded-[1.5rem] hover:border-blue-300 hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-[#1e3a8a] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span className="font-bold text-lg text-gray-900 font-mono tracking-wider truncate" dir="ltr">{courtCase.caseNumber || '---'}</span>
                  <Badge className={`text-[11px] font-bold px-3 py-1 border-none shadow-sm ${courtCase.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {courtCase.status === 'Open' ? 'مفتوحة' : (courtCase.status === 'Closed' ? 'مغلقة' : courtCase.status || 'غير معروفة')}
                  </Badge>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-gray-500 font-bold bg-gray-50 w-max px-2.5 py-1 rounded-lg border border-gray-100 truncate">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  تاريخ التسجيل: {new Date(courtCase.filedAt).toLocaleDateString('ar-EG')}
                </span>
              </div>
            </div>
            <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100 group-hover:bg-white group-hover:border-blue-100 transition-colors mb-4">
              <p className="text-[10px] font-bold text-gray-400 mb-1">ملخص القرار</p>
              <p className="text-sm font-bold text-gray-700 line-clamp-2">
                {courtCase.decisionSummary || "لم يتم تسجيل ملخص قرار لهذه القضية."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}