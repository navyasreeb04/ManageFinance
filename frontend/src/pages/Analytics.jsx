import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  LineChart, Line, XAxis, YAxis,
  Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';

const COLORS = ['#2563eb', '#7c3aed', '#16a34a', '#dc2626', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6', '#f97316'];

const Analytics = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/transactions?limit=200');
      const data = response.data.transactions || [];
      setTransactions(data);
      processAnalytics(data);
    } catch (error) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const processAnalytics = (data) => {
    const categoryMap = {};
    let debitTotal = 0;
    let creditTotal = 0;

    data.forEach(tx => {
      const isDebit = tx.txType === 'DEBIT';
      
      if (isDebit) {
        debitTotal += tx.amount;
        const type = tx.type || 'other';
        if (!categoryMap[type]) categoryMap[type] = 0;
        categoryMap[type] += tx.amount;
      } else if (tx.txType === 'CREDIT') {
        creditTotal += tx.amount;
      }
    });

    setTotalDebit(debitTotal);
    setTotalCredit(creditTotal);

    const catData = Object.keys(categoryMap).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: categoryMap[key],
    }));
    setCategoryData(catData);

    // Monthly breakdown
    const monthMap = {};
    data.forEach(tx => {
      const month = new Date(tx.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthMap[month]) monthMap[month] = 0;
      monthMap[month] += tx.amount;
    });
    setMonthlyData(Object.keys(monthMap).map(key => ({
      month: key,
      amount: monthMap[key],
    })));

    // Daily trend
    const dayMap = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString();
    }).reverse();

    last7Days.forEach(day => {
      dayMap[day] = 0;
    });

    data.forEach(tx => {
      const day = new Date(tx.createdAt).toLocaleDateString();
      if (dayMap[day] !== undefined) {
        dayMap[day] += tx.amount;
      }
    });

    setDailyData(Object.keys(dayMap).map(key => ({
      date: key,
      amount: dayMap[key],
    })));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="page-container">
      <div className="container" style={{ paddingTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Analytics Dashboard</h1>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ← Back
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '40px 0' }}>Loading analytics...</p>
        ) : transactions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📊</p>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>No Data Yet</h3>
            <p style={{ color: '#64748b' }}>Start making transactions to see your spending analytics</p>
          </div>
        ) : (
          <>
            <div className="grid-3" style={{ marginBottom: '24px' }}>
              <div className="card" style={{ borderLeft: '4px solid #dc2626' }}>
                <p style={{ fontSize: '14px', color: '#64748b' }}>Total Spent (DEBIT)</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc2626' }}>
                  ₹{totalDebit.toLocaleString()}
                </p>
              </div>
              <div className="card" style={{ borderLeft: '4px solid #16a34a' }}>
                <p style={{ fontSize: '14px', color: '#64748b' }}>Total Received (CREDIT)</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>
                  ₹{totalCredit.toLocaleString()}
                </p>
              </div>
              <div className="card" style={{ borderLeft: '4px solid #7c3aed' }}>
                <p style={{ fontSize: '14px', color: '#64748b' }}>Net Balance</p>
                <p style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: totalCredit - totalDebit >= 0 ? '#16a34a' : '#dc2626',
                }}>
                  ₹{(totalCredit - totalDebit).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '24px' }}>
              <div className="card">
                <h3 style={{ fontWeight: '600', marginBottom: '16px' }}>Spending by Category</h3>
                {categoryData.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>
                    No spending data yet. Make some DEBIT transactions!
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="card">
                <h3 style={{ fontWeight: '600', marginBottom: '16px' }}>Monthly Spending</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card" style={{ marginTop: '24px' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '16px' }}>Daily Spending Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ fill: '#2563eb', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card" style={{ marginTop: '24px' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '16px' }}>Category Breakdown</h3>
              {categoryData.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>
                  No category data available
                </p>
              ) : (
                <div className="grid-3" style={{ gap: '12px' }}>
                  {categoryData.map((cat, idx) => (
                    <div key={idx} style={{
                      padding: '12px 16px',
                      background: 'rgba(37, 99, 235, 0.05)',
                      borderRadius: '8px',
                      border: '1px solid rgba(37, 99, 235, 0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span style={{ fontWeight: '500' }}>{cat.name}</span>
                      <span style={{ fontWeight: 'bold', color: '#2563eb' }}>
                        ₹{cat.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;