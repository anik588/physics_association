'use client';
import { createContext, useContext, useState } from 'react';

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const authRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/activity/`, {
        credentials: 'include',
      });

      if (!authRes.ok) {
        setUserData(null);
        setIsLoggedIn(false);
        return;
      }

      const user = await authRes.json();

      const uploadsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/api/my-uploads/`, {
        credentials: 'include',
      });

      const uploads = uploadsRes.ok ? await uploadsRes.json() : {};

      setUserData({ ...user, uploads });
      setIsLoggedIn(true);
    } catch (err) {
      setUserData(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout/`, {
      method: 'POST',
      credentials: 'include',
    });
    setUserData(null);
    setIsLoggedIn(false);
  };

  return (
    <DataContext.Provider value={{
      userData,
      isLoggedIn,
      fetchUserData,
      logoutUser,
      loading,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export function useDataContext() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within DataProvider");
  }
  return context;
}
