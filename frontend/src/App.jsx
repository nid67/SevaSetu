import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import DataIngestion from './pages/DataIngestion';
import Overview from './pages/Overview';
import Volunteers from './pages/Volunteers';
import NGODashboard from './pages/NGODashboard';
import Login from './pages/Login';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { role } = useAuth();
  if (!role) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to={role === 'volunteer' ? '/dashboard' : '/ngo'} replace />;
  return children;
};

function AppRoutes() {
  const { role } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={!role ? <Login /> : <Navigate to={role === 'volunteer' ? '/dashboard' : '/ngo'} replace />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/login" replace />} />
        
        {/* Volunteer Only */}
        <Route path="dashboard" element={
          <ProtectedRoute allowedRole="volunteer"><Overview /></ProtectedRoute>
        } />
        <Route path="upload" element={
          <ProtectedRoute allowedRole="volunteer"><DataIngestion /></ProtectedRoute>
        } />
        <Route path="cases" element={
          <ProtectedRoute allowedRole="volunteer"><Overview /></ProtectedRoute>
        } />

        {/* NGO Only */}
        <Route path="ngo" element={
          <ProtectedRoute allowedRole="ngo"><NGODashboard /></ProtectedRoute>
        } />
        <Route path="volunteers" element={
          <ProtectedRoute allowedRole="ngo"><Volunteers /></ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
