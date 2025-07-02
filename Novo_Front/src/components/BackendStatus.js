import React, { useState, useEffect } from 'react';
import { checkBackendStatus } from '../services/api';

function BackendStatus() {
  const [isOnline, setIsOnline] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkBackendStatus();
        setIsOnline(status);
      } catch (error) {
        setIsOnline(false);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    
    // Verificar status a cada 30 segundos
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className={`backend-status ${isOnline ? 'online' : 'offline'}`}>
      <div className="status-indicator">
        <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
        <span className="status-text">
          {isOnline ? 'Backend Online' : 'Backend Offline'}
        </span>
      </div>
    </div>
  );
}

export default BackendStatus; 