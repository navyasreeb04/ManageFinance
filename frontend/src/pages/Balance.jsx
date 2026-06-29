import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Balance = () => {
  const { accountId } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(null);

  const fetchBalance = async () => {
    if (!accountId) {
      toast.error('No account found');
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/accounts/balance/${accountId}`);
      setBalance(response.data.balance);
      toast.success('Balance fetched successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [accountId]);

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: '440px', margin: '0 auto', paddingTop: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Check Balance</h2>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ← Back
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p>Loading balance...</p>
            </div>
          ) : balance !== null ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#dcfce7',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '36px'
              }}>
              
              </div>
              <p style={{ color: '#64748b', marginBottom: '8px' }}>Your Current Balance</p>
              <p style={{ fontSize: '48px', fontWeight: 'bold' }}>
                ₹{balance.toLocaleString()}
              </p>
              <button
                onClick={fetchBalance}
                className="btn-secondary"
                style={{ marginTop: '16px' }}
              >
                Refresh
              </button>

              {/* Forgot PIN Link */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <Link 
                  to="/reset-pin" 
                  style={{ 
                    color: '#2563eb', 
                    fontSize: '14px', 
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                   Forgot Transaction PIN?
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ color: '#64748b' }}>Unable to fetch balance</p>
              <button
                onClick={fetchBalance}
                className="btn-primary"
                style={{ marginTop: '16px' }}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Balance;