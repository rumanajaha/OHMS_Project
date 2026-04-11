import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDocuments } from '../context/DocumentContext';
import { FileText, Tags, Upload } from 'lucide-react';

export const MyProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { documents, uploadDocument, deleteDocument } = useDocuments();
  
  const [skills, setSkills] = useState(['React', 'TypeScript', 'Node.js']);
  const [newSkill, setNewSkill] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('555-0199');
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const myResumes = documents.filter(d => d.name.toLowerCase().includes('resume'));

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await updateUser({ name });
    // phone & skills simulated save
    await new Promise(r => setTimeout(r, 500));
    setIsSaving(false);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await uploadDocument({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.type.split('/')[1] || 'Unknown'
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="h1">My Profile</h1>
        <p className="text-muted">Manage your personal information, skills, and settings.</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '120px', height: '120px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 600 }}>
            {user?.name.charAt(0) || 'U'}
          </div>
          <button className="btn btn-secondary text-sm">Change Picture</button>
        </div>
        
        <div style={{ flex: 1 }}>
          <h2 className="h2">{user?.name}</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{user?.role} • {user?.email}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" disabled value={user?.email || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            {isSaving && <span className="text-success text-sm">Profile updated successfully!</span>}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>
        {/* Skills Section */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <Tags size={20} className="text-primary" />
            <h3 className="h3">Skills & Expertise</h3>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {skills.map(skill => (
              <span key={skill} className="badge badge-neutral" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: 'var(--bg-subtle)' }}>
                {skill}
                <button 
                  onClick={() => handleRemoveSkill(skill)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginLeft: '0.25rem' }}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          
          <div className="form-group mb-0">
            <input 
              type="text" 
              className="form-input" 
              placeholder="Type a skill and press Enter..." 
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleAddSkill}
            />
          </div>
        </div>

        {/* Resume Section */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <FileText size={20} className="text-primary" />
            <h3 className="h3">Resume</h3>
          </div>
          
          <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', marginBottom: '1rem', background: 'var(--bg-main)' }}>
            <p className="text-muted text-sm mb-2">Upload a new resume to your profile</p>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleResumeUpload} />
            <button className="btn btn-secondary text-sm" onClick={() => fileInputRef.current?.click()}>
              <Upload size={14} style={{ marginRight: '0.5rem' }} /> Select File
            </button>
          </div>
          
          {myResumes.length > 0 ? (
            myResumes.map(resume => (
              <div key={resume.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={16} className="text-muted" />
                  <span className="text-sm font-medium">{resume.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-ghost text-sm" style={{ padding: '0.25rem 0.5rem' }}>Download</button>
                  <button className="btn btn-ghost text-danger text-sm" style={{ padding: '0.25rem 0.5rem' }} onClick={() => deleteDocument(resume.id)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted text-sm text-center">No resumes uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
