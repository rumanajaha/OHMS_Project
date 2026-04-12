import React, { createContext, useContext, useState, useEffect } from 'react';

const DocumentContext = createContext(undefined);

const initialDocuments = [
  { id: 'd1', name: 'Employee_Handbook_2026.pdf', size: '2.4 MB', date: 'Mar 15, 2026', type: 'PDF' },
  { id: 'd2', name: 'Q1_Performance_Review.docx', size: '845 KB', date: 'Apr 02, 2026', type: 'Word' },
];

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mock_documents');
    if (saved) {
      try {
        setDocuments(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('mock_documents');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mock_documents', JSON.stringify(documents));
  }, [documents]);

  const uploadDocument = async (doc) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    const newDoc = {
      ...doc,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setIsLoading(false);
  };

  const deleteDocument = async (id) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    setIsLoading(false);
  };

  return (
    <DocumentContext.Provider value={{ documents, isLoading, uploadDocument, deleteDocument }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};