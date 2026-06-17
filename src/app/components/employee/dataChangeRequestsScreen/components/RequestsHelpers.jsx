import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export const statusOptions = [
  { value: 'all', label: 'جميع الحالات' },
  { value: 'Pending', label: 'قيد الانتظار' },
  { value: 'Approved', label: 'تمت الموافقة' },
  { value: 'Rejected', label: 'تم الرفض' }
];

export const translateStatus = (status) => {
  const s = status?.toLowerCase();
  if (s === 'approved' || s === 'accepted') return 'approved';
  if (s === 'rejected' || s === 'declined') return 'rejected';
  return 'pending'; 
};

export const getStatusBadge = (status) => {
  switch (status) {
    case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'approved': return 'bg-green-100 text-green-700 border-green-200';
    case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case 'pending': return 'قيد الانتظار';
    case 'approved': return 'تمت الموافقة';
    case 'rejected': return 'تم الرفض';
    default: return status;
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case 'pending': return <Clock className="w-4 h-4" />;
    case 'approved': return <CheckCircle className="w-4 h-4" />;
    case 'rejected': return <XCircle className="w-4 h-4" />;
    default: return null;
  }
};