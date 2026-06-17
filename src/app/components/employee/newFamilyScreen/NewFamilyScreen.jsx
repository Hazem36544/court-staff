import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import api, { courtAPI } from '../../../../services/api';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '../../../../utils/errorHandler';

// استدعاء المكونات
import { extractBirthDate, isUUID, validateFullName, validateNationalId, validatePhone, validateEmail, validateChildName } from './components/NewFamilyHelpers';
import NewFamilyHeader from './components/NewFamilyHeader';
import ParentFormCard from './components/ParentFormCard';
import ChildrenFormSection from './components/ChildrenFormSection';
import SuccessScreen from './components/SuccessScreen';

// ✅ استدعاء نوافذ المدرسة من مجلد إدارة المدارس (تأكد من دقة هذا المسار في مشروعك)
import SchoolsModals from '../SchoolsManagement/components/SchoolsModals';

export function NewFamilyScreen({ onBack, onSave, onNavigate, familyData }) {
  const isEditMode = !!familyData;
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [schoolsList, setSchoolsList] = useState([]);

  const [father, setFather] = useState({ fullName: '', nationalId: '', phone: '', email: '', job: '', address: '', birthDate: '', gender: 'Male' });
  const [mother, setMother] = useState({ fullName: '', nationalId: '', phone: '', email: '', job: '', address: '', birthDate: '', gender: 'Female' });
  
  const [children, setChildren] = useState([]);
  const [newChild, setNewChild] = useState({ fullName: '', birthDate: '', gender: 'Male', schoolId: '' });
  const [editingChildId, setEditingChildId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [successData, setSuccessData] = useState({ family: null });
  const [schoolSearchTerm, setSchoolSearchTerm] = useState('');

  // ✅ States الخاصة بنافذة إضافة مدرسة جديدة (نفس اللوجيك بتاع المدارس بالضبط)
  const [showSchoolAddModal, setShowSchoolAddModal] = useState(false);
  const [newSchool, setNewSchool] = useState({ name: '', address: '', contactNumber: '' });
  const [schoolFormErrors, setSchoolFormErrors] = useState({});
  const [schoolError, setSchoolError] = useState(null);
  const [isSavingSchool, setIsSavingSchool] = useState(false);
  const [schoolSuccessCredentials, setSchoolSuccessCredentials] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const schoolRes = await api.get('/api/schools', { params: { PageNumber: 1, PageSize: 100 } });
        if (schoolRes.data && schoolRes.data.items) setSchoolsList(schoolRes.data.items);
      } catch (e) { console.warn("⚠️ Failed to load schools list", e); }
    };
    fetchInitialData();
    if (familyData) {
      setFather(prev => ({ ...prev, ...familyData.father, gender: 'Male' }));
      setMother(prev => ({ ...prev, ...familyData.mother, gender: 'Female' }));
      setChildren(familyData.children || []);
    }
  }, [familyData]);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleReturnToFamilies = () => {
    if (onNavigate) onNavigate('families-management');
    else if (onBack) onBack();
  };

  const handleFatherChange = (e) => {
    const { name, value } = e.target;
    let updates = { [name]: value };
    if (name === 'nationalId' && value.length === 14) updates.birthDate = extractBirthDate(value);
    setFather({ ...father, ...updates });
    if (formErrors[`father_${name}`]) setFormErrors(prev => ({ ...prev, [`father_${name}`]: null }));
  };

  const handleMotherChange = (e) => {
    const { name, value } = e.target;
    let updates = { [name]: value };
    if (name === 'nationalId' && value.length === 14) updates.birthDate = extractBirthDate(value);
    setMother({ ...mother, ...updates });
    if (formErrors[`mother_${name}`]) setFormErrors(prev => ({ ...prev, [`mother_${name}`]: null }));
  };

  const handleChildNameChange = (e) => {
    const val = e.target.value;
    const childWords = val.split(' ');
    if (childWords.length === 2 && childWords[1] === '' && father.fullName.trim()) {
      const fatherWords = father.fullName.trim().split(/\s+/);
      if (fatherWords.length >= 3) {
        setNewChild({ ...newChild, fullName: `${childWords[0]} ${fatherWords.slice(0, 3).join(' ')}` });
        if (formErrors.child_fullName) setFormErrors(prev => ({ ...prev, child_fullName: null }));
        return;
      }
    }
    setNewChild({ ...newChild, fullName: val });
    if (formErrors.child_fullName) setFormErrors(prev => ({ ...prev, child_fullName: null }));
  };

  const handleNewChildChange = (e) => {
    const { name, value } = e.target;
    setNewChild({ ...newChild, [name]: value });
    if (formErrors[`child_${name}`]) setFormErrors(prev => ({ ...prev, [`child_${name}`]: null }));
  };

  const addChild = (e) => {
    if(e) e.preventDefault();
    let errors = {};

    if (!validateFullName(newChild.fullName)) errors.child_fullName = "اسم الطفل يجب أن يكون رباعياً";
    else if (father.fullName) {
      const nameMatchError = validateChildName(newChild.fullName, father.fullName);
      if (nameMatchError) errors.child_fullName = nameMatchError;
    } else errors.child_fullName = "يرجى كتابة اسم الأب أولاً لضمان التطابق";

    if (!newChild.birthDate) errors.child_birthDate = "يرجى إدخال تاريخ ميلاد الطفل";

    if (Object.keys(errors).length > 0) {
      setFormErrors(prev => ({ ...prev, ...errors }));
      toast.error("يرجى تصحيح أخطاء بيانات الطفل");
      return false;
    }

    if (editingChildId) {
      setChildren(children.map(c => c.id === editingChildId ? { ...newChild, id: editingChildId } : c));
      setEditingChildId(null);
      toast.success("تم تحديث بيانات الطفل");
    } else {
      setChildren([...children, { ...newChild, id: Date.now() }]);
      toast.success("تم إضافة الطفل للقائمة");
    }

    setNewChild({ fullName: '', birthDate: '', gender: 'Male', schoolId: '' });
    setSchoolSearchTerm('');
    return true;
  };

  const startEditChild = (child) => {
    setNewChild({ fullName: child.fullName, birthDate: child.birthDate, gender: child.gender, schoolId: child.schoolId || '' });
    setEditingChildId(child.id);
    if (child.schoolId) {
      const selected = schoolsList.find(s => s.id === child.schoolId);
      setSchoolSearchTerm(selected ? selected.name : '');
    } else setSchoolSearchTerm('');
  };

  const cancelEditChild = () => {
    setEditingChildId(null);
    setNewChild({ fullName: '', birthDate: '', gender: 'Male', schoolId: '' });
    setSchoolSearchTerm('');
  };

  const removeChild = (id) => {
    if (editingChildId === id) cancelEditChild();
    setChildren(children.filter(c => c.id !== id));
    toast.success("تم حذف الطفل من القائمة");
  };

  const getSchoolName = (schoolId) => {
    if (!schoolId) return '';
    const school = schoolsList.find(s => s.id === schoolId);
    return school ? school.name : '';
  };

  const validateFullForm = () => {
    let errors = {};
    let isValid = true;

    // الأب
    if (!validateFullName(father.fullName)) { errors.father_fullName = "يجب إدخال الاسم رباعياً"; isValid = false; }
    const fatherIdError = validateNationalId(father.nationalId);
    if (fatherIdError) { errors.father_nationalId = fatherIdError; isValid = false; }
    const fatherPhoneError = validatePhone(father.phone);
    if (fatherPhoneError) { errors.father_phone = fatherPhoneError; isValid = false; }
    const fatherEmailError = validateEmail(father.email);
    if (fatherEmailError) { errors.father_email = fatherEmailError; isValid = false; }
    if (!father.job?.trim()) { errors.father_job = "المهنة مطلوبة"; isValid = false; }
    if (!father.address?.trim()) { errors.father_address = "العنوان التفصيلي مطلوب"; isValid = false; }

    // الأم
    if (!validateFullName(mother.fullName)) { errors.mother_fullName = "يجب إدخال الاسم رباعياً"; isValid = false; }
    const motherIdError = validateNationalId(mother.nationalId);
    if (motherIdError) { errors.mother_nationalId = motherIdError; isValid = false; }
    const motherPhoneError = validatePhone(mother.phone);
    if (motherPhoneError) { errors.mother_phone = motherPhoneError; isValid = false; }
    const motherEmailError = validateEmail(mother.email);
    if (motherEmailError) { errors.mother_email = motherEmailError; isValid = false; }
    if (!mother.job?.trim()) { errors.mother_job = "المهنة مطلوبة"; isValid = false; }
    if (!mother.address?.trim()) { errors.mother_address = "العنوان التفصيلي مطلوب"; isValid = false; }

    setFormErrors(prev => ({...prev, ...errors}));
    return isValid;
  };

  const handleSubmit = async () => {
    let finalChildren = [...children];
    const hasPendingChildData = newChild.fullName.trim() || newChild.birthDate;
    
    if (hasPendingChildData) {
      let childErrors = {};
      if (!validateFullName(newChild.fullName)) childErrors.child_fullName = "اسم الطفل يجب أن يكون رباعياً";
      else if (father.fullName) {
        const matchErr = validateChildName(newChild.fullName, father.fullName);
        if (matchErr) childErrors.child_fullName = matchErr;
      }
      if (!newChild.birthDate) childErrors.child_birthDate = "يرجى إدخال تاريخ ميلاد الطفل";

      if (Object.keys(childErrors).length > 0) {
        setFormErrors(prev => ({ ...prev, ...childErrors }));
        toast.error("يرجى استكمال أخطاء بيانات الطفل قبل الحفظ النهائي");
        return; 
      }
      finalChildren.push({ ...newChild, id: Date.now() });
      setChildren(finalChildren);
      setNewChild({ fullName: '', birthDate: '', gender: 'Male', schoolId: '' });
      setSchoolSearchTerm('');
    }

    if (!validateFullForm()) {
      toast.error("يرجى مراجعة وتصحيح الأخطاء في بيانات الأب والأم");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      const processedChildren = finalChildren.map(c => ({
        fullName: c.fullName,
        birthDate: c.birthDate || new Date().toISOString().split('T')[0],
        gender: c.gender,
        schoolId: (c.schoolId && isUUID(c.schoolId)) ? c.schoolId : null
      }));

      const familyPayload = {
        father: {
          nationalId: father.nationalId, fullName: father.fullName, birthDate: father.birthDate || extractBirthDate(father.nationalId),
          gender: 'Male', job: father.job, address: father.address, phone: father.phone, email: father.email || null
        },
        mother: {
          nationalId: mother.nationalId, fullName: mother.fullName, birthDate: mother.birthDate || extractBirthDate(mother.nationalId),
          gender: 'Female', job: mother.job, address: mother.address, phone: mother.phone, email: mother.email || null
        },
        children: processedChildren
      };

      const familyRes = await courtAPI.enrollFamily(familyPayload);
      setSuccessData({ family: familyRes.data });
      toast.success("تم تسجيل العائلة بنجاح!");
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error("Fatal Error:", err);
      toast.error(getErrorMessage(err) || "فشل فتح الملف. يرجى مراجعة البيانات.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  // ✅ دوال التعامل مع نافذة المدرسة (School Modals Validation & Submit)
  const validateSchoolForm = () => {
    let errors = {}; let isValid = true;
    if (!newSchool.name.trim()) { errors.name = "اسم المدرسة مطلوب"; isValid = false; }
    if (!newSchool.address.trim()) { errors.address = "العنوان التفصيلي مطلوب"; isValid = false; }
    if (!newSchool.contactNumber.trim()) {
      errors.contactNumber = "رقم التواصل مطلوب"; isValid = false;
    } else {
      const phoneRegex = /^01[0125]\d{8}$/;
      if (!phoneRegex.test(newSchool.contactNumber.replace(/\s+/g, ''))) {
        errors.contactNumber = "يجب أن يبدأ الرقم بـ 010 أو 011 أو 012 أو 015 ومكون من 11 رقم"; isValid = false;
      }
    }
    setSchoolFormErrors(errors); return isValid;
  };

  const handleNewSchoolChange = (e) => {
    const { name, value } = e.target;
    setNewSchool({ ...newSchool, [name]: value });
    if (schoolFormErrors[name]) setSchoolFormErrors(prev => ({ ...prev, [name]: null }));
    if (schoolError) setSchoolError(null);
  };

  const handleAddSchool = async (e) => {
    e.preventDefault();
    if (!validateSchoolForm()) { toast.error("يرجى مراجعة وتصحيح الأخطاء في البيانات"); return; }
    setIsSavingSchool(true); setSchoolError(null);
    try {
      const payload = { name: newSchool.name.trim(), address: newSchool.address.trim(), contactNumber: newSchool.contactNumber.trim() };
      const res = await api.post('/api/schools', payload);
      setSchoolSuccessCredentials(res.data); 
      
      // ✅ تحديث قائمة المدارس والاختيار التلقائي السحري
      const schoolRes = await api.get('/api/schools', { params: { PageNumber: 1, PageSize: 100 } });
      if (schoolRes.data && schoolRes.data.items) {
         setSchoolsList(schoolRes.data.items);
         const addedSchool = schoolRes.data.items.find(s => s.name === payload.name);
         if (addedSchool) {
            setNewChild(prev => ({ ...prev, schoolId: addedSchool.id }));
            setSchoolSearchTerm(addedSchool.name);
         }
      }
      
      setNewSchool({ name: '', address: '', contactNumber: '' });
      setSchoolFormErrors({}); 
      setShowSchoolAddModal(false);
      toast.success("تم تسجيل المدرسة بمركز البيانات بنجاح!");
    } catch (err) {
      setSchoolError(getErrorMessage(err) || "فشل تسجيل المدرسة. يرجى المراجعة والمحاولة.");
    } finally { setIsSavingSchool(false); }
  };

  const copyToClipboard = (text) => {
    if (!text) return; navigator.clipboard.writeText(text); toast.success("تم النسخ إلى الحافظة بنجاح");
  };

  if (successData.family) {
    return <SuccessScreen successData={successData} onNavigate={onNavigate} />;
  }

  return (
    <div className="w-full font-sans" dir="rtl">
      <div className={`transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 pb-10 px-4 md:px-0">

          <NewFamilyHeader isEditMode={isEditMode} onBack={handleReturnToFamilies} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 text-right w-full">
            <ParentFormCard type="father" data={father} onChange={handleFatherChange} errors={formErrors} />
            <ParentFormCard type="mother" data={mother} onChange={handleMotherChange} errors={formErrors} />
          </div>

          <ChildrenFormSection 
            newChild={newChild} handleChildNameChange={handleChildNameChange} handleNewChildChange={handleNewChildChange} formErrors={formErrors}
            schoolsList={schoolsList} schoolSearchTerm={schoolSearchTerm} setSchoolSearchTerm={setSchoolSearchTerm}
            addChild={addChild} editingChildId={editingChildId} cancelEditChild={cancelEditChild}
            children={children} startEditChild={startEditChild} removeChild={removeChild} getSchoolName={getSchoolName}
            onAddNewSchool={() => setShowSchoolAddModal(true)} // ✅ تفعيل الزر لفتح النافذة
          />

          <div className="mt-4 flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button 
              onClick={handleSubmit} disabled={loading} 
              className="w-full sm:flex-1 bg-[#1e3a8a] text-white py-4 md:py-5 rounded-2xl font-bold text-lg hover:bg-blue-900 transition-all shadow-[0_4px_20px_rgba(30,58,138,0.3)] flex items-center justify-center gap-3 disabled:opacity-70 border-none outline-none active:scale-95 shrink-0 cursor-pointer"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
              <span>{loading ? 'جاري إنشاء العائلة...' : 'اعتماد وحفظ العائلة'}</span>
            </button>
            <button 
              onClick={handleReturnToFamilies} disabled={loading} 
              className="w-full sm:w-48 bg-white text-gray-700 border border-gray-300 shadow-sm py-4 md:py-5 rounded-2xl font-bold hover:bg-gray-50 transition-all text-lg flex items-center justify-center outline-none active:scale-95 shrink-0 cursor-pointer"
            >
              إلغاء وتراجع
            </button>
          </div>
          
        </div>
      </div>

      {/* ✅ استدعاء المكون الخاص بنوافذ المدرسة واستخدام خصائص الـ (إضافة مدرسة) فقط */}
      <SchoolsModals 
        showAddModal={showSchoolAddModal} setShowAddModal={setShowSchoolAddModal} 
        isSaving={isSavingSchool} error={schoolError} setError={setSchoolError} 
        formErrors={schoolFormErrors} setFormErrors={setSchoolFormErrors} 
        newSchool={newSchool} handleNewSchoolChange={handleNewSchoolChange} handleAddSchool={handleAddSchool}
        successCredentials={schoolSuccessCredentials} setSuccessCredentials={setSchoolSuccessCredentials} copyToClipboard={copyToClipboard}
        // تمرير قيم فارغة لدوال التعديل والحذف لأننا لا نحتاجها هنا ولتجنب الأخطاء
        selectedSchool={null} setSelectedSchool={() => {}} isEditing={false} setIsEditing={() => {}} handleStartEdit={() => {}} editForm={{}} setEditForm={() => {}} isUpdating={false} handleUpdateSchool={() => {}} deleteModal={{show: false}} setDeleteModal={() => {}} isDeleting={false} confirmDelete={() => {}}
      />
    </div>
  );
}