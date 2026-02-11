/**
 * Phone number validation utilities for Peru and Colombia
 */

export const COUNTRY_CODES = {
  PERU: '+51',
  COLOMBIA: '+57',
};

export const PHONE_RULES = {
  '+51': {
    name: 'Perú',
    flag: '🇵🇪',
    digits: 9,
    startsWith: '9',
    format: '+51 XXX XXX XXX',
    example: '+51 987 654 321',
  },
  '+57': {
    name: 'Colombia',
    flag: '🇨🇴',
    digits: 10,
    startsWith: '3',
    format: '+57 XXX XXX XXXX',
    example: '+57 300 123 4567',
  },
};

/**
 * Validate phone number based on country code
 * @param {string} phone - Full phone number with prefix (e.g., "+51 987654321")
 * @param {string} countryCode - Country code (+51 or +57)
 * @returns {object} { valid: boolean, error: string|null }
 */
export const validatePhoneNumber = (phone, countryCode) => {
  // Remove all spaces and non-numeric characters except +
  const cleanPhone = phone.replace(/\s/g, '');
  
  // Check if it starts with the country code
  if (!cleanPhone.startsWith(countryCode)) {
    return {
      valid: false,
      error: `El número debe comenzar con ${countryCode}`,
    };
  }

  // Extract digits only (remove country code and spaces)
  const digits = cleanPhone.replace(countryCode, '').replace(/\D/g, '');
  
  const rules = PHONE_RULES[countryCode];
  
  if (!rules) {
    return {
      valid: false,
      error: 'Código de país no válido',
    };
  }

  // Check length
  if (digits.length !== rules.digits) {
    return {
      valid: false,
      error: `El número debe tener ${rules.digits} dígitos`,
    };
  }

  // Check starting digit
  if (!digits.startsWith(rules.startsWith)) {
    return {
      valid: false,
      error: `El número debe comenzar con ${rules.startsWith}`,
    };
  }

  // All checks passed
  return {
    valid: true,
    error: null,
  };
};

/**
 * Format phone number for display
 * @param {string} phone - Raw phone number with country code
 * @param {string} countryCode - Country code
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone, countryCode) => {
  const digits = phone.replace(countryCode, '').replace(/\D/g, '');
  
  if (countryCode === '+51') {
    // Format: +51 987 654 321
    if (digits.length >= 9) {
      return `${countryCode} ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
    }
  } else if (countryCode === '+57') {
    // Format: +57 300 123 4567
    if (digits.length >= 10) {
      return `${countryCode} ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
    }
  }
  
  return `${countryCode} ${digits}`;
};

/**
 * Mask phone number for privacy (e.g., +51 123 *** 789)
 * @param {string} phone - Full phone number
 * @param {string} countryCode - Country code
 * @returns {string} Masked phone number
 */
export const maskPhoneNumber = (phone, countryCode) => {
  const digits = phone.replace(countryCode, '').replace(/\D/g, '');
  
  if (digits.length < 6) {
    return phone; // Not enough digits to mask
  }
  
  const firstThree = digits.slice(0, 3);
  const lastThree = digits.slice(-3);
  
  return `${countryCode} ${firstThree} *** ${lastThree}`;
};

/**
 * Extract clean digits from phone number (no country code, no spaces)
 * @param {string} phone - Phone number with country code
 * @param {string} countryCode - Country code to remove
 * @returns {string} Clean digits only
 */
export const getPhoneDigits = (phone, countryCode) => {
  return phone.replace(countryCode, '').replace(/\D/g, '');
};

/**
 * Check if phone number is valid (simple check)
 * @param {string} phone - Phone number with country code
 * @returns {boolean} True if valid format
 */
export const isValidPhone = (phone) => {
  // Basic check: starts with + and has at least 10 digits
  const phoneRegex = /^\+\d{10,13}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};
