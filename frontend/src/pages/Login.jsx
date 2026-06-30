import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: '440px', margin: '0 auto', paddingTop: '40px' }}>
        <div className="card">
          <h2 className="text-center" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Welcome Back</h2>
          <p className="text-center" style={{ color: '#64748b', marginBottom: '24px' }}>Login to your FinTech account</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            {/* ✅ Add Forgot Password link */}
            <div style={{ textAlign: 'right' }}>
              <Link 
                to="/forgot-password" 
                style={{ 
                  color: '#2563eb', 
                  fontSize: '14px',
                  textDecoration: 'none',
                  hover: { textDecoration: 'underline' }
                }}
              >
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center" style={{ marginTop: '16px', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2563eb', fontWeight: '600' }}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;