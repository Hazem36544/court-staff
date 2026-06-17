import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { requestsAPI } from '../../../../services/api';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '../../../../utils/errorHandler';

// استيراد المكونات
import { translateStatus } from './components/RequestsHelpers';
import RequestsHeader from './components/RequestsHeader';
import RequestsStats from './components/RequestsStats';
import RequestsFilter from './components/RequestsFilter';
import RequestsList from './components/RequestsList';
import RequestDetailsModal from './components/RequestDetailsModal';

export function DataChangeRequestsScreen({ onNavigate, onBack }) {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [requests, setRequests] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = { PageNumber: 1, PageSize: 50 };
      if (statusFilter !== 'all') params.Status = statusFilter;

      const res = await requestsAPI.list(params);
      const rawData = res.data?.requests?.items || [];

      setCounts({
        pending: res.data?.pendingCount || 0,
        approved: res.data?.approvedCount || 0,
        rejected: res.data?.rejectedCount || 0
      });

      const mappedRequests = rawData.map(item => ({
        id: item.id,
        parentName: item.fatherName || item.motherName || 'غير متوفر',
        parentType: item.fatherName ? 'father' : 'mother',
        requestDate: item.requestedAt ? item.requestedAt.split('T')[0] : new Date().toISOString().split('T')[0],
        status: translateStatus(item.status),
        rawStatus: item.status,
        startDate: item.startDate,
        endDate: item.endDate,
        reason: item.reason || 'لم يتم تسجيل أسباب',
        decisionNote: item.reasonNote || item.decisionNote || '',
        processedAt: item.respondedAt ? item.respondedAt.split('T')[0] : null
      }));

      setRequests(mappedRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error(getErrorMessage(error) || 'فشل تحميل قائمة الطلبات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsPageLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = (request.parentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[80vh] font-sans" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-[#1e3a8a] mb-4" />
        <span className="text-[#1e3a8a] font-bold text-lg">جاري تحميل سجل الطلبات...</span>
      </div>
    );
  }

  return (
    <div className="w-full font-sans" dir="rtl">
      <div className={`transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 pb-10 px-4 md:px-0">
          
          <RequestsHeader onBack={onBack} />
          
          <RequestsStats counts={counts} />
          
          <RequestsFilter 
            statusFilter={statusFilter} 
            setStatusFilter={setStatusFilter} 
          />
          
          <RequestsList 
            filteredRequests={filteredRequests} 
            setSelectedRequest={setSelectedRequest} 
          />
          
        </div>
      </div>

      <RequestDetailsModal 
        selectedRequest={selectedRequest} 
        setSelectedRequest={setSelectedRequest} 
      />
    </div>
  );
}