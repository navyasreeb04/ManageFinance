import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaArrowUp, FaHistory, FaChartPie, FaSpinner, FaCopy } from 'react-icons/fa';
import BudgetAlert from '../components/BudgetAlert';
import { useLocation } from 'react-router-dom';


const Dashboard = () => {
  const { user, accountId } = useAuth();
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshingBalance, setRefreshingBalance] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [copied, setCopied] = useState(false);
  
  const location = useLocation();
  
  useEffect(() => {
    // Re-fetch transactions when dashboard is visited (or re-visited)
    fetchBalance(false);
    fetchTransactions();
  }, [location.pathname]); // triggers when route changes to dashboard
  // Fetch balance
  const fetchBalance = async (showToast = true) => {
    if (!accountId) return;
    setRefreshingBalance(true);
    try {
      const response = await api.get(`/accounts/balance/${accountId}`);
      setBalance(response.data.balance);
      if (showToast) {
        toast.success('Balance updated!');
      }
    } catch (error) {
      if (showToast) {
        toast.error('Failed to fetch balance');
      }
    } finally {
      setRefreshingBalance(false);
    }
  };

  // Fetch recent transactions and compute totals
  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions?limit=200');
      const data = response.data.transactions || [];
      setTransactions(data);

      // Calculate totals
      let spent = 0;
      let received = 0;
      data.forEach((tx) => {
        if (tx.txType === 'DEBIT') {
          spent += tx.amount;
        } else if (tx.txType === 'CREDIT') {
          received += tx.amount;
        }
      });
      setTotalSpent(spent);
      setTotalReceived(received);
    } catch (error) {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Copy Account ID to clipboard
  const copyAccountId = () => {
    if (accountId) {
      navigator.clipboard.writeText(accountId);
      setCopied(true);
      toast.success('Account ID copied!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchBalance(false);
      fetchTransactions();
    }
  }, [accountId]);

  return (
    <div className="page-container">
      <div className="container" style={{ paddingTop: '24px' }}>
        {/* Welcome Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>
            Welcome back, {user?.name} 
          </h1>
          <p style={{ color: '#64748b' }}>Here's your financial overview</p>
        </div>
        <BudgetAlert transactions={transactions} />
        {/* Main Grid: Balance + Account ID */}
        <div className="grid-3" style={{ marginBottom: '24px' }}>
          {/* Balance Card */}
          <div
            className="card"
            style={{
              gridColumn: 'span 2',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white',
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Available Balance</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
              <p style={{ fontSize: '36px', fontWeight: 'bold' }}>
                ₹{balance !== null ? balance.toLocaleString() : '••••'}
              </p>
              {refreshingBalance && (
                <FaSpinner style={{ fontSize: '20px', animation: 'spin 1s linear infinite' }} />
              )}
            </div>
            <button
              onClick={() => fetchBalance(true)}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: refreshingBalance ? 0.7 : 1,
              }}
              disabled={refreshingBalance}
            >
              {refreshingBalance ? (
                <>
                  <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                  Updating...
                </>
              ) : (
                'Refresh Balance'
              )}
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div
            className="card"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <div className="grid-2" style={{ gap: '8px' }}>
              <Link
                to="/transfer"
                style={{
                  textAlign: 'center',
                  padding: '16px',
                  background: '#eff6ff',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#0f172a',
                }}
              >
                <FaArrowUp style={{ color: '#16a34a', fontSize: '24px', marginBottom: '4px' }} />
                <span style={{ fontSize: '14px' }}>Send</span>
              </Link>
              <Link
                to="/transactions"
                style={{
                  textAlign: 'center',
                  padding: '16px',
                  background: '#f1f5f9',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#0f172a',
                }}
              >
                <FaHistory style={{ color: '#2563eb', fontSize: '24px', marginBottom: '4px' }} />
                <span style={{ fontSize: '14px' }}>History</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Account ID Card (NEW) */}
        {accountId && (
          <div
            className="card"
            style={{
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #1e293b, #334155)',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Your Account ID</p>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                }}
              >
                {accountId}
              </p>
            </div>
            <button
              onClick={copyAccountId}
              style={{
                padding: '8px 20px',
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                whiteSpace: 'nowrap',
              }}
            >
              <FaCopy /> {copied ? 'Copied!' : 'Copy ID'}
            </button>
          </div>
        )}

        {/* Summary Cards: Spent, Received, Net */}
        <div className="grid-3" style={{ marginBottom: '24px' }}>
          <div className="card" style={{ borderLeft: '4px solid #dc2626' }}>
            <p style={{ fontSize: '14px', color: '#64748b' }}>Total Spent (Recent)</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
              ₹{totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="card" style={{ borderLeft: '4px solid #16a34a' }}>
            <p style={{ fontSize: '14px', color: '#64748b' }}>Total Received (Recent)</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
              ₹{totalReceived.toLocaleString()}
            </p>
          </div>
          <div className="card" style={{ borderLeft: '4px solid #7c3aed' }}>
            <p style={{ fontSize: '14px', color: '#64748b' }}>Net Flow</p>
            <p
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: totalReceived - totalSpent >= 0 ? '#16a34a' : '#dc2626',
              }}
            >
              ₹{(totalReceived - totalSpent).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="grid-3" style={{ marginBottom: '24px' }}>
          <Link to="/transfer" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: '#dbeafe', borderRadius: '9999px' }}>
                <FaArrowUp style={{ color: '#2563eb' }} />
              </div>
              <div>
                <h3 style={{ fontWeight: '600' }}>Transfer Money</h3>
                <p style={{ fontSize: '14px', color: '#64748b' }}>Send to other accounts</p>
              </div>
            </div>
          </Link>

          <Link
            to="/transactions"
            className="card"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: '#f3e8ff', borderRadius: '9999px' }}>
                <FaHistory style={{ color: '#7c3aed' }} />
              </div>
              <div>
                <h3 style={{ fontWeight: '600' }}>History</h3>
                <p style={{ fontSize: '14px', color: '#64748b' }}>View all transactions</p>
              </div>
            </div>
          </Link>

          <Link to="/analytics" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '9999px' }}>
                <FaChartPie style={{ color: '#d97706' }} />
              </div>
              <div>
                <h3 style={{ fontWeight: '600' }}>Analytics</h3>
                <p style={{ fontSize: '14px', color: '#64748b' }}>View spending insights</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Spinner Animation */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Dashboard;