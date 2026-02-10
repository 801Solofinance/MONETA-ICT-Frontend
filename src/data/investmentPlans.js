/**
 * Planes de inversión disponibles
 * Cada plan tiene montos específicos para Colombia (COP) y Perú (PEN)
 */

export const INVESTMENT_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Plan inicial perfecto para comenzar tu camino en las inversiones',
    icon: '🌱',
    duration: 30,
    co: {
      minInvestment: 50000,
      dailyReturn: 8600,
      totalReturn: 258000,
      percentage: 17.2,
    },
    pe: {
      minInvestment: 130,
      dailyReturn: 22,
      totalReturn: 660,
      percentage: 17.2,
    },
    features: [
      'Retiros cada 24 horas',
      'Sin comisiones ocultas',
      'Soporte prioritario',
    ],
  },
  {
    id: 'basico',
    name: 'Básico',
    description: 'Ideal para inversores que buscan rendimientos constantes',
    icon: '💼',
    duration: 30,
    co: {
      minInvestment: 100000,
      dailyReturn: 18000,
      totalReturn: 540000,
      percentage: 18.0,
    },
    pe: {
      minInvestment: 260,
      dailyReturn: 47,
      totalReturn: 1410,
      percentage: 18.0,
    },
    features: [
      'Mayor rendimiento diario',
      'Retiros inmediatos',
      'Asesoría personalizada',
    ],
  },
  {
    id: 'silver',
    name: 'Silver',
    description: 'Plan intermedio con excelentes beneficios y rentabilidad',
    icon: '🥈',
    duration: 45,
    co: {
      minInvestment: 250000,
      dailyReturn: 47500,
      totalReturn: 2137500,
      percentage: 19.0,
    },
    pe: {
      minInvestment: 650,
      dailyReturn: 123,
      totalReturn: 5535,
      percentage: 19.0,
    },
    features: [
      'Duración extendida',
      'Mayores rendimientos',
      'Bonos adicionales',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    description: 'Plan premium con rendimientos superiores al mercado',
    icon: '🥇',
    duration: 60,
    co: {
      minInvestment: 500000,
      dailyReturn: 100000,
      totalReturn: 6000000,
      percentage: 20.0,
    },
    pe: {
      minInvestment: 1300,
      dailyReturn: 260,
      totalReturn: 15600,
      percentage: 20.0,
    },
    features: [
      'Rendimiento del 20%',
      'Plazo de 2 meses',
      'Gestor personal',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    description: 'Exclusivo plan de alto rendimiento para inversores serios',
    icon: '💎',
    duration: 90,
    co: {
      minInvestment: 1000000,
      dailyReturn: 210000,
      totalReturn: 18900000,
      percentage: 21.0,
    },
    pe: {
      minInvestment: 2600,
      dailyReturn: 546,
      totalReturn: 49140,
      percentage: 21.0,
    },
    features: [
      'Rendimiento del 21%',
      'Plazo de 3 meses',
      'Reportes semanales',
    ],
  },
  {
    id: 'diamond',
    name: 'Diamond',
    description: 'Plan elite con los más altos rendimientos garantizados',
    icon: '💍',
    duration: 120,
    co: {
      minInvestment: 2500000,
      dailyReturn: 550000,
      totalReturn: 66000000,
      percentage: 22.0,
    },
    pe: {
      minInvestment: 6500,
      dailyReturn: 1430,
      totalReturn: 171600,
      percentage: 22.0,
    },
    features: [
      'Rendimiento del 22%',
      'Plazo de 4 meses',
      'Análisis detallados',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    description: 'Máximo nivel de inversión con beneficios extraordinarios',
    icon: '👑',
    duration: 180,
    co: {
      minInvestment: 5000000,
      dailyReturn: 1150000,
      totalReturn: 207000000,
      percentage: 23.0,
    },
    pe: {
      minInvestment: 13000,
      dailyReturn: 2990,
      totalReturn: 538200,
      percentage: 23.0,
    },
    features: [
      'Rendimiento del 23%',
      'Plazo de 6 meses',
      'Acceso VIP a eventos',
    ],
  },
  {
    id: 'vip',
    name: 'VIP',
    description: 'Plan anual para grandes inversionistas institucionales',
    icon: '🏆',
    duration: 365,
    co: {
      minInvestment: 10000000,
      dailyReturn: 2400000,
      totalReturn: 876000000,
      percentage: 24.0,
    },
    pe: {
      minInvestment: 26000,
      dailyReturn: 6240,
      totalReturn: 2277600,
      percentage: 24.0,
    },
    features: [
      'Rendimiento del 24%',
      'Plan anual completo',
      'Beneficios exclusivos',
    ],
  },
  {
    id: 'express',
    name: 'Express',
    description: 'Plan corto para rendimientos rápidos en 15 días',
    icon: '⚡',
    duration: 15,
    co: {
      minInvestment: 75000,
      dailyReturn: 12750,
      totalReturn: 191250,
      percentage: 17.0,
    },
    pe: {
      minInvestment: 195,
      dailyReturn: 33,
      totalReturn: 495,
      percentage: 17.0,
    },
    features: [
      'Ciclo corto de 15 días',
      'Retornos rápidos',
      'Reinversión automática',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Plan profesional con balance perfecto entre tiempo y rendimiento',
    icon: '🎯',
    duration: 60,
    co: {
      minInvestment: 750000,
      dailyReturn: 157500,
      totalReturn: 9450000,
      percentage: 21.0,
    },
    pe: {
      minInvestment: 1950,
      dailyReturn: 409,
      totalReturn: 24540,
      percentage: 21.0,
    },
    features: [
      'Equilibrio óptimo',
      'Rendimiento del 21%',
      'Dashboard avanzado',
    ],
  },
  {
    id: 'ultra',
    name: 'Ultra',
    description: 'Inversión superior con tecnología de punta',
    icon: '🚀',
    duration: 90,
    co: {
      minInvestment: 3000000,
      dailyReturn: 660000,
      totalReturn: 59400000,
      percentage: 22.0,
    },
    pe: {
      minInvestment: 7800,
      dailyReturn: 1716,
      totalReturn: 154440,
      percentage: 22.0,
    },
    features: [
      'Tecnología AI avanzada',
      'Predicciones de mercado',
      'Soporte 24/7',
    ],
  },
  {
    id: 'supreme',
    name: 'Supreme',
    description: 'El plan supremo para maximizar tu patrimonio',
    icon: '⭐',
    duration: 180,
    co: {
      minInvestment: 7500000,
      dailyReturn: 1725000,
      totalReturn: 310500000,
      percentage: 23.0,
    },
    pe: {
      minInvestment: 19500,
      dailyReturn: 4485,
      totalReturn: 807300,
      percentage: 23.0,
    },
    features: [
      'Máximo rendimiento',
      'Estrategias personalizadas',
      'Concierge financiero',
    ],
  },
];

/**
 * Obtiene un plan por ID
 */
export const getPlanById = (planId) => {
  return INVESTMENT_PLANS.find(plan => plan.id === planId);
};

/**
 * Obtiene planes ordenados por inversión mínima
 */
export const getPlansOrderedByAmount = (country) => {
  return [...INVESTMENT_PLANS].sort((a, b) => {
    const amountA = country === 'CO' ? a.co.minInvestment : a.pe.minInvestment;
    const amountB = country === 'CO' ? b.co.minInvestment : b.pe.minInvestment;
    return amountA - amountB;
  });
};

/**
 * Filtra planes por rango de inversión
 */
export const getPlansInRange = (country, minAmount, maxAmount) => {
  return INVESTMENT_PLANS.filter(plan => {
    const amount = country === 'CO' ? plan.co.minInvestment : plan.pe.minInvestment;
    return amount >= minAmount && amount <= maxAmount;
  });
};
