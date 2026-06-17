import React from 'react';
import { Filter } from 'lucide-react';
import { CustomSelect } from './CustomSelect';

const statusOptions = [
  { value: 'all', label: 'جميع الحالات' },
  { value: 'Pending', label: 'قيد الانتظار' },
  { value: 'UnderReview', label: 'قيد المراجعة' },
  { value: 'Resolved', label: 'تم الحل' }
];

const typeOptions = [
  { value: 'all', label: 'جميع أنواع المخالفات' },
  { value: 'MissedVisit', label: 'زيارة فائتة' },
  { value: 'OverstayedVisit', label: 'تجاوز وقت الزيارة' },
  { value: 'UnpaidAlimony', label: 'نفقة غير مدفوعة' },
  { value: 'CustodyBreach', label: 'مخالفة شروط الحضانة' }
];

export function ViolationsFilter({ statusFilter, setStatusFilter, typeFilter, setTypeFilter }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col md:flex-row items-center gap-4 w-full">
        <div className="flex items-center gap-2 w-full md:w-auto px-2">
          <Filter className="w-5 h-5 text-[#1e3a8a]" />
          <span className="text-sm font-bold text-gray-700 whitespace-nowrap">تصفية حسب:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full flex-1">
          <CustomSelect
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={statusOptions}
          />
          <CustomSelect
            value={typeFilter}
            onChange={(val) => setTypeFilter(val)}
            options={typeOptions}
          />
        </div>
      </div>
    </div>
  );
}