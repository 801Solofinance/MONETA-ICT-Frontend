import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Copy, 
  CheckCircle2,
  Gift,
  TrendingUp,
  Share2,
  Info,
  UserPlus
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import { LIMITS } from '../utils/constants';
import EmptyState from '../components/shared/EmptyState';

const Referrals = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  // Obtener referidos del usuario
  const referrals = useMemo(() => {
    const usersKey = 'moneta_users';
    const usersData = localStorage.getItem(usersKey);
    
    if (!usersData) return [];
    
    const allUsers = JSON.parse(usersData);
    
    // Filtrar usuarios que fueron referidos por este usuario
    return allUsers.filter(u => u.referredBy === user.referralCode);
  }, [user.referralCode]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalReferrals = referrals.length;
    const welcomeBonus = LIMITS[user.country].WELCOME_BONUS;
    const totalEarned = totalReferrals * welcomeBonus;

    return {
      totalReferrals,
      totalEarned,
      bonusPerReferral: welcomeBonus,
    };
  }, [referrals, user.country]);

  // Link de referido
  const referralLink = `${window.location.origin}/register?ref=${user.referralCode}`;

  // Copiar link al portapapeles
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Link copiado al portapapeles');
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
          <Users className="w-8 h-8 mr-3 text-primary-600" />
          Programa de Referidos
        </h1>
        <p className="text-gray-600 mt-2">
          Invita a tus amigos y gana bonos por cada registro exitoso
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Referidos */}
        <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-sm opacity-90">Total</span>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Referidos Totales</p>
            <h2 className="text-3xl font-bold">
              {stats.totalReferrals}
            </h2>
          </div>
        </div>

        {/* Bono por Referido */}
        <div className="card bg-gradient-to-br from-success-500 to-success-700 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Gift className="w-6 h-6" />
            </div>
            <span className="text-sm opacity-90">Por Referido</span>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Bono de Bienvenida</p>
            <h2 className="text-3xl font-bold">
              {formatCurrency(stats.bonusPerReferral, user.country)}
            </h2>
          </div>
        </div>

        {/* Total Ganado */}
        <div className="card bg-gradient-to-br from-warning-500 to-warning-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-sm opacity-90">Acumulado</span>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Total Ganado</p>
            <h2 className="text-3xl font-bold">
              {formatCurrency(stats.totalEarned, user.country)}
            </h2>
          </div>
        </div>
      </div>

      {/* Link de Referido */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Share2 className="w-6 h-6 text-primary-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">
            Tu Link de Referido
          </h2>
        </div>

        <div className="space-y-4">
          {/* Link Box */}
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 font-mono text-sm text-gray-700 overflow-x-auto">
              {referralLink}
            </div>
            <button
              onClick={copyToClipboard}
              className={`btn ${copied ? 'btn-success' : 'btn-primary'} flex items-center space-x-2 whitespace-nowrap`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>

          {/* Código de referido */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Tu código de referido:</span>
            </p>
            <div className="flex items-center space-x-3">
              <div className="bg-white border-2 border-primary-600 rounded-lg px-6 py-3">
                <span className="text-2xl font-bold text-primary-600 tracking-wider">
                  {user.referralCode}
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(user.referralCode);
                  toast.success('Código copiado');
                }}
                className="btn btn-secondary btn-sm"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cómo Funciona */}
      <div className="card bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              ¿Cómo funciona el programa de referidos?
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start">
                <span className="font-bold text-primary-600 mr-2">1.</span>
                <p>
                  Comparte tu link de referido o código con tus amigos y familiares
                </p>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-primary-600 mr-2">2.</span>
                <p>
                  Cuando se registren usando tu link, automáticamente quedarán vinculados a tu cuenta
                </p>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-primary-600 mr-2">3.</span>
                <p>
                  Por cada registro exitoso, ambos reciben un bono de bienvenida de{' '}
                  <span className="font-bold text-primary-600">
                    {formatCurrency(stats.bonusPerReferral, user.country)}
                  </span>
                </p>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-primary-600 mr-2">4.</span>
                <p>
                  Los bonos se acreditan automáticamente al completar el registro
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Referidos */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <UserPlus className="w-6 h-6 mr-2 text-primary-600" />
            Mis Referidos ({stats.totalReferrals})
          </h2>
        </div>

        {referrals.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Aún no tienes referidos"
            description="Comparte tu link de referido para comenzar a ganar bonos por cada nuevo usuario que invites."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    #
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Nombre
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Fecha de Registro
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Bono Ganado
                  </th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral, index) => (
                  <tr 
                    key={referral.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    {/* Número */}
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {index + 1}
                    </td>

                    {/* Nombre */}
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {referral.name}
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {referral.email}
                    </td>

                    {/* Fecha */}
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {formatDate(referral.createdAt)}
                    </td>

                    {/* Estado */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        referral.status === 'active'
                          ? 'bg-success-100 text-success-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {referral.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    {/* Bono */}
                    <td className="py-3 px-4 text-sm font-bold text-success-600 text-right">
                      +{formatCurrency(stats.bonusPerReferral, user.country)}
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* Total */}
              <tfoot>
                <tr className="bg-gray-50 border-t-2 border-gray-300">
                  <td colSpan="5" className="py-3 px-4 text-sm font-bold text-gray-900 text-right">
                    Total Ganado:
                  </td>
                  <td className="py-3 px-4 text-lg font-bold text-success-600 text-right">
                    {formatCurrency(stats.totalEarned, user.country)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Tips para compartir */}
      <div className="card bg-gradient-to-r from-yellow-50 to-yellow-100">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Gift className="w-5 h-5 mr-2 text-yellow-600" />
          Tips para compartir tu link
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600">•</span>
            <p>Comparte en tus redes sociales (WhatsApp, Facebook, Instagram)</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600">•</span>
            <p>Envía el link directamente a amigos y familiares</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600">•</span>
            <p>Explica los beneficios de MONETA-ICT</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600">•</span>
            <p>Menciona el bono de bienvenida que ambos recibirán</p>
          </div>
        </div>
      </div>

      {/* Country-specific info */}
      {user.country === 'CO' && (
        <div className="card bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">🇨🇴</div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Programa de Referidos en Colombia
              </h4>
              <p className="text-sm text-gray-700">
                Por cada amigo que se registre con tu código, ambos reciben{' '}
                <span className="font-bold text-primary-600">
                  {formatCurrency(stats.bonusPerReferral, user.country)}
                </span>{' '}
                de bono de bienvenida. No hay límite en la cantidad de referidos.
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
                Programa de Referidos en Perú
              </h4>
              <p className="text-sm text-gray-700">
                Por cada amigo que se registre con tu código, ambos reciben{' '}
                <span className="font-bold text-primary-600">
                  {formatCurrency(stats.bonusPerReferral, user.country)}
                </span>{' '}
                de bono de bienvenida. No hay límite en la cantidad de referidos.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Referrals;
