import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const localUserData = localStorage.getItem("userData");
    if (localUserData) setUserData(JSON.parse(localUserData));
    setIsLoading(false);
  }, []);

  const login = (user) => {
    setUserData(user);
    localStorage.setItem("userData", JSON.stringify(user));
  };

  const logout = () => {
    const updatedUserData = { ...userData, isLoggedIn: false };
    setUserData(updatedUserData);
    localStorage.removeItem("userData");
  };

  const values = {
    data: userData,
    setUserData,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
