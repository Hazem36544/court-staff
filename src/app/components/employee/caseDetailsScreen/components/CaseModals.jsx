import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { 
  Shield, X, User, Calendar, Save, MapPin, Clock, DollarSign, 
  Loader2, AlertTriangle, ExternalLink, HelpCircle, ChevronRight, ChevronLeft, FileText, Users 
} from 'lucide-react';
import CustomSelect from './CustomSelect';
import { monthNames, daysOfWeek, formatTime12h } from './CaseHelpers';

export default function CaseModals({
  showCustodyModal, setShowCustodyModal, handleSaveCustody, custodyForm, setCustodyForm, custodyParentOptions,
  showScheduleModal, setShowScheduleModal, handleSaveSchedule, scheduleForm, setScheduleForm, locationOptions, frequencyOptions,
  showAlimonyModal, setShowAlimonyModal, handleSaveAlimony, alimonyForm, setAlimonyForm,
  showCloseCaseModal, setShowCloseCaseModal, handleCloseCase, closureNotes, setClosureNotes, isClosingCase,
  deleteModal, setDeleteModal, confirmDelete,
  showPaymentAttemptsModal, setShowPaymentAttemptsModal, selectedPaymentDue, setSelectedPaymentDue, loadingAttempts, paymentAttempts,
  // ✅ Props النافذة الجديدة
  showHistoryDetailsModal, setShowHistoryDetailsModal, selectedHistoryVisit, locationCache, parentNames
}) {
  // --- Calendar Internal Logic ---
  const [openCalendar, setOpenCalendar] = useState(null);
  const [calendarViewDate, setCalendarViewDate] = useState(new Date());
  
  const custodyStartRef = useRef(null);
  const custodyEndRef = useRef(null);
  const scheduleStartRef = useRef(null);
  const scheduleEndRef = useRef(null);
  const alimonyStartRef = useRef(null);
  const alimonyEndRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openCalendar === 'custodyStart' && custodyStartRef.current && !custodyStartRef.current.contains(e.target)) setOpenCalendar(null);
      if (openCalendar === 'custodyEnd' && custodyEndRef.current && !custodyEndRef.current.contains(e.target)) setOpenCalendar(null);
      if (openCalendar === 'scheduleStart' && scheduleStartRef.current && !scheduleStartRef.current.contains(e.target)) setOpenCalendar(null);
      if (openCalendar === 'scheduleEnd' && scheduleEndRef.current && !scheduleEndRef.current.contains(e.target)) setOpenCalendar(null);
      if (openCalendar === 'alimonyStart' && alimonyStartRef.current && !alimonyStartRef.current.contains(e.target)) setOpenCalendar(null);
      if (openCalendar === 'alimonyEnd' && alimonyEndRef.current && !alimonyEndRef.current.contains(e.target)) setOpenCalendar(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openCalendar]);

  const handlePrevMonth = (e) => { e.stopPropagation(); setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1)); };
  const handleNextMonth = (e) => { e.stopPropagation(); setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1)); };

  const selectDate = (day, type) => {
    const year = calendarViewDate.getFullYear();
    const month = String(calendarViewDate.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${formattedDay}`;

    if (type === 'custodyStart') setCustodyForm({ ...custodyForm, startAt: dateStr });
    else if (type === 'custodyEnd') setCustodyForm({ ...custodyForm, endAt: dateStr });
    else if (type === 'scheduleStart') setScheduleForm({ ...scheduleForm, startDate: dateStr });
    else if (type === 'scheduleEnd') setScheduleForm({ ...scheduleForm, endDate: dateStr });
    else if (type === 'alimonyStart') setAlimonyForm({ ...alimonyForm, startDate: dateStr });
    else if (type === 'alimonyEnd') setAlimonyForm({ ...alimonyForm, endDate: dateStr });

    setOpenCalendar(null);
  };

  const renderCalendarPopup = (currentDateValue, type) => {
    const daysInMonth = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth(), 1).getDay();

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return (
      <div className="absolute bottom-[calc(100%+12px)] left-1/2 transform -translate-x-1/2 w-72 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] z-[150] p-5 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b border-l border-gray-100 -rotate-45 rounded-bl-[2px]"></div>
        
        <div className="flex justify-between items-center mb-4 relative z-10">
          <button type="button" onClick={handlePrevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors outline-none border-none bg-transparent cursor-pointer"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
          <h3 className="text-sm font-bold text-[#1e3a8a]">{monthNames[calendarViewDate.getMonth()]} {calendarViewDate.getFullYear()}</h3>
          <button type="button" onClick={handleNextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors outline-none border-none bg-transparent cursor-pointer"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
        </div>
        
        <div className="grid grid-cols-7 mb-2 relative z-10">
          {daysOfWeek.map(day => <div className="text-center text-xs font-bold text-gray-400" key={day}>{day}</div>)}
        </div>
        
        <div className="grid grid-cols-7 gap-1 relative z-10">
          {Array(firstDayOfMonth).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const dateStr = `${calendarViewDate.getFullYear()}-${String(calendarViewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = currentDateValue === dateStr;
            const isToday = dateStr === todayStr;
            
            let btnClass = "h-8 w-8 mx-auto rounded-full text-sm font-bold flex items-center justify-center transition-all outline-none cursor-pointer ";
            
            if (isSelected) {
              btnClass += "bg-[#1e3a8a] text-white shadow-md scale-110 border-none";
            } else if (isToday) {
              btnClass += "bg-blue-50 text-blue-700 border border-blue-300 shadow-sm";
            } else {
              btnClass += "text-gray-700 bg-transparent hover:bg-gray-100 border-none";
            }

            return (
              <button 
                key={day} 
                type="button" 
                onClick={() => selectDate(day, type)} 
                className={btnClass}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const isCustodyCalendarOpen = Boolean(openCalendar && openCalendar.startsWith('custody'));
  const isScheduleCalendarOpen = Boolean(openCalendar && openCalendar.startsWith('schedule'));
  const isAlimonyCalendarOpen = Boolean(openCalendar && openCalendar.startsWith('alimony'));

  return (
    <>
      {/* --- Custody Modal --- */}
      {showCustodyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <Card className={`p-0 w-full max-w-md bg-white animate-in zoom-in-95 duration-200 text-right rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] ${isCustodyCalendarOpen ? 'overflow-visible' : 'overflow-hidden'}`} dir="rtl">
            <div className={`p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center shrink-0 ${isCustodyCalendarOpen ? 'rounded-t-[2rem]' : ''}`}>
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><Shield className="text-[#1e3a8a] w-5 h-5" /> إدارة قاعدة الحضانة</h2>
              <button onClick={() => setShowCustodyModal(false)} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors outline-none border-none"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className={`p-6 ${isCustodyCalendarOpen ? 'overflow-visible' : 'custom-scrollbar'}`}>
              <form onSubmit={handleSaveCustody} className="space-y-5">
                <div className="relative">
                  <label className="block text-sm font-bold mb-2 text-gray-700">الوالد الحاضن <span className="text-red-500">*</span></label>
                  <CustomSelect options={custodyParentOptions} value={custodyForm.custodialParentId} onChange={(val) => setCustodyForm({ ...custodyForm, custodialParentId: val })} placeholder="اختر الوالد الحاضن" icon={User} hasSearch={false} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`relative ${openCalendar === 'custodyStart' ? 'z-50' : 'z-10'}`} ref={custodyStartRef}>
                    <label className="block text-sm font-bold mb-2 text-gray-700">تاريخ البدء <span className="text-red-500">*</span></label>
                    <div className="relative flex items-center">
                      <input type="date" onKeyDown={(e) => { if (e.key === ' ' || e.code === 'Space') e.preventDefault(); }} className="w-full p-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a8a] font-sans font-bold text-sm shadow-sm transition-all [&::-webkit-calendar-picker-indicator]:hidden [&::-moz-clear]:hidden" value={custodyForm.startAt} onChange={e => setCustodyForm({ ...custodyForm, startAt: e.target.value })} required />
                      <button type="button" onClick={(e) => { e.preventDefault(); if (openCalendar === 'custodyStart') setOpenCalendar(null); else { setOpenCalendar('custodyStart'); setCalendarViewDate(custodyForm.startAt ? new Date(custodyForm.startAt) : new Date()); } }} className="absolute right-4 text-gray-400 hover:text-[#1e3a8a] transition-colors outline-none border-none bg-transparent cursor-pointer"><Calendar className="w-5 h-5" /></button>
                      {openCalendar === 'custodyStart' && renderCalendarPopup(custodyForm.startAt, 'custodyStart')}
                    </div>
                  </div>
                  <div className={`relative ${openCalendar === 'custodyEnd' ? 'z-50' : 'z-10'}`} ref={custodyEndRef}>
                    <label className="block text-sm font-bold mb-2 text-gray-700">تاريخ الانتهاء</label>
                    <div className="relative flex items-center">
                      <input type="date" onKeyDown={(e) => { if (e.key === ' ' || e.code === 'Space') e.preventDefault(); }} className="w-full p-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a8a] font-sans font-bold text-sm shadow-sm transition-all text-gray-500 [&::-webkit-calendar-picker-indicator]:hidden [&::-moz-clear]:hidden" value={custodyForm.endAt} onChange={e => setCustodyForm({ ...custodyForm, endAt: e.target.value })} />
                      <button type="button" onClick={(e) => { e.preventDefault(); if (openCalendar === 'custodyEnd') setOpenCalendar(null); else { setOpenCalendar('custodyEnd'); setCalendarViewDate(custodyForm.endAt ? new Date(custodyForm.endAt) : new Date()); } }} className="absolute right-4 text-gray-400 hover:text-[#1e3a8a] transition-colors outline-none border-none bg-transparent cursor-pointer"><Calendar className="w-5 h-5" /></button>
                      {openCalendar === 'custodyEnd' && renderCalendarPopup(custodyForm.endAt, 'custodyEnd')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 mt-2">
                  <button type="button" onClick={() => setShowCustodyModal(false)} className="flex-1 py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 shadow-sm outline-none">إلغاء</button>
                  <button type="submit" className="flex-1 py-3.5 bg-[#1e3a8a] text-white rounded-xl font-bold shadow-sm hover:bg-blue-800 border-none outline-none flex justify-center items-center gap-2"><Save className="w-4 h-4"/> حفظ التعديلات</button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* --- Schedule Modal --- */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <Card className={`p-0 w-full max-w-lg bg-white animate-in zoom-in-95 duration-200 text-right rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] ${isScheduleCalendarOpen ? 'overflow-visible' : 'overflow-hidden'}`} dir="rtl">
            <div className={`p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center shrink-0 ${isScheduleCalendarOpen ? 'rounded-t-[2rem]' : ''}`}>
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><Calendar className="text-[#1e3a8a] w-5 h-5" /> إدارة جدول الزيارات</h2>
              <button onClick={() => setShowScheduleModal(false)} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors outline-none border-none"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className={`p-6 ${isScheduleCalendarOpen ? 'overflow-visible' : 'custom-scrollbar'}`}>
              <form onSubmit={handleSaveSchedule} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative">
                    <label className="block text-sm font-bold mb-2 text-gray-700">الموقع <span className="text-red-500">*</span></label>
                    <CustomSelect options={locationOptions} value={scheduleForm.locationId} onChange={(val) => setScheduleForm({ ...scheduleForm, locationId: val })} placeholder="ابحث واختر المركز..." icon={MapPin} hasSearch={true} />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-bold mb-2 text-gray-700">التكرار <span className="text-red-500">*</span></label>
                    <CustomSelect options={frequencyOptions} value={scheduleForm.frequency} onChange={(val) => setScheduleForm({ ...scheduleForm, frequency: val })} placeholder="اختر التكرار" icon={Calendar} hasSearch={false} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className={`relative ${openCalendar === 'scheduleStart' ? 'z-50' : 'z-10'}`} ref={scheduleStartRef}>
                    <label className="block text-sm font-bold mb-2 text-gray-700">تاريخ البدء <span className="text-red-500">*</span></label>
                    <div className="relative flex items-center">
                      <input type="date" onKeyDown={(e) => { if (e.key === ' ' || e.code === 'Space') e.preventDefault(); }} className="w-full p-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a8a] font-sans font-bold text-sm shadow-sm transition-all [&::-webkit-calendar-picker-indicator]:hidden [&::-moz-clear]:hidden" value={scheduleForm.startDate} onChange={e => setScheduleForm({ ...scheduleForm, startDate: e.target.value })} required />
                      <button type="button" onClick={(e) => { e.preventDefault(); if (openCalendar === 'scheduleStart') setOpenCalendar(null); else { setOpenCalendar('scheduleStart'); setCalendarViewDate(scheduleForm.startDate ? new Date(scheduleForm.startDate) : new Date()); } }} className="absolute right-4 text-gray-400 hover:text-[#1e3a8a] transition-colors outline-none border-none bg-transparent cursor-pointer"><Calendar className="w-5 h-5" /></button>
                      {openCalendar === 'scheduleStart' && renderCalendarPopup(scheduleForm.startDate, 'scheduleStart')}
                    </div>
                  </div>
                  <div className={`relative ${openCalendar === 'scheduleEnd' ? 'z-50' : 'z-10'}`} ref={scheduleEndRef}>
                    <label className="block text-sm font-bold mb-2 text-gray-700">تاريخ الانتهاء</label>
                    <div className="relative flex items-center">
                      <input type="date" onKeyDown={(e) => { if (e.key === ' ' || e.code === 'Space') e.preventDefault(); }} className="w-full p-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a8a] font-sans font-bold text-sm shadow-sm transition-all text-gray-500 [&::-webkit-calendar-picker-indicator]:hidden [&::-moz-clear]:hidden" value={scheduleForm.endDate} onChange={e => setScheduleForm({ ...scheduleForm, endDate: e.target.value })} />
                      <button type="button" onClick={(e) => { e.preventDefault(); if (openCalendar === 'scheduleEnd') setOpenCalendar(null); else { setOpenCalendar('scheduleEnd'); setCalendarViewDate(scheduleForm.endDate ? new Date(scheduleForm.endDate) : new Date()); } }} className="absolute right-4 text-gray-400 hover:text-[#1e3a8a] transition-colors outline-none border-none bg-transparent cursor-pointer"><Calendar className="w-5 h-5" /></button>
                      {openCalendar === 'scheduleEnd' && renderCalendarPopup(scheduleForm.endDate, 'scheduleEnd')}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">وقت الحضور <span className="text-red-500">*</span></label>
                    <div className="relative flex items-center">
                      <Clock className="absolute right-4 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input type="time" className="w-full p-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a8a] font-mono font-bold text-sm shadow-sm transition-all" value={scheduleForm.startTime} onChange={e => setScheduleForm({ ...scheduleForm, startTime: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">وقت الانصراف <span className="text-red-500">*</span></label>
                    <div className="relative flex items-center">
                      <Clock className="absolute right-4 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input type="time" className="w-full p-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a8a] font-mono font-bold text-sm shadow-sm transition-all" value={scheduleForm.endTime} onChange={e => setScheduleForm({ ...scheduleForm, endTime: e.target.value })} required />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 mt-2">
                  <button type="button" onClick={() => setShowScheduleModal(false)} className="flex-1 py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 shadow-sm outline-none">إلغاء</button>
                  <button type="submit" className="flex-1 py-3.5 bg-[#1e3a8a] text-white rounded-xl font-bold shadow-sm hover:bg-blue-800 border-none outline-none flex justify-center items-center gap-2"><Save className="w-4 h-4"/> حفظ الجدول</button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* --- Alimony Modal --- */}
      {showAlimonyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <Card className={`p-0 w-full max-w-md bg-white animate-in zoom-in-95 duration-200 text-right rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] ${isAlimonyCalendarOpen ? 'overflow-visible' : 'overflow-hidden'}`} dir="rtl">
            <div className={`p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center shrink-0 ${isAlimonyCalendarOpen ? 'rounded-t-[2rem]' : ''}`}>
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><DollarSign className="text-orange-600 w-6 h-6" /> إدارة قاعدة النفقة</h2>
              <button onClick={() => setShowAlimonyModal(false)} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors outline-none border-none"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className={`p-6 ${isAlimonyCalendarOpen ? 'overflow-visible' : 'custom-scrollbar'}`}>
              <form onSubmit={handleSaveAlimony} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">المبلغ المقرر (ج.م) <span className="text-red-500">*</span></label>
                  <input type="number" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white font-mono font-bold text-lg tracking-wider shadow-sm transition-all text-left" dir="ltr" placeholder="0.00" value={alimonyForm.amount} onChange={e => setAlimonyForm({ ...alimonyForm, amount: e.target.value })} required />
                </div>
                <div className="relative">
                  <label className="block text-sm font-bold mb-2 text-gray-700">معدل التكرار <span className="text-red-500">*</span></label>
                  <CustomSelect options={frequencyOptions} value={alimonyForm.frequency} onChange={(val) => setAlimonyForm({ ...alimonyForm, frequency: val })} placeholder="اختر التكرار" icon={Calendar} hasSearch={false} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`relative ${openCalendar === 'alimonyStart' ? 'z-50' : 'z-10'}`} ref={alimonyStartRef}>
                    <label className="block text-sm font-bold mb-2 text-gray-700">تاريخ البدء <span className="text-red-500">*</span></label>
                    <div className="relative flex items-center">
                      <input type="date" onKeyDown={(e) => { if (e.key === ' ' || e.code === 'Space') e.preventDefault(); }} className="w-full p-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-sans font-bold text-sm shadow-sm transition-all [&::-webkit-calendar-picker-indicator]:hidden [&::-moz-clear]:hidden" value={alimonyForm.startDate} onChange={e => setAlimonyForm({ ...alimonyForm, startDate: e.target.value })} required />
                      <button type="button" onClick={(e) => { e.preventDefault(); if (openCalendar === 'alimonyStart') setOpenCalendar(null); else { setOpenCalendar('alimonyStart'); setCalendarViewDate(alimonyForm.startDate ? new Date(alimonyForm.startDate) : new Date()); } }} className="absolute right-4 text-gray-400 hover:text-orange-500 transition-colors outline-none border-none bg-transparent cursor-pointer"><Calendar className="w-5 h-5" /></button>
                      {openCalendar === 'alimonyStart' && renderCalendarPopup(alimonyForm.startDate, 'alimonyStart')}
                    </div>
                  </div>
                  <div className={`relative ${openCalendar === 'alimonyEnd' ? 'z-50' : 'z-10'}`} ref={alimonyEndRef}>
                    <label className="block text-sm font-bold mb-2 text-gray-700">تاريخ الانتهاء</label>
                    <div className="relative flex items-center">
                      <input type="date" onKeyDown={(e) => { if (e.key === ' ' || e.code === 'Space') e.preventDefault(); }} className="w-full p-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-sans font-bold text-sm shadow-sm transition-all text-gray-500 [&::-webkit-calendar-picker-indicator]:hidden [&::-moz-clear]:hidden" value={alimonyForm.endDate} onChange={e => setAlimonyForm({ ...alimonyForm, endDate: e.target.value })} />
                      <button type="button" onClick={(e) => { e.preventDefault(); if (openCalendar === 'alimonyEnd') setOpenCalendar(null); else { setOpenCalendar('alimonyEnd'); setCalendarViewDate(alimonyForm.endDate ? new Date(alimonyForm.endDate) : new Date()); } }} className="absolute right-4 text-gray-400 hover:text-orange-500 transition-colors outline-none border-none bg-transparent cursor-pointer"><Calendar className="w-5 h-5" /></button>
                      {openCalendar === 'alimonyEnd' && renderCalendarPopup(alimonyForm.endDate, 'alimonyEnd')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 mt-2">
                  <button type="button" onClick={() => setShowAlimonyModal(false)} className="flex-1 py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 shadow-sm outline-none">إلغاء</button>
                  <button type="submit" className="flex-1 py-3.5 bg-orange-600 text-white rounded-xl font-bold shadow-sm hover:bg-orange-700 border-none outline-none flex justify-center items-center gap-2"><Save className="w-4 h-4"/> حفظ النفقة</button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* --- Close Case Modal --- */}
      {showCloseCaseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in" dir="rtl">
          <Card className="p-0 w-full max-w-md animate-in slide-in-from-bottom-5 duration-300 border-none shadow-2xl rounded-[2rem] flex flex-col max-h-[90vh] overflow-hidden text-right">
            <div className="bg-red-600 p-6 flex items-center justify-between text-white shrink-0">
               <h2 className="text-xl font-bold flex items-center gap-2"><Shield className="w-6 h-6"/> إغلاق القضية نهائياً</h2>
               <button onClick={() => setShowCloseCaseModal(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors border-none outline-none"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 custom-scrollbar">
              <p className="text-sm text-gray-600 mb-6 font-bold leading-relaxed">أنت على وشك إغلاق القضية بشكل نهائي. يجب تقديم ملاحظات القرار النهائي أو أسباب الإغلاق في الحقل أدناه.</p>
              <form onSubmit={handleCloseCase} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-800">ملاحظات وقرار الإغلاق <span className="text-red-500">*</span></label>
                  <textarea className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl h-32 resize-none focus:ring-2 focus:ring-red-500 focus:bg-white outline-none font-bold text-sm shadow-sm transition-all" value={closureNotes} onChange={e => setClosureNotes(e.target.value)} placeholder="أدخل قرار المحكمة النهائي لتسجيله في الأرشيف..." required />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowCloseCaseModal(false)} className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm outline-none">تراجع</button>
                  <button type="submit" disabled={isClosingCase || !closureNotes.trim()} className="flex-1 py-3.5 bg-red-600 text-white rounded-xl font-bold shadow-sm disabled:opacity-70 disabled:cursor-not-allowed hover:bg-red-700 transition-colors flex items-center justify-center gap-2 border-none outline-none">{isClosingCase ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />} تأكيد الإغلاق</button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in" dir="rtl">
          <Card className="p-8 w-full max-w-md animate-in slide-in-from-bottom-5 duration-300 border-none shadow-2xl rounded-[2rem] text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6 mx-auto shadow-inner"><AlertTriangle className="w-10 h-10" /></div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">هل أنت متأكد؟</h2>
            <p className="text-gray-500 text-sm font-bold mb-6 px-2 leading-relaxed">أنت على وشك حذف <span className="text-gray-800 underline decoration-red-200">{deleteModal.title}</span>. لا يمكن التراجع عن هذا الإجراء نهائياً.</p>
            {deleteModal.subtitle && <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8"><p className="text-xs text-red-700 font-bold leading-relaxed">⚠️ تنبيه: {deleteModal.subtitle}</p></div>}
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal({ show: false, type: '', id: '', title: '', subtitle: '' })} className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all active:scale-95 shadow-sm outline-none">تراجع</button>
              <button onClick={confirmDelete} className="flex-1 py-3.5 bg-red-600 text-white rounded-xl font-bold shadow-sm hover:bg-red-700 transition-all active:scale-95 border-none outline-none">نعم، احذف</button>
            </div>
          </Card>
        </div>
      )}

      {/* --- Payment Attempts Modal --- */}
      {showPaymentAttemptsModal && selectedPaymentDue && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <Card className="p-0 w-full max-w-2xl bg-white animate-in zoom-in-95 duration-200 shadow-2xl rounded-[2.5rem] flex flex-col max-h-[90vh] overflow-hidden text-right" dir="rtl">
            <div className="p-6 md:p-8 bg-orange-50 border-b border-orange-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-2xl shadow-sm"><DollarSign className="w-8 h-8 text-orange-600" /></div>
                <div>
                  <h3 className="font-black text-xl text-orange-900 mb-1">محاولات الدفع</h3>
                  <span className="text-xs font-bold text-orange-600 flex items-center gap-1.5 font-mono"><Calendar className="w-3.5 h-3.5" /> استحقاق: {new Date(selectedPaymentDue.dueDate).toLocaleDateString('ar-EG')}</span>
                </div>
              </div>
              <button onClick={() => { setShowPaymentAttemptsModal(false); setSelectedPaymentDue(null); }} className="p-2 bg-white hover:bg-gray-100 rounded-full transition-all active:scale-95 text-gray-500 shadow-sm border border-gray-200 outline-none"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 md:p-8 custom-scrollbar flex-1 bg-gray-50/50">
              {loadingAttempts ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4"><Loader2 className="w-10 h-10 animate-spin text-orange-500" /><p className="text-gray-500 font-bold">جاري جلب سجل المحاولات...</p></div>
              ) : paymentAttempts.length > 0 ? (
                <div className="space-y-4">
                  {paymentAttempts.map((attempt, i) => (
                    <div key={attempt.id || i} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-orange-100 transition-all">
                      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shrink-0"><DollarSign className="w-5 h-5" /></div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{attempt.method === 'Online' ? 'دفع إلكتروني' : (attempt.method || 'دفع إلكتروني')}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">طريقة الدفع</p>
                          </div>
                        </div>
                        <Badge className={`${attempt.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'} border-none shadow-sm text-[11px] px-3 py-1 rounded-full font-bold`}>{attempt.status === 'Paid' ? 'تم الدفع بنجاح' : attempt.status}</Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 flex-1 w-full sm:w-auto">
                          <span className="text-gray-500 text-xs font-bold flex items-center gap-2 mb-1"><Clock className="w-3.5 h-3.5" /> تاريخ التنفيذ</span>
                          <span className="text-gray-800 font-mono font-bold text-sm tracking-wider" dir="ltr">{new Date(attempt.paidAt).toLocaleString('ar-EG')}</span>
                        </div>
                        {attempt.receiptUrl && <a href={attempt.receiptUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold text-orange-700 bg-orange-50 hover:bg-orange-600 hover:text-white px-5 h-12 rounded-xl transition-colors outline-none"><ExternalLink className="w-4 h-4" /> عرض الإيصال</a>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white border border-dashed border-gray-200 rounded-2xl"><HelpCircle className="w-12 h-12 mb-3 opacity-20" /><p className="font-bold text-lg">لم يتم العثور على محاولات دفع.</p></div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ✅ النافذة الجديدة: تقرير إثبات حالة الزيارة (لموظف المحكمة) */}
      {showHistoryDetailsModal && selectedHistoryVisit && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in" dir="rtl">
          <Card className="p-0 w-full max-w-lg bg-white animate-in zoom-in-95 duration-200 shadow-2xl rounded-[2rem] flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Header */}
            <div className="bg-[#1e3a8a] p-5 md:p-6 flex justify-between items-center text-white shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              <h2 className="text-lg font-bold flex items-center gap-2 relative z-10"><FileText className="w-5 h-5"/> تقرير إثبات حالة الزيارة</h2>
              <button onClick={() => setShowHistoryDetailsModal(false)} className="p-1.5 hover:bg-white/20 rounded-full transition-colors outline-none border-none cursor-pointer relative z-10">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
              
              {/* ملخص الحالة والتاريخ */}
              {(() => {
                  let vStatusLabel = 'مجدولة';
                  let vStatusColor = 'bg-gray-100 text-gray-700';
                  
                  const att = selectedHistoryVisit.attendance || {};
                  const hasNonCustodialIn = !!att.nonCustodialCheckedInAt;
                  const hasCompIn = !!att.companionCheckedInAt;
                  
                  if (selectedHistoryVisit.status === 'Completed') {
                      vStatusLabel = 'مكتملة';
                      vStatusColor = 'bg-green-100 text-green-700';
                  } else if (selectedHistoryVisit.status === 'Cancelled') {
                      vStatusLabel = 'ملغاة';
                      vStatusColor = 'bg-red-100 text-red-700';
                  } else if (new Date(selectedHistoryVisit.startAt) < new Date() && !hasNonCustodialIn && !hasCompIn) {
                      vStatusLabel = 'غياب (لم تتم)';
                      vStatusColor = 'bg-red-100 text-red-700';
                  }

                  const nonCustodialIn = hasNonCustodialIn ? formatTime12h(att.nonCustodialCheckedInAt.split('T')[1]) : 'لم يحضر';
                  const nonCustodialOut = att.nonCustodialCheckedOutAt ? formatTime12h(att.nonCustodialCheckedOutAt.split('T')[1]) : 'لم ينصرف';
                  const compIn = hasCompIn ? formatTime12h(att.companionCheckedInAt.split('T')[1]) : 'لم يحضر';
                  const compOut = att.companionCheckedOutAt ? formatTime12h(att.companionCheckedOutAt.split('T')[1]) : 'لم ينصرف';
                  
                  const compNIdFromVisit = selectedHistoryVisit.companionNationalId;
                  const isAlternateCompanion = compNIdFromVisit && compNIdFromVisit !== parentNames.custodialNId;
                  const locName = locationCache[selectedHistoryVisit.visitCenterId] || 'موقع غير معروف';

                  return (
                    <>
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex flex-col justify-center items-center shadow-sm">
                            <span className="text-slate-500 font-bold text-[10px] mb-1">التاريخ</span>
                            <span className="text-slate-800 font-bold text-sm">{new Date(selectedHistoryVisit.startAt).toLocaleDateString('ar-EG')}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex flex-col justify-center items-center shadow-sm">
                            <span className="text-slate-500 font-bold text-[10px] mb-1">الحالة النهائية</span>
                            <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${vStatusColor}`}>{vStatusLabel}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                          <span className="text-slate-500 font-bold text-sm">مكان التنفيذ</span>
                          <span className="text-slate-800 font-bold text-sm flex items-center gap-1">
                             <MapPin className="w-3.5 h-3.5 text-slate-400" /> {locName}
                          </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-2 mt-2">
                          <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex flex-col justify-center items-center shadow-sm">
                              <span className="text-blue-500 font-bold text-[10px] mb-1">وقت الحضور المجدول</span>
                              <span className="text-blue-900 font-mono font-bold text-sm" dir="ltr">{formatTime12h(selectedHistoryVisit.startAt.split('T')[1])}</span>
                          </div>
                          <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex flex-col justify-center items-center shadow-sm">
                              <span className="text-blue-500 font-bold text-[10px] mb-1">وقت الانصراف المجدول</span>
                              <span className="text-blue-900 font-mono font-bold text-sm" dir="ltr">{formatTime12h(selectedHistoryVisit.endAt.split('T')[1])}</span>
                          </div>
                      </div>

                      {/* الطرف غير الحاضن */}
                      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col gap-2">
                         <div className="border-b border-slate-100 pb-2 mb-1">
                           <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-800 text-sm">{parentNames.nonCustodial || 'الطرف غير الحاضن'}</span>
                              <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded-md">(الطرف غير الحاضن)</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                              <span className="text-slate-400 text-[10px]">الرقم القومي:</span>
                              <span className="font-mono text-xs font-bold text-slate-600 tracking-widest">{parentNames.nonCustodialNId || 'غير مسجل'}</span>
                           </div>
                         </div>
                         <div className="flex justify-between text-xs items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span className="text-slate-500 font-bold">حضور فعلي:</span>
                            <span className="font-mono font-bold text-slate-800" dir="ltr">{nonCustodialIn}</span>
                         </div>
                         {hasNonCustodialIn && (
                             <div className="flex justify-between text-xs items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <span className="text-slate-500 font-bold">انصراف فعلي:</span>
                                <span className="font-mono font-bold text-slate-800" dir="ltr">{nonCustodialOut}</span>
                             </div>
                         )}
                      </div>

                      {/* الطرف الحاضن */}
                      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col gap-2">
                         <div className="border-b border-slate-100 pb-2 mb-1">
                           <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-800 text-sm">{parentNames.custodial || 'الطرف الحاضن'}</span>
                              <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                 {isAlternateCompanion ? '(الطرف الحاضن)' : '(حاضن ومرافق)'}
                              </span>
                           </div>
                           <div className="flex items-center gap-1.5">
                              <span className="text-slate-400 text-[10px]">الرقم القومي:</span>
                              <span className="font-mono text-xs font-bold text-slate-600 tracking-widest">{parentNames.custodialNId || 'غير مسجل'}</span>
                           </div>
                         </div>
                         {isAlternateCompanion && (
                           <div className="bg-slate-50 border border-slate-100 p-2 rounded-lg mb-1 flex justify-between items-center">
                              <span className="text-slate-600 text-xs font-bold flex items-center gap-1"><Users className="w-3.5 h-3.5"/> مرافق بديل:</span>
                              <span className="font-mono text-xs font-bold text-slate-800 tracking-widest">{compNIdFromVisit}</span>
                           </div>
                         )}
                         <div className="flex justify-between text-xs items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span className="text-slate-500 font-bold">حضور فعلي:</span>
                            <span className="font-mono font-bold text-slate-800" dir="ltr">{compIn}</span>
                         </div>
                         {hasCompIn && (
                             <div className="flex justify-between text-xs items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <span className="text-slate-500 font-bold">انصراف فعلي:</span>
                                <span className="font-mono font-bold text-slate-800" dir="ltr">{compOut}</span>
                             </div>
                         )}
                      </div>

                      {/* المخالفات (تظهر فقط في حالة وجودها) */}
                      {(att.nonCustodialOverstayed || att.companionOverstayed) && (
                         <div className="bg-red-50 p-3 rounded-xl border border-red-200 shadow-sm mt-2">
                            <h4 className="text-red-700 font-bold text-xs mb-2 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5"/> ملاحظات ومخالفات قانونية:</h4>
                            <ul className="text-[11px] text-red-600 font-bold list-disc list-inside px-2 space-y-1">
                               {att.nonCustodialOverstayed && <li>تأخر الطرف غير الحاضن في تسليم الأطفال بالموعد.</li>}
                               {att.companionOverstayed && <li>تأخر المرافق/الطرف الحاضن عن الانصراف في الموعد.</li>}
                            </ul>
                         </div>
                      )}
                    </>
                  );
              })()}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 shrink-0">
               <button onClick={() => setShowHistoryDetailsModal(false)} className="w-full py-3.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-sm outline-none cursor-pointer active:scale-95">إغلاق التقرير</button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}