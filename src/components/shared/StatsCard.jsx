import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Componente de tarjeta estadística reutilizable
 * Usado en el dashboard para mostrar métricas importantes
 */
const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  subtitle = '',
  gradient = 'from-primary-500 to-primary-700',
  className = '' 
}) => {
  return (
    <div className={cn(
      'card bg-gradient-to-br text-white',
      gradient,
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-lg">
          <Icon className="w-6 h-6" />
        </div>
        {subtitle && (
          <span className="text-sm opacity-90">{subtitle}</span>
        )}
      </div>
      <div>
        <p className="text-sm opacity-90 mb-1">{title}</p>
        <h2 className="text-3xl font-bold">
          {value}
        </h2>
      </div>
    </div>
  );
};

export default StatsCard;
