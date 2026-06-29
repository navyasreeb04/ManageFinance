import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    transactionPin: '',
    confirmPin: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate PIN
    if (formData.transactionPin !== formData.confirmPin) {
      toast.error('Transaction PINs do not match');
      return;
    }
    
    if (formData.transactionPin.length < 4) {
      toast.error('Transaction PIN must be at least 4 digits');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: '440px', margin: '0 auto', paddingTop: '40px' }}>
        <div className="card">
          <h2 className="text-center" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
            Create Account
          </h2>
          <p className="text-center" style={{ color: '#64748b', marginBottom: '24px' }}>
            Join FinTech today
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="•••••••• (min 6 chars)"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Transaction PIN Fields */}
            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                Transaction PIN <span style={{ color: '#64748b', fontSize: '12px' }}>(4-6 digits)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPin ? 'text' : 'password'}
                  name="transactionPin"
                  value={formData.transactionPin}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter 4-6 digit PIN"
                  maxLength={6}
                  pattern="[0-9]*"
                  inputMode="numeric"
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
                Confirm Transaction PIN
              </label>
              <input
                type={showPin ? 'text' : 'password'}
                name="confirmPin"
                value={formData.confirmPin}
                onChange={handleChange}
                className="input-field"
                placeholder="Confirm your PIN"
                maxLength={6}
                pattern="[0-9]*"
                inputMode="numeric"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center" style={{ marginTop: '16px', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: '600' }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;