import { cn } from '../../utils/cn'

export default function StatsCard({ icon: Icon, title, value, subtitle, gradient = 'from-primary-500 to-primary-700' }) {
  return (
    <div className={cn('bg-gradient-to-br text-white rounded-lg shadow-lg p-6', gradient)}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-lg">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div>
        <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold mb-1">{value}</p>
        {subtitle && <p className="text-white/70 text-xs">{subtitle}</p>}
      </div>
    </div>
  )
}
