import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../../../../services/api';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '../../../../utils/errorHandler';

// استيراد المكونات الفرعية
import FamiliesHeader from './components/FamiliesHeader';
import FamiliesSearchStats from './components/FamiliesSearchStats';
import FamiliesEmptyStates from './components/FamiliesEmptyStates';
import FamiliesGrid from './components/FamiliesGrid';

export function FamiliesManagement({ onNavigate, onBack }) {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [families, setFamilies] = useState([]);
  const [filteredFamilies, setFilteredFamilies] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [visibleCount, setVisibleCount] = useState(9);

  const fetchFamilies = async () => {
    setLoading(true);
    try {
      const params = { PageSize: 1000, PageNumber: 1 }; 
      const response = await api.get('/api/courts/me/families', { params });

      setTotalCount(response.data.totalCount || 0);
      const familiesData = response.data.items || [];

      const formattedFamilies = familiesData.map(family => ({
        id: family.familyId,
        displayId: family.familyId.substring(0, 8).toUpperCase(),
        fatherName: family.father?.fullName || 'غير مسجل',
        fatherNationalId: family.father?.nationalId || '',
        motherName: family.mother?.fullName || 'غير مسجل',
        motherNationalId: family.mother?.nationalId || '',
        children: family.children?.length || 0
      }));
      setFamilies(formattedFamilies);
      setFilteredFamilies(formattedFamilies);
    } catch (err) {
      console.error("Error fetching families:", err);
      toast.error(getErrorMessage(err) || "فشل تحميل قائمة العائلات");
      setFamilies([]);
      setFilteredFamilies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFamilies(); }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsPageLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFamilies(families);
    } else {
      const term = searchTerm.trim();
      setFilteredFamilies(families.filter(f => 
        (f.fatherNationalId && f.fatherNationalId.includes(term)) || 
        (f.motherNationalId && f.motherNationalId.includes(term)) ||
        (f.displayId && f.displayId.includes(term))
      ));
    }
    setVisibleCount(9);
  }, [searchTerm, families]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (/[^\d]/.test(val)) {
      toast.error('يرجى إدخال أرقام فقط للبحث بالرقم القومي', { id: 'num-only-search' });
      return;
    }
    if (val.length > 14) return;
    setSearchTerm(val);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setVisibleCount(9);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[80vh] font-sans" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-[#1e3a8a] mb-4" />
        <span className="text-[#1e3a8a] font-bold text-lg">جاري تحميل سجل العائلات...</span>
      </div>
    );
  }

  return (
    <div className="w-full font-sans" dir="rtl">
      <div className={`transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 pb-10 px-4 md:px-0">

          <FamiliesHeader onBack={onBack} />

          <FamiliesSearchStats 
            totalCount={totalCount} 
            searchTerm={searchTerm} 
            handleSearchChange={handleSearchChange} 
            clearSearch={clearSearch} 
            onNavigate={onNavigate} 
          />

          {families.length === 0 ? (
            <FamiliesEmptyStates type="no-data" />
          ) : filteredFamilies.length === 0 ? (
            <FamiliesEmptyStates type="no-results" searchTerm={searchTerm} clearSearch={clearSearch} />
          ) : (
            <FamiliesGrid 
              filteredFamilies={filteredFamilies} 
              visibleCount={visibleCount} 
              onNavigate={onNavigate} 
              handleLoadMore={handleLoadMore} 
            />
          )}

        </div>
      </div>
    </div>
  );
}