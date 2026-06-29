import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BudgetSettings from './pages/BudgetSettings';
import AIChatbot from './components/AIChatbot';
import { SocketProvider } from './context/SocketContext';
// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transfer from './pages/Transfer';
import Balance from './pages/Balance';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Blogs from './pages/Blogs'; // ADD THIS
//import ForgotPassword from './pages/ForgotPassword';
import ResetPin from './pages/ResetPin';

function App() {
  return (
    <Router>
      <AuthProvider>
         <SocketProvider>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          background: '#f1f5f9',
          transition: 'background 0.3s',
        }} className="app-container">
          <Navbar />
          <Toaster position="top-right" />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blogs" element={<Blogs />} /> 
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
             {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
              <Route path="/reset-pin" element={<ResetPin />} />
              
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/transfer" element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
              <Route path="/balance" element={<ProtectedRoute><Balance /></ProtectedRoute>} />
              <Route path="/budget-settings" element={<ProtectedRoute><BudgetSettings /></ProtectedRoute>} />
              <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
          <AIChatbot />
        </div>

        <style>{`
          body.dark .app-container {
            background: #0f172a !important;
          }
        `}</style>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;