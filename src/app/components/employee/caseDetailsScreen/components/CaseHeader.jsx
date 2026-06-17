import React from 'react';
import { ChevronRight, Paperclip, Shield } from 'lucide-react';
import { Badge } from '../../../ui/badge';

export default function CaseHeader({ caseInfo, onBack, handleDownloadDocument, setShowCloseCaseModal }) {
  return (
    <div className="relative w-full bg-[#1e3a8a] rounded-[2rem] p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-xl gap-6">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

      <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
        <button onClick={onBack} className="bg-white/10 p-2.5 md:p-3 rounded-xl hover:bg-white/20 transition-all border-none outline-none group shrink-0">
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="text-right">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">رقم القضية: <span className="font-mono tracking-widest">{caseInfo?.caseNumber || ''}</span></h1>
            <Badge className={`border-none text-xs px-4 py-1.5 rounded-full font-bold shadow-sm ${caseInfo?.status === 'Open' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
              {caseInfo?.status === 'Open' ? 'نشطة' : (caseInfo?.status === 'Closed' ? 'مغلقة' : 'نشطة')}
            </Badge>
          </div>
          <p className="text-blue-200 text-sm opacity-90 font-bold mt-2">
            تاريخ التقديم: <span className="font-mono">{caseInfo?.filedAt ? new Date(caseInfo.filedAt).toLocaleDateString('ar-EG') : ''}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 w-full md:w-auto">
        {caseInfo?.documentId && (
          <button onClick={() => handleDownloadDocument(caseInfo.documentId)} className="w-full sm:w-auto bg-white/10 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors flex items-center justify-center gap-2 border border-white/20 shadow-sm outline-none">
            <Paperclip className="w-4 h-4" /> عرض المستند
          </button>
        )}
        {caseInfo?.status !== 'Closed' && (
          <button onClick={() => setShowCloseCaseModal(true)} className="w-full sm:w-auto bg-red-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors shadow-sm border-none flex items-center justify-center gap-2 outline-none">
            <Shield className="w-4 h-4" /> إغلاق القضية
          </button>
        )}
      </div>
    </div>
  );
}