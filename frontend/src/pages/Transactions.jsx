import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import ExportCSV from '../components/ExportCSV';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const navigate = useNavigate();

  const fetchTransactions = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/transactions?page=${pageNum}&limit=${limit}`);
      setTransactions(response.data.transactions || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      setTransactions([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  return (
    <div className="page-container">
      <div className="container" style={{ paddingTop: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Transaction History</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {transactions.length > 0 && (
                <ExportCSV 
                  transactions={transactions} 
                  filename={`transactions_${new Date().toISOString().split('T')[0]}.csv`}
                />
              )}
              <button
                onClick={() => navigate('/dashboard')}
                style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ← Back
              </button>
            </div>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>Loading...</p>
          ) : transactions.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>No transactions found</p>
          ) : (
            <>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Category</th>
                      <th>From / To</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => {
                      const isDebit = tx.txType === 'DEBIT';
                      // Safe fallbacks for missing fields
                      const displayName = isDebit 
                        ? (tx.receiverName || tx.counterparty || 'Unknown') 
                        : (tx.senderName || tx.counterparty || 'Unknown');
                      
                      const displayId = isDebit 
                        ? (tx.toAccount || tx.account || 'N/A') 
                        : (tx.account || tx.toAccount || 'N/A');
                      
                      // Shorten account ID for display
                      const shortId = typeof displayId === 'string' 
                        ? displayId.slice(-6) 
                        : displayId?.toString()?.slice(-6) || 'N/A';
                      
                      return (
                        <tr key={tx._id}>
                          <td>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 12px',
                              borderRadius: '9999px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: isDebit ? '#fee2e2' : '#dcfce7',
                              color: isDebit ? '#991b1b' : '#166534',
                            }}>
                              {isDebit ? ' DEBIT' : 'CREDIT'}
                            </span>
                          </td>
                          <td>
                            <span style={{ textTransform: 'capitalize' }}>
                              {tx.type || 'other'}
                            </span>
                          </td>
                          <td>
                            <div>
                              <span style={{ fontWeight: '500' }}>{displayName}</span>
                              <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>
                                ID: ...{shortId}
                              </span>
                            </div>
                          </td>
                          <td style={{
                            fontWeight: '600',
                            color: isDebit ? '#dc2626' : '#16a34a',
                          }}>
                            {isDebit ? '-' : '+'}₹{tx.amount?.toLocaleString() || 0}
                          </td>
                          <td>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 10px',
                              borderRadius: '9999px',
                              fontSize: '11px',
                              fontWeight: '600',
                              background: tx.status === 'COMPLETED' ? '#dcfce7' 
                                : tx.status === 'PENDING' ? '#fef9c3' : '#fee2e2',
                              color: tx.status === 'COMPLETED' ? '#166534' 
                                : tx.status === 'PENDING' ? '#854d0e' : '#991b1b',
                            }}>
                              {tx.status || 'PENDING'}
                            </span>
                          </td>
                          <td style={{ color: '#64748b', fontSize: '14px' }}>
                            {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'N/A'}
                            {tx.createdAt ? ` ${new Date(tx.createdAt).toLocaleTimeString()}` : ''}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="btn-secondary"
                  style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                >
                  Previous
                </button>
                <span style={{ color: '#64748b' }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="btn-secondary"
                  style={{ opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;