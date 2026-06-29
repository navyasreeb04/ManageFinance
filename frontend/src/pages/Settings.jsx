import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

const Settings = () => {
  const { user, darkMode, toggleDarkMode, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  // Refresh user data when component mounts
  useEffect(() => {
    refreshUser();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success('Password changed successfully');
      setShowChangePassword(false);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh handler
  const handleRefresh = async () => {
    toast.loading('Refreshing...');
    await refreshUser();
    toast.dismiss();
    toast.success('User data refreshed!');
  };

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}> Settings</h2>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ← Back
            </button>
          </div>

          <div className="space-y-6">
            {/* Theme Toggle */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              background: '#f8fafc',
              color: '#000000',
              borderRadius: '8px',
            }} className="dark:bg-gray-700">
              <div>
                <p style={{ fontWeight: '500' }}>Dark Mode</p>
                <p style={{ fontSize: '14px',  color: '#000000', }}>Toggle dark/light theme</p>
              </div>
              <button
                onClick={toggleDarkMode}
                className="btn-secondary"
                style={{ padding: '8px 16px' }}
              >
                {darkMode ? 'Light' : 'Dark'}
              </button>
            </div>

            {/* Change Password */}
            <div style={{
              padding: '16px',
              background: '#f8fafc',
               color: '#000000',
              borderRadius: '8px',
            }} className="dark:bg-gray-700">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <p style={{ fontWeight: '500' }}>Change Password</p>
                  <p style={{ fontSize: '14px', 
                     color: '#000000',
                  }}>Update your account password</p>
                </div>
                <button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px' }}
                >
                  {showChangePassword ? 'Cancel' : 'Change'}
                </button>
              </div>

              {showChangePassword && (
                <form onSubmit={handlePasswordChange} className="space-y-4" style={{ marginTop: '16px' }}>
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    className="input-field"
                    placeholder="Current Password"
                    required
                  />
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="input-field"
                    placeholder="New Password"
                    required
                  />
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="input-field"
                    placeholder="Confirm New Password"
                    required
                  />
                  <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              )}
            </div>

            {/* Transaction PIN Section */}
            <div style={{
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '8px',
               color: '#000000',
              border: '1px solid #e2e8f0',
            }} className="dark:bg-gray-700 dark:border-gray-600">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '500' }}>Transaction PIN</p>
                  <p style={{ fontSize: '14px', color:  '#000000', }}>
                    {user?.hasPin ? 'PIN is set' : 'PIN not set'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleRefresh}
                    className="btn-secondary"
                    style={{ padding: '8px 16px' }}
                  >
                    Refresh
                  </button>
                  <Link 
                    to="/reset-pin" 
                    className="btn-secondary"
                    style={{ padding: '8px 16px', textDecoration: 'none' }}
                  >
                    {user?.hasPin ? 'Change PIN' : 'Set PIN'}
                  </Link>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div style={{
              padding: '16px',
              background: '#f8fafc',
               color: '#000000',
              borderRadius: '8px',
            }} className="dark:bg-gray-700">
              <p style={{ fontWeight: '500', marginBottom: '8px' }}>Account Info</p>
              <p style={{ fontSize: '14px', color: '#000000', }}>
                <strong>Name:</strong> {user?.name}
              </p>
              <p style={{ fontSize: '14px',   color: '#000000', }}>
                <strong>Email:</strong> {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;