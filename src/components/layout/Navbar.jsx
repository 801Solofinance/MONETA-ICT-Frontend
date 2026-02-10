import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogOut, User, LayoutDashboard, TrendingUp, DollarSign, ArrowDownCircle, ArrowUpCircle, History, Users, Shield } from 'lucide-react'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">MONETA-ICT</span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-4">
              <Link to="/dashboard" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link to="/plans" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                <TrendingUp className="w-4 h-4 mr-2" />
                Planes
              </Link>
              <Link to="/deposit" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                <ArrowDownCircle className="w-4 h-4 mr-2" />
                Depositar
              </Link>
              <Link to="/withdraw" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                <ArrowUpCircle className="w-4 h-4 mr-2" />
                Retirar
              </Link>
              <Link to="/history" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                <History className="w-4 h-4 mr-2" />
                Historial
              </Link>
              <Link to="/referrals" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                <Users className="w-4 h-4 mr-2" />
                Referidos
              </Link>
              {isAdmin && (
                <Link to="/admin" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/profile" className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              <User className="w-5 h-5" />
              <span className="hidden md:block">{user?.name}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4 md:mr-2" />
              <span className="hidden md:block">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
