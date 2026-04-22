import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, UploadCloud, FileText, Users, Map, 
  Settings, HelpCircle, AlertTriangle, Cloud, ShieldCheck, LogOut 
} from 'lucide-react';

function Sidebar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="brand">
        <div style={{ background: '#111', padding: 8, borderRadius: 8, color: 'white', display: 'flex', alignItems: 'center' }}>
          <Cloud size={20} />
        </div>
        <div>
          <h1>SevaSetu</h1>
          <p>{role === 'ngo' ? 'NGO Portal' : 'Volunteer Portal'}</p>
        </div>
      </div>

      <button className="btn btn-danger emergency-alert-btn">
        <AlertTriangle size={16} />
        Emergency Alert
      </button>

      <div className="nav-links">
        {role === 'volunteer' && (
          <>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', padding: '12px 16px 8px', letterSpacing: 1 }}>FIELD OPERATIONS</div>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <LayoutDashboard size={20} /> Overview
            </NavLink>
            <NavLink to="/upload" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <UploadCloud size={20} /> Data Ingestion
            </NavLink>
            <NavLink to="/cases" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <FileText size={20} /> My Reports
            </NavLink>
          </>
        )}

        {role === 'ngo' && (
          <>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', padding: '12px 16px 8px', letterSpacing: 1 }}>COORDINATION</div>
            <NavLink to="/ngo" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <ShieldCheck size={20} /> Dashboard
            </NavLink>
            <NavLink to="/volunteers" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <Users size={20} /> Personnel
            </NavLink>
            <NavLink to="/map" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <Map size={20} /> Crisis Map
            </NavLink>
          </>
        )}
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)' }}>
        <NavLink to="/settings" className="nav-item" style={{ marginBottom: 4 }}>
          <Settings size={20} /> Settings
        </NavLink>
        <div onClick={handleLogout} className="nav-item" style={{ cursor: 'pointer', color: 'var(--danger-red)' }}>
          <LogOut size={20} /> Logout
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
