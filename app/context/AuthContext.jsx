'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorageState from '../hooks/useLocalStorageState';
import { useTestingModeContext } from './TestingModeContext';
import {
  registerUser,
  loginUser,
  verifyOtp as verifyOtpRequest,
  resendOtp as resendOtpRequest,
  forgotPassword as forgotPasswordRequest,
  resetPassword as resetPasswordRequest,
  googleAuth as googleAuthRequest,
} from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorageState('Fitoo_app_auth', null);
  const { testingMode } = useTestingModeContext();

  const login = useCallback(
    async ({ email, password }) => {
      let nextUser;

      if (testingMode) {
        nextUser = { name: email.split('@')[0], email, token: 'testing-mode-token' };
      } else {
        const { user: apiUser, token } = await loginUser({ email, password });
        nextUser = { ...apiUser, token };
      }

      setUser(nextUser);
      return nextUser;
    },
    [testingMode, setUser]
  );

  const register = useCallback(
    async ({ name, email, password, phone, referralCode }) => {
      if (testingMode) {
        return { message: 'Registration successful.' };
      }
      return registerUser({ name, email, password, phone, referralCode });
    },
    [testingMode]
  );

  const verifyOtp = useCallback(
    async ({ email, otp }) => {
      if (testingMode) {
        const nextUser = { name: email.split('@')[0], email, token: 'testing-mode-token' };
        setUser(nextUser);
        return nextUser;
      }
      const { user: apiUser, token } = await verifyOtpRequest({ email, otp });
      const nextUser = { ...apiUser, token };
      setUser(nextUser);
      return nextUser;
    },
    [testingMode, setUser]
  );

  const resendOtp = useCallback(
    async ({ email }) => {
      if (testingMode) {
        return { message: 'Verification code resent' };
      }
      return resendOtpRequest({ email });
    },
    [testingMode]
  );

  const forgotPassword = useCallback(
    async ({ email }) => {
      if (testingMode) {
        return { message: 'If an account with that email exists, a reset code has been sent.' };
      }
      return forgotPasswordRequest({ email });
    },
    [testingMode]
  );

  const resetPassword = useCallback(
    async ({ email, otp, newPassword }) => {
      if (testingMode) {
        return { message: 'Password reset successfully. You can now log in.' };
      }
      return resetPasswordRequest({ email, otp, newPassword });
    },
    [testingMode]
  );

  const loginWithGoogle = useCallback(
    async ({ credential, referralCode }) => {
      if (testingMode) {
        const nextUser = { name: 'Google User', email: 'google-user@example.com', token: 'testing-mode-token' };
        setUser(nextUser);
        return nextUser;
      }
      const { user: apiUser, token } = await googleAuthRequest({ credential, referralCode });
      const nextUser = { ...apiUser, token };
      setUser(nextUser);
      return nextUser;
    },
    [testingMode, setUser]
  );

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      register,
      verifyOtp,
      resendOtp,
      forgotPassword,
      resetPassword,
      loginWithGoogle,
      logout,
    }),
    [user, login, register, verifyOtp, resendOtp, forgotPassword, resetPassword, loginWithGoogle, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return ctx;
}
