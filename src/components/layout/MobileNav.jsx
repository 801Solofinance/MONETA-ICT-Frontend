import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, TrendingUp, ArrowDownCircle, ArrowUpCircle, History, Users } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function MobileNav() {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Inicio' },
    { path: '/plans', icon: TrendingUp, label: 'Planes' },
    { path: '/deposit', icon: ArrowDownCircle, label: 'Depositar' },
    { path: '/withdraw', icon: ArrowUpCircle, label: 'Retirar' },
    { path: '/history', icon: History, label: 'Historial' },
    { path: '/referrals', icon: Users, label: 'Referidos' },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-6 h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 transition-colors',
                isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
