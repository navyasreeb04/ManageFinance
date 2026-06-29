import React from 'react';
import { Link } from 'react-router-dom';

const Blogs = () => {
  const blogPosts = [
    {
      id: 1,
      title: '5 Smart Ways to Save Money in 2024',
      excerpt: 'Learn practical strategies to build your savings and achieve financial freedom with these expert-backed tips.',
      category: 'Saving Tips',
      readTime: '5 min read',
      date: 'Jan 15, 2024',
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      id: 2,
      title: 'Understanding Idempotent Transactions',
      excerpt: 'Why your money stays safe even if you click "Transfer" twice – the magic of idempotency in fintech.',
      category: 'Technology',
      readTime: '4 min read',
      date: 'Jan 12, 2024',
      color: '#2563eb',
      bgColor: '#dbeafe',
    },
    {
      id: 3,
      title: 'The Future of Digital Banking',
      excerpt: 'How AI and blockchain are transforming the way we manage money, invest, and plan for retirement.',
      category: 'Fintech',
      readTime: '6 min read',
      date: 'Jan 10, 2024',
      color: '#7c3aed',
      bgColor: '#ede9fe',
    },
    {
      id: 4,
      title: 'Fraud Prevention: What You Need to Know',
      excerpt: 'Stay safe from online scams with these essential security tips every digital banking user must know.',
      category: 'Security',
      readTime: '3 min read',
      date: 'Jan 8, 2024',
      color: '#dc2626',
      bgColor: '#fecaca',
    },
    {
      id: 5,
      title: 'Investing 101: A Beginner\'s Guide',
      excerpt: 'Start your investment journey with this comprehensive guide to stocks, mutual funds, and more.',
      category: 'Investing',
      readTime: '7 min read',
      date: 'Jan 5, 2024',
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      id: 6,
      title: 'Digital Wallets vs Traditional Banking',
      excerpt: 'Compare the pros and cons of digital wallets and traditional banking to find what suits you best.',
      category: 'Banking',
      readTime: '4 min read',
      date: 'Jan 3, 2024',
      color: '#06b6d4',
      bgColor: '#cffafe',
    },
  ];

  return (
    <div className="page-container">
      <div className="container" style={{ paddingTop: '24px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          borderRadius: '16px',
          color: 'white',
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
               Finance Blogs
            </h1>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>
              Stay informed with the latest financial insights
            </p>
          </div>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', opacity: 0.9, fontSize: '14px' }}>
            ← Home
          </Link>
        </div>

        {/* Blog Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          {blogPosts.map((post) => (
            <div
              key={post.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                borderTop: `4px solid ${post.color}`,
                display: 'flex',
                flexDirection: 'column',
              }}
              className="blog-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '40px' }}>{post.emoji}</span>
                <span style={{
                  fontSize: '11px',
                  background: post.bgColor,
                  color: post.color,
                  padding: '2px 12px',
                  borderRadius: '9999px',
                  fontWeight: '600',
                }}>
                  {post.category}
                </span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#0f172a' }}>
                {post.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px', flex: 1 }}>
                {post.excerpt}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9',
              }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{post.readTime}</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{post.date}</span>
              </div>
            </div>
          ))}
        </div>

        <style>{`
          body.dark .blog-card {
            background: #1e293b !important;
            border-top-color: ${(props) => props.color || '#2563eb'} !important;
          }
          body.dark .blog-card h3 {
            color: #f1f5f9 !important;
          }
          body.dark .blog-card .border-top {
            border-top-color: #334155 !important;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Blogs;