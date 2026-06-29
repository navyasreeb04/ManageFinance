import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';
import './TransactionAnimation.css';

const TransactionAnimation = ({ type, message, onComplete, onBack }) => {
  const isSuccess = type === 'success';
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Colorful Confetti - Rainbow colors */}
      {isSuccess && (
        <div className="confetti-wrapper">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={250}
            gravity={0.12}
            colors={[
              '#FF6B6B', // Red
              '#FF9F43', // Orange
              '#FECA57', // Yellow
              '#48DBFB', // Sky Blue
              '#0ABDE3', // Blue
              '#10AC84', // Teal
              '#EE5A24', // Dark Orange
              '#5F27CD', // Purple
              '#FF9FF3', // Pink
              '#54A0FF', // Light Blue
              '#5F27CD', // Deep Purple
              '#FF6B6B', // Coral
              '#F368E0', // Magenta
              '#FFC048', // Amber
            ]}
          />
        </div>
      )}

      {/* Overlay */}
      <div className={`transaction-overlay ${isSuccess ? 'success' : 'failure'}`}>
        <div className="transaction-icon">
          {isSuccess ? <FaCheckCircle /> : <FaTimesCircle />}
        </div>

        <h2 className="transaction-title">
          {isSuccess ? ' Transaction Successful!' : ' Transaction Failed'}
        </h2>

        <p className="transaction-message">
          {message || (isSuccess ? 'Your money has been transferred safely!' : 'Please try again later.')}
        </p>

        <button className="transaction-back-btn" onClick={onBack || onComplete}>
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>
    </>
  );
};

export default TransactionAnimation;