import { useState, useEffect } from 'react';
import { ShieldCheck, Truck, Users, MessageSquare, AlertCircle, Map as MapIcon, ChevronRight, Trash2, X, Archive, LayoutDashboard } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';

function NGODashboard() {
  const [allCases, setAllCases] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [filter, setFilter] = useState('active'); // 'active', 'removed'
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    // Listen for all cases
    const qCases = query(
      collection(db, 'cases'),
      orderBy('metadata.created_at', 'desc')
    );
    
    const unsubCases = onSnapshot(qCases, (snapshot) => {
      const fetchedCases = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.case_id !== 'connection-test') {
          fetchedCases.push(data);
        }
      });
      setAllCases(fetchedCases);
    });

    // Listen for volunteers
    const unsubVols = onSnapshot(collection(db, 'volunteers'), (snapshot) => {
      const fetchedVols = [];
      snapshot.forEach(doc => fetchedVols.push(doc.data()));
      setVolunteers(fetchedVols);
    });

    return () => {
      unsubCases();
      unsubVols();
    };
  }, []);

  const handleStatusUpdate = async (caseId, newStatus) => {
    const action = newStatus === 'removed' ? 'remove' : 'restore';
    if (!window.confirm(`Are you sure you want to ${action} this case?`)) return;
    
    try {
      const docRef = doc(db, 'cases', caseId);
      await updateDoc(docRef, { status: newStatus });
    } catch (err) {
      console.error("Error updating case:", err);
      alert(`Failed to ${action} case: ` + err.message);
    }
  };

  const handleVerify = async (caseId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/verify/${caseId}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Verification failed');
      const data = await response.json();
      console.log("Verification result:", data);
      alert(`Case ${caseId} verified successfully!`);
    } catch (err) {
      console.error("Verification error:", err);
      alert("Verification failed: " + err.message);
    }
  };

  const filteredQueue = allCases.filter(item => {
    if (filter === 'removed') return item.status === 'removed';
    return item.status !== 'removed';
  });

  const activeCount = allCases.filter(c => c.status !== 'removed').length;
  const removedCount = allCases.filter(c => c.status === 'removed').length;
  const verifiedCount = allCases.filter(c => c.status === 'verified').length;
  const activeVols = volunteers.filter(v => v.status === 'active').length;

  const coordinatorStats = [
    { label: 'Active Cases', value: activeCount.toString(), detail: 'Total in system', icon: <ShieldCheck size={20} />, color: 'var(--warning-orange)' },
    { label: 'Verified Cases', value: verifiedCount.toString(), detail: 'Ready for action', icon: <Truck size={20} />, color: 'var(--primary-blue)' },
    { label: 'Personnel', value: activeVols.toString(), detail: 'Active Volunteers', icon: <Users size={20} />, color: 'var(--success-green)' },
    { label: 'Archived', value: removedCount.toString(), detail: 'Soft-deleted cases', icon: <Archive size={20} />, color: 'var(--text-muted)' },
  ];

  return (
    <div className="ngo-dashboard">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">NGO Coordinator Dashboard</h1>
          <p className="page-subtitle">Centralized oversight for crisis verification and resource deployment.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            className={`btn ${!showMap ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => setShowMap(false)}
          >
            <LayoutDashboard size={16} /> Dashboard
          </button>
          <button 
            className={`btn ${showMap ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => setShowMap(true)}
          >
            <MapIcon size={16} /> Map View
          </button>
        </div>
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

      {showMap ? (
        <div className="card" style={{ marginBottom: 32, animation: 'fadeIn 0.3s ease-in' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontWeight: 600 }}>Crisis Intelligence Map</h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Live ESRI/ArcGIS Integration</span>
          </div>
          <div style={{ 
            height: 500, background: '#f3f4f6', borderRadius: 8, border: '1px solid var(--border-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-muted)'
          }}>
            <MapIcon size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
            <p>Live Crisis Map View</p>
            <p style={{ fontSize: 12 }}>Showing live case clusters and resource locations</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 8, padding: 4 }}>
                <button 
                  onClick={() => setFilter('active')}
                  style={{ 
                    padding: '6px 12px', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600,
                    background: filter === 'active' ? 'white' : 'transparent', 
                    boxShadow: filter === 'active' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  Active Queue ({activeCount})
                </button>
                <button 
                  onClick={() => setFilter('removed')}
                  style={{ 
                    padding: '6px 12px', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600,
                    background: filter === 'removed' ? 'white' : 'transparent', 
                    boxShadow: filter === 'removed' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  Archived ({removedCount})
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {filter === 'removed' && removedCount > 0 && (
                <button 
                  className="btn btn-outline" 
                  onClick={async () => {
                    if (window.confirm(`Are you sure you want to PERMANENTLY delete all ${removedCount} archived cases? This action cannot be undone.`)) {
                      try {
                        const { writeBatch, query, collection, where, getDocs } = await import('firebase/firestore');
                        const batch = writeBatch(db);
                        const q = query(collection(db, 'cases'), where('status', '==', 'removed'));
                        const snapshot = await getDocs(q);
                        snapshot.forEach((doc) => batch.delete(doc.ref));
                        await batch.commit();
                        alert('Archived cases cleared successfully.');
                      } catch (err) {
                        console.error("Error clearing archive:", err);
                        alert('Failed to clear archive: ' + err.message);
                      }
                    }
                  }}
                  style={{ fontSize: 12, borderColor: 'var(--danger-red)', color: 'var(--danger-red)' }}
                >
                  <Trash2 size={14} /> Clear All Archived
                </button>
              )}
              <button className="btn btn-primary" style={{ fontSize: 12 }}>Batch Process</button>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Status</th>
                <th>Location</th>
                <th>Need Detail</th>
                <th>Trust & Safety</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueue.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No cases found in this view.</td></tr>
              ) : filteredQueue.map((item, i) => (
                <tr 
                  key={i} 
                  onClick={() => setSelectedCase(item)}
                  style={{ 
                    background: item.status === 'pending_validation' ? '#fffbeb' : 'white',
                    cursor: 'pointer'
                  }}
                >
                  <td style={{ fontWeight: 600 }}>{item.case_id}</td>
                  <td>
                    <span style={{ 
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, 
                      background: item.status === 'removed' ? '#fee2e2' : item.status === 'verified' ? '#dcfce7' : '#e0e7ff',
                      color: item.status === 'removed' ? '#dc2626' : item.status === 'verified' ? '#16a34a' : 'var(--primary-blue)',
                      textTransform: 'uppercase'
                    }}>
                      {item.status || 'Active'}
                    </span>
                  </td>
                  <td>{item.structured_data?.location?.raw || 'Unknown'}</td>
                  <td>
                    <div style={{ fontSize: 13 }}>{item.structured_data?.need?.primary_need || 'General Request'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.structured_data?.need?.specifics || item.raw_input?.substring(0, 30) + '...'}</div>
                  </td>
                  <td>
                    {item.verification ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: item.verification.trust_score > 0.7 ? '#16a34a' : item.verification.trust_score > 0.4 ? 'var(--warning-orange)' : '#dc2626' }}>
                            {Math.round(item.verification.trust_score * 100)}% Trust
                          </span>
                          {item.verification.is_duplicate && (
                            <span style={{ fontSize: 9, background: '#fef3c7', color: '#92400e', padding: '1px 4px', borderRadius: 2, fontWeight: 600 }}>DUPLICATE</span>
                          )}
                          {item.verification.suspicion_flag && (
                            <AlertCircle size={12} color="#dc2626" title="Suspicious Pattern Detected" />
                          )}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.verification.explanation}>
                          {item.verification.explanation}
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>Pending Verification...</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: (item.priority_score || 0) > 80 ? 'var(--danger-red)' : 'var(--warning-orange)' }}>
                        {item.priority_score || 0}
                      </span>
                      <div style={{ flex: 1, height: 4, background: '#f3f4f6', borderRadius: 2, minWidth: 40 }}>
                        <div style={{ width: `${item.priority_score || 0}%`, height: '100%', background: (item.priority_score || 0) > 80 ? 'var(--danger-red)' : 'var(--warning-orange)', borderRadius: 2 }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {item.status === 'removed' ? (
                        <button 
                          className="btn btn-outline" 
                          onClick={() => handleStatusUpdate(item.case_id, 'ready_for_verification')}
                          style={{ padding: '4px 12px', fontSize: 11 }}
                        >
                          Restore
                        </button>
                      ) : (
                        <>
                          <button 
                            className="btn btn-outline" 
                            style={{ 
                              padding: '4px 12px', fontSize: 11, 
                              background: item.status === 'verified' ? '#f0fdf4' : 'transparent',
                              borderColor: item.status === 'verified' ? '#16a34a' : 'var(--border-color)',
                              color: item.status === 'verified' ? '#16a34a' : 'inherit'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVerify(item.case_id);
                            }}
                            disabled={item.status === 'verified'}
                          >
                            {item.status === 'verified' ? 'Verified' : 'Verify'}
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(item.case_id, 'removed')}
                            style={{ 
                              padding: 8, borderRadius: 6, border: 'none', background: 'rgba(239, 68, 68, 0.1)', 
                              color: 'var(--danger-red)', cursor: 'pointer', display: 'flex', alignItems: 'center' 
                            }}
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Case Details Sidebar */}
      {selectedCase && (
        <div className="modal-overlay" onClick={() => setSelectedCase(null)}>
          <div className="modal-content animate-slide-in" style={{ 
            position: 'fixed', right: 0, top: 0, bottom: 0, width: 500, margin: 0, borderRadius: 0,
            overflowY: 'auto', padding: 32, boxShadow: '-10px 0 30px rgba(0,0,0,0.1)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 700 }}>Case Details</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>ID: {selectedCase.case_id}</p>
              </div>
              <X size={24} onClick={() => setSelectedCase(null)} style={{ cursor: 'pointer' }} />
            </div>

            <div style={{ display: 'grid', gap: 32 }}>
              <section>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status & Timeline</label>
                <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
                   <span style={{ 
                      fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99,
                      background: selectedCase.status === 'verified' ? '#dcfce7' : '#e0e7ff',
                      color: selectedCase.status === 'verified' ? '#16a34a' : 'var(--primary-blue)'
                   }}>
                     {selectedCase.status.toUpperCase()}
                   </span>
                   <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Created: {new Date(selectedCase.metadata?.created_at).toLocaleString()}</span>
                </div>
              </section>

              <section>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>AI Analysis</label>
                <div className="card" style={{ marginTop: 12, background: '#f8fafc' }}>
                  <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>{selectedCase.ai_summary}</p>
                </div>
              </section>

              <section>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Structured Data</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
                  <div className="card" style={{ padding: 16 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700 }}>LOCATION</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{selectedCase.structured_data?.location?.city || 'Unknown City'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{selectedCase.structured_data?.location?.raw}</div>
                  </div>
                  <div className="card" style={{ padding: 16 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700 }}>PRIMARY NEED</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{selectedCase.structured_data?.need?.primary_need}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{selectedCase.structured_data?.need?.specifics}</div>
                  </div>
                </div>
              </section>

              <section>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verification & Trust</label>
                {selectedCase.verification ? (
                  <div className="card" style={{ marginTop: 12, borderLeft: `4px solid ${selectedCase.verification.trust_score > 0.7 ? '#16a34a' : 'var(--warning-orange)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontWeight: 700 }}>{Math.round(selectedCase.verification.trust_score * 100)}% Trust Score</span>
                      {selectedCase.verification.suspicion_flag && <span style={{ color: 'var(--danger-red)', fontSize: 11, fontWeight: 700 }}>SUSPICIOUS</span>}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selectedCase.verification.explanation}</p>
                    {selectedCase.verification.is_duplicate && (
                      <div style={{ marginTop: 12, padding: 8, background: '#fffbeb', borderRadius: 6, fontSize: 11, border: '1px solid #fde68a' }}>
                        Potential Duplicate of: {selectedCase.verification.duplicate_case_ids?.join(', ')}
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{ marginTop: 12, fontStyle: 'italic', color: 'var(--text-muted)' }}>Verification in progress...</p>
                )}
              </section>

              <section>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Raw Input</label>
                <pre style={{ 
                  marginTop: 12, background: '#f1f5f9', padding: 16, borderRadius: 8, fontSize: 12, 
                  whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: '#475569'
                }}>
                  {selectedCase.raw_input}
                </pre>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NGODashboard;
