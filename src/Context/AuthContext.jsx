import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(() => {
    return localStorage.getItem("refresh_token") || null;
  });

  const login = async (values) => {
    const data = await authService.login(values);
    console.log(data);
    
    setAccessToken(data.access);
    setRefreshToken(data.refresh);
    setUser(data);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("refresh_token");
  };


  const refresh = async () => {
    const res = await authService
      .refresh(refreshToken)
      .then((res) => {
        console.log(res);
        setAccessToken(res.access);
        setRefreshToken(res.refresh);
        setUser(res);
        localStorage.setItem("refresh_token", res.refresh);
      })
      .catch((err) => logout());
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
