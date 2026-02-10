// DepositPaymentDetails.jsx
// Step 2 of the new deposit flow - Payment details with countdown timer and proof upload

import React, { useState, useEffect, useRef } from 'react';
import './DepositPaymentDetails.css';

const DepositPaymentDetails = ({
  amount,
  currency,
  accountDetails,
  onPaymentSubmit,
  timerDuration = 900 // 15 minutes in seconds
}) => {
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [paymentProof, setPaymentProof] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Default account details structure
  const defaultAccountDetails = {
    bankName: 'Sample Bank',
    accountNumber: '1234567890',
    accountName: 'MONETA-ICT',
    reference: `DEP${Date.now()}`,
    ...accountDetails
  };

  // Timer countdown
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerIntervalRef.current);
          handleTimerExpired();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Show warning when time is running low
  useEffect(() => {
    if (timeLeft === 180) { // 3 minutes
      showNotification('⚠️ Only 3 minutes remaining!');
    }
    if (timeLeft === 60) { // 1 minute
      showNotification('🚨 Only 1 minute remaining!');
    }
  }, [timeLeft]);

  const handleTimerExpired = () => {
    alert('Session expired. Please try again.');
    window.location.href = '/dashboard';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (timeLeft <= 60) return 'critical';
    if (timeLeft <= 180) return 'warning';
    return 'normal';
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showNotification(`✅ ${label} copied to clipboard!`);
  };

  const showNotification = (message) => {
    // Simple toast notification (you can replace with your toast library)
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setPaymentProof(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setPaymentProof(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!paymentProof) {
      alert('Please upload payment proof first');
      return;
    }

    onPaymentSubmit({
      paymentProof,
      amount,
      currency,
      accountDetails: defaultAccountDetails,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="payment-details-container">
      <div className="payment-details-card">
        {/* Timer Section */}
        <div className={`timer-section ${getTimerClass()}`}>
          <div className="timer-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path strokeWidth="2" d="M12 6v6l4 2" />
            </svg>
          </div>
          <div className="timer-content">
            <p className="timer-label">Time Remaining</p>
            <h2 className="timer-display">{formatTime(timeLeft)}</h2>
            <p className="timer-warning">
              {timeLeft <= 180 ? '⚠️ Complete payment quickly!' : 'Complete payment within this time'}
            </p>
          </div>
        </div>

        {/* Amount Display */}
        <div className="amount-display">
          <p>Amount to Pay</p>
          <h3>{currency} {amount.toFixed(2)}</h3>
        </div>

        {/* Account Details */}
        <div className="account-details-section">
          <h3 className="section-title">Payment Details</h3>
          
          <div className="account-detail-item">
            <label>Bank Name</label>
            <div className="detail-value">
              <span>{defaultAccountDetails.bankName}</span>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(defaultAccountDetails.bankName, 'Bank name')}
                title="Copy"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="account-detail-item">
            <label>Account Number</label>
            <div className="detail-value">
              <span className="mono">{defaultAccountDetails.accountNumber}</span>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(defaultAccountDetails.accountNumber, 'Account number')}
                title="Copy"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="account-detail-item">
            <label>Account Name</label>
            <div className="detail-value">
              <span>{defaultAccountDetails.accountName}</span>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(defaultAccountDetails.accountName, 'Account name')}
                title="Copy"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="account-detail-item highlight">
            <label>Reference Number</label>
            <div className="detail-value">
              <span className="mono">{defaultAccountDetails.reference}</span>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(defaultAccountDetails.reference, 'Reference')}
                title="Copy"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Payment Proof Upload */}
        <div className="upload-section">
          <h3 className="section-title">Upload Payment Proof</h3>
          <p className="upload-description">
            Upload a screenshot or photo of your payment receipt
          </p>

          {!previewUrl ? (
            <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
              <div className="upload-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="upload-text">Click to upload payment proof</p>
              <p className="upload-hint">PNG, JPG up to 5MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div className="preview-container">
              <img src={previewUrl} alt="Payment proof" className="proof-preview" />
              <button className="remove-btn" onClick={handleRemoveFile}>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Submit Button - Only shows when proof is uploaded */}
        {paymentProof && (
          <button className="submit-payment-btn" onClick={handleSubmit}>
            <span>I Have Paid</span>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </button>
        )}

        {/* Important Notice */}
        <div className="notice-box">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p>
            Please include the <strong>reference number</strong> in your payment description.
            Upload clear proof of payment before the timer expires.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepositPaymentDetails;
