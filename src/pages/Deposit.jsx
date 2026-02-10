import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowDownToLine, 
  AlertCircle, 
  Upload, 
  X,
  CheckCircle2,
  Clock,
  Copy,
  FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { formatCurrency, getCurrencyCode } from '../utils/currency';
import { BANK_INFO, LIMITS } from '../utils/constants';
import { isValidImageFile } from '../utils/validators';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const Deposit = () => {
  const { user } = useAuth();
  const { addTransaction } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: '',
    proofFile: null,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const bankInfo = BANK_INFO[user.country];
  const limits = LIMITS[user.country];
  const currency = getCurrencyCode(user.country);

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setFormData(prev => ({ ...prev, amount: value }));
    
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setFormData(prev => ({ ...prev, proofFile: null }));
      return;
    }

    if (!isValidImageFile(file)) {
      setErrors(prev => ({ 
        ...prev, 
        proofFile: 'Archivo inválido. Solo se permiten JPG, PNG o PDF menores a 5MB' 
      }));
      setFormData(prev => ({ ...prev, proofFile: null }));
      return;
    }

    setFormData(prev => ({ ...prev, proofFile: file }));
    setErrors(prev => ({ ...prev, proofFile: '' }));
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, proofFile: null }));
    document.getElementById('proofFile').value = '';
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  const validateForm = () => {
    const newErrors = {};
    const numAmount = parseInt(formData.amount) || 0;

    if (!formData.amount || numAmount === 0) {
      newErrors.amount = 'Ingresa un monto válido';
    } else if (numAmount < limits.MIN_DEPOSIT) {
      newErrors.amount = `El monto mínimo es ${formatCurrency(limits.MIN_DEPOSIT, user.country)}`;
    }

    if (!formData.proofFile) {
      newErrors.proofFile = 'Debes subir el comprobante de pago';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setIsLoading(true);

    try {
      // Simular upload del archivo (en producción esto iría a un servidor)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Crear transacción de depósito con estado pendiente
      const transaction = addTransaction({
        type: 'deposit',
        amount: parseInt(formData.amount),
        status: 'pending',
        proofFileName: formData.proofFile.name,
        proofFileSize: formData.proofFile.size,
      });

      // Mostrar countdown de revisión
      setCountdown(48);

      // Toast de éxito
      toast.success('Depósito registrado exitosamente', { duration: 4000 });
      toast.success(
        'Tu depósito está en revisión. Recibirás una confirmación en 24-48 horas.',
        { duration: 6000 }
      );

      // Esperar 3 segundos y redirigir
      setTimeout(() => {
        navigate('/history');
      }, 3000);

    } catch (error) {
      console.error('Deposit error:', error);
      toast.error('Error al procesar el depósito. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.amount && parseInt(formData.amount) >= limits.MIN_DEPOSIT && formData.proofFile;

  if (countdown !== null) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success-100 rounded-full mb-6">
            <CheckCircle2 className="w-10 h-10 text-success-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            ¡Depósito Registrado!
          </h2>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Tu solicitud de depósito por <span className="font-bold text-primary-600">
              {formatCurrency(parseInt(formData.amount), user.country)}
            </span> ha sido recibida y está en proceso de revisión.
          </p>

          <div className="bg-blue-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-primary-600 mr-2" />
              <span className="text-lg font-semibold text-gray-900">
                Tiempo estimado de revisión
              </span>
            </div>
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {countdown} horas
            </div>
            <p className="text-sm text-gray-600">
              Recibirás una notificación cuando tu depósito sea aprobado
            </p>
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
          <ArrowDownToLine className="w-8 h-8 mr-3 text-primary-600" />
          Realizar Depósito
        </h1>
        <p className="text-gray-600 mt-2">
          Ingresa los detalles de tu depósito y sube el comprobante de pago
        </p>
      </div>

      {/* Alert importante */}
      <div className="card bg-yellow-50 border-l-4 border-yellow-400">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Importante: Proceso de Depósito
            </h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>1. Realiza la transferencia bancaria a la cuenta indicada abajo</p>
              <p>2. Toma una captura de pantalla o foto del comprobante</p>
              <p>3. Completa el formulario y sube el comprobante</p>
              <p>4. Tu depósito será revisado y aprobado en 24-48 horas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información Bancaria */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-primary-600" />
            Datos Bancarios para Transferencia
          </h2>

          <div className="space-y-4">
            {/* Banco */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banco
              </label>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  {bankInfo.bank}
                </span>
                <button
                  onClick={() => copyToClipboard(bankInfo.bank, 'Banco')}
                  className="text-primary-600 hover:text-primary-700 p-2"
                  title="Copiar"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Número de Cuenta */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Cuenta
              </label>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900 font-mono">
                  {bankInfo.accountNumber}
                </span>
                <button
                  onClick={() => copyToClipboard(bankInfo.accountNumber, 'Número de cuenta')}
                  className="text-primary-600 hover:text-primary-700 p-2"
                  title="Copiar"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tipo de Cuenta */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Cuenta
              </label>
              <span className="text-lg font-bold text-gray-900">
                {bankInfo.accountType}
              </span>
            </div>

            {/* Titular */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titular de la Cuenta
              </label>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  {bankInfo.holder}
                </span>
                <button
                  onClick={() => copyToClipboard(bankInfo.holder, 'Titular')}
                  className="text-primary-600 hover:text-primary-700 p-2"
                  title="Copiar"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Depósito */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Detalles del Depósito
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Monto */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Monto a Depositar *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="amount"
                  value={formData.amount}
                  onChange={handleAmountChange}
                  placeholder={`Mínimo: ${formatCurrency(limits.MIN_DEPOSIT, user.country)}`}
                  className={`input ${errors.amount ? 'border-danger-500' : ''}`}
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                  {currency}
                </div>
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-danger-600">{errors.amount}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Depósito mínimo: {formatCurrency(limits.MIN_DEPOSIT, user.country)}
              </p>
            </div>

            {/* Upload de comprobante */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comprobante de Pago *
              </label>
              
              {!formData.proofFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                  <input
                    type="file"
                    id="proofFile"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    className="hidden"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="proofFile"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <span className="text-sm font-medium text-gray-700 mb-1">
                      Haz click para subir el comprobante
                    </span>
                    <span className="text-xs text-gray-500">
                      JPG, PNG o PDF (máx. 5MB)
                    </span>
                  </label>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <FileText className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {formData.proofFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(formData.proofFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-danger-600 hover:text-danger-700 p-2"
                      disabled={isLoading}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {errors.proofFile && (
                <p className="mt-1 text-sm text-danger-600">{errors.proofFile}</p>
              )}
            </div>

            {/* Info adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">
                    El comprobante debe incluir:
                  </p>
                  <ul className="space-y-1 text-xs">
                    <li>• Fecha y hora de la transacción</li>
                    <li>• Monto transferido</li>
                    <li>• Número de cuenta destino</li>
                    <li>• Nombre del titular (MONETA-ICT)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="btn btn-primary w-full py-3 text-base"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="mx-auto" />
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  He Realizado el Pago
                </>
              )}
            </button>

            {!isFormValid && (
              <p className="text-sm text-gray-500 text-center">
                Completa todos los campos para continuar
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Info importante final */}
      <div className="card bg-gradient-to-r from-primary-50 to-primary-100">
        <h3 className="font-semibold text-gray-900 mb-3">
          ⏰ Tiempo de Procesamiento
        </h3>
        <p className="text-sm text-gray-700 mb-3">
          Una vez enviado el comprobante, nuestro equipo verificará tu depósito en un plazo de 24 a 48 horas.
          Recibirás una notificación por correo electrónico cuando tu depósito sea aprobado y el saldo esté disponible en tu cuenta.
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Nota:</span> Los depósitos realizados en fines de semana o días festivos serán procesados el siguiente día hábil.
        </p>
      </div>
    </div>
  );
};

export default Deposit;
