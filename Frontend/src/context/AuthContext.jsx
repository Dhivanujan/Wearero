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

const persistAuthState = (user, token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }

  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    if (user._id) {
      localStorage.setItem('userId', user._id);
    }
    if (user.role) {
      localStorage.setItem('role', user.role);
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
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    persistAuthState(null, null);
    localStorage.removeItem('guestId');
  };

  useEffect(() => {
    if (!token) {
      handleLogout();
      return;
    }

    let isMounted = true;

    const fetchProfile = async () => {
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
        if (isMounted) {
          setUser(profile);
          persistAuthState(profile, token);
        }
      } catch (error) {
        console.error('Auth profile fetch failed:', error.message);
        if (isMounted) {
          handleLogout();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = (authPayload) => {
    if (!authPayload?.token || !authPayload?.user) {
      return;
    }
    setToken(authPayload.token);
    setUser(authPayload.user);
    persistAuthState(authPayload.user, authPayload.token);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === 'admin',
      login,
      logout: handleLogout,
    }),
    [token, user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
