import React from 'react';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

export const getStatusBadge = (status) => {
  switch (status) {
    case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'UnderReview': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case 'Pending': return <Clock className="w-4 h-4" />;
    case 'UnderReview': return <AlertCircle className="w-4 h-4" />;
    case 'Resolved': return <CheckCircle className="w-4 h-4" />;
    default: return null;
  }
};

export const getViolationTypeLabel = (type) => {
  switch (type) {
    case 'MissedVisit': return 'زيارة فائتة';
    case 'OverstayedVisit': return 'تجاوز وقت الزيارة';
    case 'UnpaidAlimony': return 'نفقة غير مدفوعة';
    case 'CustodyBreach': return 'مخالفة شروط الحضانة';
    default: return type || 'أخرى';
  }
};