import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from '@/services/auth-storage';
import { getProfileMobileApi, logoutMobileApi } from '@/services/api';

export interface User {
  id?: number | string;
  name: string;
  email: string;
  avatar_url?: string | null;
  token?: string;
  expires_at?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, expiresAt?: string | null) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore stored session on mount
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        const stored = await getAuthSession();
        if (stored && stored.token && isMounted) {
          const restoredUser: User = {
            ...stored.user,
            token: stored.token,
            expires_at: stored.expires_at,
          };
          setUser(restoredUser);
          setIsAuthenticated(true);

          // Verify with latest profile in background
          getProfileMobileApi(stored.token)
            .then((res) => {
              if (res.success && res.data?.user && isMounted) {
                const latestUser: User = {
                  ...restoredUser,
                  name: res.data.user.name,
                  email: res.data.user.email,
                  avatar_url: res.data.user.avatar_url,
                };
                setUser(latestUser);
                saveAuthSession({
                  user: latestUser,
                  token: stored.token,
                  expires_at: stored.expires_at,
                });
              } else if (!res.success && isMounted) {
                clearAuthSession();
                setUser(null);
                setIsAuthenticated(false);
              }
            })
            .catch(() => {});
        }
      } catch {
        // Fail-safe
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (userData: User, expiresAt?: string | null) => {
    const expires = expiresAt || userData.expires_at || null;
    const sessionUser: User = {
      ...userData,
      expires_at: expires,
    };
    setUser(sessionUser);
    setIsAuthenticated(true);

    if (userData.token) {
      await saveAuthSession({
        user: sessionUser,
        token: userData.token,
        expires_at: expires,
      });
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      if (updated.token) {
        saveAuthSession({
          user: updated,
          token: updated.token,
          expires_at: updated.expires_at,
        });
      }
      return updated;
    });
  };

  const logout = async () => {
    const currentToken = user?.token;
    setUser(null);
    setIsAuthenticated(false);
    await clearAuthSession();

    if (currentToken) {
      logoutMobileApi(currentToken).catch(() => {});
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        updateUser,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


