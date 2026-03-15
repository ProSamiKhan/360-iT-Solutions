import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { subscribeToAuth } from './services/authService';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import TrackingPage from './pages/TrackingPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("App: Subscribing to auth...");
    const unsubscribe = subscribeToAuth((userProfile) => {
      console.log("App: Auth state updated", userProfile?.role || 'null');
      setUser(userProfile);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/client'} /> : <LoginPage />} />
        <Route path="/track" element={<TrackingPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute user={user} requiredRole="admin">
            <AdminDashboard user={user!} />
          </ProtectedRoute>
        } />

        {/* Client Routes */}
        <Route path="/client/*" element={
          <ProtectedRoute user={user} requiredRole="client">
            <ClientDashboard user={user!} />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
