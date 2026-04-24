import { Activity, Clock, AlertCircle, BarChart3, ChevronDown, Bell, User as UserIcon, Plus, X as XIcon, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';

function AddVolunteerModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: 'General Support',
    sector: 'Sector 4',
    address: '',
    experience: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'volunteers'), {
        ...formData,
        status: 'active',
        created_at: serverTimestamp()
      });
      alert('Volunteer added successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to add volunteer');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontWeight: 700 }}>Register New Volunteer</h2>
          <XIcon size={24} onClick={onClose} style={{ cursor: 'pointer' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>FULL NAME</label>
              <input 
                required
                className="search-bar" style={{ width: '100%', background: 'white', border: '1px solid var(--border-color)' }}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>SPECIALTY</label>
              <select 
                className="search-bar" style={{ width: '100%', background: 'white', border: '1px solid var(--border-color)', padding: '8px 16px' }}
                onChange={e => setFormData({...formData, specialty: e.target.value})}
              >
                <option>General Support</option>
                <option>Medical</option>
                <option>Rescue</option>
                <option>Logistics</option>
                <option>Communication</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>EMAIL</label>
              <input 
                required type="email"
                className="search-bar" style={{ width: '100%', background: 'white', border: '1px solid var(--border-color)' }}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>PHONE</label>
              <input 
                required
                className="search-bar" style={{ width: '100%', background: 'white', border: '1px solid var(--border-color)' }}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>RESIDENTIAL ADDRESS</label>
            <textarea 
              rows="2"
              className="search-bar" style={{ width: '100%', background: 'white', border: '1px solid var(--border-color)', height: 'auto', padding: '12px' }}
              onChange={e => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>SKILLS & ADDITIONAL NOTES</label>
            <textarea 
              rows="2"
              placeholder="e.g. Speaks multiple languages, certified first-aider, etc."
              className="search-bar" style={{ width: '100%', background: 'white', border: '1px solid var(--border-color)', height: 'auto', padding: '12px' }}
              onChange={e => setFormData({...formData, experience: e.target.value})}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary"><Plus size={18} /> Register Volunteer</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Volunteers() {
  const [vols, setVols] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'volunteers'), (snapshot) => {
      const fetchedVols = [];
      snapshot.forEach(doc => fetchedVols.push(doc.data()));
      setVols(fetchedVols);
    });
    return () => unsub();
  }, []);

  const activeVols = vols.filter(v => v.status === 'active').length;
  const leaveVols = vols.filter(v => v.status === 'on_leave').length;

  const stats = [
    { label: 'Active Field Personnel', value: activeVols.toString(), change: '+12%', type: 'up' },
    { label: 'On Leave', value: leaveVols.toString(), change: 'Resting', type: 'text' },
    { label: 'Avg Shift Duration', value: '9.4h', change: '+1.2h', type: 'up' },
    { label: 'Critical Burnout Risk', value: '0', change: 'Volunteers', active: true, type: 'text' },
  ];

  return (
    <div className="animate-fade-in">
      <AddVolunteerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Volunteer Health & Wellness Panel</h1>
          <p className="page-subtitle">Real-time monitoring of active field personnel workload and burnout risk factors.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add New Volunteer
          </button>
          <div style={{ background: '#e0e7ff', color: 'var(--primary-blue)', padding: '6px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, background: 'var(--primary-blue)', borderRadius: '50%' }} /> Live Sync
          </div>
        </div>
      </div>

      <div style={{ background: '#f0f5ff', border: '1px solid #dbeafe', borderRadius: 12, padding: 24, marginBottom: 32, display: 'flex', gap: 16 }}>
        <div style={{ width: 40, height: 40, background: 'white', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <Activity color="var(--primary-blue)" />
        </div>
        <div>
          <h4 style={{ fontSize: 16, fontWeight: 600, color: '#1e40af', marginBottom: 8 }}>System Intelligence Insight</h4>
          <p style={{ fontSize: 14, color: '#3b82f6', lineHeight: 1.5, marginBottom: 16 }}>
            Pattern analysis indicates a 24% spike in continuous operational hours for Sector B teams. Recommend rotating 12 personnel immediately to prevent critical exhaustion thresholds.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-outline" style={{ background: 'white', borderColor: '#bfdbfe', color: 'var(--primary-blue)' }}>View Recommended Roster</button>
            <button className="btn" style={{ color: '#60a5fa', background: 'transparent' }}>Dismiss</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{stat.label}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16 }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: stat.active ? 'var(--danger-red)' : 'var(--text-primary)' }}>{stat.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: stat.type === 'up' ? 'var(--primary-blue)' : 'var(--danger-red)' }}>{stat.type === 'up' && '↑'} {stat.change}</div>
            </div>
          </div>
        ))}
        
        {/* Task Distribution Mock Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Task Distribution</div>
            <div style={{ color: 'var(--text-muted)' }}>...</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 60, marginTop: 16 }}>
            <div style={{ flex: 1, background: '#dbeafe', height: '30%', borderRadius: '4px 4px 0 0' }} />
            <div style={{ flex: 1, background: 'var(--primary-blue)', height: '100%', borderRadius: '4px 4px 0 0' }} />
            <div style={{ flex: 1, background: '#c7d2fe', height: '60%', borderRadius: '4px 4px 0 0' }} />
            <div style={{ flex: 1, background: '#e2e8f0', height: '20%', borderRadius: '4px 4px 0 0' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500 }}>
            <span>Medical</span>
            <span>Logistics</span>
            <span>Comms</span>
            <span>Support</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontWeight: 600 }}>Personnel Watchlist</h3>
        <button className="btn btn-outline" style={{ background: 'white', fontSize: 12 }}>Sort by Risk: High to Low <ChevronDown size={14} style={{ marginLeft: 4 }} /></button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 32 }}>
        {vols.map((vol, i) => (
          <div key={i} className="card" style={{ borderTop: `4px solid ${vol.status === 'active' ? 'var(--success-green)' : 'var(--warning-orange)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserIcon size={20} color="var(--text-secondary)" />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{vol.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{vol.specialty} • {vol.sector}</div>
                </div>
              </div>
              <span style={{ 
                fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 4,
                background: vol.status === 'active' ? 'var(--success-green-bg)' : 'var(--warning-orange-bg)',
                color: vol.status === 'active' ? 'var(--success-green)' : 'var(--warning-orange)'
              }}>
                {vol.status.toUpperCase()}
              </span>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
                <span>Current Shift Workload</span>
                <span>{vol.status === 'active' ? '45%' : '0%'}</span>
              </div>
              <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3 }}>
                <div style={{ width: vol.status === 'active' ? '45%' : '0%', height: '100%', background: 'var(--primary-blue)', borderRadius: 3 }} />
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 24 }}>
              <Clock size={14} /> Active Time
              <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{vol.status === 'active' ? '4h 12m' : 'N/A'}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>STATUS</div>
                <select 
                  defaultValue={vol.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    await updateDoc(doc(db, 'volunteers', vol.id), { status: newStatus });
                    await addDoc(collection(db, 'messages'), {
                      to: vol.id,
                      from: 'NGO Admin',
                      text: `Your status has been updated to ${newStatus}.`,
                      type: 'notification',
                      timestamp: serverTimestamp()
                    });
                  }}
                  style={{ width: '100%', padding: '6px', fontSize: 12, borderRadius: 6, border: '1px solid var(--border-color)' }}
                >
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>ASSIGN TASK</div>
                <button 
                  className="btn btn-outline" 
                  style={{ width: '100%', padding: '6px', fontSize: 11 }}
                  onClick={() => {
                    const task = prompt('Enter task details or Case ID to assign:');
                    if (task) {
                      addDoc(collection(db, 'messages'), {
                        to: vol.id,
                        from: 'NGO Admin',
                        text: `NEW ASSIGNMENT: ${task}`,
                        type: 'task',
                        timestamp: serverTimestamp()
                      });
                      alert('Task assigned via message box!');
                    }
                  }}
                >
                  Assign Task
                </button>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '8px', fontSize: 12 }}
                onClick={() => {
                  const msg = prompt(`Message ${vol.name}:`);
                  if (msg) {
                    addDoc(collection(db, 'messages'), {
                      to: vol.id,
                      from: 'NGO Admin',
                      text: msg,
                      type: 'direct',
                      timestamp: serverTimestamp()
                    });
                    alert('Message sent!');
                  }
                }}
              >
                Send Message
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Bell size={20} color="var(--text-secondary)" />
            <h3 style={{ fontWeight: 600 }}>Recommended Break Queue</h3>
          </div>
          <span style={{ background: '#f3f4f6', padding: '4px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>4 Pending</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 8, height: 8, background: 'var(--danger-red)', borderRadius: '50%' }} />
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Team Alpha - Sector 1</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Continuous operation &gt; 6 hours. High heat index warning.</div>
              </div>
            </div>
            <button className="btn btn-outline" style={{ fontSize: 12 }}>Dispatch Relief</button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 8, height: 8, background: 'var(--warning-orange)', borderRadius: '50%' }} />
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Medical Unit B</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Approaching standard shift limit. Prepare handover.</div>
              </div>
            </div>
            <button className="btn btn-outline" style={{ fontSize: 12 }}>Schedule Handover</button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Volunteers;
