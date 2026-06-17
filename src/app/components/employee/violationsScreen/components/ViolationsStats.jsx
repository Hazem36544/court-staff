import React from 'react';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '../../../ui/card';

export function ViolationsStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="p-4 bg-white border-orange-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow rounded-[1.5rem]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-bold mb-1">قيد الانتظار</p>
            <p className="text-2xl font-black text-orange-600 font-mono">{stats.pending}</p>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center"><Clock className="w-6 h-6 text-orange-500" /></div>
        </div>
      </Card>
      <Card className="p-4 bg-white border-blue-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow rounded-[1.5rem]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-bold mb-1">قيد المراجعة</p>
            <p className="text-2xl font-black text-blue-600 font-mono">{stats.underReview}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center"><AlertCircle className="w-6 h-6 text-blue-500" /></div>
        </div>
      </Card>
      <Card className="p-4 bg-white border-green-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow rounded-[1.5rem]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-bold mb-1">تم الحل</p>
            <p className="text-2xl font-black text-green-600 font-mono">{stats.resolved}</p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-500" /></div>
        </div>
      </Card>
    </div>
  );
}