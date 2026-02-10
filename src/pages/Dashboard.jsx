import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  TrendingUp, 
  DollarSign,
  ArrowDownToLine,
  ArrowUpFromLine,
  Plus,
  Activity,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { formatCurrency, getCurrencyCode } from '../utils/currency';
import { SkeletonDashboard } from '../components/shared/SkeletonCard';
import StatusBadge from '../components/shared/StatusBadge';
import StatsCard from '../components/shared/StatsCard';
import EmptyState from '../components/shared/EmptyState';
import { TRANSACTION_TYPE_LABELS } from '../utils/constants';

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    transactions, 
    getBalance, 
    getActiveInvestments, 
    getTotalEarnings,
    getRecentTransactions 
  } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    balance: 0,
    activeInvestments: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    // Simular carga de datos
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      const balance = getBalance();
      const activeInvestments = getActiveInvestments();
      const totalEarnings = getTotalEarnings();

      setStats({
        balance,
        activeInvestments: activeInvestments.length,
        totalEarnings,
      });

      setIsLoading(false);
    };

    loadDashboardData();
  }, [user, transactions]);

  const recentActivity = getRecentTransactions();
  const currency = getCurrencyCode(user.country);

  if (isLoading) {
    return <SkeletonDashboard />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Hola, {user.name.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Bienvenido a tu panel de inversiones
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          icon={Wallet}
          title="Balance Disponible"
          value={formatCurrency(stats.balance, user.country)}
          subtitle="Total"
          gradient="from-primary-500 to-primary-700"
        />

        <StatsCard
          icon={TrendingUp}
          title="Inversiones Activas"
          value={stats.activeInvestments}
          subtitle="Activas"
          gradient="from-success-500 to-success-700"
        />

        <StatsCard
          icon={DollarSign}
          title="Ganancias Totales"
          value={formatCurrency(stats.totalEarnings, user.country)}
          subtitle="Total"
          gradient="from-warning-500 to-warning-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link
            to="/deposit"
            className="btn btn-primary flex items-center justify-center space-x-2 py-3"
          >
            <ArrowDownToLine className="w-5 h-5" />
            <span>Depositar</span>
          </Link>
          
          <Link
            to="/plans"
            className="btn btn-success flex items-center justify-center space-x-2 py-3"
          >
            <Plus className="w-5 h-5" />
            <span>Invertir</span>
          </Link>
          
          <Link
            to="/withdraw"
            className="btn btn-secondary flex items-center justify-center space-x-2 py-3"
          >
            <ArrowUpFromLine className="w-5 h-5" />
            <span>Retirar</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary-600" />
            Actividad Reciente
          </h3>
          <Link 
            to="/history" 
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Ver todo →
          </Link>
        </div>

        {recentActivity.length === 0 ? (
          <EmptyState
            icon={AlertCircle}
            title="No hay actividad reciente"
            description="Comienza realizando tu primer depósito para empezar a invertir"
            action={
              <Link to="/deposit" className="btn btn-primary">
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                Hacer un Depósito
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Fecha
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Tipo
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Monto
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((transaction) => (
                  <tr 
                    key={transaction.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {new Date(transaction.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {TRANSACTION_TYPE_LABELS[transaction.type] || transaction.type}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-right">
                      <span className={
                        transaction.type === 'deposit' || transaction.type === 'daily_return'
                          ? 'text-success-600'
                          : transaction.type === 'withdrawal'
                          ? 'text-danger-600'
                          : 'text-gray-900'
                      }>
                        {transaction.type === 'deposit' || transaction.type === 'daily_return' ? '+' : '-'}
                        {formatCurrency(transaction.amount, user.country)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={transaction.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Information Card */}
      <div className="card bg-blue-50 border-l-4 border-primary-600">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Importante
            </h4>
            <p className="text-sm text-gray-700">
              Los depósitos y retiros requieren aprobación manual. 
              Recibirás una notificación cuando tu solicitud sea procesada.
              Tiempo estimado: 24-48 horas.
            </p>
          </div>
        </div>
      </div>

      {/* Country-specific Information */}
      {user.country === 'CO' && (
        <div className="card bg-gradient-to-r from-yellow-50 to-yellow-100">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">🇨🇴</div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Información para Colombia
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Depósitos mediante Bancolombia</li>
                <li>• Moneda: Pesos Colombianos (COP)</li>
                <li>• Depósito mínimo: {formatCurrency(40000, 'CO')}</li>
                <li>• Retiro mínimo: {formatCurrency(25000, 'CO')}</li>
              </ul>
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
                Información para Perú
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Depósitos mediante BCP</li>
                <li>• Moneda: Soles Peruanos (PEN)</li>
                <li>• Depósito mínimo: {formatCurrency(35, 'PE')}</li>
                <li>• Retiro mínimo: {formatCurrency(22, 'PE')}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
