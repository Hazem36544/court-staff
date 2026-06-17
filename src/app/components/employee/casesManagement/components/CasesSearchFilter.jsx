import React from 'react';
import { Search, Briefcase, X } from 'lucide-react';

export function CasesSearchFilter({ casesCount, searchTerm, handleSearchChange, clearSearch }) {
  return (
    <div className="flex flex-col gap-5 md:gap-6 bg-white p-4 md:p-6 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
        
        {/* Counter / Stats */}
        <div className="flex items-center gap-4 w-full sm:w-auto shrink-0 border-b sm:border-b-0 sm:border-l border-gray-100 pb-4 sm:pb-0 sm:pl-6">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
            <Briefcase className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <p className="text-gray-500 text-[11px] font-black uppercase tracking-widest mb-0.5">إجمالي القضايا</p>
            <p className="text-2xl font-black text-gray-800 font-mono leading-none">{casesCount}</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="ابحث باستخدام رقم القضية..."
            className="w-full pr-12 pl-12 h-12 md:h-14 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-600 text-right font-bold text-sm md:text-base shadow-sm transition-all outline-none"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button onClick={clearSearch} className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 text-gray-500 rounded-full transition-colors border-none outline-none cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}