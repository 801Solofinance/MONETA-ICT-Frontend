import { Clock, CheckCircle2, XCircle, Zap } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function StatusBadge({ status }) {
  const config = {
    pending: {
      icon: Clock,
      label: 'Pendiente',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    approved: {
      icon: CheckCircle2,
      label: 'Aprobado',
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    rejected: {
      icon: XCircle,
      label: 'Rechazado',
      className: 'bg-red-100 text-red-800 border-red-200'
    },
    active: {
      icon: Zap,
      label: 'Activa',
      className: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    completed: {
      icon: CheckCircle2,
      label: 'Completada',
      className: 'bg-gray-100 text-gray-800 border-gray-200'
    },
    cancelled: {
      icon: XCircle,
      label: 'Cancelada',
      className: 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const statusConfig = config[status] || config.pending
  const Icon = statusConfig.icon

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', statusConfig.className)}>
      <Icon className="w-3 h-3 mr-1" />
      {statusConfig.label}
    </span>
  )
}
