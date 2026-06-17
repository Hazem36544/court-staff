import React from 'react';
import { Users, Plus, Baby, School, Trash2 } from 'lucide-react';
import { Card } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import { calculateAge } from './FamilyHelpers';

export default function ChildrenSection({ children, schoolMap, isSettlementSpecialist, setShowChildModal, setDeleteChildModal }) {
  return (
    <Card className="p-6 md:p-8 bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-[2rem] text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-50">
        <h3 className="font-bold text-xl flex items-center gap-2 text-gray-800">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
             <Users className="w-5 h-5 text-blue-600" />
          </div>
          الأبناء المسجلين
          <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-none mr-2">{children?.length || 0}</Badge>
        </h3>
        {isSettlementSpecialist && (
          <Button onClick={() => setShowChildModal(true)} className="bg-green-600 text-white px-5 py-5 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-sm outline-none border-none w-full sm:w-auto cursor-pointer">
            <Plus className="w-5 h-5" /> إضافة طفل جديد
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {children?.length > 0 ? children.map((child, index) => (
          <div key={index} className="p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100 flex items-start justify-between group hover:shadow-md transition-all relative overflow-hidden">
            <div className="flex items-start gap-4 z-10 relative w-full">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm shrink-0 ${child.gender?.toLowerCase() === 'female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                {child.gender?.toLowerCase() === 'female' ? 'أنثى' : 'ذكر'}
              </div>
              <div className="pt-1 flex-1 min-w-0">
                <p className="text-base font-bold text-gray-800 mb-1 truncate">{child.fullName}</p>
                <p className="text-xs text-gray-500 font-bold mb-2">{calculateAge(child.birthDate)} • {child.gender?.toLowerCase() === 'female' ? 'أنثى' : 'ذكر'}</p>
                {child.schoolId && schoolMap[child.schoolId] && (
                  <div className="flex items-center gap-1.5 text-[11px] text-blue-700 mt-1.5 font-bold bg-blue-50 w-fit px-2.5 py-1 rounded-lg border border-blue-100 shadow-sm max-w-full">
                    <School className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{schoolMap[child.schoolId].name}</span>
                  </div>
                )}
              </div>
            </div>
            {isSettlementSpecialist && (
              <button
                onClick={() => setDeleteChildModal({ show: true, childId: child.id, childName: child.fullName })}
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all sm:opacity-0 group-hover:opacity-100 border-none outline-none z-10 relative bg-white sm:bg-transparent shadow-sm sm:shadow-none cursor-pointer shrink-0"
                title="حذف الطفل"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        )) : (
          <div className="col-span-full text-center py-12 text-gray-400 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-bold text-gray-500">لم يتم العثور على بيانات أطفال.</p>
          </div>
        )}
      </div>
    </Card>
  );
}