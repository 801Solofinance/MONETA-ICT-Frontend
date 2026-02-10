import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { Wallet, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { formatCurrency } from "../utils/currency";

export default function Dashboard() {
  const { user } = useAuth();
  const { loading } = useApp();

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const country = user.country || "CO";

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Hola, {user.name?.split(" ")[0]} 👋
      </h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <Wallet className="mr-3" />
          <div>
            <p className="text-gray-600">Balance Disponible</p>
            <p className="text-2xl font-bold">
              {formatCurrency(user.balance || 0, country)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link to="/deposit" className="btn btn-primary flex items-center">
          <ArrowDownCircle className="mr-2" />
          Depositar
        </Link>

        <Link to="/withdraw" className="btn btn-secondary flex items-center">
          <ArrowUpCircle className="mr-2" />
          Retirar
        </Link>
      </div>

    </div>
  );
}
