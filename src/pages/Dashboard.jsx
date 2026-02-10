import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import {
  Wallet,
  TrendingUp,
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  AlertCircle,
} from "lucide-react";

import StatsCard from "../components/shared/StatsCard";
import StatusBadge from "../components/shared/StatusBadge";
import EmptyState from "../components/shared/EmptyState";
import LoadingSpinner from "../components/shared/LoadingSpinner";

import { formatCurrency } from "../utils/currency";
import { formatDate } from "../utils/validators";
import { LIMITS, BANK_INFO } from "../utils/constants";

export default function Dashboard() {
  const { user } = useAuth();
  const {
    transactions,
    loading,
    getActiveInvestmentsCount,
    getTotalEarnings,
    getRecentTransactions,
  } = useApp();

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" text="Cargando dashboard..." />
      </div>
    );
  }

  const currency = user.country === "CO" ? "COP" : "PEN";

  const recentTransactions = getRecentTransactions(3);
  const activeInvestments = getActiveInvestmentsCount();
  const totalEarnings = getTotalEarnings();

  const getTransactionTypeLabel = (type) => {
    const labels = {
      deposit: "Depósito",
      withdrawal: "Retiro",
      investment: "Inversión",
      daily_return: "Ganancia Diaria",
      referral_bonus: "Bono Referido",
    };
    return labels[type] || type;
  };

  const getAmountColor = (type) => {
    if (
      type === "deposit" ||
      type === "daily_return" ||
      type === "referral_bonus"
    ) {
      return "text-success-600";
    }
    if (type === "withdrawal") {
      return "text-red-600";
    }
    return "text-gray-900";
  };

  const getAmountPrefix = (type) => {
    if (
      type === "deposit" ||
      type === "daily_return" ||
      type === "referral_bonus"
    ) {
      return "+";
    }
    if (type === "withdrawal") {
      return "-";
    }
    return "";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Hola, {user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Bienvenido a tu panel de inversiones
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          icon={Wallet}
          title="Balance Disponible"
          value={formatCurrency(user.balance || 0, currency)}
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
          value={formatCurrency(totalEarnings, currency)}
          subtitle="Retornos acumulados"
          gradient="from-warning-500 to-warning-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/deposit" className="btn btn-primary flex items-center justify-center">
          <ArrowDownCircle className="w-5 h-5 mr-2" />
          Depositar
        </Link>

        <Link to="/plans" className="btn btn-success flex items-center justify-center">
          <PiggyBank className="w-5 h-5 mr-2" />
          Invertir
        </Link>

        <Link to="/withdraw" className="btn btn-secondary flex items-center justify-center">
          <ArrowUpCircle className="w-5 h-5 mr-2" />
          Retirar
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">Actividad Reciente</h2>
          {transactions?.length > 3 && (
            <Link to="/history" className="text-sm text-primary-600">
              Ver todo →
            </Link>
          )}
        </div>

        {recentTransactions?.length > 0 ? (
          <table className="min-w-full divide-y">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase">Fecha</th>
                <th className="px-4 py-3 text-left text-xs uppercase">Tipo</th>
                <th className="px-4 py-3 text-right text-xs uppercase">Monto</th>
                <th className="px-4 py-3 text-right text-xs uppercase">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(tx.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {getTransactionTypeLabel(tx.type)}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${getAmountColor(tx.type)}`}>
                    {getAmountPrefix(tx.type)}
                    {formatCurrency(tx.amount, currency)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <StatusBadge status={tx.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* Important Info */}
      <div className="bg-blue-50 border rounded-lg p-6 mb-8">
        <div className="flex">
          <AlertCircle className="w-6 h-6 text-blue-600 mr-3" />
          <p className="text-sm text-blue-800">
            Los depósitos y retiros son revisados manualmente.
            Tu balance se actualizará automáticamente al aprobarse.
          </p>
        </div>
      </div>

      {/* Country Info */}
      <div className="bg-gray-900 text-white rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">
          {user.country === "CO"
            ? "🇨🇴 Información para Colombia"
            : "🇵🇪 Información para Perú"}
        </h3>

        <ul className="text-sm space-y-2">
          <li>• Método: {BANK_INFO?.[user.country]?.bank || "Transferencia bancaria"}</li>
          <li>• Moneda: {currency}</li>
          <li>
            • Depósito mínimo:{" "}
            {formatCurrency(LIMITS?.[user.country]?.MIN_DEPOSIT || 0, currency)}
          </li>
          <li>
            • Retiro mínimo:{" "}
            {formatCurrency(LIMITS?.[user.country]?.MIN_WITHDRAWAL || 0, currency)}
          </li>
        </ul>
      </div>
    </div>
  );
      }
