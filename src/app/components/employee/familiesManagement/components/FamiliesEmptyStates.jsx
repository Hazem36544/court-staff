import React from 'react';
import { FolderOpen, Search, X } from 'lucide-react';

export default function FamiliesEmptyStates({ type, searchTerm, clearSearch }) {
  if (type === 'no-data') {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-gray-400">
         <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-30 text-[#1e3a8a]" />
         <p className="font-bold text-lg text-gray-600">لا توجد عائلات مسجلة</p>
         <p className="text-sm font-bold text-gray-400 mt-2">قم بإضافة عائلة جديدة للبدء في إدارة ملفاتهم.</p>
      </div>
    );
  }

  if (type === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-red-50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-in fade-in duration-300">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Search className="w-10 h-10 text-red-400" />
          </div>
          <p className="font-black text-2xl text-gray-800 mb-2">عذراً، لا توجد نتائج!</p>
          <p className="text-sm font-bold text-gray-500 mb-8 max-w-md text-center leading-relaxed">
              لم نتمكن من العثور على أي عائلة تطابق الرقم القومي "{searchTerm}". يرجى التأكد والمحاولة مرة أخرى.
          </p>
          <button onClick={clearSearch} className="bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl px-8 h-12 font-bold flex items-center gap-2 transition-all outline-none cursor-pointer shadow-sm active:scale-95">
             <X className="w-5 h-5 text-gray-400" /> مسح البحث وإعادة الضبط
          </button>
      </div>
    );
  }

  return null;
}