import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaCopy } from 'react-icons/fa';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await api.get('/accounts');
        const accounts = response.data.accounts;
        if (accounts && accounts.length > 0) {
          setAccountId(accounts[0]._id);
        }
      } catch (error) {
      }
    };
    fetchAccount();
  }, []);

  const copyToClipboard = () => {
    if (accountId) {
      navigator.clipboard.writeText(accountId);
      setCopied(true);
      toast.success('Account ID copied!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>My Profile</h2>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ← Back
            </button>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: 'bold',
              margin: '0 auto 16px',
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>{user?.name}</h3>
            <p style={{ color: '#64748b' }}>{user?.email}</p>
          </div>

          <div className="space-y-3">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #e2e8f0',
            }}>
              <span style={{ color: '#64748b' }}>Full Name</span>
              <span style={{ fontWeight: '500' }}>{user?.name}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #e2e8f0',
            }}>
              <span style={{ color: '#64748b' }}>Email Address</span>
              <span style={{ fontWeight: '500' }}>{user?.email}</span>
            </div>
            
            {/* NEW: Account ID Section */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc',
              borderRadius: '8px',
              padding: '12px 16px',
              marginTop: '8px',
            }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '14px' }}>Your Account ID</span>
                <p style={{ 
                  fontSize: '14px', 
                  fontWeight: '600',
                  fontFamily: 'monospace',
                  color: '#2563eb',
                  wordBreak: 'break-all',
                }}>
                  {accountId || 'Loading...'}
                </p>
              </div>
              <button
                onClick={copyToClipboard}
                style={{
                  padding: '8px 16px',
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                }}
              >
                <FaCopy /> {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #e2e8f0',
            }}>
              <span style={{ color: '#64748b' }}>Account Status</span>
              <span style={{
                padding: '2px 12px',
                borderRadius: '9999px',
                background: '#dcfce7',
                color: '#166534',
                fontSize: '12px',
                fontWeight: '600',
              }}>
                Active
              </span>
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <Link to="/settings" className="btn-secondary w-full" style={{ display: 'block', textAlign: 'center' }}>
              Account Settings
            </Link>
          </div>

          {/* NEW: Quick Transfer Tip */}
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            background: '#eff6ff',
            borderRadius: '8px',
            border: '1px solid #dbeafe',
          }}>
            <p style={{ fontSize: '14px', color: '#1e40af' }}>
              Share your Account ID with others to receive money. 
              They'll need this ID when sending you funds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;