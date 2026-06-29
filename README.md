# 💰 ManageFinance – Full Stack Fintech Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> A production‑grade fintech platform demonstrating secure money transfers with idempotency, double‑entry accounting, real‑time WebSocket notifications, and an AI‑powered financial advisor.

🔗 **Live Demo**: [Backend API](https://your-backend-url.com) · [Frontend App](https://your-frontend-url.com)

---

## ✨ Key Features

| Category | Features |
|----------|----------|
| **Core Banking** | Idempotent transactions (UUID keys), double‑entry ledger, ACID database sessions, transaction PIN with OTP reset, spending categories (Food, Rent, Bills, etc.) |
| **Analytics & Budgets** | Interactive charts (Pie, Bar, Line), spending breakdown by category, monthly/daily trends, custom budget limits with smart alerts (70% warning, 90% critical) |
| **Real‑Time & AI** | WebSocket notifications for sent/received funds, Gemini‑powered AI financial advisor with personalized spending insights |
| **Security** | JWT authentication, bcrypt hashing, rate limiting, Helmet security headers, token blacklisting |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite, React Router, Tailwind CSS, Recharts, Socket.io Client |
| **Backend** | Node.js, Express, MongoDB (Mongoose), Socket.io, JWT, bcrypt, Nodemailer |
| **AI** | Google Gemini (Generative AI) |
| **Deployment** | Render (Backend) · Vercel (Frontend) |

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/navyasreeb04/ManageFinance.git
cd ManageFinance

# 2. Backend setup
cd backend
npm install
cp .env.example .env   # Add MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm run dev

# 3. Frontend setup
cd ../frontend
npm install
cp .env.example .env   # Add VITE_API_URL=http://localhost:3000/api
npm run dev
```


---

## 📋 API Overview

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register` | User registration with transaction PIN |
| `POST /api/auth/login` | User login with JWT |
| `POST /api/transactions` | Create idempotent transaction (requires `Idempotency-Key` header) |
| `GET /api/transactions` | Paginated transaction history |
| `POST /api/ai/ask` | AI financial advice (Gemini) |


---

## 🎯 Engineering Highlights

- **Idempotency**: Prevents double charges using UUID keys stored with transaction status.
- **Double‑Entry Ledger**: Each transfer creates one DEBIT and one CREDIT entry – fully auditable.
- **ACID Transactions**: MongoDB sessions ensure atomicity (sender debit + receiver credit roll back together).
- **Concurrency**: Optimistic locking planned for production‑grade race‑condition protection.

---

## 📄 License

MIT © [navyasreeb04](https://github.com/navyasreeb04)
