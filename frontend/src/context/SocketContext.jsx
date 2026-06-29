import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!token || !user) return;

    // ✅ Build WebSocket URL from VITE_API_URL
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const socketUrl = apiUrl.replace('/api', '').replace('http', 'ws');
    // For production: https://backend.onrender.com → wss://backend.onrender.com

    console.log('🔌 Connecting to WebSocket:', socketUrl);
    const newSocket = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    setSocket(newSocket);
    // ... rest of the code stays the same
  }, []);

  // ... return provider
};