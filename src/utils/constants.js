// Country codes
export const COUNTRIES = {
  COLOMBIA: 'CO',
  PERU: 'PE',
}

// Currency limits by country
export const LIMITS = {
  CO: {
    MIN_DEPOSIT: 40000,
    MIN_WITHDRAWAL: 25000,
    REFERRAL_BONUS: 12000,
    WELCOME_BONUS: 12000,
  },
  PE: {
    MIN_DEPOSIT: 35,
    MIN_WITHDRAWAL: 22,
    REFERRAL_BONUS: 10,
    WELCOME_BONUS: 10,
  },
}

// Bank information by country
export const BANK_INFO = {
  CO: {
    bank: 'Bancolombia',
    accountNumber: '123-456789-01',
    accountType: 'Ahorros',
    accountHolder: 'MONETA-ICT SAS',
    taxId: '901.234.567-8',
  },
  PE: {
    bank: 'BCP - Banco de Crédito del Perú',
    accountNumber: '123-456789-01',
    accountType: 'Ahorros',
    accountHolder: 'MONETA-ICT SAC',
    taxId: '20601234567',
  },
}

// Banks by country
export const BANKS = {
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
}

// Transaction types
export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  INVESTMENT: 'investment',
  DAILY_RETURN: 'daily_return',
  REFERRAL_BONUS: 'referral_bonus',
}

// Transaction statuses
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

// Investment plan IDs
export const PLAN_IDS = {
  STARTER: 'starter',
  BASIC: 'basic',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  DIAMOND: 'diamond',
  ELITE: 'elite',
  VIP: 'vip',
  EXPRESS: 'express',
  PRO: 'pro',
  ULTRA: 'ultra',
  SUPREME: 'supreme',
}

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
}

// Pagination
export const ITEMS_PER_PAGE = 10

// File upload
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// App configuration
export const APP_CONFIG = {
  APP_NAME: 'MONETA-ICT',
  SUPPORT_EMAIL: 'soporte@moneta-ict.com',
  APPROVAL_TIME_HOURS: 48,
}
