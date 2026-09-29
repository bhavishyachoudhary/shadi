import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bandhan_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem('bandhan_auth', JSON.stringify(authUser));
    } else {
      localStorage.removeItem('bandhan_auth');
    }
  }, [authUser]);

  const login = (userData) => {
    const user = {
      id: userData.id || `user_${Date.now()}`,
      name: userData.name || userData.fullName || '',
      email: userData.email || '',
      mobile: userData.mobile || '',
      gender: userData.gender || 'Bride',
      photo: userData.photo || null,
      isVerified: userData.isVerified ?? true,
      isApproved: userData.isApproved ?? true,
      profileComplete: userData.profileComplete ?? true,
      loginMethod: userData.loginMethod || 'email',
      token: userData.token || `mock_jwt_${Date.now()}`,
    };
    setAuthUser(user);
    return user;
  };

  const logout = () => {
    setAuthUser(null);
  };

  const updateAuthUser = (updates) => {
    setAuthUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const isLoggedIn = !!authUser;
  const feedGender = authUser?.gender === 'Groom' ? 'Bride' : 'Groom';

  return (
    <AuthContext.Provider value={{
      authUser,
      isLoggedIn,
      feedGender,
      authLoading,
      setAuthLoading,
      login,
      logout,
      updateAuthUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
