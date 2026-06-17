import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { monthNames, daysOfWeek } from './NewFamilyHelpers';

export default function CustomDatePicker({ value, onChange, label, required, error, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrevMonth = (e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)); };
  const handleNextMonth = (e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)); };

  const selectDate = (day) => {
    const year = viewDate.getFullYear();
    const month = String(viewDate.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    onChange(`${year}-${month}-${formattedDay}`);
    setIsOpen(false);
  };

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div className="relative flex flex-col gap-1.5 w-full" ref={containerRef}>
      {label && <label className="text-sm font-bold text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>}
      
      {/* الحاوية الخاصة بالحقل والتي سيظهر التقويم فوقها مباشرة */}
      <div className="relative flex items-center">
        <input 
          type="date" 
          disabled={disabled}
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          onKeyDown={(e) => { if (e.key === ' ' || e.code === 'Space') e.preventDefault(); }}
          className={`w-full p-4 pr-12 rounded-xl outline-none transition-all font-sans font-bold text-sm shadow-sm [&::-webkit-calendar-picker-indicator]:hidden [&::-moz-clear]:hidden
            ${disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-200' : 'bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white'}
            ${error ? 'border-red-300 focus:ring-red-400 bg-red-50' : ''}
          `}
        />
        <button 
          type="button"
          disabled={disabled}
          onClick={(e) => { 
            e.preventDefault(); 
            if (!disabled) {
              setIsOpen(!isOpen);
              setViewDate(value ? new Date(value) : new Date());
            }
          }}
          className="absolute right-4 text-gray-400 hover:text-[#1e3a8a] transition-colors outline-none border-none bg-transparent cursor-pointer disabled:cursor-not-allowed"
        >
          <Calendar className="w-5 h-5" />
        </button>

        {/* ✅ تم نقل التقويم إلى هنا ليكون مرتبطاً بالحقل فقط وليس بالعنوان */}
        {isOpen && (
          <div className="absolute bottom-[calc(100%+10px)] left-1/2 transform -translate-x-1/2 w-[280px] bg-white border border-gray-200 rounded-2xl shadow-2xl z-[999] p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b border-l border-gray-200 -rotate-45 rounded-bl-[2px]"></div>
            
            <div className="flex justify-between items-center mb-4 relative z-10">
              <button type="button" onClick={handlePrevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors outline-none border-none bg-transparent cursor-pointer"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
              <h3 className="text-sm font-bold text-[#1e3a8a]">{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</h3>
              <button type="button" onClick={handleNextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors outline-none border-none bg-transparent cursor-pointer"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
            </div>
            
            <div className="grid grid-cols-7 mb-2 relative z-10">
              {daysOfWeek.map(day => <div key={day} className="text-center text-xs font-bold text-gray-400">{day}</div>)}
            </div>
            
            <div className="grid grid-cols-7 gap-1 relative z-10">
              {Array(firstDayOfMonth).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isSelected = value === dateStr;
                const isToday = dateStr === todayStr;
                
                let btnClass = "h-8 w-8 mx-auto rounded-full text-sm font-bold flex items-center justify-center transition-all outline-none border-none cursor-pointer ";
                if (isSelected) btnClass += "bg-[#1e3a8a] text-white shadow-md scale-110";
                else if (isToday) btnClass += "bg-blue-50 text-blue-700 border border-blue-300 shadow-sm";
                else btnClass += "text-gray-700 bg-transparent hover:bg-gray-100";

                return (
                  <button key={day} type="button" onClick={() => selectDate(day)} className={btnClass}>
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}