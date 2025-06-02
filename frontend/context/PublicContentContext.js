'use client';
import { createContext, useContext, useState } from 'react';

export const PublicContentContext = createContext(null);

export function PublicContentProvider({ children, initialData = {} }) {
  const [content, setContent] = useState(initialData);

  return (
    <PublicContentContext.Provider value={{ content, setContent }}>
      {children}
    </PublicContentContext.Provider>
  );
}

export function usePublicContent() {
  const context = useContext(PublicContentContext);
  if (!context) {
    throw new Error("usePublicContent must be used within PublicContentProvider");
  }
  return context;
}
