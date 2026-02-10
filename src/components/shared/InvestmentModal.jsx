import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import LoadingSpinner from './LoadingSpinner';
import { cn } from '../../utils/cn';

/**
 * Modal de confirmación de inversión
 */
const InvestmentModal = ({ 
  plan, 
  country, 
  userBalance, 
  onConfirm, 
  onCancel,
  isOpen 
}) => {
  const [amount, setAmount] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !plan) return null;

  const planData = country === 'CO' ? plan.co : plan.pe;
  const minInvestment = planData.minInvestment;

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setAmount(value);
    setError('');
  };

  const validateAmount = () => {
    const numAmount = parseInt(amount) || 0;

    if (!amount || numAmount === 0) {
      setError('Ingresa un monto válido');
      return false;
    }

    if (numAmount < minInvestment) {
      setError(`El monto mínimo es ${formatCurrency(minInvestment, country)}`);
      return false;
    }

    if (numAmount > userBalance) {
      setError('Saldo insuficiente. Realiza un depósito primero.');
      return false;
    }

    return true;
  };

  const handleConfirm = async () => {
    if (!validateAmount()) return;

    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onConfirm({
        planId: plan.id,
        planName: plan.name,
        amount: parseInt(amount),
        dailyReturn: planData.dailyReturn,
        duration: plan.duration,
      });
    } catch (err) {
      setError(err.message || 'Error al procesar la inversión');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDailyReturn = () => {
    const numAmount = parseInt(amount) || 0;
    if (numAmount === 0) return 0;
    
    // Calcular retorno proporcional
    const returnRate = planData.dailyReturn / planData.minInvestment;
    return Math.floor(numAmount * returnRate);
  };

  const calculateTotalReturn = () => {
    return calculateDailyReturn() * plan.duration;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Confirmar Inversión
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Plan Info */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="text-3xl">{plan.icon}</div>
              <div>
                <h3 className="font-bold text-gray-900">Plan {plan.name}</h3>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Duración:</span>
                <p className="font-semibold text-gray-900">{plan.duration} días</p>
              </div>
              <div>
                <span className="text-gray-600">ROI:</span>
                <p className="font-semibold text-success-600">{planData.percentage}%</p>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto a Invertir *
            </label>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder={`Mínimo: ${formatCurrency(minInvestment, country)}`}
              className={cn(
                'input',
                error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
              )}
              disabled={isLoading}
            />
            {error && (
              <p className="mt-1 text-sm text-danger-600 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>

          {/* Balance Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Tu Balance Disponible:</span>
              <span className="font-bold text-gray-900">
                {formatCurrency(userBalance, country)}
              </span>
            </div>
          </div>

          {/* Calculations */}
          {amount && parseInt(amount) >= minInvestment && (
            <div className="space-y-3">
              <div className="border-t border-gray-200 pt-3">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-primary-600" />
                  Proyección de Ganancias
                </h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Retorno Diario:</span>
                    <span className="font-bold text-success-600">
                      {formatCurrency(calculateDailyReturn(), country)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Retorno Total ({plan.duration} días):</span>
                    <span className="font-bold text-success-600">
                      {formatCurrency(calculateTotalReturn(), country)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-900 font-semibold">Total al Finalizar:</span>
                    <span className="font-bold text-primary-600 text-lg">
                      {formatCurrency(parseInt(amount) + calculateTotalReturn(), country)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Terms */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                disabled={isLoading}
              />
              <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">
                Acepto los{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                  términos y condiciones
                </a>{' '}
                de inversión. Entiendo que los retornos están sujetos a las condiciones
                del mercado y que MONETA-ICT no garantiza ganancias específicas.
              </label>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5 mr-2" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Importante:</p>
                <p>
                  Una vez confirmada la inversión, el monto será deducido de tu balance
                  y comenzarás a recibir retornos diarios de forma automática.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex space-x-3 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="btn btn-secondary flex-1 py-3"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="btn btn-primary flex-1 py-3"
            disabled={isLoading || !acceptTerms}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" className="mx-auto" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Confirmar Inversión
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;
