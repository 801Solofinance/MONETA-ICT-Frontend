/**
 * Format currency based on country code
 * @param {number} amount - The amount to format
 * @param {string} country - Country code (CO or PE)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, country) {
  if (!amount && amount !== 0) return '-'
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numAmount)) return '-'
  
  if (country === 'CO') {
    // Colombia: Peso Colombiano (COP)
    // Format: $ 50.000 COP (no decimals, thousand separator with period)
    return `$ ${numAmount.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} COP`
  } else if (country === 'PE') {
    // Peru: Sol Peruano (PEN)
    // Format: S/ 130.00 PEN (2 decimals, thousand separator with comma)
    return `S/ ${numAmount.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} PEN`
  }
  
  return amount.toString()
}

/**
 * Get currency symbol for country
 */
export function getCurrencySymbol(country) {
  return country === 'CO' ? '$' : 'S/'
}

/**
 * Get currency code for country
 */
export function getCurrencyCode(country) {
  return country === 'CO' ? 'COP' : 'PEN'
}

/**
 * Parse currency string back to number
 */
export function parseCurrency(currencyString) {
  if (!currencyString) return 0
  
  // Remove currency symbols and letters
  const cleaned = currencyString
    .replace(/[$S/COP PEN,]/g, '')
    .replace(/\./g, '')
    .trim()
  
  return parseFloat(cleaned) || 0
}

/**
 * Format number for input (without currency symbols)
 */
export function formatNumberInput(amount, country) {
  if (!amount && amount !== 0) return ''
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numAmount)) return ''
  
  if (country === 'CO') {
    return numAmount.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  } else {
    return numAmount.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
}
