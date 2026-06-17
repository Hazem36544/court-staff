import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api, { commonAPI } from '../../../../services/api';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '../../../../utils/errorHandler';

import { translateStatus } from './components/ComplaintsHelpers';
import ComplaintsHeader from './components/ComplaintsHeader';
import ComplaintsStats from './components/ComplaintsStats';
import ComplaintsFilter from './components/ComplaintsFilter';
import ComplaintsList from './components/ComplaintsList';
import ComplaintDetailsModal from './components/ComplaintDetailsModal';

export function ComplaintsManagement({ onNavigate, onBack }) {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState('');

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [counts, setCounts] = useState({ pending: 0, resolved: 0, underReview: 0, rejected: 0 });

  const [documentDetails, setDocumentDetails] = useState(null);
  const [documentLoading, setDocumentLoading] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = { PageNumber: 1, PageSize: 50 };
      if (statusFilter !== 'all') params.Status = statusFilter; 

      const res = await api.get('/api/court-staff/me/complaints', { params });
      
      const responseData = res.data || {};
      const rawData = responseData.complaints?.items || [];
      
      setCounts({
        pending: responseData.pendingCount || 0,
        underReview: responseData.underReviewCount || 0,
        resolved: responseData.resolvedCount || 0,
        rejected: responseData.rejectedCount || 0 
      });

      const mappedComplaints = rawData.map(item => ({
        id: item.id,
        complaintNumber: item.id.substring(0, 8).toUpperCase(),
        parentId: item.reporterId,
        documentId: item.documentId || null,
        parentName: item.reporterName || 'غير متوفر',
        type: item.type || 'عامة',
        subject: item.type || 'شكوى من ولي أمر',
        description: item.description || '',
        submissionDate: item.filedAt ? item.filedAt.split('T')[0] : new Date().toISOString().split('T')[0],
        status: translateStatus(item.status),
        rawStatus: item.status,
        response: item.resolutionNotes || item.notes || '',
        responseDate: item.resolvedAt ? item.resolvedAt.split('T')[0] : (item.rejectedAt ? item.rejectedAt.split('T')[0] : null)
      }));

      setComplaints(mappedComplaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error(getErrorMessage(error) || "فشل جلب الشكاوى");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, [statusFilter]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsPageLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (selectedComplaint && selectedComplaint.documentId) {
      fetchDocumentDetails(selectedComplaint.documentId);
    } else {
      setDocumentDetails(null);
    }
  }, [selectedComplaint]);

  const fetchDocumentDetails = async (docId) => {
    setDocumentLoading(true); setDocumentDetails(null);
    try {
      const res = await commonAPI.getDocument(docId);
      setDocumentDetails(res.data);
    } catch (err) {
      console.error('Failed to fetch document', err);
      toast.error('فشل تحميل المستند المرفق');
    } finally {
      setDocumentLoading(false);
    }
  };

  const handleDownloadDocument = () => {
    if (!documentDetails) return;
    if (documentDetails.downloadUrl) {
      window.open(documentDetails.downloadUrl, '_blank');
    } else if (documentDetails.url || documentDetails.fileUrl) {
      window.open(documentDetails.url || documentDetails.fileUrl, '_blank');
    } else {
      const fallbackUrl = `${import.meta.env.VITE_API_URL || ''}/api/documents/${selectedComplaint.documentId}`;
      window.open(fallbackUrl, '_blank');
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (selectedComplaint && response.trim()) {
      setActionLoading(true);
      try {
        await api.patch(`/api/complaints/${selectedComplaint.id}/status`, {
          status: newStatus,
          resolutionNotes: response
        });
        toast.success(newStatus === 'Resolved' ? 'تم حل واعتماد الشكوى بنجاح' : 'تم رفض وإعادة الشكوى');
        await fetchComplaints();
        setSelectedComplaint(null);
        setResponse('');
      } catch (error) {
        console.error(error);
        toast.error(getErrorMessage(error) || 'فشل تحديث الحالة');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleUnderReview = async () => {
    if (selectedComplaint) {
      setActionLoading(true);
      try {
        await api.patch(`/api/complaints/${selectedComplaint.id}/status`, {
          status: 'UnderReview', 
          resolutionNotes: 'جاري مراجعة الشكوى من قبل مراقب الالتزام'
        });
        toast.success('تم تحويل الشكوى لقيد المراجعة');
        await fetchComplaints();
        setSelectedComplaint(null);
      } catch (error) {
        console.error(error);
        toast.error(getErrorMessage(error) || 'فشل بدء المراجعة');
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[80vh] font-sans" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-[#1e3a8a] mb-4" />
        <span className="text-[#1e3a8a] font-bold text-lg">جاري تحميل سجل الشكاوى...</span>
      </div>
    );
  }

  return (
    <div className="w-full font-sans" dir="rtl">
      <div className={`transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 pb-10 px-4 md:px-0">
          
          <ComplaintsHeader onBack={onBack} />
          
          <ComplaintsStats counts={counts} />
          
          <ComplaintsFilter 
            statusFilter={statusFilter} 
            setStatusFilter={setStatusFilter} 
          />
          
          <ComplaintsList 
            complaints={complaints} 
            setSelectedComplaint={setSelectedComplaint} 
          />

        </div>
      </div>

      <ComplaintDetailsModal 
        selectedComplaint={selectedComplaint} 
        setSelectedComplaint={setSelectedComplaint}
        documentLoading={documentLoading} 
        documentDetails={documentDetails}
        handleDownloadDocument={handleDownloadDocument} 
        fetchDocumentDetails={fetchDocumentDetails}
        response={response} 
        setResponse={setResponse}
        actionLoading={actionLoading} 
        handleUpdateStatus={handleUpdateStatus} 
        handleUnderReview={handleUnderReview}
      />
    </div>
  );
}