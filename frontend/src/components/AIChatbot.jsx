import React, { useState } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: '👋 Hello! I\'m your AI financial advisor. Ask me about your spending habits, budget tips, or financial advice!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // ✅ Get transaction data for context
      const txResponse = await api.get('/transactions?limit=100');
      const transactions = txResponse.data.transactions || [];

      // Get budgets from localStorage
      const budgets = JSON.parse(localStorage.getItem('budgets') || '{}');

      const response = await api.post('/ai/ask', {
        message: input,
        transactions,
        budgets,
      });

      setMessages(prev => [...prev, { role: 'bot', content: response.data.insights }]);
    } catch (error) {
      toast.error('Failed to get AI response');
      setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I\'m having trouble connecting. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          zIndex: 100,
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '150px',
          right: '24px',
          width: '380px',
          maxHeight: '500px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 100,
        }} className="dark:bg-gray-800">
          {/* Header */}
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <FaRobot size={24} />
            <div>
              <h4 style={{ fontWeight: '600' }}>AI Financial Advisor</h4>
              <p style={{ fontSize: '12px', opacity: 0.8 }}>Powered by Gemini</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            maxHeight: '300px',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: msg.role === 'user' ? '#2563eb' : '#f1f5f9',
                  color: msg.role === 'user' ? 'white' : '#0f172a',
                  fontSize: '14px',
                }}
                className="dark:bg-gray-700 dark:text-white"
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', padding: '10px 14px', background: '#f1f5f9', borderRadius: '12px' }}>
                <span style={{ animation: 'pulse 1s infinite' }}>Typing...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            padding: '12px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '8px',
          }} className="dark:border-gray-700">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your finances..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '14px',
              }}
              className="input-field"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              style={{
                padding: '8px 16px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;