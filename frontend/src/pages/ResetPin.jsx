import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPin = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-pin', { email });
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-pin-otp', { email, otp });
      toast.success('OTP verified!');
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPin = async (e) => {
    e.preventDefault();
    if (newPin !== confirmPin) {
      toast.error('PINs do not match');
      return;
    }
    if (newPin.length < 4) {
      toast.error('PIN must be at least 4 digits');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-pin', { email, otp, newPin });
      toast.success('PIN reset successfully!');
      
      // Force multiple refreshes to ensure UI updates
      await refreshUser();
      await new Promise(resolve => setTimeout(resolve, 500));
      await refreshUser();
      
      // Redirect to Settings
      setTimeout(() => {
        navigate('/settings');
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset PIN');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-pin', { email });
      toast.success('OTP resent to your email!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: '440px', margin: '0 auto', paddingTop: '40px' }}>
        <div className="card">
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>
            {step === 1 && 'Forgot Transaction PIN'}
            {step === 2 && 'Enter OTP'}
            {step === 3 && 'Set New PIN'}
          </h2>
          <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '24px' }}>
            {step === 1 && 'Enter your email to receive an OTP'}
            {step === 2 && `OTP sent to ${email}`}
            {step === 3 && 'Enter your new 4-6 digit transaction PIN'}
          </p>

          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="input-field"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                type="button"
                onClick={handleResendOTP}
                className="btn-secondary w-full"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Resend OTP'}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPin} className="space-y-6">
              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                  New Transaction PIN
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="input-field"
                    placeholder="Enter 4-6 digit PIN"
                    maxLength={6}
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
                    {showPin ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                  Confirm New PIN
                </label>
                <input
                  type={showPin ? 'text' : 'password'}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  className="input-field"
                  placeholder="Confirm your PIN"
                  maxLength={6}
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset PIN'}
              </button>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link to="/settings" style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none' }}>
              ← Back to Settings
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPin;