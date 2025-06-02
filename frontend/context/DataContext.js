'use client';
import { createContext, useContext, useState, useEffect } from 'react';

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch User Data
  const fetchUserData = async () => {
    setLoading(true);  // Start loading

    try {
      // Fetch activity data (to check if the user is authenticated)
      const authRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/activity/`, {
        credentials: 'include',  // Send cookies with the request
      });

      // If the response is not OK, log out the user
      if (!authRes.ok) {
        setUserData(null);
        setIsLoggedIn(false);
        return;
      }

      // Parse the response to get the user data
      const user = await authRes.json();

      // Fetch the user's uploads
      const uploadsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/api/my-uploads/`, {
        credentials: 'include',
      });

      // Parse the uploads response
      const uploads = uploadsRes.ok ? await uploadsRes.json() : {};

      // Set the user data and login state
      setUserData({ ...user, uploads });
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setUserData(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);  // Stop loading regardless of the outcome
    }
  };

  // Logout user function
  const logoutUser = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout/`, {
        method: 'POST',
        credentials: 'include',  // Send cookies with the request
      });
      setUserData(null);
      setIsLoggedIn(false);
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  // Fetch user data on initial mount only
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();  // Fetch user data if logged in
    } else {
      setUserData(null);  // Clear user data if logged out
    }
  }, []);  // Empty dependency array ensures it runs only once on mount

  // Provide the context value
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
