import { useState, useEffect } from 'react';
import api, { courtAPI } from '../../../../../services/api'; 
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '../../../../../utils/errorHandler';

export const useViolations = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedParentNationalId, setSelectedParentNationalId] = useState('');

  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [stats, setStats] = useState({
    pending: 0,
    underReview: 0,
    resolved: 0
  });

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const params = {
        PageNumber: 1,
        PageSize: 50
      };

      if (statusFilter !== 'all') {
        params.Status = statusFilter;
      }
      if (typeFilter !== 'all') {
        params.ViolationType = typeFilter;
      }

      const res = await api.get('/api/court-staff/me/violation-alerts', { params });
      
      setStats({
        pending: res.data.pendingCount || 0,
        underReview: res.data.underReviewCount || 0,
        resolved: res.data.resolvedCount || 0
      });

      // ✅ التعديل هنا: محاولة التقاط الـ ID بأي اسم جاي من الـ Swagger
      const mappedViolations = res.data.alerts.items.map(v => ({
        id: v.id || v.alertId || v.violationId || v.violationAlertId, 
        courtId: v.courtId,
        parentId: v.parentId,
        parentName: v.parentName || 'غير متوفر',
        relatedEntityId: v.relatedEntityId,
        type: v.violationType, 
        description: v.description,
        triggeredAt: v.triggeredAt ? v.triggeredAt.split('T')[0] : 'غير متوفر',
        status: v.status,
        resolvedAt: v.resolvedAt ? v.resolvedAt.split('T')[0] : null,
        resolutionNotes: v.resolutionNotes
      }));

      setViolations(mappedViolations);
    } catch (error) {
      console.error("Error fetching violations:", error);
      toast.error(getErrorMessage(error) || 'فشل تحميل قائمة المخالفات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations();
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsPageLoaded(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    const fetchParentNationalId = async () => {
      if (selectedViolation?.parentId) {
        try {
          const res = await courtAPI.getParent(selectedViolation.parentId);
          setSelectedParentNationalId(res.data?.nationalId || 'غير متوفر');
        } catch (error) {
          console.error("Error fetching parent nationalId:", error);
          setSelectedParentNationalId('غير متوفر');
        }
      } else {
        setSelectedParentNationalId('');
      }
    };
    fetchParentNationalId();
  }, [selectedViolation]);

  const updateViolationStatus = async (status) => {
    if (!selectedViolation || (status === 'Resolved' && !actionNotes.trim())) {
      toast.error(status === 'Resolved' ? 'يرجى تقديم ملاحظات الحل قبل الإغلاق.' : 'بيانات المخالفة مفقودة');
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        status: status, 
        resolutionNotes: actionNotes.trim() || (status === 'UnderReview' ? 'جاري مراجعة المخالفة والتواصل مع الطرف المعني.' : '')
      };

      await api.patch(`/api/violation-alerts/${selectedViolation.id}/status`, payload);

      toast.success(`تم تحديث حالة المخالفة بنجاح إلى ${status === 'UnderReview' ? 'قيد المراجعة' : 'تم الحل'}`);

      await fetchViolations();
      setSelectedViolation(null);
      setActionNotes('');
    } catch (error) {
      console.error('Error updating violation status:', error);
      toast.error(getErrorMessage(error) || 'فشل معالجة الإجراء');
    } finally {
      setActionLoading(false);
    }
  };

  return {
    state: {
      isPageLoaded, selectedViolation, actionNotes, statusFilter, typeFilter,
      selectedParentNationalId, violations, loading, actionLoading, stats
    },
    actions: {
      setSelectedViolation, setActionNotes, setStatusFilter, setTypeFilter, updateViolationStatus
    }
  };
};