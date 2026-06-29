import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaChartLine, 
  FaLightbulb, 
  FaExclamationTriangle,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaBell,
  FaRobot,
  FaCheckCircle
} from 'react-icons/fa';

const Home = () => {
  const { user } = useAuth();
  const [marketData, setMarketData] = useState([
    { name: 'NIFTY 50', value: 22124.50, change: 0.85, color: 'green' },
    { name: 'SENSEX', value: 73095.20, change: 0.72, color: 'green' },
    { name: 'USD/INR', value: 83.45, change: -0.32, color: 'red' },
    { name: 'Gold (24k)', value: 71200, change: 0.45, color: 'green' },
    { name: 'Bitcoin', value: 5342000, change: 1.23, color: 'green' },
    { name: 'Ethereum', value: 187500, change: -0.56, color: 'red' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev =>
        prev.map(item => ({
          ...item,
          value: item.value + (Math.random() - 0.5) * 10,
          change: item.change + (Math.random() - 0.5) * 0.2,
          color: Math.random() > 0.5 ? 'green' : 'red',
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container">
      <div className="container" style={{ paddingTop: '24px' }}>
        
        {/* ===== HERO SECTION ===== */}
        <div className="hero-section">
          <h1 className="hero-title">
            Smart Banking <span style={{ color: '#2563eb' }}>Reimagined</span>
          </h1>
          <p className="hero-subtitle">
            Secure, transparent, and intelligent financial management at your fingertips.
            Built with production-grade fintech patterns.
          </p>
          
          <div className="hero-badges">
            <span className="hero-badge">
              <FaCheckCircle className="hero-badge-icon" /> Idempotent Transactions
            </span>
            <span className="hero-badge">
              <FaCheckCircle className="hero-badge-icon" /> Double-Entry Ledger
            </span>
            <span className="hero-badge">
              <FaCheckCircle className="hero-badge-icon" /> AI-Powered Insights
            </span>
          </div>

          {!user ? (
            <Link to="/register" className="btn-primary" style={{ display: 'inline-block', fontSize: '16px', padding: '14px 40px' }}>
              Get Started Free
            </Link>
          ) : (
            <Link to="/dashboard" className="btn-primary" style={{ display: 'inline-block', fontSize: '16px', padding: '14px 40px' }}>
              Go to Dashboard
            </Link>
          )}
        </div>

        {/* ===== FEATURES SECTION ===== */}
        <div style={{ marginBottom: '64px' }}>
          <div className="section-header">
            <h2 className="section-title">Built for Modern Banking</h2>
            <p className="section-subtitle">Every feature designed with security, transparency, and user experience in mind.</p>
          </div>

          <div className="grid-3" style={{ gap: '24px' }}>
            <div className="feature-card feature-blue">
              <h3 className="feature-card-title">Idempotent Transactions</h3>
              <p className="feature-card-desc">Prevent double charges with unique idempotency keys. Click once, transfer once – guaranteed.</p>
            </div>

            <div className="feature-card feature-green">
              <h3 className="feature-card-title">Double-Entry Ledger</h3>
              <p className="feature-card-desc">Complete audit trail with DEBIT and CREDIT entries. Every transaction is fully traceable.</p>
            </div>

            <div className="feature-card feature-purple">
              <h3 className="feature-card-title">AI Financial Advisor</h3>
              <p className="feature-card-desc">Get personalized spending insights and financial advice from your AI-powered assistant.</p>
            </div>

            <div className="feature-card feature-orange">
              <h3 className="feature-card-title">Analytics Dashboard</h3>
              <p className="feature-card-desc">Visualize spending with pie, bar, and line charts. Track your financial health at a glance.</p>
            </div>

            <div className="feature-card feature-pink">
              <h3 className="feature-card-title">Real-Time Notifications</h3>
              <p className="feature-card-desc">Instant WebSocket alerts when you send or receive money. Always stay updated.</p>
            </div>

            <div className="feature-card feature-teal">
              <h3 className="feature-card-title">Budget Tracker</h3>
              <p className="feature-card-desc">Set monthly budgets per category and get alerts when you're nearing your limits.</p>
            </div>
          </div>
        </div>

        {/* ===== TECH STACK SECTION ===== */}
        <div className="tech-stack-section">
          <div className="corner-border corner-border-tl" />
          <div className="corner-border corner-border-tr" />
          <div className="corner-border corner-border-bl" />
          <div className="corner-border corner-border-br" />

          <div className="tech-stack-header">
            <h2 className="tech-stack-title">Technology Stack</h2>
            <p className="tech-stack-subtitle">Production-grade tools and best practices</p>
          </div>

          <div className="tech-grid">
            <div className="tech-item">
              <div className="tech-icon" style={{ color: '#61dafb' }}><FaReact /></div>
              <div className="tech-name">React 19</div>
              <div className="tech-label">Frontend Framework</div>
            </div>
            <div className="tech-item">
              <div className="tech-icon" style={{ color: '#68a063' }}><FaNodeJs /></div>
              <div className="tech-name">Node.js</div>
              <div className="tech-label">Runtime Environment</div>
            </div>
            <div className="tech-item">
              <div className="tech-icon" style={{ color: '#47a248' }}>🍃</div>
              <div className="tech-name">MongoDB</div>
              <div className="tech-label">NoSQL Database</div>
            </div>
            <div className="tech-item">
              <div className="tech-icon" style={{ color: '#f472b6' }}><FaBell /></div>
              <div className="tech-name">WebSocket</div>
              <div className="tech-label">Real-Time Communication</div>
            </div>
            <div className="tech-item">
              <div className="tech-icon" style={{ color: '#a78bfa' }}><FaRobot /></div>
              <div className="tech-name">Gemini AI</div>
              <div className="tech-label">Artificial Intelligence</div>
            </div>
            {/* <div className="tech-item">
              <div className="tech-icon" style={{ color: '#fb923c' }}><FaDatabase /></div>
              <div className="tech-name">Mongoose</div>
              <div className="tech-label">ODM Framework</div>
            </div> */}
          </div>
        </div>

        {/* ===== TIPS & FRAUD SECTIONS ===== */}
        <div className="grid-2" style={{ marginBottom: '64px', gap: '24px' }}>
          <div className="tips-section">
            <h3 className="section-icon-title">
              <FaLightbulb style={{ color: '#eab308' }} /> Smart Finance Tips
            </h3>
            <ul className="section-list">
              <li> Save 20% of every transfer for emergencies</li>
              <li> Track your spending categories monthly</li>
              <li> Set auto-transfer for recurring bills</li>
              <li> Review your transaction history weekly</li>
              <li> Use the AI advisor for personalized insights</li>
            </ul>
          </div>

          <div className="fraud-section">
            <h3 className="section-icon-title" style={{ color: '#dc2626' }}>
              <FaExclamationTriangle style={{ color: '#dc2626' }} /> Fraud Awareness
            </h3>
            <ul className="section-list">
              <li> Never share your transaction PIN with anyone</li>
              <li> Verify recipient details before sending</li>
              <li> Report suspicious activity immediately</li>
              <li> Enable two-factor authentication for safety</li>
            </ul>
          </div>
        </div>

        {/* ===== LIVE MARKET WIDGET ===== */}
        <div className="market-widget corner-green">
          <div className="corner-border corner-border-tl" />
          <div className="corner-border corner-border-tr" />
          <div className="corner-border corner-border-bl" />
          <div className="corner-border corner-border-br" />

          <div className="market-header">
            <h3 className="market-title">
              <FaChartLine style={{ color: '#10b981' }} /> Live Market
            </h3>
            <span className="market-live">
              <span className="live-dot"></span>
              Live
            </span>
          </div>

          <div className="market-ticker">
            <div className="ticker-content">
              {marketData.map((item, index) => (
                <span key={index} className="ticker-item">
                  <strong>{item.name}</strong>
                  <span style={{ marginLeft: '8px' }}>
                    {item.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                  <span className={item.color === 'green' ? 'ticker-change-green' : 'ticker-change-red'}>
                    {item.color === 'green' ? '▲' : '▼'} {Math.abs(item.change).toFixed(2)}%
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="market-grid">
            {marketData.map((item, index) => (
              <div key={index} className="market-grid-item">
                <p className="market-item-name">{item.name}</p>
                <p className="market-item-value">
                  {item.value.toLocaleString('en-IN', { maximumFractionDigits: item.name.includes('INR') ? 2 : 0 })}
                </p>
                <p className={item.color === 'green' ? 'market-item-change-green' : 'market-item-change-red'}>
                  {item.color === 'green' ? '▲' : '▼'} {Math.abs(item.change).toFixed(2)}%
                </p>
              </div>
            ))}
          </div>

          <p className="market-footer">Live data updates every 5 seconds • For demonstration purposes</p>
        </div>

        {/* ===== CTA SECTION ===== */}
        {!user && (
          <div className="cta-section">
            <div className="corner-border corner-border-tl" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
            <div className="corner-border corner-border-tr" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
            <div className="corner-border corner-border-bl" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
            <div className="corner-border corner-border-br" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />

            <h2 className="cta-title">Ready to take control of your finances?</h2>
            <p className="cta-subtitle">Join users who trust FinTech for secure, intelligent, and transparent banking.</p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-primary">Create Free Account</Link>
              <Link to="/login" className="cta-secondary">Login</Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;