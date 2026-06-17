import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api, { courtAPI, visitationAPI, lookupAPI, commonAPI } from '../../../../services/api';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '../../../../utils/errorHandler';

import CaseHeader from './components/CaseHeader';
import CaseSummaryCards from './components/CaseSummaryCards';
import CustodyCard from './components/CustodyCard';
import ScheduleCard from './components/ScheduleCard';
import AlimonyCard from './components/AlimonyCard';
import HistorySections from './components/HistorySections';
import CaseModals from './components/CaseModals';

export function CaseDetailsScreen({ caseData, onBack }) {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [showParentName, setShowParentName] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [data, setData] = useState({
    family: null, caseInfo: null, custody: null, schedule: null, alimony: null, visitations: [], paymentsDue: []
  });

  const [selectedPaymentDue, setSelectedPaymentDue] = useState(null);
  const [paymentAttempts, setPaymentAttempts] = useState([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);

  // States الخاصّة بنوافذ الإدارة والعرض
  const [showCustodyModal, setShowCustodyModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAlimonyModal, setShowAlimonyModal] = useState(false);
  const [showCloseCaseModal, setShowCloseCaseModal] = useState(false);
  const [showPaymentAttemptsModal, setShowPaymentAttemptsModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, type: '', id: '', title: '', subtitle: '' });
  
  // ✅ States الجديدة الخاصة بنافذة تفاصيل الزيارة
  const [showHistoryDetailsModal, setShowHistoryDetailsModal] = useState(false);
  const [selectedHistoryVisit, setSelectedHistoryVisit] = useState(null);

  const [locations, setLocations] = useState([]);
  const [locationCache, setLocationCache] = useState({});

  const [closureNotes, setClosureNotes] = useState('');
  const [isClosingCase, setIsClosingCase] = useState(false);
  const [custodyForm, setCustodyForm] = useState({ custodialParentId: '', startAt: '', endAt: '' });
  const [scheduleForm, setScheduleForm] = useState({ locationId: '', frequency: 'Weekly', startDate: '', endDate: '', startTime: '', endTime: '' });
  const [alimonyForm, setAlimonyForm] = useState({ amount: '', frequency: 'Monthly', startDate: '', endDate: '' });

  const getInitialIds = () => {
    const fId = caseData?.familyId; const cId = caseData?.caseId;
    if (fId && cId) {
      sessionStorage.setItem('wesal_current_case_family_id', fId);
      sessionStorage.setItem('wesal_current_case_id', cId);
      return { resolvedFamilyId: fId, resolvedCaseId: cId };
    }
    return {
      resolvedFamilyId: sessionStorage.getItem('wesal_current_case_family_id'),
      resolvedCaseId: sessionStorage.getItem('wesal_current_case_id')
    };
  };

  const { resolvedFamilyId: familyId, resolvedCaseId: caseId } = getInitialIds();

  const fetchData = async () => {
    if (!caseId || !familyId) return;
    setLoading(true);
    try {
      const [familyRes, caseRes, custodyRes, scheduleRes, alimonyRes, visitRes] = await Promise.allSettled([
        courtAPI.getFamily(familyId),
        courtAPI.getCaseByFamily(familyId),
        courtAPI.getCustodyByCourtCase(caseId),
        courtAPI.getVisitationScheduleByCourtCase(caseId),
        api.get(`/api/court-cases/${caseId}/alimonySchedule-schedule`),
        visitationAPI.list({ FamilyId: familyId, PageNumber: 1, PageSize: 50 })
      ]);

      const newData = { family: null, caseInfo: null, custody: null, schedule: null, alimony: null, visitations: [], paymentsDue: [] };

      if (familyRes.status === 'fulfilled') newData.family = familyRes.value.data;

      if (caseRes.status === 'fulfilled') {
        const cData = caseRes.value.data;
        if (Array.isArray(cData)) newData.caseInfo = cData.find(c => c.id === caseId) || cData[0];
        else if (cData?.items) newData.caseInfo = cData.items.find(c => c.id === caseId) || cData.items[0];
        else newData.caseInfo = cData;
      }

      if (custodyRes.status === 'fulfilled') newData.custody = custodyRes.value.data;
      if (scheduleRes.status === 'fulfilled') newData.schedule = scheduleRes.value.data;

      if (alimonyRes.status === 'fulfilled' && alimonyRes.value.data) {
        newData.alimony = { ...alimonyRes.value.data, amount: (alimonyRes.value.data.amount || 0) / 100 };
      }

      if (visitRes.status === 'fulfilled') {
        const vData = visitRes.value.data;
        newData.visitations = vData.items || (Array.isArray(vData) ? vData : []);
      }

      if (newData.alimony?.id) {
        try {
          const pdRes = await api.get(`/api/alimonySchedule-schedules/${newData.alimony.id}/alimonySchedule-dues`, {
            params: { alimonyId: newData.alimony.id, PageNumber: 1, PageSize: 50 }
          });
          newData.paymentsDue = (pdRes.data.items || (Array.isArray(pdRes.data) ? pdRes.data : [])).map(pd => ({ ...pd, amount: (pd.amount || 0) / 100 }));
        } catch (e) { console.warn("Failed to fetch payments due:", e); }
      }

      setData(newData);

      const locationIdsToResolve = new Set();
      if (newData.schedule?.visitCenterId) locationIdsToResolve.add(newData.schedule.visitCenterId);
      newData.visitations.forEach(v => { if (v.visitCenterId) locationIdsToResolve.add(v.visitCenterId); });

      const missingIds = Array.from(locationIdsToResolve).filter(id => id && !locationCache[id]);
      if (missingIds.length > 0) {
        const newResolved = { ...locationCache };
        await Promise.allSettled(missingIds.map(async id => {
          try {
            const res = await lookupAPI.getLocation(id);
            newResolved[id] = res.data.name;
          } catch (e) { newResolved[id] = 'Unknown Location'; }
        }));
        setLocationCache(newResolved);
      }
    } catch (err) {
      toast.error("حدث خطأ أثناء تحميل تفاصيل القضية.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [caseId, familyId]);

  useEffect(() => {
    if (!loading && data.caseInfo) {
      const timer = setTimeout(() => setIsPageLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [loading, data.caseInfo]);

  useEffect(() => {
    const fetchLocations = async () => {
      if (showScheduleModal && locations.length === 0) {
        try {
          const res = await lookupAPI.getVisitationLocations({ PageSize: 1000 });
          setLocations(res.data.items || (Array.isArray(res.data) ? res.data : []));
        } catch (e) { toast.error("فشل تحميل قائمة المواقع."); }
      }
    };
    fetchLocations();
  }, [showScheduleModal]);

  const handleFetchPaymentAttempts = async (pd) => {
    setSelectedPaymentDue(pd); setShowPaymentAttemptsModal(true); setLoadingAttempts(true);
    try {
      const res = await courtAPI.listPaymentsHistory(pd.id, { PageSize: 50 });
      setPaymentAttempts(res.data.items || []);
    } catch (e) { toast.error("فشل تحميل محاولات الدفع."); } 
    finally { setLoadingAttempts(false); }
  };

  const handleDownloadDocument = async (documentId) => {
    if (!documentId) return;
    try {
      toast.loading("جاري تحضير التحميل...", { id: 'downloading' });
      const res = await commonAPI.getDocument(documentId);
      const downloadUrl = res.data?.downloadUrl;
      if (downloadUrl) { window.open(downloadUrl, '_blank'); toast.success("جاري فتح المستند...", { id: 'downloading' }); } 
      else { const fallbackUrl = `${import.meta.env.VITE_API_URL}/api/documents/${documentId}`; window.open(fallbackUrl, '_blank'); toast.success("جاري فتح المستند...", { id: 'downloading' }); }
    } catch (e) { toast.error("فشل جلب المستند.", { id: 'downloading' }); console.error(e); }
  };

  const handleSaveCustody = async (e) => {
    e.preventDefault();
    if(!custodyForm.custodialParentId) { toast.error("يرجى تحديد الوالد الحاضن"); return; }
    try {
      if (data.custody?.id) {
        await courtAPI.updateCustody(data.custody.id, { newCustodialParentId: custodyForm.custodialParentId, startAt: new Date(custodyForm.startAt).toISOString(), endAt: custodyForm.endAt ? new Date(custodyForm.endAt).toISOString() : null });
      } else {
        await courtAPI.createCustody({ courtCaseId: caseId, custodialParentId: custodyForm.custodialParentId, startAt: new Date(custodyForm.startAt).toISOString(), endAt: custodyForm.endAt ? new Date(custodyForm.endAt).toISOString() : null });
      }
      toast.success("تم تحديث الحضانة بنجاح"); setShowCustodyModal(false); fetchData();
    } catch (e) { toast.error("فشل حفظ الحضانة"); }
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    if(!scheduleForm.locationId) { toast.error("يرجى تحديد موقع الرؤية"); return; }
    const formatTime = (t) => { if (!t) return t; const parts = t.split(':'); if (parts.length === 2) return `${t}:00`; return t; };
    const payload = { visitCenterId: scheduleForm.locationId, frequency: scheduleForm.frequency, startDate: scheduleForm.startDate, endDate: scheduleForm.endDate || null, startTime: formatTime(scheduleForm.startTime), endTime: formatTime(scheduleForm.endTime) };
    try {
      if (data.schedule?.id) await courtAPI.updateSchedule(data.schedule.id, { scheduleId: data.schedule.id, ...payload });
      else await courtAPI.createSchedule({ courtCaseId: caseId, ...payload });
      toast.success("تم حفظ الجدول بنجاح"); setShowScheduleModal(false); fetchData();
    } catch (e) { toast.error("فشل حفظ الجدول"); }
  };

  const handleSaveAlimony = async (e) => {
    e.preventDefault();
    const piastreAmount = Math.round(parseFloat(alimonyForm.amount) * 100);
    const payload = { ...alimonyForm, amount: piastreAmount };
    try {
      if (data.alimony?.id) {
        await api.put(`/api/alimonySchedule-schedules/${data.alimony.id}?alimoneyId=${data.alimony.id}`, payload);
      } else {
        await api.post('/api/alimonySchedule-schedules', { courtCaseId: caseId, ...payload });
      }
      toast.success("تم حفظ النفقة بنجاح"); setShowAlimonyModal(false); fetchData();
    } catch (e) { toast.error("فشل حفظ النفقة"); console.error(e); }
  };

  const handleCloseCase = async (e) => {
    e.preventDefault();
    if (!closureNotes.trim()) { toast.error("يرجى كتابة ملاحظات الإغلاق أولاً."); return; }
    setIsClosingCase(true);
    try {
      await courtAPI.closeCase(caseId, closureNotes);
      toast.success("تم إغلاق القضية بنجاح"); setShowCloseCaseModal(false); setClosureNotes(''); fetchData();
    } catch (e) { toast.error(e.message || "فشل إغلاق القضية"); } 
    finally { setIsClosingCase(false); }
  };

  const confirmDelete = async () => {
    const { type, id } = deleteModal;
    setDeleteModal({ show: false, type: '', id: '', title: '', subtitle: '' });
    if (type === 'custody') {
      try { await courtAPI.deleteCustody(id); toast.success("تم حذف الحضانة بنجاح"); } 
      catch (e) { toast.error("لا يمكن حذف الحضانة لوجود بيانات مرتبطة بها."); }
    } else if (type === 'schedule') {
      try { await courtAPI.deleteSchedule(id); toast.success("تم حذف الجدول بنجاح"); } 
      catch (e) { const errStr = getErrorMessage(e)?.toLowerCase() || ''; if (errStr.includes('legal evidence') || errStr.includes('completed')) toast.error("لا يمكن حذف الجدول لوجود زيارات مسجلة تعتبر دليلاً قانونياً."); else toast.error("فشل الحذف، قد تكون هناك بيانات مرتبطة."); }
    } else if (type === 'alimony') {
      try { 
          await api.delete(`/api/alimonySchedule-schedules/${id}?alimoneyId=${id}`); 
          toast.success("تم حذف قاعدة النفقة بنجاح"); 
      } 
      catch (e) { toast.error("عذراً، لا يمكن حذف النفقة لوجود مدفوعات مسجلة مرتبطة بها."); }
    }
    fetchData();
  };

  if (loading) return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[80vh] font-sans" dir="rtl">
      <Loader2 className="w-12 h-12 animate-spin text-[#1e3a8a] mb-4" />
      <span className="text-[#1e3a8a] font-bold text-lg">جاري تحميل تفاصيل القضية...</span>
    </div>
  );

  const father = data.family?.father;
  const mother = data.family?.mother;

  const custodyParentOptions = [
      { value: father?.id, label: `الأب: ${father?.fullName || ''}` },
      { value: mother?.id, label: `الأم: ${mother?.fullName || ''}` }
  ].filter(opt => opt.value);

  // ✅ استخراج أسماء الأطراف بذكاء لتمريرها لنافذة إثبات الحالة
  const custodialId = data.custody?.custodialParentId;
  let custodialName = 'الطرف الحاضن', nonCustodialName = 'الطرف غير الحاضن';
  let custodialNId = '', nonCustodialNId = '';
  
  if (father?.id && father.id === custodialId) {
    custodialName = father?.fullName || 'الأب';
    custodialNId = father?.nationalId || '';
    nonCustodialName = mother?.fullName || 'الأم';
    nonCustodialNId = mother?.nationalId || '';
  } else if (mother?.id && mother.id === custodialId) {
    custodialName = mother?.fullName || 'الأم';
    custodialNId = mother?.nationalId || '';
    nonCustodialName = father?.fullName || 'الأب';
    nonCustodialNId = father?.nationalId || '';
  }
  const parentNames = { custodial: custodialName, nonCustodial: nonCustodialName, custodialNId, nonCustodialNId };

  const locationOptions = locations.map(l => ({ value: l.id, label: l.name }));
  const frequencyOptions = [ { value: 'Daily', label: 'يومي' }, { value: 'Weekly', label: 'أسبوعي' }, { value: 'Monthly', label: 'شهري' }, { value: 'Yearly', label: 'سنوي' } ];

  return (
    <div className="w-full font-sans" dir="rtl">
      <div className={`transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 pb-10 px-4 md:px-0">

          <CaseHeader caseInfo={data.caseInfo} onBack={onBack} handleDownloadDocument={handleDownloadDocument} setShowCloseCaseModal={setShowCloseCaseModal} />

          <div className="flex flex-col gap-6 md:gap-8 w-full">
            <CaseSummaryCards caseInfo={data.caseInfo} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CustodyCard data={data} father={father} mother={mother} showParentName={showParentName} setShowParentName={setShowParentName} setCustodyForm={setCustodyForm} setShowCustodyModal={setShowCustodyModal} setDeleteModal={setDeleteModal} />
              <ScheduleCard data={data} locationCache={locationCache} setScheduleForm={setScheduleForm} setShowScheduleModal={setShowScheduleModal} setDeleteModal={setDeleteModal} />
              <AlimonyCard data={data} setAlimonyForm={setAlimonyForm} setShowAlimonyModal={setShowAlimonyModal} setDeleteModal={setDeleteModal} />
            </div>

            <HistorySections 
               visitations={data.visitations} 
               paymentsDue={data.paymentsDue} 
               locationCache={locationCache} 
               selectedPaymentDue={selectedPaymentDue} 
               handleFetchPaymentAttempts={handleFetchPaymentAttempts} 
               setSelectedHistoryVisit={setSelectedHistoryVisit}
               setShowHistoryDetailsModal={setShowHistoryDetailsModal}
            />
          </div>
        </div>
      </div>

      <CaseModals 
        showCustodyModal={showCustodyModal} setShowCustodyModal={setShowCustodyModal} handleSaveCustody={handleSaveCustody} custodyForm={custodyForm} setCustodyForm={setCustodyForm} custodyParentOptions={custodyParentOptions}
        showScheduleModal={showScheduleModal} setShowScheduleModal={setShowScheduleModal} handleSaveSchedule={handleSaveSchedule} scheduleForm={scheduleForm} setScheduleForm={setScheduleForm} locationOptions={locationOptions} frequencyOptions={frequencyOptions}
        showAlimonyModal={showAlimonyModal} setShowAlimonyModal={setShowAlimonyModal} handleSaveAlimony={handleSaveAlimony} alimonyForm={alimonyForm} setAlimonyForm={setAlimonyForm}
        showCloseCaseModal={showCloseCaseModal} setShowCloseCaseModal={setShowCloseCaseModal} handleCloseCase={handleCloseCase} closureNotes={closureNotes} setClosureNotes={setClosureNotes} isClosingCase={isClosingCase}
        deleteModal={deleteModal} setDeleteModal={setDeleteModal} confirmDelete={confirmDelete}
        showPaymentAttemptsModal={showPaymentAttemptsModal} setShowPaymentAttemptsModal={setShowPaymentAttemptsModal} selectedPaymentDue={selectedPaymentDue} setSelectedPaymentDue={setSelectedPaymentDue} loadingAttempts={loadingAttempts} paymentAttempts={paymentAttempts}
        showHistoryDetailsModal={showHistoryDetailsModal} setShowHistoryDetailsModal={setShowHistoryDetailsModal} selectedHistoryVisit={selectedHistoryVisit} locationCache={locationCache} parentNames={parentNames}
      />
    </div>
  );
}