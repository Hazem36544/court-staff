import React from 'react';
import { Loader2 } from 'lucide-react';
import { useViolations } from './components/useViolations';
import { ViolationsHeader } from './components/ViolationsHeader';
import { ViolationsStats } from './components/ViolationsStats';
import { ViolationsFilter } from './components/ViolationsFilter';
import { ViolationsList } from './components/ViolationsList';
import { ViolationDetailsModal } from './components/ViolationDetailsModal';

export function ViolationsScreen({ onBack, userRole }) {
  const { state, actions } = useViolations();

  if (state.loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[80vh] font-sans" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-[#1e3a8a] mb-4" />
        <span className="text-[#1e3a8a] font-bold text-lg">جاري تحميل سجل المخالفات...</span>
      </div>
    );
  }

  return (
    <div className="w-full font-sans" dir="rtl">
      <div className={`transition-all duration-500 ease-out transform ${state.isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 pb-10 px-4 md:px-0">

          <ViolationsHeader onBack={onBack} />

          <ViolationsStats stats={state.stats} />

          <ViolationsFilter 
            statusFilter={state.statusFilter}
            setStatusFilter={actions.setStatusFilter}
            typeFilter={state.typeFilter}
            setTypeFilter={actions.setTypeFilter}
          />

          <ViolationsList 
            violations={state.violations}
            setSelectedViolation={actions.setSelectedViolation}
          />

        </div>
      </div>

      <ViolationDetailsModal 
        selectedViolation={state.selectedViolation}
        setSelectedViolation={actions.setSelectedViolation}
        selectedParentNationalId={state.selectedParentNationalId}
        actionNotes={state.actionNotes}
        setActionNotes={actions.setActionNotes}
        actionLoading={state.actionLoading}
        updateViolationStatus={actions.updateViolationStatus}
      />
    </div>
  );
}