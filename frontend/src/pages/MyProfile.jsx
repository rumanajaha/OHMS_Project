// MyProfile.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDocuments } from '../context/DocumentContext';
import { FileText, Tags, Upload, Lock, Eye, EyeOff } from 'lucide-react';
import { changePasswordApi } from '../api/user';
import { useEmployees } from '../context/EmployeeContext';
import { updateEmployeeProfileApi } from '../api/employee';
import { logActivity } from '../utils/activity';

export const MyProfile = () => {
  const { user, updateUser } = useAuth();
  const { documents, uploadDocument, deleteDocument } = useDocuments();

  const { employees } = useEmployees();
  const currentEmployee = employees.find(e => String(e.id) === String(user?.employeeId));

  const [skills, setSkills] = useState(currentEmployee?.skills ? currentEmployee.skills.split(',').map(s=>s.trim()) : []);
  const [newSkill, setNewSkill] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(currentEmployee?.phone || '555-0199');
  const [isSaving, setIsSaving] = useState(false);
  const [avatar, setAvatar] = useState(currentEmployee?.profilePictureBase64 || null);
  const [resumeData, setResumeData] = useState({ name: currentEmployee?.resumeName || '', base64: currentEmployee?.resumeBase64 || '' });
  
  useEffect(() => {
    if (currentEmployee) {
      setSkills(currentEmployee.skills ? currentEmployee.skills.split(',').map(s=>s.trim()) : []);
      setPhone(currentEmployee.phone || '555-0199');
      setAvatar(currentEmployee.profilePictureBase64 || null);
      setResumeData({ name: currentEmployee.resumeName || '', base64: currentEmployee.resumeBase64 || '' });
    }
  }, [currentEmployee?.skills, currentEmployee?.phone, currentEmployee?.profilePictureBase64, currentEmployee?.resumeName, currentEmployee?.resumeBase64]);

  const avatarInputRef = useRef(null);

  // Password change state
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const fileInputRef = useRef(null);
  const myResumes = documents.filter((d) => d.name.toLowerCase().includes('resume'));

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
        await updateUser({ name });
        if (user?.employeeId) {
            await updateEmployeeProfileApi(user.employeeId, {
                skills: skills.join(', '),
                profilePictureBase64: avatar,
                resumeBase64: resumeData.base64,
                resumeName: resumeData.name
            });
            logActivity('Profile Updated', 'Your profile details were updated.', 'success');
            window.alert('Profile successfully updated!');
        }
    } catch(err) {
        window.alert('Failed to save profile: '+err.message);
    } finally {
        setIsSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
          setResumeData({ name: file.name, base64: reader.result });
      };
      reader.readAsDataURL(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAvatarUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
          setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePasswordApi({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
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
          <div style={{ position: 'relative', width: '120px', height: '120px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 600, overflow: 'hidden' }}>
            {avatar ? <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user?.name?.charAt(0) || 'U')}
          </div>
          <input type="file" ref={avatarInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleAvatarUpload} />
          <button className="btn btn-secondary text-sm" onClick={() => avatarInputRef.current?.click()}>Change Picture</button>
        </div>

        <div style={{ flex: 1 }}>
          <h2 className="h2">{user?.name}</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{user?.role} • {user?.email}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" disabled value={user?.email || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          <Lock size={20} className="text-primary" />
          <h3 className="h3">Change Password</h3>
        </div>

        {passwordError && (
          <div style={{ padding: '0.875rem 1rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem', border: '1px solid #fecaca' }}>
            {passwordError}
          </div>
        )}
        {passwordSuccess && (
          <div style={{ padding: '0.875rem 1rem', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem', border: '1px solid #bbf7d0' }}>
            {passwordSuccess}
          </div>
        )}

        <form onSubmit={handlePasswordChange}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showOld ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Re-enter password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={isChangingPassword}>
              {isChangingPassword ? 'Changing...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <Tags size={20} className="text-primary" />
            <h3 className="h3">Skills & Expertise</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {skills.map((skill) => (
              <span key={skill} className="badge badge-neutral" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', padding: '0.25rem 0.75rem', background: 'var(--bg-subtle)' }}>
                {skill}
                <button onClick={() => handleRemoveSkill(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>&times;</button>
              </span>
            ))}
          </div>
          <div className="form-group mb-0">
            <input type="text" className="form-input" placeholder="Type a skill and press Enter..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={handleAddSkill} />
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <FileText size={20} className="text-primary" />
            <h3 className="h3">Resume</h3>
          </div>
          <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', marginBottom: '1rem', background: 'var(--bg-main)' }}>
            <p className="text-muted text-sm mb-2">Upload a new resume to your profile</p>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleResumeUpload} />
            <button className="btn btn-secondary text-sm" onClick={() => fileInputRef.current?.click()}>
              <Upload size={14} style={{ marginRight: '0.5rem' }} />Select File
            </button>
          </div>
          {resumeData.name ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={16} className="text-muted" />
                  <span className="text-sm font-medium">{resumeData.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {resumeData.base64 && <a href={resumeData.base64} download={resumeData.name} className="btn btn-ghost text-sm" style={{ padding: '0.25rem 0.5rem', textDecoration:'none' }}>Download</a>}
                  <button className="btn btn-ghost text-danger text-sm" style={{ padding: '0.25rem 0.5rem' }} onClick={() => setResumeData({name:'', base64:''})}>Delete</button>
                </div>
              </div>
          ) : (
            <p className="text-muted text-sm text-center">No resumes uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};