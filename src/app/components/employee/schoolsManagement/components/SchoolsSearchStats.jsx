import React from 'react';
import { Search, Building, Plus, X } from 'lucide-react';
import { Button } from '../../../ui/button';

export default function SchoolsSearchStats({ totalCount, searchTerm, setSearchTerm, clearSearch, setShowAddModal }) {
  return (
    <div className="flex flex-col gap-5 md:gap-6 bg-white p-4 md:p-6 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
      <div className="flex items-center justify-between pb-4 border-b border-gray-50">
         <div className="flex items-center gap-4">
           <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0 hover:bg-[#1e3a8a] hover:text-white transition-colors duration-300">
             <Building className="w-6 h-6 md:w-7 md:h-7" />
           </div>
           <div>
             <p className="text-gray-500 text-xs font-bold mb-0.5 uppercase tracking-widest">إجمالي المدارس</p>
             <p className="text-2xl md:text-3xl font-black text-gray-800 font-mono">{totalCount}</p>
           </div>
         </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="البحث عن المدارس بالاسم..."
            className="w-full pr-12 pl-12 h-12 md:h-14 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-600 text-right font-bold text-sm md:text-base shadow-sm transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full transition-colors border-none outline-none cursor-pointer"
              title="مسح البحث"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white hover:bg-green-700 shadow-sm h-12 md:h-14 px-8 rounded-xl gap-2 font-bold transition-all border-none outline-none w-full sm:w-auto shrink-0 cursor-pointer active:scale-95"
        >
          <Plus className="w-5 h-5 shrink-0" /> <span className="whitespace-nowrap">تسجيل مدرسة جديدة</span>
        </Button>
      </div>
    </div>
  );
}