import React from 'react';
import { ChevronRight, Users, ShieldCheck, AlertTriangle, CheckCircle2, RotateCcw, Briefcase, Loader2 } from 'lucide-react';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';

export default function FamilyHeader({ data, onBack, isSettlementSpecialist, isPending, isSettled, isEscalated, setShowSettleModal, setShowCaseModal, handleReturnToDispute, isReturning, cases }) {
  return (
    <div className="relative w-full bg-[#1e3a8a] rounded-[2rem] p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-xl gap-6">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

      <div className="flex items-center gap-4 md:gap-5 relative z-10 w-full md:w-auto text-right">
        <button onClick={onBack} className="bg-white/10 p-2.5 md:p-3 rounded-xl hover:bg-white/20 transition-all border-none outline-none group shrink-0 cursor-pointer">
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:-translate-x-1 transition-transform" />
        </button>

        <div>
          <h1 className="text-xl md:text-2xl font-bold mb-1">
              ملف العائلة: {data.family.father?.fullName?.split(' ')[0] || '---'} و {data.family.mother?.fullName?.split(' ')[0] || '---'}
          </h1>
          <div className="flex items-center gap-4 text-blue-200 text-sm font-bold opacity-90 mt-1">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {data.family.children?.length || 0} أبناء مسجلين</span>
          </div>
        </div>
      </div>

      {isSettlementSpecialist && (
        <div className="hidden md:flex gap-3 relative z-10 items-center w-full md:w-auto">
          {isPending && (
            <>
              <Button onClick={() => setShowSettleModal(true)} className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl h-11 px-6 shadow-sm border-none transition-colors outline-none cursor-pointer flex-1 md:flex-none">
                <ShieldCheck className="w-4 h-4 ml-2" /> إتمام تسوية ودية
              </Button>
              <Button onClick={() => setShowCaseModal(true)} className="bg-white text-[#1e3a8a] hover:bg-blue-50 font-bold rounded-xl h-11 px-6 shadow-sm border-none transition-colors outline-none cursor-pointer flex-1 md:flex-none">
                <AlertTriangle className="w-4 h-4 ml-2" /> تصعيد لقضية
              </Button>
            </>
          )}
          {isSettled && (
            <>
              <Badge className="bg-green-100 text-green-700 font-bold px-4 py-2 text-sm border-none shadow-sm flex items-center justify-center gap-2 h-11 flex-1 md:flex-none">
                <CheckCircle2 className="w-4 h-4" /> تمت التسوية الودية
              </Badge>
              <Button onClick={handleReturnToDispute} disabled={isReturning} className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-11 px-6 shadow-sm border-none transition-colors outline-none cursor-pointer flex-1 md:flex-none">
                {isReturning ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <RotateCcw className="w-4 h-4 ml-2" />} إعادة فتح النزاع
              </Button>
            </>
          )}
          {isEscalated && (
            <Badge className="bg-blue-100 text-blue-700 font-bold px-4 py-2 text-sm border-none shadow-sm flex items-center justify-center gap-2 h-11 w-full md:w-auto">
              <Briefcase className="w-4 h-4" /> تم التصعيد للمحكمة
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}