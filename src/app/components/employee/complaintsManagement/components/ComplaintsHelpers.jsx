import React from 'react';
import { Clock, AlertCircle, CheckCircle, XOctagon } from 'lucide-react';

export const statusOptions = [
  { value: 'all', label: 'جميع الحالات' },
  { value: 'Pending', label: 'قيد الانتظار' },
  { value: 'UnderReview', label: 'قيد المراجعة' },
  { value: 'Resolved', label: 'تم الحل' },
  { value: 'Rejected', label: 'مرفوضة / معادة' }
];

export const translateStatus = (status) => {
  const s = status?.toLowerCase() || '';
  if (s === 'resolved' || s === 'approved' || s === 'closed') return 'resolved';
  if (s === 'underreview' || s === 'under_review') return 'underReview';
  if (s === 'refiled' || s === 'rejected') return 'rejected';
  return 'pending';
};

export const getStatusBadge = (status) => {
  switch (status) {
    case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'underReview': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
    case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case 'pending': return 'قيد الانتظار';
    case 'underReview': return 'قيد المراجعة';
    case 'resolved': return 'تم الحل';
    case 'rejected': return 'مرفوضة';
    default: return status || 'غير معروف';
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case 'pending': return <Clock className="w-4 h-4" />;
    case 'underReview': return <AlertCircle className="w-4 h-4" />;
    case 'resolved': return <CheckCircle className="w-4 h-4" />;
    case 'rejected': return <XOctagon className="w-4 h-4" />;
    default: return null;
  }
};