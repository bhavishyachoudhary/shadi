import React, { useEffect, useState } from 'react';
import AuthContext from './authContext';

function normalizeAuthenticatedUser(userData) {
  if (!userData?.id || !userData?.token) {
    throw new Error('Bandhan authentication requires a server-issued user ID and token.');
  }

  return {
    id: String(userData.id),
    name: userData.name || userData.fullName || '',
    email: userData.email || '',
    mobile: userData.mobile || '',
    gender: userData.gender || '',
    photo: userData.photo || null,
    isVerified: userData.isVerified
      ?? Boolean(userData.isEmailVerified || userData.isMobileVerified),
    isEmailVerified: Boolean(userData.isEmailVerified),
    isMobileVerified: Boolean(userData.isMobileVerified),
    isApproved: Boolean(userData.isApproved),
    profileComplete: Boolean(userData.profileComplete),
    loginMethod: userData.loginMethod || 'mobile',
    token: userData.token,
  };
}

function readStoredUser() {
  try {
    const saved = localStorage.getItem('bandhan_auth');
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    return parsed?.id && parsed?.token ? parsed : null;
  } catch {
    return null;
  }
}

function readOAuthCallbackUser() {
  const queryAuth = new URLSearchParams(window.location.search).get('auth');
  const hashAuth = new URLSearchParams(window.location.hash.replace(/^#/, '')).get('auth');
  const callbackPayload = hashAuth || queryAuth;
  if (!callbackPayload) return null;

  try {
    return normalizeAuthenticatedUser(JSON.parse(callbackPayload));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(() => readOAuthCallbackUser() || readStoredUser());
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (authUser?.id && authUser?.token) {
      localStorage.setItem('bandhan_auth', JSON.stringify(authUser));
    } else {
      localStorage.removeItem('bandhan_auth');
    }
  }, [authUser]);

  useEffect(() => {
    const hasOAuthPayload = new URLSearchParams(window.location.search).has('auth')
      || new URLSearchParams(window.location.hash.replace(/^#/, '')).has('auth');
    if (hasOAuthPayload) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const login = (userData) => {
    const user = normalizeAuthenticatedUser(userData);
    setAuthUser(user);
    return user;
  };

  const logout = () => {
    setAuthUser(null);
  };

  const updateAuthUser = (updates) => {
    setAuthUser(previous => previous ? { ...previous, ...updates, id: String(previous.id) } : null);
  };

  const isLoggedIn = Boolean(authUser?.id && authUser?.token);
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
