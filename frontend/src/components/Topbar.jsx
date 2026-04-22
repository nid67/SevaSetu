import { Search, Bell, User } from 'lucide-react';

function Topbar() {
  return (
    <div className="topbar">
      <div className="search-bar">
        <Search size={16} color="var(--text-muted)" />
        <input type="text" placeholder="Search insights..." />
      </div>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button className="btn btn-outline">Export Data</button>
        <button className="btn btn-primary">Deploy Resources</button>
        
        <div style={{ width: 1, height: 24, background: 'var(--border-color)' }} />
        
        <Bell size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
        <User size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
      </div>
    </div>
  );
}

export default Topbar;
