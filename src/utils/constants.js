// Constantes de la aplicación MONETA-ICT

export const COUNTRIES = {
  COLOMBIA: 'CO',
  PERU: 'PE',
};

export const COUNTRY_NAMES = {
  CO: 'Colombia',
  PE: 'Perú',
};

export const CURRENCIES = {
  CO: 'COP',
  PE: 'PEN',
};

export const CURRENCY_SYMBOLS = {
  COP: '$',
  PEN: 'S/',
};

export const PHONE_PREFIXES = {
  CO: '+57',
  PE: '+51',
};

// Límites de transacciones POR PAÍS
export const LIMITS = {
  CO: {
    MIN_DEPOSIT: 40000,
    MIN_WITHDRAWAL: 25000,
    WELCOME_BONUS: 12000,
    MIN_INVESTMENT: 50000,
  },
  PE: {
    MIN_DEPOSIT: 35,
    MIN_WITHDRAWAL: 22,
    WELCOME_BONUS: 10,
    MIN_INVESTMENT: 45,
  },
};

// Estados de transacciones
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const TRANSACTION_STATUS_LABELS = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  active: 'Activa',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

// Tipos de transacciones
export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  INVESTMENT: 'investment',
  REFERRAL: 'referral',
  DAILY_RETURN: 'daily_return',
  WELCOME_BONUS: 'welcome_bonus',
};

export const TRANSACTION_TYPE_LABELS = {
  deposit: 'Depósito',
  withdrawal: 'Retiro',
  investment: 'Inversión',
  referral: 'Referido',
  daily_return: 'Ganancia Diaria',
  welcome_bonus: 'Bono de Bienvenida',
};

// Información bancaria POR PAÍS
export const BANK_INFO = {
  CO: {
    bank: 'Bancolombia',
    accountNumber: '00100007120',
    accountType: 'Ahorros',
    holder: 'Jose Jimenez C.',
  },
  PE: {
    bank: 'PLIN',
    accountNumber: '935460768',
    accountType: '',
    holder: 'ELISIA RIOS',
  },
};

// Bancos disponibles para retiros POR PAÍS
export const AVAILABLE_BANKS = {
  CO: [
    'Bancolombia',
    'Banco de Bogotá',
    'Davivienda',
    'BBVA Colombia',
    'Banco Popular',
    'Banco Caja Social',
    'Banco AV Villas',
    'Banco Agrario',
    'Nequi',
    'Daviplata',
  ],
  PE: [
    'BCP - Banco de Crédito del Perú',
    'BBVA Perú',
    'Interbank',
    'Scotiabank Perú',
    'Banco de la Nación',
    'Banco Pichincha',
    'Banbif',
    'Yape',
    'Plin',
  ],
};

// Tipos de cuenta
export const ACCOUNT_TYPES = ['Ahorros', 'Corriente'];

// Roles de usuario
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Duración del token (para futuro backend)
export const TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos
