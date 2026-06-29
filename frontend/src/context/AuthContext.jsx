import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedAccountId = localStorage.getItem('accountId');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedAccountId) {
      setAccountId(storedAccountId);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Register
  const register = async (userData) => {
    const response = await api.post('/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      transactionPin: userData.transactionPin, //  Send PIN during registration
    });
    return response.data;
  };

  // Login
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    //  Store user with hasPin flag
    const userWithPin = {
      ...user,
      hasPin: user.hasPin || false,
    };
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithPin));
    setUser(userWithPin);
    
    await fetchUserAccount();
    return response.data;
  };

  const refreshUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    const response = await api.get('/auth/me');
    const updatedUser = response.data.user;
    const userWithPin = {
      ...updatedUser,
      hasPin: updatedUser.hasPin || false,
    };
    localStorage.setItem('user', JSON.stringify(userWithPin));
    setUser(userWithPin);
    return userWithPin;
  } catch (error) {
  }
};

  // Fetch user's account
  const fetchUserAccount = async () => {
    try {
      const response = await api.get('/accounts');
      const accounts = response.data.accounts;
      
      if (accounts && accounts.length > 0) {
        const accId = accounts[0]._id;
        setAccountId(accId);
        localStorage.setItem('accountId', accId);
        return accId;
      } else {
        const createResponse = await api.post('/accounts');
        const newAccount = createResponse.data.account;
        setAccountId(newAccount._id);
        localStorage.setItem('accountId', newAccount._id);
        return newAccount._id;
      }
    } catch (error) {
      return null;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('accountId');
    setUser(null);
    setAccountId(null);
    window.location.href = '/login';
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      accountId, 
      login, 
      register, 
      logout, 
      loading, 
      darkMode, 
      toggleDarkMode, 
      fetchUserAccount,
      refreshUser, // Add this
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};