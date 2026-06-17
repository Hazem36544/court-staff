import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import api, { courtAPI, schoolAPI, commonAPI } from '../../../../services/api';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '../../../../utils/errorHandler';

import FamilyHeader from './components/FamilyHeader';
import ParentsCards from './components/ParentsCards';
import ChildrenSection from './components/ChildrenSection';
import CasesSection from './components/CasesSection';
import FamilyModals from './components/FamilyModals';

export function FamilyDetailsScreen({ familyId, onBack, userRole }) {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const isSettlementSpecialist = userRole === 'SettlementSpecialist' || userRole === 'employee';

  const getInitialId = () => {
    let extractedId = typeof familyId === 'object' ? (familyId?.familyId || familyId?.id) : familyId;
    if (extractedId) { sessionStorage.setItem('wesal_current_family_id', extractedId); return extractedId; }
    return sessionStorage.getItem('wesal_current_family_id');
  };
  const currentFamilyId = getInitialId();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ family: null });
  const [cases, setCases] = useState([]);
  const [schoolMap, setSchoolMap] = useState({});

  const [showCaseModal, setShowCaseModal] = useState(false);
  const [isSubmittingCase, setIsSubmittingCase] = useState(false);
  const [caseForm, setCaseForm] = useState({ caseNumber: '', decisionSummary: '', documentId: null });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const [showSettleModal, setShowSettleModal] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  const [showChildModal, setShowChildModal] = useState(false);
  const [isSubmittingChild, setIsSubmittingChild] = useState(false);
  const [childForm, setChildForm] = useState({ fullName: '', birthDate: '', gender: 'Male', schoolId: '' });
  
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState('');
  const [showSchoolResults, setShowSchoolResults] = useState(false);
  const [selectedSchoolName, setSelectedSchoolName] = useState('');

  const [deleteChildModal, setDeleteChildModal] = useState({ show: false, childId: null, childName: '' });
  const [showParentName, setShowParentName] = useState(false);

  const fetchFullData = async () => {
    if (!currentFamilyId) { setLoading(false); return; }
    setLoading(true);
    try {
      const [familyRes, casesRes, schoolsRes] = await Promise.allSettled([
        courtAPI.getFamily(currentFamilyId),
        courtAPI.getCaseByFamily(currentFamilyId),
        schoolAPI.listSchools({ pageSize: 1000 })
      ]);
      if (familyRes.status === 'rejected') throw new Error("Failed to load family data");
      setData({ family: familyRes.value.data });
      if (casesRes.status === 'fulfilled') setCases(casesRes.value.data.items || (Array.isArray(casesRes.value.data) ? casesRes.value.data : []));
      if (schoolsRes.status === 'fulfilled') {
        const map = {}; (schoolsRes.value.data.items || []).forEach(s => map[s.id] = s); setSchoolMap(map);
      }
    } catch (err) { toast.error("حدث خطأ أثناء تحميل تفاصيل العائلة."); console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFullData(); }, [currentFamilyId]);
  useEffect(() => { if (!loading && data.family) { const timer = setTimeout(() => setIsPageLoaded(true), 50); return () => clearTimeout(timer); } }, [loading, data.family]);

  const fetchSchools = async (search = '') => {
    setLoadingSchools(true);
    try { const res = await schoolAPI.listSchools({ Name: search, pageSize: 50 }); setSchools(res.data.items || []); } 
    catch (error) { console.error("Failed to fetch schools", error); } 
    finally { setLoadingSchools(false); }
  };
  useEffect(() => { if (!showSchoolResults) return; const timer = setTimeout(() => fetchSchools(schoolSearch), 500); return () => clearTimeout(timer); }, [schoolSearch, showSchoolResults]);

  const handleChildNameChange = (e) => {
    const val = e.target.value; const childWords = val.split(' '); const fatherFullName = data.family?.father?.fullName || '';
    if (childWords.length === 2 && childWords[1] === '' && fatherFullName.trim()) {
      const fatherWords = fatherFullName.trim().split(/\s+/);
      if (fatherWords.length >= 3) { setChildForm({ ...childForm, fullName: `${childWords[0]} ${fatherWords.slice(0, 3).join(' ')}` }); return; }
    }
    setChildForm({ ...childForm, fullName: val });
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    if (childForm.fullName.trim().split(/\s+/).length < 4) { toast.error("اسم الطفل يجب أن يكون رباعياً بالكامل."); return; }
    if (!childForm.fullName || !childForm.birthDate) { toast.error("يرجى ملء جميع الحقول المطلوبة."); return; }
    setIsSubmittingChild(true);
    try {
      const payload = { fullName: childForm.fullName.trim(), birthDate: childForm.birthDate, gender: childForm.gender };
      if (childForm.schoolId) payload.schoolId = childForm.schoolId;
      await courtAPI.addChild(currentFamilyId, payload);
      toast.success("تم إضافة الطفل بنجاح!"); setShowChildModal(false); setChildForm({ fullName: '', birthDate: '', gender: 'Male', schoolId: '' }); fetchFullData();
    } catch (error) { toast.error(getErrorMessage(error) || "حدث خطأ أثناء إضافة الطفل."); } 
    finally { setIsSubmittingChild(false); }
  };

  const confirmRemoveChild = async () => {
    if (!deleteChildModal.childId) return;
    try { await courtAPI.removeChild(currentFamilyId, deleteChildModal.childId); toast.success("تم حذف الطفل بنجاح!"); fetchFullData(); } 
    catch (error) { toast.error(getErrorMessage(error) || "حدث خطأ أثناء حذف الطفل."); } 
    finally { setDeleteChildModal({ show: false, childId: null, childName: '' }); }
  };

  const handleSettleFamily = async () => {
    setIsSettling(true);
    try { await api.post(`/api/families/${currentFamilyId}/settle`); toast.success("تم تسجيل التسوية الودية بنجاح!"); setShowSettleModal(false); fetchFullData(); } 
    catch (error) { if (error.response?.data?.detail?.includes('active') || error.response?.status === 400) toast.error("لا يمكن إتمام التسوية. إما أن العائلة تمت تسويتها مسبقاً أو أنه لا يوجد نزاع نشط."); else toast.error(getErrorMessage(error) || "حدث خطأ أثناء التسوية."); } 
    finally { setIsSettling(false); setShowSettleModal(false); }
  };

  const handleReturnToDispute = async () => {
    setIsReturning(true);
    try { await api.post(`/api/families/${currentFamilyId}/return-to-dispute`); toast.success("تم إعادة فتح النزاع بنجاح!"); fetchFullData(); } 
    catch (error) { toast.error(getErrorMessage(error) || "حدث خطأ أثناء محاولة إعادة فتح النزاع."); } 
    finally { setIsReturning(false); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const formData = new FormData(); formData.append('file', file);
    setIsUploading(true);
    try { const res = await commonAPI.uploadDocument(formData); setCaseForm(prev => ({ ...prev, documentId: res.data })); setUploadedFileName(file.name); toast.success("تم رفع المستند بنجاح!"); } 
    catch (error) { toast.error(getErrorMessage(error) || "فشل رفع المستند."); } 
    finally { setIsUploading(false); }
  };

  const handleCreateCase = async (e) => {
    e.preventDefault(); setIsSubmittingCase(true);
    try {
      const payload = { familyId: currentFamilyId };
      if (caseForm.caseNumber.trim()) payload.caseNumber = caseForm.caseNumber.trim();
      payload.decisionSummary = caseForm.decisionSummary.trim() ? caseForm.decisionSummary.trim() : "تم التصعيد وتحويل الملف إلى قضية من قبل أخصائي التسوية";
      if (caseForm.documentId) payload.documentId = caseForm.documentId;
      await api.post('/api/court-cases', payload);
      toast.success("تم التصعيد وإنشاء القضية بنجاح!"); setShowCaseModal(false); setCaseForm({ caseNumber: '', decisionSummary: '', documentId: null }); setUploadedFileName(''); fetchFullData();
    } catch (error) { toast.error(getErrorMessage(error) || "حدث خطأ أثناء إنشاء القضية بالخادم."); } 
    finally { setIsSubmittingCase(false); }
  };

  if (loading) return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[80vh] font-sans" dir="rtl">
      <Loader2 className="w-12 h-12 animate-spin text-[#1e3a8a] mb-4" />
      <span className="text-[#1e3a8a] font-bold text-lg">جاري تحميل تفاصيل العائلة...</span>
    </div>
  );

  if (!data.family) return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[80vh] font-sans" dir="rtl">
      <div className="bg-red-50 p-8 rounded-[2rem] flex flex-col items-center text-center max-w-md border border-red-100 shadow-sm">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">تعذر تحميل بيانات العائلة</h2>
        <p className="text-sm text-gray-500 mb-6 font-bold">قد تكون البيانات محذوفة أو غير متاحة حالياً.</p>
        <Button onClick={onBack} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-bold px-8 h-12 shadow-sm outline-none cursor-pointer">العودة للقائمة</Button>
      </div>
    </div>
  );

  const familyStatus = data.family.status?.toLowerCase() || '';
  const isSettled = familyStatus === 'settled';
  const isEscalated = familyStatus === 'escalated' || cases.length > 0;
  const isPending = !isSettled && !isEscalated;

  return (
    <div className="w-full font-sans" dir="rtl">
      <div className={`transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 pb-10 px-4 md:px-0">
          
          <FamilyHeader 
            data={data} onBack={onBack} isSettlementSpecialist={isSettlementSpecialist}
            isPending={isPending} isSettled={isSettled} isEscalated={isEscalated}
            setShowSettleModal={setShowSettleModal} setShowCaseModal={setShowCaseModal}
            handleReturnToDispute={handleReturnToDispute} isReturning={isReturning} cases={cases}
          />
          
          <div className="flex flex-col gap-6 md:gap-8 w-full">
            <ParentsCards family={data.family} />
            <ChildrenSection 
              children={data.family.children} schoolMap={schoolMap} 
              isSettlementSpecialist={isSettlementSpecialist} 
              setShowChildModal={setShowChildModal} setDeleteChildModal={setDeleteChildModal} 
            />
            <CasesSection cases={cases} />
          </div>

        </div>
      </div>

      <FamilyModals 
        showSettleModal={showSettleModal} setShowSettleModal={setShowSettleModal} isSettling={isSettling} handleSettleFamily={handleSettleFamily}
        showCaseModal={showCaseModal} setShowCaseModal={setShowCaseModal} isSubmittingCase={isSubmittingCase} caseForm={caseForm} setCaseForm={setCaseForm} handleCreateCase={handleCreateCase} isUploading={isUploading} handleFileUpload={handleFileUpload} uploadedFileName={uploadedFileName}
        showChildModal={showChildModal} setShowChildModal={setShowChildModal} isSubmittingChild={isSubmittingChild} childForm={childForm} setChildForm={setChildForm} handleAddChild={handleAddChild} handleChildNameChange={handleChildNameChange}
        showSchoolResults={showSchoolResults} setShowSchoolResults={setShowSchoolResults} schoolSearch={schoolSearch} setSchoolSearch={setSchoolSearch} selectedSchoolName={selectedSchoolName} setSelectedSchoolName={setSelectedSchoolName} schools={schools} loadingSchools={loadingSchools} fetchSchools={fetchSchools}
        deleteChildModal={deleteChildModal} setDeleteChildModal={setDeleteChildModal} confirmRemoveChild={confirmRemoveChild}
      />
    </div>
  );
}