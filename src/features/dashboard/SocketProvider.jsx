import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import AppRoutes from './routes/index.jsx';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Use environment variable or fallback to prevent connection errors
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
    
    try {
      const s = io(socketUrl, {
        timeout: 5000,
        forceNew: true,
        reconnection: false // Disable reconnection to prevent errors
      });
      
      s.on('connect_error', (error) => {
        console.warn('Socket connection failed, continuing without real-time features:', error.message);
      });
      
      setSocket(s);
      return () => s.disconnect();
    } catch (error) {
      console.warn('Socket initialization failed, continuing without real-time features:', error);
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default AppRoutes; 