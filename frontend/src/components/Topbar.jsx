import { Search, Bell, User, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useSystem } from '../context/SystemContext';

function Topbar() {
  const { activeAlert, dismissAlert } = useSystem();

  return (
    <div className="topbar-wrapper" style={{ width: '100%' }}>
      {activeAlert && (
        <div className="emergency-alert-bar animate-fade-in" style={{ 
          background: 'var(--danger-red)', color: 'white', padding: '8px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, fontWeight: 600 }}>
            <AlertCircle size={16} />
            EMERGENCY: {activeAlert.message} (Issued by {activeAlert.sender})
          </div>
          <X size={16} style={{ cursor: 'pointer' }} onClick={dismissAlert} />
        </div>
      )}
      <div className="topbar">
      <div className="search-bar">
        <Search size={16} color="var(--text-muted)" />
        <input type="text" placeholder="Search insights..." />
      </div>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button className="btn btn-outline" style={{ background: '#fef3c7', borderColor: '#f59e0b', color: '#b45309' }} onClick={async () => {
          const msg = prompt('Broadcast announcement to ALL volunteers:');
          if (msg) {
            await addDoc(collection(db, 'messages'), {
              to: 'all',
              from: 'NGO Admin',
              text: msg,
              type: 'broadcast',
              timestamp: serverTimestamp()
            });
            alert('Announcement broadcasted!');
          }
        }}>Broadcast Alert</button>
        <button className="btn btn-outline" onClick={() => alert('Exporting data as CSV...')}>Export Data</button>
        <button className="btn btn-primary" onClick={() => alert('Deploying resources to active sectors...')}>Deploy Resources</button>
        
        <div style={{ width: 1, height: 24, background: 'var(--border-color)' }} />
        
        <Bell size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
        <User size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
      </div>
      </div>
    </div>
  );
}

export default Topbar;
