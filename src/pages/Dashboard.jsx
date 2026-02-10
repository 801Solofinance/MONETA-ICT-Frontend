import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { Wallet, TrendingUp, DollarSign, ArrowDownCircle, ArrowUpCircle, PiggyBank, AlertCircle } from 'lucide-react'
import StatsCard from '../components/shared/StatsCard'
import StatusBadge from '../components/shared/StatusBadge'
import EmptyState from '../components/shared/EmptyState'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { formatCurrency } from '../utils/currency'
import { formatDate } from '../utils/validators'
import { LIMITS, BANK_INFO } from '../utils/constants'

export default function Dashboard() {
  const { user } = useAuth()
  const { transactions, loading, getActiveInvestmentsCount, getTotalEarnings, getRecentTransactions } = useApp()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" text="Cargando dashboard..." />
      </div>
    )
  }

  const recentTransactions = getRecentTransactions(3)
  const activeInvestments = getActiveInvestmentsCount()
  const totalEarnings = getTotalEarnings()

  const getTransactionTypeLabel = (type) => {
    const labels = {
      deposit: 'Depósito',
      withdrawal: 'Retiro',
      investment: 'Inversión',
      daily_return: 'Ganancia Diaria',
      referral_bonus: 'Bono Referido'
    }
    return labels[type] || type
  }

  const getAmountColor = (type) => {
    if (type === 'deposit' || type === 'daily_return' || type === 'referral_bonus') {
      return 'text-success-600'
    }
    if (type === 'withdrawal') {
      return 'text-red-600'
    }
    return 'text-gray-900'
  }

  const getAmountPrefix = (type) => {
    if (type === 'deposit' || type === 'daily_return' || type === 'referral_bonus') {
      return '+'
    }
    if (type === 'withdrawal') {
      return '-'
    }
    return ''
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Hola, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-600 mt-1">Bienvenido a tu panel de inversiones</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          icon={Wallet}
          title="Balance Disponible"
          value={formatCurrency(user?.balance || 0, user?.country)}
          subtitle="Para nuevas inversiones"
          gradient="from-primary-500 to-primary-700"
        />
        <StatsCard
          icon={TrendingUp}
          title="Inversiones Activas"
          value={activeInvestments}
          subtitle="Generando retornos"
          gradient="from-success-500 to-success-700"
        />
        <StatsCard
          icon={DollarSign}
          title="Ganancias Totales"
          value={formatCurrency(totalEarnings, user?.country)}
          subtitle="Retornos acumulados"
          gradient="from-warning-500 to-warning-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          to="/deposit"
          className="btn btn-primary flex items-center justify-center"
        >
          <ArrowDownCircle className="w-5 h-5 mr-2" />
          Depositar
        </Link>
        <Link
          to="/plans"
          className="btn btn-success flex items-center justify-center"
        >
          <PiggyBank className="w-5 h-5 mr-2" />
          Invertir
        </Link>
        <Link
          to="/withdraw"
          className="btn btn-secondary flex items-center justify-center"
        >
          <ArrowUpCircle className="w-5 h-5 mr-2" />
          Retirar
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
          {transactions.length > 3 && (
            <Link to="/history" className="text-sm text-primary-600 hover:text-primary-700">
              Ver todo →
            </Link>
          )}
        </div>

        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {getTransactionTypeLabel(tx.type)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-medium ${getAmountColor(tx.type)}`}>
                      {getAmountPrefix(tx.type)}{formatCurrency(tx.amount, user?.country)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <StatusBadge status={tx.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={AlertCircle}
            title="No hay actividad reciente"
            description="Comienza realizando tu primer depósito"
            action={
              <Link to="/deposit" className="btn btn-primary">
                Hacer un Depósito
              </Link>
            }
          />
        )}
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex">
          <AlertCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Información Importante sobre Aprobaciones
            </h3>
            <p className="text-sm text-blue-800">
              Todos los depósitos y retiros son revisados manualmente por nuestro equipo. 
              Recibirás una confirmación en 24-48 horas. Tu balance se actualizará automáticamente 
              una vez aprobada la transacción.
            </p>
          </div>
        </div>
      </div>

      {/* Country-Specific Info */}
      <div className={`rounded-lg p-6 ${user?.country === 'CO' ? 'bg-gradient-to-r from-yellow-400 to-red-500' : 'bg-gradient-to-r from-red-500 to-white'}`}>
        <h3 className="text-lg font-semibold text-white mb-3">
          {user?.country === 'CO' ? '🇨🇴 Información para Colombia' : '🇵🇪 Información para Perú'}
        </h3>
        <ul className="text-white text-sm space-y-2">
          <li>• Depósitos mediante {BANK_INFO[user?.country].bank}</li>
          <li>• Moneda: {user?.country === 'CO' ? 'Pesos Colombianos (COP)' : 'Soles Peruanos (PEN)'}</li>
          <li>• Depósito mínimo: {formatCurrency(LIMITS[user?.country].MIN_DEPOSIT, user?.country)}</li>
          <li>• Retiro mínimo: {formatCurrency(LIMITS[user?.country].MIN_WITHDRAWAL, user?.country)}</li>
        </ul>
      </div>
    </div>
  )
}
