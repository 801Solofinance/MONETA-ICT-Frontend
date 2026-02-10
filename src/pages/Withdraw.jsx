import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpFromLine, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  Wallet,
  Building2,
  CreditCard,
  Hash
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { formatCurrency, getCurrencyCode } from '../utils/currency';
import { AVAILABLE_BANKS, ACCOUNT_TYPES, LIMITS } from '../utils/constants';
import { isValidAccountNumber } from '../utils/validators';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const Withdraw = () => {
  const { user } = useAuth();
  const { addTransaction, getBalance } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: '',
    bank: '',
    accountNumber: '',
    accountType: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const userBalance = getBalance();
  const limits = LIMITS[user.country];
  const currency = getCurrencyCode(user.country);
  const availableBanks = AVAILABLE_BANKS[user.country];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let fieldValue = value;
    if (name === 'amount') {
      fieldValue = value.replace(/[^\d]/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: fieldValue }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const numAmount = parseInt(formData.amount) || 0;

    // Validar monto
    if (!formData.amount || numAmount === 0) {
      newErrors.amount = 'Ingresa un monto válido';
    } else if (numAmount < limits.MIN_WITHDRAWAL) {
      newErrors.amount = `El monto mínimo es ${formatCurrency(limits.MIN_WITHDRAWAL, user.country)}`;
    } else if (numAmount > userBalance) {
      newErrors.amount = 'Saldo insuficiente';
    }

    // Validar banco
    if (!formData.bank) {
      newErrors.bank = 'Selecciona un banco';
    }

    // Validar número de cuenta
    if (!formData.accountNumber) {
      newErrors.accountNumber = 'Ingresa el número de cuenta';
    } else if (!isValidAccountNumber(formData.accountNumber)) {
      newErrors.accountNumber = 'Número de cuenta inválido (8-20 dígitos)';
    }

    // Validar tipo de cuenta
    if (!formData.accountType) {
      newErrors.accountType = 'Selecciona el tipo de cuenta';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor completa todos los campos correctamente');
      return;
    }

    setIsLoading(true);

    try {
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Crear transacción de retiro con estado pendiente
      const transaction = addTransaction({
        type: 'withdrawal',
        amount: parseInt(formData.amount),
        status: 'pending',
        bankName: formData.bank,
        accountNumber: formData.accountNumber,
        accountType: formData.accountType,
      });

      // Mostrar countdown de revisión
      setCountdown(48);

      // Toast de éxito
      toast.success('Solicitud de retiro registrada exitosamente', { duration: 4000 });
      toast.success(
        'Tu retiro está en revisión. Recibirás el pago en 24-48 horas.',
        { duration: 6000 }
      );

      // Esperar 3 segundos y redirigir
      setTimeout(() => {
        navigate('/history');
      }, 3000);

    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error('Error al procesar el retiro. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateFee = () => {
    // En este caso no hay comisión, pero se puede agregar aquí
    return 0;
  };

  const getNetAmount = () => {
    const amount = parseInt(formData.amount) || 0;
    return amount - calculateFee();
  };

  const isFormValid = 
    formData.amount && 
    parseInt(formData.amount) >= limits.MIN_WITHDRAWAL &&
    parseInt(formData.amount) <= userBalance &&
    formData.bank && 
    formData.accountNumber && 
    isValidAccountNumber(formData.accountNumber) &&
    formData.accountType;

  if (countdown !== null) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success-100 rounded-full mb-6">
            <CheckCircle2 className="w-10 h-10 text-success-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            ¡Retiro Solicitado!
          </h2>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Tu solicitud de retiro por <span className="font-bold text-primary-600">
              {formatCurrency(parseInt(formData.amount), user.country)}
            </span> ha sido recibida y está en proceso de revisión.
          </p>

          <div className="bg-blue-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-primary-600 mr-2" />
              <span className="text-lg font-semibold text-gray-900">
                Tiempo estimado de procesamiento
              </span>
            </div>
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {countdown} horas
            </div>
            <p className="text-sm text-gray-600">
              Recibirás el pago en tu cuenta bancaria
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto text-left">
            <h3 className="font-semibold text-gray-900 mb-2 text-center">
              Detalles del Retiro
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Banco:</span>
                <span className="font-medium text-gray-900">{formData.bank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cuenta:</span>
                <span className="font-medium text-gray-900 font-mono">{formData.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-medium text-gray-900">{formData.accountType}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/history')}
              className="btn btn-primary w-full max-w-xs"
            >
              Ver Historial de Transacciones
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary w-full max-w-xs"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
          <ArrowUpFromLine className="w-8 h-8 mr-3 text-primary-600" />
          Solicitar Retiro
        </h1>
        <p className="text-gray-600 mt-2">
          Retira tus fondos a tu cuenta bancaria
        </p>
      </div>

      {/* Balance Card */}
      <div className="card bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1 flex items-center">
              <Wallet className="w-4 h-4 mr-2" />
              Balance Disponible
            </p>
            <h2 className="text-3xl font-bold">
              {formatCurrency(userBalance, user.country)}
            </h2>
          </div>
          <div className="text-5xl opacity-20">💰</div>
        </div>
        {userBalance === 0 && (
          <div className="mt-4 bg-white/20 rounded-lg p-3">
            <p className="text-sm">
              ⚠️ No tienes balance disponible para retirar.
            </p>
          </div>
        )}
      </div>

      {/* Alert importante */}
      <div className="card bg-yellow-50 border-l-4 border-yellow-400">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Importante: Proceso de Retiro
            </h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Tu solicitud será revisada por nuestro equipo</p>
              <p>• El retiro será procesado en 24-48 horas hábiles</p>
              <p>• El pago se realizará a la cuenta bancaria indicada</p>
              <p>• Recibirás una confirmación por correo electrónico</p>
              <p>• Retiro mínimo: {formatCurrency(limits.MIN_WITHDRAWAL, user.country)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Datos del Retiro
        </h2>

        <div className="space-y-6">
          {/* Monto */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Monto a Retirar *
            </label>
            <div className="relative">
              <input
                type="text"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder={`Mínimo: ${formatCurrency(limits.MIN_WITHDRAWAL, user.country)}`}
                className={`input ${errors.amount ? 'border-danger-500' : ''}`}
                disabled={isLoading || userBalance === 0}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                {currency}
              </div>
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-danger-600">{errors.amount}</p>
            )}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>Mínimo: {formatCurrency(limits.MIN_WITHDRAWAL, user.country)}</span>
              <span>Máximo: {formatCurrency(userBalance, user.country)}</span>
            </div>
          </div>

          {/* Banco */}
          <div>
            <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-gray-500" />
              Banco Destino *
            </label>
            <select
              id="bank"
              name="bank"
              value={formData.bank}
              onChange={handleChange}
              className={`input appearance-none cursor-pointer ${errors.bank ? 'border-danger-500' : ''}`}
              disabled={isLoading}
            >
              <option value="">Selecciona tu banco</option>
              {availableBanks.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
            {errors.bank && (
              <p className="mt-1 text-sm text-danger-600">{errors.bank}</p>
            )}
          </div>

          {/* Número de Cuenta */}
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Hash className="w-4 h-4 mr-2 text-gray-500" />
              Número de Cuenta *
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Ingresa tu número de cuenta"
              className={`input font-mono ${errors.accountNumber ? 'border-danger-500' : ''}`}
              disabled={isLoading}
              maxLength={20}
            />
            {errors.accountNumber && (
              <p className="mt-1 text-sm text-danger-600">{errors.accountNumber}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Entre 8 y 20 dígitos
            </p>
          </div>

          {/* Tipo de Cuenta */}
          <div>
            <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
              Tipo de Cuenta *
            </label>
            <select
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              className={`input appearance-none cursor-pointer ${errors.accountType ? 'border-danger-500' : ''}`}
              disabled={isLoading}
            >
              <option value="">Selecciona el tipo de cuenta</option>
              {ACCOUNT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.accountType && (
              <p className="mt-1 text-sm text-danger-600">{errors.accountType}</p>
            )}
          </div>

          {/* Resumen */}
          {formData.amount && parseInt(formData.amount) > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Resumen del Retiro
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monto solicitado:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(parseInt(formData.amount), user.country)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Comisión:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(calculateFee(), user.country)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Recibirás:</span>
                  <span className="font-bold text-primary-600 text-lg">
                    {formatCurrency(getNetAmount(), user.country)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Info adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">
                  Verifica tus datos bancarios
                </p>
                <p className="text-xs">
                  Asegúrate de que el número de cuenta sea correcto. 
                  Los retiros a cuentas incorrectas no podrán ser reembolsados.
                </p>
              </div>
            </div>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading || userBalance === 0}
            className="btn btn-primary w-full py-3 text-base"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" className="mx-auto" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Solicitar Retiro
              </>
            )}
          </button>

          {!isFormValid && userBalance > 0 && (
            <p className="text-sm text-gray-500 text-center">
              Completa todos los campos para continuar
            </p>
          )}
        </div>
      </form>

      {/* Info importante final */}
      <div className="card bg-gradient-to-r from-primary-50 to-primary-100">
        <h3 className="font-semibold text-gray-900 mb-3">
          ⏰ Tiempo de Procesamiento
        </h3>
        <p className="text-sm text-gray-700 mb-3">
          Una vez aprobada tu solicitud, el pago será transferido a tu cuenta bancaria en un plazo de 24 a 48 horas hábiles.
          Recibirás una confirmación por correo electrónico cuando el retiro sea procesado.
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Nota:</span> Los retiros solicitados en fines de semana o días festivos serán procesados el siguiente día hábil.
        </p>
      </div>
    </div>
  );
};

export default Withdraw;
