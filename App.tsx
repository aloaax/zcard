import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicCard from './pages/PublicCard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import { DEFAULT_CARD } from './utils/defaultData';
import { auth } from './services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

// Protected Route Component
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If auth is not configured (demo mode), strictly speaking we might block or allow.
    // For this implementation: if Auth is configured, we check user. If not, we block access to force config.
    if (!auth) {
        setLoading(false);
        return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  
  // If Firebase keys aren't set, redirect to login (which will show error) or handle gracefully
  if (!auth) return <Navigate to="/login" replace />;

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Default route redirects to Mr. Salem's card */}
        <Route path="/" element={<Navigate to={`/${DEFAULT_CARD.slug}`} replace />} />
        
        {/* Public Card Route */}
        <Route path="/:slug" element={<PublicCard />} />
        
        {/* Protected Admin Dashboard */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to={`/${DEFAULT_CARD.slug}`} replace />} />
      </Routes>
    </Router>
  );
}

export default App;