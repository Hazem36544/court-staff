import { useState, useEffect } from 'react';
import api from '../../../../../services/api';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '../../../../../utils/errorHandler';

export const useCasesManagement = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // States للبحث والبيانات
  const [searchTerm, setSearchTerm] = useState('');
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  
  // States للتحميل والـ Pagination
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);

  // تشغيل الأنيميشن عند فتح الصفحة
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // دالة جلب القضايا
  const fetchCases = async () => {
    setLoading(true); 
    try {
      const params = {
        PageNumber: 1,
        PageSize: 1000 // جلب جميع القضايا الموكلة للموظف
      };

      const res = await api.get('/api/court-staff/me/court-cases', { params });
      
      const casesDataRaw = res.data.items || [];

      const formattedCases = casesDataRaw.map(c => ({
        id: c.id,
        familyId: c.familyId,
        caseNumber: c.caseNumber || 'غير محدد',
        status: c.status,
        filedAt: c.filedAt ? new Date(c.filedAt).toLocaleDateString('ar-EG') : 'غير معروف',
        decisionSummary: c.decisionSummary || 'لا يوجد ملخص متاح'
      }));

      setCases(formattedCases);
      setFilteredCases(formattedCases);
    } catch (err) {
      console.error("Error fetching cases:", err);
      toast.error(getErrorMessage(err) || "حدث خطأ أثناء جلب القضايا");
    } finally {
      setLoading(false);
    }
  };

  // جلب القضايا تلقائياً أول ما الصفحة تفتح
  useEffect(() => {
    fetchCases();
  }, []);

  // البحث اللحظي (Real-time Filtering)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCases(cases);
    } else {
      const term = searchTerm.toLowerCase().trim();
      setFilteredCases(cases.filter(c => c.caseNumber?.toLowerCase().includes(term)));
    }
    // تصفير الـ Pagination عند كل عملية بحث جديدة
    setVisibleCount(9);
  }, [searchTerm, cases]);

  // عند الضغط على زر X لتفريغ البحث
  const clearSearch = () => {
    setSearchTerm('');
    setVisibleCount(9);
  };

  // دالة التحكم في الإدخال لمنع الحروف والتنبيه
  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (/[^\d]/.test(val)) {
      toast.error('يرجى إدخال أرقام فقط للبحث عن القضية', { id: 'num-only-search' });
      return;
    }
    setSearchTerm(val);
  };

  // دالة عرض المزيد
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  return {
    state: {
      isPageLoaded, searchTerm, cases, filteredCases, loading, visibleCount
    },
    actions: {
      clearSearch, handleSearchChange, handleLoadMore
    }
  };
};