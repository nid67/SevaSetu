import { Activity, Clock, AlertCircle, BarChart3, ChevronDown, Bell } from 'lucide-react';

function Volunteers() {
  const stats = [
    { label: 'Active Field Personnel', value: '142', change: '+12%', icon: null, active: false, type: 'up' },
    { label: 'Avg Shift Duration', value: '9.4h', change: '+1.2h', icon: null, active: false, type: 'up' },
    { label: 'Critical Burnout Risk', value: '8', change: 'Volunteers', icon: null, active: true, type: 'text' },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Volunteer Health & Wellness Panel</h1>
          <p className="page-subtitle">Real-time monitoring of active field personnel workload and burnout risk factors.</p>
        </div>
        <div style={{ background: '#e0e7ff', color: 'var(--primary-blue)', padding: '6px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, background: 'var(--primary-blue)', borderRadius: '50%' }} /> Live Sync
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
        {/* High Risk Card */}
        <div className="card" style={{ borderTop: '4px solid var(--danger-red)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fee2e2', overflow: 'hidden' }}>
                <img src="https://i.pravatar.cc/150?u=sarah" alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>Sarah Jenkins</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Medic Lead • Sector 4</div>
              </div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, background: 'var(--danger-red-bg)', color: 'var(--danger-red)', padding: '4px 8px', borderRadius: 4 }}>HIGH RISK</span>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
              <span>Current Shift Workload</span>
              <span>94%</span>
            </div>
            <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3 }}>
              <div style={{ width: '94%', height: '100%', background: 'var(--danger-red)', borderRadius: 3 }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 24 }}>
            <Clock size={14} /> Active Time
            <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--danger-red)' }}>14h 20m</span>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Message</button>
            <button className="btn" style={{ flex: 1, justifyContent: 'center', background: 'var(--danger-red-bg)', color: 'var(--danger-red)' }}>Mandate Break</button>
          </div>
        </div>

        {/* Medium Risk Card */}
        <div className="card" style={{ borderTop: '4px solid var(--warning-orange)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fef3c7', overflow: 'hidden' }}>
                <img src="https://i.pravatar.cc/150?u=david" alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>David Chen</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Logistics • Sector 2</div>
              </div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, background: 'var(--warning-orange-bg)', color: 'var(--warning-orange)', padding: '4px 8px', borderRadius: 4 }}>MED RISK</span>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
              <span>Current Shift Workload</span>
              <span>78%</span>
            </div>
            <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3 }}>
              <div style={{ width: '78%', height: '100%', background: 'var(--warning-orange)', borderRadius: 3 }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 24 }}>
            <Clock size={14} /> Active Time
            <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--warning-orange)' }}>9h 45m</span>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Message</button>
            <button className="btn" style={{ flex: 1, justifyContent: 'center', background: 'white', border: '1px solid var(--warning-orange)', color: 'var(--warning-orange)' }}>Suggest Break</button>
          </div>
        </div>

        {/* Low Risk Card */}
        <div className="card" style={{ borderTop: '4px solid var(--success-green)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#d1fae5', overflow: 'hidden' }}>
                <img src="https://i.pravatar.cc/150?u=elena" alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>Elena Rodriguez</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Comms • HQ</div>
              </div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, background: 'var(--success-green-bg)', color: 'var(--success-green)', padding: '4px 8px', borderRadius: 4 }}>LOW RISK</span>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
              <span>Current Shift Workload</span>
              <span>42%</span>
            </div>
            <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3 }}>
              <div style={{ width: '42%', height: '100%', background: 'var(--success-green)', borderRadius: 3 }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 24 }}>
            <Clock size={14} /> Active Time
            <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--text-primary)' }}>3h 15m</span>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>View Profile</button>
          </div>
        </div>
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
