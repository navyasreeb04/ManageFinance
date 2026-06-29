import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaEdit } from 'react-icons/fa';

const BudgetAlert = ({ transactions }) => {
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

  const [alerts, setAlerts] = useState([]);
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    const spendingMap = {};
    transactions.forEach(tx => {
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

    const newAlerts = [];
    const newWarnings = [];
    Object.keys(newBudgets).forEach(cat => {
      const { spent, limit } = newBudgets[cat];
      if (limit > 0) {
        const percentage = (spent / limit) * 100;
        if (percentage >= 100) {
          newAlerts.push({ category: cat, spent, limit, percentage: Math.round(percentage) });
        } else if (percentage >= 70) {
          newWarnings.push({ category: cat, spent, limit, percentage: Math.round(percentage) });
        }
      }
    });
    setAlerts(newAlerts);
    setWarnings(newWarnings);
  }, [transactions]);

  if (alerts.length === 0 && warnings.length === 0) {
    return (
      <div className="card" style={{
        padding: '12px 16px',
        background: '#f0fdf4',
        borderLeft: '4px solid #22c55e',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534' }}>
          <FaCheckCircle style={{ color: '#22c55e' }} />
          All categories are within budget
        </span>
        <button
          onClick={() => window.location.href = '/budget-settings'}
          style={{
            padding: '4px 12px',
            background: 'rgba(0,0,0,0.05)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <FaEdit /> Edit Budgets
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{
      padding: '16px',
      background: alerts.length > 0 ? '#fef2f2' : '#fffbeb',
      borderLeft: alerts.length > 0 ? '4px solid #dc2626' : '4px solid #f59e0b',
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{
          fontWeight: '600',
          color: alerts.length > 0 ? '#991b1b' : '#92400e',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <FaExclamationTriangle style={{ color: alerts.length > 0 ? '#dc2626' : '#f59e0b' }} />
          {alerts.length > 0 ? 'Budget Alerts' : 'Budget Warnings'}
        </h4>
        <button
          onClick={() => window.location.href = '/budget-settings'}
          style={{
            padding: '4px 12px',
            background: 'rgba(0,0,0,0.05)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <FaEdit /> Edit Budgets
        </button>
      </div>

      {/* Warnings */}
      {warnings.map((warn, idx) => (
        <div key={idx} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.5)',
          borderRadius: '6px',
          marginBottom: '6px',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <span style={{ fontWeight: '500', color: '#92400e', textTransform: 'capitalize' }}>
            {warn.category}
          </span>
          <span style={{ color: '#92400e' }}>
            ₹{warn.spent.toLocaleString()} / ₹{warn.limit.toLocaleString()}
            <span style={{ fontWeight: 'bold', marginLeft: '8px', color: '#f59e0b' }}>
              ({warn.percentage}% used)
            </span>
          </span>
        </div>
      ))}

      {/* Critical Alerts */}
      {alerts.map((alert, idx) => (
        <div key={idx} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          background: '#fef2f2',
          borderRadius: '6px',
          marginBottom: '6px',
          border: '1px solid #fca5a5',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <span style={{ fontWeight: '500', color: '#991b1b', textTransform: 'capitalize' }}>
            {alert.category}
          </span>
          <span style={{ color: '#991b1b' }}>
            ₹{alert.spent.toLocaleString()} / ₹{alert.limit.toLocaleString()}
            <span style={{ fontWeight: 'bold', marginLeft: '8px', color: '#dc2626' }}>
              ({alert.percentage}% used - EXCEEDED!)
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};

export default BudgetAlert;