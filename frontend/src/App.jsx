import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import '@/App.css';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import MyPlans from './pages/MyPlans';
import MaterialViewer from './pages/MaterialViewer';
import Settings from './pages/Settings';
import AdminPage from './pages/admin/AdminPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import RefundPolicy from './pages/RefundPolicy';
import CancellationPolicy from './pages/CancellationPolicy';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Axios interceptor to add token
axios.interceptors.request.use((config) => {
  // Check if request already has Authorization header (from admin pages)
  if (!config.headers.Authorization) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const AuthContext = React.createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`);
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route
              path="/auth"
              element={!user ? <AuthPage /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/auth" />}
            />
            <Route
              path="/my-plans"
              element={user ? <MyPlans /> : <Navigate to="/auth" />}
            />
            <Route
              path="/settings"
              element={user ? <Settings /> : <Navigate to="/auth" />}
            />
            <Route
              path="/materials/:subjectId"
              element={user ? <MaterialViewer /> : <Navigate to="/auth" />}
            />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/cancellation" element={<CancellationPolicy />} />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/auth"} />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
