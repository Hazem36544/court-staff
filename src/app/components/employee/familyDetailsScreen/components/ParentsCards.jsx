import React from 'react';
import { User } from 'lucide-react';
import { Card } from '../../../ui/card';
import { Badge } from '../../../ui/badge';

export default function ParentsCards({ family }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Father Card */}
      <Card className="p-6 md:p-8 bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow rounded-[2rem] overflow-hidden relative text-right">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50 pointer-events-none"></div>
        <div className="flex items-start gap-4 mb-6 border-b border-gray-50 pb-5 relative z-10">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0"><User className="w-7 h-7" /></div>
          <div>
            <h3 className="font-bold text-lg md:text-xl text-gray-800 mb-1">{family.father?.fullName || 'غير مسجل'}</h3>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-bold text-xs px-3 py-1">بيانات الأب</Badge>
          </div>
        </div>
        <div className="space-y-3 text-sm relative z-10">
          {[
            { label: 'الرقم القومي', value: family.father?.nationalId, mono: true },
            { label: 'تاريخ الميلاد', value: family.father?.birthDate },
            { label: 'الجنس', value: family.father?.gender?.toLowerCase() === 'female' ? 'أنثى' : 'ذكر' },
            { label: 'المهنة', value: family.father?.job },
            { label: 'العنوان', value: family.father?.address },
            { label: 'الهاتف', value: family.father?.phone, mono: true },
            { label: 'البريد الإلكتروني', value: family.father?.email, mono: true },
          ].map((field, idx) => (
            <div key={idx} className={`flex justify-between items-center p-3 rounded-xl border border-transparent ${idx % 2 === 0 ? 'bg-gray-50 border-gray-100/50' : ''}`}>
              <span className="text-gray-500 font-bold text-xs shrink-0">{field.label}:</span>
              <span className={`${field.mono ? 'font-mono tracking-wider' : 'font-sans'} font-bold text-gray-800 text-sm text-left truncate pl-2 max-w-[60%]`}>{field.value || '---'}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Mother Card */}
      <Card className="p-6 md:p-8 bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow rounded-[2rem] overflow-hidden relative text-right">
        <div className="absolute top-0 left-0 w-32 h-32 bg-pink-50 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50 pointer-events-none"></div>
        <div className="flex items-start gap-4 mb-6 border-b border-gray-50 pb-5 relative z-10">
          <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 shadow-sm shrink-0"><User className="w-7 h-7" /></div>
          <div>
            <h3 className="font-bold text-lg md:text-xl text-gray-800 mb-1">{family.mother?.fullName || 'غير مسجل'}</h3>
            <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100 border-none font-bold text-xs px-3 py-1">بيانات الأم</Badge>
          </div>
        </div>
        <div className="space-y-3 text-sm relative z-10">
          {[
            { label: 'الرقم القومي', value: family.mother?.nationalId, mono: true },
            { label: 'تاريخ الميلاد', value: family.mother?.birthDate },
            { label: 'الجنس', value: family.mother?.gender?.toLowerCase() === 'male' ? 'ذكر' : 'أنثى' },
            { label: 'المهنة', value: family.mother?.job },
            { label: 'العنوان', value: family.mother?.address },
            { label: 'الهاتف', value: family.mother?.phone, mono: true },
            { label: 'البريد الإلكتروني', value: family.mother?.email, mono: true },
          ].map((field, idx) => (
            <div key={idx} className={`flex justify-between items-center p-3 rounded-xl border border-transparent ${idx % 2 === 0 ? 'bg-pink-50/30 border-pink-100/30' : ''}`}>
              <span className="text-gray-500 font-bold text-xs shrink-0">{field.label}:</span>
              <span className={`${field.mono ? 'font-mono tracking-wider' : 'font-sans'} font-bold text-gray-800 text-sm text-left truncate pl-2 max-w-[60%]`}>{field.value || '---'}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}