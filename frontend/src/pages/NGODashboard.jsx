import { useState, useEffect } from 'react';
import { ShieldCheck, Truck, Users, MessageSquare, AlertCircle, Map as MapIcon, ChevronRight } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

function NGODashboard() {
  const [verificationQueue, setVerificationQueue] = useState([]);

  useEffect(() => {
    // Listen for cases that need verification or have passed initial validation
    const q = query(
      collection(db, 'cases'),
      where('status', 'in', ['pending_validation', 'ready_for_verification']),
      orderBy('metadata.created_at', 'desc')
    );
    
    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedCases = [];
      snapshot.forEach((doc) => {
        fetchedCases.push(doc.data());
      });
      setVerificationQueue(fetchedCases);
    }, (err) => {
      console.error("Firestore error:", err);
    });

    return () => unsub();
  }, []);

  const coordinatorStats = [
    { label: 'Awaiting Verification', value: verificationQueue.length.toString(), detail: 'Cases in queue', icon: <ShieldCheck size={20} />, color: 'var(--warning-orange)' },
    { label: 'Active Deployments', value: '18', detail: 'across 4 Sectors', icon: <Truck size={20} />, color: 'var(--primary-blue)' },
    { label: 'Available Resources', value: '85%', detail: 'Personnel Ready', icon: <Users size={20} />, color: 'var(--success-green)' },
    { label: 'Coordination Alerts', value: '5', detail: 'Last hour', icon: <MessageSquare size={20} />, color: 'var(--danger-red)' },
  ];

  return (
    <div className="ngo-dashboard">
      <div className="page-header">
        <h1 className="page-title">NGO Coordinator Dashboard</h1>
        <p className="page-subtitle">Centralized oversight for crisis verification and resource deployment.</p>
      </div>

      {/* Coordinator Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
        {coordinatorStats.map((stat, i) => (
          <div key={i} className="card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{stat.label}</span>
              <div style={{ color: stat.color }}>{stat.icon}</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stat.detail}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 24 }}>
        {/* Main Operational View */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontWeight: 600 }}>Crisis Intelligence Map</h3>
            <button className="btn btn-outline" style={{ fontSize: 12 }}><MapIcon size={14} /> Full Screen</button>
          </div>
          
          <div style={{ 
            height: 400, background: '#f3f4f6', borderRadius: 8, border: '1px solid var(--border-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-muted)'
          }}>
            <MapIcon size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
            <p>Interactive ArcGIS Map Integration</p>
            <p style={{ fontSize: 12 }}>Showing live case clusters and resource locations</p>
          </div>
        </div>

        {/* Verification Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: 20, fontSize: 16 }}>Verification Queue</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300, overflowY: 'auto', paddingRight: 4 }}>
              {verificationQueue.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, padding: '20px 0' }}>Queue is empty.</div>
              ) : verificationQueue.map((item, i) => (
                <div key={i} style={{ 
                  padding: 12, border: '1px solid var(--border-color)', borderRadius: 8,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s',
                  background: item.status === 'pending_validation' ? '#fffbeb' : 'white'
                }} className="verification-item">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{item.structured_data?.need?.primary_need || 'Uncategorized'}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.case_id} • {item.structured_data?.location?.raw || 'Unknown'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: item.priority_score > 80 ? 'var(--danger-red)' : 'var(--warning-orange)' }}>
                      Score: {item.priority_score}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {item.context?.urgency_assessment}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 20, justifyContent: 'center' }} disabled={verificationQueue.length === 0}>
              Process All Queue <ChevronRight size={16} />
            </button>
          </div>

          <div className="card" style={{ background: '#1e293b', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <AlertCircle size={20} color="#f87171" />
              <h3 style={{ fontWeight: 600, fontSize: 16 }}>Coordination Note</h3>
            </div>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>
              "Sector 4 currently has 3 redundant food requests. Merging into Case #CAS-8910 for optimized logistics."
            </p>
            <div style={{ marginTop: 16, fontSize: 12, color: '#64748b' }}>
              - System Admin (PS2 Module)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NGODashboard;
