// WelcomePopup.jsx
// Beautiful welcome popup with Telegram group link

import React, { useState, useEffect } from 'react';
import './WelcomePopup.css';

const WelcomePopup = ({ 
  userName = 'User',
  welcomeBonus = 0,
  currency = 'USD',
  telegramGroupLink = 'https://t.me/+K_NnbszDirQ2YTg0',
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Show popup after a short delay
    setTimeout(() => {
      setIsVisible(true);
    }, 500);

    // Auto-dismiss after 10 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  const handleJoinGroup = () => {
    window.open(telegramGroupLink, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className={`welcome-overlay ${isClosing ? 'closing' : ''}`}>
      <div className={`welcome-popup ${isClosing ? 'closing' : ''}`}>
        {/* Close Button */}
        <button className="close-btn" onClick={handleClose}>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Animated Background Shapes */}
        <div className="bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>

        {/* Content */}
        <div className="welcome-content">
          {/* Welcome Icon */}
          <div className="welcome-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>

          {/* Welcome Text */}
          <h2 className="welcome-title">
            🎉 Welcome to MONETA-ICT!
          </h2>
          <p className="welcome-subtitle">
            Hello <strong>{userName}</strong>, we're excited to have you here!
          </p>

          {/* Welcome Bonus Display */}
          {welcomeBonus > 0 && (
            <div className="bonus-display">
              <div className="bonus-icon">💰</div>
              <div className="bonus-info">
                <p className="bonus-label">Welcome Bonus Credited</p>
                <p className="bonus-amount">
                  +{currency} {welcomeBonus.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Message */}
          <p className="welcome-message">
            Join our community to get exclusive updates, trading signals, 
            and connect with other investors!
          </p>

          {/* Telegram Group Button */}
          <button className="telegram-btn" onClick={handleJoinGroup}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
            <span>Join Our Telegram Community</span>
            <svg viewBox="0 0 20 20" fill="currentColor" className="arrow">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Benefits List */}
          <div className="benefits-list">
            <div className="benefit-item">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Daily Trading Signals</span>
            </div>
            <div className="benefit-item">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>24/7 Support</span>
            </div>
            <div className="benefit-item">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Exclusive Promotions</span>
            </div>
          </div>

          {/* Auto-close timer */}
          <p className="auto-close-text">
            This popup will auto-close in a few seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
