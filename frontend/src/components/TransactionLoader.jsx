import React from 'react';
import { FaLock, FaSpinner } from 'react-icons/fa';

const TransactionLoader = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '40px 24px',
      background: '#0f172a', // Dark, premium background
      borderRadius: '20px',
      border: '1px solid #1e293b',
      minHeight: '320px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated glowing gradient background */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle at 30% 50%, rgba(37, 99, 235, 0.08), transparent 60%)',
        animation: 'rotateGlow 8s linear infinite',
      }} />

      {/* Payment Card Icon with Glowing Lock */}
      <div style={{
        position: 'relative',
        width: '100px',
        height: '100px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Rotating ring */}
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute' }}>
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#1e293b"
            strokeWidth="3"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="339.292"
            strokeDashoffset="150"
            style={{ animation: 'spinRing 1.2s ease-in-out infinite' }}
          />
        </svg>
        {/* Center Lock Icon */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(37, 99, 235, 0.3)',
          zIndex: 2,
        }}>
          <FaLock style={{ fontSize: '28px', color: 'white' }} />
        </div>
      </div>

      {/* Card Shimmer Placeholder */}
      <div style={{
        width: '80%',
        maxWidth: '240px',
        height: '48px',
        borderRadius: '12px',
        background: 'linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmerCard 1.8s ease-in-out infinite',
        marginBottom: '20px',
      }} />

      <h3 style={{
        fontWeight: '600',
        color: '#f1f5f9',
        fontSize: '18px',
        letterSpacing: '0.5px',
        marginBottom: '6px',
        zIndex: 2,
      }}>
        Processing Transaction
      </h3>
      <p style={{
        color: '#94a3b8',
        fontSize: '14px',
        zIndex: 2,
      }}>
        Please do not refresh or close this page
      </p>

      {/* Progress Dots */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginTop: '20px',
        zIndex: 2,
      }}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#3b82f6',
              opacity: 0.3,
              animation: `dotPulse 1.4s ease-in-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes spinRing {
          0% { stroke-dashoffset: 339.292; }
          50% { stroke-dashoffset: 80; }
          100% { stroke-dashoffset: 339.292; transform: rotate(360deg); }
        }
        @keyframes shimmerCard {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.4); opacity: 1; }
        }
        @keyframes rotateGlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TransactionLoader;