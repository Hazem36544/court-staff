import React from 'react';
import { Loader2, FolderOpen, Search, X, CheckCircle, Calendar, FileText, Briefcase, ChevronDown } from 'lucide-react';
import { Card } from '../../../ui/card';
import { Button } from '../../../ui/button';

export function CasesGrid({ loading, casesLength, filteredCases, visibleCount, searchTerm, clearSearch, handleLoadMore, onNavigate }) {
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-[2rem]">
        <Loader2 className="w-10 h-10 animate-spin text-[#1e3a8a] mb-4" />
        <span className="text-[#1e3a8a] font-bold">جاري جلب القضايا...</span>
      </div>
    );
  }

  if (casesLength === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-gray-400">
        <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-30 text-orange-500" />
        <p className="font-bold text-lg text-gray-600">لا توجد قضايا مسجلة</p>
        <p className="text-sm font-bold text-gray-400 mt-2 text-center">
          ليس لديك أي قضايا موكلة إليك حالياً.
        </p>
      </div>
    );
  }

  if (filteredCases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-red-50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
          <Search className="w-10 h-10 text-red-400" />
        </div>
        <p className="font-black text-2xl text-gray-800 mb-2">عذراً، لا توجد نتائج!</p>
        <p className="text-sm font-bold text-gray-500 mb-8 max-w-md text-center leading-relaxed">
          لم نتمكن من العثور على أي قضية تطابق "{searchTerm}". يرجى التأكد والمحاولة مرة أخرى.
        </p>
        <button onClick={clearSearch} className="bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl px-8 h-12 font-bold flex items-center gap-2 transition-all outline-none cursor-pointer shadow-sm active:scale-95">
          <X className="w-5 h-5 text-gray-400" /> مسح البحث وإعادة الضبط
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.slice(0, visibleCount).map((courtCase) => (
          <Card
            key={courtCase.id}
            onClick={() => onNavigate('case-details', { caseId: courtCase.id, familyId: courtCase.familyId })}
            className="group bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-blue-100 transition-all duration-300 rounded-[2rem] p-6 cursor-pointer relative overflow-hidden flex flex-col h-full"
          >
            {/* Decorative corner */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-blue-50 rounded-br-full -translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform opacity-50 pointer-events-none"></div>

            {/* Top: ID & Status */}
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                 <span className="text-[10px] font-bold text-gray-500 tracking-widest font-mono">رقم القضية:</span>
                 <span className="text-xs font-black text-[#1e3a8a] tracking-widest font-mono">{courtCase.caseNumber}</span>
              </div>
              <div className={`px-2.5 py-1 rounded-lg border ${courtCase.status === 'Open' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                 <span className="text-[10px] font-bold flex items-center gap-1">
                   <CheckCircle className="w-3 h-3" />
                   {courtCase.status === 'Open' ? 'نشطة' : 'مغلقة'}
                 </span>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-4 relative z-10 mb-6 flex-1">
               <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-50 group-hover:bg-white transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                     <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-gray-500">تاريخ التقديم</span>
                     <span className="text-sm font-bold text-gray-800">{courtCase.filedAt}</span>
                  </div>
               </div>

               <div className="flex items-start gap-3 bg-indigo-50/30 p-3 rounded-xl border border-indigo-50/50 flex-1 group-hover:bg-white transition-colors">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                     <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex flex-col flex-1">
                     <span className="text-[10px] font-bold text-gray-500 mb-1">ملخص القرار المبدئي</span>
                     <span className="text-xs font-bold text-gray-700 line-clamp-2 leading-relaxed">{courtCase.decisionSummary}</span>
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 relative z-10 mt-auto">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                   <Briefcase className="w-4 h-4 text-[#1e3a8a]" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-gray-500">النوع</span>
                   <span className="text-xs font-black text-gray-800">قضية طلاق</span>
                </div>
              </div>
              <Button variant="ghost" className="text-[#1e3a8a] bg-blue-50 hover:bg-[#1e3a8a] font-bold rounded-xl text-xs px-4 h-9 outline-none border-none group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors cursor-pointer">
                إدارة الملف
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {visibleCount < filteredCases.length && (
        <div className="flex justify-center mt-8 animate-in fade-in">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="px-8 py-3.5 bg-white border-2 border-blue-100 text-[#1e3a8a] rounded-2xl font-bold shadow-sm hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-center gap-2 outline-none active:scale-95"
          >
            <ChevronDown className="w-5 h-5" /> عرض المزيد من القضايا
          </Button>
        </div>
      )}
    </>
  );
}