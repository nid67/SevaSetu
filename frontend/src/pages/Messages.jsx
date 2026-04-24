import { useState, useEffect } from 'react';
import { Mail, Send, User, Bell, Megaphone, Trash2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

function Messages() {
  const { user, role } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    // Fetch messages for this volunteer OR broadcast messages
    const q = query(
      collection(db, 'messages'),
      where('to', 'in', [user.id || 'admin', 'all']),
      orderBy('timestamp', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [user]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await addDoc(collection(db, 'messages'), {
      to: 'admin',
      from: user.name,
      fromId: user.id || 'admin',
      text: newMessage,
      type: 'direct',
      timestamp: serverTimestamp()
    });
    setNewMessage('');
  };

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header" style={{ marginBottom: 20 }}>
        <h1 className="page-title">Message Box</h1>
        <p className="page-subtitle">Direct communication with NGO HQ and system notifications.</p>
      </div>

      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: 40, color: 'var(--text-muted)' }}>
              <Mail size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
              <p>No messages yet.</p>
            </div>
          )}
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              style={{ 
                alignSelf: msg.fromId === user.id ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                background: msg.type === 'broadcast' ? '#fffbeb' : (msg.fromId === user.id ? 'var(--primary-blue)' : '#f3f4f6'),
                color: msg.fromId === user.id ? 'white' : 'inherit',
                padding: '12px 16px',
                borderRadius: 12,
                border: msg.type === 'broadcast' ? '1px solid #f59e0b' : 'none',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: 11, fontWeight: 700, opacity: 0.8 }}>
                {msg.type === 'broadcast' ? <Megaphone size={12} /> : <User size={12} />}
                {msg.from.toUpperCase()}
                {msg.type === 'broadcast' && ' • BROADCAST'}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>{msg.text}</div>
              <div style={{ fontSize: 10, marginTop: 4, textAlign: 'right', opacity: 0.6 }}>
                {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              {role === 'ngo' && (
                <Trash2 
                  size={14} 
                  style={{ position: 'absolute', top: -8, right: -8, cursor: 'pointer', background: 'white', color: 'var(--danger-red)', borderRadius: '50%', padding: 4, border: '1px solid var(--border-color)' }}
                  onClick={() => deleteDoc(doc(db, 'messages', msg.id))}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} style={{ padding: 20, borderTop: '1px solid var(--border-color)', display: 'flex', gap: 12 }}>
          <input 
            className="search-bar" 
            style={{ flex: 1, background: '#f9fafb', border: '1px solid var(--border-color)' }}
            placeholder="Type your message to HQ..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Messages;
