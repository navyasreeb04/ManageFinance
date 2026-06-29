import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: 'white',
      borderTop: '1px solid #e2e8f0',
      marginTop: '64px',
      padding: '48px 24px 24px',
      transition: 'background 0.3s, border-color 0.3s',
    }} className="dark-footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          marginBottom: '32px',
        }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', marginBottom: '8px' }}>
              ManageFinance
            </h2>
            <p style={{ color: '#64748b', maxWidth: '320px' }}>
              Secure, transparent, and intelligent financial management. Built with cutting-edge fintech standards.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              <a href="#" style={{ color: '#64748b', transition: 'color 0.2s' }} aria-label="GitHub">
                <FaGithub size={20} />
              </a>
              <a href="#" style={{ color: '#64748b', transition: 'color 0.2s' }} aria-label="LinkedIn">
                <FaLinkedin size={20} />
              </a>
              <a href="#" style={{ color: '#64748b', transition: 'color 0.2s' }} aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 style={{ fontWeight: '600', marginBottom: '12px' }}>Product</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}><Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="/blogs" style={{ color: '#64748b', textDecoration: 'none' }}>Blogs</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="/transfer" style={{ color: '#64748b', textDecoration: 'none' }}>Transfer</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="/analytics" style={{ color: '#64748b', textDecoration: 'none' }}>Analytics</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 style={{ fontWeight: '600', marginBottom: '12px' }}>Support</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}><Link to="/login" style={{ color: '#64748b', textDecoration: 'none' }}>Login</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="/register" style={{ color: '#64748b', textDecoration: 'none' }}>Sign Up</Link></li>
              <li style={{ marginBottom: '8px' }}><Link to="/forgot-password" style={{ color: '#64748b', textDecoration: 'none' }}>Forgot Password</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #e2e8f0',
          paddingTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          fontSize: '14px',
          color: '#94a3b8',
        }}>
          <p>&copy; {currentYear} ManageFinance. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Made with <FaHeart style={{ color: '#ef4444' }} /> for financial security
          </p>
        </div>
      </div>

      <style>{`
        body.dark .dark-footer {
          background: #0f172a !important;
          border-top-color: #1e293b !important;
        }
        body.dark .dark-footer h2 {
          color: #3b82f6 !important;
        }
        body.dark .dark-footer p,
        body.dark .dark-footer a,
        body.dark .dark-footer li a {
          color: #94a3b8 !important;
        }
        body.dark .dark-footer a:hover {
          color: #3b82f6 !important;
        }
      `}</style>
    </footer>
  );
};

export default Footer;