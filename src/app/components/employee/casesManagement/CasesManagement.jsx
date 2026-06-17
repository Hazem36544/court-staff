import React from 'react';

// استيراد المكونات
import { CasesHeader } from './components/CasesHeader';
import { CasesSearchFilter } from './components/CasesSearchFilter';
import { CasesGrid } from './components/CasesGrid';

// استيراد اللوجيك
import { useCasesManagement } from './components/useCasesManagement';

export function CasesManagement({ onNavigate, onBack }) {
  // فصلنا اللوجيك بالكامل هنا
  const { state, actions } = useCasesManagement();

  return (
    <div className="w-full font-sans" dir="rtl">
      <div className={`transition-all duration-500 ease-out transform ${state.isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 pb-10 px-4 md:px-0">

          <CasesHeader onBack={onBack} />

          <CasesSearchFilter 
            casesCount={state.cases.length}
            searchTerm={state.searchTerm}
            handleSearchChange={actions.handleSearchChange}
            clearSearch={actions.clearSearch}
          />

          <CasesGrid 
            loading={state.loading}
            casesLength={state.cases.length}
            filteredCases={state.filteredCases}
            visibleCount={state.visibleCount}
            searchTerm={state.searchTerm}
            clearSearch={actions.clearSearch}
            handleLoadMore={actions.handleLoadMore}
            onNavigate={onNavigate}
          />

        </div>
      </div>
    </div>
  );
}