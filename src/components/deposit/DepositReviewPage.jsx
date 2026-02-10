// DepositReviewPage.jsx
// Step 3 of deposit flow - Shows payment is being reviewed with 2-5 min timer

import React, { useState, useEffect, useRef } from 'react';
import './DepositReviewPage.css';

const DepositReviewPage = ({
  transactionId,
  amount,
  currency,
  onSuccess,
  onTimeout,
  checkInterval = 3000, // Check every 3 seconds
  timeoutDuration = 300 // 5 minutes in seconds
}) => {
  const [timeLeft, setTimeLeft] = useState(timeoutDuration);
  const [status, setStatus] = useState('reviewing'); // reviewing, success, timeout
  const [dots, setDots] = useState('');
  const timerRef = useRef(null);
  const checkRef = useRef(null);

  // Animated dots for "Reviewing" text
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Check payment status periodically
  useEffect(() => {
    checkRef.current = setInterval(() => {
      checkPaymentStatus();
    }, checkInterval);

    return () => {
      if (checkRef.current) clearInterval(checkRef.current);
    };
  }, []);

  const checkPaymentStatus = async () => {
    try {
      // Call your API to check if admin has approved
      const response = await fetch(`/api/transactions/${transactionId}/status`);
      const data = await response.json();

      if (data.status === 'approved') {
        handleSuccess(data);
      } else if (data.status === 'rejected') {
        handleRejection();
      }
      // If still pending, continue checking
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const handleSuccess = (data) => {
    // Clear intervals
    if (timerRef.current) clearInterval(timerRef.current);
    if (checkRef.current) clearInterval(checkRef.current);

    setStatus('success');

    // Show success for 2 seconds then redirect
    setTimeout(() => {
      onSuccess(data);
    }, 2000);
  };

  const handleRejection = () => {
    // Clear intervals
    if (timerRef.current) clearInterval(timerRef.current);
    if (checkRef.current) clearInterval(checkRef.current);

    alert('Your payment was rejected. Please contact support.');
    window.location.href = '/dashboard';
  };

  const handleTimeout = () => {
    // Clear intervals
    if (timerRef.current) clearInterval(timerRef.current);
    if (checkRef.current) clearInterval(checkRef.current);

    setStatus('timeout');

    // Show timeout message for 2 seconds then redirect
    setTimeout(() => {
      onTimeout();
    }, 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="review-page-container">
      <div className="review-page-card">
        {/* Reviewing State */}
        {status === 'reviewing' && (
          <>
            <div className="review-animation">
              <div className="spinner-container">
                <div className="spinner"></div>
                <div className="spinner-inner"></div>
              </div>
            </div>

            <div className="review-content">
              <h2 className="review-title">
                Reviewing Your Payment{dots}
              </h2>
              <p className="review-description">
                Our team is verifying your payment. This usually takes 2-5 minutes.
              </p>

              <div className="transaction-info">
                <div className="info-item">
                  <span className="info-label">Transaction ID</span>
                  <span className="info-value">#{transactionId}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Amount</span>
                  <span className="info-value">{currency} {amount.toFixed(2)}</span>
                </div>
              </div>

              <div className="timer-info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeWidth="2" d="M12 6v6l4 2" />
                </svg>
                <span>Max wait time: {formatTime(timeLeft)}</span>
              </div>

              <div className="steps-container">
                <div className="step active">
                  <div className="step-icon">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Payment Received</p>
                </div>
                <div className="step-divider active"></div>
                <div className="step active">
                  <div className="step-icon">
                    <div className="step-spinner"></div>
                  </div>
                  <p>Verifying</p>
                </div>
                <div className="step-divider"></div>
                <div className="step">
                  <div className="step-icon">3</div>
                  <p>Confirmation</p>
                </div>
              </div>

              <div className="info-box">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p>
                  If verification takes longer than 5 minutes, we'll send you a notification once complete. 
                  You can safely close this page.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="success-container">
            <div className="success-animation">
              <svg viewBox="0 0 100 100" className="success-checkmark">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#48bb78" strokeWidth="4" />
                <path fill="none" stroke="#48bb78" strokeWidth="4" strokeLinecap="round" 
                      d="M30 50 L43 63 L70 36" className="checkmark-path" />
              </svg>
            </div>
            <h2 className="success-title">Payment Successful!</h2>
            <p className="success-description">
              Your deposit of {currency} {amount.toFixed(2)} has been approved
            </p>
            <div className="success-amount">
              +{currency} {amount.toFixed(2)}
            </div>
            <p className="redirect-message">Redirecting to dashboard...</p>
          </div>
        )}

        {/* Timeout State */}
        {status === 'timeout' && (
          <div className="timeout-container">
            <div className="timeout-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeWidth="2" d="M12 6v6l4 2" />
              </svg>
            </div>
            <h2 className="timeout-title">Payment Under Review</h2>
            <p className="timeout-description">
              Your payment is still being verified. You'll receive a notification once it's confirmed.
            </p>
            <p className="redirect-message">Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositReviewPage;
