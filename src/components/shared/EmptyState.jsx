import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Componente para mostrar estados vacíos
 * Usado cuando no hay transacciones, inversiones, etc.
 */
const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className = '' 
}) => {
  return (
    <div className={cn('text-center py-12', className)}>
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {action && action}
    </div>
  );
};

export default EmptyState;
