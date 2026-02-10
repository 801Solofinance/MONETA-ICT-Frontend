import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import { TRANSACTION_TYPE_LABELS } from '../utils/constants';
import StatusBadge from '../components/shared/StatusBadge';

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // overview, transactions, users
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener todos los datos del sistema
  const systemData = useMemo(() => {
    // Usuarios
    const usersKey = 'moneta_users';
    const usersData = localStorage.getItem(usersKey);
    const allUsers = usersData ? JSON.parse(usersData) : [];

    // Transacciones de todos los usuarios
    let allTransactions = [];
    allUsers.forEach(u => {
      const transKey = `moneta_transactions_${u.id}`;
      const transData = localStorage.getItem(transKey);
      if (transData) {
        const userTransactions = JSON.parse(transData).map(t => ({
          ...t,
          userName: u.name,
          userEmail: u.email,
          userCountry: u.country,
        }));
        allTransactions = [...allTransactions, ...userTransactions];
      }
    });

    // Ordenar por fecha
    allTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      users: allUsers,
      transactions: allTransactions,
    };
  }, []);

  // Estadísticas del sistema
  const systemStats = useMemo(() => {
    const { users, transactions } = systemData;

    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    
    const pendingDeposits = transactions.filter(
      t => t.type === 'deposit' && t.status === 'pending'
    );
    const pendingWithdrawals = transactions.filter(
      t => t.type === 'withdrawal' && t.status === 'pending'
    );
    
    const totalPendingDepositAmount = pendingDeposits.reduce((sum, t) => sum + t.amount, 0);
    const totalPendingWithdrawalAmount = pendingWithdrawals.reduce((sum, t) => sum + t.amount, 0);

    const totalTransactions = transactions.length;
    const approvedTransactions = transactions.filter(t => t.status === 'approved').length;
    const rejectedTransactions = transactions.filter(t => t.status === 'rejected').length;

    return {
      totalUsers,
      activeUsers,
      pendingDeposits: pendingDeposits.length,
      pendingWithdrawals: pendingWithdrawals.length,
      totalPendingDepositAmount,
      totalPendingWithdrawalAmount,
      totalTransactions,
      approvedTransactions,
      rejectedTransactions,
    };
  }, [systemData]);

  // Filtrar transacciones
  const filteredTransactions = useMemo(() => {
    let filtered = [...systemData.transactions];

    // Filtrar por tipo
    if (filterType !== 'all') {
      if (filterType === 'pending') {
        filtered = filtered.filter(t => t.status === 'pending');
      } else {
        filtered = filtered.filter(t => t.type === filterType);
      }
    }

    // Buscar por nombre o email
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [systemData.transactions, filterType, searchTerm]);

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
          <Shield className="w-8 h-8 mr-3 text-primary-600" />
          Panel Administrativo
        </h1>
        <p className="text-gray-600 mt-2">
          Vista general del sistema - Solo lectura
        </p>
      </div>

      {/* Alerta Importante */}
      <div className="card bg-yellow-50 border-l-4 border-yellow-400">
        <div className="flex items-start space-x-3">
          <MessageSquare className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Información Importante
            </h4>
            <p className="text-sm text-gray-700">
              Este panel es de <span className="font-bold">solo lectura</span>. 
              Las aprobaciones y rechazos de depósitos y retiros se realizan 
              manualmente a través del <span className="font-bold">bot de Telegram</span>.
              Aquí puedes revisar el estado del sistema y las transacciones pendientes.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vista General
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'transactions'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Transacciones ({systemStats.totalTransactions})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'users'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Usuarios ({systemStats.totalUsers})
            </button>
          </nav>
        </div>
      </div>

      {/* Tab: Vista General */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Estadísticas Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Usuarios */}
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">
                {systemStats.totalUsers}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {systemStats.activeUsers} activos
              </p>
            </div>

            {/* Depósitos Pendientes */}
            <div className="card bg-warning-50">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-warning-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Depósitos Pendientes</p>
              <p className="text-2xl font-bold text-warning-600">
                {systemStats.pendingDeposits}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Requieren revisión
              </p>
            </div>

            {/* Retiros Pendientes */}
            <div className="card bg-danger-50">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-danger-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Retiros Pendientes</p>
              <p className="text-2xl font-bold text-danger-600">
                {systemStats.pendingWithdrawals}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Requieren procesamiento
              </p>
            </div>

            {/* Total Transacciones */}
            <div className="card bg-success-50">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-success-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Transacciones</p>
              <p className="text-2xl font-bold text-success-600">
                {systemStats.totalTransactions}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {systemStats.approvedTransactions} aprobadas
              </p>
            </div>
          </div>

          {/* Transacciones Pendientes Destacadas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Depósitos Pendientes */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-warning-600" />
                Depósitos Pendientes de Aprobación
              </h3>
              
              {systemData.transactions
                .filter(t => t.type === 'deposit' && t.status === 'pending')
                .slice(0, 5)
                .map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="border-b border-gray-100 last:border-0 py-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">
                        {transaction.userName}
                      </span>
                      <span className="font-bold text-warning-600">
                        {formatCurrency(transaction.amount, transaction.userCountry)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{transaction.userEmail}</span>
                      <span>{formatDate(transaction.createdAt)}</span>
                    </div>
                  </div>
                ))}
              
              {systemStats.pendingDeposits === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay depósitos pendientes
                </p>
              )}
            </div>

            {/* Retiros Pendientes */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-danger-600" />
                Retiros Pendientes de Procesamiento
              </h3>
              
              {systemData.transactions
                .filter(t => t.type === 'withdrawal' && t.status === 'pending')
                .slice(0, 5)
                .map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="border-b border-gray-100 last:border-0 py-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">
                        {transaction.userName}
                      </span>
                      <span className="font-bold text-danger-600">
                        {formatCurrency(transaction.amount, transaction.userCountry)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>{transaction.userEmail}</span>
                      <span>{formatDate(transaction.createdAt)}</span>
                    </div>
                    {transaction.bankName && (
                      <div className="text-xs text-gray-600">
                        {transaction.bankName} - {transaction.accountNumber}
                      </div>
                    )}
                  </div>
                ))}
              
              {systemStats.pendingWithdrawals === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay retiros pendientes
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Transacciones */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          {/* Filtros */}
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por Tipo/Estado
                </label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="input pl-10 appearance-none cursor-pointer"
                  >
                    <option value="all">Todas las Transacciones</option>
                    <option value="pending">Pendientes</option>
                    <option value="deposit">Depósitos</option>
                    <option value="withdrawal">Retiros</option>
                    <option value="investment">Inversiones</option>
                    <option value="daily_return">Ganancias Diarias</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Usuario
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nombre o email..."
                    className="input pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de Transacciones */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Usuario
                    </th>
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
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Detalles
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.slice(0, 50).map((transaction) => (
                    <tr 
                      key={transaction.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm">
                        <div className="font-medium text-gray-900">
                          {transaction.userName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.userEmail}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {TRANSACTION_TYPE_LABELS[transaction.type] || transaction.type}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-right">
                        {formatCurrency(transaction.amount, transaction.userCountry)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={transaction.status} />
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600">
                        {transaction.bankName && (
                          <div>{transaction.bankName}</div>
                        )}
                        {transaction.proofFileName && (
                          <div>Comprobante: {transaction.proofFileName}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No se encontraron transacciones
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Usuarios */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Tabla de Usuarios */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Nombre
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      País
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Teléfono
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Balance
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      Estado
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Registro
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {systemData.users.map((u) => (
                    <tr 
                      key={u.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {u.name}
                        {u.role === 'admin' && (
                          <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-0.5 rounded">
                            Admin
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {u.email}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {u.country === 'CO' ? '🇨🇴 Colombia' : '🇵🇪 Perú'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {u.phone}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-right">
                        {formatCurrency(u.balance || 0, u.country)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          u.status === 'active'
                            ? 'bg-success-100 text-success-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {u.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {formatDate(u.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
