// SessionContext.js
import React, { createContext, useState, useEffect } from 'react';
import fetch from 'node-fetch';

const SessionContext = createContext();

const SessionProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const createGuestSession = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/guest');
        const data = await res.json();
        setSessionId(data.guest_session_id);
        //console.log('Guest Session ID:', data.guest_session_id);
      } catch (err) {
        console.error('Error creating guest session:', err);
      }
    };

    createGuestSession();
  }, []);

  return (
    <SessionContext.Provider value={sessionId}>
      {children}
    </SessionContext.Provider>
  );
};

export { SessionContext, SessionProvider };
