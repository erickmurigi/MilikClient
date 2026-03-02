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
      socketInstance = io('http://localhost:8800', {
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

    return () => {
      // Keep socket alive for other components
      // Only disconnect on complete app closure
    };
  }, []);

  return socketRef.current;
};

export default useSocket;
