import React from 'react';
import { cn } from '../../utils/cn';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Zap,
  CheckCheck
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      label: 'Pendiente',
      className: 'badge-warning',
      icon: Clock,
    },
    approved: {
      label: 'Aprobado',
      className: 'badge-success',
      icon: CheckCircle2,
    },
    rejected: {
      label: 'Rechazado',
      className: 'badge-danger',
      icon: XCircle,
    },
    active: {
      label: 'Activa',
      className: 'badge-primary',
      icon: Zap,
    },
    completed: {
      label: 'Completada',
      className: 'badge-success',
      icon: CheckCheck,
    },
    cancelled: {
      label: 'Cancelada',
      className: 'badge-danger',
      icon: XCircle,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={cn('badge', config.className)}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
