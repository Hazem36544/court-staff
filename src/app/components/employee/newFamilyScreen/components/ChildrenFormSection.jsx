import React, { useState, useEffect, useRef } from 'react';
import { Baby, AlertTriangle, UserPlus, Save, X, School, Edit2, Trash2, ChevronDown, CheckCircle } from 'lucide-react'; // ✅ أيقونات إضافية
import CustomDatePicker from './CustomDatePicker';
import SchoolSelect from './SchoolSelect';

export default function ChildrenFormSection({ 
  newChild, handleChildNameChange, handleNewChildChange, formErrors, 
  schoolsList, schoolSearchTerm, setSchoolSearchTerm,
  addChild, editingChildId, cancelEditChild,
  children, startEditChild, removeChild, getSchoolName,
  onAddNewSchool // ✅ دالة الفتح
}) {
  // ✅ إدارة حالة الـ Custom Dropdown الخاص بالجنس
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const genderRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (genderRef.current && !genderRef.current.contains(e.target)) {
        setIsGenderOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 w-full text-right">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3 border-b border-gray-50 pb-5">
        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600"><Baby className="w-5 h-5" /></div>
        بيانات الأبناء (إضافة للقائمة أولاً)
      </h3>

      <form onSubmit={addChild} className="bg-gray-50/50 p-6 md:p-8 rounded-[2rem] mb-8 border border-gray-100 shadow-sm relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">الاسم الرباعي للطفل <span className="text-red-500">*</span></label>
            <input 
              type="text" name="fullName" value={newChild.fullName} onChange={handleChildNameChange} placeholder="الاسم الرباعي بالكامل" 
              className={`w-full p-4 bg-white rounded-xl border shadow-sm outline-none transition-all font-bold text-sm focus:ring-2 ${formErrors.child_fullName ? 'border-red-300 focus:ring-red-400 bg-red-50' : 'border-gray-200 focus:ring-[#1e3a8a]'}`} 
            />
            {formErrors.child_fullName && <span className="text-red-500 text-[11px] font-bold flex items-start gap-1 mt-1.5"><AlertTriangle className="w-3.5 h-3.5 shrink-0"/> {formErrors.child_fullName}</span>}
          </div>
          
          <CustomDatePicker 
            label="تاريخ الميلاد" 
            required={true}
            error={formErrors.child_birthDate}
            value={newChild.birthDate} 
            onChange={(val) => handleNewChildChange({ target: { name: 'birthDate', value: val } })} 
          />

          {/* ✅ حقل الجنس بالـ Custom Dropdown الموحد */}
          <div className="flex flex-col gap-1.5 relative" ref={genderRef}>
            <label className="text-sm font-bold text-gray-700">الجنس <span className="text-red-500">*</span></label>
            <div 
              onClick={() => setIsGenderOpen(!isGenderOpen)}
              className={`w-full h-[52px] px-4 bg-white rounded-xl border shadow-sm outline-none transition-all font-bold text-sm cursor-pointer flex justify-between items-center ${isGenderOpen ? 'border-[#1e3a8a] ring-2 ring-[#1e3a8a]/20' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <span className="text-gray-800">{newChild.gender === 'Male' ? 'ذكر' : 'أنثى'}</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isGenderOpen ? 'rotate-180 text-[#1e3a8a]' : ''}`} />
            </div>
            {isGenderOpen && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden transition-opacity duration-300 opacity-100">
                <ul className="py-2 m-0 list-none">
                  {[{value: 'Male', label: 'ذكر'}, {value: 'Female', label: 'أنثى'}].map((opt) => (
                    <li 
                      key={opt.value}
                      onClick={() => {
                        handleNewChildChange({ target: { name: 'gender', value: opt.value } });
                        setIsGenderOpen(false);
                      }}
                      className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors flex justify-between items-center ${newChild.gender === opt.value ? 'bg-blue-50 text-[#1e3a8a]' : 'text-gray-600 hover:bg-gray-50 hover:text-[#1e3a8a]'}`}
                    >
                      {opt.label}
                      {newChild.gender === opt.value && <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SchoolSelect 
            schoolsList={schoolsList} 
            value={newChild.schoolId} 
            onChange={(school) => handleNewChildChange({ target: { name: 'schoolId', value: school.id } })}
            schoolSearchTerm={schoolSearchTerm}
            setSchoolSearchTerm={setSchoolSearchTerm}
            onAddNewSchool={onAddNewSchool} // ✅ التمرير هنا
          />
          
          <div className="flex gap-3 items-end">
            <button type="submit" className={`flex-1 ${editingChildId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm border-none h-[52px] outline-none active:scale-95 cursor-pointer`}>
              {editingChildId ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {editingChildId ? 'تحديث بيانات الطفل' : 'إضافة الطفل للقائمة'}
            </button>
            {editingChildId && (
              <button type="button" onClick={cancelEditChild} className="bg-white text-gray-600 px-5 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center border border-gray-200 shadow-sm h-[52px] outline-none active:scale-95 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {children.length > 0 ? children.map((child) => (
          <div key={child.id} className="flex items-start justify-between bg-white border border-gray-200 p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-blue-200 transition-all group">
            <div className="flex items-start gap-4 min-w-0">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-inner ${child.gender === 'Male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                {child.gender === 'Male' ? 'ذكر' : 'أنثى'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-800 text-sm mb-1 truncate">{child.fullName}</p>
                <span className="text-[11px] text-gray-500 font-bold bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{child.birthDate}</span>
                {child.schoolId && <p className="text-[10px] text-[#1e3a8a] mt-1.5 font-bold truncate"><School className="w-3 h-3 inline mr-1"/> {getSchoolName(child.schoolId)}</p>}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button type="button" onClick={() => startEditChild(child)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors border-none outline-none cursor-pointer"><Edit2 className="w-4 h-4" /></button>
              <button type="button" onClick={() => removeChild(child.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors border-none outline-none cursor-pointer"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        )) : <div className="col-span-full text-center text-gray-400 py-12 border border-dashed border-gray-200 rounded-[2rem] bg-gray-50/50 shadow-sm"><Baby className="w-12 h-12 mx-auto mb-3 opacity-20"/><p className="font-bold text-sm">لم يتم إضافة أطفال للقائمة بعد</p></div>}
      </div>
    </div>
  );
}