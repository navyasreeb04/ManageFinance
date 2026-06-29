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

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const baseUrl = apiUrl.replace('/api', '');
    const socketUrl = baseUrl.replace('https://', 'wss://').replace('http://', 'ws://');

    console.log('🔌 Connecting to WebSocket:', socketUrl);
    const newSocket = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('🟢 WebSocket connected');
      newSocket.emit('register-user', user._id);
    });

    newSocket.on('notification', (data) => {
      setNotifications(prev => [...prev, data]);
      toast.success(data.message, { duration: 5000 });
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ WebSocket error:', error);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};