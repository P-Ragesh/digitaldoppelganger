import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'participant' | 'admin' | null
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('doppelganger_token');
      const savedRole = localStorage.getItem('doppelganger_role');

      if (savedToken && savedRole) {
        setRole(savedRole);
        try {
          if (savedRole === 'participant') {
            const participantData = await apiFetch('/participant/me');
            setUser(participantData);
            if (participantData.assignment) {
              setAssignment(participantData.assignment);
            }
          } else if (savedRole === 'admin') {
            setUser({ username: 'admin' });
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loginParticipant = async (name, college) => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ name, college })
    });

    localStorage.setItem('doppelganger_token', res.token);
    localStorage.setItem('doppelganger_role', 'participant');
    
    setRole('participant');
    setUser(res.participant);
    setAssignment(res.participant.assignment || null);
    return res;
  };

  const loginAdmin = async (username, password) => {
    const res = await apiFetch('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    localStorage.setItem('doppelganger_token', res.token);
    localStorage.setItem('doppelganger_role', 'admin');

    setRole('admin');
    setUser({ username: res.username });
    return res;
  };

  const logout = () => {
    localStorage.removeItem('doppelganger_token');
    localStorage.removeItem('doppelganger_role');
    setUser(null);
    setRole(null);
    setAssignment(null);
  };

  const refreshParticipantData = async () => {
    if (role === 'participant') {
      try {
        const participantData = await apiFetch('/participant/me');
        setUser(participantData);
        if (participantData.assignment) {
          setAssignment(participantData.assignment);
        }
      } catch (err) {
        console.error('Refresh participant data error:', err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      assignment,
      setAssignment,
      loading,
      loginParticipant,
      loginAdmin,
      logout,
      refreshParticipantData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
