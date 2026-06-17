import React from 'react';
import { School, MapPin, Phone, Search, X, Loader2, Eye, Plus } from 'lucide-react';
import { Card } from '../../../ui/card';
import { Button } from '../../../ui/button';

export default function SchoolsGrid({ 
  loading, schools, filteredSchools, visibleCount, searchTerm, 
  clearSearch, handleLoadMore, setShowAddModal, setSelectedSchool 
}) {

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[#1e3a8a]" /></div>;
  }

  if (schools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-gray-400">
         <School className="w-16 h-16 mx-auto mb-4 opacity-30 text-[#1e3a8a]" />
         <p className="font-bold text-xl text-gray-800">لا توجد مدارس مسجلة</p>
         <p className="text-sm font-bold text-gray-500 mt-2 mb-8">قم بتسجيل أول مدرسة في النظام الآن.</p>
         <Button onClick={() => setShowAddModal(true)} className="bg-[#1e3a8a] text-white hover:bg-blue-800 rounded-xl px-6 font-bold shadow-sm border-none outline-none cursor-pointer"><Plus className="w-4 h-4 mr-2" /> تسجيل مدرسة جديدة</Button>
      </div>
    );
  }

  if (filteredSchools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-red-50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-in fade-in duration-300">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Search className="w-10 h-10 text-red-400" />
          </div>
          <p className="font-black text-2xl text-gray-800 mb-2">عذراً، لا توجد نتائج!</p>
          <p className="text-sm font-bold text-gray-500 mb-8 max-w-md text-center leading-relaxed">
              لم نتمكن من العثور على أي مدرسة تطابق "{searchTerm}". يرجى التأكد والمحاولة مرة أخرى.
          </p>
          <button 
             onClick={clearSearch} 
             className="bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl px-8 h-12 font-bold flex items-center gap-2 transition-all outline-none cursor-pointer shadow-sm active:scale-95"
          >
             <X className="w-5 h-5 text-gray-400" /> مسح البحث وإعادة الضبط
          </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
        {filteredSchools.slice(0, visibleCount).map((school) => (
          <Card
            key={school.id}
            onClick={() => setSelectedSchool(school)}
            className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-blue-200 transition-all rounded-[2rem] p-6 group relative overflow-hidden flex flex-col h-full cursor-pointer outline-none active:scale-[0.98]"
          >
            <div className="absolute top-0 left-0 w-24 h-24 bg-blue-50 rounded-br-full -translate-x-12 -translate-y-12 opacity-50 pointer-events-none transition-transform group-hover:scale-110"></div>
            
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors shadow-sm">
                <School className="w-6 h-6 md:w-7 h-7" />
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-[10px] font-bold text-[#1e3a8a] bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100 flex items-center gap-1 transition-colors">
                  <Eye className="w-3 h-3" /> التفاصيل
                </span>
              </div>
            </div>
            
            <div className="relative z-10 flex-1">
              <h3 className="font-bold text-gray-800 text-lg mb-4 line-clamp-1" title={school.name}>{school.name}</h3>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <MapPin className="w-4 h-4 text-[#1e3a8a] shrink-0" />
                  <span className="line-clamp-1 font-bold text-xs md:text-sm">{school.governorate ? `${school.governorate} - ` : ''}{school.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <Phone className="w-4 h-4 text-[#1e3a8a] shrink-0" />
                  <span dir="ltr" className="font-mono font-bold text-xs md:text-sm">{school.contactNumber || 'غير متوفر'}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {visibleCount < filteredSchools.length && (
        <div className="flex justify-center mt-8 animate-in fade-in">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="px-8 py-3.5 bg-white border-2 border-blue-100 text-[#1e3a8a] rounded-2xl font-bold shadow-sm hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-center gap-2 outline-none active:scale-95"
          >
            عرض المزيد من المدارس
          </Button>
        </div>
      )}
    </>
  );
}