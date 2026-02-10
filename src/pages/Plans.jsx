import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Wallet, Search } from 'lucide-react'
import { INVESTMENT_PLANS } from '../data/investmentPlans'
import { formatCurrency } from '../utils/currency'
import LoadingSpinner from '../components/shared/LoadingSpinner'

export default function Plans() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('amount')

  const filteredPlans = INVESTMENT_PLANS
    .filter(plan => 
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'amount') return a.minInvestment[user?.country] - b.minInvestment[user?.country]
      if (sortBy === 'duration') return a.duration - b.duration
      if (sortBy === 'roi') return b.roi[user?.country] - a.roi[user?.country]
      return 0
    })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Planes de Inversión</h1>
        <p className="text-gray-600 mt-1">Elige el plan que mejor se adapte a tus objetivos</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">Balance Disponible</p>
            <p className="text-3xl font-bold">{formatCurrency(user?.balance || 0, user?.country)}</p>
          </div>
          <Wallet className="w-12 h-12 text-white/50" />
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar planes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input">
          <option value="amount">Ordenar por: Inversión Mínima</option>
          <option value="duration">Ordenar por: Duración</option>
          <option value="roi">Ordenar por: Rendimiento</option>
        </select>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{plan.icon}</div>
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              {plan.featured && (
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full mt-2">
                  ⭐ MÁS POPULAR
                </span>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">💵 Inversión Mínima</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(plan.minInvestment[user?.country], user?.country)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">📈 Retorno Diario</span>
                <span className="font-semibold text-success-600">
                  {formatCurrency(plan.dailyReturn[user?.country], user?.country)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">📅 Duración</span>
                <span className="font-semibold text-gray-900">{plan.duration} días</span>
              </div>
            </div>

            <div className="bg-primary-50 rounded-lg p-3 mb-4">
              <div className="text-sm text-gray-600 mb-1">Retorno Total</div>
              <div className="text-xl font-bold text-primary-600">
                {formatCurrency(plan.totalReturn[user?.country], user?.country)}
              </div>
              <div className="text-xs text-gray-500">ROI: {plan.roi[user?.country]}%</div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

            <button className="w-full btn btn-primary">
              Invertir Ahora
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
