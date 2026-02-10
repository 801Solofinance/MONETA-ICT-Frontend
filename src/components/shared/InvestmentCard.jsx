import React from 'react';
import { TrendingUp, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { cn } from '../../utils/cn';

/**
 * Tarjeta de plan de inversión
 */
const InvestmentCard = ({ plan, country, onInvest, featured = false }) => {
  const planData = country === 'CO' ? plan.co : plan.pe;

  return (
    <div
      className={cn(
        'card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1',
        featured && 'border-2 border-primary-500 relative'
      )}
    >
      {/* Badge de destacado */}
      {featured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            ⭐ MÁS POPULAR
          </span>
        </div>
      )}

      {/* Header con icono y nombre */}
      <div className="text-center mb-4">
        <div className="text-5xl mb-3">{plan.icon}</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Plan {plan.name}
        </h3>
        <p className="text-sm text-gray-600">
          {plan.description}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* Detalles del plan */}
      <div className="space-y-3 mb-6">
        {/* Inversión mínima */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-primary-600" />
            Inversión Mínima
          </span>
          <span className="font-bold text-gray-900">
            {formatCurrency(planData.minInvestment, country)}
          </span>
        </div>

        {/* Retorno diario */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-success-600" />
            Retorno Diario
          </span>
          <span className="font-bold text-success-600">
            {formatCurrency(planData.dailyReturn, country)}
          </span>
        </div>

        {/* Duración */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-warning-600" />
            Duración
          </span>
          <span className="font-bold text-gray-900">
            {plan.duration} días
          </span>
        </div>
      </div>

      {/* ROI Badge */}
      <div className="bg-gradient-to-r from-primary-50 to-success-50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Retorno Total
          </span>
          <span className="text-lg font-bold text-primary-700">
            {formatCurrency(planData.totalReturn, country)}
          </span>
        </div>
        <div className="mt-1 text-xs text-gray-600">
          ROI: {planData.percentage}% de ganancia
        </div>
      </div>

      {/* Features */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Beneficios incluidos:
        </p>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm text-gray-600">
              <CheckCircle2 className="w-4 h-4 mr-2 text-success-600 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Botón de inversión */}
      <button
        onClick={() => onInvest(plan)}
        className={cn(
          'btn w-full py-3 text-base',
          featured ? 'btn-primary' : 'btn-success'
        )}
      >
        Invertir Ahora
      </button>
    </div>
  );
};

export default InvestmentCard;
