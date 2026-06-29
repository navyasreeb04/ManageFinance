import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PinModal = ({ isOpen, onClose, onSuccess, loading }) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }
    onSuccess(pin);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      animation: 'fadeIn 0.3s ease-out',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        position: 'relative',
      }} className="dark:bg-gray-800">
        <h3 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '8px',
        }}>
           Enter Transaction PIN
        </h3>
        <p style={{
          textAlign: 'center',
          color: '#64748b',
          fontSize: '14px',
          marginBottom: '20px',
        }}>
          Please enter your 4-6 digit PIN to confirm this transaction
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <input
              type={showPin ? 'text' : 'password'}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              className="input-field"
              placeholder="Enter PIN"
              maxLength={6}
              style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
              autoFocus
              required
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
              }}
            >
              {showPin ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          {error && (
            <p style={{ color: '#dc2626', fontSize: '14px', marginBottom: '12px', textAlign: 'center' }}>
               {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ flex: 1 }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1 }}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Confirm'}
            </button>
          </div>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '16px',
          fontSize: '12px',
          color: '#94a3b8',
        }}>
          <Link to="/reset-pin" style={{ color: '#2563eb' }}>Forgot PIN?</Link>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        body.dark .dark\\:bg-gray-800 {
          background: #1e293b !important;
        }
      `}</style>
    </div>
  );
};

export default PinModal;