import React, { useRef } from 'react';
import { UploadCloud, FileText, Download, Trash2 } from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';

export const Documents = () => {
  const { documents, uploadDocument, deleteDocument } = useDocuments();
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await uploadDocument({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.type.split('/')[1] || 'Unknown',
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      await deleteDocument(id);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="h1">My Documents</h1>
          <p className="text-muted text-sm">Manage your personal files, resumes, and HR documents.</p>
        </div>
        <div>
          {/* Document uploading disabled */}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {documents.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No documents found.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Date Added</th>
                <th>File Size</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={18} />
                      </div>
                      <span style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.875rem' }}>{doc.name}</span>
                    </div>
                  </td>
                  <td className="text-muted text-sm">{doc.date}</td>
                  <td className="text-muted text-sm">{doc.size}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        className="btn btn-ghost"
                        style={{ padding: '0.375rem', color: 'var(--primary)' }}
                        title="Download"
                        onClick={() => alert('Download simulated')}
                      >
                        <Download size={16} />
                      </button>
                      <button
                        className="btn btn-ghost text-danger"
                        style={{ padding: '0.375rem' }}
                        title="Delete"
                        onClick={() => handleDelete(doc.id, doc.name)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};