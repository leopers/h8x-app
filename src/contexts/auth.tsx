import React, { createContext, useState, useEffect, useContext } from "react";

interface AuthContextData {
  signed: boolean;
  user: object | null;
  Logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<object | null>(null);

  useEffect(() => {
    const storagedUser = sessionStorage.getItem("@App:user");
    const storagedToken = sessionStorage.getItem("@App:token");
  }, []);

  function Logout() {
    setUser(null);
  }

  return <AuthContext.Provider value={{ signed: Boolean(user), user, Logout }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
