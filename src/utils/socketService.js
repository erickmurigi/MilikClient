import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

let socketInstance = null;

export const disconnectSocket = () => {
  if (!socketInstance) return;

  try {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
  } catch (error) {
    console.warn("Failed to disconnect socket cleanly", error);
  } finally {
    socketInstance = null;
  }
};

const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Create socket connection if not already connected
    if (!socketInstance) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8800/api';
      const socketUrl = apiUrl.replace('/api', '');
      
      socketInstance = io(socketUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected:', socketInstance.id);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      socketInstance.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }

    socketRef.current = socketInstance;

    // Cleanup on unmount - disconnect if this is the last component
    return () => {
      // Only disconnect if we're truly unmounting the app
      // Individual components should keep the socket alive
    };
  }, []);

  return socketRef.current;
};

export default useSocket;
