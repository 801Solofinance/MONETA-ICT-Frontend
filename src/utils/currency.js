import { CURRENCIES, CURRENCY_SYMBOLS } from './constants';

/**
 * Formatea un monto según el país del usuario
 * @param {number} amount - Monto a formatear
 * @param {string} country - Código del país ('CO' o 'PE')
 * @returns {string} - Monto formateado con símbolo de moneda
 */
export const formatCurrency = (amount, country) => {
  if (!amount && amount !== 0) return '-';
  
  const currency = CURRENCIES[country];
  const symbol = CURRENCY_SYMBOLS[currency];
  
  // Formatear según el país
  if (country === 'CO') {
    // Colombia: $ 1.234.567 COP
    const formatted = new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    
    return `${symbol} ${formatted} COP`;
  } else if (country === 'PE') {
    // Perú: S/ 1,234.56 PEN
    const formatted = new Intl.NumberFormat('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    
    return `${symbol} ${formatted} PEN`;
  }
  
  return `${symbol} ${amount}`;
};

/**
 * Formatea un monto compacto para espacios pequeños
 * @param {number} amount - Monto a formatear
 * @param {string} country - Código del país
 * @returns {string} - Monto formateado compacto
 */
export const formatCurrencyCompact = (amount, country) => {
  if (!amount && amount !== 0) return '-';
  
  const currency = CURRENCIES[country];
  const symbol = CURRENCY_SYMBOLS[currency];
  
  if (amount >= 1000000) {
    return `${symbol} ${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${symbol} ${(amount / 1000).toFixed(1)}K`;
  }
  
  return `${symbol} ${amount.toFixed(country === 'PE' ? 2 : 0)}`;
};

/**
 * Parsea un string de moneda a número
 * @param {string} value - Valor a parsear
 * @returns {number} - Número parseado
 */
export const parseCurrency = (value) => {
  if (!value) return 0;
  
  // Remover símbolos y espacios
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Valida que un monto sea un número válido
 * @param {any} amount - Monto a validar
 * @returns {boolean} - true si es válido
 */
export const isValidAmount = (amount) => {
  const num = typeof amount === 'string' ? parseCurrency(amount) : amount;
  return !isNaN(num) && num > 0;
};

/**
 * Obtiene el símbolo de moneda según el país
 * @param {string} country - Código del país
 * @returns {string} - Símbolo de moneda
 */
export const getCurrencySymbol = (country) => {
  const currency = CURRENCIES[country];
  return CURRENCY_SYMBOLS[currency] || '$';
};

/**
 * Obtiene el código de moneda según el país
 * @param {string} country - Código del país
 * @returns {string} - Código de moneda (COP o PEN)
 */
export const getCurrencyCode = (country) => {
  return CURRENCIES[country] || 'COP';
};
