import React, { useState, useMemo } from 'react';
import { 
  History as HistoryIcon, 
  Filter, 
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import { TRANSACTION_TYPE_LABELS } from '../utils/constants';
import StatusBadge from '../components/shared/StatusBadge';
import EmptyState from '../components/shared/EmptyState';

const ITEMS_PER_PAGE = 10;

const FILTER_OPTIONS = [
  { value: 'all', label: 'Todas las Transacciones' },
  { value: 'deposit', label: 'Depósitos' },
  { value: 'withdrawal', label: 'Retiros' },
  { value: 'investment', label: 'Inversiones' },
  { value: 'daily_return', label: 'Ganancias Diarias' },
];

const History = () => {
  const { user } = useAuth();
  const { transactions } = useApp();

  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrar y buscar transacciones
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filtrar por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Buscar por monto
    if (searchTerm) {
      const searchAmount = parseInt(searchTerm.replace(/[^\d]/g, '')) || 0;
      filtered = filtered.filter(t => {
        const amountStr = t.amount.toString();
        return amountStr.includes(searchAmount.toString());
      });
    }

    // Ordenar por fecha (más reciente primero)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return filtered;
  }, [transactions, filterType, searchTerm]);

  // Paginación
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Cambiar página
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Resetear a página 1 cuando cambian filtros
  const handleFilterChange = (value) => {
    setFilterType(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Obtener color del monto según tipo
  const getAmountColor = (type) => {
    if (type === 'deposit' || type === 'daily_return') {
      return 'text-success-600';
    } else if (type === 'withdrawal') {
      return 'text-danger-600';
    }
    return 'text-gray-900';
  };

  // Obtener signo del monto
  const getAmountSign = (type) => {
    if (type === 'deposit' || type === 'daily_return') {
      return '+';
    } else if (type === 'withdrawal') {
      return '-';
    }
    return '';
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Exportar (placeholder para futura implementación)
  const handleExport = () => {
    // TODO: Implementar exportación a CSV/PDF
    alert('Funcionalidad de exportación próximamente');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
          <HistoryIcon className="w-8 h-8 mr-3 text-primary-600" />
          Historial de Transacciones
        </h1>
        <p className="text-gray-600 mt-2">
          Revisa todas tus transacciones y su estado actual
        </p>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro por Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Tipo
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="input pl-10 appearance-none cursor-pointer"
              >
                {FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Búsqueda por Monto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por Monto
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Ej: 50000"
                className="input pl-10"
              />
            </div>
          </div>

          {/* Botón Exportar */}
          <div className="flex items-end">
            <button
              onClick={handleExport}
              className="btn btn-secondary w-full flex items-center justify-center"
              disabled
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>

        {/* Resultados encontrados */}
        {filteredTransactions.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Mostrando {startIndex + 1} - {Math.min(endIndex, filteredTransactions.length)} de {filteredTransactions.length} transacciones
          </div>
        )}
      </div>

      {/* Tabla de Transacciones */}
      {currentTransactions.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="No hay transacciones"
          description={
            filterType !== 'all' || searchTerm
              ? 'No se encontraron transacciones con los filtros aplicados'
              : 'Aún no has realizado ninguna transacción. Comienza haciendo un depósito.'
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
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
                {currentTransactions.map((transaction) => (
                  <tr 
                    key={transaction.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    {/* Fecha */}
                    <td className="py-3 px-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{formatDate(transaction.createdAt)}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 ml-6">
                        {new Date(transaction.createdAt).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    {/* Tipo */}
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {TRANSACTION_TYPE_LABELS[transaction.type] || transaction.type}
                    </td>

                    {/* Monto */}
                    <td className="py-3 px-4 text-sm font-medium text-right">
                      <span className={getAmountColor(transaction.type)}>
                        {getAmountSign(transaction.type)}
                        {formatCurrency(transaction.amount, user.country)}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={transaction.status} />
                    </td>

                    {/* Detalles */}
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {transaction.type === 'withdrawal' && transaction.bankName && (
                        <div className="text-xs">
                          {transaction.bankName}
                          <br />
                          {transaction.accountNumber}
                        </div>
                      )}
                      {transaction.type === 'deposit' && transaction.proofFileName && (
                        <div className="text-xs">
                          Comprobante adjunto
                        </div>
                      )}
                      {transaction.type === 'investment' && transaction.reference && (
                        <div className="text-xs">
                          Inversión activa
                        </div>
                      )}
                      {!transaction.bankName && !transaction.proofFileName && !transaction.reference && (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-secondary text-sm"
                >
                  Anterior
                </button>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary text-sm ml-3"
                >
                  Siguiente
                </button>
              </div>

              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Página <span className="font-medium">{currentPage}</span> de{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {/* Números de página */}
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      // Mostrar solo páginas cercanas
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span
                            key={page}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info de estados */}
      <div className="card bg-blue-50">
        <h3 className="font-semibold text-gray-900 mb-3">
          Estados de las Transacciones
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <StatusBadge status="pending" />
            <span className="text-gray-700">
              En revisión (24-48 horas)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status="approved" />
            <span className="text-gray-700">
              Aprobado y procesado
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status="rejected" />
            <span className="text-gray-700">
              Rechazado o cancelado
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
