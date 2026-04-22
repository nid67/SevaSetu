import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Cloud, Users, ShieldCheck, ArrowRight } from 'lucide-react';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const handleLogin = (role) => {
    setLoading(role);
    setTimeout(() => {
      login(role);
      navigate(role === 'volunteer' ? '/dashboard' : '/ngo');
    }, 800);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #f9fbfd 0%, #e0e7ff 100%)',
      padding: 20
    }}>
      <div style={{ maxWidth: 900, width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
        
        {/* Left Side: Branding */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <div style={{ background: '#111', padding: 12, borderRadius: 12, color: 'white' }}>
              <Cloud size={32} />
            </div>
            <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px' }}>SevaSetu</h1>
          </div>
          <h2 style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.1, marginBottom: 24, color: '#1e293b' }}>
            Intelligent Crisis <br/> <span style={{ color: 'var(--primary-blue)' }}>Response Platform.</span>
          </h2>
          <p style={{ fontSize: 18, color: '#64748b', lineHeight: 1.6 }}>
            Empowering volunteers and NGOs with AI-driven intelligence to save lives during disasters.
          </p>
        </div>

        {/* Right Side: Role Selection */}
        <div className="card" style={{ padding: 40, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Welcome Back</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Please select your portal to continue.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* Volunteer Option */}
            <div 
              onClick={() => handleLogin('volunteer')}
              style={{ 
                padding: 24, border: '2px solid var(--border-color)', borderRadius: 12, cursor: 'pointer',
                transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: 20,
                background: loading === 'volunteer' ? '#f0f5ff' : 'white',
                borderColor: loading === 'volunteer' ? 'var(--primary-blue)' : 'var(--border-color)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-blue)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = loading === 'volunteer' ? 'var(--primary-blue)' : 'var(--border-color)'}
            >
              <div style={{ background: '#e0e7ff', color: 'var(--primary-blue)', padding: 12, borderRadius: 10 }}>
                <Users size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Volunteer Portal</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Field data ingestion & status tracking</div>
              </div>
              <ArrowRight size={20} color="var(--text-muted)" />
            </div>

            {/* NGO Option */}
            <div 
              onClick={() => handleLogin('ngo')}
              style={{ 
                padding: 24, border: '2px solid var(--border-color)', borderRadius: 12, cursor: 'pointer',
                transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: 20,
                background: loading === 'ngo' ? '#f0f5ff' : 'white',
                borderColor: loading === 'ngo' ? 'var(--primary-blue)' : 'var(--border-color)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-blue)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = loading === 'ngo' ? 'var(--primary-blue)' : 'var(--border-color)'}
            >
              <div style={{ background: '#fef3c7', color: 'var(--warning-orange)', padding: 12, borderRadius: 10 }}>
                <ShieldCheck size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>NGO Coordinator</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Crisis oversight & resource management</div>
              </div>
              <ArrowRight size={20} color="var(--text-muted)" />
            </div>

          </div>

          <div style={{ marginTop: 40, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
            SevaSetu v1.0.0 • Secure Hackathon Build
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
