import React from 'react';
import { Filter } from 'lucide-react';
import CustomSelect from './CustomSelect';
import { statusOptions } from './RequestsHelpers';

export default function RequestsFilter({ statusFilter, setStatusFilter }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative z-20">
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <div className="flex items-center gap-2 w-full md:w-auto px-2">
          <Filter className="w-5 h-5 text-[#1e3a8a]" />
          <span className="text-sm font-bold text-gray-700 whitespace-nowrap">تصفية السجل:</span>
        </div>
        <div className="w-full md:w-56 relative z-50">
          <CustomSelect
            options={statusOptions}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            placeholder="اختر الحالة"
            hasSearch={false}
          />
        </div>
      </div>
    </div>
  );
}