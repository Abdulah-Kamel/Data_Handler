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
  const [admin, setAdmin] = useState(localStorage.getItem("admin") || false);

  const login = async (values) => {
    const data = await authService.login(values);
    setAccessToken(data.access);
    setRefreshToken(data.refresh);
    setUser(data);
    data.role === "admin" ? setAdmin(true) : setAdmin(false);
    localStorage.setItem("admin", data.role === "admin");
    localStorage.setItem("refresh_token", data.refresh);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("admin");
  };

  const refresh = async () => {
    const res = await authService
      .refresh(refreshToken)
      .then((res) => {
        setAccessToken(res.access);
        setRefreshToken(res.refresh);
        let user = jwtDecode(res.access);
        setUser(user);
        localStorage.setItem("refresh_token", res.refresh);
      })
      .catch((err) => logout());
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
