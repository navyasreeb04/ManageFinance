import React from 'react';
import { CSVLink } from 'react-csv';
import { FaDownload } from 'react-icons/fa';

const ExportCSV = ({ transactions, filename = 'transactions.csv' }) => {
  // Format data for CSV
  const csvData = transactions.map(tx => ({
    'Transaction ID': tx._id || 'N/A',
    'Type': tx.txType || 'TRANSFER',
    'Amount': tx.amount,
    'Category': tx.type || 'other',
    'Status': tx.status || 'COMPLETED',
    'Date': new Date(tx.createdAt).toLocaleDateString(),
    'Time': new Date(tx.createdAt).toLocaleTimeString(),
  }));

  const headers = [
    { label: 'Transaction ID', key: 'Transaction ID' },
    { label: 'Type', key: 'Type' },
    { label: 'Amount (₹)', key: 'Amount' },
    { label: 'Category', key: 'Category' },
    { label: 'Status', key: 'Status' },
    { label: 'Date', key: 'Date' },
    { label: 'Time', key: 'Time' },
  ];

  return (
    <CSVLink
      data={csvData}
      headers={headers}
      filename={filename}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        background: '#2563eb',
        color: 'white',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
      onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
      onMouseLeave={(e) => e.target.style.background = '#2563eb'}
    >
      <FaDownload /> Export CSV
    </CSVLink>
  );
};

export default ExportCSV;