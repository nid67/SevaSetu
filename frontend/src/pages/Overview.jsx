import { useState, useEffect } from 'react';
import { Folder, AlertTriangle, Clock, CheckCircle2, Filter, MapPin } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

function Overview() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    // Listen for real-time updates from Firestore
    const q = query(collection(db, 'cases'), orderBy('metadata.created_at', 'desc'));
    
    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedCases = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const allowedStatuses = ['verified', 'assigned', 'completed'];
        if (allowedStatuses.includes(data.status)) {
          fetchedCases.push(data);
        }
      });
      setCases(fetchedCases);
    }, (err) => {
      console.error("Error fetching cases from Firestore:", err);
    });

    return () => unsub();
  }, []);

  // Compute real-time stats
  const totalCases = cases.length;
  const urgentCases = cases.filter(c => c.context?.urgency_assessment === 'High').length;
  const pendingCases = cases.filter(c => c.status === 'pending_validation').length;
  const resolvedCases = cases.filter(c => c.status === 'closed' || c.status === 'resolved').length;

  const stats = [
    { label: 'Total Cases', value: totalCases.toString(), change: 'Live Data', icon: <Folder size={20} />, active: false },
    { label: 'Urgent', value: urgentCases.toString(), change: 'Requires immediate action', icon: <AlertTriangle size={20} />, active: true },
    { label: 'Pending Review', value: pendingCases.toString(), change: 'Awaiting Validation', icon: <Clock size={20} />, active: false },
    { label: 'Resolved', value: resolvedCases.toString(), change: 'Completed cases', icon: <CheckCircle2 size={20} />, active: false },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Overview</h1>
        <p className="page-subtitle">Active intelligence and operational status across all zones.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ 
            borderColor: stat.active ? 'var(--danger-red)' : 'var(--border-color)',
            position: 'relative', overflow: 'hidden'
          }}>
            {stat.active && <div style={{ position: 'absolute', right: -20, top: -20, width: 64, height: 64, background: 'var(--danger-red-bg)', borderRadius: '50%' }} />}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: stat.active ? 'var(--danger-red)' : 'var(--text-secondary)' }}>{stat.label}</span>
              <div style={{ color: stat.active ? 'var(--danger-red)' : 'var(--text-muted)' }}>{stat.icon}</div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: stat.active ? 'var(--danger-red)' : 'var(--text-primary)', marginBottom: 8 }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: stat.active ? 'var(--danger-red)' : 'var(--text-secondary)' }}>{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h3 style={{ fontWeight: 600 }}>Active Cases</h3>
            <span style={{ background: '#f3f4f6', padding: '4px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600 }}>{totalCases}</span>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 8, padding: 4 }}>
              {['All', 'Urgent', 'High', 'Routine'].map(f => (
                <button key={f} style={{
                  padding: '6px 12px', border: 'none', borderRadius: 6, background: f === 'All' ? 'white' : 'transparent',
                  boxShadow: f === 'All' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                  fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6
                }}>
                  {f !== 'All' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: f === 'Urgent' ? 'var(--danger-red)' : f === 'High' ? 'var(--warning-orange)' : 'var(--success-green)' }} />}
                  {f}
                </button>
              ))}
            </div>
            <button className="btn btn-outline" style={{ fontSize: 12 }}><Filter size={14} /> Filter</button>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Location</th>
              <th>Primary Need</th>
              <th>Urgency</th>
              <th>Priority Score</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cases.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No cases reported yet.</td></tr>
            ) : cases.map((c, i) => {
              const priority = c.context?.urgency_assessment || 'Low';
              const badgeClass = priority === 'High' ? 'badge-critical' : priority === 'Medium' ? 'badge-high' : 'badge-routine';
              
              const handleAction = async (newStatus) => {
                try {
                  const docRef = doc(db, 'cases', c.case_id);
                  const updateData = { 
                    status: newStatus,
                    'metadata.updated_at': new Date().toISOString()
                  };
                  if (newStatus === 'assigned') {
                    updateData.assigned_at = new Date().toISOString();
                  } else if (newStatus === 'completed') {
                    updateData.completed_at = new Date().toISOString();
                  }
                  await updateDoc(docRef, updateData);
                } catch (err) {
                  console.error("Error updating task:", err);
                  alert("Failed to update task status");
                }
              };

              return (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{c.case_id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MapPin size={14} color="var(--text-muted)" /> {c.structured_data?.location?.raw || 'Unknown'}
                    </div>
                  </td>
                  <td>{c.structured_data?.need?.primary_need || 'Uncategorized'}</td>
                  <td>
                    <span className={`badge ${badgeClass}`}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} /> {priority}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: '#f3f4f6', borderRadius: 2 }}>
                        <div style={{ width: `${c.priority_score}%`, height: '100%', background: c.priority_score > 80 ? 'var(--danger-red)' : c.priority_score > 50 ? 'var(--warning-orange)' : 'var(--success-green)', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{c.priority_score}/100</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      fontSize: 12, fontWeight: 500, padding: '4px 8px', borderRadius: 4,
                      background: c.status === 'verified' ? '#dcfce7' : c.status === 'assigned' ? '#e0e7ff' : '#f3f4f6',
                      color: c.status === 'verified' ? '#16a34a' : c.status === 'assigned' ? 'var(--primary-blue)' : 'var(--text-primary)'
                    }}>
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    {c.status === 'verified' && (
                      <button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: 11 }} onClick={() => handleAction('assigned')}>Accept Task</button>
                    )}
                    {c.status === 'assigned' && (
                      <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: 11, borderColor: '#16a34a', color: '#16a34a' }} onClick={() => handleAction('completed')}>Complete</button>
                    )}
                    {c.status === 'completed' && (
                      <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>Done</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Overview;
