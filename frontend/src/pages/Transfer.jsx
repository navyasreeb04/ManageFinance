import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import TransactionAnimation from '../components/TransactionAnimation';
import TransactionLoader from '../components/TransactionLoader';
import './Transfer.css';

const Transfer = () => {
  const auth = useAuth();
  const accountId = auth?.accountId;
  const user = auth?.user;
  const refreshUser = auth?.refreshUser;
  const navigate = useNavigate();

  useEffect(() => {
    const refresh = async () => {
      try {
        if (typeof refreshUser === 'function') {
          await refreshUser();
        }
      } catch (error) {
        // Silent fail - no console logs
      }
    };
    refresh();
  }, []);

  const hasPin = user?.hasPin || false;

  const [formData, setFormData] = useState({
    toAccount: '',
    amount: '',
    type: '',
  });
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [txDetails, setTxDetails] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState(null);
  const [animationMessage, setAnimationMessage] = useState('');

  // PIN Modal state
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Show PIN modal
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasPin) {
      toast.error('Please set a transaction PIN first in Settings');
      navigate('/settings');
      return;
    }
    setShowPinModal(true);
  };

  // Step 2: Verify PIN, then execute transaction
  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (!pin || pin.length < 4) {
      toast.error('Please enter a valid PIN (4-6 digits)');
      return;
    }
    setPinLoading(true);
    try {
      await api.post('/auth/verify-pin', { pin });
      setShowPinModal(false);
      setPin('');
      await executeTransaction();
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid PIN. Please try again.';
      toast.error(msg);
    } finally {
      setPinLoading(false);
    }
  };

  // Step 3: Actual transaction execution
  const executeTransaction = async () => {
    setLoading(true);
    setShowLoader(true);
    setTxStatus(null);
    setTxDetails(null);

    if (!accountId) {
      toast.error('No account found.');
      setLoading(false);
      setShowLoader(false);
      return;
    }

    const idempotencyKey = crypto.randomUUID();
    const budgets = JSON.parse(localStorage.getItem('budgets') || '{}');

    try {
      const response = await api.post(
        '/transactions',
        {
          account: accountId,
          toAccount: formData.toAccount,
          amount: parseFloat(formData.amount),
          idempotencyKey: idempotencyKey,
          type: formData.type || 'other',
          budgets: budgets,
        },
        {
          headers: {
            'Idempotency-Key': idempotencyKey,
          },
        }
      );

      const tx = response.data.transaction;
      setTxDetails({
        id: tx?._id || 'N/A',
        amount: formData.amount,
        toAccount: formData.toAccount,
        status: tx?.status || 'COMPLETED',
        timestamp: new Date().toLocaleString(),
        senderName: user?.name || 'You',
        type: formData.type || 'other',
      });

      //  Set success status
      setTxStatus({
        success: true,
        message: 'Transfer completed successfully!',
      });
      
      toast.success('Transfer successful!');
      setFormData({ toAccount: '', amount: '', type: '' });

      //  Budget alert - RED warning
      if (response.data.budgetAlert) {
        toast.error(response.data.budgetAlert.message, {
          duration: 8000,
          style: {
            background: '#dc2626',
            color: 'white',
            fontWeight: '600',
          },
        });
      }

      setAnimationType('success');
      setAnimationMessage(`₹${formData.amount} sent to ${formData.toAccount}`);
      setShowAnimation(true);

    } catch (error) {
      const msg = error.response?.data?.message || 'Transfer failed. Please try again.';
      setTxStatus({
        success: false,
        message: msg,
      });
      toast.error(msg);

      setAnimationType('failure');
      setAnimationMessage(msg);
      setShowAnimation(true);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setShowLoader(false);
      }, 1500);
    }
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setTimeout(() => {
      navigate('/dashboard');
    }, 200);
  };

  // ---------- PIN Modal ----------
  const PinModal = () => (
    <div className="pin-modal-overlay">
      <div className="pin-modal">
        <h3 className="pin-modal-title">Enter Transaction PIN</h3>
        <p className="pin-modal-subtitle">
          Please enter your 4‑6 digit transaction PIN to confirm this transfer.
        </p>
        <form onSubmit={handlePinSubmit}>
          <div className="pin-input-wrapper">
            <input
              type={showPin ? 'text' : 'password'}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="input-field"
              placeholder="Enter PIN"
              maxLength={6}
              pattern="[0-9]*"
              inputMode="numeric"
              autoFocus
              required
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="pin-toggle-btn"
            >
              {showPin ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="pin-modal-actions">
            <button
              type="button"
              onClick={() => { setShowPinModal(false); setPin(''); }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={pinLoading}
            >
              {pinLoading ? 'Verifying...' : 'Confirm'}
            </button>
          </div>
        </form>
        <Link
          to="/reset-pin"
          className="pin-forgot-link"
          onClick={() => setShowPinModal(false)}
        >
          Forgot PIN?
        </Link>
      </div>
    </div>
  );

  // ---------- Render ----------
  return (
    <div className="page-container">
      {showAnimation && (
        <TransactionAnimation
          type={animationType}
          message={animationMessage}
          onComplete={handleAnimationComplete}
          onBack={handleAnimationComplete}
        />
      )}

      {showPinModal && <PinModal />}

      <div className="container" style={{ maxWidth: '560px', margin: '0 auto', paddingTop: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Transfer Money</h2>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ← Back
            </button>
          </div>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Send funds to other accounts securely</p>

          {!hasPin && (
            <div className="pin-warning">
              <span>You need to set a transaction PIN before transferring money.</span>
              <button onClick={() => navigate('/settings')} className="pin-warning-btn">
                Set PIN
              </button>
            </div>
          )}

          {showLoader ? (
            <TransactionLoader />
          ) : txStatus ? (
            <div>
              <div className={`tx-status ${txStatus.success ? 'success' : 'failure'}`}>
                <p>{txStatus.success ? '✅' : '❌'} {txStatus.message}</p>
              </div>

              {txDetails && txStatus.success && (
                <div className="tx-details">
                  <h4>Transaction Details</h4>
                  <div className="tx-details-grid">
                    <span>Transaction ID:</span>
                    <span>{txDetails.id}</span>
                    <span>Amount:</span>
                    <span>₹{txDetails.amount}</span>
                    <span>From:</span>
                    <span>{txDetails.senderName}</span>
                    <span>To:</span>
                    <span>{txDetails.toAccount}</span>
                    <span>Category:</span>
                    <span>{txDetails.type}</span>
                    <span>Status:</span>
                    <span>{txDetails.status}</span>
                    <span>Timestamp:</span>
                    <span>{txDetails.timestamp}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => { setTxStatus(null); setTxDetails(null); }}
                className="btn-secondary w-full"
                style={{ marginTop: '16px' }}
              >
                Make Another Transfer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="form-label">Recipient Account ID</label>
                <input
                  type="text"
                  name="toAccount"
                  value={formData.toAccount}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter recipient's account ID"
                  required
                />
              </div>

              <div>
                <label className="form-label">Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="form-label">Transaction Category</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select category...</option>
                  <option value="food">Food & Dining</option>
                  <option value="rent">Rent</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="savings">Savings</option>
                  <option value="shopping">Shopping</option>
                  <option value="transport">Transport</option>
                  <option value="bills">Bills & Utilities</option>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading || !hasPin}
              >
                {!hasPin ? 'Set PIN First' : loading ? 'Processing...' : 'Send Money'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transfer;