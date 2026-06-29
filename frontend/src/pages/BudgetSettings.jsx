import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../utils/api'; 

const BudgetSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : {
      food: { limit: 5000, spent: 0 },
      rent: { limit: 15000, spent: 0 },
      entertainment: { limit: 3000, spent: 0 },
      shopping: { limit: 5000, spent: 0 },
      transport: { limit: 2000, spent: 0 },
      bills: { limit: 8000, spent: 0 },
      education: { limit: 10000, spent: 0 },
      health: { limit: 5000, spent: 0 },
      other: { limit: 5000, spent: 0 },
    };
  });

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions to calculate spent amounts
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions?limit=500');
        const data = response.data.transactions || [];
        setTransactions(data);
        calculateSpent(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const calculateSpent = (txs) => {
    const spendingMap = {};
    txs.forEach(tx => {
      if (tx.txType === 'DEBIT') {
        const cat = tx.type || 'other';
        if (!spendingMap[cat]) spendingMap[cat] = 0;
        spendingMap[cat] += tx.amount;
      }
    });
    
    const newBudgets = { ...budgets };
    Object.keys(newBudgets).forEach(cat => {
      newBudgets[cat].spent = spendingMap[cat] || 0;
    });
    setBudgets(newBudgets);
    localStorage.setItem('budgets', JSON.stringify(newBudgets));
  };

  const handleBudgetChange = (category, value) => {
    const newBudgets = { ...budgets };
    newBudgets[category].limit = parseFloat(value) || 0;
    setBudgets(newBudgets);
    localStorage.setItem('budgets', JSON.stringify(newBudgets));
  };

  const getPercentage = (spent, limit) => {
    if (limit === 0) return 0;
    return Math.min(Math.round((spent / limit) * 100), 100);
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return '#dc2626';
    if (percentage >= 70) return '#f59e0b';
    return '#22c55e';
  };

  const getStatusText = (percentage) => {
    if (percentage >= 100) return 'Exhausted!';
    if (percentage >= 70 && percentage<100) return '⚡ Getting close';
    return 'On track';
  };


  return (
    <div className="page-container">
      <div className="container" style={{ paddingTop: '24px', maxWidth: '800px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Budget Settings</h1>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ← Back
            </button>
          </div>

          <p style={{ color: '#64748b', marginBottom: '24px' }}>
            Set monthly budgets for each category. We'll alert you when you're approaching your limits.
          </p>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#64748b' }}>Loading...</p>
          ) : (
            <div className="space-y-4">
              {Object.keys(budgets).map((category) => {
                const { limit, spent } = budgets[category];
                const percentage = getPercentage(spent, limit);
                const color = getStatusColor(percentage);
                const status = getStatusText(percentage);

                return (
                  <div
                    key={category}
                    style={{
                      padding: '16px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: `2px solid ${ percentage >=100 ? '#f9a0a0' : percentage > 70  ? '#fbe89d' : '#e2e8f0'}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{category}</span>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>
                          ₹{spent.toLocaleString()} / ₹{limit.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '600', color }}>{status}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="number"
                          value={limit}
                          onChange={(e) => handleBudgetChange(category, e.target.value)}
                          style={{
                            width: '100px',
                            padding: '6px 10px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            fontSize: '14px',
                          }}
                          min="0"
                        />
                        <span style={{ fontSize: '14px', color: '#64748b' }}>₹</span>
                      </div>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      background: '#e2e8f0',
                      borderRadius: '9999px',
                      marginTop: '8px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: color,
                        borderRadius: '9999px',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                );
              })}

              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: '#eff6ff',
                borderRadius: '8px',
                border: '1px solid #dbeafe',
              }}>
                <p style={{ fontSize: '14px', color: '#1e40af' }}>
                  Budgets are saved locally. When you exceed 70% of a budget, you'll see a warning.
                  When you exceed 90%, you'll get an alert!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetSettings;