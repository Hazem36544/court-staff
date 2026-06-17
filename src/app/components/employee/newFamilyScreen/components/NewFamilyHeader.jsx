import React from 'react';
import { ChevronRight, UserPlus } from 'lucide-react';

export default function NewFamilyHeader({ isEditMode, onBack }) {
  return (
    <div className="relative w-full bg-[#1e3a8a] rounded-[2rem] p-6 md:p-8 text-white flex items-center justify-between overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

      <div className="flex items-center gap-4 md:gap-5 relative z-10 w-full md:w-auto text-right">
        <button onClick={onBack} className="bg-white/10 p-2.5 md:p-3 rounded-xl hover:bg-white/20 transition-all border-none outline-none group shrink-0 cursor-pointer">
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h1 className="text-xl md:text-3xl font-bold mb-1 tracking-tight">{isEditMode ? 'تعديل بيانات العائلة' : 'تسجيل عائلة جديدة'}</h1>
          <p className="text-blue-200 text-xs md:text-sm font-bold opacity-90">إدخال البيانات الرسمية للزوجين والأبناء</p>
        </div>
      </div>
      
      <div className="hidden md:flex w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-2xl md:rounded-3xl items-center justify-center border border-white/10 shadow-inner relative z-10">
        <UserPlus className="w-8 h-8 md:w-10 md:h-10 text-white" />
      </div>
    </div>
  );
}