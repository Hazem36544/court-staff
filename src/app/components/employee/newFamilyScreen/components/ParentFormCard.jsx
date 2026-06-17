import React from 'react';
import { Users, AlertTriangle } from 'lucide-react';
import CustomDatePicker from './CustomDatePicker';

export default function ParentFormCard({ type, data, onChange, errors }) {
  const isFather = type === 'father';
  const title = isFather ? 'بيانات الأب' : 'بيانات الأم';
  const color = isFather ? 'blue' : 'pink';
  const prefix = isFather ? 'father' : 'mother';

  return (
    <div className={`bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 group hover:border-${color}-200 transition-all flex flex-col h-full relative`}>
      <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
        <div className={`absolute top-0 left-0 w-24 h-24 bg-${color}-50 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50 pointer-events-none`}></div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3 border-b border-gray-50 pb-5 relative z-10">
        <div className={`w-10 h-10 bg-${color}-50 rounded-xl flex items-center justify-center text-${color}-600`}><Users className="w-5 h-5" /></div>
        {title}
      </h3>
      
      <div className="space-y-5 relative z-10 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">الاسم الرباعي <span className="text-red-500">*</span></label>
            <input 
              type="text" name="fullName" value={data.fullName} onChange={onChange} placeholder="الاسم الرباعي بالكامل"
              className={`w-full p-4 rounded-xl border focus:outline-none transition-all font-bold text-sm shadow-sm ${errors[`${prefix}_fullName`] ? 'bg-red-50 border-red-300 focus:ring-2 focus:ring-red-400' : 'bg-gray-50 border-gray-200 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white'}`}
            />
            {errors[`${prefix}_fullName`] && <span className="text-red-500 text-[11px] font-bold flex items-start gap-1"><AlertTriangle className="w-3.5 h-3.5 shrink-0"/> {errors[`${prefix}_fullName`]}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">الرقم القومي <span className="text-red-500">*</span></label>
            <input 
              type="text" name="nationalId" maxLength="14" value={data.nationalId} onChange={onChange} placeholder="14 رقم"
              className={`w-full p-4 rounded-xl border focus:outline-none transition-all font-mono tracking-widest text-sm shadow-sm ${errors[`${prefix}_nationalId`] ? 'bg-red-50 border-red-300 focus:ring-2 focus:ring-red-400' : 'bg-gray-50 border-gray-200 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white'}`}
            />
            {errors[`${prefix}_nationalId`] && <span className="text-red-500 text-[11px] font-bold flex items-start gap-1"><AlertTriangle className="w-3.5 h-3.5 shrink-0"/> {errors[`${prefix}_nationalId`]}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">رقم الهاتف <span className="text-red-500">*</span></label>
            <input 
              type="tel" name="phone" value={data.phone} onChange={onChange} dir="ltr" placeholder="01xxxxxxxxx" maxLength="11"
              className={`w-full p-4 rounded-xl border focus:outline-none transition-all font-mono tracking-widest text-left text-sm shadow-sm ${errors[`${prefix}_phone`] ? 'bg-red-50 border-red-300 focus:ring-2 focus:ring-red-400' : 'bg-gray-50 border-gray-200 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white'}`}
            />
            {errors[`${prefix}_phone`] && <span className="text-red-500 text-[11px] font-bold flex items-start gap-1" dir="rtl"><AlertTriangle className="w-3.5 h-3.5 shrink-0"/> {errors[`${prefix}_phone`]}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">البريد الإلكتروني (اختياري)</label>
            <input 
              type="email" name="email" value={data.email} onChange={onChange} dir="ltr" placeholder="email@example.com"
              className={`w-full p-4 rounded-xl border focus:outline-none transition-all font-mono text-left text-sm shadow-sm ${errors[`${prefix}_email`] ? 'bg-red-50 border-red-300 focus:ring-2 focus:ring-red-400' : 'bg-gray-50 border-gray-200 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white'}`}
            />
            {errors[`${prefix}_email`] && <span className="text-red-500 text-[11px] font-bold flex items-start gap-1" dir="rtl"><AlertTriangle className="w-3.5 h-3.5 shrink-0"/> {errors[`${prefix}_email`]}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CustomDatePicker 
            label="تاريخ الميلاد (مستخرج)" 
            value={data.birthDate} 
            onChange={(val) => onChange({ target: { name: 'birthDate', value: val } })}
            required={false}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">الجنس</label>
            <input type="text" value={isFather ? "ذكر" : "أنثى"} disabled className="w-full p-4 bg-gray-200 text-gray-600 rounded-xl border border-gray-200 outline-none font-bold text-sm shadow-sm cursor-not-allowed" />
          </div>
        </div>
        
        {/* المهنة والعنوان أصبحوا إجباري */}
        <div className="flex flex-col gap-1.5">
           <label className="text-sm font-bold text-gray-700">المهنة <span className="text-red-500">*</span></label>
           <input type="text" name="job" value={data.job} onChange={onChange} placeholder="مثال: مهندس، معلم..." 
           className={`w-full p-4 rounded-xl border focus:outline-none transition-all font-bold text-sm shadow-sm ${errors[`${prefix}_job`] ? 'bg-red-50 border-red-300 focus:ring-2 focus:ring-red-400' : 'bg-gray-50 border-gray-200 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white'}`} />
           {errors[`${prefix}_job`] && <span className="text-red-500 text-[11px] font-bold flex items-start gap-1"><AlertTriangle className="w-3.5 h-3.5 shrink-0"/> {errors[`${prefix}_job`]}</span>}
        </div>
        
        <div className="flex flex-col gap-1.5">
           <label className="text-sm font-bold text-gray-700">العنوان التفصيلي <span className="text-red-500">*</span></label>
           <input type="text" name="address" value={data.address} onChange={onChange} placeholder="العنوان التفصيلي للإقامة..." 
           className={`w-full p-4 rounded-xl border focus:outline-none transition-all font-bold text-sm shadow-sm ${errors[`${prefix}_address`] ? 'bg-red-50 border-red-300 focus:ring-2 focus:ring-red-400' : 'bg-gray-50 border-gray-200 focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white'}`} />
           {errors[`${prefix}_address`] && <span className="text-red-500 text-[11px] font-bold flex items-start gap-1"><AlertTriangle className="w-3.5 h-3.5 shrink-0"/> {errors[`${prefix}_address`]}</span>}
        </div>
      </div>
    </div>
  );
}