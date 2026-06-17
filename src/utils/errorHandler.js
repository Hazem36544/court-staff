// src/utils/errorHandler.js

export const getErrorMessage = (error) => {
    // 1. التأكد من وجود اتصال بالسيرفر (سقوط السيرفر أو انقطاع الإنترنت)
    if (!error.response || error.code === 'ERR_NETWORK') {
        return "تعذر الاتصال بخادم المحكمة، يرجى التحقق من اتصالك بالإنترنت.";
    }

    const { status, data } = error.response;

    // 2. تجميع نصوص الخطأ للبحث عن الرسائل الإنجليزية الثابتة من الباك إند
    const errorText = String(
        data?.detail || data?.title || data?.message || (typeof data === 'string' ? data : "")
    ).toLowerCase();

    // --- أخطاء تسجيل الدخول (موظف المحكمة يدخل بالبريد الإلكتروني) ---
    if (errorText.includes("credentials are invalid") || errorText.includes("invalid credentials") || errorText.includes("wrong password")) {
        return "البريد الإلكتروني أو كلمة المرور الخاصة بالموظف غير صحيحة.";
    }
    if (errorText.includes("locked out") || errorText.includes("lockout")) {
        return "تم قفل الحساب مؤقتاً لدواعي أمنية، يرجى مراجعة مدير النظام.";
    }

    // --- أخطاء العمليات الخاصة بموظف المحكمة فقط (قضايا، جداول، نفقات) ---
    if (errorText.includes("already closed") || errorText.includes("case closed")) {
        return "لا يمكن تعديل أو إضافة بيانات لأن هذه القضية مغلقة بالفعل في النظام.";
    }
    if (errorText.includes("schedule overlap") || errorText.includes("overlap")) {
        return "يوجد تعارض في المواعيد مع جدول رؤية آخر في نفس المركز، يرجى اختيار موعد أو مركز مختلف.";
    }
    if (errorText.includes("active schedule")) {
        return "لا يمكن إضافة جدول جديد لوجود جدول رؤية نشط بالفعل لهذه القضية.";
    }
    if (errorText.includes("already exists")) {
        return "هذا السجل أو القرار مضاف مسبقاً في النظام.";
    }

    // 3. قراءة رسائل الخطأ التفصيلية من الباك إند (Validation Errors من FluentValidation)
    if (data) {
        if (data.errors && typeof data.errors === 'object') {
            const firstErrorKey = Object.keys(data.errors)[0];
            if (Array.isArray(data.errors[firstErrorKey]) && data.errors[firstErrorKey].length > 0) {
                // إرجاع أول رسالة خطأ فعلية من قائمة التحقق
                return data.errors[firstErrorKey][0]; 
            }
        }
    }

    // 4. معالجة أكواد الخطأ الأساسية (Fallbacks)
    if (status === 400) return data?.detail || data?.title || "البيانات المدخلة غير صحيحة أو ناقصة، يرجى مراجعة الحقول والمحاولة مجدداً.";
    if (status === 401) return "انتهت جلسة العمل، يرجى تسجيل الدخول مرة أخرى.";
    if (status === 403) return "غير مصرح لك بإجراء هذه العملية. تأكد من أن القضية أو العائلة تابعة للمحكمة التي تعمل بها.";
    if (status === 404) return "العنصر المطلوب (مثل القضية، قرار النفقة، أو جدول الرؤية) غير موجود في النظام.";
    if (status === 409) return "تعارض في البيانات: لا يمكن إتمام العملية لوجود بيانات مرتبطة تمنع ذلك.";

    // 5. عرض الرسالة المخصصة من الباك إند (إن وجدت ولم يتم اصطيادها)
    if (data?.detail) return data.detail;
    if (data?.title) return data.title;

    // 6. رسالة افتراضية لأي خطأ غير معروف
    return "حدث خطأ غير متوقع في نظام المحكمة، يرجى إعادة المحاولة.";
};