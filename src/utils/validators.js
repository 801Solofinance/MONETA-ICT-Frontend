/**
 * Validation utilities for forms and inputs
 */

// Email validation
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation (minimum 8 characters)
export function isValidPassword(password) {
  return password && password.length >= 8
}

// Phone validation by country
export function isValidPhone(phone, country) {
  if (!phone) return false
  
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '')
  
  if (country === 'CO') {
    // Colombia: +57 followed by 10 digits
    return /^\+57\d{10}$/.test(cleaned)
  } else if (country === 'PE') {
    // Peru: +51 followed by 9 digits
    return /^\+51\d{9}$/.test(cleaned)
  }
  
  return false
}

// Account number validation (8-20 digits)
export function isValidAccountNumber(accountNumber) {
  if (!accountNumber) return false
  const cleaned = accountNumber.replace(/[\s-]/g, '')
  return /^\d{8,20}$/.test(cleaned)
}

// Amount validation
export function isValidAmount(amount, min = 0, max = Infinity) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return !isNaN(num) && num >= min && num <= max
}

// Name validation (at least 2 words)
export function isValidFullName(name) {
  if (!name) return false
  const words = name.trim().split(/\s+/)
  return words.length >= 2 && words.every(word => word.length > 0)
}

// File validation
export function isValidFile(file, allowedTypes, maxSize) {
  if (!file) return false
  
  // Check file type
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return false
  }
  
  // Check file size
  if (maxSize && file.size > maxSize) {
    return false
  }
  
  return true
}

// Referral code validation (6 alphanumeric characters)
export function isValidReferralCode(code) {
  if (!code) return true // Optional field
  return /^[A-Z0-9]{6}$/.test(code)
}

// Format phone number with country prefix
export function formatPhoneNumber(phone, country) {
  if (!phone) return ''
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')
  
  if (country === 'CO') {
    // Colombia: +57 3001234567
    if (digits.length === 10) {
      return `+57 ${digits}`
    } else if (digits.length === 12 && digits.startsWith('57')) {
      return `+${digits.slice(0, 2)} ${digits.slice(2)}`
    }
  } else if (country === 'PE') {
    // Peru: +51 912345678
    if (digits.length === 9) {
      return `+51 ${digits}`
    } else if (digits.length === 11 && digits.startsWith('51')) {
      return `+${digits.slice(0, 2)} ${digits.slice(2)}`
    }
  }
  
  return phone
}

// Generate random referral code
export function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Format date for display
export function formatDate(dateString) {
  if (!dateString) return '-'
  
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) return '-'
  
  // Format: DD/MM/YYYY
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  
  return `${day}/${month}/${year}`
}

// Format date with time
export function formatDateTime(dateString) {
  if (!dateString) return '-'
  
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) return '-'
  
  const dateStr = formatDate(dateString)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  
  return `${dateStr} ${hours}:${minutes}`
}

// Calculate days difference
export function daysDifference(date1, date2) {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2 - d1)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
