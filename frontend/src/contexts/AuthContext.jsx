import { createContext, useContext, useEffect, useState } from "react";
import { getUserFromLocalStorage, saveUserToLocalStorage, clearUserFromLocalStorage } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (userData) => {
    saveUserToLocalStorage(userData);
    setUser(userData);
  };

  const logout = () => {
    clearUserFromLocalStorage();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
