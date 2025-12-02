import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { API_BASE_URL } from '../lib/api';

const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

const normalizeRole = (role) => {
  if (!role) return null;
  return role.toString().trim().toLowerCase();
};

const formatUser = (rawUser) => {
  if (!rawUser) return null;
  const normalizedRole = normalizeRole(rawUser.role);
  return {
    ...rawUser,
    ...(normalizedRole ? { role: normalizedRole } : {}),
  };
};

const persistAuthState = (user, token) => {
  const normalizedUser = formatUser(user);
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }

  if (normalizedUser) {
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    if (normalizedUser._id) {
      localStorage.setItem('userId', normalizedUser._id);
    }
    if (normalizedUser.role) {
      localStorage.setItem('role', normalizedUser.role);
    }
  } else {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? formatUser(JSON.parse(stored)) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    persistAuthState(null, null);
    localStorage.removeItem('guestId');
  };

  const fetchProfile = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Unable to fetch profile');
      }

      const profile = await response.json();
      const normalizedProfile = formatUser(profile);
      setUser(normalizedProfile);
      persistAuthState(normalizedProfile, token);
    } catch (error) {
      console.error('Auth profile fetch failed:', error.message);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      handleLogout();
      return;
    }

    fetchProfile();
  }, [token]);

  const login = (authPayload) => {
    if (!authPayload?.token || !authPayload?.user) {
      return;
    }
    const normalizedUser = formatUser(authPayload.user);
    setToken(authPayload.token);
    setUser(normalizedUser);
    persistAuthState(normalizedUser, authPayload.token);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token),
      isAdmin: normalizeRole(user?.role) === 'admin',
      login,
      logout: handleLogout,
      refreshProfile: fetchProfile,
    }),
    [token, user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
