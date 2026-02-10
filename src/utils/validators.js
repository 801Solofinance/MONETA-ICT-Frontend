/**
 * Valida formato de email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida formato de teléfono colombiano (+57)
 */
export const isValidColombianPhone = (phone) => {
  // Formato: +57 3001234567 (10 dígitos después del +57)
  const phoneRegex = /^\+57\s?[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Valida formato de teléfono peruano (+51)
 */
export const isValidPeruvianPhone = (phone) => {
  // Formato: +51 912345678 (9 dígitos después del +51)
  const phoneRegex = /^\+51\s?[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Valida teléfono según país
 */
export const isValidPhone = (phone, country) => {
  if (country === 'CO') {
    return isValidColombianPhone(phone);
  } else if (country === 'PE') {
    return isValidPeruvianPhone(phone);
  }
  return false;
};

/**
 * Valida contraseña (mínimo 8 caracteres)
 */
export const isValidPassword = (password) => {
  return password && password.length >= 8;
};

/**
 * Valida que las contraseñas coincidan
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Valida nombre completo (mínimo 2 palabras)
 */
export const isValidFullName = (name) => {
  const trimmed = name.trim();
  const words = trimmed.split(/\s+/);
  return words.length >= 2 && trimmed.length >= 5;
};

/**
 * Valida número de cuenta bancaria
 */
export const isValidAccountNumber = (accountNumber) => {
  // Debe tener al menos 8 dígitos
  const cleaned = accountNumber.replace(/\D/g, '');
  return cleaned.length >= 8 && cleaned.length <= 20;
};

/**
 * Sanitiza input para prevenir XSS
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Valida que un archivo sea una imagen válida
 */
export const isValidImageFile = (file) => {
  if (!file) return false;
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return validTypes.includes(file.type) && file.size <= maxSize;
};

/**
 * Valida código de referido (6 caracteres alfanuméricos)
 */
export const isValidReferralCode = (code) => {
  const codeRegex = /^[A-Z0-9]{6}$/;
  return codeRegex.test(code);
};
