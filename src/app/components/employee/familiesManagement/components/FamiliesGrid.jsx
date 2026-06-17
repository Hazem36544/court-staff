import React from 'react';
import { User, Baby, ChevronDown } from 'lucide-react';
import { Card } from '../../../ui/card';
import { Button } from '../../../ui/button';

export default function FamiliesGrid({ filteredFamilies, visibleCount, onNavigate, handleLoadMore }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFamilies.slice(0, visibleCount).map((family) => (
          <Card
            key={family.id}
            onClick={() => onNavigate('family-details', { familyId: family.id })}
            className="group bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-blue-200 transition-all duration-500 ease-out hover:-translate-y-1.5 rounded-[2rem] p-6 cursor-pointer relative overflow-hidden outline-none"
          >
            {/* Decorative corner */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-blue-50 rounded-br-full -translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform duration-500 ease-out opacity-50 pointer-events-none"></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                 <span className="text-[10px] font-bold text-gray-500 tracking-widest font-mono">ID: {family.displayId}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 relative z-10 mb-6">
               <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-50">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors duration-300">
                     <User className="w-5 h-5 text-blue-600 group-hover:text-white" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-gray-500">اسم الأب</span>
                     <span className="text-sm font-bold text-gray-800">{family.fatherName}</span>
                  </div>
               </div>

               <div className="flex items-center gap-3 bg-pink-50/50 p-3 rounded-xl border border-pink-50">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center shrink-0 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300">
                     <User className="w-5 h-5 text-pink-600 group-hover:text-white" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-gray-500">اسم الأم</span>
                     <span className="text-sm font-bold text-gray-800">{family.motherName}</span>
                  </div>
               </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                   <Baby className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-gray-500">عدد الأبناء</span>
                   <span className="text-sm font-black text-gray-800 font-mono">{family.children}</span>
                </div>
              </div>
              <Button variant="ghost" className="text-[#1e3a8a] bg-blue-50 hover:bg-blue-100 font-bold rounded-xl text-xs px-4 h-9 outline-none border-none group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors cursor-pointer">
                عرض الملف
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {visibleCount < filteredFamilies.length && (
        <div className="flex justify-center mt-8 animate-in fade-in">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="px-8 py-3.5 bg-white border-2 border-blue-100 text-[#1e3a8a] rounded-2xl font-bold shadow-sm hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-center gap-2 outline-none active:scale-95"
          >
            <ChevronDown className="w-5 h-5" /> عرض المزيد من العائلات
          </Button>
        </div>
      )}
    </>
  );
}