import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const SystemContext = createContext();

export function SystemProvider({ children }) {
  const [activeAlert, setActiveAlert] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Listen for the most recent emergency alert
    const q = query(
      collection(db, 'alerts'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const alert = snapshot.docs[0].data();
        // Only show if it's recent (e.g., last 1 hour) or mark it active
        const oneHourAgo = Date.now() - 3600000;
        if (alert.timestamp?.toMillis() > oneHourAgo) {
          setActiveAlert({ id: snapshot.docs[0].id, ...alert });
        } else {
          setActiveAlert(null);
        }
      }
    });

    return () => unsub();
  }, []);

  const triggerEmergency = async (sender, message) => {
    try {
      await addDoc(collection(db, 'alerts'), {
        sender,
        message,
        type: 'emergency',
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to trigger emergency:", err);
    }
  };

  const dismissAlert = () => setActiveAlert(null);

  return (
    <SystemContext.Provider value={{ activeAlert, triggerEmergency, dismissAlert, notifications }}>
      {children}
    </SystemContext.Provider>
  );
}

export const useSystem = () => useContext(SystemContext);
