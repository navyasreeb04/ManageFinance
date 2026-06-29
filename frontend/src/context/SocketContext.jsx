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



    if (!token || !user) {
      return;
    }

    const newSocket = io('http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket', 'polling'], // ✅ Fallback
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('register-user', user._id);
    });

    newSocket.on('notification', (data) => {
      setNotifications(prev => [...prev, data]);
      // ✅ Show toast
      toast.success(data.message, {
        duration: 5000,
        position: 'top-right',
      });
    });

    newSocket.on('connect_error', (error) => {
    });

    newSocket.on('disconnect', (reason) => {
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