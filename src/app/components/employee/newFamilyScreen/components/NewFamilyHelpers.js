export const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
export const daysOfWeek = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

export const extractBirthDate = (id) => {
  if (!id || id.length !== 14) return new Date().toISOString().split('T')[0];
  const century = id[0] === '2' ? '19' : '20';
  const year = century + id.substring(1, 3);
  const month = id.substring(3, 5);
  const day = id.substring(5, 7);
  return `${year}-${month}-${day}`;
};

export const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export const validateFullName = (name) => {
  if (!name) return false;
  const words = name.trim().split(/\s+/);
  return words.length >= 4;
};

export const validateNationalId = (id) => {
  if (!id || id.length !== 14 || !/^\d+$/.test(id)) return "يجب أن يتكون من 14 رقماً";
  const month = parseInt(id.substring(3, 5), 10);
  const day = parseInt(id.substring(5, 7), 10);
  if (month < 1 || month > 12) return "الشهر في الرقم غير صحيح";
  if (day < 1 || day > 31) return "اليوم في الرقم غير صحيح";
  return null; 
};

export const validatePhone = (phone) => {
  if (!phone) return "رقم الهاتف مطلوب"; 
  const mobileRegex = /^01[0125]\d{8}$/;
  if (!mobileRegex.test(phone)) return "رقم الهاتف غير صحيح (01...)";
  return null;
};

export const validateEmail = (email) => {
  if (!email) return null; 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "بريد إلكتروني غير صحيح";
  return null;
};

export const validateChildName = (childName, fatherName) => {
  if (!childName || !fatherName) return "مطلوب اسم الطفل واسم الأب";
  const childWords = childName.trim().split(/\s+/);
  const fatherWords = fatherName.trim().split(/\s+/);

  if (childWords.length < 4) return "يجب أن يكون رباعياً";
  if (fatherWords.length < 3) return "اسم الأب غير مكتمل للمطابقة";

  const expectedChildName = `${childWords[0]} ${fatherWords.slice(0, 3).join(' ')}`;
  const actualChildFirst4 = childWords.slice(0, 4).join(' ');
  
  if (actualChildFirst4 !== expectedChildName) {
    return `عدم تطابق مع اسم الأب. المتوقع: (${expectedChildName})`;
  }
  return null;
};