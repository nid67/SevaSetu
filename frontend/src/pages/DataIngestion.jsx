import { useState, useEffect } from 'react';
import { UploadCloud, Bot, MapPin, BriefcaseMedical, Users, Activity, ArrowRight, Loader2, AlertCircle, FileText, Mic, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

function DataIngestion() {
  const [inputType, setInputType] = useState('text'); // 'text', 'voice', 'image'
  const [rawInput, setRawInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  // States
  const [loading, setLoading] = useState(false);
  const [caseId, setCaseId] = useState(null);
  const [caseData, setCaseData] = useState(null);
  const [error, setError] = useState('');

  // Editable fields for validation
  const [editedLocation, setEditedLocation] = useState('');
  const [editedNeed, setEditedNeed] = useState('');
  const [editedCount, setEditedCount] = useState('');
  const [editedUrgency, setEditedUrgency] = useState('');

  const API_BASE = 'http://localhost:3000/api/v1';

  useEffect(() => {
    if (!caseId) return;

    const unsub = onSnapshot(doc(db, 'cases', caseId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCaseData(data);
        
        setEditedLocation(data.structured_data?.location?.raw || '');
        setEditedNeed(data.structured_data?.need?.primary_need || '');
        setEditedCount(data.structured_data?.people?.est_count || '');
        setEditedUrgency(data.context?.urgency_assessment || 'Medium');
        
        if (data.status) {
          setLoading(false);
        }
      }
    }, (err) => {
      console.error("Firestore error:", err);
      setError("Failed to sync real-time data from Firestore.");
    });

    return () => unsub();
  }, [caseId]);

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1280; // Standard for Gemini processing

          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get base64 at 0.7 quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl.split(',')[1]);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleUpload = async () => {
    if (inputType === 'text' && !rawInput.trim()) {
      setError('Please provide some input data.');
      return;
    }
    
    if (inputType !== 'text' && !selectedFile) {
      setError(`Please select a ${inputType} file to upload.`);
      return;
    }
    
    setLoading(true);
    setError('');
    setCaseId(null);
    setCaseData(null);

    try {
      let content = rawInput;
      let fileData = null;

      if (inputType === 'image') {
        fileData = await compressImage(selectedFile);
        content = `[Uploaded Image: ${selectedFile.name}]`;
      } else if (inputType === 'voice') {
        // For voice, we still use standard base64 for now
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
        });
        reader.readAsDataURL(selectedFile);
        fileData = await base64Promise;
        content = `[Uploaded Audio: ${selectedFile.name}]`;
      }

      const payload = {
        input_type: inputType,
        content: content,
        media_base64: fileData,
        mime_type: inputType === 'image' ? 'image/jpeg' : selectedFile?.type,
        volunteer_id: 'vol_demo_123'
      };

      const response = await axios.post(`${API_BASE}/ingest`, payload);
      setCaseId(response.data.case_id);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleValidate = async () => {
    if (!caseId || !caseData) return;
    try {
      await axios.patch(`${API_BASE}/validate/${caseId}`, {
        structured_data: {
          ...caseData.structured_data,
          location: { ...caseData.structured_data.location, raw: editedLocation },
          need: { ...caseData.structured_data.need, primary_need: editedNeed },
          people: { ...caseData.structured_data.people, est_count: parseInt(editedCount, 10) || 0 }
        },
        context: {
          ...caseData.context,
          urgency_assessment: editedUrgency
        }
      });
      alert(`Case ${caseId} validated and moved to verification queue!`);
      handleDiscard();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleDiscard = () => {
    setCaseId(null);
    setCaseData(null);
    setRawInput('');
    setSelectedFile(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Data Ingestion</h1>
        <p className="page-subtitle">Upload raw field data for automated intelligence extraction.</p>
      </div>

      {error && (
        <div style={{ padding: 16, background: '#fee2e2', color: '#dc2626', borderRadius: 8, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <div className="upload-grid">
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontWeight: 600 }}>Raw Input</h3>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'var(--text-muted)', background: '#f3f4f6', padding: '4px 8px', borderRadius: 4 }}>MULTI-MODAL</span>
          </div>

          <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 8, padding: 4, marginBottom: 24 }}>
            <button onClick={() => setInputType('text')} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: 6, background: inputType === 'text' ? 'white' : 'transparent', fontWeight: 500, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <FileText size={14} /> Text
            </button>
            <button onClick={() => setInputType('voice')} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: 6, background: inputType === 'voice' ? 'white' : 'transparent', fontWeight: 500, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Mic size={14} /> Voice
            </button>
            <button onClick={() => setInputType('image')} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: 6, background: inputType === 'image' ? 'white' : 'transparent', fontWeight: 500, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <ImageIcon size={14} /> Image/Video
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {inputType === 'text' ? (
              <textarea 
                placeholder="Describe the crisis situation in detail..."
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                style={{ flex: 1, minHeight: 250, padding: 16, borderRadius: 12, border: '2px dashed var(--border-color)', resize: 'none', fontSize: 14 }}
              />
            ) : (
              <div style={{ 
                flex: 1, border: '2px dashed var(--border-color)', borderRadius: 12, 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: 250, background: '#fafafa', position: 'relative', overflow: 'hidden'
              }}>
                {selectedFile && inputType === 'image' && selectedFile.type.startsWith('image/') ? (
                  <img 
                    src={URL.createObjectURL(selectedFile)} 
                    alt="Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
                  />
                ) : null}
                <input 
                  type="file" 
                  accept={inputType === 'voice' ? 'audio/*' : 'image/*,video/*'}
                  onChange={handleFileChange}
                  style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
                />
                {!selectedFile && (
                  <>
                    <div style={{ width: 48, height: 48, background: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                      {inputType === 'voice' ? <Mic color="var(--primary-blue)" /> : <ImageIcon color="var(--primary-blue)" />}
                    </div>
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>
                      Click to upload {inputType} report
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {inputType === 'voice' ? 'MP3, WAV or AAC (max. 10MB)' : 'JPG, PNG or MP4 (max. 50MB)'}
                    </p>
                  </>
                )}
                {selectedFile && (
                  <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, background: 'rgba(255,255,255,0.9)', padding: '8px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, zIndex: 5 }}>
                    {inputType === 'voice' ? <Mic size={14} color="var(--primary-blue)" /> : <ImageIcon size={14} color="var(--primary-blue)" />}
                    <span style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedFile.name}</span>
                  </div>
                )}
              </div>
            )}
            
            <button 
              className="btn btn-primary" 
              onClick={handleUpload} 
              disabled={loading || (inputType === 'text' ? !rawInput.trim() : !selectedFile)}
              style={{ justifyContent: 'center', padding: '14px', borderRadius: 10 }}
            >
              {loading && !caseId ? <Loader2 size={16} className="lucide-spin" /> : <UploadCloud size={16} />}
              {loading && !caseId ? 'Uploading to SevaSetu...' : 'Confirm & Process Input'}
            </button>
          </div>
        </div>

        <div className="card" style={{ opacity: (!caseId && !loading) ? 0.5 : 1, pointerEvents: (!caseId && !loading) ? 'none' : 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontWeight: 600 }}>AI Extraction Preview</h3>
            {loading && caseId && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--primary-blue)' }}>
                <Loader2 size={14} className="lucide-spin" /> Analyzing Intelligence...
              </div>
            )}
          </div>

          <div style={{ background: '#f0f5ff', border: '1px solid #dbeafe', borderRadius: 8, padding: 16, marginBottom: 24, display: 'flex', gap: 12 }}>
            <Bot color="var(--primary-blue)" />
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1e40af', marginBottom: 4 }}>Automated Intelligence</h4>
              <p style={{ fontSize: 12, color: '#3b82f6', lineHeight: 1.5 }}>
                {caseId 
                  ? `SevaSetu AI extracted entities for Case ${caseId}. Please verify the data below.` 
                  : 'Awaiting input data to run extraction pipeline.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase' }}>Detected Location</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: 10 }} />
                <input type="text" value={editedLocation} onChange={(e) => setEditedLocation(e.target.value)} style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 14 }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase' }}>Primary Need</label>
              <div style={{ position: 'relative' }}>
                <BriefcaseMedical size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: 10 }} />
                <input type="text" value={editedNeed} onChange={(e) => setEditedNeed(e.target.value)} style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 14 }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase' }}>Est. People Count</label>
              <div style={{ position: 'relative' }}>
                <Users size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: 10 }} />
                <input type="number" value={editedCount} onChange={(e) => setEditedCount(e.target.value)} style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 14 }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase' }}>Assessed Urgency</label>
              <div style={{ position: 'relative' }}>
                <Activity size={16} color="var(--danger-red)" style={{ position: 'absolute', left: 12, top: 10 }} />
                <select value={editedUrgency} onChange={(e) => setEditedUrgency(e.target.value)} style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 14, appearance: 'none', color: 'var(--danger-red)', fontWeight: 500 }}>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase' }}>Transcribed Context</label>
            <textarea value={caseData?.ai_summary || caseData?.formatted_input || ''} readOnly style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 13, minHeight: 80, resize: 'none', color: 'var(--text-secondary)', background: '#f9fbfd' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--border-color)', paddingTop: 24 }}>
            <button className="btn btn-outline" onClick={handleDiscard}>Discard</button>
            <button className="btn btn-primary" onClick={handleValidate} disabled={!caseData || loading}>Confirm Ingestion <ArrowRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataIngestion;
