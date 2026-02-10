import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { INVESTMENT_PLANS } from '../data/investmentPlans';
import InvestmentCard from '../components/shared/InvestmentCard';
import InvestmentModal from '../components/shared/InvestmentModal';
import { formatCurrency } from '../utils/currency';

const Plans = () => {
  const { user } = useAuth();
  const { addInvestment, addTransaction, getBalance } = useApp();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('amount'); // amount, duration, roi

  const userBalance = getBalance();

  // Filtrar y ordenar planes
  const getFilteredPlans = () => {
    let filtered = [...INVESTMENT_PLANS];

    // Buscar por nombre
    if (searchTerm) {
      filtered = filtered.filter(plan =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      const dataA = user.country === 'CO' ? a.co : a.pe;
      const dataB = user.country === 'CO' ? b.co : b.pe;

      switch (sortBy) {
        case 'amount':
          return dataA.minInvestment - dataB.minInvestment;
        case 'duration':
          return a.duration - b.duration;
        case 'roi':
          return dataB.percentage - dataA.percentage;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const handleInvestClick = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleConfirmInvestment = async (investmentData) => {
    // Validar balance
    if (investmentData.amount > userBalance) {
      toast.error('Saldo insuficiente');
      return;
    }

    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Crear inversión
      const investment = addInvestment({
        planId: investmentData.planId,
        planName: investmentData.planName,
        amount: investmentData.amount,
        dailyReturn: investmentData.dailyReturn,
        duration: investmentData.duration,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + investmentData.duration * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
      });

      // Crear transacción de inversión
      addTransaction({
        type: 'investment',
        amount: investmentData.amount,
        status: 'active',
        reference: investment.id,
      });

      // Cerrar modal
      setIsModalOpen(false);
      setSelectedPlan(null);

      // Mostrar éxito
      toast.success(
        `¡Inversión realizada! Comenzarás a recibir ${formatCurrency(investmentData.dailyReturn, user.country)} diarios`,
        { duration: 6000 }
      );

      // Navegar al dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Investment error:', error);
      toast.error('Error al procesar la inversión');
    }
  };

  const filteredPlans = getFilteredPlans();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="w-8 h-8 mr-3 text-primary-600" />
          Planes de Inversión
        </h1>
        <p className="text-gray-600 mt-2">
          Elige el plan perfecto para hacer crecer tu patrimonio
        </p>
      </div>

      {/* Balance Card */}
      <div className="card bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Tu Balance Disponible</p>
            <h2 className="text-3xl font-bold">
              {formatCurrency(userBalance, user.country)}
            </h2>
          </div>
          <div className="text-5xl opacity-20">💰</div>
        </div>
        {userBalance === 0 && (
          <div className="mt-4 bg-white/20 rounded-lg p-3">
            <p className="text-sm">
              ⚠️ No tienes balance disponible. Realiza un depósito para comenzar a invertir.
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Plan
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre..."
                className="input pl-10"
              />
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar Por
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input pl-10 appearance-none cursor-pointer"
              >
                <option value="amount">Inversión Mínima (Menor a Mayor)</option>
                <option value="duration">Duración (Menor a Mayor)</option>
                <option value="roi">Rendimiento (Mayor a Menor)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="card bg-blue-50 border-l-4 border-primary-600">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              ¿Cómo funcionan las inversiones?
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Elige un plan y el monto que deseas invertir</li>
              <li>• Recibirás retornos diarios de forma automática</li>
              <li>• Al finalizar el período, recuperas tu inversión inicial</li>
              <li>• Puedes reinvertir o retirar tus ganancias en cualquier momento</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      {filteredPlans.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No se encontraron planes que coincidan con tu búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan, index) => (
            <InvestmentCard
              key={plan.id}
              plan={plan}
              country={user.country}
              onInvest={handleInvestClick}
              featured={plan.id === 'gold'} // Destacar Plan Gold
            />
          ))}
        </div>
      )}

      {/* Country-specific info */}
      {user.country === 'CO' && (
        <div className="card bg-gradient-to-r from-yellow-50 to-yellow-100">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">🇨🇴</div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Inversión en Colombia
              </h4>
              <p className="text-sm text-gray-700">
                Todos los planes están disponibles en Pesos Colombianos (COP).
                Los retornos se calculan y acreditan diariamente.
                Inversión mínima desde $50.000 COP.
              </p>
            </div>
          </div>
        </div>
      )}

      {user.country === 'PE' && (
        <div className="card bg-gradient-to-r from-red-50 to-red-100">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">🇵🇪</div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Inversión en Perú
              </h4>
              <p className="text-sm text-gray-700">
                Todos los planes están disponibles en Soles Peruanos (PEN).
                Los retornos se calculan y acreditan diariamente.
                Inversión mínima desde S/130 PEN.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Investment Modal */}
      <InvestmentModal
        plan={selectedPlan}
        country={user.country}
        userBalance={userBalance}
        onConfirm={handleConfirmInvestment}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedPlan(null);
        }}
        isOpen={isModalOpen}
      />
    </div>
  );
};

export default Plans;
