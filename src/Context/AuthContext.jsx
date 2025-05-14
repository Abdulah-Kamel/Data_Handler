import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userData = Cookies.get("user");
    return userData ? JSON.parse(userData) : undefined;
  });

  const [accessToken, setAccessToken] = useState(() => {
    return Cookies.get("access_token") || null;
  });

  const [refreshToken, setRefreshToken] = useState(() => {
    return Cookies.get("refresh_token") || null;
  });

  const login = async (values) => {
    const data = await authService.login(values);
    // Set cookies with secure options
    Cookies.set("access_token", data.access, {
      secure: true,
      sameSite: "strict",
      expires: 1.5, // 1.5 day
    });
    Cookies.set("refresh_token", data.refresh, {
      secure: true,
      sameSite: "strict",
      expires: 3, // 7 days
    });
    Cookies.set("user", JSON.stringify(data), {
      secure: true,
      sameSite: "strict",
      expires: 3,
    });

    setAccessToken(data.access);
    setRefreshToken(data.refresh);
    setUser(data);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user");
  };

  const refresh = async () => {
    try {
      const res = await authService.refresh(refreshToken);
      Cookies.set("access_token", res.access, {
        secure: true,
        sameSite: "strict",
        expires: 1.5, // 1.5 day
      });
      setAccessToken(res.access);
      setUser(res);
      Cookies.set("user", JSON.stringify(res), {
        secure: true,
        sameSite: "strict",
        expires: 3,
      });
    } catch (err) {
      logout();
    }
  };

  useEffect(() => {
    const checkTokenExpiryAndRefresh = () => {
      if (!accessToken) return;

      try {
        const decoded = jwtDecode(accessToken);
        const expiresAt = decoded.exp * 1000;
        const now = Date.now();

        // Refresh 1 minute before token expires
        const shouldRefresh = expiresAt - now < 60 * 1000;

        if (shouldRefresh) {
          refresh();
        }
      } catch (err) {
        logout();
      }
    };

    // Check immediately on mount
    checkTokenExpiryAndRefresh();

    // Set interval to check every 1 minute
    const interval = setInterval(checkTokenExpiryAndRefresh, 60 * 1000); // every 60 sec

    return () => clearInterval(interval); // Cleanup
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
