// PasswordValidator.jsx
// Enhanced password input with real-time validation

import React, { useState, useEffect } from 'react';
import './PasswordValidator.css';

const PasswordValidator = ({ value, onChange, onValidityChange }) => {
  const [requirements, setRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  const [strength, setStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    validatePassword(value);
  }, [value]);

  const validatePassword = (password) => {
    const newRequirements = {
      minLength: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    setRequirements(newRequirements);

    // Calculate strength
    const metRequirements = Object.values(newRequirements).filter(Boolean).length;
    setStrength(metRequirements);

    // Check if all requirements are met
    const isValid = Object.values(newRequirements).every(Boolean);
    onValidityChange?.(isValid);
  };

  const getStrengthLabel = () => {
    if (strength === 0) return '';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Fair';
    if (strength <= 4) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (strength <= 2) return '#f56565';
    if (strength <= 3) return '#ed8936';
    if (strength <= 4) return '#48bb78';
    return '#38a169';
  };

  return (
    <div className="password-validator">
      <label htmlFor="password" className="password-label">
        Password
      </label>

      <div className="password-input-wrapper">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your password"
          className={`password-input ${value && !Object.values(requirements).every(Boolean) ? 'invalid' : value ? 'valid' : ''}`}
        />
        <button
          type="button"
          className="toggle-visibility"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {value && (
        <>
          {/* Strength Indicator */}
          <div className="strength-indicator">
            <div className="strength-bars">
              {[1, 2, 3, 4, 5].map((bar) => (
                <div
                  key={bar}
                  className={`strength-bar ${bar <= strength ? 'active' : ''}`}
                  style={{
                    backgroundColor: bar <= strength ? getStrengthColor() : '#e2e8f0'
                  }}
                />
              ))}
            </div>
            {strength > 0 && (
              <span className="strength-label" style={{ color: getStrengthColor() }}>
                {getStrengthLabel()}
              </span>
            )}
          </div>

          {/* Requirements Checklist */}
          <div className="requirements-list">
            <RequirementItem
              met={requirements.minLength}
              text="At least 6 characters"
            />
            <RequirementItem
              met={requirements.hasUpperCase}
              text="One uppercase letter (A-Z)"
            />
            <RequirementItem
              met={requirements.hasLowerCase}
              text="One lowercase letter (a-z)"
            />
            <RequirementItem
              met={requirements.hasNumber}
              text="One number (0-9)"
            />
            <RequirementItem
              met={requirements.hasSpecialChar}
              text="One special character (!@#$%^&*)"
            />
          </div>

          {/* Example Passwords */}
          {!Object.values(requirements).every(Boolean) && (
            <div className="examples-box">
              <p className="examples-title">Example valid passwords:</p>
              <code>Good1$</code>
              <code>Yote$1</code>
              <code>Secure@123</code>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const RequirementItem = ({ met, text }) => (
  <div className={`requirement-item ${met ? 'met' : ''}`}>
    <div className="requirement-icon">
      {met ? (
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )}
    </div>
    <span>{text}</span>
  </div>
);

// Utility function to validate password
export const isPasswordValid = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/;
  return regex.test(password);
};

export default PasswordValidator;
