import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Cloud, ArrowRight, Lock, Mail } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('volunteer'); // 'volunteer' or 'ngo'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (role === 'ngo') {
        if (email === 'admin@sevasetu.org' && password === 'admin123') {
          login('ngo', { name: 'NGO Admin', email: 'admin@sevasetu.org' });
          navigate('/ngo');
        } else {
          setError('Invalid NGO credentials');
        }
      } else {
        const q = query(
          collection(db, 'volunteers'),
          where('email', '==', email),
          where('phone', '==', password)
        );
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const userData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
          login('volunteer', userData);
          navigate('/dashboard');
        } else {
          setError('Invalid Volunteer ID or Password (Mobile No)');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
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
        
        <div className="animate-fade-in">
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

        <div className="card animate-fade-in" style={{ padding: 40, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 8, padding: 4, marginBottom: 32 }}>
            <button 
              onClick={() => setRole('volunteer')}
              className={role === 'volunteer' ? 'btn-toggle-active' : 'btn-toggle'}
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: role === 'volunteer' ? 'white' : 'transparent', boxShadow: role === 'volunteer' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}
            >
              Volunteer
            </button>
            <button 
              onClick={() => setRole('ngo')}
              className={role === 'ngo' ? 'btn-toggle-active' : 'btn-toggle'}
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: role === 'ngo' ? 'white' : 'transparent', boxShadow: role === 'ngo' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}
            >
              NGO Admin
            </button>
          </div>

          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{role === 'volunteer' ? 'Volunteer Login' : 'NGO Portal'}</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 14 }}>
            {role === 'volunteer' ? 'Use your registered email and mobile number.' : 'Enter your coordinator credentials.'}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} size={18} />
              <input 
                type="email" required placeholder="Email Address" 
                className="search-bar" style={{ width: '100%', paddingLeft: 42, background: 'white', border: '1px solid var(--border-color)' }}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} size={18} />
              <input 
                type="password" required placeholder={role === 'volunteer' ? 'Mobile Number (Password)' : 'Password'}
                className="search-bar" style={{ width: '100%', paddingLeft: 42, background: 'white', border: '1px solid var(--border-color)' }}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <div style={{ color: 'var(--danger-red)', fontSize: 13, fontWeight: 600 }}>{error}</div>}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              {loading ? 'Authenticating...' : 'Sign In to Portal'} <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: 40, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
            SevaSetu v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
