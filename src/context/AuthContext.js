import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/apiBaseUrl';

const AuthContext = createContext();
const REQUEST_CONFIG = { timeout: 8000 };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if admin is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/auth/me`, REQUEST_CONFIG);
          setAdmin(res.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        {
          email,
          password
        },
        REQUEST_CONFIG
      );

      const { token: newToken, ...adminData } = res.data;
      
      localStorage.setItem('adminToken', newToken);
      setToken(newToken);
      setAdmin(adminData);
      
      return { success: true };
    } catch (error) {
      const responseData = error.response?.data;
      const message =
        typeof responseData === 'string'
          ? responseData
          : responseData?.message || 'Login failed';
      return {
        success: false,
        message
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, null, REQUEST_CONFIG);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      setToken(null);
      setAdmin(null);
    }
  };

  const value = {
    admin,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!admin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
