import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, User, Globe, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Settings() {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'system', label: 'System Config', icon: <Globe size={18} /> },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences and system configurations.</p>
      </div>

      <div className="upload-grid" style={{ gridTemplateColumns: '250px 1fr' }}>
        <div className="card" style={{ padding: '12px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="nav-item"
              style={{ 
                width: '100%', border: 'none', background: activeTab === tab.id ? '#f3f4f6' : 'transparent',
                cursor: 'pointer', textAlign: 'left', color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="card">
          {activeTab === 'profile' && (
            <div>
              <h3 style={{ marginBottom: 24, fontWeight: 600 }}>Account Profile</h3>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 32 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: 'var(--primary-blue)' }}>
                  {user?.name?.[0]}
                </div>
                <div>
                  <h4 style={{ fontWeight: 600 }}>{user?.name}</h4>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{role === 'ngo' ? 'NGO Coordinator' : `Volunteer • ${user?.specialty || 'General Support'}`}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>Full Name</label>
                  <input type="text" className="search-bar" style={{ width: '100%', background: 'white', border: '1px solid var(--border-color)' }} defaultValue={user?.name} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>Email Address</label>
                  <input type="text" disabled className="search-bar" style={{ width: '100%', background: '#f9fafb', border: '1px solid var(--border-color)', cursor: 'not-allowed' }} defaultValue={user?.email} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>Phone / Password</label>
                  <input type="text" className="search-bar" style={{ width: '100%', background: 'white', border: '1px solid var(--border-color)' }} defaultValue={user?.phone} />
                </div>
                {role === 'volunteer' && (
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>Specialization</label>
                    <input type="text" className="search-bar" style={{ width: '100%', background: 'white', border: '1px solid var(--border-color)' }} defaultValue={user?.specialty} />
                  </div>
                )}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase' }}>Sector Assignment</label>
                  <select className="search-bar" style={{ width: '100%', background: 'white', border: '1px solid var(--border-color)', padding: '8px 16px' }} defaultValue={user?.sector || 'Sector 4 (HQ)'}>
                    <option>Sector 4 (HQ)</option>
                    <option>Sector 1 (North)</option>
                    <option>Sector 2 (East)</option>
                    <option>Sector 3 (West)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 style={{ marginBottom: 24, fontWeight: 600 }}>Notification Preferences</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                {[
                  { label: 'Emergency Alerts', desc: 'Real-time push notifications for life-threatening events' },
                  { label: 'Case Assignment', desc: 'Notify when a new case is assigned to your sector' },
                  { label: 'System Health', desc: 'Weekly reports on volunteer wellness and resource levels' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.desc}</div>
                    </div>
                    <input type="checkbox" defaultChecked style={{ width: 20, height: 20 }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 32, borderTop: '1px solid var(--border-color)', paddingTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={() => alert("Settings saved!")}>
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
