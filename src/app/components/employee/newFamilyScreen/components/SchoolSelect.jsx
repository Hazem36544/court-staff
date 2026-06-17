import React, { useState, useEffect, useRef } from 'react';
import { School, ChevronDown, CheckCircle, Search, X, Plus } from 'lucide-react'; // ✅ إضافة Plus

export default function SchoolSelect({ schoolsList, value, onChange, schoolSearchTerm, setSchoolSearchTerm, onAddNewSchool }) { // ✅ إضافة onAddNewSchool
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  const filteredSchools = schoolsList.filter(school => school.name.toLowerCase().includes(schoolSearchTerm.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
        if (!value) {
          setSchoolSearchTerm('');
        } else {
          const selected = schoolsList.find(s => s.id === value);
          if (selected) setSchoolSearchTerm(selected.name);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value, schoolsList, setSchoolSearchTerm]);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const el = document.getElementById(`school-item-${highlightedIndex}`);
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') { e.preventDefault(); setIsOpen(true); }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightedIndex(prev => prev < filteredSchools.length - 1 ? prev + 1 : prev); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredSchools.length) {
        onChange(filteredSchools[highlightedIndex]);
        setSchoolSearchTerm(filteredSchools[highlightedIndex].name); // ✅ تحديث فوري
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') { setIsOpen(false); setHighlightedIndex(-1); }
  };

  return (
    <div className="flex flex-col gap-1.5 relative w-full" ref={containerRef}>
      <label className="text-sm font-bold text-gray-700">المدرسة (اختياري)</label>
      <div className="relative w-full h-[52px]">
        <School className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors pointer-events-none ${isOpen ? 'text-[#1e3a8a]' : 'text-gray-400'}`} />
        <input
          type="text"
          value={schoolSearchTerm}
          onChange={(e) => { setSchoolSearchTerm(e.target.value); setIsOpen(true); setHighlightedIndex(-1); if (value) onChange({id: '', name: ''}); }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="ابحث أو اختر المدرسة لربط التقارير..."
          className={`w-full h-full px-4 pr-12 rounded-xl outline-none transition-all font-bold text-sm border shadow-sm ${isOpen ? 'border-[#1e3a8a] ring-2 ring-[#1e3a8a]/20 bg-white' : 'bg-white border-gray-200 hover:border-gray-300 focus:bg-white focus:ring-2 focus:ring-[#1e3a8a]'}`}
        />
        {isOpen && schoolSearchTerm && (
          <button type="button" onClick={() => { setIsOpen(false); setSchoolSearchTerm(''); onChange({id: '', name: ''}); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-full transition-colors outline-none border-none cursor-pointer"><X className="w-4 h-4 text-gray-500" /></button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 w-full bg-white border border-gray-100 rounded-xl shadow-2xl z-[100] overflow-hidden transition-opacity duration-300 opacity-100">
          <ul ref={listRef} className="max-h-60 overflow-y-auto custom-scrollbar py-2">
            {filteredSchools.length > 0 ? (
              filteredSchools.map((school, index) => (
                <li
                  key={school.id} id={`school-item-${index}`}
                  onClick={() => { 
                      onChange(school); 
                      setSchoolSearchTerm(school.name); // ✅ تحديث الكلمة فوراً لحل مشكلة الضغطتين
                      setIsOpen(false); 
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors flex justify-between items-center ${value === school.id ? 'bg-blue-50 text-[#1e3a8a]' : ''} ${highlightedIndex === index && value !== school.id ? 'bg-gray-50 text-[#1e3a8a]' : 'text-gray-600'}`}
                >
                  {school.name}
                  {value === school.id && <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />}
                </li>
              ))
            ) : (
              <li className="px-4 py-6 text-sm text-gray-500 font-bold text-center flex flex-col items-center gap-4">
                 <div className="flex flex-col items-center gap-2">
                     <Search className="w-6 h-6 opacity-30" /> 
                     <span>لا توجد مدرسة مطابقة للبحث</span>
                 </div>
                 {/* ✅ الزر الذكي لفتح نافذة إضافة مدرسة */}
                 {onAddNewSchool && (
                    <button 
                      type="button" 
                      onClick={() => { setIsOpen(false); onAddNewSchool(); }} 
                      className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border border-green-200 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors outline-none border-none cursor-pointer w-full shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> المدرسة غير مسجلة؟ أضفها الآن
                    </button>
                 )}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}