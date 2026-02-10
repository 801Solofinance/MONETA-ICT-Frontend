// DepositAmountSelection.jsx
// Step 1 of the new deposit flow - Amount selection with preset options

import React, { useState, useEffect } from 'react';
import './DepositAmountSelection.css';

const DepositAmountSelection = ({ 
  onProceed, 
  minAmount = 10, 
  currency = 'USD',
  userCountry = 'US' 
}) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Preset amounts based on currency/country
  const presetAmounts = {
    USD: [10, 20, 50, 100, 200, 500],
    PEN: [50, 100, 200, 500, 1000, 2000], // Peru Soles
    EUR: [10, 25, 50, 100, 250, 500],
    GBP: [10, 25, 50, 100, 200, 400],
  };

  const amounts = presetAmounts[currency] || presetAmounts.USD;

  // Validate amount in real-time
  useEffect(() => {
    const numAmount = parseFloat(amount);
    
    if (amount === '') {
      setError('');
      setIsValid(false);
      return;
    }

    if (isNaN(numAmount)) {
      setError('Please enter a valid number');
      setIsValid(false);
      return;
    }

    if (numAmount < minAmount) {
      setError(`Minimum deposit is ${currency} ${minAmount}`);
      setIsValid(false);
      return;
    }

    setError('');
    setIsValid(true);
  }, [amount, minAmount, currency]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handlePresetClick = (presetAmount) => {
    setAmount(presetAmount.toString());
  };

  const handleProceed = () => {
    if (isValid) {
      onProceed(parseFloat(amount));
    }
  };

  return (
    <div className="deposit-amount-container">
      <div className="deposit-amount-card">
        {/* Header */}
        <div className="deposit-header">
          <div className="deposit-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2>Deposit Funds</h2>
          <p>Enter the amount you wish to deposit</p>
        </div>

        {/* Amount Input */}
        <div className="amount-input-section">
          <label htmlFor="amount">Amount ({currency})</label>
          <div className="amount-input-wrapper">
            <span className="currency-symbol">{currency}</span>
            <input
              id="amount"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              placeholder={`Min: ${minAmount}`}
              className={error ? 'error' : isValid ? 'valid' : ''}
              autoFocus
            />
          </div>
          
          {error && (
            <div className="error-message">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {isValid && (
            <div className="valid-message">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Amount is valid
            </div>
          )}
        </div>

        {/* Preset Amounts */}
        <div className="preset-amounts-section">
          <p className="preset-label">Quick Select</p>
          <div className="preset-amounts-grid">
            {amounts.map((preset) => (
              <button
                key={preset}
                onClick={() => handlePresetClick(preset)}
                className={`preset-button ${amount === preset.toString() ? 'active' : ''}`}
              >
                <span className="preset-currency">{currency}</span>
                <span className="preset-value">{preset}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Information Box */}
        <div className="info-box">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <strong>Important:</strong> Minimum deposit is {currency} {minAmount}. 
            You'll be redirected to payment details after clicking proceed.
          </div>
        </div>

        {/* Proceed Button - Only shows when valid */}
        {isValid && (
          <button 
            className="proceed-button"
            onClick={handleProceed}
          >
            <span>Proceed to Payment</span>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default DepositAmountSelection;
